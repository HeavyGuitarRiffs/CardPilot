// /lib/ingestion/platforms/tiktok.ts
import type { ActivityMetrics } from "../normalize";

/**
 * Fetch TikTok metrics for a user.
 * Requires TikTok API token.
 */
export async function fetchTikTokMetrics(args: {
  accessToken?: string;
  userId?: string;
}): Promise<ActivityMetrics> {
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

  // We fetch the data but ignore it because TikTok's API
  // does not provide comment activity in this endpoint.
  await res.json();

  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}