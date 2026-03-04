import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";
import { emptySyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    // GitHub API integration not implemented yet
    const posts: unknown[] = [];

    // GitHub does not provide comment/like metrics in a way that matches your model yet
    const comments = 0;
    const commentsToday = 0;
    const commentsWeek = 0;
    const commentsMonth = 0;

    const likes = 0;
    const likesToday = 0;
    const likesDelta = 0;

    const momentum = 0;
    const engagementChange = 0;

    return {
      platform: "github",
      updated: true,

      followers: null, // Not fetched yet

      comments,
      commentsToday,
      commentsWeek,
      commentsMonth,
      commentsLastWeek: 0,

      likes,
      likesToday,
      likesDelta,

      momentum,
      engagement_change: engagementChange,
      engagementChange,

      posts: posts.length,
      metrics: true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return emptySyncResult("github", message);
  }
}