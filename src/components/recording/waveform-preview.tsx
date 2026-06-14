import { cn } from "@/lib/utils";

export function WaveformPreview({ isRecording }: { isRecording: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-16 items-center gap-1 rounded-lg border bg-muted/40 px-4"
    >
      {Array.from({ length: 22 }).map((_, index) => (
        <span
          className={cn(
            "w-1 rounded-full bg-primary/35 transition-all",
            isRecording ? "animate-pulse bg-primary/70" : "bg-primary/25"
          )}
          key={index}
          style={{
            height: `${18 + ((index * 13) % 34)}px`,
            animationDelay: `${index * 45}ms`,
          }}
        />
      ))}
    </div>
  );
}
