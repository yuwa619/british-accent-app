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
import { getRecentRecordings } from "@/lib/data/recordings";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [summary, recentRecordings] = await Promise.all([
    getDashboardSummary(),
    getRecentRecordings(4),
  ]);
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
          description="Baseline placeholder until diagnostic scoring is active."
          value={28}
          footer="Recording is available now. Phase 5 adds speech analysis."
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
              Start with pronunciation foundations before roleplay and shadowing
              arrive.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
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
            <CardTitle>Roleplay preview</CardTitle>
            <CardDescription>
              Turn-based UK workplace conversations arrive after recording and
              analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-fit no-underline"
              )}
              href="/practice/roleplay"
            >
              Preview scenarios
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

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <SubscriptionBanner />
        <div className="flex items-center gap-3 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
          <ShieldCheckIcon className="size-5 text-primary" />
          <p>
            Future recordings will use private storage, 30-day retention
            controls, and delete options from settings.
          </p>
        </div>
      </div>
    </section>
  );
}
