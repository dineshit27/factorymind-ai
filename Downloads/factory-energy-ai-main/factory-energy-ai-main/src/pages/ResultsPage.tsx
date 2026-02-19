import { useDiagnosis } from '@/contexts/DiagnosisContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, Leaf, Download, BarChart3, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ResultsPage() {
  const { machineData, diagnosis, energyLoss, roiOptions, factoryName } = useDiagnosis();
  const navigate = useNavigate();

  if (!machineData || !diagnosis || !energyLoss || !roiOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-4">No Diagnosis Data</h2>
          <p className="text-muted-foreground mb-6">Please complete a diagnosis first.</p>
          <Button variant="hero" onClick={() => navigate('/diagnosis')}>Start Diagnosis</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const marginLow = (n: number) => Math.round(n * 0.85);
  const marginHigh = (n: number) => Math.round(n * 1.15);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(26, 107, 60);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('FactoryMind AI', 14, 18);
    doc.setFontSize(10);
    doc.text('Energy Diagnostic Report', 14, 26);
    doc.text(new Date().toLocaleDateString(), 14, 33);

    doc.setTextColor(0, 0, 0);
    let y = 50;

    // Factory & Machine
    doc.setFontSize(14);
    doc.text('Machine Details', 14, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Factory: ${factoryName || 'N/A'}`, 14, y); y += 6;
    doc.text(`Machine: ${machineData.machineName} (${machineData.machineType})`, 14, y); y += 6;
    doc.text(`Rated Power: ${machineData.ratedPower} ${machineData.powerUnit}`, 14, y); y += 6;
    doc.text(`Daily Hours: ${machineData.dailyHours}h | Age: ${machineData.machineAge} years`, 14, y); y += 6;
    doc.text(`Electricity Cost: ₹${machineData.electricityCost}/unit`, 14, y); y += 12;

    // Diagnosis
    doc.setFontSize(14);
    doc.text('Diagnosis', 14, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Fault: ${diagnosis.faultName} (${diagnosis.confidence}% confidence)`, 14, y); y += 6;
    doc.text(`Excess Energy: ${diagnosis.excessPercentage}%`, 14, y); y += 6;
    const splitExpl = doc.splitTextToSize(diagnosis.explanation, pageWidth - 28);
    doc.text(splitExpl, 14, y); y += splitExpl.length * 5 + 4;
    doc.text(`Action: ${diagnosis.recommendedAction}`, 14, y); y += 12;

    // Energy Loss
    doc.setFontSize(14);
    doc.text('Energy Loss Analysis', 14, y); y += 8;
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value', 'Range (±15%)']],
      body: [
        ['Monthly Excess kWh', `${Math.round(energyLoss.excessKwh)}`, `${marginLow(energyLoss.excessKwh)} – ${marginHigh(energyLoss.excessKwh)}`],
        ['Monthly Cost Loss', formatCurrency(Math.round(energyLoss.monthlyCostLoss)), `${formatCurrency(marginLow(energyLoss.monthlyCostLoss))} – ${formatCurrency(marginHigh(energyLoss.monthlyCostLoss))}`],
        ['Annual Cost Loss', formatCurrency(Math.round(energyLoss.annualCostLoss)), `${formatCurrency(marginLow(energyLoss.annualCostLoss))} – ${formatCurrency(marginHigh(energyLoss.annualCostLoss))}`],
        ['CO₂ Reduction (kg/yr)', `${Math.round(energyLoss.co2ReductionKg)}`, ''],
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 107, 60] },
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ROI
    doc.setFontSize(14);
    doc.text('ROI Comparison', 14, y); y += 8;
    autoTable(doc, {
      startY: y,
      head: [['Option', 'Cost (₹)', 'Monthly Saving', 'Annual Saving', 'Payback (months)']],
      body: roiOptions.map(o => [
        o.type + (o.recommended ? ' ★' : ''),
        formatCurrency(o.cost),
        formatCurrency(o.monthlySaving),
        formatCurrency(o.annualSaving),
        `${o.paybackMonths}`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [26, 107, 60] },
    });

    const recommended = roiOptions.find(o => o.recommended);
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Recommendation: ${recommended?.type || 'Repair'} — Best payback period of ${recommended?.paybackMonths || 'N/A'} months.`, 14, y);

    doc.save(`FactoryMind_Report_${machineData.machineName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Diagnosis Results</h1>
          <p className="text-muted-foreground">{machineData.machineName} — {factoryName}</p>
        </div>

        {/* Fault Card */}
        <div className="glass-card rounded-xl p-6 mb-6 energy-glow animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="font-display text-xl font-bold">{diagnosis.faultName}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent">{diagnosis.confidence}% Confidence</span>
              </div>
              <p className="text-muted-foreground mb-3">{diagnosis.explanation}</p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span className="font-medium">{diagnosis.recommendedAction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Loss */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: TrendingDown, label: 'Monthly Loss', value: formatCurrency(Math.round(energyLoss.monthlyCostLoss)), sub: `${Math.round(energyLoss.excessKwh)} kWh wasted` },
            { icon: TrendingDown, label: 'Annual Loss', value: formatCurrency(Math.round(energyLoss.annualCostLoss)), sub: `±15%: ${formatCurrency(marginLow(energyLoss.annualCostLoss))} – ${formatCurrency(marginHigh(energyLoss.annualCostLoss))}` },
            { icon: Leaf, label: 'CO₂ Saveable', value: `${Math.round(energyLoss.co2ReductionKg)} kg/yr`, sub: `${(energyLoss.co2ReductionKg / 1000).toFixed(1)} tonnes` },
          ].map((c, i) => (
            <div key={c.label} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
              <c.icon className="h-5 w-5 text-accent mb-2" />
              <div className="text-sm text-muted-foreground">{c.label}</div>
              <div className="font-display text-2xl font-bold gradient-text">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ROI Table */}
        <div className="glass-card rounded-xl p-6 mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" /> ROI Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium">Option</th>
                  <th className="text-right py-3 px-2 font-medium">Cost</th>
                  <th className="text-right py-3 px-2 font-medium">Monthly Saving</th>
                  <th className="text-right py-3 px-2 font-medium">Annual Saving</th>
                  <th className="text-right py-3 px-2 font-medium">Payback</th>
                </tr>
              </thead>
              <tbody>
                {roiOptions.map(o => (
                  <tr key={o.type} className={`border-b border-border/50 ${o.recommended ? 'bg-accent/5' : ''}`}>
                    <td className="py-3 px-2 font-medium flex items-center gap-2">
                      {o.type}
                      {o.recommended && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent text-accent-foreground">Best</span>}
                    </td>
                    <td className="text-right py-3 px-2">{formatCurrency(o.cost)}</td>
                    <td className="text-right py-3 px-2 text-accent font-medium">{formatCurrency(o.monthlySaving)}</td>
                    <td className="text-right py-3 px-2 text-accent font-medium">{formatCurrency(o.annualSaving)}</td>
                    <td className="text-right py-3 px-2">{o.paybackMonths} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '450ms' }}>
          <Button variant="hero" className="flex-1" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Download PDF Report
          </Button>
          <Button variant="hero-outline" className="flex-1" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="mr-2 h-4 w-4" /> Save to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
