// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { UnifiedSocialMetric } from "@/app/dashboard/types";

export async function fetchUserSocials(
  userId: string
): Promise<UnifiedSocialMetric[]> {
  const supabase = createClient();

  // -----------------------------
  // 1. Fetch connected accounts
  // -----------------------------
  const { data: accounts, error: accErr } = await supabase
    .from("user_socials")
    .select("id, platform, handle, followers")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (accErr || !accounts) {
    console.error("fetchUserSocials error:", accErr);
    return [];
  }

  if (accounts.length === 0) return [];

  const platforms = accounts.map((a) => a.platform ?? "");

  // -----------------------------
  // 2. Fetch analytics (30 days)
  // -----------------------------
  const start30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data: analytics, error: analyticsErr } = await supabase
    .from("social_metrics_daily")
    .select("platform, date, comments_count, posts_count")
    .eq("user_id", userId)
    .in("platform", platforms)
    .gte("date", start30);

  if (analyticsErr || !analytics) {
    console.error("fetchUserSocials analytics error:", analyticsErr);
    return [];
  }

  // -----------------------------
  // 3. Aggregate analytics
  // -----------------------------
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const grouped: Record<
    string,
    { today: number; week: number; month: number; posts: number }
  > = {};

  for (const p of platforms) {
    grouped[p] = { today: 0, week: 0, month: 0, posts: 0 };
  }

  for (const row of analytics) {
    const p = row.platform;
    if (!grouped[p]) continue;

    const date = row.date;

    if (date === today) grouped[p].today += row.comments_count ?? 0;
    if (date >= weekStart) grouped[p].week += row.comments_count ?? 0;

    grouped[p].month += row.comments_count ?? 0;
    grouped[p].posts += row.posts_count ?? 0;
  }

  // -----------------------------
  // 4. Build UnifiedSocialMetric[]
  // -----------------------------
  const results: UnifiedSocialMetric[] = accounts.map((acc) => {
    const p = acc.platform ?? "";
    const g = grouped[p] ?? { today: 0, week: 0, month: 0, posts: 0 };

    return {
      id: acc.id,
      platform: p,
      handle: acc.handle ?? "",

      followers: acc.followers ?? 0,

      comments: g.month, // total 30-day comments
      commentsToday: g.today,
      commentsWeek: g.week,
      commentsMonth: g.month,
      commentsLastWeek: 0, // placeholder until you add last-week data

      likes: 0, // placeholder (no likes in this table)
      likesToday: 0,
      likesDelta: 0,

      posts: g.posts,

      momentum: 0, // placeholder until you add real momentum
      engagementChange: 0,

      oauth: undefined,
    };
  });

  return results;
}