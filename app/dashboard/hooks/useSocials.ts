"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeSocialMetric, OAuthData } from "@/app/dashboard/types";

const supabase = createClient();

export function useSocials() {
  const [socials, setSocials] = useState<RealtimeSocialMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.id;

      async function fetchAndNormalize() {
        const { data: rows, error } = await supabase
          .from("social_profiles")
          .select("*")
          .eq("user_id", userId);

        if (error || !rows) {
          console.error("Failed to load social_profiles:", error);
          setLoading(false);
          return;
        }

        const normalized: RealtimeSocialMetric[] = rows.map((s) => ({
          followers: s.followers ?? 0,

          comments: s.comments ?? 0,
          commentsToday: s.commentstoday ?? 0,
          commentsWeek: s.commentsweek ?? 0,
          commentsMonth: s.commentsmonth ?? 0,
          commentsLastWeek: s.commentslastweek ?? 0,

          likes: s.likes ?? 0,
          likesToday: s.likestoday ?? 0,
          likesDelta: s.likesdelta ?? 0,

          momentum: s.momentum ?? 0,
          engagement_change: s.engagement_change ?? 0,
          engagementChange: s.engagementchange ?? 0,

          posts: s.posts ?? 0,

          oauth: (s.oauth as unknown as OAuthData) ?? {
  access_token: "",
  refresh_token: undefined,
  expires_at: undefined,
  scope: undefined,
  token_type: undefined,
  raw: {},
},

          handle: s.username ?? "",
          platform: s.platform ?? "",
        }));

        setSocials(normalized);
        setLoading(false);
      }

      await fetchAndNormalize();

      subscription = supabase
        .channel(`realtime-socials-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "social_profiles",
            filter: `user_id=eq.${userId}`,
          },
          fetchAndNormalize
        )
        .subscribe();
    }

    load();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return { socials, loading };
}