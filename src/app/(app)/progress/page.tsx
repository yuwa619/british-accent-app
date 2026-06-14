import { ClipboardListIcon } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { PracticeHistoryTable } from "@/components/app/practice-history-table";
import { ProgressCard } from "@/components/app/progress-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPracticeHistory, mockProgressMetrics } from "@/lib/mock-data";

export default function ProgressPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Progress"
        title="Track clarity and confidence over time."
        description="Progress reporting will combine diagnostic results, practice history, score movement, and focus-area changes once recording and analysis are active."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProgressMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <ProgressCard
          title="Practice streak"
          description="Streaks begin once recording is available."
          value={0}
          footer="Keep this gentle: consistency matters more than perfection."
        />

        <Card>
          <CardHeader>
            <CardTitle>Practice history</CardTitle>
            <CardDescription>
              Lesson, diagnostic, shadowing, and roleplay attempts will appear
              here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockPracticeHistory.length ? (
              <PracticeHistoryTable rows={mockPracticeHistory} />
            ) : (
              <EmptyState
                icon={ClipboardListIcon}
                title="No practice recorded yet"
                description="Your completed exercises will appear here after Phase 4 recording and Phase 5 analysis are connected."
                actionHref="/lessons"
                actionLabel="Browse lessons"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
