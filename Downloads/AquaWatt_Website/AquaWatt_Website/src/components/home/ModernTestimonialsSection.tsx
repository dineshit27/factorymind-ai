import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ClientPhoto {
  id: number;
  name: string;
  position: string;
  src?: string;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ModernTestimonialsSection = ({ onReadSuccessStories, clients, showClientGrid = false, isOpen }: { onReadSuccessStories?: () => void; clients?: Array<Pick<ClientPhoto, 'name' | 'position' | 'src'>>; showClientGrid?: boolean; isOpen?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Defaults if no client list provided
  const defaultClients: ClientPhoto[] = [
    { id: 1, name: 'Sarah Chen', position: 'CEO, TechFlow' },
    { id: 2, name: 'Marcus Johnson', position: 'CTO, InnovateLab' },
    { id: 3, name: 'Ana Rodriguez', position: 'VP Sales, GrowthCorp' },
    { id: 4, name: 'David Kim', position: 'Head of Ops, Finwise' },
    { id: 5, name: 'Lisa Chang', position: 'Director, FinTechPro' },
    { id: 6, name: 'Rachel Davis', position: 'VP Product, CloudTech' },
    { id: 7, name: 'Alex Garcia', position: 'CTO, AITech' },
    { id: 8, name: 'Michael Brown', position: 'CEO, DataDriven' },
    { id: 9, name: 'Sophie Lee', position: 'Founder, EcoSolutions' },
    { id: 10, name: 'Priya Nair', position: 'COO, HealthX' },
    { id: 11, name: 'Tom Becker', position: 'CPO, RetailHub' },
  ];

  const allClients: ClientPhoto[] = (clients?.map((c, idx) => ({
    id: idx + 1,
    name: c.name,
    position: c.position,
    src: c.src,
  })) ?? defaultClients).slice(0, 11);

  // Two aligned rows (Top: 6, Bottom: 5) to match reference
  const row1 = allClients.slice(0, Math.min(6, allClients.length));
  const row2 = allClients.slice(row1.length, Math.min(row1.length + 5, allClients.length));

  const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'md': return 'w-20 h-20';
      case 'lg': return 'w-24 h-24';
      default: return 'w-20 h-20';
    }
  };

  const PhotoCard = ({ c, large }: { c: ClientPhoto; large?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="relative client-card group">
        <div className={`${getSizeClasses(large ? 'lg' : 'md')} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden bg-white`}
             style={{ aspectRatio: '1 / 1' }}>
          {c.src ? (
            <img src={c.src} alt={c.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${c.gradient ?? 'from-gray-100 to-gray-200'} flex items-center justify-center`}> 
              <span className="text-gray-700 font-semibold">{c.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
        </div>
        {/* Hover info */}
        <div className="pointer-events-none absolute top-full mt-3 -translate-x-1/2 left-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">{c.name}</div>
          <div className="text-xs text-gray-500 whitespace-nowrap">{c.position}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
  <section className="relative py-8 md:py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-teal-100/20 to-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div 
        ref={containerRef}
        className="relative max-w-6xl mx-auto px-6 lg:px-8"
      >
        {/* Top aligned client grid (toggleable) */}
        {showClientGrid && (
          <div className="hidden md:block relative z-10">
            <div className="flex justify-center gap-6 lg:gap-8">
              {row1.map((c, idx) => (
                <PhotoCard key={c.id} c={c} large={idx % 3 === 1} />
              ))}
            </div>
            <div className="mt-6 lg:mt-8 flex justify-center gap-6 lg:gap-8">
              {/* Slight horizontal offset to mimic reference */}
              <div className="hidden lg:block w-10" aria-hidden />
              {row2.map((c, idx) => (
                <PhotoCard key={c.id} c={c} large={idx === 2} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
  <div className="relative z-20 text-center max-w-4xl mx-auto py-4 md:py-6">
          {/* Section Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wider rounded-full">
              Testimonials
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Trusted by leaders from{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              various industries
            </span>
          </motion.h2>

          {/* Sub-text */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Learn why professionals trust our solutions to complete their customer journeys.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={onReadSuccessStories}
              aria-expanded={isOpen ? true : false}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 hover:bg-gray-800"
            >
              <span className="text-lg">{isOpen ? 'Hide Success Stories' : 'Read Success Stories'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center gap-8 mt-10 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>500+ Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>98% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* No extra CSS needed; layout uses Tailwind utilities */}
    </section>
  );
};