import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AquaAssistant } from '@/components/chat/AquaAssistant';

// Floating button present on every page to toggle AI chatbot
export const GlobalChatbotButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col items-end gap-3">
      {open && (
        <div
          className={`shadow-2xl border bg-background rounded-xl overflow-hidden flex flex-col ${
            isMobile ? 'w-[95vw] h-[65vh]' : 'w-[380px] h-[520px]'
          } animate-in fade-in-0 zoom-in-95 duration-150`}
        >
          <AquaAssistant onClose={() => setOpen(false)} />
        </div>
      )}
      <Button
        onClick={() => setOpen((o) => !o)}
        size="icon"
        className={`rounded-full h-14 w-14 shadow-lg ${open ? 'bg-destructive hover:bg-destructive/90' : ''}`}
        aria-label={open ? 'Hide AI assistant' : 'Show AI assistant'}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default GlobalChatbotButton;