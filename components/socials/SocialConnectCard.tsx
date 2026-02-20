//components\socials\SocialConnectCard.tsx

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const supabase = createClient();

interface SocialConnectCardProps {
  platformId: string;      // e.g., "instagram"
  platformName: string;    // e.g., "Instagram"
  platformIcon: string;    // icon path
  onSuccess: () => void;
}

export default function SocialConnectCard({
  platformId,
  platformName,
  platformIcon,
  onSuccess,
}: SocialConnectCardProps) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  async function connect() {
    if (!handle) return;

    setLoading(true);

    try {
      // 1. get logged in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // 2. insert row
      const { error: insertError } = await supabase
        .from("user_socials")
        .insert({
          user_id: user.id,
          platform: platformId,
          handle,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      toast.success(`${platformName} connected successfully`);
      setHandle("");
      onSuccess();
    } catch (err) {
      console.error("Connect error:", err);
      toast.error("Failed to connect account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Image
            src={platformIcon}
            alt={platformName}
            width={32}
            height={32}
            className="rounded-md"
          />
          <p className="font-semibold text-lg">{platformName}</p>
        </div>

        {/* Input */}
        <Input
          placeholder={`Enter your ${platformName} username or URL`}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="h-11"
        />

        {/* Connect button */}
        <Button
          className={cn(
            "w-full h-11 font-semibold transition",
            loading && "opacity-80"
          )}
          disabled={!handle || loading}
          onClick={connect}
        >
          {loading ? "Connecting..." : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}