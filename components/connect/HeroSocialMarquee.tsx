"use client";

import { motion } from "framer-motion";
import { ALL_PLATFORMS } from "@/lib/platforms";
import type { IconType } from "react-icons";

type Platform = {
  name: string;
  logo?: string;
  icon?: string | IconType;
  desc?: string;
};

function PlatformLogo({
  platform,
  onClick,
}: {
  platform: Platform;
  onClick: (id: string) => void;
}) {
  const isImg = typeof platform.logo === "string" || typeof platform.icon === "string";
  const imgSrc = (platform.logo || platform.icon) as string;

  const isComponent = typeof platform.icon === "function";
  const Icon = platform.icon as IconType;

  return (
    <button
      onClick={() => onClick(platform.name.toLowerCase().replace(/\s+/g, "_"))}
      className="flex flex-col items-center justify-center mx-10 hover:scale-110 transition"
    >
      <div className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
        {isImg && (
          <img src={imgSrc} alt={platform.name} className="object-contain w-full h-full drop-shadow-2xl" />
        )}
        {isComponent && <Icon className="w-full h-full opacity-90" />}
      </div>

      <div className="mt-3 text-lg font-semibold">{platform.name}</div>
      {platform.desc && (
        <div className="text-sm text-muted-foreground text-center max-w-[220px]">
          {platform.desc}
        </div>
      )}
    </button>
  );
}

function Row({
  direction = "left",
  onSelect,
}: {
  direction?: "left" | "right";
  onSelect: (id: string) => void;
}) {
  const duplicated = [...ALL_PLATFORMS, ...ALL_PLATFORMS];

  const animation =
    direction === "left"
      ? { x: ["0%", "-50%"] }
      : { x: ["-50%", "0%"] };

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        animate={animation}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30,
        }}
        className="flex w-max"
      >
        {duplicated.map((p, i) => (
          <PlatformLogo key={`${p.name}-${i}`} platform={p} onClick={onSelect} />
        ))}
      </motion.div>
    </div>
  );
}

export default function HeroSocialMarquee({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full py-10 space-y-12">
      <h2 className="text-3xl font-bold text-center">Connect Your Platforms</h2>

      {/* TOP ROW */}
      <Row direction="left" onSelect={onSelect} />

      {/* BOTTOM ROW */}
      <Row direction="right" onSelect={onSelect} />
    </div>
  );
}