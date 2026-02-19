"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildShareLinks } from "./socialShareLinks";

type Props = {
  open: boolean;
  onClose: () => void;
  chartUrl: string;
  title: string;
};

export function ShareChartModal({ open, onClose, chartUrl, title }: Props) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Share Analytics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {socials.map((s) => (
            <a key={s.key} href={links[s.key]} target="_blank">
              <Button variant="outline" className="w-full">
                {s.label}
              </Button>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
