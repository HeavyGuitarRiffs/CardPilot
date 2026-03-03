import type { SocialMetric } from "@/app/dashboard/types";

type TwitterUserResponse = {
  data?: {
    id: string;
    username: string;
    name: string;
    public_metrics?: {
      followers_count?: number;
      following_count?: number;
      tweet_count?: number;
      listed_count?: number;
    };
  };
};

/**
 * Fetch Twitter metrics for a user.
 * Requires OAuth 2.0 Bearer token.
 */
export async function fetchTwitterMetrics(args: {
  accessToken: string;
  username: string;
}): Promise<SocialMetric> {
  if (!args.accessToken) throw new Error("Twitter access token missing");
  if (!args.username) throw new Error("Twitter username missing");

  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${args.username}?user.fields=public_metrics`,
    {
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twitter API error: ${res.status} ${text}`);
  }

  const data: TwitterUserResponse = await res.json();
  const user = data.data;

  if (!user) {
    throw new Error("Twitter user not found");
  }

  const metrics = user.public_metrics ?? {};

  return {
    id: user.id,
    platform: "twitter",
    handle: user.username,

    followers: metrics.followers_count ?? 0,
    comments: 0,
    weeklyGrowthPct: 0,
    linktree: false,
    order_index: 0,
    created_at: null,

    // Required fields
    oauth: true,
    likesDelta: 0,

    // Core metrics
    likes: 0,
    posts: metrics.tweet_count ?? 0,
    postsDelta: 0,
    commentsDelta: 0,
    followersDelta: 0,
    momentum: 0,

    // Engagement fields
    engagement_change: 0,
    engagementChange: 0,

    // Dashboard-only fields
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    streak: 0,
    conversionPages: 0,
  };
}