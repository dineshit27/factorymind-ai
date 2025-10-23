import { supabase } from '@/integrations/supabase/client';

export interface BillingRecord {
  id: string;
  period_start: string;
  period_end: string;
  water_usage: number;
  electricity_usage: number;
  water_cost: number;
  electricity_cost: number;
  total_amount: number;
  status: string;
  due_date: string;
  paid_at: string | null;
}

export async function fetchCurrentBill(): Promise<BillingRecord | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return null;
  const { data, error } = await supabase.from('billing_records')
    .select('*')
    .eq('user_id', uid)
    .order('period_start', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) { console.warn('fetchCurrentBill error', error); return null; }
  return data as any as BillingRecord | null;
}

export async function fetchBillingHistory(limit = 6): Promise<BillingRecord[]> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return [];
  const { data, error } = await supabase.from('billing_records')
    .select('*')
    .eq('user_id', uid)
    .order('period_start', { ascending: false })
    .limit(limit);
  if (error) { console.warn('fetchBillingHistory error', error); return []; }
  return (data || []) as any as BillingRecord[];
}
