// lib/data/socials.ts
import { createClient } from "@/lib/supabase/client";
import type { SocialMetric } from "@/app/dashboard/types";
import { createEmptySocialMetric } from "@/lib/normalize/createEmptySocialMetric";

export async function fetchUserSocials(userId: string): Promise<SocialMetric[]> {
  const supabase = createClient();

  const { data: accounts, error } = await supabase
    .from("social_accounts")
    .select("id, platform, handle")
    .eq("user_id", userId);

  if (error || !accounts) return [];

  const results: SocialMetric[] = [];

  for (const acc of accounts) {
    const { data: latest } = await supabase
      .from("social_metrics_daily")
      .select("posts_count, comments_count, likes_count, date")
      .eq("account_id", acc.id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

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

    const latestFollowers = latest?.posts_count ?? 0;
    const weekAgoFollowers = weekAgo?.posts_count ?? 0;

    let growth = 0;
    if (weekAgoFollowers > 0) {
      growth = ((latestFollowers - weekAgoFollowers) / weekAgoFollowers) * 100;
    }

    // 🔥 FIX: Start from a complete SocialMetric
    const base = createEmptySocialMetric();

    results.push({
      ...base,

      id: acc.id,
      platform: acc.platform,
      handle: acc.handle,

      followers: latestFollowers,
      comments: latest?.comments_count ?? 0,

      commentsDelta:
        (latest?.comments_count ?? 0) - (weekAgo?.comments_count ?? 0),

      weeklyGrowthPct: Number(growth.toFixed(1)),
    });
  }

  return results;
}