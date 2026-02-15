"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setHasScrolled(true);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        {/* tag */}
        <div className="mb-4 inline-flex rounded-full bg-base-200 px-3 py-1 text-xs">
          You’re posting everywhere… but you don’t know what’s working.
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold">
              Track the social voice you’ve been blind to.
            </h1>

            <p className="text-base-content/70">
              SocialLike unifies every platform you create on into one clear
              analytics engine.
            </p>

            <div className="flex gap-3">
              <Link href="/pricing" className="btn btn-accent rounded-full">
                Start tracking
              </Link>

              <a href="#how-it-works" className="btn btn-outline rounded-full">
                How it works
              </a>
            </div>
          </div>

          {/* visual card */}
          <div
            className={`rounded-3xl bg-base-200 p-6 shadow-xl transition ${
              hasScrolled ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {/* keep your analytics preview UI */}
          </div>
        </div>
      </div>
    </section>
  );
}
