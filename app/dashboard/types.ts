// ---------------------------------------------
// ActivityMetrics returned from ingestion + DB
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