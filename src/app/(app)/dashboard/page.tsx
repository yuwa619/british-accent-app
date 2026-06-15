import Link from "next/link";
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  HistoryIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { FocusAreaBadge } from "@/components/app/focus-area-badge";
import { LessonCard } from "@/components/app/lesson-card";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeader } from "@/components/app/page-header";
import { PracticeHistoryTable } from "@/components/app/practice-history-table";
import { PrivacyConsentNotice } from "@/components/app/privacy-consent-notice";
import { ProgressCard } from "@/components/app/progress-card";
import { SubscriptionBanner } from "@/components/app/subscription-banner";
import { LessonProgressBadge } from "@/components/app/lesson-progress-badge";
import { RecordingList } from "@/components/recording/recording-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/data/dashboard";
import { getRecentAnalysedRecordings } from "@/lib/data/analysis";
import { getRecentRecordings } from "@/lib/data/recordings";
import { getRecentRoleplaySessions } from "@/lib/data/roleplay";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [summary, recentRecordings, recentRoleplaySessions] = await Promise.all(
    [
      getDashboardSummary(),
      getRecentRecordings(4),
      getRecentRoleplaySessions(3),
    ]
  );
  const analysedRecordings = await getRecentAnalysedRecordings(2);
  const firstName =
    summary.profile?.full_name?.split(" ")[0] ??
    summary.profile?.email?.split("@")[0] ??
    "there";

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome, ${firstName}.`}
        description="Your practice home for British pronunciation, confidence-building lessons, and UK workplace speaking preparation."
        action={
          <Link
            className={cn(buttonVariants({ size: "lg" }), "no-underline")}
            href="/diagnostic"
          >
            Start diagnostic
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        }
      />

      {summary.developerMessage ? (
        <Card>
          <CardHeader>
            <CardTitle>Developer note</CardTitle>
            <CardDescription>{summary.developerMessage}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={summary.onboardingComplete ? "secondary" : "outline"}
              >
                {summary.onboardingComplete
                  ? "Onboarding complete"
                  : "Onboarding recommended"}
              </Badge>
              <Badge
                variant={summary.diagnosticComplete ? "secondary" : "outline"}
              >
                {summary.diagnosticComplete
                  ? "Diagnostic complete"
                  : "Diagnostic next"}
              </Badge>
            </div>
            <CardTitle>Today&apos;s practice</CardTitle>
            <CardDescription>
              A short, realistic plan for improving clarity without overloading
              your day.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Complete profile", "/onboarding"],
              ["2", "Try diagnostic preview", "/diagnostic"],
              ["3", "Open first lesson", "/lessons/clear-british-vowels"],
            ].map(([step, label, href]) => (
              <Link
                className="flex flex-col gap-3 rounded-lg border bg-background p-4 hover:bg-muted/60"
                href={href}
                key={label}
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                  {step}
                </span>
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <ProgressCard
          title="Progress snapshot"
          description={
            summary.baselineScore
              ? `Baseline score: ${summary.baselineScore}/100`
              : "Complete the diagnostic to set your baseline."
          }
          value={summary.baselineScore ?? 28}
          footer={`${summary.analysedRecordingsCount} analysed recording${summary.analysedRecordingsCount === 1 ? "" : "s"} so far.`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.metrics.slice(0, 4).map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <SparklesIcon className="size-5 text-primary" />
            <CardTitle>Focus areas</CardTitle>
            <CardDescription>
              Early placeholders that will become personalised after analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {summary.focusAreas.map((focusArea) => (
              <FocusAreaBadge key={focusArea.label} focusArea={focusArea} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continue learning</CardTitle>
            <CardDescription>
              Recommended from your focus areas and latest practice.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {summary.recommendedLesson ? (
              <div className="rounded-lg border bg-background p-4 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Recommended next practice</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {summary.recommendedLesson.title}
                    </p>
                  </div>
                  <LessonProgressBadge lesson={summary.recommendedLesson} />
                </div>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-4 no-underline"
                  )}
                  href={`/lessons/${summary.recommendedLesson.slug}`}
                >
                  Open recommendation
                </Link>
              </div>
            ) : null}
            {summary.lessons.slice(0, 2).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <HistoryIcon className="size-5 text-primary" />
            <CardTitle>Recent practice</CardTitle>
            <CardDescription>
              Your lesson, diagnostic, shadowing, and roleplay history will
              appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary.recentPractice.length ? (
              <PracticeHistoryTable rows={summary.recentPractice} />
            ) : (
              <EmptyState
                icon={ClipboardCheckIcon}
                title="No practice yet"
                description="Complete onboarding and open your first lesson to start building history."
                actionHref="/lessons"
                actionLabel="Browse lessons"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquareTextIcon className="size-5 text-primary" />
            <CardTitle>Roleplay practice</CardTitle>
            <CardDescription>
              Turn-based UK workplace conversations for interviews, meetings,
              service conversations, and phone calls.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentRoleplaySessions.length ? (
              <div className="rounded-lg border bg-background p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {recentRoleplaySessions.length} recent
                  </Badge>
                  <Badge variant="outline">
                    {recentRoleplaySessions[0]?.status ?? "active"}
                  </Badge>
                </div>
                <p className="mt-3 font-medium">
                  {recentRoleplaySessions[0]?.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Continue practising or start a new scenario when you are
                  ready.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium">No roleplay sessions yet</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Start with a short interview or workplace introduction
                  scenario.
                </p>
              </div>
            )}
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-fit no-underline"
              )}
              href="/practice/roleplay"
            >
              Open roleplay
            </Link>
            <PrivacyConsentNotice compact />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <HistoryIcon className="size-5 text-primary" />
          <CardTitle>Recent recordings</CardTitle>
          <CardDescription>
            Saved audio clips from lessons, diagnostics, and shadowing practice.
            Mock-mode uploads stay local to the recording page session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecordingList
            emptyDescription="Recordings saved with Supabase will appear here. In mock mode, saved clips are kept only on the recording screen for the current session."
            emptyTitle="No saved recordings yet"
            recordings={recentRecordings}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SparklesIcon className="size-5 text-primary" />
          <CardTitle>Recent feedback</CardTitle>
          <CardDescription>
            Analysed recordings will appear here with quick links back to your
            coaching notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {analysedRecordings.length ? (
            analysedRecordings.map((item) => (
              <Link
                className="rounded-lg border bg-background p-4 hover:bg-muted/60"
                href={`/feedback/${item.recording.id}`}
                key={item.recording.id}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {item.feedback?.overall_score ?? 0}/100
                  </Badge>
                  <Badge variant="outline">
                    {item.recording.recording_type}
                  </Badge>
                </div>
                <p className="mt-3 font-medium">Open speech feedback</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.feedback?.one_thing_to_improve ??
                    "Review your next focus area."}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-lg border bg-background p-4 md:col-span-2">
              <p className="font-medium">No feedback yet</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Once you analyse a saved recording, the latest feedback will be
                shown here.
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-4 no-underline"
                )}
                href="/lessons"
              >
                Record a lesson
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <SubscriptionBanner />
        <div className="flex items-center gap-3 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
          <ShieldCheckIcon className="size-5 text-primary" />
          <p>
            Voice data controls are available in Settings, including 30-day
            retention preferences, individual deletion, bulk recording deletion,
            and data deletion requests.
          </p>
        </div>
      </div>
    </section>
  );
}
