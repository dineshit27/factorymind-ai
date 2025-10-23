
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropletIcon, LightbulbIcon } from "lucide-react";

interface UsageCardProps {
  title: string;
  type: "water" | "electricity";
  value: string;
  change?: string;
  className?: string;
}

export function UsageCard({ title, type, value, change, className }: UsageCardProps) {
  const Icon = type === "water" ? DropletIcon : LightbulbIcon;
  const iconColorClass = type === "water" ? "text-blue-600" : "text-yellow-600";
  const bgColorClass = type === "water" ? "bg-blue-50" : "bg-yellow-50";
  const borderColorClass = type === "water" ? "border-blue-200" : "border-yellow-200";

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-105 border ${borderColorClass} ${className}`}>
      <CardHeader className={`${bgColorClass} flex flex-row items-center justify-between space-y-0 pb-4`}>
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-full bg-white/80`}>
          <Icon className={`h-4 w-4 ${iconColorClass}`} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
