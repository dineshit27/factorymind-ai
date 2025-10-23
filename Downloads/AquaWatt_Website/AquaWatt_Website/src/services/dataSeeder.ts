import { supabase } from '@/integrations/supabase/client';

// Minimal seeder aligned with new schema (optional runtime helper)
export async function seedMinimalUserData() {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return { error: 'Not authenticated' };

  // Idempotent: create rooms if none
  const { data: existingRooms } = await supabase.from('rooms').select('id').eq('user_id', uid).limit(1);
  if (!existingRooms || existingRooms.length === 0) {
    await (supabase as any).from('rooms').insert([
      { user_id: uid, name: 'Kitchen', room_type: 'kitchen' },
      { user_id: uid, name: 'Bedroom', room_type: 'bedroom' },
      { user_id: uid, name: 'Hall', room_type: 'hall' },
      { user_id: uid, name: 'Bathroom', room_type: 'bathroom' }
    ]);
  }
  const { data: rooms } = await supabase.from('rooms').select('*').eq('user_id', uid);
  const kitchen = (rooms as any[])?.find((r:any)=>r.name==='Kitchen');

  const { data: existingDevices } = await supabase.from('connected_devices').select('id').eq('user_id', uid).limit(1);
  if (!existingDevices || existingDevices.length===0) {
    await (supabase as any).from('connected_devices').insert([
      { user_id: uid, room_id: kitchen?.id, device_name: 'Kitchen Faucet Sensor', device_type: 'water' },
      { user_id: uid, room_id: kitchen?.id, device_name: 'Kitchen Power Meter', device_type: 'electricity' }
    ]);
  }

  const { data: existingUsage } = await supabase.from('usage_readings').select('id').eq('user_id', uid).limit(1);
  if (!existingUsage || existingUsage.length===0) {
    const rows:any[] = [];
    for (let i=0;i<14;i++) {
      rows.push({ user_id: uid, reading_type: 'water', amount: (20+Math.random()*40).toFixed(2), cost: (5+Math.random()*5).toFixed(2), recorded_at: new Date(Date.now()-i*86400000).toISOString() });
      rows.push({ user_id: uid, reading_type: 'electricity', amount: (10+Math.random()*20).toFixed(2), cost: (4+Math.random()*4).toFixed(2), recorded_at: new Date(Date.now()-i*86400000).toISOString() });
    }
    await (supabase as any).from('usage_readings').insert(rows);
  }

  const { data: existingBills } = await supabase.from('billing_records').select('id').eq('user_id', uid).limit(1);
  if (!existingBills || existingBills.length===0) {
    for (let m=0;m<3;m++) {
      const start = new Date(); start.setMonth(start.getMonth()-m); start.setDate(1);
      const end = new Date(start); end.setMonth(end.getMonth()+1); end.setDate(0);
      await (supabase as any).from('billing_records').insert({
        user_id: uid,
        period_start: start.toISOString().substring(0,10),
        period_end: end.toISOString().substring(0,10),
        water_usage: (500+Math.random()*200).toFixed(2),
        electricity_usage: (180+Math.random()*100).toFixed(2),
        water_cost: (1400+Math.random()*300).toFixed(2),
        electricity_cost: (2000+Math.random()*500).toFixed(2),
        total_amount: (3500+Math.random()*700).toFixed(2),
        status: m===0 ? 'pending' : 'paid',
        due_date: end.toISOString().substring(0,10)
      });
    }
  }

  return { success: true } as const;
}
