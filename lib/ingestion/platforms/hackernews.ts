// /lib/ingestion/platforms/hackernews.ts
import { ActivityMetrics } from "../normalize";

export async function fetchHackerNewsMetrics() {
  // TODO: Replace with real HN API fetcher
  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}