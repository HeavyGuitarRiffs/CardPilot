import type { UnifiedSocialMetric } from "@/app/dashboard/types";

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
}): Promise<UnifiedSocialMetric> {
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

    // Twitter API does not provide comment counts directly
    comments: 0,
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    likes: 0,
    likesToday: 0,
    likesDelta: 0,

    posts: metrics.tweet_count ?? 0,

    momentum: 0,
    engagementChange: 0,

    oauth: {
      access_token: args.accessToken,
      refresh_token: undefined,
      expires_at: undefined,
      scope: undefined,
      token_type: "bearer",
      raw: {},
    },
  };
}