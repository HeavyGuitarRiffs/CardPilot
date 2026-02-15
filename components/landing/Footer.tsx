import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-base-content/10 bg-base-100">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3">
        
        {/* BRAND */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold">SocialLike</h3>
          <p className="text-sm text-base-content/60 max-w-xs">
            A unified analytics engine for creators who want to understand
            what’s working and grow with clarity.
          </p>
        </div>

        {/* NAV */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-base-content">Navigation</p>
          <div className="flex flex-col gap-1 text-base-content/70">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="#how-it-works">How it works</a>
          </div>
        </div>

        {/* LEGAL / CTA */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-base-content">Company</p>
          <div className="flex flex-col gap-1 text-base-content/70">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-base-content/50 pb-6">
        © {new Date().getFullYear()} SocialLike. All rights reserved.
      </div>
    </footer>
  );
}
