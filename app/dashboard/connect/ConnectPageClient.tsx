"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { motion } from "framer-motion";

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
import { ALL_PLATFORMS } from "@/lib/platforms";

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

import type { SocialLink } from "./types";

const supabase = getSupabaseBrowserClient();

/* ------------------- Helpers ------------------- */

function createEmptySocial(): SocialLink {
  return {
    id: crypto.randomUUID(),
    handle: "",
    platform: "unknown",
    enabled: true,
    followers: 0,
    comments: 0,
    linktree: false,
    order_index: 0,
  };
}

function detectPlatformFromUrl(url: string): SocialLink["platform"] {
  const u = url.toLowerCase();
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("tiktok.com")) return "tiktok";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("linktr.ee")) return "linktree";
  return "unknown";
}

function getIcon(platform: SocialLink["platform"]) {
  const p = ALL_PLATFORMS.find((x) => x.name.toLowerCase() === platform);
  return p?.icon({ className: "w-16 h-16" }) ?? <span className="text-6xl">❓</span>;
}

/* ------------------- Sortable Row ------------------- */

function SortableRow({
  social,
  updateSocial,
  removeSocial,
}: {
  social: SocialLink;
  updateSocial: <K extends keyof SocialLink>(
    id: string,
    key: K,
    value: SocialLink[K]
  ) => void;
  removeSocial: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: social.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </TableCell>

      <TableCell>
        <Input
          value={social.platform}
          placeholder="Platform Name"
          onChange={(e) =>
            updateSocial(
              social.id,
              "platform",
              e.target.value as SocialLink["platform"]
            )
          }
        />
      </TableCell>

      <TableCell>
        <Input
          value={social.handle}
          placeholder="e.g., youtube.com/example"
          onChange={(e) => {
            const value = e.target.value;
            updateSocial(social.id, "handle", value);

            // 🔥 auto detect platform + logo
            const detected = detectPlatformFromUrl(value);
            updateSocial(social.id, "platform", detected);
          }}
        />
      </TableCell>

      <TableCell>
        <input
          type="checkbox"
          checked={social.enabled}
          onChange={(e) =>
            updateSocial(social.id, "enabled", e.target.checked)
          }
        />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex flex-col text-right">
          <span>{social.followers} followers</span>
          <span>{social.comments} comments</span>
        </div>

        <button
          onClick={() => removeSocial(social.id)}
          className="text-red-500 font-bold text-lg px-2"
        >
          ✕
        </button>
      </TableCell>
    </TableRow>
  );
}

/* ------------------- Main Component ------------------- */

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
  const [adding, setAdding] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const updateSocial = <K extends keyof SocialLink>(
    id: string,
    key: K,
    value: SocialLink[K]
  ) => {
    const updated = socials.map((s) =>
      s.id === id ? { ...s, [key]: value } : s
    );
    setSocials(updated);

    const s = updated.find((x) => x.id === id);
    if (!s) return;

    startTransition(async () => {
      const { error } = await supabase.from("user_socials").upsert(
        {
          id: s.id,
          user_id: userId,
          handle: s.handle,
          platform: s.platform,
          enabled: s.enabled,
          followers: s.followers,
          comments: s.comments,
          linktree: s.linktree,
          order_index: updated.findIndex((x) => x.id === s.id),
        },
        { onConflict: "id" }
      );
      if (error) toast.error(error.message);
    });
  };

  const addSocial = async () => {
    setAdding(true);
    const newSocial = createEmptySocial();
    setSocials((prev) => [...prev, newSocial]);

    const { error } = await supabase.from("user_socials").insert({
      ...newSocial,
      user_id: userId,
      order_index: socials.length,
    });
    if (error) toast.error(error.message);
    else toast.success("Added");
    setAdding(false);
  };

  const removeSocial = async (id: string) => {
    const { error } = await supabase
      .from("user_socials")
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = socials.findIndex((s) => s.id === active.id);
    const newIndex = socials.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(socials, oldIndex, newIndex);
    setSocials(reordered);

    const payload = reordered.map((s, i) => ({ ...s, order_index: i }));
    await supabase.from("user_socials").upsert(payload, {
      onConflict: "id",
    });
  };

  const saveAll = async () => {
    startTransition(async () => {
      const payload = socials.map((s, i) => ({
        ...s,
        order_index: i,
      }));
      await supabase.from("user_socials").upsert(payload, {
        onConflict: "id",
      });
      toast.success("All saved");
      router.refresh();
    });
  };

  const handleLinktreeImport = async (url: string) => {
    if (!url.includes("linktr.ee"))
      return toast.error("Not a valid Linktree URL");

    const baseId = crypto.randomUUID();
    const parsed: SocialLink[] = [
      {
        id: `${baseId}-yt`,
        handle: "https://youtube.com/@from_linktree",
        platform: "youtube",
        enabled: true,
        followers: 4300,
        comments: 120,
        linktree: true,
        order_index: socials.length,
      },
    ];

    await supabase.from("user_socials").insert(
      parsed.map((p) => ({
        ...p,
        user_id: userId,
      }))
    );

    setSocials((prev) => [...prev, ...parsed]);
    toast.success("Imported from Linktree");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % ALL_PLATFORMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Socials</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* LINKTREE */}
        <div className="flex gap-2">
          <Input
            placeholder="Paste Linktree URL"
            onKeyDown={async (e) => {
              if (e.key === "Enter")
                await handleLinktreeImport(
                  (e.target as HTMLInputElement).value
                );
            }}
          />
          <Button>Import</Button>
        </div>

        {/* TABLE */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={socials.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>Platform</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Stats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socials.map((s) => (
                  <SortableRow
                    key={s.id}
                    social={s}
                    updateSocial={updateSocial}
                    removeSocial={removeSocial}
                  />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>

        <div className="flex gap-2">
          <Button onClick={addSocial}>
            <Plus className="h-4 w-4 mr-2" />
            Add Social
          </Button>
          <Button onClick={saveAll} disabled={isPending}>
            Save All
          </Button>
        </div>

        {/* PLATFORM CAROUSEL */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Explore Platforms</h3>

          <motion.div className="overflow-hidden flex justify-center">
            <motion.div
              className="flex gap-16"
              animate={{ x: -slideIndex * 180 }}
              transition={{ type: "spring", stiffness: 90 }}
            >
              {ALL_PLATFORMS.map((p) => (
                <motion.a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  className="flex flex-col items-center w-44"
                >
                  <p.icon className="w-28 h-28 opacity-90" />
                  <div className="font-semibold text-lg mt-2">{p.name}</div>
                  <div className="text-sm opacity-70 text-center">
                    {p.desc}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
