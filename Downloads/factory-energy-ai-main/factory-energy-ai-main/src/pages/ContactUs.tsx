import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building2, CheckCircle2, Shield, Lock } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@factorymind.ai',
    description: 'Get a response within 24 hours',
    color: 'text-blue-500'
  },
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+91 80-1234-5678',
    description: 'Mon-Fri, 9:00 AM - 6:00 PM IST',
    color: 'text-green-500'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: 'Chennai, Tamil Nadu',
    description: 'Schedule an appointment',
    color: 'text-red-500'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    detail: 'Monday - Friday',
    description: '9:00 AM - 6:00 PM IST',
    color: 'text-purple-500'
  },
];

const faqCategories = [
  {
    icon: HelpCircle,
    title: 'General Questions',
    count: 15,
    description: 'Learn about FactoryMind AI'
  },
  {
    icon: Building2,
    title: 'For Factories',
    count: 12,
    description: 'Implementation & usage'
  },
  {
    icon: MessageSquare,
    title: 'Technical Support',
    count: 20,
    description: 'Troubleshooting & help'
  },
];

const faqData = [
  {
    question: 'What is FactoryMind AI?',
    answer: 'FactoryMind AI is a free, AI-powered energy diagnostic platform designed for small and medium factories. It helps identify energy inefficiencies, diagnoses equipment faults, and provides actionable recommendations to reduce energy costs without requiring any hardware installation.'
  },
  {
    question: 'How does the diagnosis process work?',
    answer: 'Simply select your machine type (compressor, motor, pump, etc.), describe the symptoms or issues you\'re experiencing through our conversational AI interface, and receive instant diagnosis results with energy loss calculations, root cause analysis, and ROI recommendations for repairs or replacements.'
  },
  {
    question: 'Is FactoryMind AI really free?',
    answer: 'Yes! Our basic diagnosis service is completely free. You can diagnose unlimited machines, download PDF reports, and access your dashboard. We believe every factory should have access to professional-grade energy diagnostics.'
  },
  {
    question: 'Do I need to install any sensors or hardware?',
    answer: 'No hardware required! FactoryMind AI works entirely through your web browser. You simply provide information about your machines and their symptoms, and our AI analyzes the data to provide accurate diagnoses and recommendations.'
  },
  {
    question: 'How accurate are the energy loss calculations?',
    answer: 'Our AI models are trained on thousands of real factory cases and industry-standard engineering calculations. Typical accuracy is within 10-15% of actual measured values, making them reliable for decision-making and ROI calculations.'
  },
  {
    question: 'Can I use this for multiple machines?',
    answer: 'Absolutely! You can diagnose as many machines as you want. Your dashboard keeps track of all diagnoses, their status, and cumulative savings potential across your entire facility.'
  },
  {
    question: 'What types of machines are supported?',
    answer: 'We currently support air compressors, electric motors, pumps, boilers, chillers, and HVAC systems. We\'re continuously expanding our coverage to include more industrial equipment types.'
  },
  {
    question: 'How long does a diagnosis take?',
    answer: 'Most diagnoses are completed in under 20 minutes. The AI asks you a series of questions about your machine and symptoms, then immediately provides detailed results including energy loss analysis and recommendations.'
  },
  {
    question: 'Can I download and share the reports?',
    answer: 'Yes! Every diagnosis generates a professional PDF report that you can download and share with your team, management, or maintenance contractors. The reports include all technical details, ROI calculations, and recommendations.'
  },
  {
    question: 'What if I need help or have technical questions?',
    answer: 'Our support team is available Monday-Friday, 9 AM - 6 PM IST. You can reach us via email at support@factorymind.ai or call us at +91 80-1234-5678. We typically respond within 24 hours.'
  },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">We're Here to Help</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Have questions about FactoryMind AI? Our team is ready to help you optimize your energy usage
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 cursor-pointer group">
              <div className={`h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <method.icon className={`h-6 w-6 ${method.color} transition-transform duration-300 group-hover:scale-125`} />
              </div>
              <h3 className="font-semibold mb-1 transition-colors duration-300 group-hover:text-accent">{method.title}</h3>
              <div className="font-bold text-sm mb-1">{method.detail}</div>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:border-accent/20">
              <h2 className="font-display text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input 
                        id="company" 
                        placeholder="Your Factory Name" 
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="transition-all duration-200 focus:scale-[1.02]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help..." 
                      rows={6} 
                      required 
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="transition-all duration-200 focus:scale-[1.01]"
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Send Message <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-xl font-bold mb-4">Quick Help</h3>
              <div className="space-y-3">
                {faqCategories.map((category, i) => (
                  <button 
                    key={i}
                    className="w-full text-left p-4 rounded-lg border border-border transition-all duration-300 hover:scale-105 hover:border-accent/30 hover:shadow-lg group"
                  >
                    <div className="flex items-start gap-3">
                      <category.icon className="h-5 w-5 text-accent flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1 transition-colors duration-300 group-hover:text-accent">
                          {category.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{category.description}</div>
                      </div>
                      <span className="text-xs font-bold text-accent">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-bold">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-semibold">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-semibold text-destructive">Closed</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-card rounded-xl p-6 border-l-4 border-accent">
              <h3 className="font-display text-lg font-bold mb-2">Fast Response Time</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent font-semibold">Our team is online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map or Additional Info */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Visit Our Office</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Located in the heart of India's tech hub, we're always happy to meet in person. 
            Schedule an appointment for a demo or consultation.
          </p>
          <div className="text-lg font-semibold mb-2">FactoryMind AI</div>
          <div className="text-muted-foreground">
            Sri Sairam Institute of Technology<br />
            Chennai, Tamil Nadu 600040<br />
            India
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-4">
            <HelpCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Got Questions? We've Got Answers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to the most common questions about FactoryMind AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="glass-card rounded-xl px-6 border transition-all duration-300 hover:shadow-lg hover:border-accent/30"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-accent transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">Last updated: February 19, 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Your Privacy Matters
              </h3>
              <p className="leading-relaxed">
                At FactoryMind AI, we take your privacy seriously. This policy outlines how we collect, use, and protect your information when you use our platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li><strong>Account Information:</strong> Name, email, company details when you register</li>
                <li><strong>Machine Data:</strong> Technical specifications and symptoms you provide during diagnosis</li>
                <li><strong>Usage Data:</strong> How you interact with our platform to improve our services</li>
                <li><strong>Communication Data:</strong> Messages sent through our contact forms or support channels</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Provide accurate energy diagnostics and recommendations</li>
                <li>Maintain and improve our AI models and platform features</li>
                <li>Send you important updates about your diagnoses and account</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Data Protection & Security</h3>
              <p className="leading-relaxed mb-2">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>All data is encrypted in transit using SSL/TLS protocols</li>
                <li>Secure cloud storage with regular backups</li>
                <li>Access controls and authentication measures</li>
                <li>Regular security audits and updates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Data Sharing</h3>
              <p className="leading-relaxed">
                We <strong>never sell</strong> your personal information. We may share data only:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
                <li>In anonymized, aggregated form for research and improvement purposes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Your Rights</h3>
              <p className="leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Access your personal data at any time</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Cookies & Tracking</h3>
              <p className="leading-relaxed">
                We use essential cookies to ensure our platform functions properly. Analytics cookies help us understand usage patterns. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Children's Privacy</h3>
              <p className="leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Changes to This Policy</h3>
              <p className="leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of significant changes via email or through a prominent notice on our platform.
              </p>
            </div>

            <div className="mt-8 p-6 bg-accent/5 rounded-xl border border-accent/20">
              <h3 className="font-semibold text-foreground text-lg mb-2">Questions About Privacy?</h3>
              <p className="leading-relaxed mb-4">
                If you have any questions or concerns about our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <span>privacy@factorymind.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>+91 80-1234-5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
