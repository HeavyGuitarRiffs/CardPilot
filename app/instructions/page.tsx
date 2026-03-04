// app/instructions/page.tsx

export default function InstructionsPage() {
  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">How Social Sync Works</h1>

      <p className="text-muted-foreground max-w-2xl">
        Your analytics refresh on different schedules depending on the platform.
        This page explains how to use the Social Sync system so you always know
        when to check your dashboards and when to expect new data.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Follow the Refresh Intervals</h2>
        <p className="text-muted-foreground max-w-2xl">
          Each platform updates at its own pace. Some refresh every 5 minutes,
          others every few hours. Use the <strong>Social Sync Schedule</strong> page
          to know exactly when new analytics are available.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Fast‑moving platforms like TikTok and Twitter update constantly.</li>
          <li>Long‑form or niche platforms refresh less frequently.</li>
          <li>Checking too early may show outdated numbers.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Check Only When It’s Time</h2>
        <p className="text-muted-foreground max-w-2xl">
          To avoid burnout and keep your workflow efficient, check each platform
          only when its refresh window arrives. This ensures:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>You always see the latest analytics.</li>
          <li>You avoid wasting time refreshing dashboards manually.</li>
          <li>You maintain a healthy, predictable creator routine.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Let the App Track Everything</h2>
        <p className="text-muted-foreground max-w-2xl">
          Social Sync automatically organizes your platforms by refresh speed.
          You don’t need to memorize anything — just follow the schedule.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>We group platforms by update frequency.</li>
          <li>You get a clear overview of what to check and when.</li>
          <li>More integrations and automation are coming soon.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Stay Consistent</h2>
        <p className="text-muted-foreground max-w-2xl">
          The key to growing across multiple platforms is consistency. By
          following the refresh schedule, you’ll always know when to review
          performance, adjust strategy, and publish new content.
        </p>
      </section>

      <div className="p-4 border rounded-lg bg-card">
        <p className="font-medium">
          Tip: Bookmark the Social Sync Schedule page — it’s your command center
          for all analytics timing.
        </p>
      </div>
    </div>
  );
}