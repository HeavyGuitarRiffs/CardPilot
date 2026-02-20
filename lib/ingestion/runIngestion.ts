import { ingestionRegistry, PlatformKey } from "./registry";
import { refreshTokenIfNeeded } from "./oauth";
import { saveMetrics } from "./saveMetrics";
import { createClient } from "@supabase/supabase-js";
import { NormalizedMetrics } from "./normalize";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ConnectedSocial = {
  id: string;
  user_id: string;
  platform: PlatformKey;
  access_token: string;
  refresh_token: string | null;
  expires_at: number | null;

  // Platform-specific fields from your DB
  channelId?: string | null;      // YouTube
  igBusinessId?: string | null;   // Instagram
};

export async function runIngestion() {
  const { data: socials, error } = await supabase
    .from("connected_socials")
    .select("*")
    .returns<ConnectedSocial[]>();

  if (error) throw error;
  if (!socials || socials.length === 0) return;

  for (const social of socials) {
    try {
      const { platform, access_token, refresh_token, expires_at } = social;

      const { accessToken: validAccessToken, updatedTokens } =
        await refreshTokenIfNeeded({
          platform,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at ? String(expires_at) : null, // 🔥 FIXED
          socialId: social.id,
        });

      // 🔥 FIXED — platform is now PlatformKey, registry keys match
    const ingestionFn = ingestionRegistry[platform] as (
  args: unknown
) => Promise<unknown>;

const metrics = (await ingestionFn({
  accessToken: validAccessToken,

  ...(platform === "youtube" && social.channelId
    ? { channelId: social.channelId }
    : {}),

  ...(platform === "instagram" && social.igBusinessId
    ? { igBusinessId: social.igBusinessId }
    : {}),
})) as NormalizedMetrics;

      await saveMetrics({
        userId: social.user_id,
        socialId: social.id,
        platform,
        metrics,
      });

      if (updatedTokens) {
        await supabase
          .from("connected_socials")
          .update(updatedTokens)
          .eq("id", social.id);
      }
    } catch (err) {
      console.error("Ingestion error for social", social.id, err);
    }
  }
}