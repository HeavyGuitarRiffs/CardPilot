// lib/socials/index.ts
import type { Account, SyncResult } from "./socialIndex";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

export type SyncFn = (
  account: Account,
  supabase: SupabaseClient<Database>
) => Promise<SyncResult>;

// Dynamic sync loader for each platform.
export const SOCIAL_SYNC_MAP: Record<string, () => Promise<SyncFn>> = {
  github: () => import("./github/sync").then(m => m.sync),
  instagram: () => import("./instagram/sync").then(m => m.sync),
  patreon: () => import("./patreon/sync").then(m => m.sync),
  reddit: () => import("./reddit/sync").then(m => m.sync),
  tiktok: () => import("./tiktok/sync").then(m => m.sync),
  twitter: () => import("./twitter/sync").then(m => m.sync),
  youtube: () => import("./youtube/sync").then(m => m.sync),

  // Future socials
  // threads: () => import("./threads/sync").then(m => m.sync),
  // bluesky: () => import("./bluesky/sync").then(m => m.sync),
  // mastodon: () => import("./mastodon/sync").then(m => m.sync),
  // pinterest: () => import("./pinterest/sync").then(m => m.sync),
  // tumblr: () => import("./tumblr/sync").then(m => m.sync),
};

// Whether each platform uses OAuth or public scraping/API.
export const SOCIAL_AUTH_TYPE: Record<string, "oauth" | "public"> = {
  github: "oauth",
  instagram: "oauth",
  patreon: "oauth",
  reddit: "oauth",
  tiktok: "oauth",
  youtube: "oauth",

  twitter: "public",
};

// List of all supported providers
export const SUPPORTED_SOCIALS = Object.keys(SOCIAL_SYNC_MAP);