// app/dashboard/types/social.ts
import type { Database } from "@/supabase/types";

/**
 * SocialMetric
 * Unified type for all social analytics across Dashboard Page 1 & Page 2.
 * Fully compatible with Supabase return values.
 */

export interface SocialMetric {
  id: string;
  platform: string;
  handle: string;

  // Core metrics
  followers: number;
  comments: number;
  likes?: number | null;

  // Delta metrics
  commentsDelta?: number | null;
  followersDelta?: number | null;
  likesDelta?: number | null;

  // Weekly growth
  weeklyGrowthPct?: number | null;

  // Optional future fields
  momentum?: number | null;
  engagement_change?: number | null;
  engagementChange?: number | null;

  posts?: number | null;
  postsDelta?: number | null;

  // -------------------- Add these --------------------
  commentsToday?: number | null;
  commentsWeek?: number | null;
  commentsMonth?: number | null;
  commentsLastWeek?: number | null;
  streak?: number | null;
  conversionPages?: number | null;

  created_at?: string | null;
}