"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchUserSocials } from "@/app/dashboard/actions/fetchUserSocials";
import type { SocialMetric } from "@/app/dashboard/types";

const supabase = createClient();

// ⭐ Updated to match normalize layer + sync-all engine
export type ExtendedSocialMetric = SocialMetric & {
  commentsToday: number;
  commentsWeek: number;
  commentsMonth: number;
  commentsLastWeek: number;

  posts: number;
  streak: number;
  conversionPages: number;

  momentum: number;
  engagement_change: number;
  engagementChange: number;

  likes: number;
  likesDelta: number;

  oauth: boolean; // ⭐ REQUIRED for sync-all + normalize
};

export function useSocials() {
  const [socials, setSocials] = useState<ExtendedSocialMetric[]>([]);
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
        const data = await fetchUserSocials(userId);

        // ⭐ Ensure all fields exist so UI never breaks
        const normalized: ExtendedSocialMetric[] = data.map((s) => ({
          ...s,
          commentsToday: s.commentsToday ?? 0,
          commentsWeek: s.commentsWeek ?? 0,
          commentsMonth: s.commentsMonth ?? 0,
          commentsLastWeek: s.commentsLastWeek ?? 0,

          posts: s.posts ?? 0,
          streak: s.streak ?? 0,
          conversionPages: s.conversionPages ?? 0,

          momentum: s.momentum ?? 0,
          engagement_change: s.engagement_change ?? 0,
          engagementChange: s.engagementChange ?? 0,

          likes: s.likes ?? 0,
          likesDelta: s.likesDelta ?? 0,

          oauth: s.oauth ?? false,
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
            table: "socials",
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