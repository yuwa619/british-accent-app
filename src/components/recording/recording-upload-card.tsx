"use client";

import { RotateCcwIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

import { AudioPlayer } from "@/components/recording/audio-player";
import { MicrophonePermissionHelp } from "@/components/recording/microphone-permission-help";
import { RecordingButton } from "@/components/recording/recording-button";
import { RecordingList } from "@/components/recording/recording-list";
import { RecordingPrivacyNotice } from "@/components/recording/recording-privacy-notice";
import { RecordingStatusBadge } from "@/components/recording/recording-status-badge";
import { RecordingTimer } from "@/components/recording/recording-timer";
import { WaveformPreview } from "@/components/recording/waveform-preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import {
  formatRecordingDuration,
  maxRecordingBytes,
  maxRecordingSeconds,
} from "@/lib/recordings";
import type { RecordingItem, RecordingType } from "@/lib/types";

type UploadStatus = "idle" | "uploading" | "uploaded" | "failed";

export function RecordingUploadCard({
  title,
  description,
  recordingType,
  lessonId,
  promptId,
  practiceText,
  initialRecordings = [],
}: {
  title: string;
  description: string;
  recordingType: RecordingType;
  lessonId?: string | null;
  promptId?: string | null;
  practiceText?: string | null;
  initialRecordings?: RecordingItem[];
}) {
  const recorder = useAudioRecorder();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [savedRecordings, setSavedRecordings] =
    useState<RecordingItem[]>(initialRecordings);

  async function uploadRecording() {
    if (!recorder.audioBlob) {
      setUploadStatus("failed");
      setUploadMessage("Record a clip before saving.");
      return;
    }

    if (recorder.audioBlob.size === 0) {
      setUploadStatus("failed");
      setUploadMessage("The recording is empty. Please record again.");
      return;
    }

    if (recorder.audioBlob.size > maxRecordingBytes) {
      setUploadStatus("failed");
      setUploadMessage(
        "This recording is too large. Please record a shorter clip."
      );
      return;
    }

    const formData = new FormData();
    formData.append("audio", recorder.audioBlob, "recording.webm");
    formData.append("recording_type", recordingType);
    formData.append("duration_seconds", String(recorder.duration));

    if (lessonId) formData.append("lesson_id", lessonId);
    if (promptId) formData.append("prompt_id", promptId);

    setUploadStatus("uploading");
    setUploadMessage(null);

    try {
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        recording?: RecordingItem;
        mode?: "mock" | "supabase";
        error?: string;
      };

      if (!response.ok || !payload.recording) {
        throw new Error(payload.error ?? "Unable to save recording.");
      }

      const savedRecording: RecordingItem = {
        ...payload.recording,
        local_audio_url: recorder.audioUrl ?? undefined,
      };

      setSavedRecordings((current) => [savedRecording, ...current]);
      setUploadStatus("uploaded");
      setUploadMessage(
        payload.mode === "mock"
          ? "Mock upload complete. This recording is saved locally for this session only."
          : "Recording saved securely."
      );
    } catch (error) {
      setUploadStatus("failed");
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "Unable to save recording. Please try again."
      );
    }
  }

  function discardRecording() {
    recorder.resetRecording();
    setUploadStatus("idle");
    setUploadMessage(null);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <RecordingStatusBadge
            status={recorder.status}
            uploadStatus={uploadStatus}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <RecordingPrivacyNotice />

        {practiceText ? (
          <blockquote className="rounded-lg border bg-muted/40 p-4 text-base leading-7">
            {practiceText}
          </blockquote>
        ) : null}

        <MicrophonePermissionHelp
          error={recorder.error}
          isSupported={recorder.isSupported}
        />

        <WaveformPreview isRecording={recorder.isRecording} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <RecordingButton
            isSupported={recorder.isSupported}
            onStart={recorder.startRecording}
            onStop={recorder.stopRecording}
            status={recorder.status}
          />
          <RecordingTimer duration={recorder.duration} />
          <p className="text-sm text-muted-foreground">
            Max {formatRecordingDuration(maxRecordingSeconds)}. Nothing uploads
            until you choose save.
          </p>
        </div>

        {recorder.audioUrl ? <AudioPlayer src={recorder.audioUrl} /> : null}

        {recorder.status === "stopped" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={uploadStatus === "uploading"}
              onClick={uploadRecording}
              type="button"
            >
              <SaveIcon data-icon="inline-start" />
              {uploadStatus === "uploading" ? "Saving..." : "Save recording"}
            </Button>
            <Button
              disabled={uploadStatus === "uploading"}
              onClick={discardRecording}
              type="button"
              variant="outline"
            >
              <RotateCcwIcon data-icon="inline-start" />
              Discard and re-record
            </Button>
          </div>
        ) : null}

        {uploadMessage ? (
          <p className="text-sm text-muted-foreground" role="status">
            {uploadMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-medium">Saved recordings</h3>
            <p className="text-sm text-muted-foreground">
              Feedback analysis is intentionally disabled until Phase 5.
            </p>
          </div>
          <RecordingList
            recordings={savedRecordings}
            onRecordingsChange={setSavedRecordings}
          />
        </div>
      </CardContent>
    </Card>
  );
}
