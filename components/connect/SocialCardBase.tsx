// components/connect/SocialCardBase.tsx
import type { ReactNode } from "react";

type SocialCardBaseProps = {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
};

export function SocialCardBase({ icon, title, children }: SocialCardBaseProps) {
  return (
    <div
      className="
        flex items-center justify-between
        p-4 rounded-xl border
        bg-base-100 shadow-sm
        hover:shadow-md transition
        dark:bg-neutral dark:border-neutral-700
      "
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{title}</span>
      </div>

      {children}
    </div>
  );
}