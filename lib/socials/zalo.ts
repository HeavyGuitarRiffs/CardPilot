// lib/socials/zalo.ts

import type { Account } from "./socialIndex";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

export async function syncZalo(
  account: Account,
  supabase: SupabaseClient<Database>
) {
  const {
    account_id,
    user_id,
    zalo_user_id,
  } = account as unknown as {
    account_id: string;
    user_id: string;
    zalo_user_id: string;
  };

  if (!zalo_user_id) {
    return {
      platform: "zalo",
      updated: false,
      error: "Missing Zalo user ID",
      account_id,
    };
  }

  const profile = await fetchZaloProfile(zalo_user_id);
  const posts = await fetchZaloPosts(zalo_user_id);

  const normalizedProfile = normalizeZaloProfile(profile);
  const normalizedPosts = posts.map(normalizeZaloPost);

  /* ---------------------------------
     social_profiles
  ----------------------------------*/
  await supabase.from("social_profiles").upsert({
    account_id,
    user_id,
    platform: "zalo",
    username: normalizedProfile.username,
    avatar_url: normalizedProfile.avatar_url,
    followers: normalizedProfile.followers,
    following: normalizedProfile.following,
    last_synced: new Date().toISOString(),
  });

  /* ---------------------------------
     social_posts
  ----------------------------------*/
  if (normalizedPosts.length > 0) {
    await supabase.from("social_posts").upsert(
      normalizedPosts.map((p) => ({
        ...p,
        user_id,
        account_id,
      }))
    );
  }

  return {
    platform: "zalo",
    updated: true,
    posts: normalizedPosts.length,
    metrics: true,
    account_id,
  };
}

/* -----------------------------
   Local Types
------------------------------*/

type RawZaloProfile = {
  username?: string;
  avatar_url?: string;
  followers?: number;
  following?: number;
};

type RawZaloPost = {
  id: string;
  message?: string;
  media_url?: string;
  likes?: number;
  comments?: number;
  created_at?: string;
};

type NormalizedProfile = {
  username: string;
  avatar_url: string;
  followers: number;
  following: number;
};

type NormalizedPost = {
  platform: string;
  post_id: string;
  caption: string;
  media_url: string;
  likes: number;
  comments: number;
  posted_at: string;
};

/* -----------------------------
   Helpers (Placeholder)
------------------------------*/

async function fetchZaloProfile(zaloUserId: string): Promise<RawZaloProfile> {
  return {
    username: "Placeholder Zalo User",
    avatar_url: "",
    followers: 0,
    following: 0,
  };
}

async function fetchZaloPosts(zaloUserId: string): Promise<RawZaloPost[]> {
  return [
    {
      id: "1",
      message: "Placeholder Zalo Post",
      media_url: "",
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
    },
  ];
}

function normalizeZaloProfile(raw: RawZaloProfile): NormalizedProfile {
  return {
    username: raw.username ?? "",
    avatar_url: raw.avatar_url ?? "",
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
  };
}

function normalizeZaloPost(raw: RawZaloPost): NormalizedPost {
  return {
    platform: "zalo",
    post_id: raw.id,
    caption: raw.message ?? "",
    media_url: raw.media_url ?? "",
    likes: raw.likes ?? 0,
    comments: raw.comments ?? 0,
    posted_at: raw.created_at ?? new Date().toISOString(),
  };
}