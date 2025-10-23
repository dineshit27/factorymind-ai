import { Link } from "react-router-dom";
import { Facebook, Youtube, Linkedin, Instagram, X } from "lucide-react";

const col = (title: string, links: { label: string; to?: string; href?: string }[]) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <ul className="space-y-3 text-sm">
      {links.map((l) => (
        <li key={l.label}>
          {l.to ? (
            <Link to={l.to} className="text-foreground/80 hover:text-foreground">
              {l.label}
            </Link>
          ) : (
            <a href={l.href} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-foreground">
              {l.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      {/* Top grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            {col("Apps and Extensions", [
              { label: "Mobile Apps", to: "/" },
              { label: "Desktop Apps", to: "/" },
              { label: "Workspace Integration" },
              { label: "Product Integrations" },
              { label: "Browser Extensions" },
            ])}
          </div>
          <div className="lg:col-span-3">
            {col("Learn", [
              { label: "What is IoT" },
              { label: "Training and Services" },
              { label: "Blog", to: "/community" },
              { label: "Knowledge Base", to: "/community" },
              { label: "Newsletter" },
            ])}
          </div>
          <div className="lg:col-span-2">
            {col("Community", [
              { label: "User Community", to: "/community" },
              { label: "Promotion & Branding", to: "/community" },
              { label: "Startups", to: "/community" },
              { label: "Affiliate Program" },
              { label: "Discussion" },
            ])}
          </div>
          <div className="lg:col-span-2">
            {col("Company", [
              { label: "About Us", to: "/" },
              { label: "Our Impact" },
              { label: "Events" },
              { label: "Careers" },
              { label: "Privacy Policy" },
            ])}
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Contact Sales</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-foreground/80">+91 8122129450</div>
                <div className="text-foreground/80">+91 6381094501</div>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <a href="mailto:enquiries@aquawatt.com" className="text-primary hover:underline">m.dinesh.it27@gmail.com</a>
              </div>
              <div className="pt-2 space-x-5 flex items-center">
                <a href="#" aria-label="X" className="text-foreground/70 hover:text-foreground"><X className="h-5 w-5" /></a>
                <a href="#" aria-label="Facebook" className="text-foreground/70 hover:text-foreground"><Facebook className="h-5 w-5" /></a>
                <a href="#" aria-label="YouTube" className="text-foreground/70 hover:text-foreground"><Youtube className="h-5 w-5" /></a>
                <a href="#" aria-label="LinkedIn" className="text-foreground/70 hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
                <a href="#" aria-label="Instagram" className="text-foreground/70 hover:text-foreground"><Instagram className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dark bar */}
      <div className="bg-background/90 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center text-xs text-foreground/70">
          © {new Date().getFullYear()}, AquaWatt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
