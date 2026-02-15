"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-3">
      <Link
        href="/pricing"
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-content shadow-lg shadow-accent/30 hover:shadow-accent/50 transition"
      >
        Unlock Premium
      </Link>

      <a
        href="#how-it-works"
        className="rounded-full bg-base-200 px-5 py-3 text-sm font-medium text-base-content/80 border border-base-content/10 hover:bg-base-300 transition text-center"
      >
        How it works
      </a>
    </div>
  );
}
