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

  followers: number;      // total followers
  comments: number;       // total comments

  weeklyGrowthPct?: number; // <-- NEW FIELD (optional for now)

  linktree: boolean;
  order_index?: number;
  created_at?: string;
};


export type UpdateSocialFn = <K extends keyof SocialLink>(
  id: string,
  key: K,
  value: SocialLink[K]
) => void;
