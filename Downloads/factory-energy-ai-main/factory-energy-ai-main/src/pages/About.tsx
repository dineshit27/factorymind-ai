import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Factory, 
  Zap, 
  Target, 
  Users, 
  Award, 
  Lightbulb, 
  Heart, 
  Globe, 
  TrendingUp, 
  Shield, 
  Leaf,
  Brain,
  Code,
  Server,
  Cpu,
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  CheckCircle
} from 'lucide-react';

const teamMembers = [
  { 
    name: 'Dr. Ananya Verma', 
    role: 'CEO & Founder', 
    bio: 'Former energy consultant with 15+ years experience in industrial efficiency.',
    image: '👩‍💼',
    linkedin: '#',
    email: 'ananya@factorymind.ai'
  },
  { 
    name: 'Rahul Mehta', 
    role: 'CTO', 
    bio: 'AI/ML expert specialized in predictive maintenance and optimization.',
    image: '👨‍💻',
    linkedin: '#',
    email: 'rahul@factorymind.ai'
  },
  { 
    name: 'Priya Singh', 
    role: 'Head of Engineering', 
    bio: 'Full-stack engineer passionate about sustainable technology solutions.',
    image: '👩‍🔧',
    linkedin: '#',
    email: 'priya@factorymind.ai'
  },
  { 
    name: 'Vikram Sharma', 
    role: 'Data Scientist', 
    bio: 'PhD in Machine Learning, focused on energy pattern recognition.',
    image: '👨‍🔬',
    linkedin: '#',
    email: 'vikram@factorymind.ai'
  }
];

const technologies = [
  { icon: Brain, name: 'AI/ML Models', desc: 'Advanced algorithms for fault detection and pattern recognition' },
  { icon: Code, name: 'React & TypeScript', desc: 'Modern, type-safe frontend for seamless user experience' },
  { icon: Server, name: 'Cloud Infrastructure', desc: 'Scalable backend to handle millions of diagnostics' },
  { icon: Cpu, name: 'Real-time Analytics', desc: 'Instant processing and recommendations' }
];

const milestones = [
  { year: '2023', title: 'Foundation', desc: 'FactoryMind AI founded with mission to democratize energy efficiency' },
  { year: '2024', title: 'First 100 Factories', desc: 'Helped 100+ factories save over ₹50 lakhs in energy costs' },
  { year: '2025', title: 'AI Breakthrough', desc: 'Achieved 95% accuracy in fault detection without hardware sensors' },
  { year: '2026', title: 'National Impact', desc: 'Serving 500+ factories across India, saving 450 tons of CO₂' }
];

