//app\dashboard\connect\types.ts
export type RawSocial = {
  id?: string;
  platform?: string;
  handle?: string;

  followers?: number | null;
  comments?: number | null;

  commentsToday?: number | null;
  commentsWeek?: number | null;
  commentsMonth?: number | null;
  commentsLastWeek?: number | null;

  posts?: number | null;
  streak?: number | null;
  conversionPages?: number | null;

  weeklyGrowthPct?: number | null;
  linktree?: boolean | null;
  order_index?: number | null;
  created_at?: string | null;

  postsDelta?: number | null;
  commentsDelta?: number | null;
  followersDelta?: number | null;

  momentum?: number | null;
  engagement_change?: number | null;
  engagementChange?: number | null;

  likes?: number | null;
  likesDelta?: number | null;
};