
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Lightbulb, BarChart2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FeaturesSection({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  const navigate = useNavigate();

  return (
    <div ref={ref} id="features" className="py-12 md:py-16 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Features</h2>
        
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-12">
          <Card className="bg-water-light/50 dark:bg-water-dark/10 transition-all duration-300 hover:shadow-xl hover:scale-105 border-water-dark/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplet className="h-5 w-5 text-water-dark" />
                Water Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Track water usage across different areas of your home
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className="w-full group border-water-dark/20 hover:bg-water-light dark:hover:bg-water-dark/20 min-h-[44px]"
              >
                View Usage 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-energy-light/50 dark:bg-energy-dark/10 transition-all duration-300 hover:shadow-xl hover:scale-105 border-energy-dark/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-energy-dark" />
                Energy Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Monitor electricity consumption in real-time
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className="w-full group border-energy-dark/20 hover:bg-energy-light dark:hover:bg-energy-dark/20 min-h-[44px]"
              >
                View Usage 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm bg-background/50 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Get detailed insights and usage patterns
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/analytics")}
                className="w-full group min-h-[44px]"
              >
                View Analytics 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:gap-8 sm:grid-cols-2">
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => navigate("/devices")}
            className="transition-all duration-300 hover:scale-105 bg-water-dark/80 hover:bg-water-dark min-h-[48px]"
          >
            Manage Devices
          </Button>
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => navigate("/billing")}
            className="transition-all duration-300 hover:scale-105 bg-energy-dark/80 hover:bg-energy-dark min-h-[48px]"
          >
            View Bills
          </Button>
        </div>
      </div>
    </div>
  );
}
