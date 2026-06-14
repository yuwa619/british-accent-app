"use client";

import { Mic2Icon, SquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AudioRecorderStatus } from "@/hooks/use-audio-recorder";

export function RecordingButton({
  status,
  isSupported,
  onStart,
  onStop,
}: {
  status: AudioRecorderStatus;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  const isRecording = status === "recording";
  const isRequesting = status === "requesting_permission";

  return (
    <Button
      className="w-full sm:w-fit"
      disabled={!isSupported || isRequesting}
      onClick={isRecording ? onStop : onStart}
      size="lg"
      type="button"
      variant={isRecording ? "destructive" : "default"}
    >
      {isRecording ? (
        <SquareIcon data-icon="inline-start" />
      ) : (
        <Mic2Icon data-icon="inline-start" />
      )}
      {isRecording
        ? "Stop recording"
        : isRequesting
          ? "Requesting microphone..."
          : "Record"}
    </Button>
  );
}
