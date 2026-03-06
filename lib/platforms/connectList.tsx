import {
  SiYoutube,
  SiGithub,
  SiInstagram,
  SiReddit,
  SiX,
  SiPatreon,
  SiProducthunt,
} from "react-icons/si";

import { FaHackerNews } from "react-icons/fa";

export type ConnectPlatform = {
  platform: string;
  name: string;
  icon: React.ReactNode;
  connectUrl: string;
};

export const CONNECT_PLATFORMS: ConnectPlatform[] = [
  {
    platform: "youtube",
    name: "YouTube",
    icon: <SiYoutube size={20} />,
    connectUrl: "/api/auth/youtube",
  },
  {
    platform: "github",
    name: "GitHub",
    icon: <SiGithub size={20} />,
    connectUrl: "/api/auth/github",
  },
  {
    platform: "instagram",
    name: "Instagram",
    icon: <SiInstagram size={20} />,
    connectUrl: "/api/auth/instagram",
  },
  {
    platform: "reddit",
    name: "Reddit",
    icon: <SiReddit size={20} />,
    connectUrl: "/api/auth/reddit",
  },
  {
    platform: "x",
    name: "X (Twitter)",
    icon: <SiX size={20} />,
    connectUrl: "/api/auth/x",
  },
  {
    platform: "patreon",
    name: "Patreon",
    icon: <SiPatreon size={20} />,
    connectUrl: "/api/auth/patreon",
  },

  // ⭐ NEW: Product Hunt
  {
    platform: "producthunt",
    name: "Product Hunt",
    icon: <SiProducthunt size={20} />,
    connectUrl: "/api/connect/producthunt",
  },

  // ⭐ NEW: Hacker News
  {
    platform: "hackernews",
    name: "Hacker News",
    icon: <FaHackerNews size={20} />,
    connectUrl: "/api/connect/hackernews",
  },
];