import Link from "next/link";
import { BarChart3Icon, HeadphonesIcon, Mic2Icon } from "lucide-react";

import { IntensityFeedbackPanel } from "@/components/audio/intensity-feedback-panel";
import { PitchFeedbackPanel } from "@/components/audio/pitch-feedback-panel";
import { AudioPlayer } from "@/components/recording/audio-player";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import type { AudioVisualAnalysis } from "@/lib/audio/analyse-audio";
import type { RecordingItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SideBySideComparison({
  referenceText,
  userRecording,
  feedback,
  audioAnalysis,
}: {
  referenceText: string;
  userRecording: RecordingItem | null;
  feedback: SpeechAnalysisFeedback | null;
  audioAnalysis: AudioVisualAnalysis | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <BarChart3Icon className="size-5 text-primary" />
          <CardTitle>Compare your rhythm</CardTitle>
          <CardDescription>
            Listen back and compare duration, energy, and the coaching summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <HeadphonesIcon className="mb-3 size-5 text-primary" />
            <p className="font-medium">Reference phrase</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {referenceText}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <Mic2Icon className="mb-3 size-5 text-primary" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">Your recording</p>
              {feedback ? (
                <Badge variant="secondary">
                  {Math.round(feedback.overall_score)}/100
                </Badge>
              ) : null}
            </div>
            {userRecording?.local_audio_url ? (
              <div className="mt-3">
                <AudioPlayer
                  label="Your saved attempt"
                  src={userRecording.local_audio_url}
                />
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Save a recording to compare it with the reference phrase.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <IntensityFeedbackPanel analysis={audioAnalysis} />
        <PitchFeedbackPanel analysis={audioAnalysis} />
      </div>

      {feedback ? (
        <Card>
          <CardHeader>
            <CardTitle>Mini feedback</CardTitle>
            <CardDescription>
              A short summary from your latest analysed attempt.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="leading-7 text-muted-foreground">
              {feedback.ai_summary}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium">What went well</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feedback.one_thing_done_well}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium">What to practise next</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feedback.next_exercise}
                </p>
              </div>
            </div>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
              href={`/feedback/${feedback.recording_id}`}
            >
              Open full feedback
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
