import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ConnectedDevice = Tables<'connected_devices'>;
export type NewConnectedDevice = TablesInsert<'connected_devices'>;
export type UpdateConnectedDevice = TablesUpdate<'connected_devices'>;

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

const TABLE_NAME = 'connected_devices';
const db = supabase as any; // Relax typing to avoid current generated type incompatibilities

export async function fetchDevices(): Promise<ServiceResult<ConnectedDevice[]>> {
  const { data, error } = await db.from(TABLE_NAME).select('*').order('created_at', { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: (data as ConnectedDevice[]) ?? [], error: null };
}

export async function addDevice(payload: Omit<NewConnectedDevice, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResult<ConnectedDevice>> {
  const { data: authData } = await supabase.auth.getUser();
  const user_id = authData?.user?.id;
  if (!user_id) return { data: null, error: 'Not authenticated' };
  const insertPayload = { ...payload, user_id } as NewConnectedDevice;
  const { data, error } = await db.from(TABLE_NAME).insert(insertPayload as any).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: data as ConnectedDevice, error: null };
}

export async function toggleDevice(id: string, current: boolean): Promise<ServiceResult<ConnectedDevice>> {
  const { data, error } = await db.from(TABLE_NAME).update({ is_active: !current } as any).eq('id', id).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: data as ConnectedDevice, error: null };
}

export async function updateDevice(id: string, updates: Partial<Omit<UpdateConnectedDevice, 'id' | 'user_id'>>): Promise<ServiceResult<ConnectedDevice>> {
  const { data, error } = await db.from(TABLE_NAME).update(updates as any).eq('id', id).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: data as ConnectedDevice, error: null };
}

export async function removeDevice(id: string): Promise<ServiceResult<boolean>> {
  const { error } = await db.from(TABLE_NAME).delete().eq('id', id);
  if (error) return { data: null, error: error.message };
  return { data: true, error: null };
}
