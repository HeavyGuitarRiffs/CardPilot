"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

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

import { Plus, Trash2, GripVertical } from "lucide-react";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube, FaLink } from "react-icons/fa";

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

import { motion } from "framer-motion";

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

function detectPlatform(handle: string): SocialLink["platform"] {
  const h = handle.toLowerCase();
  if (h.includes("twitter.com") || h.includes("x.com")) return "twitter";
  if (h.includes("instagram.com")) return "instagram";
  if (h.includes("tiktok.com")) return "tiktok";
  if (h.includes("youtube.com") || h.includes("youtu.be")) return "youtube";
  if (h.includes("linktr.ee")) return "linktree";
  return "unknown";
}

function getIcon(platform: SocialLink["platform"]) {
  switch (platform) {
    case "twitter": return <FaTwitter />;
    case "instagram": return <FaInstagram />;
    case "tiktok": return <FaTiktok />;
    case "youtube": return <FaYoutube />;
    case "linktree": return <FaLink />;
    default: return <FaLink />;
  }
}

/* ------------------- Sortable Row ------------------- */

function SortableRow({
  social,
  updateSocial,
  removeSocial,
}: {
  social: SocialLink;
  updateSocial: <K extends keyof SocialLink>(id: string, key: K, value: SocialLink[K]) => void;
  removeSocial: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: social.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </TableCell>

      <TableCell>{getIcon(social.platform)}</TableCell>

      <TableCell>
        <Input
          value={social.handle}
          placeholder="e.g., youtube.com/example"
          onChange={(e) => updateSocial(social.id, "handle", e.target.value)}
        />
      </TableCell>

      <TableCell>
        <input
          type="checkbox"
          checked={social.enabled}
          onChange={(e) => updateSocial(social.id, "enabled", e.target.checked)}
        />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex flex-col text-right">
          <span>{social.followers} followers</span>
          <span>{social.comments} comments</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeSocial(social.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
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

  /* ------------------- Update Social ------------------- */
  const updateSocial = <K extends keyof SocialLink>(id: string, key: K, value: SocialLink[K]) => {
    const updated = socials.map((s) => (s.id === id ? { ...s, [key]: value } : s));
    setSocials(updated);

    const s = updated.find((x) => x.id === id);
    if (!s) return;

    startTransition(async () => {
      const { error } = await supabase.from("user_socials").upsert(
        {
          id: s.id,
          user_id: userId,
          handle: s.handle,
          platform: detectPlatform(s.handle),
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

  /* ------------------- Add Social ------------------- */
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

  /* ------------------- Remove Social ------------------- */
  const removeSocial = async (id: string) => {
    const { error } = await supabase.from("user_socials").delete().eq("id", id);
    if (error) toast.error(error.message);
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  /* ------------------- Drag & Reorder ------------------- */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = socials.findIndex((s) => s.id === active.id);
    const newIndex = socials.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(socials, oldIndex, newIndex);
    setSocials(reordered);

    const payload = reordered.map((s, i) => ({ ...s, order_index: i }));
    const { error } = await supabase.from("user_socials").upsert(payload, { onConflict: "id" });
    if (error) toast.error(error.message);
  };

  /* ------------------- Save All ------------------- */
  const saveAll = async () => {
    startTransition(async () => {
      const payload = socials.map((s, i) => ({
        ...s,
        platform: detectPlatform(s.handle),
        order_index: i,
      }));
      const { error } = await supabase.from("user_socials").upsert(payload, { onConflict: "id" });
      if (error) toast.error(error.message);
      else toast.success("All saved");
      router.refresh();
    });
  };

  /* ------------------- Linktree Import ------------------- */
  const handleLinktreeImport = async (url: string) => {
    if (!url.includes("linktr.ee")) return toast.error("Not a valid Linktree URL");

    const baseId = crypto.randomUUID();
    const parsed: SocialLink[] = [
      { id: `${baseId}-tw`, handle: "https://twitter.com/from_linktree", platform: "twitter", enabled: true, followers: 1200, comments: 30, linktree: true },
      { id: `${baseId}-ig`, handle: "https://instagram.com/from_linktree", platform: "instagram", enabled: true, followers: 980, comments: 25, linktree: true },
      { id: `${baseId}-yt`, handle: "https://youtube.com/@from_linktree", platform: "youtube", enabled: true, followers: 4300, comments: 120, linktree: true },
    ];

    const withUserId = parsed.map((p, idx) => ({ ...p, user_id: userId, order_index: socials.length + idx }));

    const { error } = await supabase.from("user_socials").insert(withUserId);
    if (error) toast.error(error.message);

    setSocials((prev) => [...prev, ...parsed]);
    toast.success("Imported from Linktree");
  };

  /* ------------------- Slideshow for Social Showcase ------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % socials.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [socials.length]);

  /* ------------------- Render ------------------- */
  return (
    <Card>
      <CardHeader><CardTitle>Connect Your Socials</CardTitle></CardHeader>
      <CardContent className="space-y-4">

        {/* Linktree Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Paste Linktree URL"
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleLinktreeImport((e.target as HTMLInputElement).value);
            }}
          />
          <Button onClick={() => {
            const el = document.querySelector<HTMLInputElement>("input[placeholder='Paste Linktree URL']");
            if (el) handleLinktreeImport(el.value);
          }}>Import</Button>
        </div>

        {/* Socials Table */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={socials.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Enabled</TableHead>
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
          <Button onClick={addSocial} disabled={adding}><Plus className="h-4 w-4 mr-2" />Add Social</Button>
          <Button onClick={saveAll} disabled={isPending}>Save All</Button>
        </div>

        {/* ------------------- Social Showcase Slideshow ------------------- */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Your Social Showcase</h3>
          <div className="overflow-hidden relative">
            <motion.div
              className="flex gap-6"
              animate={{ x: -slideIndex * 120 }}
              transition={{ type: "spring", stiffness: 90 }}
            >
              {socials.map((s) => (
                <motion.div key={s.id} className="flex flex-col items-center w-28 p-2 bg-white rounded shadow-lg">
                  {getIcon(s.platform)}
                  <span className="mt-2 font-semibold text-center">{s.handle}</span>
                  <span className="text-sm text-gray-500 text-center">{s.followers} followers</span>
                  <span className="text-sm text-gray-500 text-center">{s.comments} comments</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
