//components\loading\GlowingOrbLoadingScreen.tsx
// 
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ENGINEER_ICONS = [
  "/icons/gear.svg",
  "/icons/database.svg",
  "/icons/router.svg",
  "/icons/cable.svg",
  "/icons/wrench.svg",
  "/icons/bolt.svg",
];

const SOCIAL_ICONS = [
  "/icons/instagram.svg",
  "/icons/tiktok.svg",
  "/icons/youtube.svg",
  "/icons/twitter.svg",
  "/icons/linkedin.svg",
];

const MESSAGES = [
  "Connecting your socials…",
  "Routing your data through the quantum tunnel…",
  "Welding your analytics pipeline…",
  "Soldering your engagement circuits…",
  "Writing your social biography…",
  "Calibrating your follower sensors…",
  "Spinning up the comment turbines…",
  "Untangling the algorithm cables…",
  "Feeding your metrics into the reactor…",
  "Stabilizing the engagement flux…",
];

export default function GlowingOrbLoadingScreen() {
  const [state, setState] = useState({
    message: "",
    icons: [] as string[],
    socials: [] as string[],
  });

  useEffect(() => {
    // Defer state update to avoid synchronous effect warning
    setTimeout(() => {
      setState({
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        icons: shuffle(ENGINEER_ICONS).slice(0, 4),
        socials: shuffle(SOCIAL_ICONS).slice(0, 3),
      });
    }, 0);
  }, []);

  const { message, icons, socials } = state;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 overflow-hidden">
      {/* Floating engineering icons */}
      {icons.map((icon, i) => (
        <Image
          key={i}
          src={icon}
          alt="icon"
          width={32}
          height={32}
          className={cn(
            "absolute opacity-40 animate-float",
            i === 0 && "top-10 left-10",
            i === 1 && "top-20 right-14",
            i === 2 && "bottom-16 left-20",
            i === 3 && "bottom-10 right-10"
          )}
        />
      ))}

      {/* Orbiting social icons */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {socials.map((icon, i) => (
          <Image
            key={i}
            src={icon}
            alt="social"
            width={28}
            height={28}
            className={cn(
              "absolute animate-orbit",
              i === 0 && "orbit-delay-1",
              i === 1 && "orbit-delay-2",
              i === 2 && "orbit-delay-3"
            )}
          />
        ))}

        {/* Glowing orb */}
        <div className="w-24 h-24 rounded-full bg-primary/40 blur-xl animate-pulse" />
        <div className="absolute w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/40 animate-glow" />
      </div>

      {/* Message */}
      <p className="mt-8 text-sm text-muted-foreground animate-fade">
        {message}
      </p>

      {/* Shimmer bar */}
      <div className="mt-6 w-64 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full w-1/2 bg-primary/60 animate-shimmer" />
      </div>
    </div>
  );
}

function shuffle(arr: string[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}//components\loading\GlowingOrbLoadingScreen.tsx