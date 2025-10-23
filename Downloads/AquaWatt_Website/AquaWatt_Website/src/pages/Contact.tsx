import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/DashboardHeader';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock, 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Star,
  Zap,
  Heart,
  Shield
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqSuccess, setFaqSuccess] = useState(false);
  const [faqBannerVisible, setFaqBannerVisible] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  // 3D floating animation setup
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        50% { transform: translateY(-20px) rotateX(10deg) rotateY(5deg); }
      }
      
      .floating-3d {
        animation: float 4s ease-in-out infinite;
      }
      
      .transform-gpu {
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general'
    });
    setLoading(false);
  };

  const submitFaqRequest = async () => {
    if (!faqQuestion.trim()) {
      toast({ title: 'Enter a question', description: 'Please type your FAQ question before sending.', variant: 'destructive' });
      return;
    }
    try {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id ?? user?.id ?? null;
      const payload = [{ question: faqQuestion.trim(), user_id: uid }];
      const { error } = await supabase.from('faq_requests').insert(payload as any);
      if (error) throw error;
      toast({ title: 'Request sent', description: 'Thanks! Well review your question for our FAQ.' });
      setFaqSuccess(true);
      setFaqBannerVisible(true);
    } catch (err: any) {
      toast({ title: 'Could not send request', description: err?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "m.dinesh.it27@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 8122129450",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Chennai, Tamil Nadu.",
      description: "Tech City, TC 12345"
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" }
  ];

  const goToForm = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      {/* Hero Section with 3D Elements */}
      <section className="relative py-16 overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-3d absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
          <div className="floating-3d absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-lg blur-lg rotate-45" />
          <div className="floating-3d absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-lg" />
          
          {/* Floating 3D Icons */}
          <div className="floating-3d absolute top-32 right-20 text-blue-400/30">
            <Zap className="w-12 h-12" />
          </div>
          <div className="floating-3d absolute bottom-40 right-16 text-purple-400/30">
            <Heart className="w-10 h-10" />
          </div>
          <div className="floating-3d absolute top-1/2 left-16 text-green-400/30">
            <Shield className="w-8 h-8" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-8"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-700 font-medium">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your water and energy management? Let's start a conversation 
              about how WaterLight can help you save more and live smarter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Customer vs Business entry cards */}
      <section className="relative pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -4, scale: 1.01 }}>
              <Card className="p-8 bg-white/90 backdrop-blur border-0 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Heart className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">For Customers</h3>
                    <p className="text-gray-600 mt-1">Questions about your account, billing, devices, or app?</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Account Support', 'Billing', 'Device Setup'].map((chip) => (
                        <span key={chip} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{chip}</span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button onClick={() => goToForm('support')} className="bg-blue-600 hover:bg-blue-700">Contact Customer Support</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.01 }}>
              <Card className="p-8 bg-white/90 backdrop-blur border-0 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Shield className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">For Business</h3>
                    <p className="text-gray-600 mt-1">Partnerships, integrations, bulk deployments, or press?</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Partnership', 'Sales', 'Integrations'].map((chip) => (
                        <span key={chip} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{chip}</span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button onClick={() => goToForm('sales')} className="bg-purple-600 hover:bg-purple-700">Talk to Sales</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-20" ref={formRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-8">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <MessageCircle className="w-6 h-6" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-blue-100 mt-2">We'd love to hear from you. Tell us how we can help!</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Type Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'general', label: 'General', icon: MessageCircle },
                          { value: 'support', label: 'Support', icon: Shield },
                          { value: 'sales', label: 'Sales', icon: Star },
                          { value: 'partnership', label: 'Partnership', icon: Heart }
                        ].map(type => (
                          <motion.button
                            key={type.value}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                              formData.type === type.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <type.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                          placeholder="+91 8122129450"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="border-2 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending Message...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Send className="w-5 h-5" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                          <info.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                          <p className="text-gray-800 font-medium">{info.value}</p>
                          <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="p-6 bg-white text-black border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6" />
                    <h3 className="font-semibold text-lg">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-gray-800">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <Badge className="mt-4 bg-green-500 hover:bg-green-600">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    Currently Open
                  </Badge>
                </Card>
              </motion.div>

              {/* Social Media sidebar card removed as requested */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="relative pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="text-center mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-2">Quick answers to common questions</p>
            </div>
            <div className="hidden md:block">
              <Button onClick={() => setFaqOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Request FAQ</Button>
            </div>
          </div>
          {faqBannerVisible && (
            <div className="mb-6">
              <Alert>
                <AlertTitle>Thanks! Your question was sent.</AlertTitle>
                <AlertDescription>
                  We'll review your request and consider adding it to our FAQ soon.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How fast do you respond?</AccordionTrigger>
                  <AccordionContent>We typically respond within 24 hours on weekdays. Priority support is available for enterprise plans.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do you offer on-site installation?</AccordionTrigger>
                  <AccordionContent>Yes, we partner with certified installers in most regions. Our team can coordinate and schedule visits.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I migrate from another platform?</AccordionTrigger>
                  <AccordionContent>Absolutely. We provide migration assistance and data import tooling to make the switch seamless.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Where are you located?</AccordionTrigger>
                  <AccordionContent>Our HQ is in Tech City with remote teams worldwide to support different time zones.</AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* Mobile button */}
              <div className="mt-6 md:hidden">
                <Button onClick={() => setFaqOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Request FAQ</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Request FAQ Dialog */}
      <Dialog open={faqOpen} onOpenChange={(open) => { setFaqOpen(open); if (!open) { setFaqSuccess(false); setFaqQuestion(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a new FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {faqSuccess ? (
              <>
                <Alert>
                  <AlertTitle>Request sent</AlertTitle>
                  <AlertDescription>Thanks! We'll review your question shortly.</AlertDescription>
                </Alert>
                <div className="flex justify-end pt-2">
                  <Button onClick={() => setFaqOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700">Your question</label>
                <Textarea
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  rows={4}
                  placeholder="Type your question here..."
                  className="resize-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setFaqOpen(false)}>Cancel</Button>
                  <Button onClick={submitFaqRequest} className="bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Section (office info card removed; map full width) */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Card className="h-full border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <iframe
                title="WaterLight HQ Map"
                src="https://www.google.com/maps?q=Guduvanchery&output=embed"
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social connect footer */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-semibold">Let’s stay connected</h3>
                  <p className="text-blue-100">Follow us for product updates, tips, and community stories.</p>
                </div>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a key={index} href={social.href} className="p-3 rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
                      <social.icon className="w-5 h-5 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;