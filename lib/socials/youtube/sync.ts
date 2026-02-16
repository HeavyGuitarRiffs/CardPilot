import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import type { Account, SyncResult } from "../socialIndex";

export async function sync(
  account: Account,
  supabase: SupabaseClient<Database>
): Promise<SyncResult> {
  try {
    const posts: unknown[] = [];
    const metrics: Record<string, unknown> = {};

    return {
      platform: "youtube",
      updated: true,
      posts: posts.length,
      metrics: true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      platform: "youtube",
      updated: false,
      error: message,
    };
  }
}