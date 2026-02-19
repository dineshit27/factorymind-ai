import { Link } from 'react-router-dom';
import { Factory, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                <Factory className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                FactoryMind <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">
              Empowering small and medium factories with AI-driven energy diagnostics. 
              Save costs, reduce emissions, and optimize operations — all for free.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/diagnosis', label: 'Start Diagnosis' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/community', label: 'Community' },
              ].map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { to: '/contact', label: 'Help Center' },
                { to: '/contact', label: 'FAQ' },
                { to: '/contact', label: 'Privacy Policy' },
                { to: '/contact', label: 'Terms of Service' },
                { to: '/calibration', label: 'Calibration' },
              ].map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <a href="mailto:support@factorymind.ai" className="hover:text-accent transition-colors">
                  support@factorymind.ai
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <a href="tel:+918012345678" className="hover:text-accent transition-colors">
                  +91 80-1234-5678
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span>
                  Bangalore, Karnataka<br />
                  India 560034
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-6 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 FactoryMind AI. All rights reserved. Empowering factories with intelligent energy solutions.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
