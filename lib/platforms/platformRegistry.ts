export const PLATFORM_REGISTRY = {
  youtube: {
    id: "youtube",
    name: "YouTube",
    shortName: "YouTube",
    color: "#FF0000",
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    shortName: "Twitter",
    color: "#000000",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    shortName: "Instagram",
    color: "#E1306C",
  },
  reddit: {
    id: "reddit",
    name: "Reddit",
    shortName: "Reddit",
    color: "#FF4500",
  },
  github: {
    id: "github",
    name: "GitHub",
    shortName: "GitHub",
    color: "#000000",
  },
  patreon: {
    id: "patreon",
    name: "Patreon",
    shortName: "Patreon",
    color: "#FF424D",
  },

  // ⭐ NEW: Product Hunt
  producthunt: {
    id: "producthunt",
    name: "Product Hunt",
    shortName: "PH",
    color: "#DA552F", // official PH orange
  },

  // ⭐ NEW: Hacker News
  hackernews: {
    id: "hackernews",
    name: "Hacker News",
    shortName: "HN",
    color: "#FF6600", // official HN orange
  },
} as const;

export type PlatformId = keyof typeof PLATFORM_REGISTRY;