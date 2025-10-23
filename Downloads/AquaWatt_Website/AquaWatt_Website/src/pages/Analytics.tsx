import React, { useState, useEffect, useMemo } from 'react';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { MapPin, Calendar, Filter, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsMap } from "@/components/AnalyticsMap";
import InteractiveHouseMap from "@/components/InteractiveHouseMap";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchMonthlyTrend, fetchRoomDistribution, fetchWeeklyTrend } from '@/services/usage';
import { getAIInsights, getAIRecommendations } from '@/lib/ai';

// Fallback data
const fallbackMonthly = [
  { month: '2024-01', water: 100, electricity: 300 },
  { month: '2024-02', water: 110, electricity: 310 },
  { month: '2024-03', water: 115, electricity: 320 },
  { month: '2024-04', water: 120, electricity: 340 },
  { month: '2024-05', water: 150, electricity: 360 },
  { month: '2024-06', water: 130, electricity: 320 },
  { month: '2024-07', water: 140, electricity: 330 },
  { month: '2024-08', water: 160, electricity: 380 },
  { month: '2024-09', water: 170, electricity: 390 },
  { month: '2024-10', water: 175, electricity: 395 },
  { month: '2024-11', water: 180, electricity: 400 },
  { month: '2024-12', water: 190, electricity: 410 },
];
const fallbackDistribution = [
  { room: 'Kitchen', total_water: 35, total_electricity: 50 },
  { room: 'Bathroom', total_water: 25, total_electricity: 0 },
  { room: 'Hall', total_water: 10, total_electricity: 15 },
  { room: 'Bedroom', total_water: 5, total_electricity: 20 },
  { room: 'Other', total_water: 3, total_electricity: 5 },
];
const hourlyData = [
  { time: '00:00', water: 30, electricity: 25 },
  { time: '03:00', water: 20, electricity: 18 },
  { time: '06:00', water: 35, electricity: 30 },
  { time: '09:00', water: 70, electricity: 65 },
  { time: '12:00', water: 90, electricity: 85 },
  { time: '15:00', water: 85, electricity: 80 },
  { time: '18:00', water: 95, electricity: 90 },
  { time: '21:00', water: 65, electricity: 55 },
];
const yearlyData: any[] = [];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('bar');
  const [showMap, setShowMap] = useState(false);
  const [monthly, setMonthly] = useState(fallbackMonthly);
  const [distribution, setDistribution] = useState(fallbackDistribution);
  const [weekly, setWeekly] = useState<{label:string; water:number; electricity:number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [insights, setInsights] = useState<string>('');
  const [recs, setRecs] = useState<string[]>([]);

  const t = {
    title: 'Advanced Analytics',
    monthlyTrends: 'Monthly Usage Trends',
    usageDistribution: 'Usage Distribution',
    hourlyPatterns: 'Hourly Usage Patterns',
    yearlyComparison: 'Yearly Comparison',
    water: 'Water (L)',
    electricity: 'Electricity (kWh)',
    timeRange: 'Time Range',
    chartType: 'Chart Type',
    viewMap: 'View House Map',
    hideMap: 'Hide House Map',
    houseMapTitle: 'House Map',
    houseMapDesc: 'Visual layout of rooms with usage hotspots'
  } as const;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const [w, m, d] = await Promise.all([
          fetchWeeklyTrend(),
            fetchMonthlyTrend(),
            fetchRoomDistribution()
        ]);
        if (cancelled) return;
        if (w.length) setWeekly(w);
        if (m.length) setMonthly(m);
        if (d.length) setDistribution(d);
        // Kick off AI calls (optional OpenAI, with fallbacks)
        try {
          const [aiText, aiRecs] = await Promise.all([
            getAIInsights({ monthly: m.length ? m : fallbackMonthly, distribution: d.length ? d : fallbackDistribution }),
            getAIRecommendations({ monthly: m.length ? m : fallbackMonthly, distribution: d.length ? d : fallbackDistribution })
          ]);
          if (!cancelled) {
            setInsights(aiText);
            setRecs(aiRecs);
          }
        } catch {}
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Listen for showHouseMap event from navigation dropdown
  useEffect(() => {
    const handleShowHouseMap = () => {
      setShowMap(true);
    };

    window.addEventListener('showHouseMap', handleShowHouseMap);
    return () => window.removeEventListener('showHouseMap', handleShowHouseMap);
  }, []);

  const getChartData = () => {
    switch (timeRange) {
      case 'hourly': return hourlyData;
      case 'yearly': return yearlyData;
      default: return monthly.map(m => ({ name: m.month, water: m.water, electricity: m.electricity }));
    }
  };
  const getXAxisKey = () => timeRange === 'hourly' ? 'time' : timeRange === 'yearly' ? 'year' : 'name';

  // Simple forecasting using last 3 points linear trend (per series)
  const forecast = useMemo(() => {
    const data = getChartData();
    if (!Array.isArray(data) || data.length < 3) return null;
    const last3 = data.slice(-3);
    const makeTrend = (key: 'water'|'electricity') => {
      const y1 = last3[0][key], y2 = last3[1][key], y3 = last3[2][key];
      const slope = (y3 - y1) / 2; // over 2 intervals
      const next = Math.max(0, Math.round(y3 + slope));
      const prev = last3[1][key];
      const deltaPct = prev ? ((y3 - prev) / prev) * 100 : 0;
      return { current: y3, next, deltaPct };
    };
    return {
      water: makeTrend('water'),
      electricity: makeTrend('electricity'),
    };
  }, [timeRange, chartType, monthly, weekly]);

  const estimatedBillINR = useMemo(() => {
    if (!forecast) return null;
    // Very rough example tariff: 7 INR per kWh for electricity, 0.1 INR per Liter of water bucket-equivalent
    const elec = Math.round((forecast.electricity.next || 0) * 7);
    const water = Math.round((forecast.water.next || 0) * 0.1);
    return elec + water;
  }, [forecast]);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <main className='flex-1 flex flex-col w-full md:w-auto'>
        <DashboardHeader />
        <div className='flex-1 p-6'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <h1 className='text-3xl font-bold'>{t.title}</h1>
          </div>
          <div className='flex gap-4 mb-6'>
            <Card className='w-full'>
              <CardContent className='pt-6'>
                <div className='flex flex-wrap gap-4 md:items-center'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className='w-full sm:w-[150px]'>
                        <SelectValue placeholder={t.timeRange} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='hourly'>Hourly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                        <SelectItem value='yearly'>Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4 text-muted-foreground' />
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger className='w-full sm:w-[150px]'>
                        <SelectValue placeholder={t.chartType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='bar'>Bar Chart</SelectItem>
                        <SelectItem value='line'>Line Chart</SelectItem>
                        <SelectItem value='area'>Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    onClick={() => setShowMap(!showMap)} 
                    className='w-full sm:w-auto sm:ml-auto'
                    data-testid="view-house-map-button"
                  >
                    <MapPin className='h-4 w-4 mr-2' />
                    {showMap ? t.hideMap : t.viewMap}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {showMap && (
            <Card className='mb-6'>
              <CardHeader className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
                <div>
                  <CardTitle>Interactive House Map</CardTitle>
                  <CardDescription>Real-time monitoring of water and energy usage across all rooms</CardDescription>
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span className='h-2 w-2 rounded-full bg-primary animate-pulse' /> Live Data
                </div>
              </CardHeader>
              <CardContent className='p-0 relative'>
                <div className='h-[600px] rounded-b-lg overflow-hidden relative'>
                  <InteractiveHouseMap />
                </div>
              </CardContent>
            </Card>
          )}
          <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
            <Card id='monthly-trends' className='scroll-mt-24'>
              <CardHeader>
                <CardTitle>{timeRange === 'monthly' ? t.monthlyTrends : timeRange === 'hourly' ? t.hourlyPatterns : t.yearlyComparison}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <div className='text-sm text-muted-foreground'>Loading data...</div>}
                {error && <div className='text-sm text-destructive'>{error}</div>}
                <ResponsiveContainer width='100%' height={360}>
                  {chartType === 'bar' ? (
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey={getXAxisKey()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='water' fill='#7FB3D5' name={t.water} />
                      <Bar dataKey='electricity' fill='#82C785' name={t.electricity} />
                    </BarChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey={getXAxisKey()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type='monotone' dataKey='water' stroke='#7FB3D5' name={t.water} />
                      <Line type='monotone' dataKey='electricity' stroke='#82C785' name={t.electricity} />
                      {/* Forecast overlay as dashed next-point reference */}
                      {forecast && (
                        <>
                          <Line type='monotone' dataKey={() => forecast.water.current} stroke='#7FB3D5' strokeDasharray='4 4' dot={false} isAnimationActive={false} />
                          <Line type='monotone' dataKey={() => forecast.electricity.current} stroke='#82C785' strokeDasharray='4 4' dot={false} isAnimationActive={false} />
                        </>
                      )}
                    </LineChart>
                  ) : (
                    <AreaChart data={getChartData()}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey={getXAxisKey()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type='monotone' dataKey='water' fill='#7FB3D5' stroke='#5A8DB3' name={t.water} />
                      <Area type='monotone' dataKey='electricity' fill='#82C785' stroke='#5EA568' name={t.electricity} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
                {/* Forecast summary */}
                {forecast && (
                  <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm'>
                    <div className='p-3 rounded-md border bg-muted/30'>
                      <div className='font-medium flex items-center gap-2'>
                        Electricity forecast {forecast.electricity.deltaPct >= 0 ? <TrendingUp className='h-4 w-4 text-red-500'/> : <TrendingDown className='h-4 w-4 text-green-500'/>}
                      </div>
                      <div className='text-muted-foreground'>Next period: <span className='font-semibold'>{forecast.electricity.next} kWh</span></div>
                    </div>
                    <div className='p-3 rounded-md border bg-muted/30'>
                      <div className='font-medium flex items-center gap-2'>
                        Water forecast {forecast.water.deltaPct >= 0 ? <TrendingUp className='h-4 w-4 text-red-500'/> : <TrendingDown className='h-4 w-4 text-green-500'/>}
                      </div>
                      <div className='text-muted-foreground'>Next period: <span className='font-semibold'>{forecast.water.next} L</span></div>
                    </div>
                    <div className='p-3 rounded-md border bg-muted/30'>
                      <div className='font-medium'>Estimated bill</div>
                      <div className='text-muted-foreground'>₹ <span className='font-semibold'>{estimatedBillINR ?? '--'}</span></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card id='usage-distribution' className='scroll-mt-24'>
              <CardHeader>
                <CardTitle>{t.usageDistribution}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={360}>
                  <PieChart>
                    <Pie
                      data={distribution.map(d => ({ name: d.room, value: d.total_water + d.total_electricity }))}
                      cx='50%'
                      cy='50%'
                      outerRadius={isMobile ? 80 : 100}
                      fill='#8884d8'
                      dataKey='value'
                      label={isMobile ? false : (({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`)}
                      labelLine={!isMobile}
                    >
                      {distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights and Recommendations */}
          <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* AI Insights - Modern gradient card */}
            <Card id='ai-insights' className='lg:col-span-2 relative overflow-hidden border-none shadow-xl scroll-mt-24'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 opacity-95' />
              <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
              <div className='absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl' />
              
              <CardHeader className='relative z-10'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-white/20 backdrop-blur-sm'>
                    <Sparkles className='h-5 w-5 text-white'/>
                  </div>
                  <div>
                    <CardTitle className='text-white text-xl'>AI-Powered Insights</CardTitle>
                    <CardDescription className='text-white/80'>Intelligent analysis of your consumption patterns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='relative z-10'>
                <div className='p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20'>
                  <p className='text-white/90 leading-relaxed text-base'>
                    {insights || 'Analyzing your usage patterns...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Smart Recommendations - Modern card stack */}
            <Card id='smart-tips' className='relative overflow-hidden shadow-lg scroll-mt-24'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-2xl' />
              
              <CardHeader className='relative z-10'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600'>
                    <TrendingUp className='h-5 w-5 text-white'/>
                  </div>
                  <div>
                    <CardTitle className='text-lg'>Smart Tips</CardTitle>
                    <CardDescription>Personalized recommendations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='relative z-10'>
                <ul className='space-y-3'>
                  {(recs.length ? recs : [
                    'Try running the washing machine in the morning to save energy.',
                    'Fix small leaks in taps to reduce water wastage.',
                    'Switch to LED lights in frequently used rooms.'
                  ]).map((r, i) => (
                    <li key={i} className='group p-4 rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer'>
                      <div className='flex items-start gap-3'>
                        <div className='mt-0.5 p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                          <div className='w-2 h-2 rounded-full bg-primary' />
                        </div>
                        <p className='text-sm leading-relaxed flex-1'>{r}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
