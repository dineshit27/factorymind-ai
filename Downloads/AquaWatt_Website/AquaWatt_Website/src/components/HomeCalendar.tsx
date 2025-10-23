
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDailyTotals } from "@/services/usage";

export function HomeCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTotals, setSelectedTotals] = React.useState<{water:number; electricity:number} | null>(null);
  const [waterHighUsageDates, setWaterHighUsageDates] = React.useState<Date[]>([]);
  const [electricityHighUsageDates, setElectricityHighUsageDates] = React.useState<Date[]>([]);

  // Load markers for current month (simple heuristic: mark days above 75th percentile of month-to-date)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totals: { day: number; water: number; electricity: number }[] = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const dayDate = new Date(year, month, d);
          const t = await fetchDailyTotals(dayDate);
          totals.push({ day: d, water: t.water, electricity: t.electricity });
        }
        if (cancelled) return;
        const waters = totals.map(t => t.water).sort((a,b)=>a-b);
        const elects = totals.map(t => t.electricity).sort((a,b)=>a-b);
        const w75 = waters[Math.floor(0.75 * waters.length)] || 0;
        const e75 = elects[Math.floor(0.75 * elects.length)] || 0;
        setWaterHighUsageDates(totals.filter(t => t.water >= w75 && t.water > 0).map(t => new Date(year, month, t.day)));
        setElectricityHighUsageDates(totals.filter(t => t.electricity >= e75 && t.electricity > 0).map(t => new Date(year, month, t.day)));
      } catch (e) {
        // ignore marker errors
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch totals when selecting a date
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!date) return;
      const t = await fetchDailyTotals(date);
      if (!cancelled) setSelectedTotals(t);
    })();
    return () => { cancelled = true; };
  }, [date]);
  
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border max-w-full"
        modifiers={{
          waterHighUsage: waterHighUsageDates,
          electricityHighUsage: electricityHighUsageDates,
        }}
        modifiersClassNames={{
          waterHighUsage: "bg-water-light text-water-dark font-medium",
          electricityHighUsage: "bg-energy-light text-energy-dark font-medium",
        }}
      />
      
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-water-dark rounded-full mr-2"></div>
          <span>High Water Usage</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-energy-dark rounded-full mr-2"></div>
          <span>High Electricity Usage</span>
        </div>
      </div>
      
      {date && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-center">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {selectedTotals && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-water-light/30 text-water-dark">
                  <div className="text-xs uppercase tracking-wide">Water</div>
                  <div className="font-semibold">{selectedTotals.water} L</div>
                </div>
                <div className="p-2 rounded bg-energy-light/30 text-energy-dark">
                  <div className="text-xs uppercase tracking-wide">Electricity</div>
                  <div className="font-semibold">{selectedTotals.electricity} kWh</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
