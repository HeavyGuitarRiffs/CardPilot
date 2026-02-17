// app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import ProfilePageClient from "./ProfilePageClient";
import type { UserAvatar, SocialLink } from "./types";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  // 1) Require authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2) Fetch profile (user_avatars table)
  const { data: profile, error: profileError } = await supabase
    .from("user_avatars")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<UserAvatar>();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
  }

  // 3) Fetch socials
  const { data: savedSocials, error: socialsError } = await supabase
    .from("user_socials")
    .select("id, handle, enabled, linktree")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (socialsError?.message) {
    console.error("Socials fetch error:", socialsError);
  }

  const socials: SocialLink[] =
    savedSocials?.map((s) => ({
      id: s.id,
      handle: s.handle,
      enabled: s.enabled ?? false,
      linktree: s.linktree ?? false,
      metrics: { power_level: 0 },
    })) ?? [];

  // 4) Build initial profile object
  const initialProfile: UserAvatar = {
    display_name: profile?.display_name ?? "",
    bio: profile?.bio ?? "",
    country: profile?.country ?? "",
    avatar_url: profile?.avatar_url ?? null,
    social_archetype: profile?.social_archetype ?? null,
  };

  return (
    <ProfilePageClient
      initialProfile={initialProfile}
      initialSocials={socials}
      userId={user.id}
    />
  );
}