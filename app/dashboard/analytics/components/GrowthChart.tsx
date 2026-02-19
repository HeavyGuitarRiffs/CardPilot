"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/supabase/types";
import type { DateRangeValue } from "./DateRangePicker";

type ChartProps = {
  range: DateRangeValue;
  platforms: string[];
};

type DailyRow = {
  date: string;
  followers: number;
  platform: string;
};

type GrowthRow = {
  date: string;
  growth: number;
};

export function GrowthChart({ range, platforms }: ChartProps) {
  const supabase = React.useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [timeRange, setTimeRange] = React.useState<DateRangeValue>(range);
  const [selectedPlatforms, setSelectedPlatforms] =
    React.useState<string[]>(platforms);
  const [data, setData] = React.useState<GrowthRow[]>([]);

  React.useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: rows, error } = await supabase
        .from("social_metrics_daily_v2")
        .select(
          `
          date,
          followers,
          social_accounts (
            platform
          )
        `
        )
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching social daily stats:", error);
        return;
      }

      // 🔐 strongly typed join result
      type SocialMetricsWithPlatform =
        Database["public"]["Tables"]["social_metrics_daily_v2"]["Row"] & {
          social_accounts: {
            platform: string;
          } | null;
        };

     type FollowerHistoryRow = {
  date: string;
  followers: number | null;
  social_accounts: {
    platform: string;
  } | null;
};

const typedRows = (rows ?? []) as FollowerHistoryRow[];

const dailyRows: DailyRow[] = typedRows
  .map((row) => ({
    date: row.date,
    followers: row.followers ?? 0,
    platform: row.social_accounts?.platform ?? "unknown",
  }))
  .filter((r) => selectedPlatforms.includes(r.platform));

      // Aggregate followers per day across platforms
      const totals: Record<string, number> = {};
      dailyRows.forEach((row) => {
        totals[row.date] = (totals[row.date] ?? 0) + row.followers;
      });

      // Sort by date
      const sorted = Object.entries(totals)
        .map(([date, followers]) => ({ date, followers }))
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      // Calculate day-to-day growth
      const growthData: GrowthRow[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1].followers;
        const curr = sorted[i].followers;
        growthData.push({
          date: sorted[i].date,
          growth: curr - prev,
        });
      }

      setData(growthData);
    }

    load();
  }, [supabase, selectedPlatforms, range]);

  const filteredData = React.useMemo(() => {
    if (!data.length) return [];

    const referenceDate = new Date(data[data.length - 1].date);

    const days =
      timeRange === "30d"
        ? 30
        : timeRange === "7d"
        ? 7
        : timeRange === "180d"
        ? 180
        : timeRange === "365d"
        ? 365
        : 90;

    const start = new Date(referenceDate);
    start.setDate(start.getDate() - days);

    return data.filter((d) => new Date(d.date) >= start);
  }, [data, timeRange]);

  const chartConfig: ChartConfig = {
    growth: {
      label: "Growth",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Growth Velocity</CardTitle>
          <CardDescription>
            Daily follower growth across selected platforms
          </CardDescription>
        </div>

        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as DateRangeValue)}
        >
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="180d">Last 6 months</SelectItem>
            <SelectItem value="365d">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="growth"
              type="natural"
              fill="url(#fillGrowth)"
              stroke="var(--chart-1)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
