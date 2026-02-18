"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { countries } from "@/lib/countries";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import SocialArchetypeCard from "@/components/profile/SocialArchetypeCard";
import HighlightedComments from "@/components/dashboard/HighlightedComments";
import AvatarUploader from "@/components/profile/AvatarUploader";

import type { UserAvatar, SocialLink } from "./types";

const supabase = createClient();

type ProfilePageClientProps = {
  initialProfile: UserAvatar;
  initialSocials: SocialLink[];
  userId: string;
};

export default function ProfilePageClient({
  initialProfile,
  initialSocials,
  userId,
}: ProfilePageClientProps) {
  const [displayName, setDisplayName] = useState(
    initialProfile.display_name ?? ""
  );
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [country, setCountry] = useState(initialProfile.country ?? "");

  const [avatar, setAvatar] = useState<string>(
    initialProfile.avatar_url ?? ""
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [socialArchetype, setSocialArchetype] = useState<string | null>(
    initialProfile.social_archetype ?? null
  );

  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);

  const [saving, setSaving] = useState(false);

  const completion =
    (displayName ? 25 : 0) +
    (country ? 25 : 0) +
    (bio ? 25 : 0) +
    (avatar ? 25 : 0);

  const highlightedComments = [
    "This post went viral! 🚀",
    "Loved this insight on growth hacking.",
    "Comment streak achieved!",
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleAvatarUploaderChange = (base64: string) => {
    setAvatar(base64);
    setAvatarFile(null);
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      let avatar_url = initialProfile.avatar_url ?? "";

      if (avatarFile) {
        const path = `${userId}/${avatarFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = data.publicUrl;
      }

      if (!avatarFile && avatar && avatar.startsWith("data:image")) {
        avatar_url = avatar;
      }

      const { error: profileError } = await supabase.from("user_avatars").upsert({
        user_id: userId,
        avatar_url,
        display_name: displayName,
        bio,
        country,
        social_archetype: socialArchetype,
      });

      if (profileError) throw profileError;

      for (const social of socials) {
        if (!social.handle) continue;

        const { error } = await supabase.from("user_socials").upsert({
          id: social.id,
          user_id: userId,
          handle: social.handle,
          enabled: social.enabled,
          linktree: social.linktree ?? false,
        });

        if (error) throw error;
      }

      toast.success("Profile updated!");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      console.error("SUPABASE ERROR:", error.message);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-3xl">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          {/* INFO TAB */}
          <TabsContent value="info" className="space-y-8">
            <div className="space-y-3 text-center">
              <span className="text-sm">Profile completion</span>
              <Badge variant="secondary">{completion}%</Badge>
              <progress
                className="progress progress-primary w-full"
                value={completion}
                max={100}
              />
            </div>

            <div className="flex flex-col items-center gap-6">
              <HoverCard>
                <HoverCardTrigger>
                  <Avatar className="w-20 h-20">
                    {avatar ? (
                      <AvatarImage src={avatar} alt="Avatar" />
                    ) : (
                      <AvatarFallback>📷</AvatarFallback>
                    )}
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">
                    This avatar appears on leaderboards and comments.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <Input type="file" accept="image/*" onChange={handleAvatarChange} />
              <AvatarUploader onAvatarChange={handleAvatarUploaderChange} />
            </div>

            <Input
              placeholder="Creator123"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Textarea
              placeholder="Building in public · Daily commenting"
              maxLength={140}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {country
                    ? `${
                        countries.find((c) => c.name === country)?.flag ?? ""
                      } ${country}`
                    : "Select country"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList className="max-h-64 overflow-y-auto">
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.name}
                          value={c.name}
                          onSelect={() => setCountry(c.name)}
                        >
                          <span className="mr-2">{c.flag}</span>
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </TabsContent>

          {/* SOCIAL TAB */}
          <TabsContent value="social" className="space-y-6">
            <SocialArchetypeCard
              value={socialArchetype}
              onChange={setSocialArchetype}
            />

            <Separator />

            {socials.map((s) => {
              const power = s.metrics?.power_level ?? 0;


              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-1/4">{s.handle}</span>
                  <progress
                    className="progress progress-accent w-3/4"
                    value={power}
                    max={1000}
                  />
                  <Badge variant="secondary">{power}</Badge>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="preferences" className="text-center">
            <h2 className="text-lg font-semibold">Engagement Preferences</h2>
            <Separator />
          </TabsContent>

          <TabsContent value="comments">
            <HighlightedComments initialComments={highlightedComments} />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center">
          <Button
            className="w-full max-w-sm"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Profile"}
          </Button>
        </div>
      </div>
    </main>
  );
}
