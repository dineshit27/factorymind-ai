import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const TestimonialsSection = ({ onReadSuccessStories, showSuccessStories }: { onReadSuccessStories?: () => void; showSuccessStories?: boolean }) => {
  // Array of professional placeholder avatars positioned around the content
  const avatars = [
    // Left side avatars
    { id: 1, position: "top-[15%] left-[8%]", size: "w-16 h-20", rotation: "-rotate-3" },
    { id: 2, position: "top-[5%] left-[18%]", size: "w-20 h-24", rotation: "rotate-2" },
    { id: 3, position: "top-[30%] left-[12%]", size: "w-18 h-22", rotation: "rotate-6" },
    { id: 4, position: "top-[55%] left-[6%]", size: "w-16 h-24", rotation: "-rotate-6" },
    { id: 5, position: "top-[48%] left-[16%]", size: "w-20 h-20", rotation: "rotate-3" },
    
    // Center-left avatars
    { id: 6, position: "top-[8%] left-[32%]", size: "w-18 h-20", rotation: "-rotate-2" },
    { id: 7, position: "top-[38%] left-[28%]", size: "w-20 h-24", rotation: "rotate-4" },
    
    // Center-right avatars
    { id: 8, position: "top-[8%] right-[32%]", size: "w-20 h-26", rotation: "rotate-2" },
    { id: 9, position: "top-[38%] right-[28%]", size: "w-18 h-22", rotation: "-rotate-3" },
    
    // Right side avatars
    { id: 10, position: "top-[5%] right-[18%]", size: "w-18 h-20", rotation: "-rotate-4" },
    { id: 11, position: "top-[15%] right-[8%]", size: "w-16 h-18", rotation: "rotate-5" },
    { id: 12, position: "top-[30%] right-[12%]", size: "w-20 h-26", rotation: "-rotate-2" },
    { id: 13, position: "top-[55%] right-[6%]", size: "w-16 h-24", rotation: "rotate-3" },
    { id: 14, position: "top-[48%] right-[16%]", size: "w-18 h-22", rotation: "-rotate-5" },
  ];

  // Generate different gradient combinations for diversity
  const gradients = [
    "from-blue-100 via-blue-50 to-indigo-100",
    "from-purple-100 via-pink-50 to-purple-100",
    "from-green-100 via-emerald-50 to-teal-100",
    "from-orange-100 via-yellow-50 to-amber-100",
    "from-cyan-100 via-sky-50 to-blue-100",
    "from-rose-100 via-pink-50 to-red-100",
    "from-violet-100 via-purple-50 to-indigo-100",
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Floating Avatar Placeholders */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {avatars.map((avatar, index) => (
            <div
              key={avatar.id}
              className={`absolute ${avatar.position} ${avatar.size} ${avatar.rotation} rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:z-10`}
            >
              {/* Gradient placeholder for professional photos */}
              <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Content */}
        <div className="text-center relative z-20 max-w-3xl mx-auto py-12">
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trusted by leaders
            <br />
            <span className="text-blue-400">from various industries</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Learn why professionals trust our solutions to complete their customer journeys.
          </p>
          
          <Button 
            size="lg" 
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-10 py-7 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            onClick={onReadSuccessStories}
          >
            Read Success Stories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
