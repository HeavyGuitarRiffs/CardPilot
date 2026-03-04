// ---------------------------------------------
// Supabase JSON-safe type
// ---------------------------------------------
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

// ---------------------------------------------
// OAuth payload returned from each platform
// ---------------------------------------------
export interface OAuthData {
  access_token: string;
  refresh_token?: string | null;
  expires_at?: number | null;
  scope?: string | null;
  token_type?: string | null;
  raw?: { [key: string]: Json }; // MUST be JSON-safe for Supabase
}

// ---------------------------------------------
// user_socials → connected accounts (raw DB rows)
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
// DashboardSocial → unified analytics type
// (used by DashboardPage + charts + cards)
// ---------------------------------------------
export interface DashboardSocial {
  id: string;
  platform: string;
  handle: string;

  followers: number;
  linktree: boolean;
  order_index: number;
  created_at: string | null;

  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  posts: number;
}

// ---------------------------------------------
// social_profiles → real-time metrics
// (used by SocialAnalyticsDrawer)
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