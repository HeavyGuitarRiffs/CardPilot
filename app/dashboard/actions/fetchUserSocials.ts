// app/dashboard/actions/fetchUserSocials.ts
// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { SocialMetric } from "@/app/dashboard/types/social";

export async function fetchUserSocials(userId: string): Promise<SocialMetric[]> {
  const supabase = createClient();

  // -------------------- 1️⃣ Fetch all socials for this user --------------------
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

  // -------------------- 2️⃣ Map table rows to SocialMetric --------------------
  const results: SocialMetric[] = accounts.map((acc) => ({
    id: acc.id,
    platform: acc.platform ?? "unknown", // ✅ fallback for nullable
    handle: acc.handle ?? "",
    followers: acc.followers ?? 0,
    comments: acc.comments ?? 0,
    weeklyGrowthPct: 0, // temporary placeholder
    linktree: acc.linktree ?? false,
    order_index: acc.order_index ?? 0,
    created_at: acc.created_at ?? null,

    // Optional dashboard fields
    likes: null,
    posts: null,
    postsDelta: null,
    commentsDelta: null,
    followersDelta: null,
    momentum: null,
    engagement_change: null,
    engagementChange: null,
  }));

  return results;
}