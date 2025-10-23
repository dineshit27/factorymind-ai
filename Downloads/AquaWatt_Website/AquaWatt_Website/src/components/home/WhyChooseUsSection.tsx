import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Sparkles, Heart, Activity } from 'lucide-react';

const features = [
  { key: 'insight', icon: <Activity className="h-5 w-5 text-green-500" />, title: 'Real-time Insight', desc: 'Immediate visibility into usage & anomalies.', detail: 'We aggregate multi-source telemetry and surface outlier detection within seconds so you can act before waste compounds.' },
  { key: 'secure', icon: <ShieldCheck className="h-5 w-5 text-blue-500" />, title: 'Secure & Private', desc: 'Enterprise-grade security & data transparency.', detail: 'Zero trust aligned architecture: row level policies, encrypted transit & at-rest, and transparent consent layers.' },
  { key: 'automation', icon: <Sparkles className="h-5 w-5 text-purple-500" />, title: 'Intelligent Automation', desc: 'Smart suggestions & adaptive optimization.', detail: 'Our adaptive engine learns seasonal + behavioral patterns to orchestrate proactive adjustments that save without sacrifice.' },
  { key: 'sustain', icon: <Heart className="h-5 w-5 text-rose-500" />, title: 'Sustainability Focused', desc: 'Designed to reduce waste & footprint.', detail: 'Every UI decision is tied to measurable environmental metrics encouraging sustained reduction habits.' }
];

export const WhyChooseUsSection: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="py-12 md:py-16 bg-muted/30" aria-labelledby="why-choose-heading">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 id="why-choose-heading" className="text-2xl md:text-3xl font-bold tracking-tight">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">A platform built with performance, trust, and sustainability at its core.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => {
            const isActive = active === f.key;
            return (
              <Card
                key={f.key}
                tabIndex={0}
                onClick={() => setActive(isActive ? null : f.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(isActive ? null : f.key);
                  }
                }}
                className={`relative cursor-pointer transition-all border-border/70 focus-visible:ring-2 focus-visible:ring-primary/50 focus:outline-none ${
                  isActive ? 'shadow-lg bg-background' : 'hover:shadow-md'
                }`}
              >
                <div className="absolute inset-0 rounded-lg opacity-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-primary/5 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="pb-3 flex flex-row items-center gap-3 relative z-10">
                  <div className="rounded-md bg-background p-2 border transition-transform duration-300">
                    {f.icon}
                  </div>
                  <CardTitle className="text-base font-semibold leading-tight pr-2">
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-2">
                  <p className="text-sm text-muted-foreground leading-snug line-clamp-3">
                    {f.desc}
                  </p>
                  <div
                    className={`text-xs text-foreground/80 leading-snug transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${
                      isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {f.detail}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;