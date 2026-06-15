import { WavesIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AudioVisualAnalysis } from "@/lib/audio/analyse-audio";

export function PitchFeedbackPanel({
  analysis,
}: {
  analysis: AudioVisualAnalysis | null;
}) {
  return (
    <Card>
      <CardHeader>
        <WavesIcon className="size-5 text-primary" />
        <CardTitle>Approximate pitch movement</CardTitle>
        <CardDescription>
          A lightweight post-recording guide for noticing movement and variety,
          not a scientific pitch trace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysis?.pitchMovement.length ? (
          <div className="flex h-20 items-center gap-1 rounded-lg border bg-muted/30 p-3">
            {analysis.pitchMovement.map((value, index) => (
              <span
                aria-hidden="true"
                className="flex-1 rounded-sm bg-primary/50"
                key={`${value}-${index}`}
                style={{ height: `${Math.max(8, value * 90)}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Pitch movement appears after a browser-decoded recording is
            available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
