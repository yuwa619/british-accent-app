import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "streak" | "xp" | "primary" | "success";

const toneClasses: Record<Tone, string> = {
  streak: "bg-streak/12 text-streak ring-streak/20",
  xp: "bg-xp/12 text-xp ring-xp/20",
  primary: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-success/12 text-success ring-success/20",
};

export function StatPill({
  icon: Icon,
  value,
  label,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  value: string;
  label?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ring-1 ring-inset tabular-nums",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span>{value}</span>
      {label ? (
        <span className="text-xs font-medium opacity-80">{label}</span>
      ) : null}
    </span>
  );
}
