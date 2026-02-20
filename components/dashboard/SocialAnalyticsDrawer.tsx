//components\dashboard\SocialAnalyticsDrawer.tsx

"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { MetricChart } from "@/components/charts/MetricChart";
import type { SocialMetric } from "@/app/dashboard/types/social";
import { ShareChartModal } from "./ShareChartModal";

type ChartType = "line" | "bar" | "area" | "pie" | "radar";

type Props = {
  open: boolean;
  onClose: () => void;
  social: SocialMetric | null;
};

export function SocialAnalyticsDrawer({ open, onClose, social }: Props) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [shareOpen, setShareOpen] = useState(false);

  if (!social) return null;

  const chartUrl = `https://yourapp.com/share/${social.platform}/${social.handle}`;

  return (
    <>
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{social.platform.toUpperCase()} Analytics</DrawerTitle>
            <DrawerDescription>@{social.handle}</DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-8">

            {/* Followers */}
            <MetricChart
              metric={{
                key: "followers",
                label: "Followers",
                value: social.followers ?? 0,
                description: "Follower growth",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
            />

            {/* Comments */}
            <MetricChart
              metric={{
                key: "comments",
                label: "Comments",
                value: social.commentsDelta ?? social.comments ?? 0,
                description: "Comment activity",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
            />

            {/* Likes */}
            <MetricChart
              metric={{
                key: "likes",
                label: "Likes",
                value: social.likesDelta ?? social.likes ?? 0,
                description: "Like activity",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
            />

            {/* Chart type selector */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setChartType("line")}>Line</Button>
              <Button onClick={() => setChartType("bar")}>Bar</Button>
              <Button onClick={() => setChartType("area")}>Area</Button>
              <Button onClick={() => setChartType("pie")}>Pie</Button>
              <Button onClick={() => setChartType("radar")}>Radar</Button>
            </div>

            <Button onClick={() => setShareOpen(true)}>
              Share Chart
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <ShareChartModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        chartUrl={chartUrl}
        title={`${social.platform} analytics`}
        subtitle={`@${social.handle}`}
      />
    </>
  );
}