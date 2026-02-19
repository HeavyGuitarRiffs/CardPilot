"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import type { MetricConfig } from "@/app/dashboard/types";
import { getLatestMetricSummary } from "@/lib/analytics/getSocialMetrics";

const METRICS_PER_PAGE = 8;

export default function ShareChartPage() {
  const [metrics, setMetrics] = useState<MetricConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // -------------------- Load Metrics --------------------
  useEffect(() => {
    async function loadMetrics() {
      // TODO: replace with real auth user id
      const userId = "current_user_id_placeholder";

      const summary = await getLatestMetricSummary(userId);

      const metricConfig: MetricConfig[] = [
        {
          key: "posts",
          label: "Posts",
          value: summary.posts,
          description: "Total posts across all socials.",
        },
        {
          key: "comments",
          label: "Comments",
          value: summary.comments,
          description: "Total comments across all socials.",
        },
        {
          key: "likes",
          label: "Likes",
          value: summary.likes,
          description: "Total likes across all socials.",
        },
        {
          key: "followers",
          label: "Followers",
          value: summary.followers,
          description: "Total followers across all accounts.",
        },
      ];

      setMetrics(metricConfig);
    }

    loadMetrics();
  }, []);

  const totalPages = Math.ceil(metrics.length / METRICS_PER_PAGE);

  const paginatedMetrics = useMemo(() => {
    const start = (currentPage - 1) * METRICS_PER_PAGE;
    return metrics.slice(start, start + METRICS_PER_PAGE);
  }, [metrics, currentPage]);

  const handlePrevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Dashboard Cards */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Metrics</p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              <Button
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paginatedMetrics.map((metric) => (
              <Drawer key={metric.key}>
                <DrawerTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 space-y-1">
                      <p className="text-3xl font-extrabold">
                        {metric.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                    </CardContent>
                  </Card>
                </DrawerTrigger>

                <DrawerContent className="max-h-[90vh]">
                  <DrawerHeader>
                    <DrawerTitle>{metric.label}</DrawerTitle>
                    <DrawerDescription>
                      {metric.description ?? ""}
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="px-6 pb-6 space-y-4">
                    <MetricChart
                      metric={metric}
                      chartType="line"
                      accountId={undefined}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          </div>

          {/* Pagination Bottom */}
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            <Button
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
