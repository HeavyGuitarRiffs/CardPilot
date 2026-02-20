// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { SocialMetric } from "@/app/dashboard/types/social";

export async function fetchUserSocials(userId: string): Promise<SocialMetric[]> {
  const supabase = createClient();

  // 1️⃣ Get all social accounts for user
  const { data: accounts, error } = await supabase
    .from("social_accounts")
    .select("id, platform, handle")
    .eq("user_id", userId);

  if (error || !accounts) return [];

  const results: SocialMetric[] = [];

  for (const acc of accounts) {
    // 2️⃣ Latest metrics
    const { data: latest } = await supabase
      .from("social_metrics_daily")
      .select("comments_count, posts_count, likes_count, date")
      .eq("account_id", acc.id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3️⃣ Metrics from 7 days ago
    const { data: weekAgo } = await supabase
      .from("social_metrics_daily")
      .select("comments_count, posts_count, likes_count, date")
      .eq("account_id", acc.id)
      .lte("date", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 4️⃣ Weekly growth (using posts_count as follower proxy)
    const latestFollowers = latest?.posts_count ?? 0;
    const weekAgoFollowers = weekAgo?.posts_count ?? 0;

    const growth =
      weekAgoFollowers > 0
        ? ((latestFollowers - weekAgoFollowers) / weekAgoFollowers) * 100
        : 0;

    // 5️⃣ Push complete SocialMetric object (Option C)
    results.push({
      id: acc.id,
      platform: acc.platform,
      handle: acc.handle,

      // Core metrics
      followers: latestFollowers,
      comments: latest?.comments_count ?? 0,
      likes: latest?.likes_count ?? null,

      // Delta metrics
      commentsDelta: latest?.comments_count ?? 0,
      followersDelta: null,
      likesDelta: null,

      // Weekly growth
      weeklyGrowthPct: Number(growth.toFixed(1)),

      // Optional future fields
      posts: latest?.posts_count ?? null,
      postsDelta: null,
      momentum: null,
      engagement_change: null,
      engagementChange: null,

      created_at: latest?.date ?? null,
    });
  }

  return results;
}