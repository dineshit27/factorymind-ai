
import React, { useState, useEffect, useRef } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { 
  Phone, Mail, Copy, Check, Activity, Droplet, Zap, Gauge, 
  ShieldCheck, Sparkles, Users, Award, Heart, Star, 
  MapPin, Calendar, TrendingUp, Globe, Target, Lightbulb,
  ChevronRight, ExternalLink, User
} from "lucide-react";
import { teamMembers } from "@/data/team";

const About = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Animation counter for stats
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Ensure the About page starts at the top when navigated to
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Immediate reset
    el.scrollTop = 0;
    // After next paint (guards against late focus/auto-scroll)
    requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
  }, []);

  const metrics = [
    { icon: <Droplet className="h-5 w-5" />, label: "Water Saved", value: 125000, suffix: "L", color: "text-blue-500" },
    { icon: <Zap className="h-5 w-5" />, label: "Energy Saved", value: 64, suffix: "MWh", color: "text-yellow-500" },
    { icon: <Users className="h-5 w-5" />, label: "Active Users", value: 2847, suffix: "", color: "text-green-500" },
    { icon: <Award className="h-5 w-5" />, label: "CO₂ Reduced", value: 89, suffix: "t", color: "text-purple-500" }
  ];

  // Team members are now managed in src/data/team.ts. Add your photos in public/team and update that file.

  const milestones = [
    { year: "2024", title: "Team Formed", desc: "Started with a vision to make homes smarter" },
    { year: "2024", title: "Prototype Launched", desc: "Released first version AquaWatt working model" },
    { year: "2025", title: "Iot Integration", desc: "Worked on the hardware and IoT components." },
    { year: "2025", title: "Launched Website", desc: "Build and deployed the AquaWatt website with advanced vision" }
  ];

  const handleCall = () => {
    window.location.href = "tel:+918122129450";
    toast({
      title: "Initiating Call",
      description: "Calling +91 8122129450",
    });
  };

  const handleEmail = () => {
    window.location.href = "mailto:enquiries@aquawatt.com";
    toast({
      title: "Composing Email",
      description: "Opening email client to enquiries@aquawatt.com",
    });
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col w-full md:w-auto">
        <DashboardHeader />
        <div className="flex-1">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-background">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
            <div className="relative px-6 py-12 sm:py-16 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className="flex flex-col justify-center">
                    <Badge className="mb-4 w-fit" variant="secondary">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Revolutionizing Utility Management
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                      About{" "}
                      <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        AQUAWATT
                      </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      We're building the future of smart utility management. Our comprehensive platform
                      helps households monitor, optimize, and control their water and electricity consumption
                      through cutting-edge technology and beautiful interfaces.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button size="lg" onClick={handleEmail}>
                        <Mail className="mr-2 h-5 w-5" />
                        Get in Touch
                      </Button>
                      <Button size="lg" variant="outline" onClick={handleCall}>
                        <Phone className="mr-2 h-5 w-5" />
                        Call Us
                      </Button>
                    </div>
                  </div>
                  
                  {/* Animated Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric, index) => (
                      <Card 
                        key={metric.label}
                        className={`transition-all duration-500 hover:scale-105 ${
                          activeMetric === index ? 'ring-2 ring-primary shadow-lg' : ''
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className={`${metric.color} mb-2`}>
                            {metric.icon}
                          </div>
                          <div className="text-2xl font-bold">
                            {mounted ? metric.value.toLocaleString() : 0}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              {metric.suffix}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Removed SupabaseTest, EmailTest, DataSetup per requirements */}

          <div className="px-6 py-12">
            <div className="mx-auto max-w-6xl space-y-12">
              {/* Main Content Tabs */}
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="story">Our Story</TabsTrigger>
                  <TabsTrigger value="mission">Mission</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="story" className="mt-8">
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Our Journey
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-lg">
                            AQUAWATT started from a simple observation: families were struggling to understand
                            and control their utility consumption. Traditional meters provided data, but not insights.
                            Bills came as surprises, not as helpful feedback loops.
                          </p>
                          <p>
                            We envisioned a world where every household could effortlessly monitor their resource
                            usage, receive intelligent recommendations, and take meaningful action toward sustainability.
                            Our platform combines real-time monitoring, predictive analytics, and automated controls
                            to make this vision a reality.
                          </p>
                          <p>
                            Today, AQUAWATT serves thousands of households worldwide, helping them save money,
                            reduce waste, and contribute to a more sustainable future. But we're just getting started.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mission" className="mt-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          Our Mission
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg mb-4">
                          To democratize smart utility management and empower every household to make
                          informed decisions about their resource consumption.
                        </p>
                        <p>
                          We believe that sustainability shouldn't require sacrifice. Through intelligent
                          automation and beautiful user experiences, we make it easy for families to
                          reduce their environmental impact while saving money.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-green-500" />
                          Our Vision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg mb-4">
                          A world where every home is intelligently connected, efficiently managed,
                          and environmentally conscious.
                        </p>
                        <p>
                          We envision a future where resource optimization happens automatically,
                          where families are empowered with real-time insights, and where technology
                          serves sustainability.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Our Values
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Trust</h3>
                          <p className="text-sm text-muted-foreground">
                            We handle your data with the highest security standards and complete transparency.
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                            <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Sustainability</h3>
                          <p className="text-sm text-muted-foreground">
                            Every feature we build contributes to a more sustainable future for all.
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-lg font-semibold">Innovation</h3>
                          <p className="text-sm text-muted-foreground">
                            We continuously push the boundaries of what's possible in smart home technology.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Meet Our Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {teamMembers.map((member) => (
                          <div key={member.name} className="text-center">
                            <Avatar className="mx-auto mb-4 h-24 w-24">
                              <AvatarImage src={member.avatar} alt={member.name} onError={(e) => (e.currentTarget.style.display = 'none')} />
                              <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        Our Journey
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {milestones.map((milestone, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                {milestone.year}
                              </div>
                              {index < milestones.length - 1 && (
                                <div className="mt-2 h-16 w-px bg-border" />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <h3 className="text-lg font-semibold">{milestone.title}</h3>
                              <p className="text-muted-foreground">{milestone.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Contact Section */}
              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-500" />
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">+91 8122129450</div>
                          <div className="text-sm text-muted-foreground">Call us anytime</div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" onClick={handleCall} className="flex-1 sm:flex-none">
                          Call
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopy("+918122129450", "Phone")}
                                className="flex-shrink-0"
                                aria-label="Copy phone number"
                              >
                                {copied === "Phone" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy phone number</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">enquiries@aquawatt.com</div>
                          <div className="text-sm text-muted-foreground">Send us an email</div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" onClick={handleEmail} className="flex-1 sm:flex-none">
                          Email
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopy("enquiries@aquawatt.com", "Email")}
                                className="flex-shrink-0"
                                aria-label="Copy email address"
                              >
                                {copied === "Email" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy email address</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-b">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-sm sm:text-base">How does AQUAWATT track my usage?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          We connect to compatible smart meters and IoT sensors to collect real-time data.
                          Our platform then processes this information to provide actionable insights
                          and recommendations.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" className="border-b">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-sm sm:text-base">Is my data secure?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          Absolutely. We use enterprise-grade encryption and follow strict data protection
                          protocols. Your data is never shared with third parties without your explicit consent.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="border-b">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-sm sm:text-base">Can I use AQUAWATT without smart devices?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          Yes! You can start with manual readings and still benefit from our analytics
                          and recommendations. You can always upgrade to smart devices later.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4" className="border-b">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-sm sm:text-base">What devices are compatible?</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          We support a wide range of smart meters, IoT sensors, and home automation
                          devices. Check our compatibility guide or contact support for specific devices.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Client Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Client Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "AQUAWATT has transformed how we manage our utilities. The real-time insights 
                        helped us reduce our electricity bill by 30%. Highly recommended!"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Moorthy G</div>
                          <div className="text-xs text-muted-foreground">Houseowner, Chennai</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "The leak detection feature saved us thousands! We caught a hidden water 
                        leak that would have caused major damage. Thank you AQUAWATT team!"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>UM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Uma M</div>
                          <div className="text-xs text-muted-foreground">Houseowner, Chennai</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "As an environmentally conscious family, AQUAWATT helps us track our 
                        carbon footprint and make sustainable choices. The app is beautiful too!"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>TVU</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Tharun Varshan U</div>
                          <div className="text-xs text-muted-foreground">Founder & CEO of Wyntrix, Chennai</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "The customer support is exceptional. They helped me set up everything 
                        remotely and the system works flawlessly. Five stars!"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>SP</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Sathya Prasana</div>
                          <div className="text-xs text-muted-foreground">Project Manager, Infosys</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Perfect for our smart home setup. The automation features work seamlessly 
                        with our existing devices. Couldn't be happier!"
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>JSP</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Jeya Sakthi P</div>
                          <div className="text-xs text-muted-foreground">UI/UX Designer, Accenture</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "The detailed analytics and reports help me understand our usage patterns. 
                        We've become much more conscious about our energy consumption."
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>RK</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">Robert Kim</div>
                          <div className="text-xs text-muted-foreground">Data Analyst, Mumbai</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About the Creator moved to Home page */}

              {/* AI Assistant removed per requirements */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="flex items-start gap-3 rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-md">
    <div className="rounded-md bg-muted p-2">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default About;
