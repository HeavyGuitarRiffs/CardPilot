//components\socials\PlatformSelect.tsx

"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;        // e.g., "instagram"
  name: string;      // e.g., "Instagram"
  icon: string;      // path to icon
}

interface PlatformSelectProps {
  platforms: Platform[];
  connected: string[];
  onSelect: (platformId: string) => void;
}

export default function PlatformSelect({
  platforms,
  connected,
  onSelect,
}: PlatformSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full font-semibold">
          Choose Platform
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3 space-y-2 rounded-xl shadow-lg border bg-popover">
        {platforms.map((p) => {
          const disabled = connected.includes(p.id);

          return (
            <button
              key={p.id}
              disabled={disabled}
              onClick={() => onSelect(p.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition text-left",
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-muted"
              )}
            >
              <Image
                src={p.icon}
                alt={p.name}
                width={22}
                height={22}
                className="rounded-sm"
              />
              <span className="text-sm font-medium">{p.name}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}