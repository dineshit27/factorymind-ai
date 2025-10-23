import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Device = Tables<'devices'>;

export const useDevices = () => {
  const { user } = useSupabaseAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async (device: Omit<Device, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([{ ...device, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setDevices(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device');
      throw err;
    }
  };

  const updateDevice = async (id: string, updates: Partial<Device>) => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDevices(prev => 
        prev.map(device => device.id === id ? data : device)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
      throw err;
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDevices(prev => prev.filter(device => device.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device');
      throw err;
    }
  };

  const toggleDeviceStatus = async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    return updateDevice(id, { is_active: !device.is_active });
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  return {
    devices,
    loading,
    error,
    addDevice,
    updateDevice,
    deleteDevice,
    toggleDeviceStatus,
    refetch: fetchDevices,
  };
};
