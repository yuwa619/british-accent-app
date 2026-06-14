import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TranscriptCard({
  transcript,
  suggestedCorrection,
}: {
  transcript: string;
  suggestedCorrection?: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
        <CardDescription>
          Use this to compare what was recognised with what you intended to say.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="rounded-lg border bg-muted/40 p-4 leading-7">
          {transcript || "No transcript was returned for this recording."}
        </blockquote>
        {suggestedCorrection ? (
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">Suggested clear version</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {suggestedCorrection}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
