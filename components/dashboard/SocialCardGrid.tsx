"use client";

import React from "react";
import type { SocialAnalytics } from "@/app/dashboard/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  PLATFORM_REGISTRY,
  type PlatformId,
} from "@/lib/platforms/platformRegistry";

function getPlatformName(platform: PlatformId): string {
  return PLATFORM_REGISTRY[platform]?.name ?? platform;
}

function formatCompact(n: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

interface Props {
  socials: SocialAnalytics[];
  onSelect?: (platform: SocialAnalytics["platform"]) => void;
  selectedSocial?: string;
  loading?: boolean;
}

export function SocialCardGrid({
  socials,
  onSelect,
  selectedSocial,
  loading,
}: Props) {
  if (loading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-4 space-y-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  if (!socials.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No socials connected yet.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {socials.map((social) => {
        const isActive = selectedSocial === social.platform;

        return (
          <Card
            key={`${social.platform}-${social.handle}`}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow border",
              isActive && "border-primary shadow-lg"
            )}
            onClick={() => onSelect?.(social.platform)}
          >
            <CardContent className="pt-4 space-y-1">
              <p className="text-sm text-muted-foreground">
                {getPlatformName(social.platform as PlatformId)}
              </p>
              <p className="font-semibold">@{social.handle}</p>
              <p className="text-xl font-bold">
                {formatCompact(social.followers)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}