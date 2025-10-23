import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Droplet, Lightbulb, RefreshCw, Plus, Pencil, Save, X, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchDevices, toggleDevice, addDevice, ConnectedDevice } from '@/services/connectedDevices';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export const DevicesPanel: React.FC = () => {
  const { translate } = useLanguage();
  const { user } = useSupabaseAuth();
  const [devices, setDevices] = useState<(ConnectedDevice & { room_name?: string | null })[]>([]);
  const [roomsMap, setRoomsMap] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editType, setEditType] = useState<'water' | 'electricity' | 'combo'>('water');
  const [updating, setUpdating] = useState<boolean>(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setDevices([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await fetchDevices();
    if (error) setError(error);
    else {
      // fetch rooms for mapping (casting to any because generated type may not include room_id yet)
      const roomIds = Array.from(new Set((data||[]).map((d:any) => d.room_id).filter(Boolean))) as string[];
      let map: Record<string,string> = {};
      if (roomIds.length) {
        const { data: rooms } = await (supabase as any).from('rooms').select('id,name').in('id', roomIds);
        rooms?.forEach((r: any) => { map[r.id] = r.name; });
        setRoomsMap(map);
      }
      setDevices((data||[]).map((d:any) => ({...d, room_name: d.room_id ? map[d.room_id] : null })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (device: ConnectedDevice & { room_name?: string | null }) => {
    // Optimistic update
    setDevices(prev => prev.map(d => d.id === device.id ? { ...d, is_active: !device.is_active } : d));
    const { error, data } = await toggleDevice(device.id, !!device.is_active);
    if (error || !data) {
      // Revert
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, is_active: device.is_active } : d));
      toast({ title: translate('error'), description: error || 'Failed to update device', variant: 'destructive' });
    } else {
      toast({
        title: data.is_active ? translate('device_activated') : translate('device_deactivated'),
        description: `${data.device_name} ${translate('is_now')} ${data.is_active ? translate('on') : translate('off')}`,
      });
    }
  };

  const handleAdd = async () => {
    if (!user) {
      toast({ title: translate('error'), description: 'Sign in to add devices', variant: 'destructive' });
      return;
    }
    setAdding(true);
    const baseName = `device_${devices.length + 1}`;
    // Our minimal schema fields: user_id (server side), room_id (optional), device_name, device_type, is_active
    // We rotate through water -> electricity -> combo for variety
    const cycle = devices.length % 3;
    const device_type: 'water' | 'electricity' | 'combo' = cycle === 0 ? 'water' : cycle === 1 ? 'electricity' : 'combo';
    const payload = {
      device_name: baseName,
      device_type,
      // room_id intentionally omitted for now (user can edit later when UI exists)
      is_active: true
    } as any; // cast to any until types are regenerated
    const { data, error } = await addDevice(payload);
    if (error || !data) {
      toast({ title: translate('error'), description: error || 'Failed to add device', variant: 'destructive' });
    } else {
      setDevices(prev => [...prev, { ...data, room_name: null }]);
      toast({ title: translate('success'), description: `Added ${data.device_name}` });
    }
    setAdding(false);
  };

  const startEdit = (device: (ConnectedDevice & { room_name?: string | null })) => {
    setEditingId(device.id);
    setEditName(device.device_name);
    setEditType(device.device_type as any);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditType('water');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setUpdating(true);
    try {
      const { updateDevice } = await import('@/services/connectedDevices');
      const original = devices.find(d => d.id === editingId);
      setDevices(prev => prev.map(d => d.id === editingId ? { ...d, device_name: editName, device_type: editType } : d));
      const { error, data } = await updateDevice(editingId, { device_name: editName, device_type: editType } as any);
      if (error || !data) {
        // revert
        if (original) setDevices(prev => prev.map(d => d.id === editingId ? original : d));
        toast({ title: translate('error'), description: error || 'Failed to update device', variant: 'destructive' });
      } else {
        toast({ title: translate('success'), description: translate('device_updated') || 'Device updated' });
      }
    } finally {
      setUpdating(false);
      cancelEdit();
    }
  };

  const removeDeviceHandler = async (id: string) => {
    setRemovingId(id);
    const { removeDevice } = await import('@/services/connectedDevices');
    const original = devices;
    setDevices(prev => prev.filter(d => d.id !== id));
    const { error } = await removeDevice(id);
    if (error) {
      // revert
      setDevices(original);
      toast({ title: translate('error'), description: error, variant: 'destructive' });
    } else {
      toast({ title: translate('success'), description: translate('device_removed') || 'Device removed' });
    }
    setRemovingId(null);
  };

  if (!user) {
    return <div className="text-sm text-muted-foreground">{translate('please_sign_in_to_view_devices')}</div>;
  }

  if (loading) {
    return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <CardTitle className="h-5 w-32 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-20 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  if (error) {
    return <div className="space-y-4">
      <div className="text-sm text-red-600">{error}</div>
      <button onClick={load} className="inline-flex items-center gap-1 text-sm underline">
        <RefreshCw className="h-4 w-4" /> {translate('retry')}
      </button>
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          disabled={adding}
          className="inline-flex items-center gap-2 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {adding ? translate('adding') : translate('add_device')}
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => {
          const isEditing = editingId === device.id;
          return (
            <Card key={device.id} className="transition-all duration-300 hover:shadow-md group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {device.device_type === 'water' && !isEditing && (
                    <Droplet className="h-5 w-5 text-water-dark group-hover:scale-110 transition-transform" />
                  )}
                  {device.device_type === 'electricity' && !isEditing && (
                    <Lightbulb className="h-5 w-5 text-energy-dark group-hover:scale-110 transition-transform" />
                  )}
                  {device.device_type === 'combo' && !isEditing && (
                    <>
                      <Droplet className="h-5 w-5 text-water-dark group-hover:scale-110 transition-transform" />
                      <Lightbulb className="h-5 w-5 text-energy-dark group-hover:scale-110 transition-transform" />
                    </>
                  )}
                  {!isEditing && device.device_name}
                  {isEditing && (
                    <input
                      className="border rounded px-2 py-1 text-sm w-full"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={translate('device_name') || 'Device name'}
                    />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                    >
                      <option value="water">Water</option>
                      <option value="electricity">Electricity</option>
                      <option value="combo">Combo</option>
                    </select>
                  </div>
                )}
                {!isEditing && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`device-${device.id}`}>{device.is_active ? translate('on') : translate('off')}</Label>
                    <Switch
                      id={`device-${device.id}`}
                      checked={!!device.is_active}
                      onCheckedChange={() => handleToggle(device)}
                    />
                  </div>
                )}
                {device.room_name && <div className="mt-1 text-xs text-muted-foreground">{device.room_name}</div>}
                <div className="flex items-center gap-2 pt-1">
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(device)}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-muted"
                    >
                      <Pencil className="h-3 w-3"/> Edit
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={updating || !editName.trim()}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary text-primary-foreground disabled:opacity-60"
                      >
                        <Save className="h-3 w-3"/> {updating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={updating}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-muted"
                      >
                        <X className="h-3 w-3"/> Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => removeDeviceHandler(device.id)}
                    disabled={removingId === device.id}
                    className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-red-50 text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3"/> {removingId === device.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {devices.length === 0 && (
          <div className="text-sm text-muted-foreground col-span-full">{translate('no_devices_found')}</div>
        )}
      </div>
    </div>
  );
};

export default DevicesPanel;