"use client";

import Link from "next/link";
import FadeInSection from "./FadeInSection";

export default function FinalCTASection() {
  return (
    <FadeInSection>
      <section className="border-t bg-base-100 text-center py-16 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Start tracking your untracked social voice.
        </h2>

        <p className="text-base text-base-content/70 max-w-2xl mx-auto">
          Your growth becomes clear the moment you connect. Stop guessing. Start compounding.
        </p>

        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-lg font-semibold text-accent-content shadow-lg shadow-accent/30 hover:shadow-accent/50 transition"
        >
          Unlock SocialLike Premium
        </Link>
      </section>
    </FadeInSection>
  );
}
