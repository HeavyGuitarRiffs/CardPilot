// app/schedule/page.tsx
import { Badge } from "@/components/ui/badge";
import {
  SOCIAL,
  VIDEO,
  MUSIC,
  WRITING,
  WEB3,
  MONETIZATION,
  CREATOR_TOOLS,
} from "@/lib/platforms";

const ALL_PLATFORMS = [
  ...SOCIAL,
  ...VIDEO,
  ...MUSIC,
  ...WRITING,
  ...WEB3,
  ...MONETIZATION,
  ...CREATOR_TOOLS,
];

export default function SchedulePage() {
  const schedule = [
    {
      tier: "Every 5 minutes",
      badge: "Tier 1",
      socials: ALL_PLATFORMS.filter((p) =>
        [
          "tiktok",
          "twitter / x",
          "youtube",
          "instagram",
          "facebook",
          "twitch",
          "snapchat",
          "pinterest",
          "threads",
        ].includes(p.name.toLowerCase())
      ),
    },
    {
      tier: "Every 20 minutes",
      badge: "Tier 2",
      socials: ALL_PLATFORMS.filter((p) =>
        [
          "reddit",
          "tumblr",
          "medium",
          "quora",
          "substack",
          "vimeo",
          "soundcloud",
          "spotify",
        ].includes(p.name.toLowerCase())
      ),
    },
    {
      tier: "Every 30 minutes",
      badge: "Tier 3",
      socials: ALL_PLATFORMS.filter((p) =>
        [
          "github",
          "stackoverflow",
          "dev.to",
          "hashnode",
          "codepen",
          "codesandbox",
          "kaggle",
        ].includes(p.name.toLowerCase())
      ),
    },
    {
      tier: "Every 1 hour",
      badge: "Tier 4",
      socials: ALL_PLATFORMS.filter((p) =>
        [
          "kickstarter",
          "patreon",
          "ko-fi",
          "buy me a coffee",
          "gumroad",
          "etsy",
          "shopify",
        ].includes(p.name.toLowerCase())
      ),
    },
    {
      tier: "Every 3 hours",
      badge: "Tier 5",
      socials: ALL_PLATFORMS.filter((p) =>
        [
          "dribbble",
          "behance",
          "letterboxd",
          "goodreads",
          "bandcamp",
          "mixcloud",
          "rumble",
          "odysee",
          "mastodon",
          "bluesky",
          "vk",
          "bilibili",
          "xiaohongshu (red)",
          "telegram",
          "discord",
        ].includes(p.name.toLowerCase())
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold">Social Sync Schedule</h1>
      <p className="text-gray-600">
        Each platform refreshes on its own schedule. These tiers match your API cron system.
      </p>

      {schedule.map((tier) => (
        <div key={tier.tier} className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{tier.badge}</Badge>
            <h2 className="text-xl font-semibold">{tier.tier}</h2>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tier.socials.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 p-4 border rounded-lg bg-card"
              >
                <p.icon className="text-xl" />
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}