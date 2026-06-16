import { ZapIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GameStats } from "@/lib/gamification";

export function XpLevelCard({
  stats,
  className,
}: {
  stats: GameStats;
  className?: string;
}) {
  return (
    <Card className={cn("gap-3 p-4", className)} size="sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-xp/15 text-xp font-bold">
            {stats.level}
          </span>
          <div>
            <p className="text-sm leading-tight font-semibold">
              Level {stats.level} · {stats.levelTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.levelSubtitle}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-xp/12 px-2.5 py-1 text-sm font-semibold text-xp tabular-nums">
          <ZapIcon className="size-4" aria-hidden="true" />
          {stats.xp}
          <span className="text-xs font-medium opacity-80">XP</span>
        </span>
      </div>

      <div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={stats.progressToNext}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to next level"
        >
          <div
            className="h-full rounded-full bg-xp transition-[width] duration-700 ease-out"
            style={{ width: `${stats.progressToNext}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {stats.isMaxLevel
            ? "Top level reached — keep your streak alive."
            : `${stats.xpToNext} XP to level ${stats.level + 1}`}
        </p>
      </div>
    </Card>
  );
}
