"use client";

import { useState, useTransition } from "react";
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

import {
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLink,
} from "react-icons/fa";

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

/* ---------------------------------------------------- */
/* Helpers */

function createEmptySocial(): SocialLink {
  return {
    id: crypto.randomUUID(),
    handle: "",
    enabled: true,
    platform: "unknown",
    followers: 0,
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
    case "twitter":
      return <FaTwitter />;
    case "instagram":
      return <FaInstagram />;
    case "tiktok":
      return <FaTiktok />;
    case "youtube":
      return <FaYoutube />;
    case "linktree":
      return <FaLink />;
    default:
      return <FaLink />;
  }
}

/* ---------------------------------------------------- */
/* Sortable Row */

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </TableCell>

      <TableCell>{getIcon(detectPlatform(social.handle))}</TableCell>

      <TableCell>
        <Input
          value={social.handle}
          placeholder="e.g., youtube.com/lionel"
          onChange={(e) =>
            updateSocial(social.id, "handle", e.target.value)
          }
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeSocial(social.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

/* ---------------------------------------------------- */
/* Main Component */

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

  /* ---------------- update ---------------- */
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
          enabled: s.enabled,
          platform: detectPlatform(s.handle),
        },
        { onConflict: "id" }
      );

      if (error) toast.error(error.message);
    });
  };

  /* ---------------- add ---------------- */
  const addSocial = async () => {
    setAdding(true);
    const newSocial = createEmptySocial();

    setSocials((prev) => [...prev, newSocial]);

    const { error } = await supabase.from("user_socials").insert({
      id: newSocial.id,
      user_id: userId,
      handle: "",
      enabled: true,
      platform: "unknown",
      order_index: socials.length,
    });

    if (error) toast.error(error.message);
    else toast.success("Added");

    setAdding(false);
  };

  /* ---------------- remove ---------------- */
  const removeSocial = async (id: string) => {
    const { error } = await supabase.from("user_socials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  /* ---------------- reorder ---------------- */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = socials.findIndex((s) => s.id === active.id);
    const newIndex = socials.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(socials, oldIndex, newIndex);
    setSocials(reordered);

    const payload = reordered.map((s, i) => ({
      id: s.id,
      user_id: userId,
      handle: s.handle,
      enabled: s.enabled,
      platform: detectPlatform(s.handle),
      order_index: i,
    }));

    const { error } = await supabase
      .from("user_socials")
      .upsert(payload, { onConflict: "id" });

    if (error) toast.error(error.message);
  };

  /* ---------------- save all ---------------- */
  const saveAll = async () => {
    startTransition(async () => {
      const payload = socials.map((s, i) => ({
        id: s.id,
        user_id: userId,
        handle: s.handle,
        enabled: s.enabled,
        platform: detectPlatform(s.handle),
        order_index: i,
      }));

      const { error } = await supabase
        .from("user_socials")
        .upsert(payload, { onConflict: "id" });

      if (error) toast.error(error.message);
      else toast.success("Saved");

      router.refresh();
    });
  };

  /* ---------------------------------------------------- */
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Socials</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={socials.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead></TableHead>
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
          <Button onClick={addSocial} disabled={adding}>
            <Plus className="h-4 w-4 mr-2" />
            Add Social
          </Button>

          <Button onClick={saveAll} disabled={isPending}>
            Save All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
