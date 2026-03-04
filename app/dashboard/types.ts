// ---------------------------------------------
// OAuth payload returned from each platform
// ---------------------------------------------
export interface OAuthData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  token_type?: string;

  // Provider-specific metadata (safe, typed)
  raw?: Record<string, unknown>;
}

// ---------------------------------------------
// Main dashboard metric type (used in UI lists)
// ---------------------------------------------
export type SocialMetric = {
  id: string;
  platform: string;
  handle: string;

  followers: number;
  comments: number;
  weeklyGrowthPct: number;

  linktree: boolean;
  order_index: number;
  created_at: string | null;

  // Required fields
  oauth: boolean;
  likesDelta: number;

  // Core metrics
  likes: number;
  posts: number;
  postsDelta: number;
  commentsDelta: number;
  followersDelta: number;
  momentum: number;

  // Engagement fields (backend expects both)
  engagement_change: number;
  engagementChange: number;

  // Dashboard-only fields
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  streak: number;
  conversionPages: number;
};

// ---------------------------------------------
// Metric display config (cards, widgets, etc.)
// ---------------------------------------------
export type MetricUnit = "count" | "hours" | "minutes" | "percent";

export type MetricConfig = {
  key: string;
  label: string;
  value: number;
  description?: string;
  change?: number;
  icon?: React.ReactNode;
  social?: string;
  unit?: MetricUnit;
};

// ---------------------------------------------
// Normalized backend → dashboard metric type
// Returned by oauthNormalize()
// ---------------------------------------------
export interface ExtendedSocialMetric {
  followers: number;

  comments: number;
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  likes: number;
  likesToday: number;
  likesDelta: number;

  momentum: number;
  engagement_change: number;
  engagementChange: number;

  posts: number;

  // Fully typed OAuth metadata
  oauth: OAuthData;

  handle: string;
  platform: string;
}