// app/dashboard/connect/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import ConnectPageClient from "./ConnectPageClient";
import type { SocialLink } from "./types";

export default async function ConnectPage() {
  const supabase = await createSupabaseServerClient();

  // 1) Require authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2) Fetch saved socials from DB
  const { data: socials } = await supabase
    .from("user_socials")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index", { ascending: true });

  const initialSocials: SocialLink[] = (socials ?? []).map((s, idx) => ({
  id: s.id,
  handle: s.handle ?? "",
  enabled: s.enabled ?? true,
  platform: (s.platform as SocialLink["platform"]) ?? "unknown",

  followers: typeof s.followers === "number" ? s.followers : 0,
  comments: typeof s.comments === "number" ? s.comments : 0,

  linktree: s.linktree ?? false,
  order_index: typeof s.order_index === "number" ? s.order_index : idx,

  created_at: s.created_at ?? null,
  user_id: s.user_id ?? null,
}));



  // 4) Optionally, compute cumulative followers/comments for Linktree rows
  const socialsWithTotals = initialSocials.map((s) => {
    if (!s.linktree) return s;

    const totals = initialSocials.reduce(
      (acc, x) => {
        // Only include non-Linktree socials
        if (!x.linktree) {
          acc.followers += x.followers ?? 0;
          acc.comments += x.comments ?? 0;
        }
        return acc;
      },
      { followers: 0, comments: 0 }
    );

    return { ...s, followers: totals.followers, comments: totals.comments };
  });

  return <ConnectPageClient initialSocials={socialsWithTotals} userId={user.id} />;
}
