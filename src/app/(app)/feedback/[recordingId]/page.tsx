import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenTextIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { AnalysisErrorState } from "@/components/feedback/analysis-error-state";
import { FeedbackScoreCard } from "@/components/feedback/feedback-score-card";
import { FeedbackRecordingControls } from "@/components/feedback/feedback-recording-controls";
import { FeedbackSummary } from "@/components/feedback/feedback-summary";
import { NextExerciseCard } from "@/components/feedback/next-exercise-card";
import { SoundFeedbackList } from "@/components/feedback/sound-feedback-list";
import { TranscriptCard } from "@/components/feedback/transcript-card";
import { WordFeedbackList } from "@/components/feedback/word-feedback-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecordingWithAnalysis } from "@/lib/data/analysis";
import { getRecordingTypeLabel } from "@/lib/recordings";
import { cn } from "@/lib/utils";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ recordingId: string }>;
}) {
  const { recordingId } = await params;
  const result = await getRecordingWithAnalysis(recordingId);

  if (!result?.feedback) {
    return <AnalysisErrorState />;
  }

  const { feedback, recording } = result;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-fit no-underline"
          )}
          href="/dashboard"
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to dashboard
        </Link>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {getRecordingTypeLabel(recording.recording_type)}
          </Badge>
          {feedback.is_mock ? (
            <Badge variant="outline">Mock analysis</Badge>
          ) : null}
          <Badge variant="outline">{feedback.provider}</Badge>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FeedbackSummary
          doneWell={feedback.one_thing_done_well}
          improve={feedback.one_thing_to_improve}
          summary={feedback.ai_summary}
        />
        <NextExerciseCard exercise={feedback.next_exercise} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FeedbackScoreCard
          helper="A combined guide to how easy the recording was to follow."
          label="Overall clarity"
          score={feedback.overall_score}
        />
        <FeedbackScoreCard
          helper="How clearly individual words and sounds were recognised."
          label="Pronunciation"
          score={feedback.pronunciation_score}
        />
        <FeedbackScoreCard
          helper="How naturally the sentence stress and flow came through."
          label="Rhythm"
          score={feedback.rhythm_score}
        />
        <FeedbackScoreCard
          helper="How well the pitch movement supported the message."
          label="Intonation"
          score={feedback.intonation_score}
        />
        <FeedbackScoreCard
          helper="Whether the pace supported clear listening."
          label="Pace"
          score={feedback.pace_score}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <TranscriptCard
          suggestedCorrection={feedback.suggested_correction}
          transcript={feedback.transcript}
        />
        <WordFeedbackList items={feedback.word_feedback} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SoundFeedbackList items={feedback.sound_feedback} />
        <Card>
          <CardHeader>
            <ShieldCheckIcon className="size-5 text-primary" />
            <CardTitle>Guidance, not judgement</CardTitle>
            <CardDescription>
              Your voice data should stay understandable and under your control.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>{feedback.confidence_note}</p>
            <FeedbackRecordingControls
              recordingId={recording.id}
              recordingType={recording.recording_type}
            />
            {feedback.missed_words.length ? (
              <div>
                <p className="font-medium text-foreground">Missed words</p>
                <p>{feedback.missed_words.join(", ")}</p>
              </div>
            ) : (
              <p>No missed words were highlighted for this recording.</p>
            )}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "no-underline"
                )}
                href="/lessons"
              >
                <BookOpenTextIcon data-icon="inline-start" />
                Continue lessons
              </Link>
              <Link
                className={cn(buttonVariants(), "no-underline")}
                href="/dashboard"
              >
                <LayoutDashboardIcon data-icon="inline-start" />
                Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
