
import { DashboardHeader } from "@/components/DashboardHeader";
import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
// Removed legacy sections (Facts, Tools, Achievements, Notes, Chatbot)
import { OurImpactSection } from "@/components/home/OurImpactSection";
import { BusinessSection } from "@/components/home/BusinessSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ModernTestimonialsSection } from "@/components/home/ModernTestimonialsSection";
import { TestimonialsCarouselSection } from "@/components/home/TestimonialsCarouselSection";
import { CreatorSection } from "@/components/home/CreatorSection";

const Index = () => {
  // Features section removed
  const scrollToAnalytics = () => {
    const el = document.getElementById('analytics-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElement = document.getElementById('hero-section');
      
      if (heroElement) {
        heroElement.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [showSuccessStories, setShowSuccessStories] = useState(false);
  const storiesRef = useRef<HTMLDivElement | null>(null);

  const handleReadSuccessStories = () => {
    setShowSuccessStories((prev) => {
      const next = !prev;
      // If opening, scroll to the carousel; if closing, scroll back to the testimonials heading
      setTimeout(() => {
        const targetId = next ? "success-stories" : "testimonials";
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return next;
    });
  };

  const handleCloseSuccessStories = () => {
    setShowSuccessStories(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col overflow-auto w-full md:w-auto">
        <DashboardHeader />
        
        <div className="px-4 md:px-0 flex flex-col">
          <HeroSection onScrollToFeatures={scrollToAnalytics} />
          {/* Our Impact: mobile first, desktop order 1 */}
          <div id="our-impact" className="scroll-mt-24 order-1 md:order-1">
            <OurImpactSection />
          </div>
          {/* AquaWatt for Business: mobile order 2 (after Our Impact), desktop 2 */}
          <div id="business" className="scroll-mt-24 order-2 md:order-2">
            <BusinessSection />
          </div>
          {/* What We Do: move before Testimonials — mobile order 3, desktop 3 */}
          <div id="what-we-do" className="scroll-mt-24 order-3 md:order-3">
            <WhatWeDoSection />
          </div>
          {/* Pasted image section (Modern Testimonials): now after What We Do — mobile order 4, desktop 4 */}
          <div id="testimonials" className="scroll-mt-24 order-4 md:order-4">
            <ModernTestimonialsSection onReadSuccessStories={handleReadSuccessStories} isOpen={showSuccessStories} />
          </div>
          {/* Success stories carousel: remains adjacent to testimonials — mobile order 5, desktop 5 */}
          {showSuccessStories && (
            <div className="order-5 md:order-5">
              <TestimonialsCarouselSection sectionId="success-stories" />
            </div>
          )}
          {/* Creator section: mobile order 5, desktop 6 */}
          <div id="creator" className="scroll-mt-24 order-6 md:order-6">
            <CreatorSection />
          </div>
        </div>
        {/* ChatbotWidget removed per new requirements */}
      </main>
    </div>
  );
};

export default Index;
