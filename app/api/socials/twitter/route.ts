// app/api/socials/twitter/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sync as twitterSync } from "@/lib/socials/twitter/sync";
import { publicNormalize } from "@/lib/normalize/publicNormalize";

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // Your real schema: social_accounts (platform + handle)
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

  // account.handle is the username
  const raw = await twitterSync(account, supabase);

  const normalized = publicNormalize({
    ...raw,
    platform: "twitter",
    handle: account.handle,
  });

  // Your schema: social_profiles stores normalized metrics
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
    oauth: normalized.oauth ?? false, // publicNormalize usually sets oauth=false
  });

  return NextResponse.json({ success: true, data: normalized });
}