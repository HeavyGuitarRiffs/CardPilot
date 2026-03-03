// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { SocialMetric } from "@/app/dashboard/types";
import { SOCIAL_AUTH_TYPE } from "@/lib/socials";

export async function fetchUserSocials(userId: string): Promise<SocialMetric[]> {
  const supabase = createClient();

  // 1️⃣ Fetch socials for this user
  const { data: accounts, error } = await supabase
    .from("user_socials")
    .select(
      `id, platform, handle, followers, comments, linktree, order_index, created_at`
    )
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (error || !accounts) {
    console.error("fetchUserSocials error:", error);
    return [];
  }

  // 2️⃣ Map DB rows → SocialMetric
  const results: SocialMetric[] = accounts.map((acc) => ({
    id: acc.id,
    platform: acc.platform ?? "unknown",
    handle: acc.handle ?? "",
    followers: acc.followers ?? 0,
    comments: acc.comments ?? 0,
    weeklyGrowthPct: 0,
    linktree: acc.linktree ?? false,
    order_index: acc.order_index ?? 0,
    created_at: acc.created_at ?? null,

    // Required fields
    oauth: SOCIAL_AUTH_TYPE[acc.platform?.toLowerCase() ?? ""] === "oauth",
    likesDelta: 0,

    // Core metrics
    likes: 0,
    posts: 0,
    postsDelta: 0,
    commentsDelta: 0,
    followersDelta: 0,
    momentum: 0,

    // Engagement fields
    engagement_change: 0,
    engagementChange: 0,

    // Dashboard-only fields (required by your type)
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    commentsLastWeek: 0,

    streak: 0,
    conversionPages: 0,
  }));

  return results;
}