// app/api/socials/events/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const { platform, user_id, type, delta } = body;

  if (!platform || !user_id || !type || typeof delta !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const fields =
    type === "comment"
      ? ["comments", "commentsToday", "commentsWeek", "commentsMonth"]
      : ["likes", "likesToday", "likesDelta"];

  for (const field of fields) {
    const { error } = await supabase.rpc("increment_field", {
      table_name: "social_profiles",
      user_id,
      platform,
      field_name: field,
      amount: delta,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}