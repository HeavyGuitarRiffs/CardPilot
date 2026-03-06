// /lib/ingestion/platforms/producthunt.ts
import { ActivityMetrics } from "../normalize";

export async function fetchProductHuntMetrics() {
  // TODO: Replace with real Product Hunt GraphQL fetcher
  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}