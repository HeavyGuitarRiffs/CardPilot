// lib/auth.ts

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

// We define our own minimal cookie interface.
// This avoids importing removed Next.js types.
interface MinimalCookieStore {
  get(name: string): { value: string } | undefined;
  // These only exist in Server Actions / Route Handlers.
  // We mark them optional so TypeScript is happy.
  set?: (name: string, value: string, options?: CookieOptions) => void;
  delete?: (name: string, options?: CookieOptions) => void;
}

interface CookieAdapter {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: CookieOptions): void;
  remove(name: string, options?: CookieOptions): void;
}

function createCookieAdapter(store: MinimalCookieStore): CookieAdapter {
  return {
    get(name) {
      return store.get(name)?.value;
    },

    set(name, value, options) {
      // Only works in Server Actions / Route Handlers
      if (store.set) {
        store.set(name, value, options);
      }
    },

    remove(name, options) {
      if (store.delete) {
        store.delete(name, options);
      }
    }
  };
}

export function createSupabaseServer() {
  // Cast to our minimal interface — fully typed, no `any`
  const store = cookies() as unknown as MinimalCookieStore;
  const adapter = createCookieAdapter(store);

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: adapter }
  );
}

export async function getUser() {
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}