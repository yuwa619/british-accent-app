import { TrendingUpIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ScoreTrendCard({
  baselineScore,
  latestScore,
}: {
  baselineScore: number | null;
  latestScore: number | null;
}) {
  const delta =
    baselineScore && latestScore ? Math.round(latestScore - baselineScore) : 0;

  return (
    <Card>
      <CardHeader>
        <TrendingUpIcon className="size-5 text-primary" />
        <CardTitle>Score trend</CardTitle>
        <CardDescription>
          A simple snapshot until richer charts are added later.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Baseline</p>
          <p className="mt-2 text-2xl font-semibold">
            {baselineScore ?? "Not set"}
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Latest</p>
          <p className="mt-2 text-2xl font-semibold">
            {latestScore ?? "No score"}
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Change</p>
          <p className="mt-2 text-2xl font-semibold">
            {baselineScore && latestScore
              ? `${delta >= 0 ? "+" : ""}${delta}`
              : "Pending"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
