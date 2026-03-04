import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    // Placeholder arrays/metrics until real Instagram API integration
    const posts: unknown[] = [];
    const totalComments = 0;
    const commentsToday = 0;
    const totalLikes = 0;
    const likesToday = 0;

    return {
      platform: "instagram",
      updated: true,

      followers: null, // Instagram follower count not fetched yet

      comments: totalComments,
      commentsToday,
      likes: totalLikes,
      likesToday,

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
      platform: "instagram",
      updated: false,
      error: message,
    };
  }
}