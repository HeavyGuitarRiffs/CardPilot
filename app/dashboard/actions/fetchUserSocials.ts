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
    // 2️⃣ Get latest metrics
    const { data: latest } = await supabase
      .from("social_metrics_daily")
      .select("comments_count, posts_count, likes_count, date")
      .eq("account_id", acc.id)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    // 3️⃣ Get metrics from 7 days ago
    const { data: weekAgo } = await supabase
      .from("social_metrics_daily")
      .select("comments_count, posts_count, likes_count, date")
      .eq("account_id", acc.id)
      .lte("date", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("date", { ascending: false })
      .limit(1)
      .single();

    // 4️⃣ Compute weekly growth (on posts_count as a proxy for followers if followers not tracked)
    const growth =
      latest && weekAgo && weekAgo.posts_count
        ? ((latest.posts_count - weekAgo.posts_count) / weekAgo.posts_count) * 100
        : 0;

    results.push({
      platform: acc.platform as SocialMetric["platform"], // cast if you have SocialPlatform enum
      handle: acc.handle,
      followers: latest?.posts_count ?? 0, // using posts_count as fallback
      commentsDelta: latest?.comments_count ?? 0,
      weeklyGrowthPct: Number(growth.toFixed(1)),
    });
  }

  return results;
}
