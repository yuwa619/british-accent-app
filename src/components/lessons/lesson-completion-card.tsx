"use client";

import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

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
  const canComplete = typeof latestScore === "number";

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
        <p className="text-sm leading-6 text-muted-foreground">
          {canComplete
            ? `Latest analysed score: ${Math.round(latestScore)}/100. Mark this lesson complete when you are ready to move on.`
            : "Analyse a saved recording first, then mark this lesson complete."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={!canComplete || isComplete} onClick={markComplete}>
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
    </Card>
  );
}
