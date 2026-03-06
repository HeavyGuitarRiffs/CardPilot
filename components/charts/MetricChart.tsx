"use client";

import React, { useMemo, useRef } from "react";
import type { MetricConfig } from "@/app/dashboard/types";
import { LineChartWithStats } from "./LineChartWithStats";
import { BarChartWithStats } from "./BarChartWithStats";
import { ChartShareButton } from "./ChartShareButton";
import { useMetricSeriesV2 } from "@/hooks/useMetricSeriesV2";
import dayjs from "dayjs";

// Supported chart types
export type ChartType = "line" | "bar" | "area";

type MetricChartProps = {
  metric: MetricConfig;
  chartType: ChartType;
  accountId?: string;
  selectedSocial?: string;
  rangeLabel?: string;
};

/* -------------------- Synthetic / fallback data -------------------- */
function generateSyntheticTimeSeries(label: string) {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: dayjs().subtract(13 - i, "day").format("YYYY-MM-DD"),
    value: Math.round(Math.random() * 40),
  }));
}

/* -------------------- Main Component -------------------- */
export function MetricChart({
  metric,
  chartType,
  accountId,
  selectedSocial,
  rangeLabel,
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

  /* -------------------- Chart Selector -------------------- */
  let chartContent: React.ReactNode = null;

  switch (chartType) {
    case "line":
      chartContent = (
        <LineChartWithStats
          data={timeSeries}
          metricLabel={metric.label}
          variant="line"
          unit={metric.unit}
        />
      );
      break;

    case "area":
      chartContent = (
        <LineChartWithStats
          data={timeSeries}
          metricLabel={metric.label}
          variant="area"
          unit={metric.unit}
        />
      );
      break;

    case "bar":
      chartContent = (
        <BarChartWithStats
          data={timeSeries}
          metricLabel={metric.label}
          unit={metric.unit}
        />
      );
      break;
  }

  /* -------------------- Render -------------------- */
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
            value:
              typeof metric.value === "number"
                ? metric.value
                : Number(metric.value),
            rangeLabel,
            social: selectedSocial,
          }}
        />
      </div>
    </div>
  );
}