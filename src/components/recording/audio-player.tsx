import { HeadphonesIcon } from "lucide-react";

export function AudioPlayer({
  src,
  label = "Recording preview",
}: {
  src: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <HeadphonesIcon className="size-4 text-primary" />
        {label}
      </div>
      <audio className="w-full" controls preload="metadata" src={src}>
        <track kind="captions" />
      </audio>
    </div>
  );
}
