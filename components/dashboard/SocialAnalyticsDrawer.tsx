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
import type { UnifiedSocialMetric } from "@/app/dashboard/types";
import { ShareChartModal } from "./ShareChartModal";

import {
  PLATFORM_REGISTRY,
  type PlatformId,
} from "@/lib/platforms/platformRegistry";

// MVP chart types only
type ChartType = "line" | "bar" | "area";

type Props = {
  open: boolean;
  onClose: () => void;
  social: UnifiedSocialMetric | null;
};

export function SocialAnalyticsDrawer({ open, onClose, social }: Props) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [shareOpen, setShareOpen] = useState(false);

  if (!social) return null;

  const platformName =
    PLATFORM_REGISTRY[social.platform as PlatformId]?.name ??
    social.platform.toUpperCase();

  const chartUrl = `https://yourapp.com/share/${social.platform}/${social.handle}`;

  return (
    <>
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{platformName}</DrawerTitle>
            <DrawerDescription>
              {social.handle ? `@${social.handle}` : ""}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-8">
            {/* Followers */}
            <MetricChart
              metric={{
                key: "followers",
                label: "Followers",
                value: social.followers,
                description: "Follower count",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
              accountId={social.id}
            />

            {/* Comments */}
            <MetricChart
              metric={{
                key: "comments",
                label: "Comments",
                value: social.comments,
                description: "Comment activity",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
              accountId={social.id}
            />

            {/* Likes */}
            <MetricChart
              metric={{
                key: "likes",
                label: "Likes",
                value: social.likes,
                description: "Like activity",
                unit: "count",
                social: social.platform,
              }}
              chartType={chartType}
              selectedSocial={social.platform}
              rangeLabel="Last 30 days"
              accountId={social.id}
            />

            {/* Chart type selector */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setChartType("line")}>Line</Button>
              <Button onClick={() => setChartType("bar")}>Bar</Button>
              <Button onClick={() => setChartType("area")}>Area</Button>
            </div>

            <Button onClick={() => setShareOpen(true)}>Share Chart</Button>
          </div>
        </DrawerContent>
      </Drawer>

      <ShareChartModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        chartUrl={chartUrl}
        title={platformName}
        subtitle={social.handle ? `@${social.handle}` : ""}
      />
    </>
  );
}