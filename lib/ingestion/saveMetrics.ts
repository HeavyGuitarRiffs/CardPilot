// /lib/ingestion/saveMetrics.ts
import { createClient } from "@supabase/supabase-js";
import type { NormalizedMetrics } from "./normalize";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SaveArgs = {
  userId: string;
  socialId: string;
  platform: string;
  metrics: NormalizedMetrics;
};

export async function saveMetrics(args: SaveArgs) {
  const { userId, socialId, platform, metrics } = args;

  const { error: dailyError } = await supabase.from("social_daily_stats").upsert(
    {
      user_id: userId,
      social_id: socialId,
      platform,
      date: metrics.date,
      followers: metrics.followers ?? null,
      views: metrics.views ?? null,
      likes: metrics.likes ?? null,
      comments: metrics.comments ?? null,
      shares: metrics.shares ?? null,
      impressions: metrics.impressions ?? null,
      engagement_rate: metrics.engagementRate ?? null,
    },
    {
      onConflict: "user_id,social_id,platform,date",
    }
  );

  if (dailyError) {
    console.error("Error saving daily stats", dailyError);
  }
}