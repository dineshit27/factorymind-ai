
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Home, Maximize2, CornerUpRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Mock usage data for different regions
const regions = [
  { id: 1, name: "Kitchen", water: 250, electricity: 180, x: 25, y: 20 },
  { id: 2, name: "Bath Room 1", water: 320, electricity: 220, x: 60, y: 75 },
  { id: 3, name: "Main Hall", water: 190, electricity: 160, x: 75, y: 35 },
  { id: 4, name: "Bed Room", water: 280, electricity: 200, x: 30, y: 65 },
  { id: 5, name: "Bathroom 2", water: 350, electricity: 270, x: 50, y: 50 },
];

export function AnalyticsMap() {
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.2);
  };

  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(zoom - 0.2);
  };

  const handleReset = () => {
    setZoom(1);
    setSelectedRegion(null);
    setShowDetails(false);
  };

  const handleRegionClick = (regionId: number) => {
    setSelectedRegion(regionId);
    setShowDetails(true);
    toast({
      title: "Region Selected",
      description: `Viewing details for ${regions.find(r => r.id === regionId)?.name}`,
    });
  };

  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  return (
    <div className="relative h-full w-full flex bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {showDetails && selectedRegionData && (
        <Card className="absolute bottom-3 left-3 w-72 z-10 bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{selectedRegionData.name}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowDetails(false)}
                className="h-6 w-6 -mt-1 -mr-1"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Water Usage:</span>
                <span className="font-medium">{selectedRegionData.water} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Electricity Usage:</span>
                <span className="font-medium">{selectedRegionData.electricity} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="font-medium">{Math.round((selectedRegionData.water / selectedRegionData.electricity) * 10) / 10} L/kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div 
        className="relative h-full w-full bg-muted/20" 
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        {/* This would be a real map in production, using a library like react-leaflet, mapbox, etc. */}
        {/* For now, we'll create a simple visual representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[80%] h-[80%] relative border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <div className="absolute inset-0 border-[16px] border-accent/10 rounded-lg" />
            
            {regions.map(region => (
              <div
                key={region.id}
                className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center
                  ${selectedRegion === region.id ? 
                    'bg-primary/20 border-2 border-primary' : 
                    'bg-muted hover:bg-muted/80'}`}
                style={{ 
                  left: `${region.x}%`, 
                  top: `${region.y}%`,
                  boxShadow: selectedRegion === region.id ? '0 0 0 4px rgba(var(--primary), 0.2)' : 'none'
                }}
                onClick={() => handleRegionClick(region.id)}
              >
                <div 
                  className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center
                    ${selectedRegion === region.id ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
                >
                  {region.id}
                </div>
                <div className="absolute -bottom-6 whitespace-nowrap text-xs font-medium">
                  {region.name}
                </div>
              </div>
            ))}

            <div className="absolute top-2 left-2 text-xs text-muted-foreground">House Map</div>
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">AQUAWATT ZONE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
