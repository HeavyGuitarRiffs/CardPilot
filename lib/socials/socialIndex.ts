// lib/socials/socialIndex.ts

// Existing sync functions
import { syncBandcamp } from "./bandcamp";
import { syncDouyin } from "./douyin";
import { syncXiaohongshu } from "./xiaohongshu";
import { syncKuaishou } from "./kuaishou";

// New major platform sync functions
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

export interface Account {
  id: string;
  user_id: string;
  platform: string;
  handle: string;
  url: string | null;
  created_at: string | null;
}

export interface SyncResult {
  platform: string;
  updated: boolean;
  error?: string;
  posts?: number;
  metrics?: boolean;
}

// Central sync registry
const platformMap: Record<string, SyncFunction> = {
  // Existing supported platforms
  bandcamp: syncBandcamp,
  douyin: syncDouyin,
  xiaohongshu: syncXiaohongshu,
  kuaishou: syncKuaishou,

  // Newly added major platforms
  twitter: syncTwitter,
  instagram: syncInstagram,
  youtube: syncYouTube,
  tiktok: syncTikTok,
  reddit: syncReddit,
  github: syncGithub,
  patreon: syncPatreon,
};

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