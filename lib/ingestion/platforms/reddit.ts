// /lib/ingestion/platforms/reddit.ts
import { normalizeRedditMetrics } from "../normalize";
import type { SocialMetric } from "@/app/dashboard/types";

/**
 * Fetch Reddit metrics for a user.
 * Requires OAuth access token from Reddit.
 */
export async function fetchRedditMetrics(args: {
  accessToken: string;
  username: string;
}): Promise<SocialMetric> {
  if (!args.accessToken) throw new Error("Reddit access token missing");
  if (!args.username) throw new Error("Reddit username missing");

  const res = await fetch(
    `https://oauth.reddit.com/user/${args.username}/about`,
    {
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "User-Agent": "PrettyPlay/1.0 by PrettyPlayApp",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reddit API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return normalizeRedditMetrics(data);
}