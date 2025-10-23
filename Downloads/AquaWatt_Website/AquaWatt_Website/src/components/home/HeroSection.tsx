
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Droplets, Zap, BarChart2, DollarSign } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeroSectionProps {
  onScrollToFeatures: () => void; // still used by down arrow
}

export function HeroSection({ onScrollToFeatures }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section id="hero-section" className="relative bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Left: Headline and CTA */}
          <div className="md:col-span-7">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                Your efficiency,
                <br /> powered by our craft
              </h1>
              <div className="h-1 w-14 bg-blue-600 rounded-full" />
              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl">
                A simple, powerful suite to manage water and energy the way you live and work. Built for households of all sizes, with privacy at the core.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-h-[48px]"
                >
                  Lets start
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onScrollToFeatures}
                  className="min-h-[48px]"
                >
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Featured Apps card */}
          <div className="md:col-span-5">
            <Card className="shadow-lg border rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-muted-foreground tracking-wider">FEATURED PAGES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FeatureRow to="/dashboard" icon={Droplets} iconBg="bg-blue-600/10" iconBorder="border-blue-600/20" iconColor="text-blue-600" title="Water Monitoring" desc="Track water usage by day and room." />
                <FeatureRow to="/dashboard" icon={Zap} iconBg="bg-yellow-600/10" iconBorder="border-yellow-600/20" iconColor="text-yellow-600" title="Electricity Monitoring" desc="Monitor electricity consumption live." />
                <FeatureRow to="/analytics" icon={BarChart2} iconBg="bg-emerald-600/10" iconBorder="border-emerald-600/20" iconColor="text-emerald-600" title="Analytics" desc="Trends, patterns, and forecasts." />
                <FeatureRow to="/billing" icon={DollarSign} iconBg="bg-amber-600/10" iconBorder="border-amber-600/20" iconColor="text-amber-600" title="Billing" desc="Monthly costs and history." />

                <div className="pt-2">
                  <Link to="/analytics" className="w-full flex items-center justify-between text-primary px-2 py-3 rounded-lg hover:bg-muted/60 transition">
                    <span className="font-medium">Explore all analytics</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureRowProps = {
  to: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
};

function FeatureRow({ to, title, desc, icon: Icon, iconBg, iconBorder, iconColor }: FeatureRowProps) {
  return (
    <Link to={to} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full ${iconBg} border ${iconBorder} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <div className="font-semibold leading-tight">{title}</div>
          <div className="text-sm text-muted-foreground leading-tight">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
