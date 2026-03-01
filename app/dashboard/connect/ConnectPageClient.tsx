"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ALL_PLATFORMS } from "@/lib/platforms";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Plus, GripVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useAnimationFrame } from "framer-motion";
import type { IconType } from "react-icons";

/* ------------------- SUPABASE CLIENT ------------------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ------------------- SOCIAL TYPES ------------------- */
export type SocialLink = {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  comments: number;
  weeklyGrowthPct?: number;
  linktree: boolean;
  order_index: number;
  created_at: string | null;
};

/* ------------------- PLATFORM TYPES ------------------- */
type PlatformItem = {
  id: string;
  name: string;
  logo?: string;
  icon?: string | IconType;
  url?: string;
  desc?: string;
};

const PLATFORM_LIST: PlatformItem[] = ALL_PLATFORMS.map((p) => ({
  ...p,
  id: p.name.toLowerCase().replace(/\s+/g, "_"),
}));

type PlatformKey = (typeof PLATFORM_LIST)[number]["id"];

/* ------------------- PLATFORM DETECTION ------------------- */
function detectPlatformFromUrl(url: string): PlatformKey {
  const u = url.toLowerCase();
  if (u.includes("reddit.com")) return "reddit" as PlatformKey;
  if (u.includes("instagram.com")) return "instagram" as PlatformKey;
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube" as PlatformKey;
  if (u.includes("patreon.com")) return "patreon" as PlatformKey;
  if (u.includes("linktr.ee")) return "linktree" as PlatformKey;
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter" as PlatformKey;
  if (u.includes("tiktok.com")) return "tiktok" as PlatformKey;
  if (u.includes("github.com")) return "github" as PlatformKey;
  return "unknown" as PlatformKey;
}

function extractHandleFromUrl(url: string) {
  try {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    return "";
  }
}

/* ------------------- LOGO GETTER ------------------- */
function getPlatformLogoOrIcon(key: PlatformKey) {
  const item = PLATFORM_LIST.find((p) => p.id === key) ?? PLATFORM_LIST.find((p) => p.id === "unknown");
  if (!item) return null;
  if (typeof item.logo === "string") return { type: "img" as const, value: item.logo };
  if (typeof item.icon === "string") return { type: "img" as const, value: item.icon };
  if (typeof item.icon === "function") return { type: "component" as const, value: item.icon };
  return null;
}

/* ------------------- SORTABLE ROW ------------------- */
function SortableRow({ social, updateSocial, removeSocial }: {
  social: SocialLink;
  updateSocial: <K extends keyof SocialLink>(id: string, key: K, value: SocialLink[K]) => void;
  removeSocial: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: social.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const logoObj = getPlatformLogoOrIcon(social.platform as PlatformKey);

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </TableCell>

      <TableCell className="w-12">
        {logoObj?.type === "img" && <img src={logoObj.value} className="h-8 w-8 object-contain" />}
        {logoObj?.type === "component" && <logoObj.value className="h-8 w-8" />}
      </TableCell>

      <TableCell>
        <Input
          value={social.platform}
          onChange={(e) => updateSocial(social.id, "platform", e.target.value as SocialLink["platform"])}
        />
      </TableCell>

      <TableCell>
        <Input
          value={social.handle}
          onChange={(e) => {
            const value = e.target.value;
            if (value.startsWith("http")) {
              const detected = detectPlatformFromUrl(value);
              const handle = extractHandleFromUrl(value);
              updateSocial(social.id, "platform", detected as SocialLink["platform"]);
              updateSocial(social.id, "handle", handle);
            } else {
              updateSocial(social.id, "handle", value);
            }
          }}
        />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex flex-col text-right">
          <span>{social.followers} followers</span>
          <span>{social.comments} comments</span>
        </div>
        <button onClick={() => removeSocial(social.id)} className="text-red-500 text-lg px-2">
          ✕
        </button>
      </TableCell>
    </TableRow>
  );
}

