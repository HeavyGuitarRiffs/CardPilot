// app/pricing/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import PayPalCheckout from "@/components/PayPalCheckout";

type PlanId = "monthly" | "quarterly" | "semiannual" | "lifetime" | null;

const tiers = [
  {
    name: "1 Month Access",
    price: "$7",
    duration: "One-time payment",
    planKey: "monthly" as PlanId,
    subtitle: "Try the full creator analytics suite",
    features: [
      "Full analytics dashboard",
      "Insights & growth recommendations",
      "Linktree auto-detection",
      "Track up to 5 platforms",
      "Daily refresh",
    ],
    cta: "Unlock 1 Month",
  },
  {
    name: "3 Months Access",
    price: "$29",
    duration: "One-time payment",
    planKey: "quarterly" as PlanId,
    subtitle: "For creators growing across platforms",
    features: [
      "Everything in 1 Month",
      "Track up to 10 platforms",
      "Advanced insights",
      "Posting windows & heatmaps",
    ],
    cta: "Unlock 3 Months",
  },
  {
    name: "6 Months Access",
    price: "$75",
    duration: "One-time payment",
    planKey: "semiannual" as PlanId,
    subtitle: "For creators building long-term systems",
    features: [
      "Everything in 3 Months",
      "Creator benchmarks",
      "Early access to new analytics modules",
      "Priority feature voting",
    ],
    cta: "Unlock 6 Months",
    bestValue: true,
  },
  {
    name: "Lifetime Access",
    price: "$149",
    duration: "One-time payment",
    planKey: "lifetime" as PlanId,
    subtitle: "For creators who want unlimited access forever",
    features: [
      "Everything in 6 Months",
      "Lifetime updates",
      "Unlimited platforms",
      "Priority support",
    ],
    cta: "Unlock Lifetime",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  return (
    <main className="min-h-screen bg-base-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-6xl space-y-16 text-center">

        {/* HEADER */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-base-content">
            Unlock Comment Se Va Premium
          </h1>
          <p className="text-lg text-base-content/70">
            One-time payments. No subscriptions. Full creator analytics.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
          {tiers.map((tier) => {
            const isSelected = selectedPlan === tier.planKey;

            return (
              <Card
                key={tier.name}
                className="relative w-full max-w-sm rounded-2xl flex flex-col justify-between bg-base-200
                transform transition-all hover:-translate-y-1 hover:shadow-2xl
                hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-base-100"
              >
                {tier.bestValue && (
                  <div
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold 
                    text-green-700 dark:text-green-300
                    bg-green-200 dark:bg-green-900/40
                    shadow-[0_0_12px_rgba(34,197,94,0.4)] 
                    dark:shadow-[0_0_12px_rgba(34,197,94,0.8)]
                    animate-pulse"
                  >
                    Best Value
                  </div>
                )}

                {/* HEADER */}
                <CardHeader className="text-center space-y-2">
                  <CardTitle className="text-2xl font-bold text-base-content">
                    {tier.name}
                  </CardTitle>
                  <p className="text-base-content/70 text-sm">
                    {tier.subtitle}
                  </p>
                </CardHeader>

                {/* CONTENT */}
                <CardContent className="space-y-5 flex flex-col items-center text-center">
                  <p className="text-4xl font-extrabold text-base-content">
                    {tier.price}
                  </p>

                  {tier.bestValue && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-500 dark:text-green-300">
                      Most popular
                    </p>
                  )}

                  <p className="text-base-content/60 text-sm">
                    {tier.duration}
                  </p>

                  <ul className="space-y-2 text-sm text-left mx-auto">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* CTA */}
                <CardFooter className="flex justify-center">
                  {!isSelected ? (
                    <button
                      onClick={() => setSelectedPlan(tier.planKey)}
                      className="w-full py-4 rounded-xl bg-base-content/5 hover:bg-base-content/10 transition font-semibold text-base-content"
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <p className="mb-2 text-sm font-medium text-base-content">
                        Complete your payment
                      </p>

                      {/* ⭐ FIX: Fully isolated wrapper so dark mode cannot override PayPal UI */}
                      <div
                        className="
                          w-full 
                          bg-white dark:bg-neutral-900 
                          text-black dark:text-white 
                          p-4 rounded-xl 
                          border border-neutral-300 dark:border-neutral-700
                          shadow-md
                        "
                      >
                        <PayPalCheckout
                          plan={tier.planKey!}
                          amount={tier.price.replace(/\D/g, "")}
                        />
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FOOTNOTE */}
        <p className="text-sm text-base-content/60">
          One-time payments · Secure PayPal checkout · Instant access
        </p>
      </div>
    </main>
  );
}