// app/api/socials/patreon/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sync as patreonSync } from "@/lib/socials/patreon/sync";
import { oauthNormalize } from "@/lib/normalize/oauthNormalize";

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
    .eq("platform", "patreon")
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      { error: "Patreon account not found" },
      { status: 404 }
    );
  }

  // account.handle is the username
  const raw = await patreonSync(account, supabase);

  const normalized = oauthNormalize({
    ...raw,
    platform: "patreon",
    handle: account.handle,
  });

  // Your schema: social_profiles stores normalized metrics
  await supabase.from("social_profiles").upsert({
    user_id: userId,
    platform: "patreon",
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