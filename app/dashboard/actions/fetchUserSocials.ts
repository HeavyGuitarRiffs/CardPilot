// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";

export interface DashboardSocial {
  id: string;
  platform: string;
  handle: string;

  followers: number;
  linktree: boolean;
  order_index: number;
  created_at: string | null;

  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  posts: number;
}

export async function fetchUserSocials(userId: string): Promise<DashboardSocial[]> {
  const supabase = createClient();

  // -----------------------------
  // 1. Fetch all connected accounts
  // -----------------------------
  const { data: accounts, error: accErr } = await supabase
    .from("user_socials")
    .select("id, platform, handle, followers, linktree, order_index, created_at")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (accErr || !accounts) {
    console.error("fetchUserSocials error:", accErr);
    return [];
  }

  if (accounts.length === 0) return [];

  // Extract all platforms
  const platforms = accounts.map((a) => a.platform ?? "");

  // -----------------------------
  // 2. Fetch ALL analytics in ONE query
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
  // 3. Aggregate analytics in memory
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

    // Today
    if (date === today) {
      grouped[p].today += row.comments_count ?? 0;
    }

    // Last 7 days
    if (date >= weekStart) {
      grouped[p].week += row.comments_count ?? 0;
    }

    // Last 30 days
    grouped[p].month += row.comments_count ?? 0;

    // Posts (all-time)
    grouped[p].posts += row.posts_count ?? 0;
  }

  // -----------------------------
  // 4. Build final DashboardSocial[]
  // -----------------------------
  const results: DashboardSocial[] = accounts.map((acc) => {
    const p = acc.platform ?? "";
    const g = grouped[p] ?? { today: 0, week: 0, month: 0, posts: 0 };

    return {
      id: acc.id,
      platform: p,
      handle: acc.handle ?? "",
      followers: acc.followers ?? 0,
      linktree: acc.linktree ?? false,
      order_index: acc.order_index ?? 0,
      created_at: acc.created_at ?? null,

      commentsToday: g.today,
      commentsWeek: g.week,
      commentsMonth: g.month,
      posts: g.posts,
    };
  });

  return results;
}