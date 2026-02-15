export default function WhySection() {
  const problems = [
    "Analytics scattered across 5–10 apps",
    "No visibility into compounding momentum",
    "No unified posting time insights",
    "No cross-platform voice clarity",
    "Reacting instead of compounding",
    "Broken feedback loop",
  ];

  return (
    <section className="border-t bg-base-100">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <h2 className="text-3xl font-bold">
          Why your growth feels random
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="bg-base-200 p-4 rounded-2xl">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
