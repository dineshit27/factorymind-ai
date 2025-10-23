import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Billing = Tables<'billing'>;
type WaterRate = Tables<'water_rates'>;

export const useBilling = () => {
  const { user } = useSupabaseAuth();
  const [billing, setBilling] = useState<Billing[]>([]);
  const [waterRates, setWaterRates] = useState<WaterRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBilling = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing')
        .select('*')
        .eq('user_id', user.id)
        .order('billing_period_start', { ascending: false });

      if (error) throw error;
      setBilling(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch billing');
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterRates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('water_rates')
        .select('*')
        .eq('user_id', user.id)
        .order('effective_from', { ascending: false });

      if (error) throw error;
      setWaterRates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water rates');
    }
  };

  const addWaterRate = async (rate: Omit<WaterRate, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('water_rates')
        .insert([{ ...rate, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setWaterRates(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add water rate');
      throw err;
    }
  };

  const updateWaterRate = async (id: string, updates: Partial<WaterRate>) => {
    try {
      const { data, error } = await supabase
        .from('water_rates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setWaterRates(prev => 
        prev.map(rate => rate.id === id ? data : rate)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update water rate');
      throw err;
    }
  };

  const deleteWaterRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('water_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWaterRates(prev => prev.filter(rate => rate.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete water rate');
      throw err;
    }
  };

  const generateMonthlyBilling = async (billingMonth?: Date) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('generate_monthly_billing', {
        p_user_id: user.id,
        p_billing_month: billingMonth?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      });

      if (error) throw error;
      
      // Refresh billing data
      await fetchBilling();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate billing');
      throw err;
    }
  };

  const calculateBillingAmount = async (usageAmount: number, billingDate?: Date) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('calculate_billing_amount', {
        p_user_id: user.id,
        p_usage_amount: usageAmount,
        p_billing_date: billingDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate billing amount');
      throw err;
    }
  };

  const markBillAsPaid = async (billingId: string) => {
    try {
      const { data, error } = await supabase
        .from('billing')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', billingId)
        .select()
        .single();

      if (error) throw error;
      
      setBilling(prev => 
        prev.map(bill => bill.id === billingId ? data : bill)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark bill as paid');
      throw err;
    }
  };

  useEffect(() => {
    fetchBilling();
    fetchWaterRates();
  }, [user]);

  return {
    billing,
    waterRates,
    loading,
    error,
    addWaterRate,
    updateWaterRate,
    deleteWaterRate,
    generateMonthlyBilling,
    calculateBillingAmount,
    markBillAsPaid,
    refetch: fetchBilling,
  };
};
