//app\dashboard\layout.tsx// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import DashboardOverlayLoader from "@/components/dashboard/DashboardOverlayLoader";
import TopLoader from "@/components/dashboard/TopLoader";
import DashboardTransition from "@/components/dashboard/DashboardTransition";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const { data: userPlan } = await supabase
    .from("user_plans")
    .select("plan_id")
    .eq("user_id", session.user.id)
    .single();

  const planId = userPlan?.plan_id || "free";

  const { data: plan } = await supabase
    .from("plans")
    .select("id, name")
    .eq("id", planId)
    .single();

  const planName = plan?.name || "Free";

  return (
    <div className="min-h-screen flex bg-base-100 text-base-content">
      <DashboardOverlayLoader />
      <TopLoader />

      <aside className="hidden md:flex w-64 flex-col border-r bg-base-200 p-6 gap-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm opacity-70">Plan: {planName}</p>

        <nav className="flex flex-col gap-3 text-sm">
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/page2">Deep Analytics</a>
          <a href="/dashboard/profile">Profile</a>
          <a href="/dashboard/monetization">Monetization</a>
          <a href="/dashboard/goals">Goals</a>
          <a href="/dashboard/achievements">Achievements</a>
          <a href="/dashboard/insights">Insights</a>
          <a href="/dashboard/analytics">Analytics</a>
          <a href="/dashboard/linktree">Linktree</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <DashboardTransition>
          {children}
        </DashboardTransition>
      </main>
    </div>
  );
}