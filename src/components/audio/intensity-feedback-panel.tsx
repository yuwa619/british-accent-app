import { ActivityIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AudioVisualAnalysis } from "@/lib/audio/analyse-audio";

export function IntensityFeedbackPanel({
  analysis,
}: {
  analysis: AudioVisualAnalysis | null;
}) {
  return (
    <Card>
      <CardHeader>
        <ActivityIcon className="size-5 text-primary" />
        <CardTitle>Speaking energy</CardTitle>
        <CardDescription>
          This visual helps you notice rhythm and energy patterns. It is
          guidance, not a judgement.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {analysis ? (
          <>
            <div className="flex h-24 items-end gap-1 rounded-lg border bg-muted/30 p-3">
              {analysis.intensity.map((value, index) => (
                <span
                  aria-hidden="true"
                  className="min-h-1 flex-1 rounded-sm bg-primary/70"
                  key={`${value}-${index}`}
                  style={{ height: `${Math.max(6, value * 100)}%` }}
                />
              ))}
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-muted-foreground">Duration</p>
                <p className="mt-1 font-medium">
                  {analysis.durationSeconds.toFixed(1)}s
                </p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-muted-foreground">Average energy</p>
                <p className="mt-1 font-medium">
                  {Math.round(analysis.averageIntensity * 100)}%
                </p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-muted-foreground">Peak energy</p>
                <p className="mt-1 font-medium">
                  {Math.round(analysis.peakIntensity * 100)}%
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Record and save a clip to see a simple post-recording energy
            pattern.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
