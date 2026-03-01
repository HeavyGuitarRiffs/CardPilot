// /lib/ingestion/normalize.ts
import type { SocialMetric } from "@/app/dashboard/types/social";

// -----------------------------
// 1️⃣ Shared normalized type for API metrics
// -----------------------------
export type NormalizedMetrics = {
  date: string; // YYYY-MM-DD
  followers?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
  engagementRate?: number;
};

// -----------------------------
// 2️⃣ YouTube API response types
// -----------------------------
type YouTubeChannelStats = {
  items?: Array<{
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      commentCount?: string;
      videoCount?: string;
    };
  }>;
};

// -----------------------------
// 3️⃣ Instagram Graph API types
// -----------------------------
type InstagramMetricValue = {
  value: number | string;
};

type InstagramMetric = {
  name: string;
  period: string;
  values: InstagramMetricValue[];
};

type InstagramInsightsResponse = {
  data?: InstagramMetric[];
};

// -----------------------------
// 4️⃣ Reddit API types
// -----------------------------
type RedditAPIResponse = {
  data: {
    id: string;
    name: string;
    total_karma?: number;
    comment_karma?: number;
    link_karma?: number;
  };
};

// -----------------------------
// 5️⃣ TikTok API types
// -----------------------------
type TikTokAPIResponse = {
  user_id?: string;
  username?: string;
  followers?: number;
  comments?: number;
  posts?: number;
  likes?: number;
};

// -----------------------------
// 6️⃣ Normalizers
// -----------------------------

// YouTube
export function normalizeYouTubeMetrics(
  apiResponse: YouTubeChannelStats
): NormalizedMetrics {
  const stats = apiResponse.items?.[0]?.statistics ?? {};
  return {
    date: new Date().toISOString().slice(0, 10),
    followers: Number(stats.subscriberCount ?? 0),
    views: Number(stats.viewCount ?? 0),
    // likes/comments per-video not included here
  };
}

// Instagram
export function normalizeInstagramMetrics(
  apiResponse: InstagramInsightsResponse
): NormalizedMetrics {
  const metrics = apiResponse.data ?? [];
  const byName: Record<string, number> = {};

  for (const m of metrics) {
    const raw = m.values?.[0]?.value;
    byName[m.name] = Number(raw ?? 0);
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    followers: byName["followers_count"] ?? 0,
    impressions: byName["impressions"] ?? 0,
    views: byName["profile_views"] ?? 0,
  };
}

// Reddit
export function normalizeRedditMetrics(data: RedditAPIResponse): SocialMetric {
  return {
    id: data.data.id,
    platform: "reddit",
    handle: data.data.name,
    followers: data.data.total_karma ?? 0,
    comments: data.data.comment_karma ?? 0,
    posts: data.data.link_karma ?? 0,
    weeklyGrowthPct: 0,
    likes: null,
    postsDelta: null,
    commentsDelta: null,
    followersDelta: null,
    momentum: null,
    engagement_change: null,
    engagementChange: null,
    created_at: new Date().toISOString(),
  };
}

// TikTok
export function normalizeTikTokMetrics(data: TikTokAPIResponse): SocialMetric {
  return {
    id: data.user_id ?? "tiktok-" + Date.now(),
    platform: "tiktok",
    handle: data.username ?? "unknown",
    followers: data.followers ?? 0,
    comments: data.comments ?? 0,
    posts: data.posts ?? 0,
    weeklyGrowthPct: 0,
    likes: data.likes ?? 0,
    postsDelta: null,
    commentsDelta: null,
    followersDelta: null,
    momentum: null,
    engagement_change: null,
    engagementChange: null,
    created_at: new Date().toISOString(),
  };
}