/* ------------------- ULTRA GIANT CAROUSEL ------------------- */
function UltraGiantCarousel({ onSelect }: { onSelect: (platformId: string) => void }) {
  const x = useRef(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const logos = useMemo(() => PLATFORM_LIST.filter((p) => p.logo), []);

  useAnimationFrame((_, delta) => {
    if (!ref.current || ref.current.scrollWidth === 0) return;
    const speed = 30;
    x.current += (delta / 1000) * speed;
    const width = ref.current.scrollWidth / 2;
    if (Math.abs(x.current) > width) x.current = 0;
    ref.current.style.transform = `translateX(${-x.current}px)`;
  });

  return (
    <div className="overflow-hidden py-16">
      <div ref={ref} className="flex gap-12 items-center will-change-transform" style={{ minWidth: "max-content" }}>
        {[...logos, ...logos].map((p, i) => (
          <div
            key={i}
            onClick={() => onSelect(p.id)}
            className="flex flex-col items-center cursor-pointer snap-center hover:scale-105 transition-transform"
          >
            <img src={p.logo} alt={p.name} className="w-64 h-64 object-contain mb-4" />
            <h3 className="text-xl font-semibold text-center">{p.name}</h3>
            <p className="text-sm opacity-70 text-center">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------- CONNECT PAGE CLIENT (DEBUG READY) ------------------- */
export default function ConnectPageClient({
  initialSocials,
  userId,
}: {
  initialSocials: SocialLink[];
  userId: string;
}) {
  const router = useRouter();
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);
  const [isPending, startTransition] = useTransition();
  const [linktreeUrl, setLinktreeUrl] = useState("");

  const updateSocial = <K extends keyof SocialLink>(id: string, key: K, value: SocialLink[K]) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, [key]: value } : s));
    setSocials(updated);

    const s = updated.find((x) => x.id === id);
    if (!s) return;

    startTransition(async () => {
      const { data, error } = await supabase
        .from("user_socials")
        .upsert({ ...s, user_id: userId, order_index: updated.findIndex((x) => x.id === s.id) });
      console.log("UpdateSocial upsert result:", data, error);
      if (error) toast.error("Failed to update social: " + error.message);
    });
  };

  const addSocial = async (platformId?: string) => {
    const newSocial: SocialLink = {
      id: crypto.randomUUID(),
      handle: "",
      platform: platformId || "unknown",
      followers: 0,
      comments: 0,
      weeklyGrowthPct: undefined,
      linktree: false,
      order_index: socials.length,
      created_at: null,
    };

    setSocials((prev) => [...prev, newSocial]);

    const { data, error } = await supabase
      .from("user_socials")
      .insert({ ...newSocial, user_id: userId });
    console.log("AddSocial insert result:", data, error);
    if (error) toast.error("Failed to add social: " + error.message);
  };

  const removeSocial = async (id: string) => {
    const { error } = await supabase.from("user_socials").delete().eq("id", id);
    if (error) toast.error("Failed to remove social: " + error.message);
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = socials.findIndex((s) => s.id === active.id);
    const newIndex = socials.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(socials, oldIndex, newIndex);
    setSocials(reordered);

    const { data, error } = await supabase
      .from("user_socials")
      .upsert(reordered.map((s, i) => ({ ...s, user_id: userId, order_index: i })));
    console.log("handleDragEnd upsert result:", data, error);
    if (error) toast.error("Failed to reorder socials: " + error.message);
  };

  const saveAll = async () => {
    const { data, error } = await supabase
      .from("user_socials")
      .upsert(socials.map((s, i) => ({ ...s, user_id: userId, order_index: i })));
    console.log("SaveAll upsert result:", data, error);
    if (error) toast.error("Failed to save all socials: " + error.message);

    toast.success("Socials saved");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative space-y-12">
      <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-cyan-500/10 to-blue-500/20 blur-3xl opacity-60 pointer-events-none" />
        <CardHeader>
          <CardTitle>Connect Your Socials</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex gap-2">
            <Input
              value={linktreeUrl}
              onChange={(e) => setLinktreeUrl(e.target.value)}
              placeholder="Paste Linktree URL"
            />
            <Button onClick={() => toast.info("Linktree import coming next")}>
              Import
            </Button>
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={socials.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead />
                    <TableHead>Platform</TableHead>
                    <TableHead>Handle</TableHead>
                    <TableHead>Stats</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {socials.map((s) => (
                    <SortableRow key={s.id} social={s} updateSocial={updateSocial} removeSocial={removeSocial} />
                  ))}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>

          <div className="flex gap-2">
            <Button onClick={() => addSocial()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Social
            </Button>

            <Button disabled={isPending} onClick={saveAll}>
              Save All
            </Button>
          </div>
        </CardContent>
      </Card>

      <UltraGiantCarousel onSelect={addSocial} />
    </div>
  );
}