const values = [
  { icon: Heart, title: 'Accessibility', desc: 'Making professional energy consulting available to every factory, regardless of size or budget' },
  { icon: Leaf, title: 'Sustainability', desc: 'Committed to reducing industrial carbon footprint and building a greener future' },
  { icon: Shield, title: 'Trust', desc: 'Transparent calculations, no hidden costs, and data privacy as our top priority' },
  { icon: Target, title: 'Excellence', desc: 'Continuously improving our AI to provide the most accurate recommendations' }
];

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
            <Factory className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">About FactoryMind AI</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Empowering Factories Through
            <span className="gradient-text"> Intelligent Energy</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            We're on a mission to make industrial energy efficiency accessible, affordable, and actionable 
            for every factory in India. No expensive consultants. No complicated hardware. Just smart AI.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { icon: Users, value: '500+', label: 'Factories' },
              { icon: Award, value: '95%', label: 'Accuracy' },
              { icon: TrendingUp, value: '₹2.4Cr', label: 'Saved' },
              { icon: Leaf, value: '450T', label: 'CO₂ Reduced' }
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-6 min-w-[140px]">
                <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Story Tabs */}
      <section className="container mx-auto px-4 py-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="mission" className="text-sm md:text-base">
              <Target className="h-4 w-4 mr-2" />
              Mission
            </TabsTrigger>
            <TabsTrigger value="vision" className="text-sm md:text-base">
              <Lightbulb className="h-4 w-4 mr-2" />
              Vision
            </TabsTrigger>
            <TabsTrigger value="story" className="text-sm md:text-base">
              <Globe className="h-4 w-4 mr-2" />
              Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mission" className="glass-card rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To democratize industrial energy efficiency by providing every factory owner—regardless of size 
                  or budget—with instant access to professional-grade energy diagnostics through AI-powered technology.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that sustainability and profitability can go hand in hand. By making energy optimization 
                  simple, fast, and free, we're helping India's manufacturing sector reduce costs while building a 
                  cleaner, greener future.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vision" className="glass-card rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To become India's leading AI-powered energy platform, serving 10,000+ factories by 2028 and 
                  collectively saving 100,000 tons of CO₂ annually while reducing operational costs by billions of rupees.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We envision a future where every machine in every factory operates at peak efficiency, where energy 
                  waste is automatically detected and corrected, and where sustainability is not a luxury but the default.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="story" className="glass-card rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Story</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  FactoryMind AI was born from a simple observation: small and medium factories were losing thousands 
                  of rupees monthly to energy inefficiency, yet couldn't afford the ₹2-5 lakh cost of professional 
                  energy audits.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our founder, Dr. Ananya Verma, spent 15 years as an industrial energy consultant. She realized that 
                  80% of energy issues followed predictable patterns that AI could diagnose—without expensive sensors 
                  or site visits.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In 2023, we launched FactoryMind AI to prove that world-class energy consulting could be delivered 
                  through a web browser, in 20 minutes, at zero cost. Today, we're proud to serve 500+ factories and 
                  growing.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div 
                key={i} 
                className="glass-card-hover rounded-xl p-6 text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Key milestones in our mission to transform industrial energy</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/20 -translate-x-1/2" />

            {milestones.map((milestone, i) => (
              <div key={i} className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Content */}
                <div className={`w-full md:w-5/12 ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                  <div className="glass-card rounded-xl p-6">
                    <div className="font-display text-2xl font-bold text-accent mb-2">{milestone.year}</div>
                    <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-accent border-4 border-background z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Passionate experts combining energy engineering, AI, and software development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <Card 
                key={i}
                className={`glass-card-hover cursor-pointer transition-all duration-300 ${
                  hoveredMember === i ? 'scale-105 shadow-xl' : ''
                }`}
                onMouseEnter={() => setHoveredMember(i)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="font-display font-semibold text-lg mb-1">{member.name}</h3>
                  <div className="text-sm text-accent font-medium mb-3">{member.role}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
                  
                  {hoveredMember === i && (
                    <div className="flex gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <a 
                        href={`mailto:${member.email}`}
                        className="h-8 w-8 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
                      >
                        <Mail className="h-4 w-4 text-accent" />
                      </a>
                      <a 
                        href={member.linkedin}
                        className="h-8 w-8 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
                      >
                        <Linkedin className="h-4 w-4 text-accent" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built with modern, scalable technologies to deliver lightning-fast diagnostics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {technologies.map((tech, i) => (
            <div 
              key={i} 
              className="glass-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                <tech.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-2">{tech.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 glass-card rounded-xl p-8">
          <h3 className="font-display text-xl font-bold mb-4 text-center">Why Our AI Works</h3>
          <div className="space-y-3">
            {[
              'Trained on 10,000+ real factory equipment diagnostics',
              'Pattern recognition accuracy of 95%+ without physical sensors',
              'Continuously learning from every diagnosis to improve recommendations',
              'Privacy-first: your data never leaves our secure infrastructure'
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center energy-glow">
          <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Join 500+ Factories Already Saving Energy
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start your free AI-powered diagnosis today and discover how much you could save
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/diagnosis">
              <Button variant="hero" size="lg">
                Start Free Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2026 FactoryMind AI. Empowering factories with intelligent energy solutions.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="mailto:contact@factorymind.ai" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
