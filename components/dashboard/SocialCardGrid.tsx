"use client";

import React from "react";
import { SocialMetric } from "@/app/dashboard/types/social";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  socials: SocialMetric[];
  onSelect?: (platform: SocialMetric["platform"]) => void;
}

function getPlatformName(platform: SocialMetric["platform"]): string {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "twitter":
      return "Twitter";
    case "instagram":
      return "Instagram";
    case "tiktok":
      return "TikTok";
    case "linkedin":
      return "LinkedIn";
    default:
      return platform;
  }
}

export function SocialCardGrid({ socials, onSelect }: Props) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {socials.map((social) => (
        <Card
          key={social.platform}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect?.(social.platform)}
        >
          <CardContent className="pt-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              {getPlatformName(social.platform)}
            </p>
            <p className="font-semibold">@{social.handle}</p>
            <p className="text-xl font-bold">
              {Intl.NumberFormat("en-US", {
                notation: "compact",
              }).format(social.followers)}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
