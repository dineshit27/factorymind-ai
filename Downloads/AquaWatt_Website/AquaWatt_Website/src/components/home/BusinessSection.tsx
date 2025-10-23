import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BusinessSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAboutCreator = () => {
    // Navigate to home, then scroll to the "creator" section
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('creator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left: Heading, copy and CTA (moved to left) */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 p-[2px]">
                <div className="h-full w-full rounded-md bg-background grid place-items-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-bold">AquaWatt for</div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Business</h2>
              </div>
            </div>

            <div className="mt-6 space-y-5 text-lg text-foreground/80">
              <p>
                Experience the breadth and depth of the AquaWatt platform with the professional
                services, infrastructure, and security that growing organizations need.
              </p>
              <p>
                Streamline utility processes, centralize insights, and build strong relationships
                with your customers and teams while driving sustainable growth at scale.
              </p>
              <p>
                With AquaWatt, you gain a powerful ecosystem that unites water and electricity management into one intelligent platform — empowering data-driven decisions, reducing resource waste, and optimizing operational efficiency.
              </p>
              <p>
                AquaWatt transforms how utilities & users collaborate toward a smarter, greener future, empowering every household to make data-driven decisions that reduce waste, promote sustainable living.
              </p>
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <a href="/contact">Learn more</a>
              </Button>
            </div>
          </div>

          {/* Right: Illustration + testimonial (moved to right) */}
          <div className="md:col-span-6">
            {/* Custom CSS Cityscape Illustration */}
            <div className="rounded-2xl overflow-hidden border bg-gradient-to-b from-blue-50 to-blue-100 relative h-[320px] md:h-[360px]">
              {/* Sky with decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-cyan-50">
                {/* Handshake icon at top */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  <svg width="80" height="40" viewBox="0 0 80 40" className="text-gray-700">
                    <path d="M20 20 L30 15 L35 20 L45 15 L50 20 L60 20" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="25" cy="20" r="3" fill="currentColor" />
                    <circle cx="55" cy="20" r="3" fill="currentColor" />
                  </svg>
                </div>
                
                {/* Sun/decoration */}
                <div className="absolute top-6 right-12 w-3 h-3 rounded-full bg-yellow-400/60"></div>
                <div className="absolute top-10 right-20 w-2 h-2 rounded-full bg-yellow-300/40"></div>
              </div>

              {/* Buildings cityscape */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-8 pb-6">
                {/* Building 1 - Blue tall left */}
                <div className="relative w-16 h-36 bg-gradient-to-b from-blue-200 to-blue-300 rounded-t-lg border-2 border-blue-300/50 shadow-lg">
                  <div className="absolute top-2 left-2 right-2 space-y-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400/40"></div>
                        <div className="w-2 h-2 bg-blue-400/40"></div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <span className="text-white text-xs font-bold">"</span>
                  </div>
                </div>

                {/* Building 2 - Red/coral tall center */}
                <div className="relative w-14 h-44 bg-gradient-to-b from-red-300 to-red-400 rounded-t-sm shadow-xl">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-red-500 rounded-t"></div>
                  <div className="absolute top-4 left-1 right-1 space-y-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex gap-1 justify-center">
                        <div className="w-2 h-2 bg-red-100/60"></div>
                        <div className="w-2 h-2 bg-red-100/60"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Building 3 - Yellow/gold short */}
                <div className="relative w-20 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-tl-3xl shadow-lg border-2 border-yellow-500/30">
                  <div className="absolute top-3 left-2 right-2 space-y-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-1">
                        <div className="w-2 h-1.5 bg-yellow-500/40"></div>
                        <div className="w-2 h-1.5 bg-yellow-500/40"></div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-orange-400"></div>
                </div>

                {/* Building 4 - Black/white outline */}
                <div className="relative w-12 h-28 bg-white border-2 border-black rounded-t shadow-md">
                  <div className="absolute top-2 left-1 right-1 space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-1 justify-center">
                        <div className="w-1.5 h-1.5 border border-gray-400"></div>
                        <div className="w-1.5 h-1.5 border border-gray-400"></div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-200 border-t border-gray-400"></div>
                </div>

                {/* Building 5 - Cyan tall right */}
                <div className="relative w-16 h-32 bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-t-lg shadow-lg">
                  <div className="absolute top-2 left-2 right-2 space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="grid grid-cols-2 gap-1">
                        <div className="h-2 bg-cyan-400/40 rounded-sm"></div>
                        <div className="h-2 bg-cyan-400/40 rounded-sm"></div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-0 right-2 w-1 h-6 bg-cyan-400"></div>
                </div>

                {/* Building 6 - Green striped tall */}
                <div className="relative w-12 h-40 bg-gradient-to-r from-green-300 to-emerald-400 rounded-t shadow-xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex-1 border-b border-green-500/20"></div>
                    ))}
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-full bg-white/30"></div>
                </div>

                {/* Building 7 - Blue small right */}
                <div className="relative w-14 h-24 bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-lg shadow-md">
                  <div className="absolute top-3 left-2 right-2 space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-100/50"></div>
                        <div className="w-2 h-2 bg-blue-100/50"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <figure className="mt-8">
              <blockquote className="text-2xl md:text-3xl leading-snug md:leading-snug text-foreground font-medium">
                "With our complete operations under control, our efficiency went up by 80% in the last year with AquaWatt."
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 ring-2 ring-blue-500/60">
                    <AvatarImage src="/creator-photo.png" alt="Business leader" />
                    <AvatarFallback className="font-semibold">TJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Dinesh M</div>
                    <div className="text-sm text-muted-foreground">Design & Developer  |  AquaWatt</div>
                  </div>
                </div>
                <button onClick={handleAboutCreator} className="group text-primary inline-flex items-center gap-2 font-semibold tracking-wide hover:text-primary/80 transition-colors">
                  ABOUT HIM
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
