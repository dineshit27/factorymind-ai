import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import type { Tables } from '@/integrations/supabase/types';

type WaterUsage = Tables<'water_usage'>;

export const useWaterUsage = () => {
  const { user } = useSupabaseAuth();
  const [waterUsage, setWaterUsage] = useState<WaterUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaterUsage = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('water_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setWaterUsage(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water usage');
    } finally {
      setLoading(false);
    }
  };

  const addWaterUsage = async (usage: Omit<WaterUsage, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('water_usage')
        .insert([{ ...usage, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setWaterUsage(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add water usage');
      throw err;
    }
  };

  const updateWaterUsage = async (id: string, updates: Partial<WaterUsage>) => {
    try {
      const { data, error } = await supabase
        .from('water_usage')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setWaterUsage(prev => 
        prev.map(usage => usage.id === id ? data : usage)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update water usage');
      throw err;
    }
  };

  const deleteWaterUsage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('water_usage')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWaterUsage(prev => prev.filter(usage => usage.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete water usage');
      throw err;
    }
  };

  useEffect(() => {
    fetchWaterUsage();
  }, [user]);

  return {
    waterUsage,
    loading,
    error,
    addWaterUsage,
    updateWaterUsage,
    deleteWaterUsage,
    refetch: fetchWaterUsage,
  };
};
