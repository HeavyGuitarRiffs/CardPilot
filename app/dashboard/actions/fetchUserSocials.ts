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
    likesDelta: 0, // number, not null

    // Optional-ish dashboard fields (but typed as numbers)
    likes: 0,
    posts: 0,
    postsDelta: 0,
    commentsDelta: 0,
    followersDelta: 0,
    momentum: 0, // <- fix: must be number, not null

    // Your type currently expects both
    engagement_change: 0,
    engagementChange: 0,
  }));

  return results;
}