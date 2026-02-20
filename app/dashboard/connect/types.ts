// app/dashboard/connect/types.ts
export type SocialLink = {
  id: string;
  user_id?: string | null;

  handle: string;
  platform:
    | "twitter"
    | "instagram"
    | "tiktok"
    | "youtube"
    | "linktree"
    | "unknown";

  enabled: boolean;

  // Supabase often returns null → make nullable
  followers: number | null;
  comments: number | null;

  weeklyGrowthPct?: number | null;

  // Supabase boolean columns can be null unless default true/false
  linktree: boolean | null;

  // Sorting-safe
  order_index?: number | null;

  // Required but nullable
  created_at: string | null;
};