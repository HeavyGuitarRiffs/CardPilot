// app/dashboard/connect/types.ts

export type SocialLink = {
  id: string;
  user_id?: string;

  handle: string;
  platform:
    | "twitter"
    | "instagram"
    | "tiktok"
    | "youtube"
    | "linktree"
    | "unknown";

  enabled: boolean;

  followers: number;       // total followers
  comments: number;        // total comments

  weeklyGrowthPct?: number; // optional analytics field

  linktree: boolean;
  order_index?: number;

  // required, but can be null for new/unsaved items
  created_at: string | null;
};

export type UpdateSocialFn = <K extends keyof SocialLink>(
  id: string,
  key: K,
  value: SocialLink[K]
) => void;