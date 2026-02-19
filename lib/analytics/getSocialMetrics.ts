import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/supabase/types";

const supabase = createClient();

/**
 * Raw row returned from Supabase for follower chart query
 */
type SocialMetricFollowerRow =
  Database["public"]["Tables"]["social_metrics_daily_v2"]["Row"] & {
    social_accounts: {
      platform: string;
    } | null;
  };

/**
 * Clean type used by the frontend chart
 */
export type SocialFollowerPoint = {
  date: string;
  followers: number;
  platform: string;
};

/**
 * Fetch follower history for charts
 */
export async function getFollowerHistory(
  userId: string
): Promise<SocialFollowerPoint[]> {
  const { data, error } = await supabase
    .from("social_metrics_daily_v2")
    .select(`
      date,
      followers,
      social_accounts (
        platform
      )
    `)
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching follower history:", error);
    return [];
  }

  const rows = (data ?? []) as SocialMetricFollowerRow[];

  return rows.map((row) => ({
    date: row.date,
    followers: row.followers ?? 0,
    platform: row.social_accounts?.platform ?? "unknown",
  }));
}

/**
 * FULL metrics row for dashboard cards
 */
export type SocialMetricsV2 = {
  account_id: string;
  date: string;
  posts: number;
  comments: number;
  likes: number;
  followers: number;
};

/**
 * Fetch all metrics (latest first)
 */
export async function getSocialMetrics(
  userId: string
): Promise<SocialMetricsV2[]> {
  const { data, error } = await supabase
    .from("social_metrics_daily_v2")
    .select("account_id, date, posts, comments, likes, followers")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching social metrics:", error);
    return [];
  }

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
 * Dashboard summary (latest row)
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
