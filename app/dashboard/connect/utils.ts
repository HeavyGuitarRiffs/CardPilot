import { SocialLink } from "./types";

export function createEmptySocial(): SocialLink {
  return {
    id: crypto.randomUUID(),
    handle: "",
    platform: "unknown",
    enabled: true,
    followers: 0,
    comments: 0,
    weeklyGrowthPct: undefined,
    linktree: false,
    order_index: 0,
    created_at: null, // required by type
  };
}