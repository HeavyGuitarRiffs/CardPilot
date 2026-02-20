//components\dashboard\ShareChartModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildShareLinks } from "./socialShareLinks";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  chartUrl: string;
  title: string;
  subtitle?: string;
};

export function ShareChartModal({
  open,
  onClose,
  chartUrl,
  title,
  subtitle,
}: Props) {
  const links = buildShareLinks(chartUrl, title);

  const socials = [
    { key: "twitter", label: "Twitter" },
    { key: "facebook", label: "Facebook" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "reddit", label: "Reddit" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "telegram", label: "Telegram" },
    { key: "email", label: "Email" },
  ] as const;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(links.copy);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </DialogHeader>

        {/* Social share buttons */}
        <div className="grid grid-cols-2 gap-3">
          {socials.map((s) => (
            <a
              key={s.key}
              href={links[s.key]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                {s.label}
              </Button>
            </a>
          ))}
        </div>

        {/* Copy link button */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleCopy}
        >
          Copy Link
        </Button>
      </DialogContent>
    </Dialog>
  );
}