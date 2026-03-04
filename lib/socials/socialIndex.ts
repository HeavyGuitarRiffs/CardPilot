// lib/socials/socialIndex.ts

// Existing sync functions
import { syncBandcamp } from "./bandcamp";
import { syncDouyin } from "./douyin";
import { syncXiaohongshu } from "./xiaohongshu";
import { syncKuaishou } from "./kuaishou";

// Major platform sync functions
import { sync as syncTwitter } from "./twitter/sync";
import { sync as syncInstagram } from "./instagram/sync";
import { sync as syncYouTube } from "./youtube/sync";
import { sync as syncTikTok } from "./tiktok/sync";
import { sync as syncReddit } from "./reddit/sync";
import { sync as syncGithub } from "./github/sync";
import { sync as syncPatreon } from "./patreon/sync";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

export type SyncFunction = (
  account: Account,
  supabase: SupabaseClient<Database>
) => Promise<SyncResult>;

// -------------------------
// FIXED ACCOUNT TYPE
// -------------------------
export type Account = {
  id: string;
  user_id: string;
  platform: string;

  handle?: string;
  url?: string | null;
  created_at?: string | null;

  // OAuth container (matches social_accounts.oauth JSON column)
  oauth?: {
    access_token: string | null;
    refresh_token?: string | null;
    expires_at?: number | null;
  } | null;

  username?: string;
  avatar_url?: string;
};

// -------------------------
// FIXED SYNC RESULT TYPE
// -------------------------
export interface SyncResult {
  platform: string;
  updated: boolean;
  error?: string;

  // universal fields
  posts?: number;
  metrics?: boolean;
  followers?: number | null;

  // full metrics for Social Like
  comments?: number;
  commentsToday?: number;
  likes?: number;
  likesToday?: number;
  likesDelta?: number;
  momentum?: number;
  engagement_change?: number;
  engagementChange?: number;
}

// -------------------------
// PLATFORM MAP
// -------------------------
const platformMap: Record<string, SyncFunction> = {
  bandcamp: syncBandcamp,
  douyin: syncDouyin,
  xiaohongshu: syncXiaohongshu,
  kuaishou: syncKuaishou,

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
    return {
      platform,
      updated: false,
      error: `Unsupported platform: ${platform}`,
    };
  }

  try {
    return await syncFn(account, supabase);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { platform, updated: false, error: message };
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