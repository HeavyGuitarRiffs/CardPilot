import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";
import { emptySyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    const accessToken = account.oauth?.access_token;
    if (!accessToken) {
      return emptySyncResult("youtube", "Missing YouTube access token");
    }

    // -----------------------------
    // 1. Fetch all user comments
    // -----------------------------
    const commentsRes = await fetch(
      "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!commentsRes.ok) {
      const err = await commentsRes.text();
      return emptySyncResult("youtube", err);
    }

    const commentsJson = await commentsRes.json();
    const items = commentsJson.items ?? [];

    // -----------------------------
    // 2. Extract timestamps + likes
    // -----------------------------
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalComments = 0;
    let commentsToday = 0;
    let commentsWeek = 0;
    let commentsMonth = 0;
    let totalLikes = 0;
    let likesToday = 0;

    for (const item of items) {
      const snippet = item.snippet?.topLevelComment?.snippet;
      if (!snippet) continue;

      const publishedAt = new Date(snippet.publishedAt);
      const likeCount = snippet.likeCount ?? 0;

      totalComments++;
      totalLikes += likeCount;

      if (publishedAt >= todayStart) {
        commentsToday++;
        likesToday += likeCount;
      }
      if (publishedAt >= weekStart) commentsWeek++;
      if (publishedAt >= monthStart) commentsMonth++;
    }

    // -----------------------------
    // 3. Load previous metrics (snake_case from DB)
    // -----------------------------
    const { data: prev } = await supabase
      .from("social_profiles")
      .select("*")
      .eq("platform", "youtube")
      .eq("user_id", account.user_id)
      .single();

    const prevWeek = prev?.commentsweek ?? 1;
    const prevLikes = prev?.likes ?? 0;

    // -----------------------------
    // 4. Compute deltas + momentum
    // -----------------------------
    const likesDelta = totalLikes - prevLikes;
    const momentum = Math.round((commentsWeek / prevWeek) * 100 - 100);
    const engagementChange = likesDelta;

    // -----------------------------
    // 5. Return normalized metrics (camelCase)
    // -----------------------------
    return {
      platform: "youtube",
      updated: true,

      followers: null,

      comments: totalComments,
      commentsToday,
      commentsWeek,
      commentsMonth,
      commentsLastWeek: prevWeek,

      likes: totalLikes,
      likesToday,
      likesDelta,

      momentum,
      engagement_change: engagementChange,
      engagementChange,

      posts: 0,
      metrics: true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return emptySyncResult("youtube", message);
  }
}