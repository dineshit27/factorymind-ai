import { fetchWeeklyTrend, fetchRoomDistribution, fetchMonthlyTrend } from '@/services/usage';
import { fetchCurrentBill } from '@/services/billing';
import { fetchDevices } from '@/services/connectedDevices';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface StreamChunk { done?: boolean; content?: string; }

// Very light heuristic fallback model (no external API) if no OpenAI key provided.
function localHeuristicReply(prompt: string, context: Record<string, any>): string {
  const lower = prompt.toLowerCase();
  if (lower.startsWith('/usage')) {
    return context.usageSummary || 'No recent usage data available.';
  }
  if (lower.startsWith('/billing')) {
    return context.billingSummary || 'No billing data available.';
  }
  if (lower.startsWith('/devices')) {
    return context.deviceSummary || 'No devices found.';
  }
  if (lower.includes('tip') || lower.includes('save')) {
    return 'Energy Tips: Shift heavy appliance use to off-peak hours, set AC to 24°C, and fix leaks to reduce water loss.';
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! Ask me about /usage, /devices, /billing or type /help for commands.';
  }
  return 'I can help with usage analytics (/usage), devices (/devices), and billing (/billing). Type /help for all commands.';
}

export async function buildContextSummaries() {
  const [weekly, rooms, bill, devices] = await Promise.all([
    fetchWeeklyTrend(),
    fetchRoomDistribution(),
    fetchCurrentBill(),
    fetchDevices().then(r => r.data || [])
  ]);
  const weeklyTxt = weekly.map(p=>`${p.label}: water ${p.water} / elec ${p.electricity}`).join('; ');
  const roomsTxt = rooms.map(r=>`${r.room} W:${r.total_water} E:${r.total_electricity}`).join('; ');
  const usageSummary = weekly.length ? `Weekly usage -> ${weeklyTxt}. Room distribution -> ${roomsTxt}` : '';
  const billingSummary = bill ? `Current bill total ${bill.total_amount} (water ${bill.water_cost} + electricity ${bill.electricity_cost}) period ${bill.period_start} to ${bill.period_end}` : '';
  const deviceSummary = Array.isArray(devices) && devices.length ? `${devices.length} devices connected; active ${devices.filter((d:any)=>d.is_active).length}` : '';
  return { usageSummary, billingSummary, deviceSummary };
}

export async function streamAssistantReply(messages: ChatMessage[], userInput: string, onChunk: (chunk: StreamChunk)=>void) {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (window as any)?.VITE_OPENAI_API_KEY;
  const ctx = await buildContextSummaries();
  const lower = userInput.toLowerCase().trim();

  // Slash commands short circuit
  if (lower.startsWith('/help')) {
    onChunk({ content: 'Commands: /usage /devices /billing /help. Ask natural questions for AI assistance.' });
    onChunk({ done: true });
    return;
  }
  if (lower.startsWith('/usage')) { onChunk({ content: ctx.usageSummary || 'No usage data.' }); onChunk({ done:true }); return; }
  if (lower.startsWith('/devices')) { onChunk({ content: ctx.deviceSummary || 'No device data.' }); onChunk({ done:true }); return; }
  if (lower.startsWith('/billing')) { onChunk({ content: ctx.billingSummary || 'No billing data.' }); onChunk({ done:true }); return; }

  // If no API key fallback to heuristic
  if (!apiKey) {
    onChunk({ content: localHeuristicReply(userInput, ctx) });
    onChunk({ done: true });
    return;
  }

  // Build system prompt with context
  const system = `You are AquaWatt AI. Provide concise, actionable answers. If user asks about numbers, use provided context. Context: ${JSON.stringify(ctx)}`;
  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      ...messages.slice(-8).map(m=>({ role: m.role, content: m.content })),
      { role: 'user', content: userInput }
    ],
    temperature: 0.4,
    stream: true
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    if (!res.body) throw new Error('No stream');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      for (let i=0;i<lines.length-1;i++) {
        const l = lines[i].trim();
        if (!l.startsWith('data:')) continue;
        const data = l.replace('data:','').trim();
        if (data === '[DONE]') { onChunk({ done: true }); return; }
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) onChunk({ content: delta });
        } catch {/* ignore parse errors */}
      }
      buffer = lines[lines.length-1];
    }
    onChunk({ done: true });
  } catch (e:any) {
    onChunk({ content: 'Error fetching AI response: ' + e.message });
    onChunk({ done: true });
  }
}
