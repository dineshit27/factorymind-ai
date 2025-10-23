
import { Info } from "lucide-react";
import { RandomFact } from "@/components/RandomFact";

export function FactsSection({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  return (
    <div ref={ref} className="py-12 md:py-16 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 flex items-center justify-center gap-2">
          <Info className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          Did You Know?
        </h2>
        <RandomFact />
      </div>
    </div>
  );
}
