import type { RawSocial } from "@/app/dashboard/connect/types";
import type { ExtendedSocialMetric } from "@/app/dashboard/hooks/useSocials";
import { createEmptySocialMetric } from "@/lib/normalize/createEmptySocialMetric";

export function oauthNormalize(raw: RawSocial): ExtendedSocialMetric {
  const base = createEmptySocialMetric();

  return {
    ...base,

    id: raw.id ?? base.id,
    platform: raw.platform ?? base.platform,
    handle: raw.handle ?? base.handle,

    followers: raw.followers ?? base.followers,
    comments: raw.comments ?? base.comments,

    commentsToday: raw.commentsToday ?? base.commentsToday,
    commentsWeek: raw.commentsWeek ?? base.commentsWeek,
    commentsMonth: raw.commentsMonth ?? base.commentsMonth,
    commentsLastWeek: raw.commentsLastWeek ?? base.commentsLastWeek,

    posts: raw.posts ?? base.posts,
    streak: raw.streak ?? base.streak,
    conversionPages: raw.conversionPages ?? base.conversionPages,

    weeklyGrowthPct: raw.weeklyGrowthPct ?? base.weeklyGrowthPct,
    linktree: raw.linktree ?? base.linktree,
    order_index: raw.order_index ?? base.order_index,
    created_at: raw.created_at ?? base.created_at,

    postsDelta: raw.postsDelta ?? base.postsDelta,
    commentsDelta: raw.commentsDelta ?? base.commentsDelta,
    followersDelta: raw.followersDelta ?? base.followersDelta,

    momentum: raw.momentum ?? base.momentum,
    engagement_change: raw.engagement_change ?? base.engagement_change,
    engagementChange: raw.engagementChange ?? base.engagementChange,

    likes: raw.likes ?? base.likes,
    likesDelta: raw.likesDelta ?? base.likesDelta,

    oauth: true,
  };
}