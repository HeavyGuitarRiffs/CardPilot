import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";
import { emptySyncResult } from "../socialIndex";

const X_API_BASE = "https://api.twitter.com/2";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    const token = account.access_token;
    if (!token) {
      return emptySyncResult("twitter", "Missing X access token");
    }

    // -----------------------------
    // 1. Fetch user info (followers)
    // -----------------------------
    const userRes = await fetch(
      `${X_API_BASE}/users/${account.provider_account_id}?user.fields=public_metrics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!userRes.ok) {
      const err = await userRes.text();
      return emptySyncResult("twitter", err);
    }

    const userJson = await userRes.json();
    const followers =
      userJson?.data?.public_metrics?.followers_count ?? null;

    // -----------------------------
    // 2. Fetch recent tweets
    // -----------------------------
    const tweetsRes = await fetch(
      `${X_API_BASE}/users/${account.provider_account_id}/tweets?max_results=100&tweet.fields=public_metrics,created_at`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!tweetsRes.ok) {
      const err = await tweetsRes.text();
      return emptySyncResult("twitter", err);
    }

    const tweetsJson = await tweetsRes.json();
    const tweets = tweetsJson?.data ?? [];

    // -----------------------------
    // 3. Compute impressions (90 days)
    // -----------------------------
    const now = new Date();
    const windowStart = new Date(now);
    windowStart.setDate(now.getDate() - 90);

    let impressions90d = 0;

    for (const t of tweets) {
      const created = new Date(t.created_at);
      if (created >= windowStart) {
        impressions90d += t.public_metrics?.impression_count ?? 0;
      }
    }

    // -----------------------------
    // 4. Load previous metrics (snake_case)
    // -----------------------------
    const { data: prev } = await supabase
      .from("social_profiles")
      .select("*")
      .eq("platform", "twitter")
      .eq("user_id", account.user_id)
      .single();

    const prevLikes = prev?.likes ?? 0;
    const prevWeek = prev?.commentsweek ?? 1;

    // -----------------------------
    // 5. Compute deltas + momentum
    // -----------------------------
    const likes = 0;
    const likesToday = 0;
    const likesDelta = likes - prevLikes;

    const commentsWeek = 0;
    const momentum = Math.round((commentsWeek / prevWeek) * 100 - 100);

    const engagementChange = likesDelta;

    // -----------------------------
    // 6. Return normalized metrics
    // -----------------------------
    return {
      platform: "twitter",
      updated: true,

      followers,

      comments: 0,
      commentsToday: 0,
      commentsWeek: 0,
      commentsMonth: 0,
      commentsLastWeek: prevWeek,

      likes,
      likesToday,
      likesDelta,

      momentum,
      engagement_change: engagementChange,
      engagementChange,

      posts: tweets.length,
      metrics: true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return emptySyncResult("twitter", message);
  }
}