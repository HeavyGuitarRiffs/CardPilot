// app/dashboard/connect/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { SocialConnectButton } from "@/components/connect/SocialConnectButton";
import { CONNECT_PLATFORMS } from "@/lib/platforms/connectList";

export default async function ConnectPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: socials } = await supabase
    .from("user_socials")
    .select("platform")
    .eq("user_id", user.id);

  const connected = new Set(socials?.map((s) => s.platform));

  return (
    <main className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Connect Your Socials</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONNECT_PLATFORMS.map((p) => (
          <SocialConnectButton
            key={p.platform}
            name={p.name}
            icon={p.icon}
            platform={p.platform}
            connectUrl={p.connectUrl}
            isConnected={connected.has(p.platform)}
          />
        ))}
      </div>
    </main>
  );
}