// /lib/ingestion/oauth.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RefreshArgs = {
  platform: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  socialId: string;
};

export async function refreshTokenIfNeeded(args: RefreshArgs) {
  const now = Date.now();
  const expiresAtMs = args.expiresAt ? new Date(args.expiresAt).getTime() : 0;

  // if token valid for > 5 minutes, just use it
  if (args.accessToken && expiresAtMs - now > 5 * 60 * 1000) {
    return { accessToken: args.accessToken, updatedTokens: null };
  }

  if (!args.refreshToken) {
    // no refresh token, nothing we can do
    return { accessToken: args.accessToken, updatedTokens: null };
  }

  if (args.platform === "youtube" || args.platform === "instagram") {
    const tokenEndpoint = "https://oauth2.googleapis.com/token"; // or FB token endpoint for IG

    // Example for Google-style refresh; adjust per platform
    const res = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: args.refreshToken,
      }),
    });

    if (!res.ok) {
      console.error("Failed to refresh token", await res.text());
      return { accessToken: args.accessToken, updatedTokens: null };
    }

    const data = await res.json();

    const newAccessToken = data.access_token as string;
    const expiresIn = data.expires_in as number;
    const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const updatedTokens = {
      access_token: newAccessToken,
      expires_at: newExpiresAt,
      // refresh_token: data.refresh_token ?? args.refreshToken, // if rotated
    };

    return { accessToken: newAccessToken, updatedTokens };
  }

  // default: no refresh logic
  return { accessToken: args.accessToken, updatedTokens: null };
}