// lib/platforms/platformRegistry.ts

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
} as const;

export type PlatformId = keyof typeof PLATFORM_REGISTRY;