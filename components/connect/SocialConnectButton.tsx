// components/connect/SocialConnectButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  name: string;
  icon: React.ReactNode;
  platform: string;
  connectUrl: string; // e.g. /api/auth/youtube
  isConnected: boolean;
};

export function SocialConnectButton({
  name,
  icon,
  platform,
  connectUrl,
  isConnected,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    window.location.href = connectUrl;
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading || isConnected}
      variant={isConnected ? "default" : "outline"}
      className={`flex items-center gap-2 w-full justify-start ${
        isConnected ? "bg-green-600 text-white hover:bg-green-700" : ""
      }`}
    >
      {icon}
      <span>{isConnected ? `${name} Connected` : `Connect ${name}`}</span>
    </Button>
  );
}