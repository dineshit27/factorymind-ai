
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Zap, RefreshCw } from 'lucide-react';

// Facts about water and electricity
const waterFacts = [
  "The average household uses about 80-100 gallons of water per person per day.",
  "A running toilet can waste up to 200 gallons of water daily.",
  "A dripping faucet can waste up to 3,000 gallons of water per year.",
  "Taking a 5-minute shower uses 10-25 gallons of water.",
  "A full bathtub requires about 70 gallons of water.",
  "The average American uses 88 gallons of water daily at home.",
  "It takes about 1 gallon of water to grow a single almond.",
  "Washing a full load of dishes in a dishwasher uses less water than washing the same number by hand.",
  "Turning off the tap while brushing your teeth can save up to 8 gallons of water per day.",
  "It takes about 713 gallons of water to produce one cotton t-shirt."
];

const electricityFacts = [
  "The average US household consumes about 10,649 kilowatt-hours (kWh) of electricity per year.",
  "LED bulbs use up to 90% less energy than incandescent bulbs.",
  "Refrigerators account for about 13% of home energy use.",
  "Phantom energy (standby power) can account for 10% of your electricity bill.",
  "A ceiling fan uses about 75 watts of electricity, while a central air conditioner uses about 3,500 watts.",
  "Charging your phone overnight uses only about 0.03 kWh of electricity.",
  "A single load in the dryer uses 5 times more electricity than washing the same load.",
  "Smart thermostats can save up to 10-15% on heating and cooling costs.",
  "Using a laptop instead of a desktop computer can reduce energy consumption by up to 80%.",
  "Solar panels can reduce the average home's electricity bill by 50-90%."
];

export function RandomFact() {
  const [currentFact, setCurrentFact] = useState<{text: string, type: 'water' | 'electricity'}>({
    text: waterFacts[0],
    type: 'water'
  });
  
  const generateRandomFact = () => {
    // Randomly decide whether to show a water or electricity fact
    const factType = Math.random() > 0.5 ? 'water' : 'electricity';
    const facts = factType === 'water' ? waterFacts : electricityFacts;
    const randomIndex = Math.floor(Math.random() * facts.length);
    
    setCurrentFact({
      text: facts[randomIndex],
      type: factType
    });
  };
  
  // Generate a random fact when the component mounts
  useEffect(() => {
    generateRandomFact();
    
    // Set an interval to change the fact every 30 seconds
    const interval = setInterval(generateRandomFact, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="transition-all duration-300 hover:shadow-xl max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 flex-shrink-0 ${
            currentFact.type === 'water' 
              ? 'bg-water-light text-water-dark' 
              : 'bg-energy-light text-energy-dark'
          }`}>
            {currentFact.type === 'water' ? (
              <Droplet className="h-6 w-6" />
            ) : (
              <Zap className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">
              {currentFact.type === 'water' ? 'Water Fact' : 'Electricity Fact'}
            </h3>
            <p className="text-muted-foreground">{currentFact.text}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateRandomFact}
            className="group"
          >
            <RefreshCw className="h-4 w-4 mr-2 transition-transform group-hover:rotate-180" />
            New Fact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
