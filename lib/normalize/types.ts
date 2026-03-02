export type RawSocial = {
  id?: string;
  platform?: string;
  handle?: string;

  followers?: number;
  comments?: number;

  commentsToday?: number;
  commentsWeek?: number;
  commentsMonth?: number;
  commentsLastWeek?: number;

  posts?: number;
  streak?: number;
  conversionPages?: number;

  momentum?: number;
  engagement_change?: number;
  engagementChange?: number;

  likes?: number;
  likesDelta?: number;
};

//lib\normalize\types.ts