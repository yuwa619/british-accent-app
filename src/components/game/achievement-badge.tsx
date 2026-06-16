import {
  CheckCircle2Icon,
  FlameIcon,
  LockIcon,
  MedalIcon,
  Mic2Icon,
  MusicIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/gamification";

const iconMap: Record<Achievement["icon"], LucideIcon> = {
  sparkles: SparklesIcon,
  target: TargetIcon,
  check: CheckCircle2Icon,
  flame: FlameIcon,
  trending: TrendingUpIcon,
  mic: Mic2Icon,
  medal: MedalIcon,
  music: MusicIcon,
};

export function AchievementBadge({
  achievement,
}: {
  achievement: Achievement;
}) {
  const Icon = achievement.earned ? iconMap[achievement.icon] : LockIcon;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors",
        achievement.earned
          ? "border-transparent bg-success/10 ring-1 ring-success/20"
          : "border-dashed bg-muted/40 opacity-70"
      )}
      title={achievement.description}
    >
      <span
        className={cn(
          "grid size-11 place-items-center rounded-full",
          achievement.earned
            ? "bg-success/15 text-success"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xs leading-tight font-medium">
        {achievement.label}
      </span>
      <span className="sr-only">
        {achievement.earned ? "Unlocked" : "Locked"}: {achievement.description}
      </span>
    </div>
  );
}
