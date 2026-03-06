// /lib/ingestion/platforms/reddit.ts
import type { ActivityMetrics } from "../normalize";

/**
 * Fetch Reddit metrics for a user.
 * Requires OAuth access token from Reddit.
 */
export async function fetchRedditMetrics(args: {
  accessToken?: string;
  username?: string;
}): Promise<ActivityMetrics> {
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

  // We fetch the data but ignore it because Reddit's "about" endpoint
  // does NOT provide comment activity.
  await res.json();

  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}