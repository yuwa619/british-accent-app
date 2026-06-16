import Link from "next/link";
import {
  ClipboardCheckIcon,
  FlameIcon,
  HistoryIcon,
  MessageSquareTextIcon,
  Mic2Icon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  ZapIcon,
} from "lucide-react";

import { AchievementsRow } from "@/components/game/achievements-row";
import { DailyMissionCard } from "@/components/game/daily-mission-card";
import { LessonPathCard } from "@/components/game/lesson-path-card";
import { PracticeCtaCard } from "@/components/game/practice-cta-card";
import { ProgressRing } from "@/components/game/progress-ring";
import { StatPill } from "@/components/game/stat-pill";
import { StreakCard } from "@/components/game/streak-card";
import { XpLevelCard } from "@/components/game/xp-level-card";
import { EmptyState } from "@/components/app/empty-state";
import { FocusAreaBadge } from "@/components/app/focus-area-badge";
import { PracticeHistoryTable } from "@/components/app/practice-history-table";
import { PrivacyConsentNotice } from "@/components/app/privacy-consent-notice";
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
import { getRecentAnalysedRecordings } from "@/lib/data/analysis";
import { getRecentRecordings } from "@/lib/data/recordings";
import { getRecentRoleplaySessions } from "@/lib/data/roleplay";
import {
  deriveDailyMission,
  deriveGameStatsFromDashboard,
} from "@/lib/gamification";
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

  const stats = deriveGameStatsFromDashboard(summary);
  const mission = deriveDailyMission(summary);
  const continueLessons = summary.lessons.slice(0, 4);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Greeting + at-a-glance stats */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Your daily practice
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Welcome, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground">
            A few focused minutes a day builds clearer, calmer British speech.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatPill
            icon={FlameIcon}
            tone="streak"
            value={String(stats.streakDays)}
            label="streak"
          />
          <StatPill
            icon={ZapIcon}
            tone="xp"
            value={String(stats.xp)}
            label="XP"
          />
          <StatPill
            icon={StarIcon}
            tone="primary"
            value={`Lv ${stats.level}`}
          />
        </div>
      </header>

      {summary.developerMessage ? (
        <p className="rounded-xl border border-dashed bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          {summary.developerMessage}
        </p>
      ) : null}

      <DailyMissionCard mission={mission} stats={stats} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StreakCard
          streakDays={stats.streakDays}
          weeklyGoalDone={stats.weeklyGoalDone}
          weeklyGoalTarget={stats.weeklyGoalTarget}
        />
        <XpLevelCard stats={stats} />
      </div>

      {/* Quick practice loops */}
      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Quick practice
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <PracticeCtaCard
            icon={Mic2Icon}
            tone="primary"
            title="3-minute shadowing"
            description="Listen, repeat and compare a short workplace phrase."
            href="/practice/shadowing"
            ctaLabel="Warm up"
            meta="~3 min"
          />
          <PracticeCtaCard
            icon={MessageSquareTextIcon}
            tone="xp"
            title="Roleplay challenge"
            description="Hold a turn-based UK workplace conversation."
            href="/practice/roleplay"
            ctaLabel="Start challenge"
            meta={
              recentRoleplaySessions.length
                ? `${recentRoleplaySessions.length} recent`
                : "New"
            }
          />
          <PracticeCtaCard
            icon={TargetIcon}
            tone="success"
            title={
              summary.diagnosticComplete ? "Re-check baseline" : "Diagnostic"
            }
            description="Measure your clarity with three short prompts."
            href="/diagnostic"
            ctaLabel={summary.diagnosticComplete ? "Re-test" : "Begin"}
            meta="~5 min"
          />
        </div>
      </div>

      {/* Continue learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue learning</CardTitle>
          <CardDescription>
            Picked from your focus areas and latest practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {continueLessons.map((lesson) => (
            <LessonPathCard key={lesson.id} lesson={lesson} />
          ))}
          <Link
            href="/lessons"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center no-underline sm:w-fit"
            )}
          >
            View full learning path
          </Link>
        </CardContent>
      </Card>

      {/* Progress snapshot + focus areas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progress snapshot</CardTitle>
            <CardDescription>
              {summary.baselineScore
                ? "Your baseline and speaking strengths so far."
                : "Complete the diagnostic to set your baseline."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProgressRing
              value={summary.baselineScore ?? 0}
              size={104}
              label="Baseline clarity score"
              colorClassName="text-primary"
            >
              <span className="flex flex-col items-center">
                <span className="text-2xl leading-none font-bold tabular-nums">
                  {summary.baselineScore ?? "–"}
                </span>
                <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                  Baseline
                </span>
              </span>
            </ProgressRing>
            <div className="flex-1 space-y-2.5">
              {stats.strengths.length ? (
                stats.strengths.map((strength) => (
                  <div key={strength.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{strength.label}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {strength.score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Speaking strengths appear here after your first analysis.
                </p>
              )}
              <p className="pt-1 text-xs text-muted-foreground">
                {summary.analysedRecordingsCount} analysed recording
                {summary.analysedRecordingsCount === 1 ? "" : "s"} so far.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SparklesIcon className="size-5 text-primary" />
            <CardTitle>Focus areas</CardTitle>
            <CardDescription>
              Where a little practice will make the biggest difference.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {summary.focusAreas.map((focusArea) => (
              <FocusAreaBadge key={focusArea.label} focusArea={focusArea} />
            ))}
          </CardContent>
        </Card>
      </div>

      <AchievementsRow
        achievements={stats.achievements}
        earnedCount={stats.earnedCount}
      />

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <HistoryIcon className="size-5 text-primary" />
            <CardTitle>Recent practice</CardTitle>
            <CardDescription>
              Your lesson, diagnostic, shadowing, and roleplay history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary.recentPractice.length ? (
              <PracticeHistoryTable rows={summary.recentPractice} />
            ) : (
              <EmptyState
                icon={ClipboardCheckIcon}
                title="No practice yet"
                description="Open your first lesson to start building history."
                actionHref="/lessons"
                actionLabel="Browse lessons"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SparklesIcon className="size-5 text-primary" />
            <CardTitle>Recent feedback</CardTitle>
            <CardDescription>
              Analysed recordings with quick links back to your coaching notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {analysedRecordings.length ? (
              analysedRecordings.map((item) => (
                <Link
                  className="tap-scale rounded-xl border bg-background p-4 no-underline hover:bg-muted/60"
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
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.feedback?.one_thing_to_improve ??
                      "Review your next focus area."}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-4">
                <p className="font-medium">No feedback yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Once you analyse a saved recording, the latest feedback shows
                  here.
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

      <div className="grid gap-4 lg:grid-cols-2">
        <SubscriptionBanner />
        <PrivacyConsentNotice />
      </div>
    </section>
  );
}
