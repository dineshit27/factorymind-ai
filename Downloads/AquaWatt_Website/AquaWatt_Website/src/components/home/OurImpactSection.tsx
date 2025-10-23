import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Counter animation component
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Extract number and suffix from value string (e.g., "100+" -> 100 and "+")
  const numericValue = parseInt(value.match(/\d+/)?.[0] || '0');
  const suffix = value.replace(/\d+/, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const duration = 2000; // 2 seconds animation

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, numericValue]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-extrabold leading-none tracking-tight">
      {count}{suffix}
    </div>
  );
};

export const OurImpactSection: React.FC = () => {
  const navigate = useNavigate();
  const handleMoreAbout = () => {
    // Navigate to home, then scroll to the "what we do" section
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('what-we-do');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  const stats = [
    { label: 'Users', value: '100+' },
    { label: 'State', value: '3+' },
    { label: 'Employees', value: '15' },
    { label: 'Years', value: '3+' },
    { label: 'Tests', value: '10' },
    { label: 'Communities', value: '50+' },
  ];

  return (
    <section
      aria-labelledby="our-impact-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Background gradient panel */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
      {/* Soft spotlight accents */}
      <div className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-white">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20">
            <Sparkles className="h-4 w-4" /> Our impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Left: Headline and copy */}
          <div className="md:col-span-6 space-y-5">
                <h2 id="our-impact-heading" className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  Made in India. Made for the world.
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-prose">
              AquaWatt helps families and businesses make smarter decisions about water and energy. Our footprint continues to grow with a focus on reliability, privacy, and sustainability.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={handleMoreAbout} className="bg-white text-blue-700 hover:bg-blue-50">
                More about AquaWatt
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href="#features"
                className="text-white/80 hover:text-white inline-flex items-center text-sm font-medium"
              >
              </a>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="md:col-span-6">
            <div className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl shadow-white/10 p-6 md:p-8 ring-1 ring-white/20">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="space-y-1.5">
                    <AnimatedCounter value={s.value} />
                    <div className="text-sm uppercase tracking-wide text-white/70">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurImpactSection;