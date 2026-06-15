"use client";

import { useState } from "react";
import { FlaskConicalIcon, SparklesIcon } from "lucide-react";

import { DiagnosticProgressCard } from "@/components/diagnostic/diagnostic-progress-card";
import { DiagnosticReport } from "@/components/diagnostic/diagnostic-report";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createMockAnalysis } from "@/lib/ai/mock-analysis";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import { diagnosticPrompts } from "@/lib/diagnostic/prompts";
import type { DiagnosticReport as DiagnosticReportType } from "@/lib/types";

type StepState = {
  recordingId: string | null;
  analysis: SpeechAnalysisFeedback | null;
};

const initialSteps: StepState[] = diagnosticPrompts.map(() => ({
  recordingId: null,
  analysis: null,
}));

export function DiagnosticSession({
  initialDiagnostic,
}: {
  initialDiagnostic?: DiagnosticReportType | null;
}) {
  const [steps, setSteps] = useState<StepState[]>(initialSteps);
  const [diagnostic, setDiagnostic] = useState<DiagnosticReportType | null>(
    initialDiagnostic ?? null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const completedSteps = steps.filter((step) => step.analysis).length;

  function updateStep(index: number, nextStep: Partial<StepState>) {
    setSteps((current) =>
      current.map((step, stepIndex) =>
        stepIndex === index ? { ...step, ...nextStep } : step
      )
    );
  }

  function simulateDiagnostic() {
    const simulatedSteps = diagnosticPrompts.map((prompt, index) => {
      const recordingId = `mock-diagnostic-${index + 1}`;

      return {
        recordingId,
        analysis: createMockAnalysis({
          recordingId,
          userId: "mock-user",
          recordingType: "diagnostic",
          expectedText: prompt.text,
        }),
      };
    });

    setSteps(simulatedSteps);
    setMessage(
      "Mock diagnostic clips are ready. Generate your baseline report."
    );
  }

  async function generateBaseline() {
    const recordingIds = steps
      .map((step) => step.recordingId)
      .filter((recordingId): recordingId is string => Boolean(recordingId));
    const analyses = steps
      .map((step) => step.analysis)
      .filter((analysis): analysis is SpeechAnalysisFeedback =>
        Boolean(analysis)
      );

    if (recordingIds.length < 3 || analyses.length < 3) {
      setMessage("Analyse all three diagnostic recordings first.");
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/diagnostic/aggregate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordingIds, analyses }),
      });
      const payload = (await response.json()) as {
        diagnostic?: DiagnosticReportType;
        error?: string;
      };

      if (!response.ok || !payload.diagnostic) {
        throw new Error(payload.error ?? "Unable to generate baseline report.");
      }

      setDiagnostic(payload.diagnostic);
      setMessage("Baseline report generated.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate baseline report."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <DiagnosticProgressCard completedSteps={completedSteps} />
        <Alert>
          <FlaskConicalIcon className="size-4" />
          <AlertTitle>Mock-friendly diagnostic flow</AlertTitle>
          <AlertDescription>
            Record and analyse each prompt, or use mock analysed clips when your
            browser cannot access a microphone in local development.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={simulateDiagnostic} type="button" variant="outline">
          <FlaskConicalIcon data-icon="inline-start" />
          Use mock analysed clips
        </Button>
        <Button
          disabled={completedSteps < 3 || isGenerating}
          onClick={generateBaseline}
          type="button"
        >
          <SparklesIcon data-icon="inline-start" />
          {isGenerating ? "Generating..." : "Generate my baseline report"}
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6">
        {diagnosticPrompts.map((step, index) => (
          <RecordingUploadCard
            description={step.purpose}
            key={step.key}
            onAnalysisComplete={(recording, analysis) =>
              updateStep(index, {
                recordingId: recording.id,
                analysis,
              })
            }
            onRecordingSaved={(recording) =>
              updateStep(index, {
                recordingId: recording.id,
              })
            }
            practiceText={step.text}
            recordingType="diagnostic"
            redirectAnalysisToFeedback={false}
            title={`Step ${index + 1}: ${step.title}`}
          />
        ))}
      </div>

      {diagnostic ? <DiagnosticReport diagnostic={diagnostic} /> : null}
    </div>
  );
}
