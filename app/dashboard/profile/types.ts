// app/dashboard/profile/types.ts

export type UserAvatar = {
  id?: string;
  user_id?: string;

  display_name?: string | null;
  bio?: string | null;
  country?: string | null;

  social_archetype?: string | null;

  avatar_url?: string | null;

  created_at?: string | null;
  is_active?: boolean | null;
  source?: string | null;
};

export type SocialMetrics = {
  power_level?: number | null;
};

export type SocialLink = {
  id?: string;
  user_id?: string;

  handle: string;
  enabled: boolean;
  linktree?: boolean;

  metrics?: SocialMetrics | null;
};
