"use client";

import React, { useEffect, useRef } from "react";
import { SocialMetric } from "@/app/dashboard/types/social";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  socials: SocialMetric[];
  intervalMs?: number;
}

function formatNumber(value: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function TrendArrow({ value }: { value: number }) {
  const isUp = value >= 0;

  return (
    <span
      className={cn(
        "text-xs font-semibold",
        isUp ? "text-green-500" : "text-red-500"
      )}
    >
      {isUp ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function PlatformBadge({ platform }: { platform: SocialMetric["platform"] }) {
  const labelMap: Record<SocialMetric["platform"], string> = {
    youtube: "YouTube",
    twitter: "Twitter",
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
  };

  return (
    <span className="text-xs text-muted-foreground uppercase tracking-wide">
      {labelMap[platform]}
    </span>
  );
}

export function SocialTickerCarousel({
  socials,
  intervalMs = 3500,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const scroll = () => {
      if (!el) return;

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

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none"
      >
        {socials.map((social) => (
          <Card
            key={social.platform}
            className="min-w-[240px] shrink-0 cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-4 space-y-1">
              <PlatformBadge platform={social.platform} />
              <p className="font-semibold">@{social.handle}</p>
              <p className="text-2xl font-bold">
                {formatNumber(social.followers)}
              </p>

              <div className="flex items-center gap-2">
                <TrendArrow value={social.weeklyGrowthPct} />
                {typeof social.commentsDelta === "number" && (
                  <span className="text-xs text-muted-foreground">
                    {social.commentsDelta >= 0 ? "+" : ""}
                    {social.commentsDelta} comments
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
