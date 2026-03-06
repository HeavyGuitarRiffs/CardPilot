import type { RealtimeSocialMetric, OAuthData } from "@/app/dashboard/types";

const createEmptySocialMetric = (): RealtimeSocialMetric => {
  const emptyOAuth: OAuthData = {
    access_token: "",
    refresh_token: null,
    expires_at: null,
    scope: null,
    token_type: null,
    raw: {},
  };

  return {
    followers: 0,

    comments: 0,
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    likes: 0,
    likesToday: 0,
    likesDelta: 0,

    momentum: 0,
    engagement_change: 0,
    engagementChange: 0,

    posts: 0,

    oauth: emptyOAuth,

    handle: "",
    platform: "",
  };
};

export default createEmptySocialMetric;