import { CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";

import { FeedbackScoreCard } from "@/components/feedback/feedback-score-card";
import { FocusAreasPanel } from "@/components/diagnostic/focus-areas-panel";
import { PracticePlanCard } from "@/components/diagnostic/practice-plan-card";
import { RecommendedLessonsPanel } from "@/components/diagnostic/recommended-lessons-panel";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DiagnosticReport as DiagnosticReportType } from "@/lib/types";

export function DiagnosticReport({
  diagnostic,
}: {
  diagnostic: DiagnosticReportType;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Baseline complete</Badge>
            {diagnostic.is_mock ? (
              <Badge variant="outline">Mock mode</Badge>
            ) : null}
          </div>
          <CardTitle>Your baseline</CardTitle>
          <CardDescription>{diagnostic.summary}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {diagnostic.strengths.map((strength) => (
            <div className="rounded-lg border bg-background p-4" key={strength}>
              <CheckCircle2Icon className="mb-3 size-5 text-primary" />
              <p className="font-medium">What you are doing well</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {strength}
              </p>
            </div>
          ))}
          <div className="rounded-lg border bg-background p-4">
            <ShieldCheckIcon className="mb-3 size-5 text-primary" />
            <p className="font-medium">How to read the scores</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Scores are guidance to help you notice speech patterns over time,
              not a judgement of your voice or identity.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FeedbackScoreCard
          helper="A combined starting point from your three diagnostic clips."
          label="Overall"
          score={diagnostic.overall_score}
        />
        <FeedbackScoreCard
          helper="Clarity of individual words and sounds."
          label="Pronunciation"
          score={diagnostic.pronunciation_score}
        />
        <FeedbackScoreCard
          helper="Stress, flow, and connected speech."
          label="Rhythm"
          score={diagnostic.rhythm_score}
        />
        <FeedbackScoreCard
          helper="Pitch movement for questions and statements."
          label="Intonation"
          score={diagnostic.intonation_score}
        />
        <FeedbackScoreCard
          helper="Whether the pace supports easy listening."
          label="Pace"
          score={diagnostic.pace_score}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <FocusAreasPanel focusAreas={diagnostic.focus_areas} />
        <RecommendedLessonsPanel lessons={diagnostic.recommended_lessons} />
      </div>

      <PracticePlanCard items={diagnostic.practice_plan} />
    </div>
  );
}
