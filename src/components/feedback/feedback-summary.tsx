import { CheckCircle2Icon, TargetIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeedbackSummary({
  summary,
  doneWell,
  improve,
}: {
  summary: string;
  doneWell: string;
  improve: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your recording has been analysed</CardTitle>
        <CardDescription>
          A practical coaching summary for clearer UK workplace communication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="leading-7 text-muted-foreground">{summary}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <CheckCircle2Icon className="mb-3 size-5 text-primary" />
            <p className="font-medium">What went well</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {doneWell}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <TargetIcon className="mb-3 size-5 text-primary" />
            <p className="font-medium">One focus for next time</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {improve}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
