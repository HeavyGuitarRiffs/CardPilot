import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  await supabase
    .from("user_socials")
    .upsert(
      {
        user_id: user.id,
        platform: "producthunt",
        handle: "n/a",
        enabled: true,
      },
      { onConflict: "user_id,platform" }
    );

  return NextResponse.redirect("/dashboard/connect");
}