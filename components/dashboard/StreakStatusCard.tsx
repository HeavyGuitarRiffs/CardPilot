//components\dashboard\StreakStatusCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricGoal = {
  label: string;
  value: number;
  goal: number;
};

type Props = {
  metrics: MetricGoal[];
  title?: string;
  loading?: boolean;
};

export default function StreakStatusCard({
  metrics,
  title = "Today’s Progress",
  loading,
}: Props) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-2 w-full bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {metrics.map((m) => (
          <Metric key={m.label} label={m.label} value={m.value} goal={m.goal} />
        ))}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  goal,
}: {
  label: string;
  value: number;
  goal: number;
}) {
  const progress = Math.min((value / goal) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="opacity-70">
          {value} / {goal}
        </span>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full bg-primary transition-all",
            progress >= 100 && "bg-green-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}