
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Zap } from 'lucide-react';

export function HomeCalculator() {
  // Water calculator state
  const [waterAmount, setWaterAmount] = useState<number>(0);
  const [waterUnit, setWaterUnit] = useState<string>("gallons");
  const [waterCost, setWaterCost] = useState<number>(0);
  const [waterUsageTime, setWaterUsageTime] = useState<number>(0);
  const [waterTimeUnit, setWaterTimeUnit] = useState<string>("minutes");
  
  // Electricity calculator state
  const [powerConsumption, setPowerConsumption] = useState<number>(0);
  const [electricityUsageTime, setElectricityUsageTime] = useState<number>(0);
  const [electricityTimeUnit, setElectricityTimeUnit] = useState<string>("hours");
  const [electricityCost, setElectricityCost] = useState<number>(0);
  
  // Currency conversion (USD -> INR) to match Billing/Dashboard
  const USD_TO_INR = 83.0;
  const toINR = (usd: number) => {
    const inr = usd * USD_TO_INR;
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(inr); }
    catch { return '₹' + inr.toFixed(2); }
  };

  // Real-time water computation using useMemo
  const waterResult = useMemo(() => {
    // Example rate: $0.015 per gallon
    const ratePerGallon = 0.015;
    if (!waterAmount || !waterUsageTime) return { gallons: 0, minutes: 0, costUSD: 0 };
    let gallons = waterAmount;
    if (waterUnit === 'liters') gallons = waterAmount * 0.264172;
    let minutes = waterUsageTime;
    if (waterTimeUnit === 'hours') minutes = waterUsageTime * 60;
    else if (waterTimeUnit === 'days') minutes = waterUsageTime * 1440;
    const totalGallons = gallons * minutes;
    const costUSD = totalGallons * ratePerGallon;
    return { gallons: totalGallons, minutes, costUSD };
  }, [waterAmount, waterUnit, waterUsageTime, waterTimeUnit]);

  // Real-time electricity computation
  const electricityResult = useMemo(() => {
    // Example rate: $0.12 per kWh
    const ratePerKWh = 0.12;
    if (!powerConsumption || !electricityUsageTime) return { kwh: 0, hours: 0, costUSD: 0 };
    let hours = electricityUsageTime;
    if (electricityTimeUnit === 'minutes') hours = electricityUsageTime / 60;
    else if (electricityTimeUnit === 'days') hours = electricityUsageTime * 24;
    const kwh = (powerConsumption / 1000) * hours;
    const costUSD = kwh * ratePerKWh;
    return { kwh, hours, costUSD };
  }, [powerConsumption, electricityUsageTime, electricityTimeUnit]);
  
  return (
    <Tabs defaultValue="water" className="w-full">
  <TabsList className="grid grid-cols-2 mb-4 w-full">
        <TabsTrigger value="water" className="flex items-center gap-2">
          <Droplet className="h-4 w-4" />
          Water
        </TabsTrigger>
        <TabsTrigger value="electricity" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Electricity
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="water" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="water-amount">Water Flow Rate</Label>
            <div className="flex gap-2 max-sm:flex-col">
              <Input
                id="water-amount"
                type="number"
                placeholder="Amount"
                min={0}
                value={waterAmount === 0 ? "" : waterAmount}
                onChange={(e) => setWaterAmount(parseFloat(e.target.value) || 0)}
              />
              <Select
                value={waterUnit} 
                onValueChange={setWaterUnit}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallons">Gallons</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="water-time">Usage Time</Label>
            <div className="flex gap-2 max-sm:flex-col">
              <Input
                id="water-time"
                type="number"
                placeholder="Time"
                min={0}
                value={waterUsageTime === 0 ? "" : waterUsageTime}
                onChange={(e) => setWaterUsageTime(parseFloat(e.target.value) || 0)}
              />
              <Select
                value={waterTimeUnit} 
                onValueChange={setWaterTimeUnit}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-4 bg-water-light/20 text-water-dark rounded-md">
            <p className="font-semibold">Estimated Cost: {toINR(waterResult.costUSD)}</p>
            <p className="text-xs mt-1 text-muted-foreground">~ {waterResult.gallons.toFixed(0)} gallons over {waterResult.minutes.toFixed(0)} minutes</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="electricity" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="power-consumption">Power Consumption</Label>
            <div className="flex gap-2 max-sm:flex-col">
              <Input
                id="power-consumption"
                type="number"
                placeholder="Watts"
                min={0}
                value={powerConsumption === 0 ? "" : powerConsumption}
                onChange={(e) => setPowerConsumption(parseFloat(e.target.value) || 0)}
              />
              <span className="flex items-center px-3 bg-muted rounded-md">Watts</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="electricity-time">Usage Time</Label>
            <div className="flex gap-2 max-sm:flex-col">
              <Input
                id="electricity-time"
                type="number"
                placeholder="Time"
                min={0}
                value={electricityUsageTime === 0 ? "" : electricityUsageTime}
                onChange={(e) => setElectricityUsageTime(parseFloat(e.target.value) || 0)}
              />
              <Select
                value={electricityTimeUnit} 
                onValueChange={setElectricityTimeUnit}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-4 bg-energy-light/20 text-energy-dark rounded-md">
            <p className="font-semibold">Estimated Cost: {toINR(electricityResult.costUSD)}</p>
            <p className="text-xs mt-1 text-muted-foreground">~ {electricityResult.kwh.toFixed(2)} kWh over {electricityResult.hours.toFixed(2)} hours</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
