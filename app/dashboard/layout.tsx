import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ReactNode } from "react";
import { headers } from "next/headers";

// ⭐ NEW — route transitions
import { AnimatePresence, motion } from "framer-motion";

// ⭐ NEW — placeholder components
import TopLoader from "@/components/dashboard/TopLoader";
import DashboardOverlayLoader from "@/components/dashboard/DashboardOverlayLoader";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the user's plan_id
  const { data: userPlan } = await supabase
    .from("user_plans")
    .select("plan_id")
    .eq("user_id", session.user.id)
    .single();

  const planId = userPlan?.plan_id || "free";

  // Fetch plan details
  const { data: plan } = await supabase
    .from("plans")
    .select("id, name")
    .eq("id", planId)
    .single();

  const planName = plan?.name || "Free";

  // ⭐ FIX: Await headers() to avoid TS error
  const h = await headers();
  const pathname =
    h.get("x-invoke-path") ??
    h.get("next-url") ??
    "/dashboard";

  return (
    <div className="min-h-screen flex bg-base-100 text-base-content">

      {/* ⭐ GLOBAL DASHBOARD LOADER OVERLAY */}
      <DashboardOverlayLoader />

      {/* ⭐ TOP PROGRESS BAR */}
      <TopLoader />

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-base-200 p-6 gap-6">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <p className="text-sm opacity-70">Plan: {planName}</p>

        <nav className="flex flex-col gap-3 text-sm">
          <a href="/dashboard" className="hover:opacity-80">Overview</a>
          <a href="/dashboard/page2" className="hover:opacity-80">Deep Analytics</a>
          <a href="/dashboard/profile" className="hover:opacity-80">Profile</a>
          <a href="/dashboard/monetization" className="hover:opacity-80">Monetization</a>
          <a href="/dashboard/goals" className="hover:opacity-80">Goals</a>
          <a href="/dashboard/achievements" className="hover:opacity-80">Achievements</a>
          <a href="/dashboard/insights" className="hover:opacity-80">Insights</a>
          <a href="/dashboard/analytics" className="hover:opacity-80">Analytics</a>
          <a href="/dashboard/linktree" className="hover:opacity-80">Linktree</a>
        </nav>
      </aside>

      {/* ⭐ ROUTE TRANSITION WRAPPER */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname} // ⭐ Pure, stable, animates correctly
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}