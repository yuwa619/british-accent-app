"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";

export function AnalyseRecordingButton({
  recordingId,
  expectedText,
  lessonId,
  promptId,
  onAnalysed,
  redirectToFeedback = true,
}: {
  recordingId: string;
  expectedText?: string | null;
  lessonId?: string | null;
  promptId?: string | null;
  onAnalysed?: (analysis: SpeechAnalysisFeedback) => void;
  redirectToFeedback?: boolean;
}) {
  const router = useRouter();
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyseRecording() {
    setIsAnalysing(true);
    setError(null);

    try {
      const response = await fetch("/api/speech/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordingId,
          expectedText,
          lessonId,
          promptId,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        analysis?: SpeechAnalysisFeedback;
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "Unable to analyse this recording right now."
        );
      }

      if (payload?.analysis) {
        onAnalysed?.(payload.analysis);
      }

      if (redirectToFeedback) {
        router.push(`/feedback/${recordingId}`);
      }
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to analyse this recording right now."
      );
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button disabled={isAnalysing} onClick={analyseRecording} type="button">
        <SparklesIcon data-icon="inline-start" />
        {isAnalysing ? "Analysing..." : "Analyse recording"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
