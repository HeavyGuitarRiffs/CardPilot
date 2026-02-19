"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";

/* -------------------- Types -------------------- */
type SocialMetrics = {
  posts: number;
  followers: number;
  comments: number;
  likes: number;
};

type RadarPoint = {
  metric: string;
  score: number;
};

type Props = {
  userId?: string;
};

type MetricsBySocial = Record<string, SocialMetrics>;

const AXES: (keyof SocialMetrics)[] = ["posts", "followers", "comments", "likes"];
const SCALE_OPTIONS = [10, 100, 1000, 10000, 100000, 1000000];

/* -------------------- Formatter -------------------- */
function formatNumber(n: number) {
  if (n >= 10_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 100_000) return (n / 1_000).toFixed(0) + "k";
  if (n >= 10_000) return (n / 1_000).toFixed(1) + "k";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toString();
}

function getColorForValue(value: number) {
  if (value >= 1_000_000) return "#EC4899";
  if (value >= 100_000) return "#FBBF24";
  if (value >= 10_000) return "#3B82F6";
  if (value >= 1_000) return "#34D399";
  if (value >= 100) return "#F87171";
  return "#A78BFA";
}

/* -------------------- Component -------------------- */
export function RadarChartWithStats({ userId }: Props) {
  const [metricsBySocial, setMetricsBySocial] = useState<MetricsBySocial>({});
  const [viewMode, setViewMode] = useState<"total" | string>("total");
  const [scale, setScale] = useState<number>(1000);
  const [isolatedAxis, setIsolatedAxis] = useState<keyof SocialMetrics | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tooltipBg = isDark ? "#0F172A" : "#ffffff";
  const tooltipText = isDark ? "#ffffff" : "#0B1020";

  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function load() {
      // -------------------- Fetch latest metrics --------------------
      const { data, error } = await supabase
        .from("social_metrics_daily") // remove generic
        .select("account_id, posts_count, comments_count, likes_count, followers")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error || !data) return;

      const map: MetricsBySocial = {};

      data.forEach((row: any) => {
        const key = row.account_id;
        if (!map[key]) {
          map[key] = {
            posts: row.posts_count ?? 0,
            followers: row.followers ?? 0,
            comments: row.comments_count ?? 0,
            likes: row.likes_count ?? 0,
          };
        }
      });

      setMetricsBySocial(map);
    }

    load();
  }, [userId, supabase]);

  const radarData: RadarPoint[] = useMemo(() => {
    const build = (metrics: SocialMetrics) =>
      AXES.map((axis) => ({
        metric: axis.charAt(0).toUpperCase() + axis.slice(1),
        score: isolatedAxis && isolatedAxis !== axis ? 0 : Math.min(metrics[axis] ?? 0, scale),
      }));

    if (!Object.keys(metricsBySocial).length) {
      return build({ posts: 500, followers: 0, comments: 400, likes: 700 });
    }

    if (viewMode === "total") {
      const total: SocialMetrics = { posts: 0, followers: 0, comments: 0, likes: 0 };
      Object.values(metricsBySocial).forEach((m) => {
        AXES.forEach((a) => (total[a] += m[a]));
      });
      return build(total);
    }

    return build(metricsBySocial[viewMode] ?? { posts: 0, followers: 0, comments: 0, likes: 0 });
  }, [metricsBySocial, viewMode, scale, isolatedAxis]);

  const radarFillColor = useMemo(
    () => getColorForValue(Math.max(...radarData.map((d) => d.score))),
    [radarData]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {SCALE_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              scale === s ? "bg-primary text-white" : "bg-muted hover:bg-muted/70"
            }`}
          >
            {s >= 1_000_000 ? `${s / 1_000_000}M` : s.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {AXES.map((axis, i) => {
          const value = radarData[i]?.score ?? 0;
          return (
            <button
              key={axis}
              onClick={() => setIsolatedAxis(isolatedAxis === axis ? null : axis)}
              className={`rounded p-2 text-left transition-all ${
                isolatedAxis === axis ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              <div className="text-xs text-muted-foreground">{axis.toUpperCase()}</div>
              <div className="font-bold">{formatNumber(value)}</div>
            </button>
          );
        })}
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis domain={[0, scale]} />
            <RechartsTooltip
              formatter={(v: number) => formatNumber(v)}
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: tooltipText }}
            />
            <Radar
              dataKey="score"
              stroke={radarFillColor}
              fill={radarFillColor}
              fillOpacity={0.6}
              isAnimationActive
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
