"use client";

import { useState } from "react";
import { ClockIcon, Trash2Icon } from "lucide-react";

import { AnalyseRecordingButton } from "@/components/recording/analyse-recording-button";
import { AudioPlayer } from "@/components/recording/audio-player";
import { DeleteRecordingDialog } from "@/components/recording/delete-recording-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatRecordingDuration,
  getRecordingTypeLabel,
} from "@/lib/recordings";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import type { RecordingItem } from "@/lib/types";

type RecordingListProps = {
  recordings: RecordingItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  onRecordingsChange?: (recordings: RecordingItem[]) => void;
  expectedText?: string | null;
  lessonId?: string | null;
  promptId?: string | null;
  showAnalyseAction?: boolean;
  redirectToFeedback?: boolean;
  onAnalysisComplete?: (
    recording: RecordingItem,
    analysis: SpeechAnalysisFeedback
  ) => void;
};

export function RecordingList({
  recordings,
  emptyTitle = "No recordings saved yet",
  emptyDescription = "Record, preview, and save a clip to see it here.",
  onRecordingsChange,
  expectedText,
  lessonId,
  promptId,
  showAnalyseAction = true,
  redirectToFeedback = true,
  onAnalysisComplete,
}: RecordingListProps) {
  const [pendingDelete, setPendingDelete] = useState<RecordingItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function deleteRecording(recording: RecordingItem) {
    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/recordings/${recording.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to delete recording.");
      }

      const nextRecordings = recordings.filter(
        (item) => item.id !== recording.id
      );
      onRecordingsChange?.(nextRecordings);
      setPendingDelete(null);
      setMessage("Recording deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete recording. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}

      {pendingDelete ? (
        <DeleteRecordingDialog
          isDeleting={isDeleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={deleteRecording}
          recording={pendingDelete}
        />
      ) : null}

      {recordings.length === 0 ? (
        <div className="rounded-lg border bg-background p-4">
          <p className="font-medium">{emptyTitle}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      ) : (
        recordings.map((recording) => (
          <Card key={recording.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {getRecordingTypeLabel(recording.recording_type)}
                </Badge>
                <Badge variant="outline">{recording.status}</Badge>
                {recording.is_mock ? (
                  <Badge variant="outline">Mock</Badge>
                ) : null}
              </div>
              <CardTitle className="text-base">Saved recording</CardTitle>
              <CardDescription>
                {new Date(recording.created_at).toLocaleString()} ·{" "}
                {formatRecordingDuration(recording.duration_seconds)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recording.local_audio_url ? (
                <AudioPlayer
                  label="Saved local preview"
                  src={recording.local_audio_url}
                />
              ) : (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                  <ClockIcon className="size-4" />
                  Audio is stored privately. Playback from Storage will use
                  signed URLs in a later phase.
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                {showAnalyseAction ? (
                  <AnalyseRecordingButton
                    expectedText={expectedText}
                    lessonId={lessonId ?? recording.lesson_id}
                    onAnalysed={(analysis) =>
                      onAnalysisComplete?.(recording, analysis)
                    }
                    promptId={promptId ?? recording.prompt_id}
                    recordingId={recording.id}
                    redirectToFeedback={redirectToFeedback}
                  />
                ) : null}
                <Button
                  onClick={() => setPendingDelete(recording)}
                  type="button"
                  variant="destructive"
                >
                  <Trash2Icon data-icon="inline-start" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
