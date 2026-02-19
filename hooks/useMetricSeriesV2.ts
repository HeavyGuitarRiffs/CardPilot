// hooks/useMetricSeriesV2.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export function useMetricSeriesV2(accountId?: string, metric?: "posts" | "comments" | "likes" | "followers") {
  const [data, setData] = useState<TimeSeriesPoint[]>([]);

  useEffect(() => {
    if (!accountId || !metric) return;

    const supabase = createClient();

    async function load() {
      const { data, error } = await supabase
        .from("social_metrics_daily_v2")
        .select("date, posts, comments, likes, followers")
        .eq("account_id", accountId)
        .order("date", { ascending: true });

      if (error || !data) return;

      const mapped = data.map(d => ({
        date: d.date,
        value: d[metric] ?? 0
      }));

      setData(mapped);
    }

    load();
  }, [accountId, metric]);

  return data;
}
