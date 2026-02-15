export default function FeaturePreviewSection() {
  return (
    <section className="border-t bg-base-100">
      <div className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-3 gap-6">
        {["Analytics", "Insights", "Linktree Intelligence"].map((f, i) => (
          <div key={i} className="rounded-2xl bg-base-200 p-4">
            <h3 className="font-semibold text-sm">{f}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
