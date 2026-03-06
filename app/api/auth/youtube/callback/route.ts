// app/api/auth/youtube/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/dashboard?error=missing_code");
  }

  // 1. Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokenJson = await tokenRes.json();

  if (!tokenJson.access_token) {
    return NextResponse.redirect("/dashboard?error=token_exchange_failed");
  }

  const accessToken = tokenJson.access_token;
  const refreshToken = tokenJson.refresh_token;
  const expiresIn = tokenJson.expires_in;
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  // 2. Fetch YouTube channel info
  const channelRes = await fetch(
    "https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const channelJson = await channelRes.json();
  const channel = channelJson.items?.[0];

  if (!channel) {
    return NextResponse.redirect("/dashboard?error=no_channel_found");
  }

  const handle =
    channel.snippet?.customUrl ||
    channel.snippet?.title ||
    "youtube";

  // 3. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/dashboard?error=no_user");
  }

  // 4. Insert into user_socials
  await supabase.from("user_socials").insert({
    user_id: user.id,
    platform: "youtube",
    handle,
    oauth: {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    },
  });

  // 5. Redirect back to dashboard
  return NextResponse.redirect("/dashboard?connected=youtube");
}