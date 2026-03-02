// app/api/socials/sync-all/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { SOCIAL_SYNC_MAP, SOCIAL_AUTH_TYPE } from "@/lib/socials";
import { oauthNormalize } from "@/lib/normalize/oauthNormalize";
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

  const { data: accounts, error: accountsError } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId);

  if (accountsError || !accounts?.length) {
    return NextResponse.json({ error: "No connected socials" }, { status: 404 });
  }

  // 🚀 Run all syncs in parallel
  const results = await Promise.all(
    accounts.map(async (account) => {
      const platform = account.platform;
      const loadSync = SOCIAL_SYNC_MAP[platform];

      if (!loadSync) {
        return { platform, error: "No sync function found" };
      }

      try {
        const syncFn = await loadSync();
        const raw = await syncFn(account, supabase);

        const normalized =
          SOCIAL_AUTH_TYPE[platform] === "oauth"
            ? oauthNormalize({ ...raw, platform, handle: account.handle })
            : publicNormalize({ ...raw, platform, handle: account.handle });

        await supabase.from("social_profiles").upsert({
          user_id: userId,
          platform,
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

        return { platform, success: true, data: normalized };
      } catch (err) {
        return {
          platform,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    })
  );

  return NextResponse.json({ results });
}