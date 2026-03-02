// lib/socials/index.ts
import type { Account, SyncResult } from "./socialIndex";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

export type SyncFn = (
  account: Account,
  supabase: SupabaseClient<Database>
) => Promise<SyncResult>;

/* -------------------------------------------------
   1. SYNC MAP — Only platforms with actual sync files
--------------------------------------------------- */
export const SOCIAL_SYNC_MAP: Record<string, () => Promise<SyncFn>> = {
  github: () => import("./github/sync").then(m => m.sync),
  instagram: () => import("./instagram/sync").then(m => m.sync),
  patreon: () => import("./patreon/sync").then(m => m.sync),
  reddit: () => import("./reddit/sync").then(m => m.sync),
  tiktok: () => import("./tiktok/sync").then(m => m.sync),
  twitter: () => import("./twitter/sync").then(m => m.sync),
  youtube: () => import("./youtube/sync").then(m => m.sync),
};

/* -------------------------------------------------
   2. AUTH TYPE MAP — OAuth vs Public
   (Used for Engines Page + Sync-All Normalization)
--------------------------------------------------- */
export const SOCIAL_AUTH_TYPE: Record<string, "oauth" | "public"> = {
  /* OAuth Platforms */
  github: "oauth",
  instagram: "oauth",
  patreon: "oauth",
  reddit: "oauth",
  tiktok: "oauth",
  twitter: "oauth",
  youtube: "oauth",

  /* Public Platforms */
  audiomack: "public",
  bandcamp: "public",
  bilibili: "public",
  bitchute: "public",
  blogger: "public",
  bluesky: "public",
  buymeacoffee: "public",
  canva: "public",
  codepen: "public",
  codesandbox: "public",
  dailymotion: "public",
  deso: "public",
  devto: "public",
  douyin: "public",
  etsy: "public",
  farcaster: "public",
  figma: "public",
  flickr: "public",
  foundation: "public",
  ghost: "public",
  goodreads: "public",
  gumroad: "public",
  hashnode: "public",
  hive: "public",
  kickstarter: "public",
  kofi: "public",
  kuaishou: "public",
  lastfm: "public",
  lemonsqueezy: "public",
  lens: "public",
  line: "public",
  mastodon: "public",
  medium: "public",
  mixcloud: "public",
  mirror: "public",
  napster: "public",
  notion: "public",
  obs: "public",
  odysee: "public",
  opensea: "public",
  peepeth: "public",
  pinterest: "public",
  pixiv: "public",
  quora: "public",
  redbubble: "public",
  rumble: "public",
  shazam: "public",
  shopify: "public",
  soundcloud: "public",
  spring: "public",
  stackoverflow: "public",
  streamlabs: "public",
  substack: "public",
  superrare: "public",
  telegram: "public",
  tidal: "public",
  trello: "public",
  tumblr: "public",
  vimeo: "public",
  vk: "public",
  whatsapp: "public",
  wordpress: "public",
  xiaohongshu: "public",
  zora: "public",
};

/* -------------------------------------------------
   3. SUPPORTED SOCIALS — Only platforms with sync
--------------------------------------------------- */
export const SUPPORTED_SOCIALS = Object.keys(SOCIAL_SYNC_MAP);