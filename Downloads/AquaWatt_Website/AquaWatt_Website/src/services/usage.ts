import { supabase } from '@/integrations/supabase/client';

export interface WeeklyPoint { label: string; water: number; electricity: number }
export interface DistributionSlice { room: string; total_water: number; total_electricity: number }
export interface MonthlyTrendPoint { month: string; water: number; electricity: number }

// Fetch last 7 days aggregated via RPC function
export async function fetchWeeklyTrend(): Promise<WeeklyPoint[]> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  
  // Always return fallback data for demo purposes
  // In a real app, you'd try to fetch from database first
  console.log('Generating fallback weekly data for user:', uid);
  return getFallbackWeeklyData();
  
  /* 
  // Uncomment this section when you have the RPC function set up in Supabase
  if (!uid) return getFallbackWeeklyData();
  
  try {
    const { data, error } = await (supabase as any).rpc('get_weekly_usage', { p_user: uid });
    
    if (error || !data || data.length === 0) {
      console.warn('weekly usage fallback', error);
      return getFallbackWeeklyData();
    }
    
    return (data || []).map((d: any) => ({ 
      label: d.label, 
      water: Number(d.water) || 0, 
      electricity: Number(d.electricity) || 0 
    }));
  } catch (e) {
    console.warn('weekly usage error', e);
    return getFallbackWeeklyData();
  }
  */
}

// Fallback weekly data for demonstration - more realistic patterns
function getFallbackWeeklyData(): WeeklyPoint[] {
  const today = new Date();
  const days = [];
  
  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  
  // Create realistic usage patterns with weekly cycles
  const baseWater = [45, 38, 42, 50, 48, 65, 58]; // Higher on weekends
  const baseElectricity = [12, 10, 11, 13, 14, 18, 16]; // Higher on weekends
  
  return days.map((day, index) => ({
    label: day,
    water: Math.round((baseWater[index] + (Math.random() * 10 - 5)) * 100) / 100, // ±5L variance
    electricity: Math.round((baseElectricity[index] + (Math.random() * 4 - 2)) * 100) / 100, // ±2kWh variance
  }));
}

// Simple distribution by room over last 30 days
export async function fetchRoomDistribution(): Promise<DistributionSlice[]> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  
  // Return fallback data for demo purposes
  console.log('Generating fallback room distribution data for user:', uid);
  return [
    { room: 'Kitchen', total_water: 120.5, total_electricity: 85.2 },
    { room: 'Bathroom', total_water: 95.8, total_electricity: 12.4 },
    { room: 'Living Room', total_water: 15.2, total_electricity: 156.7 },
    { room: 'Bedroom', total_water: 8.5, total_electricity: 78.9 },
    { room: 'Garden', total_water: 180.3, total_electricity: 25.1 },
  ];
  
  /* Uncomment when database is set up
  if (!uid) return [];
  const { data, error } = await supabase.from('usage_readings')
    .select('amount, reading_type, room:rooms(name)')
    .eq('user_id', uid)
    .gte('recorded_at', new Date(Date.now()-30*24*60*60*1000).toISOString());
  if (error) { console.warn('room distribution error', error); return []; }
  const map: Record<string,{water:number;electricity:number}> = {};
  for (const row of data as any[]) {
    const roomName = row.room?.name || 'Other';
    map[roomName] ||= { water:0, electricity:0 };
    if (row.reading_type === 'water') map[roomName].water += Number(row.amount)||0; else map[roomName].electricity += Number(row.amount)||0;
  }
  return Object.entries(map).map(([room,v])=>({ room, total_water: Number(v.water.toFixed(2)), total_electricity: Number(v.electricity.toFixed(2)) }));
  */
}

// Monthly trend for the entire current year (12 months), including months with zero usage
export async function fetchMonthlyTrend(): Promise<MonthlyTrendPoint[]> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;

  const now = new Date();
  const year = now.getFullYear();
  
  // Return fallback data for demo purposes
  console.log('Generating fallback monthly trend data for user:', uid);
  const monthlyData = [
    { water: 890, electricity: 420 },
    { water: 850, electricity: 380 },
    { water: 920, electricity: 450 },
    { water: 780, electricity: 395 },
    { water: 1050, electricity: 520 },
    { water: 1200, electricity: 580 },
    { water: 1350, electricity: 650 },
    { water: 1280, electricity: 620 },
    { water: 1100, electricity: 480 },
    { water: 950, electricity: 410 },
    { water: 820, electricity: 360 },
    { water: 780, electricity: 340 },
  ];

  return monthlyData.map((data, i) => ({
    month: `${year}-${String(i + 1).padStart(2, '0')}`,
    water: data.water,
    electricity: data.electricity,
  }));
  
  /* Uncomment when database is set up
  if (!uid) return [];

  const start = new Date(year, 0, 1); // Jan 1st
  const end = new Date(year + 1, 0, 1); // Jan 1st next year (exclusive)

  const { data, error } = await supabase.from('usage_readings')
    .select('amount, reading_type, recorded_at')
    .eq('user_id', uid)
    .gte('recorded_at', start.toISOString())
    .lt('recorded_at', end.toISOString());
  if (error) { console.warn('monthly trend error', error); return []; }

  // Initialize 12 buckets with zeros
  const buckets: { water: number; electricity: number }[] = Array.from({ length: 12 }, () => ({ water: 0, electricity: 0 }));

  for (const r of (data as any[]) || []) {
    const dt = new Date(r.recorded_at);
    if (dt.getFullYear() !== year) continue; // safety guard
    const monthIdx = dt.getMonth(); // 0..11
    if (r.reading_type === 'water') {
      buckets[monthIdx].water += Number(r.amount) || 0;
    } else {
      buckets[monthIdx].electricity += Number(r.amount) || 0;
    }
  }

  // Map to YYYY-MM keys in order Jan..Dec
  return buckets.map((b, i) => ({
    month: `${year}-${String(i + 1).padStart(2, '0')}`,
    water: Number(b.water.toFixed(2)),
    electricity: Number(b.electricity.toFixed(2)),
  }));
  */
}

// Daily totals for a specific date (local date boundaries)
export async function fetchDailyTotals(date: Date): Promise<{ water: number; electricity: number }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return { water: 0, electricity: 0 };

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data, error } = await supabase
    .from('usage_readings')
    .select('amount, reading_type, recorded_at')
    .eq('user_id', uid)
    .gte('recorded_at', start.toISOString())
    .lt('recorded_at', end.toISOString());
  if (error) {
    console.warn('daily totals error', error);
    return { water: 0, electricity: 0 };
  }
  let water = 0, electricity = 0;
  for (const r of (data as any[]) || []) {
    if (r.reading_type === 'water') water += Number(r.amount) || 0;
    else electricity += Number(r.amount) || 0;
  }
  return { water: Number(water.toFixed(2)), electricity: Number(electricity.toFixed(2)) };
}
