import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export interface AnalyticsData {
  total_usage: number;
  total_cost: number;
  avg_daily_usage: number;
  usage_by_type: Record<string, number>;
  daily_usage: Record<string, number>;
}

export const useAnalytics = (startDate?: Date, endDate?: Date) => {
  const { user } = useSupabaseAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (start?: Date, end?: Date) => {
    if (!user) return;

    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = end || new Date();

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_water_usage_stats', {
        p_user_id: user.id,
        p_start_date: startDate.toISOString().split('T')[0],
        p_end_date: endDate.toISOString().split('T')[0]
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAnalytics(data[0]);
      } else {
        setAnalytics({
          total_usage: 0,
          total_cost: 0,
          avg_daily_usage: 0,
          usage_by_type: {},
          daily_usage: {}
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getUsageByType = () => {
    if (!analytics?.usage_by_type) return [];
    
    return Object.entries(analytics.usage_by_type).map(([type, amount]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      amount: Number(amount),
      percentage: analytics.total_usage > 0 ? (Number(amount) / analytics.total_usage) * 100 : 0
    }));
  };

  const getDailyUsage = () => {
    if (!analytics?.daily_usage) return [];
    
    return Object.entries(analytics.daily_usage)
      .map(([date, amount]) => ({
        date: new Date(date),
        amount: Number(amount)
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getWeeklyUsage = () => {
    const dailyUsage = getDailyUsage();
    const weeklyData: { week: string; amount: number }[] = [];
    
    for (let i = 0; i < dailyUsage.length; i += 7) {
      const weekData = dailyUsage.slice(i, i + 7);
      const weekStart = weekData[0]?.date;
      const weekEnd = weekData[weekData.length - 1]?.date;
      
      if (weekStart && weekEnd) {
        const totalAmount = weekData.reduce((sum, day) => sum + day.amount, 0);
        weeklyData.push({
          week: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
          amount: totalAmount
        });
      }
    }
    
    return weeklyData;
  };

  const getMonthlyUsage = () => {
    const dailyUsage = getDailyUsage();
    const monthlyData: { [key: string]: number } = {};
    
    dailyUsage.forEach(day => {
      const monthKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + day.amount;
    });
    
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getTrendData = () => {
    const dailyUsage = getDailyUsage();
    if (dailyUsage.length < 2) return null;
    
    const firstWeek = dailyUsage.slice(0, 7).reduce((sum, day) => sum + day.amount, 0);
    const lastWeek = dailyUsage.slice(-7).reduce((sum, day) => sum + day.amount, 0);
    
    const trend = lastWeek > firstWeek ? 'up' : lastWeek < firstWeek ? 'down' : 'stable';
    const percentage = firstWeek > 0 ? Math.abs(((lastWeek - firstWeek) / firstWeek) * 100) : 0;
    
    return { trend, percentage };
  };

  const getEfficiencyScore = () => {
    if (!analytics) return 0;
    
    // Simple efficiency score based on usage patterns
    const avgDaily = analytics.avg_daily_usage;
    const targetDaily = 50; // Target daily usage in gallons
    
    if (avgDaily <= targetDaily) {
      return Math.max(0, 100 - ((targetDaily - avgDaily) / targetDaily) * 20);
    } else {
      return Math.max(0, 100 - ((avgDaily - targetDaily) / targetDaily) * 50);
    }
  };

  const getCostAnalysis = () => {
    if (!analytics) return null;
    
    const dailyCost = analytics.total_cost / 30; // Assuming 30-day period
    const costPerGallon = analytics.total_usage > 0 ? analytics.total_cost / analytics.total_usage : 0;
    
    return {
      dailyCost,
      costPerGallon,
      monthlyProjection: dailyCost * 30,
      yearlyProjection: dailyCost * 365
    };
  };

  useEffect(() => {
    fetchAnalytics(startDate, endDate);
  }, [user, startDate, endDate]);

  return {
    analytics,
    loading,
    error,
    getUsageByType,
    getDailyUsage,
    getWeeklyUsage,
    getMonthlyUsage,
    getTrendData,
    getEfficiencyScore,
    getCostAnalysis,
    refetch: () => fetchAnalytics(startDate, endDate),
  };
};
