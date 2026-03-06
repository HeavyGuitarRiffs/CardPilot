// ---------------------------------------------
// ActivityMetrics returned from ingestion + DB
// ---------------------------------------------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface DashboardSocial {
  id: string;
  platform: string | null;
  handle: string;

  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;

  posts: number;
}

// Chart + metric units
export type MetricUnit = "count" | "minutes" | "hours" | "percent";

// Used for metric drawers + charts
export interface MetricConfig {
  key: string;
  label: string;
  value: number;
  description?: string;
  unit?: MetricUnit;
}

// Full analytics for each social account
export interface SocialAnalytics {
  id: string;
  platform: string | null;
  handle: string;

  followers: number;
  comments: number;
  likes: number;
  posts: number;

  momentum?: number;
}
export interface RealtimeSocialMetric {
  platform: string;
  handle: string | null;

  followers: number;
  following?: number;

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

  oauth: {
    access_token: string;
    refresh_token: string | null;
    expires_at: number | null;
    scope: string | null;
    token_type: string | null;
    raw: Record<string, Json>;
  };
}
export interface OAuthData {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  scope: string | null;
  token_type: string | null;
  raw: Record<string, Json>;
}