//components\charts\PieChartWithStats.tsx

"use client";

import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import type { MetricUnit } from "@/app/dashboard/types";

/* -------------------- Types -------------------- */
export type CategoryPoint = {
  name: string;   // e.g., "Twitter", "Instagram"
  value: number;  // metric value
  fill?: string;  // optional color
};

type Props = {
  data: CategoryPoint[];
  metricLabel: string;
  unit?: MetricUnit;       // <-- NEW
  social?: string;         // <-- future social picker support
};

/* -------------------- Component -------------------- */
export function PieChartWithStats({ data, metricLabel, unit = "count" }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tooltipBg = isDark ? "#0F172A" : "#ffffff";
  const tooltipText = isDark ? "#ffffff" : "#0B1020";

  /* -----------------------------
     Unit-aware number formatter
  ----------------------------- */
  function formatNumber(n: number): string {
    switch (unit) {
      case "hours":
        return `${n}h`;
      case "minutes":
        return `${n}m`;
      case "percent":
        return `${n}%`;
      default:
        break;
    }

    if (n >= 10_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 100_000) return (n / 1_000).toFixed(0) + "k";
    if (n >= 10_000) return (n / 1_000).toFixed(1) + "k";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";

    return n.toString();
  }

  /* -----------------------------
     Active slice filtering
  ----------------------------- */
  const displayedData = useMemo(() => {
    if (!activeCategory) return data;
    return data.filter((d) => d.name === activeCategory);
  }, [data, activeCategory]);

  /* -----------------------------
     Stats (category-based)
     - Top category
     - Percent of total
  ----------------------------- */
  const totalValue = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const top = useMemo(() => {
    if (!data.length) return { name: "-", value: 0 };
    return data.reduce((acc, d) => (d.value > acc.value ? d : acc), data[0]);
  }, [data]);

  const activeValue = activeCategory
    ? data.find((d) => d.name === activeCategory)?.value ?? 0
    : totalValue;

  const activePercent =
    totalValue > 0 ? ((activeValue / totalValue) * 100).toFixed(1) : "0";

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total */}
        <div>
          <span className="text-xs text-muted-foreground">Total</span>
          <div className="text-2xl font-extrabold">
            {formatNumber(totalValue)}
          </div>
        </div>

        {/* Active slice */}
        <div>
          <span className="text-xs text-muted-foreground">
            {activeCategory ? activeCategory : "All socials"}
          </span>
          <div className="text-2xl font-extrabold">
            {formatNumber(activeValue)} ({activePercent}%)
          </div>
        </div>

        {/* Top category */}
        <div>
          <span className="text-xs text-muted-foreground">Top category</span>
          <div className="text-2xl font-extrabold">
            {top.name}: {formatNumber(top.value)}
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <RechartsTooltip
              formatter={(value: number, name: string) =>
                `${formatNumber(value)} (${(
                  (value / totalValue) *
                  100
                ).toFixed(1)}%)`
              }
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: tooltipText }}
            />

            <RechartsLegend />

            <Pie
              data={displayedData}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              onClick={(d) => setActiveCategory(d.name)}
              activeIndex={
                activeCategory
                  ? data.findIndex((d) => d.name === activeCategory)
                  : undefined
              }
            >
              {displayedData.map((c) => (
                <Cell
                  key={c.name}
                  fill={c.fill}
                  opacity={
                    !activeCategory || c.name === activeCategory ? 1 : 0.3
                  }
                />
              ))}
            </Pie>

            {/* Center label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="cursor-pointer"
              onClick={() => setActiveCategory(null)}
            >
              <tspan className="fill-foreground text-2xl font-extrabold">
                {formatNumber(activeValue)}
              </tspan>
              <tspan
                x="50%"
                dy="1.4em"
                className="fill-muted-foreground text-xs"
              >
                {activeCategory ?? "All socials"}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {activeCategory ? "Click center to reset" : "Click a slice to explore deeper"}
      </p>
    </div>
  );
}