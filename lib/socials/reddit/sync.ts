import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";

type RedditComment = {
  created_utc: number;
  ups: number;
  [key: string]: unknown;
};

type SocialProfileRow =
  Database["public"]["Tables"]["social_profiles"]["Row"];

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    const token = account.oauth?.access_token;
    const username = account.handle;

    if (!token || !username) {
      return {
        platform: "reddit",
        updated: false,
        error: "Missing OAuth token or username",
      };
    }

    const res = await fetch(
      `https://oauth.reddit.com/user/${username}/comments?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": process.env.REDDIT_USER_AGENT ?? "PrettyPlay/1.0",
        },
      }
    );

    if (!res.ok) {
      return {
        platform: "reddit",
        updated: false,
        error: `Reddit API error: ${res.status}`,
      };
    }

    const json = await res.json();
    const items: { data: RedditComment }[] = json?.data?.children ?? [];

    const comments: RedditComment[] = items.map((item) => item.data);

    const now = new Date();
    const startOfDay =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
      1000;

    const totalComments = comments.length;

    const commentsToday = comments.filter(
      (c) => c.created_utc >= startOfDay
    ).length;

    const totalLikes = comments.reduce((sum, c) => sum + (c.ups ?? 0), 0);

    const likesToday = comments
      .filter((c) => c.created_utc >= startOfDay)
      .reduce((sum, c) => sum + (c.ups ?? 0), 0);

    const { data: prev } = await supabase
      .from("social_profiles")
      .select("*")
      .eq("user_id", account.user_id)
      .eq("platform", "reddit")
      .single();

    const prevRow = prev as SocialProfileRow | null;

    const prevLikes = prevRow?.likes ?? 0;
    const prevComments = prevRow?.comments ?? 0;

    const likesDelta = totalLikes - prevLikes;
    const commentsDelta = totalComments - prevComments;

    const momentum = commentsToday + likesToday;

    const engagementChange =
      prevComments > 0 ? (commentsDelta / prevComments) * 100 : 100;

    return {
      platform: "reddit",
      updated: true,
      followers: null,
      comments: totalComments,
      commentsToday,
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
    return {
      platform: "reddit",
      updated: false,
      error: message,
    };
  }
}