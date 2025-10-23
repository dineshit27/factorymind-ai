
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { DashboardHeader } from "@/components/DashboardHeader";
import { UsageCard } from "@/components/UsageCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchWeeklyTrend } from '@/services/usage';
import { fetchCurrentBill } from '@/services/billing';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyPoint { label: string; water: number; electricity: number }

const Dashboard: React.FC = () => {
  const [weekly, setWeekly] = useState<WeeklyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [billTotal, setBillTotal] = useState<number | null>(null);
  const [activeDevices, setActiveDevices] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  // Currency: convert stored USD totals to INR for display
  const USD_TO_INR = 83.0; // keep in sync with Billing page
  const formatINR = useCallback((usdAmount: number | null) => {
    if (usdAmount === null || isNaN(usdAmount as any)) return '₹0.00';
    const inr = (usdAmount || 0) * USD_TO_INR;
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(inr);
    } catch {
      return '₹' + inr.toFixed(2);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: authUser }] = await Promise.all([supabase.auth.getUser()]);
      const uid = authUser.user?.id;
      if (!uid) {
        setWeekly([]); setBillTotal(null); setActiveDevices(0); setRoomsCount(0); setLoading(false); return;
      }

      const [trend, bill, devicesResp, roomsResp] = await Promise.all([
        fetchWeeklyTrend(),
        fetchCurrentBill(),
        supabase.from('connected_devices').select('id, is_active').eq('user_id', uid),
        supabase.from('rooms').select('id').eq('user_id', uid),
      ]);

      // Check if we're using fallback data (when all values are similar/patterned)
      const isPattern = trend.length > 0 && trend.every(t => t.water > 20 && t.water < 70 && t.electricity > 5 && t.electricity < 20);
      setIsUsingFallbackData(isPattern);
      
      setWeekly(trend);
      setBillTotal(bill?.total_amount ?? null);
      
      // Fallback device data if no connected devices
      const deviceCount = (devicesResp.data || []).filter(d => (d as any).is_active).length;
      setActiveDevices(deviceCount > 0 ? deviceCount : 8); // Show 8 demo devices if none connected
      
      // Fallback room data if no rooms configured
      const roomCount = roomsResp.data?.length || 0;
      setRoomsCount(roomCount > 0 ? roomCount : 6); // Show 6 demo rooms if none configured
    } catch (e:any) {
      console.warn('Dashboard load error', e);
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totals = useMemo(() => {
    const water = weekly.reduce((sum,p)=> sum + (p.water||0), 0);
    const electricity = weekly.reduce((sum,p)=> sum + (p.electricity||0), 0);
    return { water: Number(water.toFixed(2)), electricity: Number(electricity.toFixed(2)) };
  }, [weekly]);

  const chartData = useMemo(() => weekly.map(p => ({ name: p.label, water: p.water, electricity: p.electricity })), [weekly]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col w-full md:w-auto">
        <DashboardHeader />
        <div className="flex-1 p-6 space-y-6">
          {loading && (
            <div className="text-sm text-muted-foreground">Loading dashboard…</div>
          )}
          {error && !loading && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <span>{error}</span>
              <button onClick={load} className="underline">Retry</button>
            </div>
          )}
          {!loading && !error && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <UsageCard title="Water (7d)" type="water" value={`${totals.water} L`} change="" />
                <UsageCard title="Electricity (7d)" type="electricity" value={`${totals.electricity} kWh`} change="" />
                <UsageCard title="Active Devices" type="electricity" value={String(activeDevices)} change="" />
                <UsageCard title="Rooms" type="water" value={String(roomsCount)} change="" />
                <UsageCard title="Current Bill" type="electricity" value={billTotal!==null ? formatINR(billTotal) : '—'} change="" />
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Weekly Usage Trends</h2>
                    {isUsingFallbackData && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Showing demo data - Connect devices to see real usage
                      </p>
                    )}
                  </div>
                  <button onClick={load} className="text-xs underline">Refresh</button>
                </div>
                {chartData.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No usage data yet. Generate activity or wait for readings.</div>
                ) : (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          tickMargin={8} 
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis 
                          yAxisId="left" 
                          tickMargin={8} 
                          fontSize={12}
                          stroke="#666"
                          label={{ value: 'Usage', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #ccc', 
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number, name: string) => [
                            `${value} ${name.includes('Water') ? 'L' : 'kWh'}`,
                            name
                          ]}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          fontSize={12}
                        />
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="water" 
                          stroke="#3B82F6" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#3B82F6' }} 
                          activeDot={{ r: 6, fill: '#1D4ED8' }}
                          name="Water (L)" 
                        />
                        <Line 
                          yAxisId="left" 
                          type="monotone" 
                          dataKey="electricity" 
                          stroke="#10B981" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#10B981' }} 
                          activeDot={{ r: 6, fill: '#059669' }}
                          name="Electricity (kWh)" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{totals.water}L</div>
                        <div className="text-xs text-muted-foreground">Total Water</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{totals.electricity}kWh</div>
                        <div className="text-xs text-muted-foreground">Total Electricity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">
                          {chartData.length > 0 ? Math.round(totals.water / chartData.length * 10) / 10 : 0}L
                        </div>
                        <div className="text-xs text-muted-foreground">Daily Avg Water</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">
                          {chartData.length > 0 ? Math.round(totals.electricity / chartData.length * 10) / 10 : 0}kWh
                        </div>
                        <div className="text-xs text-muted-foreground">Daily Avg Electricity</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
