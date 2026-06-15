import { ClipboardListIcon } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { PracticeHistoryTable } from "@/components/app/practice-history-table";
import { FocusAreasPanel } from "@/components/diagnostic/focus-areas-panel";
import { PracticePlanCard } from "@/components/diagnostic/practice-plan-card";
import { ProgressSummaryCards } from "@/components/progress/progress-summary-cards";
import { ScoreTrendCard } from "@/components/progress/score-trend-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProgressSummary } from "@/lib/data/progress";

export default async function ProgressPage() {
  const summary = await getProgressSummary();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Progress"
        title="Track clarity and confidence over time."
        description="Review your baseline, latest analysed recordings, focus areas, and short practice plan."
      />

      {summary.developerMessage ? (
        <Card>
          <CardHeader>
            <CardTitle>Developer note</CardTitle>
            <CardDescription>{summary.developerMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <ProgressSummaryCards metrics={summary.metrics} />

      <ScoreTrendCard
        baselineScore={summary.diagnostic?.overall_score ?? null}
        latestScore={summary.latestScore}
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <FocusAreasPanel focusAreas={summary.focusAreas} />
        {summary.diagnostic?.practice_plan?.length ? (
          <PracticePlanCard items={summary.diagnostic.practice_plan} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>7-day practice plan</CardTitle>
              <CardDescription>
                Complete the diagnostic to generate a focused weekly plan.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice history</CardTitle>
          <CardDescription>
            Analysed diagnostic, lesson, shadowing, and roleplay recordings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summary.practiceHistory.length ? (
            <PracticeHistoryTable rows={summary.practiceHistory} />
          ) : (
            <EmptyState
              actionHref="/diagnostic"
              actionLabel="Start diagnostic"
              description="Your analysed recordings will appear here after you complete a diagnostic or lesson practice."
              icon={ClipboardListIcon}
              title="No practice recorded yet"
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
