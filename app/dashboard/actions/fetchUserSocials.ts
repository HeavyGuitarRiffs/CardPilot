// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";

export async function fetchUserSocials(userId: string) {
  const supabase = createClient();

  // 1. Fetch connected accounts
  const { data: accounts, error: accErr } = await supabase
    .from("user_socials")
    .select("id, platform, handle")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (accErr || !accounts) return [];
  if (accounts.length === 0) return [];

  const accountIds = accounts.map((a) => a.id);

  // 2. Fetch raw daily stats
  const { data: analytics, error: analyticsErr } = await supabase
    .from("social_metrics_daily_v2")
    .select("account_id, date, comments, posts")
    .eq("user_id", userId)
    .in("account_id", accountIds);

  if (analyticsErr || !analytics) return [];

  // 3. Build lookup table
  const grouped: Record<
    string,
    {
      commentsToday: number;
      commentsWeek: number;
      commentsMonth: number;
      posts: number;
    }
  > = {};

  for (const acc of accounts) {
    grouped[acc.id] = {
      commentsToday: 0,
      commentsWeek: 0,
      commentsMonth: 0,
      posts: 0,
    };
  }

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 7);

  const startOfMonth = new Date(today);
  startOfMonth.setDate(today.getDate() - 30);

  // 4. Aggregate metrics
  for (const row of analytics) {
    const id = row.account_id;
    if (!id || !grouped[id]) continue;

    const rowDate = new Date(row.date);

    if (rowDate.toDateString() === today.toDateString()) {
      grouped[id].commentsToday += row.comments ?? 0;
    }

    if (rowDate >= startOfWeek) {
      grouped[id].commentsWeek += row.comments ?? 0;
    }

    if (rowDate >= startOfMonth) {
      grouped[id].commentsMonth += row.comments ?? 0;
    }

    grouped[id].posts += row.posts ?? 0;
  }

  // 5. Convert to SocialAnalytics[]
  return accounts.map((acc) => {
    const g = grouped[acc.id];

    const totalComments =
      g.commentsToday + g.commentsWeek + g.commentsMonth;

    return {
      id: acc.id,
      platform: acc.platform,
      handle: acc.handle,

      // Placeholder values until you ingest these metrics
      followers: 0,
      likes: 0,

      // Derived from your daily aggregation
      comments: totalComments,
      posts: g.posts,

      // Placeholder momentum (you can compute real momentum later)
      momentum: 0,
    };
  });
}