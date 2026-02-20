// /lib/ingestion/normalize.ts

// -----------------------------
// 1. Shared normalized type
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
// 2. YouTube API response types
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
// 3. Instagram Graph API types
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
// 4. Normalizers
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
    // likes/comments are per-video; handled separately if needed
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
    followers: byName["followers_count"],
    impressions: byName["impressions"],
    views: byName["profile_views"],
  };
}