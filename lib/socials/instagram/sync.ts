import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";
import { emptySyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    // Placeholder until Instagram API integration is added
    const posts: unknown[] = [];

    // Load previous metrics (snake_case from DB)
    const { data: prev } = await supabase
      .from("social_profiles")
      .select("*")
      .eq("platform", "instagram")
      .eq("user_id", account.user_id)
      .single();

    const prevWeek = prev?.commentsweek ?? 1;
    const prevLikes = prev?.likes ?? 0;

    // Placeholder metrics (no real Instagram API yet)
    const comments = 0;
    const commentsToday = 0;
    const commentsWeek = 0;
    const commentsMonth = 0;

    const likes = 0;
    const likesToday = 0;

    const likesDelta = likes - prevLikes;
    const momentum = Math.round((commentsWeek / prevWeek) * 100 - 100);
    const engagementChange = likesDelta;

    return {
      platform: "instagram",
      updated: true,

      followers: null, // Instagram follower count not fetched yet

      comments,
      commentsToday,
      commentsWeek,
      commentsMonth,
      commentsLastWeek: prevWeek,

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
    return emptySyncResult("instagram", message);
  }
}