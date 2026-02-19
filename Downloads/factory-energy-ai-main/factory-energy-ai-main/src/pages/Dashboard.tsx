import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, Leaf, Factory, Zap, ArrowRight, Brain, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Demo data for dashboard
const billTrend = [
  { month: 'Sep', actual: 42000, predicted: 38000 },
  { month: 'Oct', actual: 45000, predicted: 39000 },
  { month: 'Nov', actual: 43000, predicted: 37000 },
  { month: 'Dec', actual: 38000, predicted: 35000 },
  { month: 'Jan', actual: 35000, predicted: 34000 },
  { month: 'Feb', actual: 33000, predicted: 33000 },
];

const savingsData = [
  { month: 'Sep', savings: 0 },
  { month: 'Oct', savings: 3200 },
  { month: 'Nov', savings: 5800 },
  { month: 'Dec', savings: 9400 },
  { month: 'Jan', savings: 14200 },
  { month: 'Feb', savings: 19800 },
];

const diagnosisHistory = [
  { machine: 'Main Compressor', fault: 'Air Leak', date: '2026-01-15', loss: 4200, status: 'Repaired' },
  { machine: 'Floor Motor #2', fault: 'Bearing Degradation', date: '2026-01-28', loss: 3100, status: 'Pending' },
  { machine: 'Backup Compressor', fault: 'Valve Wear', date: '2026-02-10', loss: 5600, status: 'Repaired' },
];

const pieData = [
  { name: 'Air Leaks', value: 35, color: 'hsl(142, 71%, 45%)' },
  { name: 'Bearing Issues', value: 25, color: 'hsl(149, 60%, 26%)' },
  { name: 'Valve Wear', value: 20, color: 'hsl(160, 50%, 35%)' },
  { name: 'Other', value: 20, color: 'hsl(142, 20%, 70%)' },
];

const aiInsights = [
  {
    icon: AlertCircle,
    type: 'urgent',
    title: 'Critical: Floor Motor #2 Needs Attention',
    desc: 'Bearing degradation detected. Estimated loss: ₹3,100/month. Recommended action: Replace bearing within 7 days.',
    color: 'text-destructive'
  },
  {
    icon: TrendingUp,
    type: 'opportunity',
    title: 'High Savings Potential: Main Compressor',
    desc: 'Air leak repair could save an additional ₹4,200/month. ROI: 3 months with professional repair.',
    color: 'text-accent'
  },
  {
    icon: Sparkles,
    type: 'optimization',
    title: 'Preventive Maintenance Due',
    desc: 'Backup Compressor is due for maintenance. Schedule inspection to avoid potential faults.',
    color: 'text-primary'
  },
];

const savingsPieData = savingsData.map(d => ({ name: d.month, value: d.savings })).filter(d => d.value > 0);

export default function Dashboard() {
  const [totalSavings, setTotalSavings] = useState(0);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  useEffect(() => {
    const target = 19800;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(target / 40);
      if (current >= target) { setTotalSavings(target); clearInterval(interval); }
      else setTotalSavings(current);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your energy savings and diagnosis history.</p>
          </div>
          <Link to="/diagnosis">
            <Button variant="hero" className="mt-4 md:mt-0">
              New Diagnosis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingDown, label: 'Total Savings', value: `₹${totalSavings.toLocaleString('en-IN')}`, color: 'text-accent' },
            { icon: Factory, label: 'Machines Diagnosed', value: '3', color: 'text-primary' },
            { icon: Leaf, label: 'CO₂ Saved', value: '2.4 tonnes', color: 'text-accent' },
            { icon: Zap, label: 'Energy Saved', value: '2,890 kWh', color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 cursor-pointer group">
              <s.icon className={`h-5 w-5 ${s.color} mb-2 transition-transform duration-300 group-hover:scale-125`} />
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="font-display text-2xl font-bold transition-colors duration-300 group-hover:text-accent">{s.value}</div>
            </div>
          ))}
        </div>

        {/* AI-Powered Insights */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl font-bold">AI-Powered Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {aiInsights.map((insight, i) => (
              <div key={i} className="glass-card rounded-xl p-5 border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 cursor-pointer group" style={{ borderLeftColor: insight.type === 'urgent' ? 'hsl(0, 84%, 60%)' : insight.type === 'opportunity' ? 'hsl(142, 71%, 45%)' : 'hsl(149, 60%, 26%)' }}>
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-6`}>
                    <insight.icon className={`h-5 w-5 ${insight.color} transition-transform duration-300 group-hover:scale-125`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1 transition-colors duration-300 group-hover:text-accent">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30">
            <h3 className="font-display font-semibold mb-4">Bill Trend: Actual vs Predicted</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={billTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 15%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="hsl(149, 60%, 26%)" strokeWidth={2} dot={{ r: 4 }} name="Actual (₹)" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(142, 71%, 45%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Cumulative Savings (₹)</h3>
              <Select value={chartType} onValueChange={(value: 'bar' | 'pie' | 'line') => setChartType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              {chartType === 'bar' ? (
                <BarChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="savings" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Savings (₹)" />
                </BarChart>
              ) : chartType === 'pie' ? (
                <PieChart>
                  <Pie 
                    data={savingsPieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={90} 
                    dataKey="value" 
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                    labelLine={false}
                  >
                    {savingsPieData.map((entry, i) => (
                      <Cell key={i} fill={`hsl(${142 + i * 10}, ${71 - i * 5}%, ${45 - i * 3}%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="savings" stroke="hsl(142, 71%, 45%)" strokeWidth={3} dot={{ r: 5 }} name="Savings (₹)" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Fault Distribution */}
          <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30">
            <h3 className="font-display font-semibold mb-4">Fault Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Diagnosis History */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30">
            <h3 className="font-display font-semibold mb-4">Diagnosis History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-2">Machine</th>
                    <th className="text-left py-2 px-2">Fault</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-right py-2 px-2">Loss/mo</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosisHistory.map((d, i) => (
                    <tr key={i} className="border-b border-border/50 transition-colors duration-200 hover:bg-accent/5 cursor-pointer">
                      <td className="py-3 px-2 font-medium">{d.machine}</td>
                      <td className="py-3 px-2">{d.fault}</td>
                      <td className="py-3 px-2 text-muted-foreground">{d.date}</td>
                      <td className="py-3 px-2 text-right text-destructive">₹{d.loss.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'Repaired' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
