// /lib/ingestion/platforms/youtube.ts
import { ActivityMetrics } from "../normalize";

export async function fetchYouTubeMetrics(args: {
  accessToken?: string;
  channelId?: string | null;
}) {
  if (!args.accessToken) {
    throw new Error("Missing YouTube access token");
  }

  // We still call the API so the token stays valid and the user stays authenticated
  const res = await fetch(
    "https://youtube.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error("YouTube API error");
  }

  // We fetch the data but ignore it, since you're not using profile metrics anymore
  await res.json();

  const metrics: ActivityMetrics = {
    commentsToday: 0,
    commentsWeek: 0,
    commentsMonth: 0,
    posts: 0,
  };

  return metrics;
}