// app/dashboard/profile/types.ts

export type UserAvatar = {
  id?: string;
  user_id?: string;

  display_name?: string | null;
  bio?: string | null;
  country?: string | null;

  // Added to support SocialArchetypeCard
  social_archetype?: string | null;

  // Avatar can be a URL or base64
  avatar_url?: string | null;

  created_at?: string | null;
  is_active?: boolean | null;
  source?: string | null;
};

export type SocialLink = {
  id?: string;
  handle: string;
  enabled: boolean;
  linktree?: boolean;

  metrics: {
    power_level: number;
  };
};