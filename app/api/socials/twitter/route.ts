// app/api/socials/twitter/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sync as twitterSync } from "@/lib/socials/twitter/sync";
import { publicNormalize } from "@/lib/normalize/publicNormalize";
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

  // Load Twitter account
  const { data: account, error: accountError } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", "twitter")
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      { error: "Twitter account not found" },
      { status: 404 }
    );
  }

  // Convert Supabase row → full Account type
  const hydrated = hydrateAccount(account);

  // Run sync
  const raw = await twitterSync(hydrated, supabase);

  // Normalize (Twitter uses publicNormalize)
  const normalized = publicNormalize({
    ...raw,
    platform: "twitter",
    handle: account.handle,
  });

  // Save normalized metrics
  await supabase.from("social_profiles").upsert({
    user_id: userId,
    platform: "twitter",
    handle: normalized.handle,

    followers: normalized.followers,
    comments: normalized.comments,
    likes: normalized.likes,
    likesDelta: normalized.likesDelta,
    momentum: normalized.momentum,
    engagement_change: normalized.engagement_change,
    engagementChange: normalized.engagementChange,

    oauth: normalized.oauth ?? false,
  });

  return NextResponse.json({ success: true, data: normalized });
}