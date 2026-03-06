// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { UnifiedSocialMetric } from "@/app/dashboard/types";

export async function fetchUserSocials(
  userId: string
): Promise<UnifiedSocialMetric[]> {
  const supabase = createClient();

  // 1. Fetch connected accounts
  const { data: accounts, error: accErr } = await supabase
    .from("user_socials")
    .select("id, platform, handle, followers")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (accErr || !accounts) return [];
  if (accounts.length === 0) return [];

  const accountIds = accounts.map((a) => a.id);

  // 2. Fetch 30 days of analytics from V2 table
  const start30 = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);

  const { data: analytics, error: analyticsErr } = await supabase
    .from("social_metrics_daily_v2")
    .select("account_id, date, posts, comments, likes, followers")
    .eq("user_id", userId)
    .in("account_id", accountIds)
    .gte("date", start30);

  if (analyticsErr || !analytics) return [];

  // 3. Aggregate analytics
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);

  const grouped: Record<
    string,
    {
      today: number;
      week: number;
      month: number;
      posts: number;
      likes: number;
      followers: number;
    }
  > = {};

  // Initialize buckets
  for (const acc of accounts) {
    grouped[acc.id] = {
      today: 0,
      week: 0,
      month: 0,
      posts: 0,
      likes: 0,
      followers: acc.followers ?? 0, // fallback to stored followers
    };
  }

  // Process analytics rows
  for (const row of analytics) {
    const id = row.account_id;
    if (!id) continue;              // FIX 1: skip null account_id
    if (!grouped[id]) continue;     // FIX 2: safe indexing

    const date = row.date;

    // Comments
    if (date === today) grouped[id].today += row.comments ?? 0;
    if (date >= weekStart) grouped[id].week += row.comments ?? 0;
    grouped[id].month += row.comments ?? 0;

    // Posts
    grouped[id].posts += row.posts ?? 0;

    // Likes
    grouped[id].likes += row.likes ?? 0;

    // Followers (latest)
    grouped[id].followers = row.followers ?? grouped[id].followers;
  }

  // 4. Build UnifiedSocialMetric[]
  return accounts.map((acc) => {
    const g = grouped[acc.id];

    return {
      id: acc.id,
      platform: acc.platform ?? "",
      handle: acc.handle ?? "",

      followers: g.followers,

      comments: g.month,
      commentsToday: g.today,
      commentsWeek: g.week,
      commentsMonth: g.month,
      commentsLastWeek: 0,

      likes: g.likes,
      likesToday: 0,
      likesDelta: 0,

      posts: g.posts,

      momentum: 0,
      engagementChange: 0,

      oauth: undefined,
    };
  });
}