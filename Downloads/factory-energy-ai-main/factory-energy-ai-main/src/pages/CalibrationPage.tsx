import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export default function CalibrationPage() {
  const [actualBill, setActualBill] = useState('');
  const [predicted] = useState(35000);
  const [submitted, setSubmitted] = useState(false);

  const actual = parseFloat(actualBill) || 0;
  const diff = actual - predicted;
  const diffPercent = predicted > 0 ? ((diff / predicted) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="font-display text-3xl font-bold mb-2">Monthly Calibration</h1>
        <p className="text-muted-foreground mb-8">Enter this month's actual electricity bill to calibrate predictions.</p>

        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="text-sm text-muted-foreground mb-1">Predicted Bill</div>
          <div className="font-display text-3xl font-bold gradient-text">₹{predicted.toLocaleString('en-IN')}</div>
          <div className="text-xs text-muted-foreground mt-1">Based on your diagnosis and repairs</div>
        </div>

        <div className="glass-card rounded-xl p-6 mb-6">
          <Label className="mb-2 block">Actual Bill This Month (₹)</Label>
          <Input
            type="number"
            placeholder="Enter actual bill amount"
            value={actualBill}
            onChange={e => { setActualBill(e.target.value); setSubmitted(false); }}
          />

          {actual > 0 && (
            <div className={`mt-4 p-4 rounded-lg ${diff <= 0 ? 'bg-accent/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center gap-2">
                {diff <= 0 ? <TrendingDown className="h-5 w-5 text-accent" /> : <TrendingUp className="h-5 w-5 text-destructive" />}
                <span className={`font-semibold ${diff <= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {diff <= 0 ? `₹${Math.abs(diff).toLocaleString('en-IN')} below prediction (${Math.abs(parseFloat(diffPercent))}% less)` : `₹${diff.toLocaleString('en-IN')} above prediction (${diffPercent}% more)`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {diff <= 0 ? 'Great! Your repairs are working. Energy consumption is trending down.' : 'The bill is higher than expected. Consider re-running diagnosis to check for new faults.'}
              </p>
            </div>
          )}

          <Button
            variant="hero"
            className="w-full mt-4"
            disabled={!actual || submitted}
            onClick={() => setSubmitted(true)}
          >
            {submitted ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Saved</> : 'Save Calibration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
