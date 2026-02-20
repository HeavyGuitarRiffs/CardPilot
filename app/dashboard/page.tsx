//app\dashboard\page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import DailyChallengeCard from "@/components/dashboard/DailyChallengeCard";
import HighlightedComments from "@/components/dashboard/HighlightedComments";

import { MetricChart } from "@/components/charts/MetricChart";
import type { MetricConfig } from "@/app/dashboard/types";

// ✅ Socials
import { SocialTickerCarousel } from "@/components/dashboard/SocialTickerCarousel";
import { SocialCardGrid } from "@/components/dashboard/SocialCardGrid";
import { SocialAnalyticsDrawer } from "@/components/dashboard/SocialAnalyticsDrawer";
import type { SocialMetric } from "@/app/dashboard/types/social";

// ✅ Supabase
import { createClient } from "@/lib/supabase/client";
import { fetchUserSocials } from "@/app/dashboard/actions/fetchUserSocials";

const supabase = createClient();

// -------------------- Metrics --------------------
const METRICS: MetricConfig[] = [
  {
    key: "commentsToday",
    label: "Comments Today",
    value: 42,
    description: "Number of comments you replied to today.",
  },
  {
    key: "commentsWeek",
    label: "This Week",
    value: 312,
    description: "Total comments replied to this week.",
  },
  {
    key: "commentsMonth",
    label: "This Month",
    value: 1248,
    description: "Total comments replied to this month.",
  },
  {
    key: "streak",
    label: "Day Streak",
    value: 6,
    description: "Consecutive days you’ve hit your engagement goal.",
  },
  {
    key: "totalPosts",
    label: "Total Posts",
    value: 128,
    description: "Total posts on all socials combined.",
  },
  {
    key: "conversionPages",
    label: "Conversion Pages",
    value: 5,
    description: "Number of pages set up for conversions.",
  },
];

const MOMENTUM_METRIC: MetricConfig = {
  key: "momentum",
  label: "Momentum",
  value: 18,
  description: "Engagement velocity compared to last week (percentage).",
};

// -------------------- Chart Types --------------------
type ChartType = "line" | "bar" | "area" | "pie" | "radar";

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
    { type: "pie", label: "Pie" },
    { type: "radar", label: "Radar" },
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

// -------------------- Metric Drawer --------------------
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

// -------------------- Social Chip Bar --------------------
function SocialChipBar({
  socials,
  selectedPlatform,
  onSelect,
}: {
  socials: SocialMetric[];
  selectedPlatform: string | "all";
  onSelect: (platform: string | "all") => void;
}) {
  const platforms = Array.from(
    new Set(socials.map((s) => s.platform))
  );

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
          {platform}
        </Button>
      ))}
    </div>
  );
}

// -------------------- Dashboard --------------------
export default function DashboardPage() {
  const [socials, setSocials] = useState<SocialMetric[]>([]);
  const [selectedSocial, setSelectedSocial] = useState<SocialMetric | null>(
    null
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string | "all">(
    "all"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSocials() {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        setLoading(false);
        return;
      }

      const data = await fetchUserSocials(user.data.user.id);
      setSocials(data);
      setLoading(false);

      if (data.length > 0) {
        setSelectedSocial(data[0]);
        setSelectedPlatform("all");
      }
    }

    loadSocials();
  }, []);

  const hasSocials = socials.length > 0;

  const filteredSocials =
    selectedPlatform === "all"
      ? socials
      : socials.filter((s) => s.platform === selectedPlatform);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* SOCIAL PICKER (CHIP BAR) */}
        {hasSocials && (
          <SocialChipBar
            socials={socials}
            selectedPlatform={selectedPlatform}
            onSelect={(platform) => {
              setSelectedPlatform(platform);
              if (platform === "all") {
                setSelectedSocial(socials[0] ?? null);
              } else {
                const found =
                  socials.find((s) => s.platform === platform) ?? null;
                setSelectedSocial(found);
              }
            }}
          />
        )}

        {/* SOCIAL TICKER */}
        {hasSocials && !loading && (
          <SocialTickerCarousel socials={filteredSocials} />
        )}

        {/* EMPTY STATE WHEN NO SOCIALS */}
        {!loading && !hasSocials && (
          <Card>
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-lg font-semibold">
                No socials connected yet
              </p>
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

        {/* SOCIAL GRID */}
        {hasSocials && !loading && (
          <SocialCardGrid
            socials={filteredSocials}
            onSelect={(platform) => {
              const found =
                socials.find((s) => s.platform === platform) || null;
              setSelectedSocial(found);
              setDrawerOpen(true);
            }}
          />
        )}

        {/* SOCIAL ANALYTICS DRAWER */}
        <SocialAnalyticsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          social={selectedSocial}
        />

        {/* METRICS GRID (ONLY WHEN SOCIALS EXIST) */}
        {hasSocials && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map((metric) => (
              <MetricDrawer key={metric.key} metric={metric} />
            ))}
          </section>
        )}

        {/* MOMENTUM METRIC (ONLY WHEN SOCIALS EXIST) */}
        {hasSocials && <MetricDrawer metric={MOMENTUM_METRIC} />}

        {/* OPTIONAL: DAILY CHALLENGE / HIGHLIGHTED COMMENTS (CAN BE BELOW) */}
        {/* <DailyChallengeCard /> */}
        {/* <HighlightedComments /> */}

        {/* PAGINATION / NAV BETWEEN DASH PAGES */}
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