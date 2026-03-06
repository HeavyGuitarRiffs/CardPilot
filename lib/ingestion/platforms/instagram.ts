// /lib/ingestion/platforms/instagram.ts
import { ActivityMetrics } from "../normalize";

export async function fetchInstagramMetrics(args: {
  accessToken?: string;
  igBusinessId?: string | null;
}) {
  if (!args.accessToken || !args.igBusinessId) {
    throw new Error("Missing required Instagram args");
  }

  const url = `https://graph.facebook.com/v19.0/${args.igBusinessId}/insights?metric=impressions,reach,profile_views,followers_count&period=day&access_token=${args.accessToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Instagram Graph API error");
  }

  // We fetch the data, but since you're not using profile metrics anymore,
  // we ignore the response and return ActivityMetrics instead.
  await res.json();

  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}