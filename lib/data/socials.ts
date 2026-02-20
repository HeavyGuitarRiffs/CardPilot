// lib/data/socials.ts
import { createClient } from "@/lib/supabase/client";
import type { SocialMetric } from "@/app/dashboard/types/social";

/**
 * Fetch all social accounts and latest metrics for a given user.
 * Option 1: uses correct schema column names.
 */
export async function fetchUserSocials(userId: string): Promise<SocialMetric[]> {
  const supabase = createClient();

  // 🔹 Get user's social accounts
  const { data: accounts, error } = await supabase
    .from("social_accounts")
    .select("id, platform, handle") // only select columns we need
    .eq("user_id", userId);

  if (error || !accounts) return [];

  const results: SocialMetric[] = [];

  for (const acc of accounts) {
    // 🔹 latest metric
    const { data: latest } = await supabase
      .from("social_metrics_daily")
      .select("posts_count, comments_count, likes_count, date") // Option 1 schema
      .eq("account_id", acc.id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 🔹 metric from ~7 days ago
    const { data: weekAgo } = await supabase
      .from("social_metrics_daily")
      .select("posts_count, comments_count, likes_count, date")
      .eq("account_id", acc.id)
      .lte(
        "date",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 🔹 growth calculation (using posts_count as followers placeholder if needed)
    let growth = 0;
    const latestFollowers = latest?.posts_count ?? 0;
    const weekAgoFollowers = weekAgo?.posts_count ?? 0;

    if (weekAgoFollowers > 0) {
      growth = ((latestFollowers - weekAgoFollowers) / weekAgoFollowers) * 100;
    }

    results.push({
  id: acc.id,
  platform: acc.platform,
  handle: acc.handle,

  followers: latestFollowers,
  comments: latest?.comments_count ?? 0,

  commentsDelta: latest?.comments_count ?? 0,
  weeklyGrowthPct: Number(growth.toFixed(1)),
});
  }

  return results;
}
