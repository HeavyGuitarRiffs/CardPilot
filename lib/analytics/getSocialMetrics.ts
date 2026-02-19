import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/supabase/types";

export type SocialMetricsV2 = {
  account_id: string;
  date: string;
  posts: number;
  comments: number;
  likes: number;
  followers: number;
};

const supabase = createClient();

/**
 * Fetch the latest social metrics for a user from social_metrics_daily_v2.
 * Returns an array of SocialMetricsV2 ordered by date descending.
 */
export async function getSocialMetrics(userId: string): Promise<SocialMetricsV2[]> {
  const { data, error } = await supabase
    .from("social_metrics_daily_v2")
    .select("account_id, date, posts, comments, likes, followers")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching social metrics:", error);
    return [];
  }

  // ✅ Normalize nullable DB values into strict usable values
  return (data ?? []).map((row) => ({
    account_id: row.account_id ?? "",
    date: row.date,
    posts: row.posts ?? 0,
    comments: row.comments ?? 0,
    likes: row.likes ?? 0,
    followers: row.followers ?? 0,
  }));
}

/**
 * Aggregate the latest values per metric for dashboard summary cards.
 */
export async function getLatestMetricSummary(userId: string) {
  const metrics = await getSocialMetrics(userId);
  const latest = metrics[0];

  return {
    posts: latest?.posts ?? 0,
    comments: latest?.comments ?? 0,
    likes: latest?.likes ?? 0,
    followers: latest?.followers ?? 0,
  };
}
