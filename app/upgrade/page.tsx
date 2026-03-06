// /app/upgrade/page.tsx
"use client";

import PayPalCheckout from "@/components/PayPalCheckout";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "7",
    description: "Perfect to try for a month.",
  },
  {
    id: "quarterly",
    label: "3 Months",
    price: "30",
    description: "Commit to building momentum.",
  },
  {
    id: "semiannual",
    label: "6 Months",
    price: "75",
    description: "For serious creators.",
  },
  {
    id: "annual",
    label: "Yearly",
    price: "149",
    description: "Best value for long-term growth.",
  },
];

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content px-4 py-16 flex justify-center">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="opacity-80">
            Unlock full access to Qubit and turn your creator activity into
            measurable momentum.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.id} className="card bg-base-200 shadow-md">
              <div className="card-body items-center text-center space-y-3">
                <h2 className="card-title">{plan.label}</h2>
                <p className="text-2xl font-bold">${plan.price}</p>
                <p className="text-sm opacity-70">{plan.description}</p>

                {/* PayPal Button */}
                <div className="w-full mt-2">
                  <PayPalCheckout
                    plan={plan.id}
                    amount={plan.price}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}