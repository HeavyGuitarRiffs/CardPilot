// /lib/ingestion/saveMetrics.ts
import { createClient } from "@supabase/supabase-js";
import type { ActivityMetrics } from "./normalize";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SaveArgs = {
  userId: string;
  socialId: string;
  platform: string;
  metrics: ActivityMetrics;
};

export async function saveMetrics(args: SaveArgs) {
  const { userId, socialId, platform, metrics } = args;

  const { error } = await supabase.from("social_daily_stats").upsert(
    {
      user_id: userId,
      social_id: socialId,
      platform,
      // You may want to add a date here if needed:
      // date: new Date().toISOString().slice(0, 10),
      comments_today: metrics.commentsToday,
      comments_week: metrics.commentsWeek,
      comments_month: metrics.commentsMonth,
      posts: metrics.posts,
    },
    {
      onConflict: "user_id,social_id,platform,date",
    }
  );

  if (error) {
    console.error("Error saving daily stats", error);
  }
}