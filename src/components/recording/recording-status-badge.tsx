import { Badge } from "@/components/ui/badge";
import type { AudioRecorderStatus } from "@/hooks/use-audio-recorder";

type UploadStatus = "idle" | "uploading" | "uploaded" | "failed";

export function RecordingStatusBadge({
  status,
  uploadStatus = "idle",
}: {
  status: AudioRecorderStatus;
  uploadStatus?: UploadStatus;
}) {
  if (uploadStatus === "uploading") {
    return <Badge variant="outline">Saving</Badge>;
  }

  if (uploadStatus === "uploaded") {
    return <Badge variant="secondary">Saved</Badge>;
  }

  if (uploadStatus === "failed" || status === "failed") {
    return <Badge variant="destructive">Needs attention</Badge>;
  }

  if (status === "requesting_permission") {
    return <Badge variant="outline">Requesting microphone</Badge>;
  }

  if (status === "recording") {
    return <Badge variant="secondary">Recording</Badge>;
  }

  if (status === "stopped") {
    return <Badge variant="outline">Preview ready</Badge>;
  }

  return <Badge variant="outline">Ready</Badge>;
}
