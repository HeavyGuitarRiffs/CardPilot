// lib/normalize/oauthNormalize.ts
import type { RawSocial } from "@/app/dashboard/connect/types";
import type { RealtimeSocialMetric, OAuthData } from "@/app/dashboard/types";
import createEmptySocialMetric from "@/lib/normalize/createEmptySocialMetric";

export function oauthNormalize(raw: RawSocial): RealtimeSocialMetric {
  const base = createEmptySocialMetric();

  const oauth: OAuthData = {
    access_token: raw.oauth?.access_token ?? "",
    refresh_token: raw.oauth?.refresh_token ?? undefined,
    expires_at: raw.oauth?.expires_at ?? undefined,
    scope: raw.oauth?.scope ?? undefined,
    token_type: raw.oauth?.token_type ?? undefined,
    raw: raw.oauth?.raw ?? {},
  };

  return {
    followers: raw.followers ?? base.followers,

    comments: raw.comments ?? base.comments,
    commentsToday: raw.commentsToday ?? base.commentsToday,
    commentsWeek: raw.commentsWeek ?? base.commentsWeek,
    commentsMonth: raw.commentsMonth ?? base.commentsMonth,
    commentsLastWeek: raw.commentsLastWeek ?? base.commentsLastWeek,

    likes: raw.likes ?? base.likes,
    likesToday: raw.likesToday ?? base.likesToday,
    likesDelta: raw.likesDelta ?? base.likesDelta,

    momentum: raw.momentum ?? base.momentum,
    engagement_change: raw.engagement_change ?? base.engagement_change,
    engagementChange: raw.engagementChange ?? base.engagementChange,

    posts: raw.posts ?? base.posts,

    oauth,

    handle: raw.handle ?? base.handle,
    platform: raw.platform ?? base.platform,
  };
}