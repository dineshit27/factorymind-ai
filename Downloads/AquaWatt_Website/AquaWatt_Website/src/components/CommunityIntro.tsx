import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Briefcase, MoreHorizontal, ArrowRight } from 'lucide-react';

export function CommunityIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add floating animations using CSS custom properties
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
      const duration = 3 + (index * 0.5);
      const delay = index * 0.3;
      (element as HTMLElement).style.setProperty('--float-duration', `${duration}s`);
      (element as HTMLElement).style.setProperty('--float-delay', `${delay}s`);
    });
  }, []);

  return (
  <div className="relative min-h-[55vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft gradient circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-2xl" />
      </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-4 md:py-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[520px]">
          
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                The Only Community of{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Creators & Pros
                </span>{' '}
                You Will Ever Need
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Connect with like-minded professionals, share knowledge, and grow together in our vibrant community of creators, developers, and industry experts.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all duration-300">
                <span className="text-lg">Join Community on Slack</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-8 pt-8"
            >
            </motion.div>
          </motion.div>

          {/* Right side - Floating profile cards and icons */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[600px] hidden lg:block"
          >
            {/* Profile Card 1 - Top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="floating-element absolute top-8 left-16 group cursor-pointer"
              style={{ 
                animation: 'float var(--float-duration, 3s) ease-in-out infinite var(--float-delay, 0s)' 
              }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-red-500/10 border border-red-100/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                    <div className="text-sm text-gray-600">UI/UX Designer</div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Card 2 - Middle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="floating-element absolute top-48 right-20 group cursor-pointer"
              style={{ 
                animation: 'float var(--float-duration, 3.5s) ease-in-out infinite var(--float-delay, 0.3s)' 
              }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-500/10 border border-teal-100/50 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Marcus Johnson</div>
                    <div className="text-sm text-gray-600">Full Stack Dev</div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Card 3 - Bottom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="floating-element absolute bottom-24 left-8 group cursor-pointer"
              style={{ 
                animation: 'float var(--float-duration, 4s) ease-in-out infinite var(--float-delay, 0.6s)' 
              }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-yellow-500/10 border border-yellow-100/50 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ana Rodriguez</div>
                    <div className="text-sm text-gray-600">Product Manager</div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Icons */}
            {/* Chat bubble icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="floating-element absolute top-32 right-8"
              style={{ 
                animation: 'float var(--float-duration, 2.5s) ease-in-out infinite var(--float-delay, 0s)' 
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer hover:scale-110">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Briefcase icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="floating-element absolute bottom-48 right-4"
              style={{ 
                animation: 'float var(--float-duration, 3s) ease-in-out infinite var(--float-delay, 0.4s)' 
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer hover:scale-110">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* More dots icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="floating-element absolute top-72 left-32"
              style={{ 
                animation: 'float var(--float-duration, 2.8s) ease-in-out infinite var(--float-delay, 0.8s)' 
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer hover:scale-110">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Curved dotted connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 600">
              <defs>
                <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="1.5" fill="#6366f1" opacity="0.5" />
                </pattern>
              </defs>
              
              {/* Curved lines connecting elements */}
              <path
                d="M 120 100 Q 200 150 280 200 Q 320 250 300 350"
                fill="none"
                stroke="url(#dots)"
                strokeWidth="2"
                className="animate-pulse"
              />
              <path
                d="M 80 350 Q 150 300 220 280 Q 280 260 340 220"
                fill="none"
                stroke="url(#dots)"
                strokeWidth="2"
                className="animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
        
        .floating-element {
          animation: float var(--float-duration, 3s) ease-in-out infinite var(--float-delay, 0s);
        }
      `}</style>
    </div>
  );
}