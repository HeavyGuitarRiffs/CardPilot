export type SocialLink = {
  id: string;
  handle: string;
  platform: string;
  enabled: boolean;          // ← required by createEmptySocial()
  followers: number;
  comments: number;
  weeklyGrowthPct?: number;  // ← optional, matches your usage
  linktree: boolean;
  order_index: number;
  created_at: string | null;
  user_id: string | null;
};