"use client";

import React, { useMemo, useRef } from "react";
import type { MetricConfig } from "@/app/dashboard/types";
import { LineChartWithStats } from "./LineChartWithStats";
import { BarChartWithStats } from "./BarChartWithStats";
import { PieChartWithStats, CategoryPoint } from "./PieChartWithStats";
import { RadarChartWithStats } from "./RadarChartWithStats";
import { ChartShareButton } from "./ChartShareButton";
import { useMetricSeriesV2 } from "@/hooks/useMetricSeriesV2";

export type ChartType = "line" | "bar" | "area" | "pie" | "radar";

type MetricChartProps = {
  metric: MetricConfig;
  chartType: ChartType;
  accountId?: string;
  connectedSocials?: string[];
};

// -------------------- Synthetic / fallback data --------------------
function generateSyntheticTimeSeries(label: string) {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: `Day ${i + 1}`,
    value: i === 0 ? 0 : Math.round(Math.random() * 40),
  }));
}

function generateSyntheticCategories(socials: string[] = []): CategoryPoint[] {
  const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EC4899", "#0EA5E9"];
  const names = socials.length ? socials : ["Twitter","LinkedIn","Instagram","Reddit","GitHub"];
  return names.map((name, i) => ({
    name,
    value: Math.round(Math.random() * 100),
    fill: COLORS[i % COLORS.length],
  }));
}

// -------------------- Main Component --------------------
export function MetricChart({
  metric,
  chartType,
  accountId,
  connectedSocials = [],
}: MetricChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Live DB series
  const dbSeries = useMetricSeriesV2(
    accountId,
    metric.key as "posts" | "comments" | "likes" | "followers"
  );

  const timeSeries = useMemo(
    () => (dbSeries.length ? dbSeries : generateSyntheticTimeSeries(metric.key)),
    [dbSeries, metric.key]
  );

  const categories = useMemo(
    () => generateSyntheticCategories(connectedSocials),
    [connectedSocials]
  );

  // -------------------- Chart Selector --------------------
  let chartContent: React.ReactNode = null;

  switch (chartType) {
    case "line":
      chartContent = (
        <LineChartWithStats data={timeSeries} metricLabel={metric.label} variant="line" />
      );
      break;
    case "area":
      chartContent = (
        <LineChartWithStats data={timeSeries} metricLabel={metric.label} variant="area" />
      );
      break;
    case "bar":
      chartContent = <BarChartWithStats data={timeSeries} metricLabel={metric.label} />;
      break;
    case "pie":
      chartContent = <PieChartWithStats data={categories} metricLabel={metric.label} />;
      break;
    case "radar":
      chartContent = accountId ? <RadarChartWithStats userId={accountId} /> : <div>No data</div>;
      break;
  }

  // -------------------- Render --------------------
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full">
        {chartContent}
      </div>

      <div className="flex justify-end">
        <ChartShareButton
          targetRef={containerRef}
          metric={{
            ...metric,
            value: typeof metric.value === "number" ? metric.value : Number(metric.value),
          } as MetricConfig & { value?: number; rangeLabel?: string }}
        />
      </div>
    </div>
  );
}