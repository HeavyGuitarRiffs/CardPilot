// /lib/queries.ts

import { supabase } from "./supabaseClient";
import { oauthNormalize } from "./normalize/oauthNormalize";
import { publicNormalize } from "./normalize/publicNormalize";

export async function getUserSocials(userId: string) {
  const { data, error } = await supabase
    .from("socials")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((raw) => {
    return raw.oauth
      ? oauthNormalize(raw)
      : publicNormalize(raw);
  });
}