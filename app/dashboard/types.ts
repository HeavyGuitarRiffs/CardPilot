// ---------------------------------------------
// OAuth payload returned from each platform
// ---------------------------------------------
export interface OAuthData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  token_type?: string;
  raw?: Record<string, unknown>;
}

// ---------------------------------------------
// user_socials → sidebar list
// ---------------------------------------------
export interface UserSocial {
  id: string;
  platform: string;
  handle: string;

  followers: number;
  comments: number;

  linktree: boolean;
  order_index: number;
  created_at: string | null;
}

// ---------------------------------------------
// social_profiles → real-time metrics
// ---------------------------------------------
export interface RealtimeSocialMetric {
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

  oauth: OAuthData;

  handle: string;
  platform: string;
}

// ---------------------------------------------
// Metric display config
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