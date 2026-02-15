import Link from "next/link";

export default function PricingPreviewSection() {
  return (
    <section className="border-t bg-base-200/40 text-center py-16">
      <Link href="/pricing" className="btn btn-accent rounded-full">
        View pricing & plans
      </Link>
    </section>
  );
}
