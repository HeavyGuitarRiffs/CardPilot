//app\dashboard\page2.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { SocialMetric } from "@/app/dashboard/types/social";
import { createClient } from "@/lib/supabase/client";
import { fetchUserSocials } from "@/app/dashboard/actions/fetchUserSocials";

const supabase = createClient();

// -------------------- Helpers --------------------
function getMomentum(social: SocialMetric): number {
  // Adjust these keys to match your actual SocialMetric shape if needed
  const candidateValues: Array<unknown> = [
    (social as unknown as { momentum?: unknown }).momentum,
    (social as unknown as { engagement_change?: unknown }).engagement_change,
    (social as unknown as { engagementChange?: unknown }).engagementChange,
  ];

  for (const value of candidateValues) {
    if (typeof value === "number") return value;
  }

  return 0;
}

function getFollowers(social: SocialMetric): number {
  const value = (social as unknown as { followers?: unknown }).followers;
  return typeof value === "number" ? value : 0;
}

function getComments(social: SocialMetric): number {
  const value = (social as unknown as { comments?: unknown }).comments;
  return typeof value === "number" ? value : 0;
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
  const platforms = Array.from(new Set(socials.map((s) => s.platform)));

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

// -------------------- Skeletons --------------------
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
function BigSocialCard({ social }: { social: SocialMetric }) {
  const followers = getFollowers(social);
  const comments = getComments(social);
  const momentum = getMomentum(social);

  const isPositive = momentum >= 0;

  return (
    <Card className="w-80 h-56 flex-shrink-0 border border-border shadow-sm">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {/* Header: Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {social.platform?.[0]?.toUpperCase() ?? "S"}
          </div>
          <div>
            <p className="font-semibold text-base capitalize">
              {social.platform}
            </p>
            <p className="text-xs text-muted-foreground">
              Overall activity momentum
            </p>
          </div>
        </div>

        {/* Stats */}
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

        {/* Momentum + Share */}
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

          <Button variant="outline" size="sm">
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- Page 2 --------------------
export default function DashboardPage2() {
  const [socials, setSocials] = useState<SocialMetric[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | "all">(
    "all"
  );
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
            onSelect={setSelectedPlatform}
          />
        )}

        {/* EMPTY STATE */}
        {!loading && !hasSocials && (
          <Card>
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-lg font-semibold">
                No socials connected yet
              </p>
              <p className="text-sm text-muted-foreground">
                Connect your socials on the Connect page to unlock deep
                analytics and shareable momentum cards.
              </p>
              <Button asChild>
                <Link href="/dashboard/connect">Go to Connect</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* BIG SOCIAL CARDS CAROUSEL */}
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
                <BigSocialCard key={social.id} social={social} />
              ))}
          </div>
        </section>

        {/* PAGINATION / NAV BETWEEN DASH PAGES */}
        <div className="flex justify-center gap-2 pt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">Page 1</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/dashboard/page2">Page 2</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}