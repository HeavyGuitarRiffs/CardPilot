// lib/data/socials.ts
import { createClient } from "@/lib/supabase/client";
import type { UnifiedSocialMetric } from "@/app/dashboard/types";
import createEmptySocialMetric from "@/lib/normalize/createEmptySocialMetric";

export async function fetchUserSocials(
  userId: string
): Promise<UnifiedSocialMetric[]> {
  const supabase = createClient();

  // Fetch connected accounts
  const { data: accounts, error } = await supabase
    .from("social_accounts")
    .select("id, platform, handle")
    .eq("user_id", userId);

  if (error || !accounts) return [];

  const results: UnifiedSocialMetric[] = [];

  for (const acc of accounts) {
    // Latest metric
    const { data: latest } = await supabase
      .from("social_metrics_daily")
      .select("posts_count, comments_count, likes_count, date")
      .eq("account_id", acc.id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Metric from ~7 days ago
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

    // Followers proxy (temporary)
    const latestFollowers = latest?.posts_count ?? 0;
    const weekAgoFollowers = weekAgo?.posts_count ?? 0;

    let growth = 0;
    if (weekAgoFollowers > 0) {
      growth =
        ((latestFollowers - weekAgoFollowers) / weekAgoFollowers) * 100;
    }

    // Start from a complete UnifiedSocialMetric baseline
    const base = createEmptySocialMetric();

    results.push({
      ...base,

      id: acc.id,
      platform: acc.platform,
      handle: acc.handle,

      followers: latestFollowers,

      comments: latest?.comments_count ?? 0,
      commentsToday: 0,
      commentsWeek: 0,
      commentsMonth: 0,
      commentsLastWeek:
        (latest?.comments_count ?? 0) - (weekAgo?.comments_count ?? 0),

      likes: latest?.likes_count ?? 0,
      likesToday: 0,
      likesDelta:
        (latest?.likes_count ?? 0) - (weekAgo?.likes_count ?? 0),

      posts: latest?.posts_count ?? 0,

      momentum: Number(growth.toFixed(1)),
      engagementChange: Number(growth.toFixed(1)),

      oauth: undefined,
    });
  }

  return results;
}