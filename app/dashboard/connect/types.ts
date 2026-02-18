//app\dashboard\connect\types.ts

export type SocialLink = {
  id: string;
  handle: string;
  enabled: boolean;
  linktree?: boolean;
  platform?: "twitter" | "instagram" | "tiktok" | "youtube" | "linktree" | "unknown";
  followers?: number; // NEW — safe, optional, no schema change
};

export type UpdateSocialFn = <K extends keyof SocialLink>(
  id: string,
  key: K,
  value: SocialLink[K]
) => void;