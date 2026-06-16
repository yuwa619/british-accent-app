import Link from "next/link";
import { ArrowRightIcon, ClockIcon, SparklesIcon, ZapIcon } from "lucide-react";

import { ProgressRing } from "@/components/game/progress-ring";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DailyMission, GameStats } from "@/lib/gamification";

export function DailyMissionCard({
  mission,
  stats,
  className,
}: {
  mission: DailyMission;
  stats: GameStats;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "animate-rise relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-5 text-primary-foreground ring-1 ring-foreground/10 sm:p-6",
        className
      )}
    >
      {/* soft decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-primary-foreground/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            Today&apos;s practice
          </span>
          <h2 className="text-xl leading-snug font-semibold text-balance sm:text-2xl">
            {mission.title}
          </h2>
          <p className="text-sm leading-6 text-primary-foreground/80">
            {mission.description}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1">
              <ZapIcon className="size-3.5" aria-hidden="true" />+
              {mission.xpReward} XP
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1">
              <ClockIcon className="size-3.5" aria-hidden="true" />~
              {mission.minutes} min
            </span>
          </div>

          <Link
            href={mission.href}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "tap-scale mt-2 w-full justify-center bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90 sm:w-fit"
            )}
          >
            {mission.ctaLabel}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>

        <div className="flex shrink-0 items-center justify-center sm:flex-col">
          <ProgressRing
            value={stats.dailyGoalProgress}
            size={120}
            strokeWidth={10}
            colorClassName="text-primary-foreground"
            trackClassName="text-primary-foreground"
            label="Daily practice goal"
          >
            <span className="flex flex-col items-center">
              <span className="text-2xl leading-none font-bold tabular-nums">
                {stats.dailyGoalDone}/{stats.dailyGoalTarget}
              </span>
              <span className="mt-1 text-[0.65rem] font-medium tracking-wide uppercase opacity-80">
                Daily goal
              </span>
            </span>
          </ProgressRing>
        </div>
      </div>
    </section>
  );
}
