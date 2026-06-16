"use client";

import { useState } from "react";
import { CheckCircle2Icon, ZapIcon } from "lucide-react";

import Link from "next/link";

import { CelebrationOverlay } from "@/components/game/celebration-overlay";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LessonCompletionCard({
  lessonId,
  lessonSlug,
  latestScore,
  isComplete,
  onComplete,
}: {
  lessonId: string;
  lessonSlug: string;
  latestScore: number | null;
  isComplete: boolean;
  onComplete: () => void;
}) {
  const [celebrate, setCelebrate] = useState(false);
  const canComplete = typeof latestScore === "number";
  const xpReward =
    50 + (typeof latestScore === "number" ? Math.round(latestScore / 5) : 0);

  async function markComplete() {
    await fetch("/api/progress/lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lessonId,
        status: "complete",
        lastScore: latestScore,
      }),
    }).catch(() => undefined);

    onComplete();
    setCelebrate(true);
  }

  return (
    <Card>
      <CardHeader>
        <CheckCircle2Icon className="size-5 text-primary" />
        <CardTitle>
          {isComplete ? "Lesson completed" : "Complete lesson"}
        </CardTitle>
        <CardDescription>
          Finish after you have recorded and analysed a practice attempt.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-xp/12 text-xp">
            <ZapIcon className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-6 text-muted-foreground">
            {canComplete
              ? `Latest analysed score: ${Math.round(latestScore)}/100. Mark this lesson complete to bank +${xpReward} XP.`
              : "Analyse a saved recording first, then mark this lesson complete to earn XP."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="tap-scale"
            disabled={!canComplete || isComplete}
            onClick={markComplete}
          >
            <CheckCircle2Icon data-icon="inline-start" />
            {isComplete ? "Completed" : "Mark lesson as complete"}
          </Button>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "no-underline"
            )}
            href={`/lessons/${lessonSlug}`}
          >
            Review lesson
          </Link>
        </div>
      </CardContent>

      <CelebrationOverlay
        open={celebrate}
        onClose={() => setCelebrate(false)}
        title="Lesson complete!"
        subtitle="Nicely done. Every rep makes your British speech clearer and more confident."
        xpEarned={xpReward}
      />
    </Card>
  );
}
