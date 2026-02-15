"use client";

import FadeInSection from "./FadeInSection";

export default function PainPointSection() {
  const problems = [
    "Your analytics are scattered across 5–10 different apps.",
    "You don’t know which posts actually drive momentum over time.",
    "You don’t know when your audience is most active across platforms.",
    "You can’t see where your voice is strongest — or where to double down.",
    "You’re stuck reacting to spikes instead of building compounding growth.",
    "You’re creating daily, but your feedback loop is broken.",
  ];

  return (
    <FadeInSection>
      <section className="border-t border-base-content/10 bg-base-100">
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            Why your growth feels random
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl bg-base-200/70 p-4 text-sm text-base-content/80"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
