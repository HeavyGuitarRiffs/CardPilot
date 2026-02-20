// app/dashboard/types/social.ts
import type { Database } from "@/supabase/types";

/**
 * SocialMetric
 * Unified type for all social analytics across Dashboard Page 1 & Page 2.
 * Fully compatible with Supabase return values.
 */

export interface SocialMetric {
  id: string;                     // Required for React keys
  platform: string;               // "instagram", "tiktok", etc.
  handle: string;                 // "@username" or URL

  // Core metrics
  followers: number;              // latest.posts_count
  comments: number;               // latest.comments_count
  likes?: number | null;          // latest.likes_count

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

  created_at?: string | null;
}