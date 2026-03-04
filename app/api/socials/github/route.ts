// app/api/socials/github/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sync as githubSync } from "@/lib/socials/github/sync";
import { oauthNormalize } from "@/lib/normalize/oauthNormalize";
import { hydrateAccount } from "@/lib/socials/hydrateAccount";

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Load GitHub account
  const { data: account, error: accountError } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", "github")
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      { error: "GitHub account not found" },
      { status: 404 }
    );
  }

  // Convert Supabase row → full Account type
  const hydrated = hydrateAccount(account);

  // Run sync
  const raw = await githubSync(hydrated, supabase);

  // Normalize
  const normalized = oauthNormalize({
    ...raw,
    platform: "github",
    handle: account.handle,
  });

  // Save normalized metrics
  await supabase.from("social_profiles").upsert({
    user_id: userId,
    platform: "github",
    handle: normalized.handle,

    followers: normalized.followers,
    comments: normalized.comments,
    likes: normalized.likes,
    likesDelta: normalized.likesDelta,
    momentum: normalized.momentum,
    engagement_change: normalized.engagement_change,
    engagementChange: normalized.engagementChange,

    oauth: normalized.oauth,
  });

  return NextResponse.json({ success: true, data: normalized });
}