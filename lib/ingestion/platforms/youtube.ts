// /lib/ingestion/platforms/youtube.ts
import { normalizeYouTubeMetrics } from "../normalize";

export async function fetchYouTubeMetrics(args: {
  accessToken: string;
  channelId?: string | null;
}) {
  const res = await fetch(
    "https://youtube.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    }
  );

  if (!res.ok) throw new Error("YouTube API error");

  const data = await res.json();
  return normalizeYouTubeMetrics(data);
}