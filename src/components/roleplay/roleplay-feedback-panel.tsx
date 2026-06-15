import Link from "next/link";
import { CheckCircle2Icon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RoleplayFeedback } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoleplayFeedbackPanel({
  feedback,
}: {
  feedback: RoleplayFeedback;
}) {
  return (
    <Card>
      <CardHeader>
        <SparklesIcon className="size-5 text-primary" />
        <CardTitle>Your practice summary</CardTitle>
        <CardDescription>
          Scores are guidance to help you notice patterns over time, not a
          judgement of your voice.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="leading-7 text-muted-foreground">
          {feedback.overall_summary}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Clarity", feedback.clarity_score],
            ["Confidence", feedback.confidence_score],
            ["Structure", feedback.structure_score],
          ].map(([label, value]) => (
            <div className="rounded-lg border bg-background p-4" key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}/100</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <CheckCircle2Icon className="mb-2 size-5 text-primary" />
            <p className="font-medium">What went well</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feedback.what_went_well}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">One focus for next time</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feedback.one_thing_to_improve}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-medium">Pronunciation and rhythm observation</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {feedback.pronunciation_rhythm_observation}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {feedback.suggested_phrases.map((phrase) => (
            <Badge key={phrase} variant="outline">
              {phrase}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Recommended next lesson</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {feedback.recommended_next_lesson.title}
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "no-underline"
            )}
            href={`/lessons/${feedback.recommended_next_lesson.slug}`}
          >
            Open lesson
          </Link>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {feedback.encouragement}
        </p>
      </CardContent>
    </Card>
  );
}
