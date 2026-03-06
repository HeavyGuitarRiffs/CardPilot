//components/charts/LineChartWithStats.tsx
"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { ChartLegend } from "./ChartLegend";
import { ChartStats } from "./ChartStats";
import { useTheme } from "next-themes";
import dayjs from "dayjs";

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

type Props = {
  data: TimeSeriesPoint[];
  metricLabel: string;
  variant?: "line" | "area";
  unit?: "hours" | "minutes" | "count" | "percent";
  isLoading?: boolean;
};

export function LineChartWithStats({
  data,
  metricLabel,
  variant = "line",
  unit = "count",
  isLoading = false,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Hydration-safe mount flag
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update to microtask to avoid React warning
    Promise.resolve().then(() => setMounted(true));
  }, []);

  // Theme-aware colors
  const textColor = isDark ? "#ffffff" : "#0B1020";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tooltipBg = isDark ? "#0F172A" : "#ffffff";
  const tooltipText = isDark ? "#ffffff" : "#0B1020";

  // Memoized formatter
  const formatNumber = useCallback(
    (n: number): string => {
      switch (unit) {
        case "hours":
          return `${n}h`;
        case "minutes":
          return `${n}m`;
        case "percent":
          return `${n}%`;
      }

      if (n >= 10_000_000) return (n / 1_000_000).toFixed(1) + "M";
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
      if (n >= 100_000) return (n / 1_000).toFixed(0) + "k";
      if (n >= 10_000) return (n / 1_000).toFixed(1) + "k";
      if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";

      return n.toString();
    },
    [unit]
  );

  const hasData = data && data.length > 0;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full h-64">
        {!mounted && (
          <div className="w-full h-full bg-muted/20 rounded-lg animate-pulse" />
        )}

        {mounted && !hasData && !isLoading && (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
            No data available
          </div>
        )}

        {mounted && isLoading && (
          <div className="w-full h-full animate-pulse bg-muted/20 rounded-lg" />
        )}

        {mounted && hasData && !isLoading && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke={gridColor} vertical={false} />

              <XAxis
                dataKey="date"
                stroke={textColor}
                tickFormatter={(d) => dayjs(d).format("MMM D")}
              />

              <YAxis
                stroke={textColor}
                tickFormatter={(v) => formatNumber(Number(v))}
              />

              <RechartsTooltip
                formatter={(v) => formatNumber(Number(v))}
                labelFormatter={(label) =>
                  dayjs(label).format("MMM D, YYYY")
                }
                contentStyle={{
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                  borderRadius: "8px",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: tooltipText }}
              />

              {variant === "area" && (
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="#6366F1"
                  fillOpacity={0.25}
                />
              )}

              {variant === "line" && (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 3, stroke: textColor }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <ChartLegend data={data} label={metricLabel} />
      <ChartStats data={data} big unit={unit} />
    </div>
  );
}