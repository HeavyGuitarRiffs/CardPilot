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

  // Engagement fields (your backend expects both)
  engagement_change: number;
  engagementChange: number;

  // Dashboard-only fields (MUST exist)
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  streak: number;
  conversionPages: number;
};
export type MetricUnit = "count" | "hours" | "minutes" | "percent";

export type MetricConfig = {
  key: string;
  label: string;
  value: number;
  description?: string;
  change?: number;
  icon?: React.ReactNode;
  social?: string;
  unit?: MetricUnit;   // correct and typed
};