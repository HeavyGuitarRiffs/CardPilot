"use client";

import Image from "next/image";
import { ALL_PLATFORMS } from "@/lib/platforms";
import { useRef, useMemo } from "react";
import { useAnimationFrame } from "framer-motion";
import type { IconType } from "react-icons";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

type IconComponent =
  | IconType
  | ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;

export default function SocialCarousel({
  onSelect,
  ultra = false,
}: {
  onSelect: (platformId: string) => void;
  ultra?: boolean;
}) {
  const x = useRef(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // Filter platforms that have an icon (all your current ALL_PLATFORMS)
  const logos = useMemo(() => ALL_PLATFORMS.filter((p) => !!p.icon), []);

  useAnimationFrame((_, delta) => {
    if (!ultra || !ref.current) return;
    const speed = 30; // adjust scroll speed
    x.current += (delta / 1000) * speed;
    const width = ref.current.scrollWidth / 2;
    if (Math.abs(x.current) > width) x.current = 0;
    ref.current.style.transform = `translateX(${-x.current}px)`;
  });

  if (ultra) {
    // ULTRA GIANT infinite scroll
    return (
      <div className="overflow-hidden py-16">
        <div
          ref={ref}
          className="flex gap-12 items-center will-change-transform"
          style={{ minWidth: "max-content" }}
        >
          {[...logos, ...logos].map((p, i) => (
            <div
              key={i}
              onClick={() => onSelect(p.name.toLowerCase())}
              className="flex flex-col items-center cursor-pointer snap-center hover:scale-105 transition-transform"
            >
              <div className="w-64 h-64 relative mb-4 flex items-center justify-center">
                <p.icon className="w-64 h-64 text-foreground opacity-90" />
              </div>
              <h3 className="text-xl font-semibold text-center">{p.name}</h3>
              <p className="text-sm opacity-70 text-center">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT small carousel
  return (
    <div className="w-full mt-10">
      <h2 className="text-xl font-semibold mb-4">Choose a Platform</h2>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
        {logos.map((p) => (
          <button
            key={p.name}
            onClick={() => onSelect(p.name.toLowerCase())}
            className="min-w-[300px] snap-center rounded-2xl border p-8 flex flex-col items-center justify-center bg-card hover:bg-accent transition shadow-sm hover:shadow-md"
          >
            <div className="w-28 h-28 relative mb-4 flex items-center justify-center">
              <p.icon className="w-24 h-24 text-foreground opacity-90" />
            </div>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}