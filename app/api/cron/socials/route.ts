// app/api/cron/socials/youtube/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { sync as youtubeSync } from "@/lib/socials/youtube/sync";
import { hydrateAccount } from "@/lib/socials/hydrateAccount";

type DailyMetricRow = {
  user_id: string;
  platform: string;
  date: string;
  comments_count: number;
  posts_count: number;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();

  // 1. Load ALL YouTube accounts
  const { data: accounts, error } = await supabase
    .from("user_socials")
    .select("*")
    .eq("platform", "youtube");

  if (error || !accounts) {
    console.error("YouTube cron error:", error);
    return NextResponse.json(
      { error: "Failed to load accounts" },
      { status: 500 }
    );
  }

  const rowsToInsert: DailyMetricRow[] = [];

  // 2. Batch sync each account
  for (const acc of accounts) {
    const hydrated = hydrateAccount({
      ...acc,
      platform: acc.platform ?? "youtube",
    });

    const raw = await youtubeSync(hydrated, supabase);

    rowsToInsert.push({
      user_id: acc.user_id,
      platform: "youtube",
      date: new Date().toISOString().slice(0, 10),
      comments_count: raw.comments ?? 0,
      posts_count: raw.posts ?? 0,
    });
  }

  // 3. Batch write analytics
  if (rowsToInsert.length > 0) {
    await supabase
      .from("social_metrics_daily")
      .upsert(rowsToInsert, { onConflict: "user_id,platform,date" });
  }

  return NextResponse.json({ success: true, count: rowsToInsert.length });
}