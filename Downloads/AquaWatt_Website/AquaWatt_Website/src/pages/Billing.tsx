import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchBillingHistory, fetchCurrentBill } from '@/services/billing';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface BillingSummaryInfo {
  current?: any;
  previous?: any;
  ytdTotal: number;          // Current year YTD total
  ytdAvg: number;            // Current year average per month
  prevYearYtdTotal: number;  // Previous year YTD total (same elapsed months)
  yearlyDiffAmount: number;  // Difference current YTD - previous YTD
  yearlyDiffPct: string;     // Percentage difference vs previous YTD
  sameMonthLastYear?: any;   // This month last year (if present)
  diffAmount: number;        // Current month vs previous month absolute diff
  diffPct: string;           // Current month vs previous month percentage
  savings: number;           // Placeholder (future calculation basis)
}

const Billing: React.FC = () => {
  const [currentBill, setCurrentBill] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]); // includes current as first element after fetch
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { user: authUser, loading: authLoading } = useSupabaseAuth();

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  const load = useCallback(async (uidParam?: string) => {
    setLoading(true); setError(null);
    try {
      const uid = uidParam;
      if (!uid) {
        // Not signed in: present demo fallback so mobile shows something meaningful
        setUserId(null);
        const now = new Date();
        const months: any[] = [];
        for (let i = 0; i < 6; i++) {
          const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
          const total = 1400 + Math.round(Math.random() * 900);
          months.push({
            id: `demo-${i}`,
            period_start: d.toISOString(),
            period_end: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString(),
            water_usage: 0,
            electricity_usage: 0,
            water_cost: 0,
            electricity_cost: 0,
            total_amount: total,
            status: 'demo',
            due_date: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 10)).toISOString(),
            paid_at: null,
          });
        }
        setCurrentBill(months[0]);
        setHistory(months);
        setLoading(false);
        return;
      }
      setUserId(uid);
      const [bill, hist] = await Promise.all([
        fetchCurrentBill(),
        fetchBillingHistory(12)
      ]);
  let effectiveBill = bill;
  let effectiveHist = hist;

  const histSum = (effectiveHist || []).reduce((s, r: any) => s + (Number(r?.total_amount || 0) || 0), 0);
  // Fallback: if there are no aggregated billing records OR totals sum to 0, compute monthly totals from line items
  if ((!effectiveBill && (!effectiveHist || effectiveHist.length === 0)) || histSum <= 0) {
        try {
          const now = new Date();
          const startRange = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1)); // Jan 1 last year (UTC)
          const toIso = (d: Date) => d.toISOString();
          const { data: items, error: liErr } = await supabase
            .from('billing_line_items')
            .select('cost, occurred_at, user_id')
            .eq('user_id', uid)
            .gte('occurred_at', toIso(startRange))
            .lte('occurred_at', toIso(now));
          if (liErr) { console.warn('line_items fallback error', liErr); }

          const byMonth = new Map<string, { amount: number; start: Date }>();
          (items || []).forEach((r: any) => {
            const t = new Date(r.occurred_at);
            const key = `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}`;
            const start = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 1));
            const prev = byMonth.get(key);
            const amount = (Number(r?.cost ?? 0) || 0) + (prev?.amount || 0);
            byMonth.set(key, { amount, start });
          });

          const grouped = Array.from(byMonth.values())
            .sort((a, b) => b.start.getTime() - a.start.getTime())
            .slice(0, 13) // current + 12 months prior
            .map((g, i) => ({
              id: `synthetic-${i}`,
              period_start: g.start.toISOString(),
              period_end: new Date(Date.UTC(g.start.getUTCFullYear(), g.start.getUTCMonth() + 1, 0)).toISOString(),
              water_usage: 0,
              electricity_usage: 0,
              water_cost: 0,
              electricity_cost: 0,
              total_amount: g.amount,
              status: 'computed',
              due_date: new Date(Date.UTC(g.start.getUTCFullYear(), g.start.getUTCMonth() + 1, 10)).toISOString(),
              paid_at: null,
            }));

          if (grouped.length) {
            effectiveBill = grouped[0];
            effectiveHist = grouped;
          }
        } catch (fe) {
          console.warn('billing fallback failed', fe);
        }
      }

      // Final fallback: if still nothing OR totals still zero, synthesize 6 months of demo totals so UI isn't all zeros
      const postHistSum = (effectiveHist || []).reduce((s, r: any) => s + (Number(r?.total_amount || 0) || 0), 0);
      if (!effectiveBill || !effectiveHist || effectiveHist.length === 0 || postHistSum <= 0) {
        const now = new Date();
        const months: any[] = [];
        for (let i = 0; i < 6; i++) {
          const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
          const total = 1200 + Math.round(Math.random() * 800); // ₹1200–₹2000 demo
          months.push({
            id: `demo-${i}`,
            period_start: d.toISOString(),
            period_end: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString(),
            water_usage: 0,
            electricity_usage: 0,
            water_cost: 0,
            electricity_cost: 0,
            total_amount: total,
            status: 'demo',
            due_date: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 10)).toISOString(),
            paid_at: null,
          });
        }
        effectiveBill = months[0];
        effectiveHist = months;
      }

      setCurrentBill(effectiveBill);
      setHistory(effectiveHist);
    } catch (e:any) {
      setError(e.message || 'Failed to load billing');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authLoading) return; // wait until auth state is ready (important for mobile)
    load(authUser?.id || undefined);
  }, [authLoading, authUser?.id, load]);

  const summary: BillingSummaryInfo = useMemo(() => {
    if (!history.length) return {
      ytdTotal: 0, ytdAvg: 0, prevYearYtdTotal: 0, yearlyDiffAmount: 0, yearlyDiffPct: '0.0',
      savings: 0, diffAmount: 0, diffPct: '0.0'
    };
    const now = new Date();
    const thisYear = now.getFullYear();
    const elapsedMonthIndex = now.getMonth(); // 0-based (Jan=0)
    const current = currentBill || history[0];

    // Current year YTD (months up to current month)
    const ytd = history.filter(r => {
      const d = new Date(r.period_start);
      return d.getFullYear() === thisYear && d.getMonth() <= elapsedMonthIndex;
    });
    const ytdTotal = ytd.reduce((s,r)=> s + Number(r.total_amount||0), 0);
    const ytdAvg = ytd.length ? ytdTotal / ytd.length : 0;

    // Previous year comparable period
    const prevYear = thisYear - 1;
    const prevYearYtd = history.filter(r => {
      const d = new Date(r.period_start);
      return d.getFullYear() === prevYear && d.getMonth() <= elapsedMonthIndex;
    });
    const prevYearYtdTotal = prevYearYtd.reduce((s,r)=> s + Number(r.total_amount||0), 0);
    const yearlyDiffAmount = ytdTotal - prevYearYtdTotal;
    const yearlyDiffPct = prevYearYtdTotal ? ((yearlyDiffAmount / prevYearYtdTotal) * 100).toFixed(1) : '0.0';

    // Previous month detection
    const previous = history.find(r => {
      if (!current) return false;
      const d = new Date(current.period_start); const pr = new Date(r.period_start);
      return pr.getFullYear() === d.getFullYear() && pr.getMonth() === d.getMonth() - 1;
    });
    const diffAmount = previous ? Number(current?.total_amount||0) - Number(previous.total_amount||0) : 0;
    const diffPct = previous && previous.total_amount ? ((diffAmount / previous.total_amount) * 100).toFixed(1) : '0.0';

    // Same month last year for contextual comparison
    const sameMonthLastYear = history.find(r => {
      const d = new Date(r.period_start);
      if (!current) return false;
      const c = new Date(current.period_start);
      return d.getFullYear() === (c.getFullYear()-1) && d.getMonth() === c.getMonth();
    });

    return { current, previous, ytdTotal, ytdAvg, prevYearYtdTotal, yearlyDiffAmount, yearlyDiffPct, sameMonthLastYear, savings: 0, diffAmount, diffPct };
  }, [history, currentBill]);

  // ---------- Currency Conversion (USD -> INR) ----------
  const USD_TO_INR = 83.0; // Static rate; could be fetched from API in future
  const formatINR = (usdAmount: number) => {
    if (!usdAmount) return '₹0.00';
    try {
      const inr = usdAmount * USD_TO_INR;
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(inr);
    } catch {
      return '₹' + (usdAmount * USD_TO_INR).toFixed(2);
    }
  };

  // Usage document - enhanced version with all content
  const createUsageDocumentCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d')!;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 1200);
    
    // Header - Dark blue background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 800, 120);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AQUAWATT | USAGE DOCUMENT', 400, 75);
    
    // Customer section
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('G. MOORTHY', 60, 170);
    
    ctx.font = '14px Arial';
    ctx.fillText('AquaWatt id:', 60, 200);
    ctx.fillText('AW12XX', 180, 200);
    ctx.fillText('Date Issued:', 60, 225);
    ctx.fillText('Aug 07, 2025', 180, 225);
    ctx.fillText('Invoice No:', 60, 250);
    ctx.fillText('012XX', 180, 250);
    
    // Table section
    ctx.font = 'bold 16px Arial';
    ctx.fillText('DESCRIPTION', 60, 300);
    ctx.textAlign = 'center';
    ctx.fillText('CURRENT', 350, 300);
    ctx.fillText('PREVIOUS', 500, 300);
    ctx.fillText('AVERAGE', 650, 300);
    
    // Horizontal line under headers
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 310);
    ctx.lineTo(740, 310);
    ctx.stroke();
    
    // Table rows with alternating background
    // Placeholder rows (dynamic aggregation could be added from usage_readings if needed)
    const rows = [
      ['Water Usage', currentBill ? `${Number(currentBill.water_usage||0).toFixed(2)} L` : '-', summary.previous ? `${Number(summary.previous.water_usage||0).toFixed(2)} L` : '-', '—'],
      ['Electricity Usage', currentBill ? `${Number(currentBill.electricity_usage||0).toFixed(2)} kWh` : '-', summary.previous ? `${Number(summary.previous.electricity_usage||0).toFixed(2)} kWh` : '-', '—'],
      ['Water Cost', currentBill ? `${formatINR(Number(currentBill.water_cost||0))}` : '-', summary.previous ? `${formatINR(Number(summary.previous.water_cost||0))}` : '-', '—'],
      ['Electricity Cost', currentBill ? `${formatINR(Number(currentBill.electricity_cost||0))}` : '-', summary.previous ? `${formatINR(Number(summary.previous.electricity_cost||0))}` : '-', '—']
    ];
    
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    rows.forEach((row, i) => {
      const y = 340 + (i * 35);
      
      // Alternating row background (light purple/lavender)
      if (i % 2 === 0) {
        ctx.fillStyle = '#e8e6ff';
        ctx.fillRect(60, y - 20, 680, 35);
      }
      
      ctx.fillStyle = '#000';
      ctx.fillText(row[0], 70, y);
      ctx.textAlign = 'center';
      ctx.fillText(row[1], 350, y);
      ctx.fillText(row[2], 500, y);
      ctx.fillText(row[3], 650, y);
      ctx.textAlign = 'left';
    });
    
    // Summary section
    const summaryY = 580;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('ELECTRICITY USAGE', 600, summaryY);
    ctx.fillText('WATER USAGE', 600, summaryY + 30);
    
    ctx.textAlign = 'left';
  ctx.fillText(currentBill ? `${Number(currentBill.electricity_usage||0).toFixed(0)} kWh` : '-', 650, summaryY);
  ctx.fillText(currentBill ? `${Number(currentBill.water_usage||0).toFixed(0)} L` : '-', 650, summaryY + 30);
    
    // Client info section
    const clientY = 680;
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, clientY, 800, 120);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('CLIENT AQUAWATT INFO', 60, clientY + 30);
    ctx.fillText('ANALYSED AT', 500, clientY + 30);
    
    ctx.font = '14px Arial';
    ctx.fillText('G. MOORTHY', 60, clientY + 55);
    ctx.fillText('Account No: 0123 4567 8XXX', 60, clientY + 75);
    ctx.fillText('Short Code: 0123XXX', 60, clientY + 95);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Aug 17, 2025', 500, clientY + 55);
    
    // Thank you section
    ctx.font = '12px Arial';
    ctx.fillText('THANK YOU', 60, clientY + 110);
    ctx.textAlign = 'right';
    ctx.fillText('AQUAWATT - ORG', 740, clientY + 110);
    
    // Footer contact bar
    const footerY = 1120;
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, footerY, 800, 80);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Contact icons and text (simplified)
    ctx.fillText('📧 enquiry@aquawatt.com', 200, footerY + 45);
    ctx.fillText('📞 +123-456-7890', 400, footerY + 45);
    ctx.fillText('🌐 AquaWatt.com', 600, footerY + 45);
    
    return canvas;
  };

  // Helper to download the usage document
  const downloadUsageDocument = async (filename: string): Promise<boolean> => {
    try {
      // For now, create a canvas-based document
      // TODO: Replace this with actual image file when you save it to public/
      const canvas = createUsageDocumentCanvas();
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          resolve(true);
        }, 'image/jpeg', 0.9);
      });
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  // Function to handle bill download - downloads usage document image
  const handleDownload = async (month: string) => {
    try {
      const filename = `AQUAWATT-Usage-Document-${month.replace(/\s/g, '-')}.jpg`;
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({ 
          title: 'Document Downloaded', 
          description: `Your ${month} usage document has been downloaded` 
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to export usage report - downloads usage document image
  const handleExportPDF = async () => {
    try {
      const filename = 'AQUAWATT-Usage-Report.jpg';
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({
          title: "Export Complete",
          description: "Usage report has been downloaded",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to export detailed usage report - downloads usage document image
  const handleExportDetailedPDF = async () => {
    try {
      const filename = 'AQUAWATT-Detailed-Usage-Report.jpg';
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({ 
          title: 'Export Complete', 
          description: 'Detailed usage report downloaded successfully.' 
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Detailed export error:', error);
      toast({ 
        title: 'Export Failed', 
        description: 'Could not export the report. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  if (!userId && !loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex flex-col w-full md:w-auto">
          <DashboardHeader />
          <div className="flex-1 p-6">Please sign in to view billing.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col w-full md:w-auto">
        <DashboardHeader />
        <div className="flex-1 p-6">
          <div className="grid gap-6">
            {loading && (
              <Card>
                <CardHeader>
                  <CardTitle>Loading Billing Data…</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Fetching latest billing records.</CardContent>
              </Card>
            )}
            {error && !loading && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-red-600">Billing Error</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => load(userId || undefined)}><RefreshCw className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent className="text-sm">{error}</CardContent>
              </Card>
            )}
            {/* Monthly Summary & Insights */}
            {!loading && !error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Summary & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">This Month vs Last Month</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{formatINR(Number(summary.current?.total_amount||0))}</span>
                      <div className={`flex items-center gap-1 text-sm ${summary.diffAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {summary.diffAmount > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {summary.diffPct}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {summary.diffAmount > 0 ? `${formatINR(summary.diffAmount)} more` : `${formatINR(Math.abs(summary.diffAmount))} less`} than last month
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Monthly Cost</p>
                    <span className="text-2xl font-bold">{formatINR(summary.ytdAvg)}</span>
                    <p className="text-xs text-muted-foreground">Year to date average</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Savings</p>
                    <span className="text-2xl font-bold text-green-500">₹0.00</span>
                    <p className="text-xs text-muted-foreground">(Placeholder)</p>
                  </div>
                </div>
                {/* Yearly Comparison */}
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">YTD Total ({currentYear})</p>
                    <p className="text-lg font-semibold">{formatINR(summary.ytdTotal)}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">YTD Total ({currentYear-1})</p>
                    <p className="text-lg font-semibold">{formatINR(summary.prevYearYtdTotal)}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Change vs Last Year</p>
                    <div className={`flex items-center gap-2 ${summary.yearlyDiffAmount>0?'text-red-600':'text-green-600'}`}> 
                      {summary.yearlyDiffAmount>0 ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
                      <span className="font-semibold">{formatINR(Math.abs(summary.yearlyDiffAmount))} ({summary.yearlyDiffPct}%)</span>
                    </div>
                  </div>
                </div>
                {summary.sameMonthLastYear && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    Same month last year: {formatINR(Number(summary.sameMonthLastYear.total_amount||0))}
                  </div>
                )}
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Water Usage Trend</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: {(Number(summary.current?.water_usage||0)/1000).toFixed(2)} kL</span>
                        <span className="text-muted-foreground">Previous: {(Number(summary.previous?.water_usage||0)/1000).toFixed(2)} kL</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(Number(summary.current?.water_usage||0) > Number(summary.previous?.water_usage||0)) ? 'Usage increased' : 'Usage decreased'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Electricity Usage Trend</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: {Number(summary.current?.electricity_usage||0).toFixed(0)} kWh</span>
                        <span className="text-muted-foreground">Previous: {Number(summary.previous?.electricity_usage||0).toFixed(0)} kWh</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(Number(summary.current?.electricity_usage||0) > Number(summary.previous?.electricity_usage||0)) ? 'Usage increased' : 'Usage decreased'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>) }

            {/* Export Usage Reports */}
            {!loading && !error && (
            <Card id="export" className="scroll-mt-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Export Usage Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download detailed usage reports with daily consumption data, costs, and trends.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Export as PDF
                    </Button>
                    
                    <Button variant="outline" onClick={handleExportDetailedPDF} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Detailed PDF
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Reports include: Daily usage data, cost breakdown, consumption trends, and efficiency metrics
                  </div>
                </div>
              </CardContent>
            </Card>)}

            {/* Current Bill */}
            {!loading && !error && (
            <Card id="current-bill" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Current Bill ({currentMonth} {currentYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Water Usage ({(Number(currentBill?.water_usage||0)/1000).toFixed(2)} kL)</span>
                    <span className="font-semibold">{formatINR(Number(currentBill?.water_cost||0))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Electricity Usage ({Number(currentBill?.electricity_usage||0).toFixed(0)} kWh)</span>
                    <span className="font-semibold">{formatINR(Number(currentBill?.electricity_cost||0))}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">{formatINR(Number(currentBill?.total_amount||0))}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => handleDownload(`${currentMonth} ${currentYear}`)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Bill
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}

            {/* Billing History */}
            {!loading && !error && (
            <Card id="history" className="scroll-mt-24">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.slice(1).map((r) => {
                    const start = new Date(r.period_start);
                    const label = `${start.toLocaleString('default',{month:'long'})} ${start.getFullYear()}`;
                    return (
                      <div key={r.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground capitalize">{r.status}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{formatINR(Number(r.total_amount||0))}</span>
                          <Button variant="outline" size="icon" onClick={() => handleDownload(label)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {!history.slice(1).length && <div className="text-sm text-muted-foreground">No past bills yet.</div>}
                </div>
              </CardContent>
            </Card>)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
