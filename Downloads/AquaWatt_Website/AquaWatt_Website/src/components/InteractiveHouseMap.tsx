import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Zap, 
  Thermometer, 
  Wind, 
  Home, 
  Bed, 
  ChefHat, 
  Bath, 
  Car,
  TreePine,
  Sofa,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Settings,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Room {
  id: string;
  name: string;
  icon: React.ElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  waterUsage: number;
  energyUsage: number;
  temperature: number;
  devices: Device[];
  status: 'normal' | 'high' | 'alert';
  color: string;
}

interface Device {
  id: string;
  name: string;
  type: 'water' | 'energy';
  usage: number;
  status: 'on' | 'off' | 'standby';
  icon: React.ElementType;
}

const InteractiveHouseMap: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const sizeScale = isMobile ? 0.6 : 1; // further shrink rooms on small screens to avoid overlap

  const rooms: Room[] = [
    {
      id: 'living-room',
      name: 'Living Room',
      icon: Sofa,
      position: { x: 20, y: 30 },
      size: { width: 25, height: 20 },
      waterUsage: 5,
      energyUsage: 120,
      temperature: 24,
      status: 'normal',
      color: 'bg-blue-500',
      devices: [
        { id: 'tv', name: 'Smart TV', type: 'energy', usage: 85, status: 'on', icon: Monitor },
        { id: 'ac1', name: 'Air Conditioner', type: 'energy', usage: 35, status: 'on', icon: Wind }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: ChefHat,
      position: { x: 50, y: 20 },
      size: { width: 20, height: 15 },
      waterUsage: 45,
      energyUsage: 95,
      temperature: 26,
      status: 'high',
      color: 'bg-orange-500',
      devices: [
        { id: 'dishwasher', name: 'Dishwasher', type: 'water', usage: 25, status: 'on', icon: Droplets },
        { id: 'fridge', name: 'Refrigerator', type: 'energy', usage: 65, status: 'on', icon: Zap },
        { id: 'sink', name: 'Kitchen Sink', type: 'water', usage: 20, status: 'on', icon: Droplets }
      ]
    },
    {
      id: 'master-bedroom',
      name: 'Master Bedroom',
      icon: Bed,
      position: { x: 15, y: 55 },
      size: { width: 22, height: 18 },
      waterUsage: 8,
      energyUsage: 45,
      temperature: 22,
      status: 'normal',
      color: 'bg-green-500',
      devices: [
        { id: 'ac2', name: 'Bedroom AC', type: 'energy', usage: 35, status: 'standby', icon: Wind },
        { id: 'lights1', name: 'LED Lights', type: 'energy', usage: 10, status: 'on', icon: Zap }
      ]
    },
    {
      id: 'bathroom',
      name: 'Master Bathroom',
      position: { x: 40, y: 55 },
      size: { width: 12, height: 15 },
      icon: Bath,
      waterUsage: 85,
      energyUsage: 25,
      temperature: 25,
      status: 'alert',
      color: 'bg-red-500',
      devices: [
        { id: 'shower', name: 'Electric Shower', type: 'water', usage: 60, status: 'on', icon: Droplets },
        { id: 'heater', name: 'Water Heater', type: 'energy', usage: 25, status: 'on', icon: Thermometer }
      ]
    },
    {
      id: 'garage',
      name: 'Garage',
      icon: Car,
      position: { x: 70, y: 45 },
      size: { width: 15, height: 25 },
      waterUsage: 10,
      energyUsage: 15,
      temperature: 20,
      status: 'normal',
      color: 'bg-gray-500',
      devices: [
        { id: 'ev-charger', name: 'EV Charger', type: 'energy', usage: 15, status: 'off', icon: Zap }
      ]
    },
    {
      id: 'garden',
      name: 'Garden',
      icon: TreePine,
      position: { x: 55, y: 75 },
      size: { width: 30, height: 15 },
      waterUsage: 150,
      energyUsage: 30,
      temperature: 18,
      status: 'high',
      color: 'bg-emerald-500',
      devices: [
        { id: 'sprinkler', name: 'Smart Sprinkler', type: 'water', usage: 120, status: 'on', icon: Droplets },
        { id: 'garden-lights', name: 'Garden Lights', type: 'energy', usage: 30, status: 'on', icon: Zap }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'alert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'high': return TrendingUp;
      case 'alert': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => { setZoom(1); setSelectedRoom(null); };

  const totalWaterUsage = rooms.reduce((sum, room) => sum + room.waterUsage, 0);
  const totalEnergyUsage = rooms.reduce((sum, room) => sum + room.energyUsage, 0);

  // Start slightly zoomed-out on mobile to improve spacing
  useEffect(() => {
    if (isMobile) setZoom(0.85);
  }, [isMobile]);

  return (
    <div className="w-full h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur border-b gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Smart House Map</h2>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-blue-500" />
              {totalWaterUsage}L
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              {totalEnergyUsage}kW
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="px-2 sm:px-3">
            <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="px-2 sm:px-3">
            <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="px-2 sm:px-3">
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100%-100px)] sm:h-[calc(100%-80px)]">
        {/* House Map */}
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            {/* Fixed aspect-ratio canvas to keep SVG and rooms aligned on all screens */}
            <div
              ref={mapRef}
              className="relative w-[92vw] max-w-[720px] aspect-[4/3] sm:w-full sm:aspect-[3/2] md:aspect-[16/9]"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* House Outline */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* House Structure */}
                <rect x="10" y="15" width="80" height="70" fill="none" stroke="#e5e7eb" strokeWidth="0.5" rx="2" />
                <rect x="12" y="17" width="76" height="66" fill="#f8fafc" fillOpacity="0.5" />

                {/* Room Dividers */}
                <line x1="45" y1="15" x2="45" y2="50" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="10" y1="50" x2="60" y2="50" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="60" y1="40" x2="90" y2="40" stroke="#e5e7eb" strokeWidth="0.3" />
                <line x1="50" y1="70" x2="90" y2="70" stroke="#e5e7eb" strokeWidth="0.3" />
              </svg>

              {/* Rooms */}
              {rooms.map((room) => {
                const IconComponent = room.icon;
                const StatusIcon = getStatusIcon(room.status);
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <motion.div
                    key={room.id}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      isSelected ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${room.position.x}%`,
                      top: `${room.position.y}%`,
                      width: `${room.size.width * sizeScale}%`,
                      height: `${room.size.height * sizeScale}%`
                    }}
                    onClick={() => setSelectedRoom(room)}
                    whileHover={isMobile ? undefined : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isSelected ? { scale: isMobile ? 1.04 : 1.1 } : { scale: 1 }}
                  >
                    {/* Room Background */}
                    <div
                      className={`w-full h-full rounded-lg border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-blue-500 shadow-lg shadow-blue-500/25 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400 bg-white/60 hover:bg-white/80'
                      }`}
                    >
                      {/* Room Header (Mobile: name only) */}
                      <div className={`p-1.5 sm:p-2 ${isMobile ? 'flex items-center justify-center h-full' : 'flex items-center justify-between'}`}>
                        {isMobile ? (
                          <span className="text-[10px] font-semibold text-gray-900 whitespace-normal break-words text-center px-1">
                            {room.name}
                          </span>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                              <span className="text-[10px] sm:text-xs font-medium text-gray-800 whitespace-normal break-words">
                                {room.name}
                              </span>
                            </div>
                            <StatusIcon
                              className={`h-3 w-3 ${
                                room.status === 'normal'
                                  ? 'text-green-500'
                                  : room.status === 'high'
                                  ? 'text-orange-500'
                                  : 'text-red-500'
                              }`}
                            />
                          </>
                        )}
                      </div>

                      {/* Usage Indicators (hidden on mobile) */}
                      {!isMobile && (
                        <div className="px-1.5 pb-1.5 sm:px-2 sm:pb-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs">
                            <div className="flex items-center gap-1">
                              <Droplets className="h-3 w-3 text-blue-500" />
                              <span>{room.waterUsage}L</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              <span>{room.energyUsage}kW</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                            <Thermometer className="h-3 w-3 text-red-400" />
                            <span>{room.temperature}°C</span>
                          </div>
                        </div>
                      )}

                      {/* Active Devices Indicator (hidden on mobile) */}
                      {!isMobile && (
                        <div className="absolute bottom-1 right-1">
                          <div className="flex gap-1">
                            {room.devices.slice(0, 3).map((device, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                  device.status === 'on'
                                    ? 'bg-green-400'
                                    : device.status === 'standby'
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {selectedRoom && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: window.innerWidth < 1024 ? '100%' : 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-l shadow-lg overflow-hidden lg:relative absolute inset-0 z-30 lg:z-auto"
            >
              <div className="p-4 sm:p-6 h-full overflow-y-auto">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <selectedRoom.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {selectedRoom.name}
                    </h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedRoom(null)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <Badge className={`${getStatusColor(selectedRoom.status)} capitalize`}>
                    {selectedRoom.status}
                  </Badge>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedRoom.waterUsage}L
                      </div>
                      <div className="text-xs text-gray-500">Water Usage</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedRoom.energyUsage}kW
                      </div>
                      <div className="text-xs text-gray-500">Energy Usage</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Temperature & Device Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Thermometer className="h-5 w-5 text-red-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">
                        {selectedRoom.temperature}°C
                      </div>
                      <div className="text-xs text-gray-500">Temperature</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Settings className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">
                        {selectedRoom.devices.length}
                      </div>
                      <div className="text-xs text-gray-500">Smart Devices</div>
                    </CardContent>
                  </Card>
                </div>


              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveHouseMap;