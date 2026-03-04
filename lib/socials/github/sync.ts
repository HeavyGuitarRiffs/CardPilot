import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    // GitHub does not provide comment/like metrics in a way that matches your model yet
    const posts: unknown[] = [];

    return {
      platform: "github",
      updated: true,

      followers: null, // GitHub follower count not fetched yet

      comments: 0,
      commentsToday: 0,
      likes: 0,
      likesToday: 0,
      likesDelta: 0,

      momentum: 0,
      engagement_change: 0,
      engagementChange: 0,

      posts: posts.length,
      metrics: true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      platform: "github",
      updated: false,
      error: message,
    };
  }
}