//app\dashboard\connect\actions.ts
// "use server";

import { createClient } from "@/utils/supabase/server";

export async function saveGoals(goals: string[]) {
  const supabase = await createClient();

  // 1. Get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    throw new Error("Not authenticated");
  }

  // 2. Normalize + dedupe goals
  const uniqueGoals = [...new Set(goals.map((g) => g.trim()))];

  if (uniqueGoals.length === 0) {
    return { success: true, goals: [] };
  }

  // 3. Insert and RETURN rows (critical fix)
  const { data, error } = await supabase
    .from("user_goals")
    .insert(
      uniqueGoals.map((g) => ({
        goal: g,
        user_id: user.id,
      }))
    )
    .select("*"); // ← REQUIRED so UI doesn't crash

  if (error) {
    console.error("Failed to save goals:", error);
    throw new Error("Failed to save goals");
  }

  return {
    success: true,
    goals: data ?? [],
  };
}