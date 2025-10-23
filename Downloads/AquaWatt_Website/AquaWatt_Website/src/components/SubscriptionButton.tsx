import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Crown, Droplet, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PlanKey = 'water' | 'electricity' | 'premium';

const formatINR = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  } catch {
    return '₹' + amount.toFixed(0);
  }
};

const PLANS: Record<PlanKey, { name: string; icon: React.ReactNode; priceYearInr: number; features: { label: string; included: boolean }[] } > = {
  water: {
    name: 'Water Package',
    icon: <Droplet className='h-5 w-5 text-water-dark' />,
    priceYearInr: 1000,
    features: [
      { label: 'Water usage monitor', included: true },
      { label: '24/7 customer service', included: true },
      { label: 'AI powered Insights', included: true },
      { label: 'Community support', included: false },
      { label: 'Monthly reports (PDF)', included: false },
    ],
  },
  electricity: {
    name: 'Electricity Package',
    icon: <Zap className='h-5 w-5 text-energy-dark' />,
    priceYearInr: 1000,
    features: [
      { label: 'Electricity usage monitor', included: true },
      { label: '24/7 customer service', included: true },
      { label: 'AI powered Insights', included: true },
      { label: 'Community support', included: false },
      { label: 'Monthly reports (PDF)', included: false },
    ],
  },
  premium: {
    name: 'Premium Package',
    icon: <Crown className='h-5 w-5 text-primary' />,
    priceYearInr: 1750,
    features: [
      { label: 'Water usage monitor', included: true },
      { label: 'Electricity usage monitor', included: true },
      { label: '24/7 customer service', included: true },
      { label: 'Community support', included: true },
      { label: 'All Feature Access', included: true },
    ],
  },
};

export function SubscriptionButton() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanKey | null>(null);
  const [nextRenewal, setNextRenewal] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aquawatt.subscription.plan') as PlanKey | null;
    if (saved && ['water','electricity','premium'].includes(saved)) setCurrentPlan(saved as PlanKey);
    const nr = localStorage.getItem('aquawatt.subscription.nextRenewalAt');
    if (nr) setNextRenewal(nr);
  }, []);

  const label = useMemo(() => (currentPlan ? 'upgrade' : 'Subscribe'), [currentPlan]);

  const subscribe = (plan: PlanKey) => {
    localStorage.setItem('aquawatt.subscription.plan', plan);
    // set next renewal to one year from now
    const dt = new Date();
    dt.setFullYear(dt.getFullYear() + 1);
    const iso = dt.toISOString();
    localStorage.setItem('aquawatt.subscription.nextRenewalAt', iso);
    setCurrentPlan(plan);
    setNextRenewal(iso);
    toast({ title: 'Subscription updated', description: `You are now on the ${PLANS[plan].name}.` });
    setOpen(false);
  };

  const cancelSubscription = () => {
    localStorage.removeItem('aquawatt.subscription.plan');
    localStorage.removeItem('aquawatt.subscription.nextRenewalAt');
    setCurrentPlan(null);
    setNextRenewal(null);
    toast({ title: 'Subscription canceled', description: 'You can subscribe again anytime.' });
  };

  const renewSubscription = () => {
    if (!currentPlan) {
      toast({ title: 'No active plan', description: 'Choose a plan to subscribe first.' });
      return;
    }
    const dt = new Date();
    dt.setFullYear(dt.getFullYear() + 1);
    const iso = dt.toISOString();
    localStorage.setItem('aquawatt.subscription.nextRenewalAt', iso);
    setNextRenewal(iso);
    toast({ title: 'Subscription renewed', description: `${PLANS[currentPlan].name} renewed until ${dt.toLocaleDateString('en-IN')}.` });
  };

  const PlanCard = ({ planKey }: { planKey: PlanKey }) => {
    const plan = PLANS[planKey];
    const isActive = currentPlan === planKey;
    return (
      <Card className={`transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center justify-between text-base'>
            <span className='flex items-center gap-2'>
              {plan.icon}
              {plan.name}
            </span>
            {planKey === 'premium' && (
              <Badge variant='default'>Popular</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div>
            <div className='text-2xl font-semibold'>{formatINR(plan.priceYearInr)}<span className='text-sm text-muted-foreground'>/year</span></div>
          </div>
          <ul className='space-y-2 text-sm'>
            {plan.features.map((f, idx) => (
              <li key={idx} className='flex items-center gap-2'>
                {f.included ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <X className='h-4 w-4 text-muted-foreground' />
                )}
                <span className={f.included ? '' : 'text-muted-foreground'}>{f.label}</span>
              </li>
            ))}
          </ul>
          <Button className='w-full' onClick={() => subscribe(planKey)} variant={planKey==='premium' ? 'default' : 'outline'}>
            {isActive ? 'Current Plan' : 'Choose Plan'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' size='sm' className='whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white'>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <PlanCard planKey='water' />
          <PlanCard planKey='electricity' />
          <PlanCard planKey='premium' />
        </div>
        <Separator className='my-2' />
        {currentPlan && (
          <div className='mb-3'>
            <div className='text-sm'>
              <span className='font-medium'>Current:</span> {PLANS[currentPlan].name}
              <span className='mx-2'>•</span>
              <span className='font-medium'>Next renewal:</span> {nextRenewal ? new Date(nextRenewal).toLocaleDateString('en-IN') : '—'}
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
              <Button onClick={renewSubscription} className='bg-blue-600 hover:bg-blue-700 text-white'>Renew Subscription</Button>
              <Button onClick={cancelSubscription} variant='destructive'>Cancel Subscription</Button>
            </div>
          </div>
        )}
        <div className='text-sm text-muted-foreground'>
          Custom package also available. <Button variant='link' className='px-1' onClick={() => toast({ title: 'Custom package', description: 'Our team will reach out to tailor a plan for you.' })}>Contact us</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionButton;
