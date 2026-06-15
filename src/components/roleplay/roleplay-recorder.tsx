"use client";

import { RotateCcwIcon, SendIcon } from "lucide-react";
import { useState } from "react";

import { AudioPlayer } from "@/components/recording/audio-player";
import { MicrophonePermissionHelp } from "@/components/recording/microphone-permission-help";
import { RecordingButton } from "@/components/recording/recording-button";
import { RecordingStatusBadge } from "@/components/recording/recording-status-badge";
import { RecordingTimer } from "@/components/recording/recording-timer";
import { WaveformPreview } from "@/components/recording/waveform-preview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import {
  formatRecordingDuration,
  maxRecordingBytes,
  maxRecordingSeconds,
} from "@/lib/recordings";
import type { RecordingItem } from "@/lib/types";

export function RoleplayRecorder({
  disabled,
  onSubmitRecording,
}: {
  disabled: boolean;
  onSubmitRecording: (input: {
    recording: RecordingItem;
    transcript: string;
  }) => Promise<void>;
}) {
  const recorder = useAudioRecorder();
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitRecording() {
    if (!recorder.audioBlob) {
      setMessage("Record a voice reply before submitting.");
      return;
    }

    if (recorder.audioBlob.size > maxRecordingBytes) {
      setMessage("This recording is too large. Please record a shorter turn.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", recorder.audioBlob, "roleplay-turn.webm");
    formData.append("recording_type", "roleplay");
    formData.append("duration_seconds", String(recorder.duration));

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as {
        recording?: RecordingItem;
        error?: string;
      } | null;

      if (!response.ok || !payload?.recording) {
        throw new Error(payload?.error ?? "Unable to save the voice turn.");
      }

      await onSubmitRecording({
        recording: {
          ...payload.recording,
          local_audio_url: recorder.audioUrl ?? undefined,
        },
        transcript: transcript.trim(),
      });
      recorder.resetRecording();
      setTranscript("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit the voice turn. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <MicrophonePermissionHelp
        error={recorder.error}
        isSupported={recorder.isSupported}
      />
      <WaveformPreview isRecording={recorder.isRecording} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <RecordingButton
          isSupported={recorder.isSupported && !disabled}
          onStart={recorder.startRecording}
          onStop={recorder.stopRecording}
          status={recorder.status}
        />
        <RecordingTimer duration={recorder.duration} />
        <RecordingStatusBadge status={recorder.status} uploadStatus="idle" />
        <p className="text-sm text-muted-foreground">
          Max {formatRecordingDuration(maxRecordingSeconds)}. Nothing uploads
          until you submit the turn.
        </p>
      </div>

      {recorder.audioUrl ? (
        <AudioPlayer
          label="Preview your roleplay reply"
          src={recorder.audioUrl}
        />
      ) : null}

      {recorder.status === "stopped" ? (
        <div className="flex flex-col gap-3">
          <Textarea
            disabled={disabled || isSubmitting}
            maxLength={1000}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Optional: type what you said so the mock transcript is accurate."
            value={transcript}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={disabled || isSubmitting}
              onClick={submitRecording}
              type="button"
            >
              <SendIcon data-icon="inline-start" />
              {isSubmitting ? "Submitting..." : "Submit voice reply"}
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                recorder.resetRecording();
                setMessage(null);
              }}
              type="button"
              variant="outline"
            >
              <RotateCcwIcon data-icon="inline-start" />
              Discard and record again
            </Button>
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
