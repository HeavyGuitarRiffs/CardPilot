// lib/socials/socialIndex.ts

// Existing sync functions (legacy)
import { syncBandcamp } from "./bandcamp";
import { syncDouyin } from "./douyin";
import { syncXiaohongshu } from "./xiaohongshu";
import { syncKuaishou } from "./kuaishou";

// Major platform sync functions (new unified format)
import { sync as syncTwitter } from "./twitter/sync";
import { sync as syncInstagram } from "./instagram/sync";
import { sync as syncYouTube } from "./youtube/sync";
import { sync as syncTikTok } from "./tiktok/sync";
import { sync as syncReddit } from "./reddit/sync";
import { sync as syncGithub } from "./github/sync";
import { sync as syncPatreon } from "./patreon/sync";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

// -------------------------
// SYNC FUNCTION TYPE
// -------------------------
export type SyncFunction = (
  account: Account,
  supabase: SupabaseClient<Database>
) => Promise<SyncResult>;

// -------------------------
// RAW SUPABASE ROW TYPE
// -------------------------
export type RawSocialAccountRow = {
  id: string;
  user_id: string;
  platform: string;

  handle?: string;
  url?: string | null;
  created_at?: string | null;

  provider_account_id?: string | null;

  oauth?: {
    access_token: string | null;
    refresh_token?: string | null;
    expires_at?: number | null;
  } | null;

  username?: string | null;
  avatar_url?: string | null;
};

// -------------------------
// HYDRATED ACCOUNT TYPE
// -------------------------
export type Account = {
  id: string;
  user_id: string;
  platform: string;

  handle?: string;
  url?: string | null;
  created_at?: string | null;

  provider_account_id: string;

  access_token: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;

  oauth?: {
    access_token: string | null;
    refresh_token?: string | null;
    expires_at?: number | null;
  } | null;

  username?: string | null;
  avatar_url?: string | null;
};

// -------------------------
// FINAL, COMPLETE SYNC RESULT TYPE
// -------------------------
export type SyncResult = {
  platform: string;
  updated: boolean;
  error?: string | null;

  followers: number | null;

  comments: number;
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  likes: number;
  likesToday: number;
  likesDelta: number;

  momentum: number;
  engagement_change: number;
  engagementChange: number;

  posts: number;
  metrics: boolean;
};

// -------------------------
// UNIVERSAL FALLBACK RESULT
// -------------------------
export function emptySyncResult(
  platform: string,
  error?: string | null
): SyncResult {
  return {
    platform,
    updated: false,
    error: error ?? null,

    followers: null,

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
    metrics: false,
  };
}

// -------------------------
// PLATFORM MAP (with legacy wrappers)
// -------------------------
const platformMap: Record<string, SyncFunction> = {
  bandcamp: async (account, supabase) => ({
    ...emptySyncResult("bandcamp"),
    ...(await syncBandcamp(account, supabase)),
  }),

  douyin: async (account, supabase) => ({
    ...emptySyncResult("douyin"),
    ...(await syncDouyin(account, supabase)),
  }),

  xiaohongshu: async (account, supabase) => ({
    ...emptySyncResult("xiaohongshu"),
    ...(await syncXiaohongshu(account, supabase)),
  }),

  kuaishou: async (account, supabase) => ({
    ...emptySyncResult("kuaishou"),
    ...(await syncKuaishou(account, supabase)),
  }),

  twitter: syncTwitter,
  instagram: syncInstagram,
  youtube: syncYouTube,
  tiktok: syncTikTok,
  reddit: syncReddit,
  github: syncGithub,
  patreon: syncPatreon,
};

// -------------------------
// SYNC DISPATCHERS
// -------------------------
export async function syncPlatform(
  platform: string,
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  const key = platform.toLowerCase();
  const syncFn = platformMap[key];

  if (!syncFn) {
    return emptySyncResult(platform, `Unsupported platform: ${platform}`);
  }

  try {
    const result = await syncFn(account, supabase);

    // Ensure full SyncResult shape
    return {
      ...emptySyncResult(platform),
      ...result,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return emptySyncResult(platform, message);
  }
}

export async function syncMultipleAccounts(
  accounts: { platform: string; account: Account }[],
  supabase: SupabaseClient<Database>
) {
  const results: SyncResult[] = [];

  for (const { platform, account } of accounts) {
    const result = await syncPlatform(platform, account, supabase);
    results.push(result);
  }

  return results;
}