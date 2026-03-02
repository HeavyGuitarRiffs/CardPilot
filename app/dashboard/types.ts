// app/dashboard/types.ts

export type MetricKey =
  | "commentsToday"
  | "commentsWeek"
  | "commentsMonth"
  | "streak"
  | "momentum"
  | string; // allow future metrics

export type MetricUnit = "hours" | "minutes" | "count" | "percent";

export type MetricConfig = {
  key: MetricKey;
  label: string;
  value: number; // always numeric for charts
  description: string;
  unit?: MetricUnit;
  social?: string;
  rangeLabel?: string;
  userId?: string;
};

// ⭐ Base type for all normalized social metrics
export interface SocialMetric {
  id: string;
  platform: string;
  handle: string;

  followers: number;
  comments: number;

  momentum: number;
  engagement_change: number;
  engagementChange: number;

  likes: number;
  likesDelta: number;

  oauth: boolean; // ⭐ REQUIRED for sync-all + normalize
}