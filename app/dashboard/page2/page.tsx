//app\dashboard\page2\page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSocials } from "@/app/dashboard/hooks/useSocials";
import type { ExtendedSocialMetric } from "@/app/dashboard/hooks/useSocials";

import { SocialAnalyticsDrawer } from "@/components/dashboard/SocialAnalyticsDrawer";

// -------------------- Social Chip Bar --------------------
function SocialChipBar({
  socials,
  selectedPlatform,
  onSelect,
}: {
  socials: ExtendedSocialMetric[];
  selectedPlatform: string | "all";
  onSelect: (platform: string | "all") => void;
}) {
  const platforms = Array.from(
    new Set(
      socials
        .map((s) => s.platform)
        .filter((p) => typeof p === "string" && p.trim() !== "")
    )
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
          className="whitespace-nowrap capitalize"
          onClick={() => onSelect(platform)}
        >
          {platform ?? ""}
        </Button>
      ))}
    </div>
  );
}

// -------------------- Skeleton Card --------------------
function SocialCardSkeleton() {
  return (
    <Card className="w-80 h-56 flex-shrink-0 animate-pulse">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-9 w-20 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- Big Social Card --------------------
function BigSocialCard({
  social,
  onShare,
}: {
  social: ExtendedSocialMetric;
  onShare: (s: ExtendedSocialMetric) => void;
}) {
  const followers = social.followers ?? 0;
  const comments = social.comments ?? 0;
  const momentum =
    social.momentum ??
    social.engagement_change ??
    social.engagementChange ??
    0;

  const isPositive = momentum >= 0;

  const platform = social.platform ?? "";
  const platformInitial = platform ? platform[0].toUpperCase() : "S";

  return (
    <Card className="w-80 h-56 flex-shrink-0 border border-border shadow-sm">
      <CardContent className="p-4 flex flex-col justify-between h-full">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {platformInitial}
          </div>

          <div>
            <p className="font-semibold text-base capitalize">
              {platform}
            </p>
            <p className="text-xs text-muted-foreground">
              Overall activity momentum
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Followers:{" "}
            <span className="font-semibold text-foreground">
              {followers.toLocaleString()}
            </span>
          </p>

          <p className="text-sm text-muted-foreground">
            Comments:{" "}
            <span className="font-semibold text-foreground">
              {comments.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Momentum</p>
            <p
              className={`text-2xl font-extrabold ${
                isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {momentum.toFixed(1)}%
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(social)}
          >
            Share
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

// -------------------- Page 2 --------------------
export default function DashboardPage2() {
  const { socials, loading } = useSocials();
  const [selectedPlatform, setSelectedPlatform] = useState<string | "all">("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<ExtendedSocialMetric | null>(null);

  const hasSocials = socials.length > 0;

  const filteredSocials =
    selectedPlatform === "all"
      ? socials
      : socials.filter((s) => s.platform === selectedPlatform);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">

        {hasSocials && (
          <SocialChipBar
            socials={socials}
            selectedPlatform={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
        )}

        {!loading && !hasSocials && (
          <Card>
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-lg font-semibold">No socials connected yet</p>
              <p className="text-sm text-muted-foreground">
                Connect your socials on the Connect page to unlock deep analytics and shareable momentum cards.
              </p>
              <Button asChild>
                <Link href="/dashboard/connect">Go to Connect</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Social Momentum Cards</h2>
            <p className="text-xs text-muted-foreground">
              Share these cards when your momentum is up.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <SocialCardSkeleton key={i} />
              ))}

            {!loading &&
              filteredSocials.map((social) => (
                <BigSocialCard
                  key={social.id}
                  social={social}
                  onShare={(s) => {
                    setSelectedSocial(s);
                    setDrawerOpen(true);
                  }}
                />
              ))}
          </div>
        </section>

        <div className="flex justify-center gap-2 pt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">Page 1</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/dashboard/page2">Page 2</Link>
          </Button>
        </div>
      </div>

      {/* SHARE MODAL */}
      <SocialAnalyticsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        social={selectedSocial}
      />
    </main>
  );
}