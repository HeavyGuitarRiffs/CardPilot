"use client";

import { ALL_PLATFORMS } from "@/lib/platforms";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content px-6 py-24 flex flex-col items-center">
      <div className="mx-auto max-w-6xl space-y-24">

        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="hero-title">
            Built for <span className="text-primary">Creators</span>.
            <br />
            Designed for <span className="text-secondary">Momentum</span>.
          </h1>

          <p className="hero-subtitle max-w-3xl mx-auto">
            Comment Se Va helps you turn daily social effort into measurable growth,
            consistency, and eventually income — without guessing what works.
          </p>
        </section>

        {/* STORY / PROBLEM */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">The Problem with Social Growth</h2>

            <p className="opacity-80">
              Most creators post blindly. Engagement feels random.
              Monetization feels far away. Growth stalls without feedback.
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-error">✕</span>
                No visibility into comment velocity
              </li>
              <li className="flex gap-3">
                <span className="text-error">✕</span>
                No feedback on what topics perform
              </li>
              <li className="flex gap-3">
                <span className="text-error">✕</span>
                No habit reinforcement
              </li>
            </ul>
          </div>

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body">
              <h3 className="card-title">What creators actually need</h3>
              <p className="opacity-80">
                Feedback loops. Momentum tracking. Signals that reward consistency.
              </p>
            </div>
          </div>
        </section>

        {/* SOLUTION / FLOW */}
        <section className="space-y-12">
          <h2 className="text-center text-3xl font-bold">How Comment Se Va Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">1️⃣ Track Activity</h3>
                <p>
                  Connect socials and track comments, replies,
                  and engagement in real time.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">2️⃣ Analyze Signals</h3>
                <p>
                  See which topics, times, and platforms generate momentum.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">3️⃣ Compound Growth</h3>
                <p>
                  Build streaks, rewards, and habits that increase reach
                  and monetization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT / METRICS */}
        <section className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="metric text-primary">↑ 2–5×</p>
            <p className="metric-label">Reply Speed</p>
          </div>

          <div>
            <p className="metric text-secondary">↑ 3×</p>
            <p className="metric-label">Engagement Consistency</p>
          </div>

          <div>
            <p className="metric text-accent">↓ 60%</p>
            <p className="metric-label">Burnout</p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Build Once. Compound Daily.</h2>

          <p className="opacity-80 max-w-xl mx-auto">
            Comment Se Va is designed to be checked multiple times a day —
            because momentum should be visible.
          </p>

          <button className="btn btn-primary btn-lg">
            Start Tracking
          </button>
        </section>

        {/* PLATFORM GRID */}
        <section className="space-y-12 pt-24">
          <h2 className="text-center text-3xl font-bold">
            Supported Platforms
          </h2>

          <p className="text-center opacity-70 max-w-2xl mx-auto">
            Comment Se Va currently supports 91 creator platforms — from social networks
            to video, music, writing, Web3, and monetization ecosystems.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ALL_PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card bg-base-200 hover:bg-base-300 transition shadow-sm"
              >
                <div className="card-body items-center text-center space-y-3">
                  <p.icon className="w-10 h-10 opacity-80" />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm opacity-70">{p.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}