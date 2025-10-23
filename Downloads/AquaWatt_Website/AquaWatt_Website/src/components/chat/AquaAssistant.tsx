import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot, Send, Trash2, Command, PlugZap, Activity, Wallet, HelpCircle, Loader2, X } from 'lucide-react';
import { streamAssistantReply, ChatMessage } from '@/services/aiAssistant';

interface Props { onClose?: () => void; }

export const AquaAssistant: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'sys-1', role: 'assistant', createdAt: Date.now(), content: 'Hi! I\'m your AquaWatt AI assistant. Ask about /usage /devices /billing or type /help.'
  }]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages, streaming]);

  const append = (partial: string, msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: m.content + partial } : m));
  };

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: ChatMessage = { id: 'u-'+Date.now(), role: 'user', content: input.trim(), createdAt: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const assistantId = 'a-'+Date.now();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', createdAt: Date.now() }]);
    const userInput = input.trim();
    setInput('');
    setStreaming(true);
    await streamAssistantReply(messages, userInput, (chunk) => {
      if (chunk.content) append(chunk.content, assistantId);
      if (chunk.done) setStreaming(false);
    });
  };

  const quick = (cmd: string) => { setInput(cmd); setTimeout(()=>send(), 10); };
  const clear = () => setMessages(m=>m.filter(x=>x.role==='assistant' && x.id==='sys-1'));

  return (
    <Card className="flex flex-col w-full h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border shadow-xl">
      <div className="px-3 py-2 border-b flex items-center gap-2 text-sm font-medium">
        <Bot className="h-4 w-4 text-primary" /> AquaWatt Assistant
        <div className="ml-auto flex gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={clear} title="Clear">
            <Trash2 className="h-4 w-4" />
          </Button>
          {onClose && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>}
        </div>
      </div>
      <div className="p-2 flex flex-wrap gap-1 border-b">
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={()=>quick('/usage')}><Activity className="h-3 w-3 mr-1"/>Usage</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={()=>quick('/devices')}><PlugZap className="h-3 w-3 mr-1"/>Devices</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={()=>quick('/billing')}><Wallet className="h-3 w-3 mr-1"/>Billing</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={()=>quick('/help')}><HelpCircle className="h-3 w-3 mr-1"/>Help</Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm">
        {messages.map(m=> (
          <div key={m.id} className={`flex ${m.role==='user'?'justify-end':''}`}>
            <div className={`rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap text-xs md:text-sm leading-relaxed ${m.role==='user'?'bg-primary text-primary-foreground':'bg-muted'}`}>{m.content || (streaming && m.id.startsWith('a-') ? '...' : '')}</div>
          </div>
        ))}
        {streaming && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin"/>Thinking...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-2 border-t">
        <div className="flex gap-2">
          <Input placeholder="Ask or use /usage /devices /billing" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} className="text-sm" />
          <Button onClick={send} size="icon" disabled={!input.trim() || streaming}>{streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1"><Command className="h-3 w-3"/> Type /help for commands</div>
      </div>
    </Card>
  );
};
