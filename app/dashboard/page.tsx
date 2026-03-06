"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { MetricChart } from "@/components/charts/MetricChart";

import { SocialTickerCarousel } from "@/components/dashboard/SocialTickerCarousel";
import { SocialCardGrid } from "@/components/dashboard/SocialCardGrid";
import { SocialAnalyticsDrawer } from "@/components/dashboard/SocialAnalyticsDrawer";

import type { UnifiedSocialMetric, MetricConfig } from "@/app/dashboard/types";

import { createClient } from "@/lib/supabase/client";
import { fetchUserSocials } from "@/app/dashboard/actions/fetchUserSocials";

import {
  PLATFORM_REGISTRY,
  type PlatformId,
} from "@/lib/platforms/platformRegistry";

const supabase = createClient();

// MVP chart types
type ChartType = "line" | "bar" | "area";

/* -------------------- Chart Switcher -------------------- */
function ChartSwitcher({
  chartType,
  onChange,
}: {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}) {
  const options = [
    { type: "line", label: "Line" },
    { type: "bar", label: "Bar" },
    { type: "area", label: "Area" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt.type}
          variant={chartType === opt.type ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(opt.type)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

/* -------------------- Metric Drawer -------------------- */
function MetricDrawer({ metric }: { metric: MetricConfig }) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const displayValue =
    metric.key === "momentum" ? `${metric.value}%` : metric.value;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-4 space-y-1">
            <p className="text-3xl font-extrabold">{displayValue}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </CardContent>
        </Card>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{metric.label}</DrawerTitle>
          <DrawerDescription>{metric.description ?? ""}</DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-4">
          <ChartSwitcher chartType={chartType} onChange={setChartType} />
          <MetricChart metric={metric} chartType={chartType} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* -------------------- Social Chip Bar (UPDATED) -------------------- */
function SocialChipBar({
  socials,
  selectedPlatform,
  onSelect,
}: {
  socials: UnifiedSocialMetric[];
  selectedPlatform: string | "all";
  onSelect: (platform: string | "all") => void;
}) {
  const platforms = Array.from(new Set(socials.map((s) => s.platform)));
  if (!platforms.length) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <Button
        variant={selectedPlatform === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect("all")}
      >
        All Socials
      </Button>

      {platforms.map((platform) => (
        <Button
          key={platform}
          variant={selectedPlatform === platform ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => onSelect(platform)}
        >
          {PLATFORM_REGISTRY[platform as PlatformId]?.name ?? platform}
        </Button>
      ))}
    </div>
  );
}

/* -------------------- Dashboard Page -------------------- */
export default function DashboardPage() {
  const [socials, setSocials] = useState<UnifiedSocialMetric[]>([]);
  const [selectedSocial, setSelectedSocial] =
    useState<UnifiedSocialMetric | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<string | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: ReturnType<typeof supabase["channel"]> | null = null;

    async function loadAndSubscribe() {
      try {
        const userResult = await supabase.auth.getUser();
        const user = userResult.data.user;

        if (!user) {
          setLoading(false);
          return;
        }

        async function fetchAndNormalize(userId: string) {
          const data = await fetchUserSocials(userId);

          setSocials(data);
          setLoading(false);

          if (data.length > 0 && !selectedSocial) {
            setSelectedSocial(data[0]);
            setSelectedPlatform("all");
          }
        }

        await fetchAndNormalize(user.id);

        subscription = supabase
          .channel(`realtime-socials-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "social_metrics_daily_v2",
              filter: `user_id=eq.${user.id}`,
            },
            () => fetchAndNormalize(user.id)
          )
          .subscribe();
      } catch (err) {
        console.error("Dashboard: Error loading socials:", err);
        setLoading(false);
      }
    }

    loadAndSubscribe();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [selectedSocial]);

  const hasSocials = socials.length > 0;

  const filteredSocials =
    selectedPlatform === "all"
      ? socials
      : socials.filter((s) => s.platform === selectedPlatform);

  /* -------------------- Metrics -------------------- */
  const METRICS: MetricConfig[] = useMemo(() => {
    const commentsToday = socials.reduce((sum, s) => sum + s.commentsToday, 0);
    const commentsWeek = socials.reduce((sum, s) => sum + s.commentsWeek, 0);
    const commentsMonth = socials.reduce((sum, s) => sum + s.commentsMonth, 0);
    const totalPosts = socials.reduce((sum, s) => sum + s.posts, 0);

    return [
      {
        key: "commentsToday",
        label: "Comments Today",
        value: commentsToday,
        description: "Number of comments you replied to today.",
      },
      {
        key: "commentsWeek",
        label: "This Week",
        value: commentsWeek,
        description: "Total comments replied to this week.",
      },
      {
        key: "commentsMonth",
        label: "This Month",
        value: commentsMonth,
        description: "Total comments replied to this month.",
      },
      {
        key: "totalPosts",
        label: "Total Posts",
        value: totalPosts,
        description: "Total posts on all socials combined.",
      },
    ];
  }, [socials]);

  const MOMENTUM_METRIC: MetricConfig = useMemo(() => {
    const thisWeek = socials.reduce((sum, s) => sum + s.commentsWeek, 0);
    const lastWeek = thisWeek || 1;

    const momentum = Math.round((thisWeek / lastWeek) * 100 - 100);

    return {
      key: "momentum",
      label: "Momentum",
      value: momentum,
      description:
        "Engagement velocity compared to last week (placeholder until real last-week data is added).",
    };
  }, [socials]);

  /* -------------------- Render -------------------- */
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {hasSocials && (
          <SocialChipBar
            socials={socials}
            selectedPlatform={selectedPlatform}
            onSelect={(platform) => {
              setSelectedPlatform(platform);
              setSelectedSocial(
                platform === "all"
                  ? socials[0] ?? null
                  : socials.find((s) => s.platform === platform) ?? null
              );
            }}
          />
        )}

        {hasSocials && !loading && (
          <SocialTickerCarousel socials={filteredSocials} />
        )}

        {!loading && !hasSocials && (
          <Card>
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-lg font-semibold">No socials connected yet</p>
              <p className="text-sm text-muted-foreground">
                Connect your socials on the Connect page to see live analytics,
                charts, and engagement stats here.
              </p>
              <Button asChild>
                <Link href="/dashboard/connect">Go to Connect</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {hasSocials && !loading && (
          <SocialCardGrid
            socials={filteredSocials}
            onSelect={(platform) => {
              setSelectedSocial(
                socials.find((s) => s.platform === platform) || null
              );
              setDrawerOpen(true);
            }}
          />
        )}

        <SocialAnalyticsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          social={selectedSocial}
        />

        {hasSocials && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map((metric) => (
              <MetricDrawer key={metric.key} metric={metric} />
            ))}
          </section>
        )}

        {hasSocials && <MetricDrawer metric={MOMENTUM_METRIC} />}

        <div className="flex justify-center gap-2 pt-4">
          <Button asChild variant="default">
            <Link href="/dashboard">Page 1</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/page2">Page 2</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}