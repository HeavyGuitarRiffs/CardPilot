// /lib/ingestion/platforms/patreon.ts
import { ActivityMetrics } from "../normalize";

export async function fetchPatreonMetrics() {
  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}