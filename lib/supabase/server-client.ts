// lib/supabase/server-client.ts

import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // ⭐ Use the new, non-deprecated signature
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get() {
        return undefined;
      },
      set() {
        // no-op
      },
      remove() {
        // no-op
      },
    },
  });
}