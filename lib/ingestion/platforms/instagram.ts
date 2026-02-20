// /lib/ingestion/platforms/instagram.ts
import { normalizeInstagramMetrics } from "../normalize";

export async function fetchInstagramMetrics(args: {
  accessToken: string;
  igBusinessId: string;
}) {
  const url = `https://graph.facebook.com/v19.0/${args.igBusinessId}/insights?metric=impressions,reach,profile_views,followers_count&period=day`;

  const res = await fetch(url + `&access_token=${args.accessToken}`);
  if (!res.ok) throw new Error("Instagram Graph API error");

  const data = await res.json();
  return normalizeInstagramMetrics(data);
}