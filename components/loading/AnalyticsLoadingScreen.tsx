"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ANALYTICS_ICONS = [
  "/icons/chart-up.svg",
  "/icons/pie-chart.svg",
  "/icons/bar-chart.svg",
  "/icons/activity.svg",
  "/icons/target.svg",
  "/icons/brain.svg",
];

const DATA_ICONS = [
  "/icons/cloud.svg",
  "/icons/server.svg",
  "/icons/cpu.svg",
  "/icons/network.svg",
  "/icons/shield.svg",
];

const MESSAGES = [
  "Crunching your engagement metrics…",
  "Indexing your social performance…",
  "Training the prediction engine…",
  "Analyzing your audience clusters…",
  "Optimizing your posting strategy…",
  "Mapping your growth trajectory…",
  "Scanning for viral opportunities…",
  "Decrypting algorithmic patterns…",
  "Loading your analytics dashboard…",
  "Preparing insights tailored for you…",
];

export default function AnalyticsLoadingScreen() {
  const [state, setState] = useState({
    message: "",
    analytics: [] as string[],
    data: [] as string[],
  });

  useEffect(() => {
    // Defer state updates to avoid synchronous effect warnings
    setTimeout(() => {
      setState({
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        analytics: shuffle(ANALYTICS_ICONS).slice(0, 4),
        data: shuffle(DATA_ICONS).slice(0, 3),
      });
    }, 0);
  }, []);

  const { message, analytics, data } = state;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 overflow-hidden">

      {/* Floating analytics icons */}
      {analytics.map((icon, i) => (
        <Image
          key={i}
          src={icon}
          alt="analytics"
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

      {/* Orbiting data icons */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {data.map((icon, i) => (
          <Image
            key={i}
            src={icon}
            alt="data"
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

        {/* Core analytics orb */}
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
}//components\loading\AnalyticsLoadingScreen.tsx