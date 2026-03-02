// lib/normalize/publicNormalize.ts
// lib/normalize/publicNormalize.ts

import type { RawSocial } from "./types";
import { ExtendedSocialMetric } from "@/app/dashboard/hooks/useSocials";

export function publicNormalize(raw: RawSocial): ExtendedSocialMetric {
  return {
    id: raw.id ?? crypto.randomUUID(),
    platform: raw.platform ?? "",
    handle: raw.handle ?? "",

    followers: raw.followers ?? 0,
    comments: raw.comments ?? 0,

    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    posts: raw.posts ?? 0,
    streak: 0,
    conversionPages: 0,

    momentum: raw.momentum ?? 0,
    engagement_change: raw.engagement_change ?? 0,
    engagementChange: raw.engagementChange ?? 0,

    likes: raw.likes ?? 0,
    likesDelta: raw.likesDelta ?? 0,

    oauth: false,
  };
}