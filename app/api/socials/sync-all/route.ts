import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { SOCIAL_SYNC_MAP, SOCIAL_AUTH_TYPE } from "@/lib/socials";
import { oauthNormalize } from "@/lib/normalize/oauthNormalize";
import { publicNormalize } from "@/lib/normalize/publicNormalize";
import { hydrateAccount } from "@/lib/socials/hydrateAccount";

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
export async function POST() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: accounts, error: accountsError } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId);

  if (accountsError || !accounts?.length) {
    return NextResponse.json({ error: "No connected socials" }, { status: 404 });
  }

  const results = await Promise.all(
    accounts.map(async (account) => {
      const platform = account.platform;
      const loadSync = SOCIAL_SYNC_MAP[platform];

      if (!loadSync) {
        return { platform, error: "No sync function found" };
      }

      try {
        const syncFn = await loadSync();
        const hydrated = hydrateAccount(account);

        const raw = await syncFn(hydrated, supabase);

        const normalized =
          SOCIAL_AUTH_TYPE[platform] === "oauth"
            ? oauthNormalize({ ...raw, platform, handle: account.handle })
            : publicNormalize({ ...raw, platform, handle: account.handle });

        await supabase
          .from("social_profiles")
          .upsert(mapToSocialProfileRow(normalized, userId));

        return { platform, success: true, data: normalized };
      } catch (err) {
        return {
          platform,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    })
  );

  return NextResponse.json({ results });
}