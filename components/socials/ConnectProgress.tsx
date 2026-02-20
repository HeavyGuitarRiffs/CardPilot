//components\socials\ConnectProgress.tsx

"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  platform: string;   // e.g., "instagram"
  handle: string;     // e.g., "justin_dev"
}

interface ConnectProgressProps {
  connected: Platform[];
  limit: number;
  onAdd: () => void;
  loading?: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "/icons/instagram.svg",
  twitter: "/icons/twitter.svg",
  youtube: "/icons/youtube.svg",
  tiktok: "/icons/tiktok.svg",
  linkedin: "/icons/linkedin.svg",
};

const PLATFORM_NAMES: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

export default function ConnectProgress({
  connected,
  limit,
  onAdd,
  loading,
}: ConnectProgressProps) {
  const percent = Math.min((connected.length / limit) * 100, 100);

  /* -------------------- Loading skeleton -------------------- */
  if (loading) {
    return (
      <div className="p-6 border rounded-xl space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-10 bg-muted rounded" />
        </div>

        <Progress value={50} className="h-2" />

        <div className="flex gap-3 flex-wrap pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg h-8 w-24"
            />
          ))}
        </div>
      </div>
    );
  }

  /* -------------------- Empty state -------------------- */
  if (!connected.length) {
    return (
      <div className="p-6 border rounded-xl space-y-4 text-center">
        <p className="font-semibold">No socials connected yet</p>
        <p className="text-sm text-muted-foreground">
          Connect your first social account to get started.
        </p>
        <Button className="w-full mt-2" onClick={onAdd}>
          Add Social
        </Button>
      </div>
    );
  }

  /* -------------------- Connected state -------------------- */
  return (
    <div className="p-6 border rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Connected Socials</p>
        <Badge>
          {connected.length} / {limit}
        </Badge>
      </div>

      <Progress value={percent} className="h-2" />

      <div className="flex gap-3 flex-wrap pt-2">
        {connected.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg"
          >
            <Image
              src={PLATFORM_ICONS[p.platform] ?? "/icons/default.svg"}
              alt={p.platform}
              width={18}
              height={18}
            />
            <span className="text-sm">
              {PLATFORM_NAMES[p.platform] ?? p.platform}
            </span>
          </div>
        ))}
      </div>

      {connected.length < limit && (
        <Button className="w-full mt-4" onClick={onAdd}>
          Add Social
        </Button>
      )}
    </div>
  );
}