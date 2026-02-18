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
import { Plus, Trash2 } from "lucide-react";
import type { SocialLink } from "./types";

const supabase = getSupabaseBrowserClient();

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
  return "unknown";
}

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

  /** Properly typed update function */
  const updateSocial = <K extends keyof SocialLink>(
    id: string,
    key: K,
    value: SocialLink[K]
  ) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const addSocial = async () => {
    setAdding(true);
    const newSocial = createEmptySocial();

    const { error } = await supabase
      .from("user_socials")
      .upsert(
        {
          id: newSocial.id,
          user_id: userId,
          handle: "",
          enabled: true,
          platform: "unknown",
        },
        { onConflict: "user_id,handle" }
      );

    if (error) {
      toast.error(error.message);
      setAdding(false);
      return;
    }

    setSocials((prev) => [...prev, newSocial]);
    toast.success("Social added");
    setAdding(false);
  };

  const removeSocial = async (id: string) => {
    const { error } = await supabase.from("user_socials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSocials((prev) => prev.filter((s) => s.id !== id));
    toast.success("Removed");
  };

  const saveAll = async () => {
    startTransition(async () => {
      const payload = socials.map((s) => ({
        id: s.id,
        user_id: userId,
        handle: s.handle,
        enabled: s.enabled,
        platform: detectPlatform(s.handle),
      }));

      const { error } = await supabase
        .from("user_socials")
        .upsert(payload, { onConflict: "user_id,handle" });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Saved");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Socials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Handle</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socials.map((social) => (
              <TableRow key={social.id}>
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
            ))}
          </TableBody>
        </Table>

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
