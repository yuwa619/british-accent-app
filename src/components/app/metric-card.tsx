import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProgressMetric } from "@/lib/types";

export function MetricCard({ metric }: { metric: ProgressMetric }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {typeof metric.progress === "number" ? (
          <Progress value={metric.progress} />
        ) : null}
        <p className="text-sm text-muted-foreground">{metric.helper}</p>
      </CardContent>
    </Card>
  );
}
