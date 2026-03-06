// /lib/ingestion/registry.ts

import { ActivityMetrics } from "./normalize";

import { fetchYouTubeMetrics } from "./platforms/youtube";
import { fetchInstagramMetrics } from "./platforms/instagram";
import { fetchRedditMetrics } from "./platforms/reddit";
import { fetchTwitterMetrics } from "./platforms/twitter";
import { fetchGitHubMetrics } from "./platforms/github";
import { fetchPatreonMetrics } from "./platforms/patreon";

import { fetchProductHuntMetrics } from "./platforms/producthunt";
import { fetchHackerNewsMetrics } from "./platforms/hackernews";

// All ingestion functions accept an object and return ActivityMetrics
export type IngestionFn = (args: object) => Promise<ActivityMetrics>;

export const ingestionRegistry = {
  youtube: fetchYouTubeMetrics,
  instagram: fetchInstagramMetrics,
  reddit: fetchRedditMetrics,
  twitter: fetchTwitterMetrics,
  github: fetchGitHubMetrics,
  patreon: fetchPatreonMetrics,

  producthunt: fetchProductHuntMetrics,
  hackernews: fetchHackerNewsMetrics,
} as const;

export type PlatformKey = keyof typeof ingestionRegistry;