import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Zap, Gauge, ShieldCheck } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

const items = [
  { key: 'water', icon: <Droplet className="h-6 w-6 text-blue-500" />, title: 'Water Intelligence', desc: 'Track consumption, detect leaks & optimize usage patterns.', detail: 'Granular flow analytics, seasonal baselining, anomaly alerts, and predictive conservation insights.' },
  { key: 'energy', icon: <Zap className="h-6 w-6 text-amber-500" />, title: 'Energy Optimization', desc: 'Actionable analytics to reduce power costs & waste.', detail: 'Adaptive load profiling, peak shaving recommendations, and intelligent scheduling.' },
  { key: 'devices', icon: <Gauge className="h-6 w-6 text-indigo-500" />, title: 'Device Integration', desc: 'Connect meters & IoT sensors for unified control.', detail: 'Unified telemetry fabric across heterogeneous devices with low-latency streaming.' },
  { key: 'alerts', icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />, title: 'Preventive Alerts', desc: 'Early warnings on anomalies for proactive response.', detail: 'Behavioral drift detection and proactive interventions before costly incidents.' }
];

export const WhatWeDoSection: React.FC = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeKey = useMemo(() => items[selectedIndex]?.key ?? items[0].key, [selectedIndex]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on('select', onSelect);
    onSelect();
    return () => { api.off('select', onSelect); };
  }, [api]);

  // Autoplay every ~3.5s, pause on hover or when tab is hidden
  useEffect(() => {
    if (!api) return;
    let timer: number | undefined;
    const tick = () => {
      if (document.hidden || isHovered) return;
      api.scrollNext();
    };
    timer = window.setInterval(tick, 3500);
    const onVisibility = () => {
      // Reset interval when visibility changes
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(tick, 3500);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      if (timer) window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [api, isHovered]);

  return (
    <section className="relative isolate overflow-hidden py-12 md:py-16" aria-labelledby="what-we-do-heading">
      {/* Green gradient background similar to Our Impact */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700" />
      <div className="pointer-events-none absolute -top-10 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 space-y-8 text-white">
        <div className="text-center space-y-3">
          <h2 id="what-we-do-heading" className="text-2xl md:text-3xl font-bold tracking-tight">What We Do</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">A unified platform blending monitoring, analytics and automation.</p>
        </div>
  <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true, align: 'start' }}>
            <CarouselContent>
              {items.map((i, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <CarouselItem key={i.key} className="basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card className={`h-full relative overflow-hidden border border-emerald-100 bg-white text-foreground transition-all ${isActive ? 'shadow-lg ring-1 ring-emerald-200' : 'hover:shadow'}`}>
                      <CardHeader className="space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50">
                          {i.icon}
                        </div>
                        <CardTitle className="text-lg font-semibold tracking-tight">{i.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-snug">{i.desc}</p>
                      </CardContent>
                      <div className={`absolute bottom-0 left-0 h-1 bg-emerald-500/80 transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`} />
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;