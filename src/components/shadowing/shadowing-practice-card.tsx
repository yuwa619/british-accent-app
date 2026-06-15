"use client";

import { useMemo, useState } from "react";
import { HeadphonesIcon, Mic2Icon, WavesIcon } from "lucide-react";

import { ReferenceAudioCard } from "@/components/audio/reference-audio-card";
import { SideBySideComparison } from "@/components/lessons/side-by-side-comparison";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
import { PracticePromptSelector } from "@/components/shadowing/practice-prompt-selector";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import {
  analyseAudioBlob,
  type AudioVisualAnalysis,
} from "@/lib/audio/analyse-audio";
import {
  shadowingPrompts,
  type ShadowingPrompt,
} from "@/lib/shadowing-prompts";
import type { RecordingItem } from "@/lib/types";

export function ShadowingPracticeCard() {
  const [selectedPrompt, setSelectedPrompt] = useState<ShadowingPrompt>(
    shadowingPrompts[0]
  );
  const [latestRecording, setLatestRecording] = useState<RecordingItem | null>(
    null
  );
  const [latestFeedback, setLatestFeedback] =
    useState<SpeechAnalysisFeedback | null>(null);
  const [audioAnalysis, setAudioAnalysis] =
    useState<AudioVisualAnalysis | null>(null);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  const featureCards = useMemo(
    () => [
      {
        icon: HeadphonesIcon,
        title: "Listen to the reference",
        description:
          "Use the model phrase or text-mode fallback to notice rhythm, stress, and pace.",
      },
      {
        icon: Mic2Icon,
        title: "Record your version",
        description:
          "Capture a short attempt, preview it, and save only when you choose.",
      },
      {
        icon: WavesIcon,
        title: "Compare patterns",
        description:
          "Review duration, energy, approximate pitch movement, and coaching feedback.",
      },
    ],
    []
  );

  function handlePromptSelect(prompt: ShadowingPrompt) {
    setSelectedPrompt(prompt);
    setLatestRecording(null);
    setLatestFeedback(null);
    setAudioAnalysis(null);
    setAudioMessage(null);
  }

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
      <div className="grid gap-4 md:grid-cols-3">
        {featureCards.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-primary" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <PracticePromptSelector
        onSelect={handlePromptSelect}
        prompts={shadowingPrompts}
        selectedKey={selectedPrompt.key}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <ReferenceAudioCard
          text={selectedPrompt.text}
          title={`Reference: ${selectedPrompt.title}`}
        />
        <RecordingUploadCard
          description="Shadow the reference phrase, save your attempt, then analyse it for practical coaching feedback."
          onAnalysisComplete={(_, analysis) => setLatestFeedback(analysis)}
          onLocalAudioReady={handleLocalAudio}
          onRecordingSaved={setLatestRecording}
          practiceText={selectedPrompt.text}
          recordingType="shadowing"
          redirectAnalysisToFeedback={false}
          title="Your shadowing attempt"
        />
      </div>

      {audioMessage ? (
        <p className="text-sm text-muted-foreground" role="status">
          {audioMessage}
        </p>
      ) : null}

      <SideBySideComparison
        audioAnalysis={audioAnalysis}
        feedback={latestFeedback}
        referenceText={selectedPrompt.text}
        userRecording={latestRecording}
      />
    </div>
  );
}
