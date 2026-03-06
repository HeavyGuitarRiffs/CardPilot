// lib/platforms/connectList.ts
import {
  SiYoutube,
  SiGithub,
  SiInstagram,
  SiReddit,
  SiX,
  SiPatreon,
} from "react-icons/si";

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
];