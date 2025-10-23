// Optional AI utilities for generating insights and recommendations.
// Uses OpenAI if VITE_OPENAI_API_KEY is set; otherwise returns heuristic fallbacks.

export async function getAIInsights(context: {
  monthly: Array<{ month: string; water: number; electricity: number }>;
  distribution: Array<{ room: string; total_water: number; total_electricity: number }>;
}): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  // Build a compact prompt
  const last = context.monthly.at(-1);
  const prev = context.monthly.at(-2);
  const waterDelta = last && prev ? percentChange(prev.water, last.water) : 0;
  const elecDelta = last && prev ? percentChange(prev.electricity, last.electricity) : 0;

  const topRoom = [...context.distribution]
    .sort((a, b) => b.total_water + b.total_electricity - (a.total_water + a.total_electricity))
    [0];

  const fallback = `Water ${fmtDelta(waterDelta)}, Electricity ${fmtDelta(elecDelta)} vs previous month. Highest usage room: ${topRoom?.room ?? 'N/A'}.`;

  if (!apiKey) return fallback;

  try {
    const prompt = `You are an assistant summarizing home water and electricity usage briefly.
Monthly series JSON: ${JSON.stringify(context.monthly)}
By-room totals JSON: ${JSON.stringify(context.distribution)}
Write 2 concise sentences summarizing trends, increases/decreases, and any notable room.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a concise analytics assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 160,
      }),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

export async function getAIRecommendations(context: {
  monthly: Array<{ month: string; water: number; electricity: number }>;
  distribution: Array<{ room: string; total_water: number; total_electricity: number }>;
}): Promise<string[]> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;

  const hints = heuristicRecommendations(context);
  if (!apiKey) return hints;

  try {
    const prompt = `Suggest 3 concrete actions to reduce water/electricity usage for a household given:
Monthly series JSON: ${JSON.stringify(context.monthly)}
Room totals JSON: ${JSON.stringify(context.distribution)}
Be specific, 1 sentence each, start without numbering.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You provide practical, concise conservation tips.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content || '';
    const lines = text
      .split(/\n+/)
      .map((l: string) => l.replace(/^[-\d)\.\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
    return lines.length ? lines : hints;
  } catch {
    return hints;
  }
}

function heuristicRecommendations(context: {
  monthly: Array<{ month: string; water: number; electricity: number }>;
  distribution: Array<{ room: string; total_water: number; total_electricity: number }>;
}): string[] {
  const recs: string[] = [];
  const last = context.monthly.at(-1);
  const prev = context.monthly.at(-2);
  if (last && prev) {
    const w = percentChange(prev.water, last.water);
    const e = percentChange(prev.electricity, last.electricity);
    if (e > 5) recs.push('Run high-load appliances during off-peak hours to cut electricity costs.');
    if (w > 5) recs.push('Inspect faucets and toilet tanks for small leaks to reduce water loss.');
  }
  const topWater = [...context.distribution].sort((a,b)=>b.total_water-a.total_water)[0];
  if (topWater?.room) recs.push(`Optimize usage in ${topWater.room}—it currently leads in water consumption.`);
  if (!recs.length) recs.push('Great job maintaining stable usage—consider scheduling periodic audits to keep it optimized.');
  return recs.slice(0,3);
}

function percentChange(oldVal: number, newVal: number): number {
  if (oldVal === 0) return newVal === 0 ? 0 : 100;
  return ((newVal - oldVal) / oldVal) * 100;
}

function fmtDelta(v: number): string {
  const sign = v >= 0 ? '↑' : '↓';
  return `${sign}${Math.abs(v).toFixed(1)}%`;
}
