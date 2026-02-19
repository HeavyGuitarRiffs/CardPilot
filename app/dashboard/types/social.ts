// app/dashboard/types/social.ts
import type { Database } from "@/supabase/types";

/**
 * SocialMetric
 * Represents a social account with latest metrics.
 * Columns are now mapped to actual table fields.
 */
export type SocialMetric = {
  platform: Database["public"]["Tables"]["social_metrics_daily"]["Row"]["platform"];
  handle: string; // from social_accounts.handle
  followers: number; // either add followers to table or map from another field
  commentsDelta: Database["public"]["Tables"]["social_metrics_daily"]["Row"]["comments_count"];
  weeklyGrowthPct: number;
};
