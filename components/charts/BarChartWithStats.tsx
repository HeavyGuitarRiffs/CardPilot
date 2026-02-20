//components\charts\BarChartWithStats.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartLegend } from "./ChartLegend";
import { ChartStats } from "./ChartStats";
import { useTheme } from "next-themes";
import dayjs from "dayjs";

/* -------------------- Types -------------------- */
type TimeSeriesPoint = {
  date: string; // ISO date
  value: number;
};

type Props = {
  data: TimeSeriesPoint[];
  metricLabel: string;
  unit?: "hours" | "minutes" | "count" | "percent";
};

/* -------------------- Component -------------------- */
export function BarChartWithStats({ data, metricLabel, unit = "count" }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#ffffff" : "#0B1020";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tooltipBg = isDark ? "#0F172A" : "#ffffff";
  const tooltipText = isDark ? "#ffffff" : "#0B1020";

  const formatY = (v: number): string => {
    switch (unit) {
      case "hours":
        return `${v}h`;
      case "minutes":
        return `${v}m`;
      case "percent":
        return `${v}%`;
      default:
        return String(v);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke={gridColor} vertical={false} />

            <XAxis
              dataKey="date"
              stroke={textColor}
              tickFormatter={(d) => dayjs(d).format("MMM D")}
            />

            <YAxis
              stroke={textColor}
              tickFormatter={formatY}
            />

            <RechartsTooltip
              formatter={(value) => formatY(value as number)}
              labelFormatter={(label) => dayjs(label).format("MMM D, YYYY")}
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: "8px",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.1)",
              }}
            />

            <Bar
              dataKey="value"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + stats */}
      <div className="space-y-2">
        <ChartLegend data={data} label={metricLabel} />
        <ChartStats data={data} />
      </div>
    </div>
  );
}