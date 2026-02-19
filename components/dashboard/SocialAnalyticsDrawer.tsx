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

type Props = {
  open: boolean;
  onClose: () => void;
  social: SocialMetric | null;
};

type ChartType = "line" | "bar" | "area";

export function SocialAnalyticsDrawer({ open, onClose, social }: Props) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [shareOpen, setShareOpen] = useState(false);

  if (!social) return null;

  const chartUrl = `https://yourapp.com/share/${social.platform}/${social.handle}`;

  return (
    <>
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{social.platform.toUpperCase()} Analytics</DrawerTitle>
            <DrawerDescription>@{social.handle}</DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-6">

            <MetricChart
              metric={{
                key: "followers",
                label: "Followers",
                value: social.followers,
                description: "Follower growth",
              }}
              chartType={chartType}
            />

            <MetricChart
  metric={{
    key: "followers",
    label: "Followers",
    value: social.followers ?? 0,
    description: "Follower growth",
  }}
  chartType={chartType}
/>

<MetricChart
  metric={{
    key: "comments",
    label: "Comments",
    value: social.commentsDelta ?? 0,
    description: "Comment activity",
  }}
  chartType={chartType}
/>


            <div className="flex gap-2">
              <Button onClick={() => setChartType("line")}>Line</Button>
              <Button onClick={() => setChartType("bar")}>Bar</Button>
              <Button onClick={() => setChartType("area")}>Area</Button>
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
        title={`${social.platform} analytics for @${social.handle}`}
      />
    </>
  );
}
