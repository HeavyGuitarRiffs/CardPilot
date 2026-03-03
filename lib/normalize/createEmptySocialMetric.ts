// lib/normalize/createEmptySocialMetric.ts
import type { SocialMetric } from "@/app/dashboard/types";

export function createEmptySocialMetric(): SocialMetric {
  return {
    id: crypto.randomUUID(),
    platform: "unknown",
    handle: "",

    followers: 0,
    comments: 0,
    weeklyGrowthPct: 0,
    linktree: false,
    order_index: 0,
    created_at: null,

    oauth: false,
    likesDelta: 0,

    likes: 0,
    posts: 0,
    postsDelta: 0,
    commentsDelta: 0,
    followersDelta: 0,
    momentum: 0,

    engagement_change: 0,
    engagementChange: 0,

    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    streak: 0,
    conversionPages: 0,
  };
}