import { FlameIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StreakCard({
  streakDays,
  weeklyGoalDone,
  weeklyGoalTarget,
  className,
}: {
  streakDays: number;
  weeklyGoalDone: number;
  weeklyGoalTarget: number;
  className?: string;
}) {
  const dayLabel = streakDays === 1 ? "day" : "days";

  return (
    <Card className={cn("justify-between gap-4 p-4", className)} size="sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-2xl",
            streakDays > 0
              ? "bg-streak/15 text-streak"
              : "bg-muted text-muted-foreground"
          )}
        >
          <FlameIcon className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-2xl leading-none font-bold tabular-nums">
            {streakDays}
          </p>
          <p className="text-xs text-muted-foreground">{dayLabel} streak</p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>This week</span>
          <span className="font-medium tabular-nums">
            {weeklyGoalDone}/{weeklyGoalTarget}
          </span>
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: weeklyGoalTarget }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 flex-1 rounded-full",
                index < weeklyGoalDone ? "bg-streak" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
      <p className="sr-only">
        {streakDays} day streak. {weeklyGoalDone} of {weeklyGoalTarget} weekly
        practice sessions complete.
      </p>
    </Card>
  );
}
