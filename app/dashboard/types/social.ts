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

  // Core metrics (nullable because Supabase may return null)
  followers: number | null;
  comments: number | null;
  likes?: number | null;

  // Delta metrics (optional)
  followersDelta?: number | null;
  commentsDelta?: number | null;
  likesDelta?: number | null;

  // Momentum / engagement fields (optional)
  momentum?: number | null;
  engagement_change?: number | null;
  engagementChange?: number | null;

  // Optional future fields
  posts?: number | null;
  postsDelta?: number | null;

  created_at?: string | null;
}