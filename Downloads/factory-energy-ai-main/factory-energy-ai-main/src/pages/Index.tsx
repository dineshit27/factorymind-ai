import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Factory, Zap, BarChart3, FileText, ArrowRight, Leaf, Clock, Shield, CheckCircle, TrendingDown, Users, Award, Brain, Target, Gauge, Database, LineChart, Activity } from 'lucide-react';
import heroImage from '@/assets/hero-factory.jpg';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState, useRef } from 'react';

const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

const features = [
  { icon: Zap, title: 'AI Diagnosis', desc: 'Identify energy faults in air compressors and motors through simple conversation.' },
  { icon: BarChart3, title: 'ROI Calculator', desc: 'Compare repair, replace, and upgrade options with exact payback periods.' },
  { icon: FileText, title: 'PDF Reports', desc: 'Download professional reports with diagnosis, losses, and recommendations.' },
  { icon: Leaf, title: 'CO₂ Impact', desc: 'See your environmental impact and yearly carbon reduction estimates.' },
  { icon: Clock, title: '20 Min Diagnosis', desc: 'Complete energy audit in under 20 minutes with no hardware needed.' },
  { icon: Shield, title: 'Track Savings', desc: 'Dashboard to monitor savings, bill trends, and calibration over time.' },
];

const ImpactStat = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  label, 
  isVisible, 
  decimals = 0 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string; 
  label: string; 
  isVisible: boolean; 
  decimals?: number;
}) => {
  const count = useCountUp(value, 2000, isVisible);
  const displayValue = decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(decimals) : count;
  
  return (
    <div className="text-center transform transition-all duration-500 hover:scale-110">
      <div className="font-display text-3xl md:text-4xl font-bold text-accent mb-2">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>()
  const [enterpriseApi, setEnterpriseApi] = useState<CarouselApi>()
  const [isImpactVisible, setIsImpactVisible] = useState(false);
  const impactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) {
      return
    }

    const intervalId = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(intervalId)
  }, [api])

  useEffect(() => {
    if (!enterpriseApi) {
      return
    }

    const intervalId = setInterval(() => {
      enterpriseApi.scrollNext()
    }, 3500)

    return () => clearInterval(intervalId)
  }, [enterpriseApi])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isImpactVisible) {
          setIsImpactVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (impactRef.current) {
      observer.observe(impactRef.current);
    }

    return () => observer.disconnect();
  }, [isImpactVisible]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Factory" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/95" />
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Energy Diagnostics</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Your Factory's{' '}
            <span className="gradient-text">Energy Engineer</span>
            {' '}in a Browser
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FactoryMind AI gives every small factory owner the power of a professional energy engineer — free, in 20 minutes, through nothing but a web browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/diagnosis">
              <Button variant="hero" size="lg" className="text-base px-8">
                Start Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg" className="text-base px-8">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            {[
              { value: '20min', label: 'Diagnosis Time' },
              { value: '₹0', label: 'No Hardware Cost' },
              { value: '30%', label: 'Avg. Energy Saved' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section ref={impactRef} className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground">Real results from factories using FactoryMind AI</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <ImpactStat value={500} suffix="+" label="Factories Served" isVisible={isImpactVisible} />
            <ImpactStat value={2.4} suffix="Cr" prefix="₹" label="Total Savings" isVisible={isImpactVisible} decimals={1} />
            <ImpactStat value={1200} suffix="+" label="Machines Diagnosed" isVisible={isImpactVisible} />
            <ImpactStat value={450} suffix="T" label="CO₂ Reduced" isVisible={isImpactVisible} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">No sensors. No technicians. Just answer a few questions and get a complete energy audit.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/30 cursor-pointer group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-3">
                <f.icon className="h-6 w-6 text-accent transition-all duration-300 group-hover:scale-125" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 transition-colors duration-300 group-hover:text-accent">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How FactoryMind AI Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to start saving energy and reducing costs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Select Machine', desc: 'Choose from compressors, motors, pumps, boilers, chillers, or HVAC systems.' },
              { step: '02', title: 'Describe Symptoms', desc: 'Chat with our AI and describe what issues you\'re experiencing with your machine.' },
              { step: '03', title: 'Get Results', desc: 'Receive detailed diagnosis, energy loss calculations, and ROI recommendations instantly.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="glass-card rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/30 cursor-pointer group">
                  <div className="text-5xl font-display font-bold text-accent/20 mb-4 transition-all duration-300 group-hover:text-accent/40 group-hover:scale-110">{item.step}</div>
                  <h3 className="font-display font-semibold text-xl mb-3 transition-colors duration-300 group-hover:text-accent">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="h-8 w-8 text-accent/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Resource Intelligence */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-4">
            <Brain className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Advanced Analytics</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Resource Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Powered by advanced AI algorithms, our platform delivers actionable insights that transform how you manage energy resources</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setEnterpriseApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {[
                { 
                  icon: Target, 
                  title: 'Predictive Analytics', 
                  desc: 'AI-driven forecasting identifies potential failures and inefficiencies before they impact your operations, reducing downtime by up to 40%.',
                  gradient: 'from-blue-500/10 to-cyan-500/10'
                },
                { 
                  icon: Gauge, 
                  title: 'Real-Time Optimization', 
                  desc: 'Continuous monitoring and instant recommendations help you optimize energy consumption patterns throughout your facility.',
                  gradient: 'from-purple-500/10 to-pink-500/10'
                },
                { 
                  icon: Database, 
                  title: 'Historical Analysis', 
                  desc: 'Deep learning algorithms analyze years of operational data to uncover hidden patterns and optimization opportunities.',
                  gradient: 'from-green-500/10 to-emerald-500/10'
                },
                { 
                  icon: LineChart, 
                  title: 'Performance Benchmarking', 
                  desc: 'Compare your facility\'s performance against industry standards and similar operations to identify improvement areas.',
                  gradient: 'from-orange-500/10 to-red-500/10'
                },
                { 
                  icon: Activity, 
                  title: 'Anomaly Detection', 
                  desc: 'Machine learning models detect unusual consumption patterns and equipment behavior instantly, preventing costly issues.',
                  gradient: 'from-indigo-500/10 to-violet-500/10'
                },
                { 
                  icon: Brain, 
                  title: 'Smart Recommendations', 
                  desc: 'Context-aware AI suggests specific actions prioritized by ROI, payback period, and environmental impact.',
                  gradient: 'from-teal-500/10 to-cyan-500/10'
                },
              ].map((feature, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div 
                    className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/30 cursor-pointer group"
                  >
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <feature.icon className="h-7 w-7 text-accent transition-transform duration-300 group-hover:scale-125" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 transition-colors duration-300 group-hover:text-accent">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground">{feature.desc}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex hover:scale-110 hover:bg-accent hover:text-accent-foreground transition-all duration-300" />
            <CarouselNext className="hidden md:flex hover:scale-110 hover:bg-accent hover:text-accent-foreground transition-all duration-300" />
          </Carousel>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Choose FactoryMind AI?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Proven benefits for small and medium factories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingDown, title: 'Reduce Bills by 30%', desc: 'Average energy cost reduction within the first 3 months.' },
            { icon: Leaf, title: 'Lower CO₂ Emissions', desc: 'Track your carbon footprint and contribute to sustainability.' },
            { icon: Clock, title: 'Save Time', desc: 'No need to hire expensive consultants or wait weeks for reports.' },
            { icon: Award, title: 'Expert Knowledge', desc: 'Access professional-grade diagnostics for free.' },
          ].map((benefit, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 cursor-pointer group">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-6">
                <benefit.icon className="h-7 w-7 text-accent transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 transition-colors duration-300 group-hover:text-accent">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What Factory Owners Say</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Real feedback from businesses saving energy</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {[
                { name: 'Rajesh Kumar', role: 'Owner, Kumar Textiles', quote: 'FactoryMind AI identified an air leak in our compressor that was costing us ₹4,200 per month. Fixed it in 2 days!', savings: '₹50,000/year' },
                { name: 'Priya Sharma', role: 'Manager, Sharma Manufacturing', quote: 'We never thought our old motor was wasting so much energy. The ROI calculator helped us make the right upgrade decision.', savings: '₹1,20,000/year' },
                { name: 'Amit Patel', role: 'Director, Patel Industries', quote: 'Professional diagnosis without the professional cost. This tool is a game changer for small factories like ours.', savings: '₹80,000/year' },
                { name: 'Dinesh M', role: 'CTO, Modern Manufacturing', quote: 'The detailed PDF reports made it easy to convince management to invest in energy-efficient upgrades. ROI was achieved in 8 months!', savings: '₹1,10,000/year' },
                { name: 'Ajay C', role: 'Plant Manager, AC Steel Works', quote: 'We use FactoryMind AI for quarterly audits now. The dashboard tracks our progress and we\'ve cut energy costs by 28% this year.', savings: '₹95,000/year' },
              ].map((testimonial, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/40 cursor-pointer group">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="text-accent transition-all duration-200 group-hover:scale-125 group-hover:text-yellow-400" style={{ transitionDelay: `${j * 50}ms` }}>★</div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic transition-colors duration-300 group-hover:text-foreground">"{testimonial.quote}"</p>
                    <div className="border-t border-border pt-4 transition-colors duration-300 group-hover:border-accent/30">
                      <div className="font-semibold transition-colors duration-300 group-hover:text-accent">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      <div className="text-sm text-accent font-semibold mt-2 transition-all duration-300 group-hover:scale-110 inline-block">Saved: {testimonial.savings}</div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex hover:scale-110 hover:bg-accent hover:text-accent-foreground transition-all duration-300" />
            <CarouselNext className="hidden md:flex hover:scale-110 hover:bg-accent hover:text-accent-foreground transition-all duration-300" />
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center energy-glow">
          <Factory className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Ready to Cut Energy Waste?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Start your free diagnosis now and discover how much your factory could save.</p>
          <Link to="/diagnosis">
            <Button variant="hero" size="lg">Start Free Diagnosis <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
