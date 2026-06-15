"use client";

import { useState } from "react";
import { BookOpenTextIcon, LightbulbIcon } from "lucide-react";

import { ReferenceAudioCard } from "@/components/audio/reference-audio-card";
import { LessonCompletionCard } from "@/components/lessons/lesson-completion-card";
import {
  LessonStepNavigator,
  lessonFlowSteps,
} from "@/components/lessons/lesson-step-navigator";
import { SideBySideComparison } from "@/components/lessons/side-by-side-comparison";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import {
  analyseAudioBlob,
  type AudioVisualAnalysis,
} from "@/lib/audio/analyse-audio";
import type { LessonWithSteps, RecordingItem } from "@/lib/types";

function getPracticePhrases(lesson: LessonWithSteps, practiceText: string) {
  const stepPhrases = lesson.steps
    .map((step) => step.practice_text ?? step.reference_text)
    .filter((text): text is string => Boolean(text));
  const promptPhrases = lesson.prompts.map((prompt) => prompt.prompt_text);

  return Array.from(new Set([practiceText, ...stepPhrases, ...promptPhrases]))
    .filter(Boolean)
    .slice(0, 3);
}

export function LessonFlow({
  lesson,
  practiceText,
  promptId,
}: {
  lesson: LessonWithSteps;
  practiceText: string;
  promptId?: string | null;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [latestRecording, setLatestRecording] = useState<RecordingItem | null>(
    null
  );
  const [latestFeedback, setLatestFeedback] =
    useState<SpeechAnalysisFeedback | null>(null);
  const [audioAnalysis, setAudioAnalysis] =
    useState<AudioVisualAnalysis | null>(null);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(lesson.status === "complete");
  const phrases = getPracticePhrases(lesson, practiceText);

  async function handleLocalAudio(audioBlob: Blob) {
    setAudioMessage(null);

    try {
      setAudioAnalysis(await analyseAudioBlob(audioBlob));
    } catch {
      setAudioAnalysis(null);
      setAudioMessage(
        "The browser could not decode this clip for visual feedback. You can still listen back and analyse it."
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <LessonStepNavigator
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              Step {currentStep + 1} of {lessonFlowSteps.length}
            </Badge>
            <Badge variant="outline">{lessonFlowSteps[currentStep]}</Badge>
          </div>
          <CardTitle>
            {currentStep === 0
              ? "Why this matters"
              : currentStep === 1
                ? "Listen and notice"
                : currentStep === 2
                  ? "Shadow the phrase"
                  : currentStep === 3
                    ? "Record your version"
                    : currentStep === 4
                      ? "Compare your rhythm"
                      : currentStep === 5
                        ? "Analyse your attempt"
                        : "Complete and continue"}
          </CardTitle>
          <CardDescription>
            Move through the lesson at your own pace. Short, repeated attempts
            are more useful than one perfect take.
          </CardDescription>
        </CardHeader>
      </Card>

      {currentStep === 0 ? (
        <Card>
          <CardHeader>
            <BookOpenTextIcon className="size-5 text-primary" />
            <CardTitle>Learn the focus</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {lesson.steps.map((step) => (
              <div
                className="rounded-lg border bg-background p-4"
                key={step.id}
              >
                <p className="font-medium">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {currentStep === 1 || currentStep === 2 ? (
        <ReferenceAudioCard
          lessonId={lesson.id}
          promptId={promptId}
          text={practiceText}
          title={
            currentStep === 1
              ? "Listen to the reference"
              : "Shadow the reference phrase"
          }
        />
      ) : null}

      {currentStep === 2 ? (
        <Card>
          <CardHeader>
            <LightbulbIcon className="size-5 text-primary" />
            <CardTitle>Practice phrases</CardTitle>
            <CardDescription>
              Try one phrase slowly, then repeat it at a natural workplace pace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {phrases.map((phrase) => (
              <blockquote
                className="rounded-lg border bg-muted/40 p-4 leading-7"
                key={phrase}
              >
                {phrase}
              </blockquote>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {currentStep === 3 || currentStep === 5 ? (
        <RecordingUploadCard
          description="Record, preview, save, then analyse the attempt without leaving the lesson."
          lessonId={lesson.id}
          onAnalysisComplete={(_, analysis) => {
            setLatestFeedback(analysis);
            setCurrentStep(4);
          }}
          onLocalAudioReady={handleLocalAudio}
          onRecordingSaved={setLatestRecording}
          practiceText={practiceText}
          promptId={promptId}
          recordingType="lesson"
          redirectAnalysisToFeedback={false}
          title="Record your lesson attempt"
        />
      ) : null}

      {audioMessage ? (
        <p className="text-sm text-muted-foreground" role="status">
          {audioMessage}
        </p>
      ) : null}

      {currentStep === 4 ? (
        <SideBySideComparison
          audioAnalysis={audioAnalysis}
          feedback={latestFeedback}
          referenceText={practiceText}
          userRecording={latestRecording}
        />
      ) : null}

      {currentStep === 6 ? (
        <LessonCompletionCard
          isComplete={isComplete}
          latestScore={
            latestFeedback?.overall_score ?? lesson.latest_score ?? null
          }
          lessonId={lesson.id}
          lessonSlug={lesson.slug}
          onComplete={() => setIsComplete(true)}
        />
      ) : null}
    </div>
  );
}
