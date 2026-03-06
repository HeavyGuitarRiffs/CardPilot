import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl.pathname;

  // 1) Allow API + static assets
  if (
    url.startsWith("/api") ||
    url.startsWith("/_next") ||
    url.startsWith("/icon") ||
    url.startsWith("/favicon.ico")
  ) {
    return res;
  }

  // 2) Public routes
  const publicRoutes = ["/", "/login", "/pricing", "/about"];
  if (publicRoutes.includes(url)) return res;

  // 3) Auth check
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4) Paid-only routes
  const { data: userPlan } = await supabase
    .from("user_plans")
    .select("plan_id")
    .eq("user_id", session.user.id)
    .single();

  const plan = userPlan?.plan_id || "free";

  const paidRoutes = [
    "/dashboard/analytics",
    "/dashboard/insights",
    "/dashboard/linktree",
  ];

  if (paidRoutes.includes(url) && plan === "free") {
    return NextResponse.redirect(new URL("/upgrade", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};