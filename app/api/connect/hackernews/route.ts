import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users
  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Upsert the social record
  await supabase
    .from("user_socials")
    .upsert(
      {
        user_id: user.id,
        platform: "hackernews",
        handle: "n/a",
        enabled: true,
      },
      { onConflict: "user_id,platform" }
    );

  // Redirect to dashboard/connect (absolute URL required)
  return NextResponse.redirect(
    new URL("/dashboard/connect", request.url)
  );
}