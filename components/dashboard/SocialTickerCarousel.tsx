"use client";

import React, { useEffect, useRef } from "react";
import type { UnifiedSocialMetric } from "@/app/dashboard/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  socials: UnifiedSocialMetric[];
  intervalMs?: number;
  onSelect?: (platform: string) => void;
  loading?: boolean;
}

function formatCompact(value: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function TrendArrow({ delta }: { delta: number }) {
  const isUp = delta >= 0;

  return (
    <span
      className={cn(
        "text-xs font-semibold",
        isUp ? "text-green-500" : "text-red-500"
      )}
    >
      {isUp ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function PlatformBadge({ platform }: { platform: UnifiedSocialMetric["platform"] }) {
  const labelMap: Record<string, string> = {
    youtube: "YouTube",
    twitter: "Twitter",
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    reddit: "Reddit",
    github: "GitHub",
  };

  return (
    <span className="text-xs text-muted-foreground uppercase tracking-wide">
      {labelMap[platform] ?? platform}
    </span>
  );
}

export function SocialTickerCarousel({
  socials,
  intervalMs = 3500,
  onSelect,
  loading,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const scroll = () => {
      const scrollAmount = 260;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft + scrollAmount >= maxScrollLeft) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    const id = setInterval(scroll, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="min-w-[240px] animate-pulse">
              <CardContent className="pt-4 space-y-3">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!socials.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No social accounts connected yet.
      </div>
    );
  }

  // Render
  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none"
      >
        {socials.map((social) => {
          const growthPct = social.momentum ?? 0;

          return (
            <Card
              key={`${social.platform}-${social.handle}`}
              className="min-w-[240px] shrink-0 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect?.(social.platform)}
            >
              <CardContent className="pt-4 space-y-1">
                <PlatformBadge platform={social.platform} />

                <p className="font-semibold">@{social.handle}</p>

                <p className="text-2xl font-bold">
                  {formatCompact(social.followers)}
                </p>

                <div className="flex items-center gap-2">
                  <TrendArrow delta={growthPct} />

                  <span className="text-xs text-muted-foreground">
                    {social.comments} comments
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}