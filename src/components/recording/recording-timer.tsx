import { formatRecordingDuration } from "@/lib/recordings";

export function RecordingTimer({ duration }: { duration: number }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2 font-mono text-sm">
      {formatRecordingDuration(duration)}
    </div>
  );
}
