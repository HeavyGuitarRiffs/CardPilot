// app\dashboard\connect\types.ts

export type SocialLink = {
  id: string;
  user_id?: string; // optional for new entries
  handle: string;
  platform: "twitter" | "instagram" | "tiktok" | "youtube" | "linktree" | "unknown";
  enabled: boolean;
  followers: number;   // total followers
  comments: number;    // total comments
  linktree: boolean;
  order_index?: number; // for drag-and-drop ordering
  created_at?: string;
};


export type UpdateSocialFn = <K extends keyof SocialLink>(
  id: string,
  key: K,
  value: SocialLink[K]
) => void;
