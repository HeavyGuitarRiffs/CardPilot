// lib/normalize/publicNormalize.ts

import type { RawSocial } from "@/app/dashboard/connect/types";
import type { ExtendedSocialMetric } from "@/app/dashboard/hooks/useSocials";
import { createEmptySocialMetric } from "@/lib/normalize/createEmptySocialMetric";

export function publicNormalize(raw: RawSocial): ExtendedSocialMetric {
  const base = createEmptySocialMetric();

  return {
    ...base,

    id: raw.id ?? base.id,
    platform: raw.platform ?? base.platform,
    handle: raw.handle ?? base.handle,

    followers: raw.followers ?? base.followers,
    comments: raw.comments ?? base.comments,

    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    posts: raw.posts ?? base.posts,
    streak: 0,
    conversionPages: 0,

    momentum: raw.momentum ?? base.momentum,
    engagement_change: raw.engagement_change ?? base.engagement_change,
    engagementChange: raw.engagementChange ?? base.engagementChange,

    likes: raw.likes ?? base.likes,
    likesDelta: raw.likesDelta ?? base.likesDelta,

    oauth: false,
  };
}