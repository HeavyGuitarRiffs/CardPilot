//components\charts\ChartShareButton.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import type { MetricConfig } from "@/app/dashboard/types";
import { toast } from "sonner";

/* -------------------- Props -------------------- */
type Props = {
  targetRef: React.RefObject<HTMLDivElement | null>;
  metric: MetricConfig & {
    value?: number;
    rangeLabel?: string;
    unit?: "hours" | "minutes" | "count" | "percent";
    social?: string; // optional for future social-picker integration
  };
};

/* -------------------- Component -------------------- */
export function ChartShareButton({ targetRef, metric }: Props) {
  // -------------------- Formatter --------------------
  function formatNumber(n: number, unit: Props["metric"]["unit"] = "count") {
    switch (unit) {
      case "hours":
        return `${n}h`;
      case "minutes":
        return `${n}m`;
      case "percent":
        return `${n}%`;
      default:
        break;
    }

    if (n >= 10_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 100_000) return (n / 1_000).toFixed(0) + "k";
    if (n >= 10_000) return (n / 1_000).toFixed(1) + "k";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";

    return n.toString();
  }

  // -------------------- Share Handler --------------------
  async function handleShare() {
    const numericValue = Number(metric.value ?? 0);
    const formattedValue = formatNumber(numericValue, metric.unit);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const rangeLabel = metric.rangeLabel ?? "Last period";
    const socialLabel = metric.social ? ` on ${metric.social}` : "";

    const shareText = `My ${metric.label}${socialLabel} (${rangeLabel}) on Social Like: ${formattedValue}\n#SocialLikeAnalytics`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My creator analytics",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Copied to clipboard!");
      } catch {
        toast.error("Could not copy to clipboard");
      }
    }
  }

  // -------------------- Render --------------------
  return (
    <Button
      variant="outline"
      size="sm"
      className="inline-flex items-center gap-2"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  );
}