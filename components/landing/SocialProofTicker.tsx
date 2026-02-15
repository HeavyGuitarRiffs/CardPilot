"use client";

import { useEffect, useState } from "react";

const events = [
  "Alex from Miami just connected Instagram",
  "Maya earned +12% engagement on TikTok",
  "Jordan gained 240 followers today",
  "Chris closed a brand deal using Social Like",
  "Sam connected 3 platforms in 2 minutes",
];

export default function SocialProofTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 4000);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 bg-base-100 border border-base-300 shadow-lg px-6 py-3 rounded-full text-sm z-50 animate-fade-in">
      🔥 {events[index]}
    </div>
  );
}
