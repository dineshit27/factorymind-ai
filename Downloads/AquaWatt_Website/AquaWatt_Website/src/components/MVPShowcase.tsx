import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Illustrated profile SVGs
const getIllustratedAvatar = (name: string, gradient: string) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  const colors = {
    'from-blue-400 to-blue-600': ['#60A5FA', '#2563EB'],
    'from-green-400 to-green-600': ['#4ADE80', '#059669'],
    'from-purple-400 to-purple-600': ['#A78BFA', '#7C3AED'],
    'from-red-400 to-red-600': ['#F87171', '#DC2626'],
    'from-teal-400 to-teal-600': ['#2DD4BF', '#0D9488'],
    'from-yellow-400 to-yellow-600': ['#FBBF24', '#D97706']
  };
  
  const [color1, color2] = colors[gradient as keyof typeof colors] || ['#60A5FA', '#2563EB'];
  
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="w-full h-full">
      <defs>
        <linearGradient id={`grad-${name.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill={`url(#grad-${name.replace(/\s+/g, '')})`} stroke="white" strokeWidth="4"/>
      <circle cx="48" cy="38" r="12" fill="white" opacity="0.9"/>
      <path d="M25 70 Q25 55 48 55 Q71 55 71 70 L71 85 Q71 90 66 90 L30 90 Q25 90 25 85 Z" fill="white" opacity="0.9"/>
      <text x="48" y="44" textAnchor="middle" fill={color2} fontSize="16" fontWeight="bold">{initials}</text>
    </svg>
  );
};

// Mock MVP data - replace with real backend data
const mvpData = [
  {
    id: 1,
    name: "Damien Cregan",
    title: "CEO & Systems Architect",
    company: "bcCloudTech Ltd.",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    id: 2,
    name: "Kevin Flynn",
    title: "COO",
    company: "Premier Opthalmic.",
    gradient: "from-green-400 to-green-600"
  },
  {
    id: 3,
    name: "Donald Love",
    title: "CEO",
    company: "SHIELD Pet Doors.",
    gradient: "from-purple-400 to-purple-600"
  },
  {
    id: 4,
    name: "Gordon Mankelow",
    title: "Zoho Consultant and Authorised partner",
    company: "Relativity Limited.",
    gradient: "from-red-400 to-red-600"
  },
  {
    id: 5,
    name: "Abhishek Sharma",
    title: "Director of Implementation",
    company: "Encaptechno.",
    gradient: "from-teal-400 to-teal-600"
  },
  {
    id: 6,
    name: "Sarah Johnson",
    title: "VP of Engineering",
    company: "TechFlow Inc.",
    gradient: "from-yellow-400 to-yellow-600"
  }
];

export function MVPShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 5;
  const maxIndex = Math.max(0, mvpData.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    if (currentIndex >= maxIndex) {
      scrollToIndex(0); // Loop back to start
    } else {
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex <= 0) {
      scrollToIndex(maxIndex); // Loop to end
    } else {
      scrollToIndex(currentIndex - 1);
    }
  };

  // Auto-carousel effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const MVPCard = ({ mvp, index }: { mvp: typeof mvpData[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-64 mx-4"
    >
      <Card className="text-center hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <CardContent className="p-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto rounded-full p-1 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <div className="w-full h-full rounded-full overflow-hidden">
                {getIllustratedAvatar(mvp.name, mvp.gradient)}
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">•</span>
            </div>
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {mvp.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-1">
            {mvp.title}
          </p>
          
          <p className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            {mvp.company}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section className="bg-gray-900 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            AquaWatt MVP's
          </h2>
        </motion.div>

        {/* MVP Carousel */}
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* MVP Cards */}
          <div className="overflow-hidden mx-12">
            <div 
              ref={scrollRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (256 + 32)}px)` // 256px card width + 32px margin
              }}
            >
              {mvpData.map((mvp, index) => (
                <MVPCard key={mvp.id} mvp={mvp} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            WANT TO BE A AQUAWATT MVP?
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}