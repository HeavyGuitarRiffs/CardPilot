// app/dashboard/actions/fetchUserSocials.ts
import { createClient } from "@/lib/supabase/client";
import type { UserSocial } from "@/app/dashboard/types";

export async function fetchUserSocials(userId: string): Promise<UserSocial[]> {
  const supabase = createClient();

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

  const results: UserSocial[] = accounts.map((acc) => ({
    id: acc.id,
    platform: acc.platform ?? "unknown",
    handle: acc.handle ?? "",
    followers: acc.followers ?? 0,
    comments: acc.comments ?? 0,
    linktree: acc.linktree ?? false,
    order_index: acc.order_index ?? 0,
    created_at: acc.created_at ?? null,
  }));

  return results;
}