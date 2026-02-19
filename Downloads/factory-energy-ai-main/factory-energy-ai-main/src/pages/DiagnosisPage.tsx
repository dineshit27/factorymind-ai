import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDiagnosis } from '@/contexts/DiagnosisContext';
import { MachineData, diagnoseFault, calculateEnergyLoss, calculateROI } from '@/lib/calculations';
import { Factory, Wind, Cog, ArrowRight, Send, Bot, User, Droplet, Flame, Snowflake, Fan, CheckCircle2, TrendingUp, TrendingDown, Gauge } from 'lucide-react';

type Step = 'type' | 'form' | 'chat' | 'processing';

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { setMachineData, setDiagnosis, setEnergyLoss, setRoiOptions, addChatMessage, setFactoryName, chatMessages } = useDiagnosis();

  const [step, setStep] = useState<Step>('type');
  const [machineType, setMachineType] = useState<'compressor' | 'motor' | 'pump' | 'boiler' | 'chiller' | 'hvac'>('compressor');
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [symptomText, setSymptomText] = useState('');

  // Calibration state
  const [actualBill, setActualBill] = useState('');
  const [predictedBill] = useState(35000);
  const [calibrationSubmitted, setCalibrationSubmitted] = useState(false);

  const [form, setForm] = useState({
    factoryName: '',
    machineName: '',
    ratedPower: '',
    powerUnit: 'HP' as 'HP' | 'kW',
    dailyHours: '',
    electricityCost: '',
    bill1: '',
    bill2: '',
    bill3: '',
    machineAge: '',
    maintenanceHistory: '',
  });

  const updateForm = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('chat');
    let greeting = '';
    switch (machineType) {
      case 'compressor':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected an Air Compressor — "${form.machineName}". Let's figure out what's going on. Can you describe any symptoms you've noticed? For example: unusual noise, air leaks, overheating, high electricity bills, or the compressor running continuously.`;
        break;
      case 'motor':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected an Induction Motor — "${form.machineName}". Let's diagnose it together. Can you tell me what symptoms you've noticed? For example: overheating, vibration, unusual noise, high bills, or tripping.`;
        break;
      case 'pump':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected a Pump — "${form.machineName}". Let's identify the issue. What symptoms have you observed? For example: reduced flow, cavitation noise, seal leaks, vibration, or high power consumption.`;
        break;
      case 'boiler':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected a Boiler — "${form.machineName}". Let's examine the problem. What issues are you experiencing? For example: scale buildup, soot, poor combustion, steam leaks, or increased fuel consumption.`;
        break;
      case 'chiller':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected a Chiller — "${form.machineName}". Let's diagnose the system. What symptoms have you noticed? For example: poor cooling, refrigerant leak, high pressure, dirty coils, or increased power consumption.`;
        break;
      case 'hvac':
        greeting = `Hello! I'm your AI Energy Consultant. You've selected an HVAC System — "${form.machineName}". Let's find the issue. What problems are you facing? For example: poor airflow, filter clogging, duct leaks, thermostat issues, or high energy bills.`;
        break;
    }
    setLocalMessages([{ role: 'ai', content: greeting }]);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setSymptomText(prev => prev + ' ' + userMsg);
    setLocalMessages(msgs => [...msgs, { role: 'user', content: userMsg }]);

    // follow-up diagnosis
    setTimeout(() => {
      if (localMessages.filter(m => m.role === 'user').length < 1) {
        setLocalMessages(msgs => [...msgs, {
          role: 'ai',
          content: `Thanks for that info! A couple more questions:\n\n• How often does this happen — continuously or intermittently?\n• Have you noticed any changes in your electricity bill recently?\n\nThis helps me narrow down the fault.`
        }]);
      } else {
        const machineNames: Record<typeof machineType, string> = {
          compressor: 'air compressor',
          motor: 'induction motor',
          pump: 'pump',
          boiler: 'boiler',
          chiller: 'chiller',
          hvac: 'HVAC system'
        };
        setLocalMessages(msgs => [...msgs, {
          role: 'ai',
          content: `Great, I have enough information to run the diagnosis. Let me analyze your ${machineNames[machineType]} now...`
        }]);
        setTimeout(() => runDiagnosis(userMsg), 1500);
      }
    }, 800);
  };

  const runDiagnosis = (lastSymptom: string) => {
    const allSymptoms = symptomText + ' ' + lastSymptom;
    const machineData: MachineData = {
      machineName: form.machineName,
      machineType,
      ratedPower: parseFloat(form.ratedPower) || 10,
      powerUnit: form.powerUnit,
      dailyHours: parseFloat(form.dailyHours) || 8,
      electricityCost: parseFloat(form.electricityCost) || 8,
      lastThreeMonthsBills: [
        parseFloat(form.bill1) || 0,
        parseFloat(form.bill2) || 0,
        parseFloat(form.bill3) || 0,
      ],
      machineAge: parseFloat(form.machineAge) || 5,
      maintenanceHistory: form.maintenanceHistory,
    };

    const fault = diagnoseFault(machineType, allSymptoms);
    const loss = calculateEnergyLoss(machineData, fault);
    const roi = calculateROI(loss, machineData);

    setMachineData(machineData);
    setDiagnosis(fault);
    setEnergyLoss(loss);
    setRoiOptions(roi);
    setFactoryName(form.factoryName);
    localMessages.forEach(m => addChatMessage(m));

    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Diagnosis Section */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {(['type', 'form', 'chat'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s || (['type', 'form', 'chat'].indexOf(step) > i) ? 'gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{s === 'type' ? 'Machine' : s === 'form' ? 'Details' : 'Chat'}</span>
                  {i < 2 && <div className="w-8 h-0.5 bg-border" />}
                </div>
              ))}
            </div>

        {/* Step 1: Type Selection */}
        {step === 'type' && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold mb-2">Select Machine Type</h1>
            <p className="text-muted-foreground mb-8">Choose the type of machine you want to diagnose.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { type: 'compressor' as const, icon: Wind, label: 'Air Compressor', desc: 'Reciprocating, screw, or scroll compressors' },
                { type: 'motor' as const, icon: Cog, label: 'Induction Motor', desc: 'Single or three-phase AC motors' },
                { type: 'pump' as const, icon: Droplet, label: 'Pump', desc: 'Centrifugal, submersible, or positive displacement pumps' },
                { type: 'boiler' as const, icon: Flame, label: 'Boiler', desc: 'Steam or hot water boilers' },
                { type: 'chiller' as const, icon: Snowflake, label: 'Chiller', desc: 'Air-cooled or water-cooled chillers' },
                { type: 'hvac' as const, icon: Fan, label: 'HVAC System', desc: 'Heating, ventilation, and air conditioning' },
              ].map(m => (
                <button
                  key={m.type}
                  onClick={() => { setMachineType(m.type); setStep('form'); }}
                  className={`glass-card-hover rounded-xl p-6 text-left transition-all ${machineType === m.type ? 'border-accent energy-glow' : ''}`}
                >
                  <div className="h-14 w-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <m.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{m.label}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 'form' && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold mb-2">Machine Details</h1>
            <p className="text-muted-foreground mb-6">Enter your {machineType === 'compressor' ? 'air compressor' : 'induction motor'} details.</p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Factory Name</Label>
                  <Input placeholder="My Factory" value={form.factoryName} onChange={e => updateForm('factoryName', e.target.value)} required />
                </div>
                <div>
                  <Label>Machine Name</Label>
                  <Input placeholder="Main Compressor" value={form.machineName} onChange={e => updateForm('machineName', e.target.value)} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label>Rated Power</Label>
                  <Input type="number" placeholder="10" value={form.ratedPower} onChange={e => updateForm('ratedPower', e.target.value)} required />
                </div>
                <div>
                  <Label>Unit</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.powerUnit} onChange={e => updateForm('powerUnit', e.target.value)}>
                    <option value="HP">HP</option>
                    <option value="kW">kW</option>
                  </select>
                </div>
                <div>
                  <Label>Daily Operating Hours</Label>
                  <Input type="number" placeholder="8" value={form.dailyHours} onChange={e => updateForm('dailyHours', e.target.value)} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Electricity Cost (₹/unit)</Label>
                  <Input type="number" placeholder="8" value={form.electricityCost} onChange={e => updateForm('electricityCost', e.target.value)} required />
                </div>
                <div>
                  <Label>Machine Age (years)</Label>
                  <Input type="number" placeholder="5" value={form.machineAge} onChange={e => updateForm('machineAge', e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>Last 3 Months Bills (₹)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" placeholder="Month 1" value={form.bill1} onChange={e => updateForm('bill1', e.target.value)} />
                  <Input type="number" placeholder="Month 2" value={form.bill2} onChange={e => updateForm('bill2', e.target.value)} />
                  <Input type="number" placeholder="Month 3" value={form.bill3} onChange={e => updateForm('bill3', e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Maintenance History</Label>
                <Textarea placeholder="Describe recent repairs, servicing, or issues..." value={form.maintenanceHistory} onChange={e => updateForm('maintenanceHistory', e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep('type')}>Back</Button>
                <Button type="submit" variant="hero" className="flex-1">
                  Continue to AI Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Chat */}
        {step === 'chat' && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-bold mb-2">AI Consultation</h1>
            <p className="text-muted-foreground mb-6">Describe symptoms to get a diagnosis.</p>

            <div className="glass-card rounded-xl p-4 min-h-[400px] flex flex-col">
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[400px]">
                {localMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Describe symptoms (e.g., unusual noise, overheating...)"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                />
                <Button variant="hero" size="icon" onClick={handleChat}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
          </div>

          {/* Monthly Calibration Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-bold">Monthly Calibration</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Track actual vs predicted bills to improve accuracy
              </p>

              <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-4 mb-4 border border-accent/20">
                <div className="text-xs text-muted-foreground mb-1">Predicted Bill</div>
                <div className="font-display text-2xl font-bold gradient-text">
                  ₹{predictedBill.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on diagnosis & repairs
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Actual Bill This Month (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter actual amount"
                    value={actualBill}
                    onChange={e => { 
                      setActualBill(e.target.value); 
                      setCalibrationSubmitted(false); 
                    }}
                    className="transition-all duration-300 focus:border-accent"
                  />
                </div>

                {parseFloat(actualBill) > 0 && (
                  <div className={`p-4 rounded-lg transition-all duration-300 ${
                    (parseFloat(actualBill) - predictedBill) <= 0 
                      ? 'bg-accent/10 border border-accent/30' 
                      : 'bg-destructive/10 border border-destructive/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {(parseFloat(actualBill) - predictedBill) <= 0 ? (
                        <TrendingDown className="h-5 w-5 text-accent" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-destructive" />
                      )}
                      <span className={`font-semibold text-sm ${
                        (parseFloat(actualBill) - predictedBill) <= 0 
                          ? 'text-accent' 
                          : 'text-destructive'
                      }`}>
                        {(parseFloat(actualBill) - predictedBill) <= 0 
                          ? `₹${Math.abs(parseFloat(actualBill) - predictedBill).toLocaleString('en-IN')} below` 
                          : `₹${(parseFloat(actualBill) - predictedBill).toLocaleString('en-IN')} above`
                        }
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {(parseFloat(actualBill) - predictedBill) <= 0 
                        ? 'Excellent! Repairs are working as expected.' 
                        : 'Higher than predicted. Consider re-running diagnosis.'}
                    </p>
                  </div>
                )}

                <Button
                  variant="hero"
                  className="w-full transition-all duration-300"
                  disabled={!parseFloat(actualBill) || calibrationSubmitted}
                  onClick={() => setCalibrationSubmitted(true)}
                >
                  {calibrationSubmitted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> 
                      Saved
                    </>
                  ) : (
                    'Save Calibration'
                  )}
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-xs text-muted-foreground mb-3">Calibration Benefits</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Improve prediction accuracy</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Track savings over time</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Identify new issues early</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
