export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t bg-base-200/40">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold">
          How SocialLike works
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {["Connect", "Unify", "Act"].map((step, i) => (
            <div key={i}>
              <p className="text-accent text-xs uppercase">Step {i + 1}</p>
              <h3 className="font-semibold text-lg">{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
