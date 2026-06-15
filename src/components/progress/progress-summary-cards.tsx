import { MetricCard } from "@/components/app/metric-card";
import type { ProgressMetric } from "@/lib/types";

export function ProgressSummaryCards({
  metrics,
}: {
  metrics: ProgressMetric[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}
