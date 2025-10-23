import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonials = [
  {
    stars: 5,
    quote:
      "Super app da! En water & current usage full clear-a theriyudhu, waste-um control panna mudiyudhu🔥💧. Highly recommended!",
    name: "Moorthy G",
    title: "Houseowner, Chennai",
    initials: "MG",
  },
  {
    stars: 4,
    quote:
      "Interface clean-a iruku, data analysis easy-a puriyudhu, worth download 💯. Thank you AQUAWATT team!",
    name: "Uma M",
    title: "Houseowner, Chennai",
    initials: "UM",
  },
  {
    stars: 4,
    quote:
      "AquaWatt app super useful bro! Na daily usage track pannitu bills reduce panniten, semma idea 🔥 keep building smart solutions",
    name: "Tharun Varshan U",
    title: "Founder & CEO of Wyntrix, Chennai",
    initials: "TVU",
  },
  {
    stars: 3,
    quote:
      "The customer support is exceptional. They helped me set up everything remotely and the system works flawlessly. Three stars!",
    name: "Sathya Prasana",
    title: "Project Manager, Infosys",
    initials: "SP",
  },
  {
    stars: 4,
    quote:
      "Perfect for our smart home setup. The automation features work seamlessly with our existing devices. Couldn't be happier!",
    name: "Jeya Sakthi P",
    title: "UI/UX Designer, Accenture",
    initials: "JSP",
  },
  {
    stars: 5,
    quote:
      "The detailed analytics & reports help me understand our usage patterns. We've become more conscious about our energy consumption.",
    name: "Robert Kim",
    title: "Data Analyst, Mumbai",
    initials: "RK",
  },
];

export const TestimonialsCarouselSection: React.FC<{ sectionId?: string }> = ({ sectionId = "success-stories" }) => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  // Simple autoplay using the Carousel API; no extra dependency required
  React.useEffect(() => {
    if (!api) return;
    let stopped = false;
    let timer: number | undefined;
    const tick = () => {
      if (stopped) return;
      api.scrollNext();
      timer = window.setTimeout(tick, 3500);
    };
    timer = window.setTimeout(tick, 3500);
    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [api]);

  return (
    <section id={sectionId} className="py-16 md:py-20 relative isolate overflow-hidden">
      {/* Background gradient panel matching Our Impact */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
      {/* Soft spotlight accents */}
      <div className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Client Testimonials</span>
          <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white">Success Stories</h3>
          <p className="text-white/90 max-w-2xl mx-auto mt-3">
            Real words from customers who improved savings and sustainability with AquaWatt.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
          <CarouselContent>
            {testimonials.map((t, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">“{t.quote}”</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
