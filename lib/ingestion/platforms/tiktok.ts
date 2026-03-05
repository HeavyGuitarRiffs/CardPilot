// /lib/ingestion/platforms/tiktok.ts
import { normalizeTikTokMetrics } from "../normalize";
import type { UnifiedSocialMetric } from "@/app/dashboard/types";

/**
 * Fetch TikTok metrics for a user.
 * Requires TikTok API token.
 */
export async function fetchTikTokMetrics(args: {
  accessToken: string;
  userId: string;
}): Promise<UnifiedSocialMetric> {
  if (!args.accessToken) throw new Error("TikTok access token missing");
  if (!args.userId) throw new Error("TikTok userId missing");

  const res = await fetch(
    `https://api.tiktok.com/user/info/?user_id=${args.userId}`,
    {
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TikTok API error: ${res.status} ${text}`);
  }

  const data = await res.json();

  // normalizeTikTokMetrics MUST now return UnifiedSocialMetric
  return normalizeTikTokMetrics(data);
}