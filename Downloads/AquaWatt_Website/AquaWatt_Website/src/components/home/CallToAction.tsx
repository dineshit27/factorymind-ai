import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section aria-labelledby="cta-heading" className="py-16 md:py-24 bg-blue-200">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 id="cta-heading" className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Ready to do your best work?
        </h2>
        <p className="mt-3 text-lg md:text-2xl text-muted-foreground">Let's get you started.</p>
        <div className="mt-8">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-md"
          >
            SIGN UP NOW
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
