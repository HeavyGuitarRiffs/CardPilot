import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sync as youtubeSync } from "@/lib/socials/youtube/sync";
import { sync as githubSync } from "@/lib/socials/github/sync";

import { hydrateAccount } from "@/lib/socials/hydrateAccount";
import { oauthNormalize } from "@/lib/normalize/oauthNormalize";

import type {
  RealtimeSocialMetric,
  OAuthData,
  Json,
} from "@/app/dashboard/types";

// ---------------------------------------------
// JSON-safe OAuth for Supabase
// ---------------------------------------------
function jsonSafeOAuth(oauth: OAuthData) {
  return {
    access_token: oauth.access_token ?? "",
    refresh_token: oauth.refresh_token ?? null,
    expires_at: oauth.expires_at ?? null,
    scope: oauth.scope ?? null,
    token_type: oauth.token_type ?? null,
    raw: oauth.raw ?? {},
  };
}

// ---------------------------------------------
// Matches EXACT Supabase schema for social_profiles
// ---------------------------------------------
interface SocialProfileRow {
  user_id: string;
  platform: string;

  username: string | null;
  avatar_url: string | null;

  followers: number;
  following: number;

  comments: number;
  commentstoday: number;
  commentsweek: number;
  commentsmonth: number;
  commentslastweek: number;

  likes: number;
  likestoday: number;
  likesdelta: number;

  momentum: number;
  engagement_change: number;
  engagementchange: number;

  posts: number;

  metrics: boolean;

  oauth: {
    access_token: string;
    refresh_token: string | null;
    expires_at: number | null;
    scope: string | null;
    token_type: string | null;
    raw: { [key: string]: Json };
  };

  last_synced: string;
  updated_at: string;
}

// ---------------------------------------------
// Typed mapper (NO ANY)
// ---------------------------------------------
function mapToSocialProfileRow(
  normalized: RealtimeSocialMetric,
  userId: string
): SocialProfileRow {
  return {
    user_id: userId,
    platform: normalized.platform,

    username: normalized.handle ?? null,
    avatar_url: null,

    followers: normalized.followers,
    following: 0,

    comments: normalized.comments,
    commentstoday: normalized.commentsToday,
    commentsweek: normalized.commentsWeek,
    commentsmonth: normalized.commentsMonth,
    commentslastweek: normalized.commentsLastWeek,

    likes: normalized.likes,
    likestoday: normalized.likesToday,
    likesdelta: normalized.likesDelta,

    momentum: normalized.momentum,
    engagement_change: normalized.engagement_change,
    engagementchange: normalized.engagementChange,

    posts: normalized.posts,

    metrics: true,

    oauth: jsonSafeOAuth(normalized.oauth),

    last_synced: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------
// Route handler
// ---------------------------------------------
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*");

  if (!accounts) {
    return NextResponse.json({ error: "No accounts found" }, { status: 404 });
  }

  for (const account of accounts) {
    const hydrated = hydrateAccount(account);

    let raw: unknown;

    switch (account.platform) {
      case "youtube":
        raw = await youtubeSync(hydrated, supabase);
        break;

      case "github":
        raw = await githubSync(hydrated, supabase);
        break;

      default:
        continue;
    }

    const normalized = oauthNormalize({
      ...(raw as object),
      platform: account.platform,
      handle: account.handle,
    });

    await supabase
      .from("social_profiles")
      .upsert(mapToSocialProfileRow(normalized, account.user_id));
  }

  return NextResponse.json({ success: true });
}