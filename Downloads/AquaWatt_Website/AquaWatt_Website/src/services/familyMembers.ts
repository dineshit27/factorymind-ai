import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type FamilyMember = Tables<'family_members'>;
export type NewFamilyMember = TablesInsert<'family_members'>;
export type UpdateFamilyMember = TablesUpdate<'family_members'>;

interface Result<T> { data: T | null; error: string | null }

const TABLE_NAME = 'family_members';
const db = supabase as any;

export async function listFamilyMembers(): Promise<Result<FamilyMember[]>> {
  const { data, error } = await db.from(TABLE_NAME).select('*').order('invited_at', { ascending: true });
  return { data: data || null, error: error?.message || null };
}

/**
 * Invite a family member via magic-link (client-only approach, no service role required).
 * 1. Sends a magic link to the invitee's email.
 * 2. Inserts/updates a row in family_members as pending.
 * 3. If a row already exists, just updates access_level & keeps (or resets) status to pending.
 */
export async function inviteFamilyMember(member_email: string, access_level: string = 'view'): Promise<Result<FamilyMember>> {
  const { data: authData } = await supabase.auth.getUser();
  const owner_user_id = authData?.user?.id;
  if (!owner_user_id) return { data: null, error: 'Not authenticated' };

  // Step 1: send magic link (ignore error if rate limited, still proceed with DB row)
  try {
    await supabase.auth.signInWithOtp({
      email: member_email,
      options: { emailRedirectTo: `${window.location.origin}/profile` }
    });
  } catch (e: any) {
    // We don't abort; just log. Common errors: rate limit, invalid email format.
    console.warn('Magic link send error:', e?.message || e);
  }

  // Step 2: upsert-like logic without unique constraint.
  const { data: existing, error: existingErr } = await db
    .from(TABLE_NAME)
    .select('*')
    .eq('owner_user_id', owner_user_id)
    .eq('member_email', member_email)
    .maybeSingle();
  if (existingErr) {
    console.warn('Lookup existing family member failed:', existingErr.message);
  }

  let row: FamilyMember | null = null;
  if (existing) {
    // Update access_level & reset status to pending if revoked
    const { data: updated, error: uErr } = await db.from(TABLE_NAME)
      .update({ access_level, status: existing.status === 'revoked' ? 'pending' : existing.status })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (uErr) return { data: null, error: uErr.message };
    row = updated as FamilyMember;
  } else {
    const { data: inserted, error: iErr } = await db.from(TABLE_NAME)
      .insert({ member_email, access_level, owner_user_id } as any)
      .select('*')
      .single();
    if (iErr) return { data: null, error: iErr.message };
    row = inserted as FamilyMember;
  }
  return { data: row, error: null };
}

export async function updateFamilyMember(id: string, updates: Partial<Omit<UpdateFamilyMember, 'id' | 'owner_user_id'>>): Promise<Result<FamilyMember>> {
  const { data, error } = await db.from(TABLE_NAME).update(updates as any).eq('id', id).select('*').single();
  return { data: data || null, error: error?.message || null };
}

export async function removeFamilyMember(id: string): Promise<Result<boolean>> {
  const { error } = await db.from(TABLE_NAME).delete().eq('id', id);
  return { data: !error, error: error?.message || null };
}

/**
 * Activates any pending invitations for the currently authenticated user (invitee).
 * Should be called after login (e.g., magic link flow) so their membership becomes active.
 */
export async function activatePendingFamilyMembership(): Promise<{ updated: number; error: string | null }> {
  const { data: authData } = await supabase.auth.getUser();
  const email = authData?.user?.email;
  if (!email) return { updated: 0, error: 'Not authenticated' };
  const { data, error } = await db.from(TABLE_NAME)
    .update({ status: 'active', joined_at: new Date().toISOString() } as any)
    .eq('member_email', email)
    .eq('status', 'pending')
    .select('id');
  if (error) return { updated: 0, error: error.message };
  return { updated: Array.isArray(data) ? data.length : 0, error: null };
}
