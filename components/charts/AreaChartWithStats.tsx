"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
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

type TimeSeriesPoint = {
  date: string;
  value: number;
};

type Props = {
  data: TimeSeriesPoint[];
  metricLabel: string;
  unit?: "hours" | "minutes" | "count" | "percent";
  isLoading?: boolean;
};

export function AreaChartWithStats({
  data = [],
  metricLabel,
  unit = "count",
  isLoading = false,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Hydration-safe mount guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  // Theme-aware colors
  const textColor = isDark ? "#ffffff" : "#0B1020";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tooltipBg = isDark ? "#0F172A" : "#ffffff";
  const tooltipText = isDark ? "#ffffff" : "#0B1020";

  // Memoized formatter
  const formatY = useCallback(
    (v: number): string => {
      switch (unit) {
        case "hours":
          return `${v}h`;
        case "minutes":
          return `${v}m`;
        case "percent":
          return `${v}%`;
      }

      if (v >= 10_000_000) return (v / 1_000_000).toFixed(1) + "M";
      if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M";
      if (v >= 100_000) return (v / 1_000).toFixed(0) + "k";
      if (v >= 10_000) return (v / 1_000).toFixed(1) + "k";
      if (v >= 1_000) return (v / 1_000).toFixed(1) + "k";

      return v.toString();
    },
    [unit]
  );

  const hasData = mounted && data.length > 0 && data.some((d) => d.value > 0);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full h-64 relative">
        {/* Loading */}
        {!mounted && (
          <div className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg" />
        )}

        {/* Empty */}
        {mounted && !isLoading && !hasData && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
            No data available
          </div>
        )}

        {/* Loading state */}
        {mounted && isLoading && (
          <div className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg" />
        )}

        {/* Chart */}
        {mounted && hasData && !isLoading && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={gridColor} vertical={false} />

              <XAxis
                dataKey="date"
                stroke={textColor}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(d) => dayjs(d).format("MMM D")}
              />

              <YAxis
                stroke={textColor}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => formatY(Number(v))}
              />

              <RechartsTooltip
                formatter={(v) => formatY(Number(v))}
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

              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                strokeWidth={2}
                fill="#6366F1"
                fillOpacity={0.25}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <ChartLegend data={data} label={metricLabel} />
      <ChartStats data={data} big unit={unit} />
    </div>
  );
}