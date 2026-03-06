// app/api/auth/callback/youtube/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "https://cardpilot1.vercel.app/api/auth/callback/youtube",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  // TODO: Save tokens to DB for the logged‑in user
  // e.g. await saveYouTubeTokens(userId, tokens)

  return NextResponse.redirect("/dashboard?connected=youtube");
}