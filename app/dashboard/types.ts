// ---------------------------------------------
// JSON type (Supabase-compatible)
// ---------------------------------------------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// ---------------------------------------------
// Dashboard Social (aggregated metrics)
// ---------------------------------------------
export interface DashboardSocial {
  id: string;
  platform: string | null;
  handle: string;

  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;

  posts: number;
}

// ---------------------------------------------
// Metric units for charts
// ---------------------------------------------
export type MetricUnit = "count" | "minutes" | "hours" | "percent";

// ---------------------------------------------
// Metric config for drawers + charts
// ---------------------------------------------
export interface MetricConfig {
  key: string;
  label: string;
  value: number;
  description?: string;
  unit?: MetricUnit;
}

// ---------------------------------------------
// Analytics summary for each social account
// ---------------------------------------------
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

// ---------------------------------------------
// OAuth data (shared across all platforms)
// ---------------------------------------------
export interface OAuthData {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  scope: string | null;
  token_type: string | null;
  raw: Record<string, Json>;
}

// ---------------------------------------------
// RealtimeSocialMetric (normalized ingestion)
// ---------------------------------------------
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
    access_token: string | null;
    refresh_token: string | null;
    expires_at: number | null;
    scope: string | null;
    token_type: string | null;
    raw: Record<string, Json>;
  };
}

// ---------------------------------------------
// UnifiedSocialMetric (DB → dashboard)
// ---------------------------------------------
export interface UnifiedSocialMetric {
  id: string;
  platform: string;
  handle: string;

  followers: number;

  comments: number;
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  likes: number;
  likesToday: number;
  likesDelta: number;

  posts: number;

  momentum: number;
  engagementChange: number;

  oauth?: OAuthData;
}