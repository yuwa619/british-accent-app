import { cache } from "react";

import {
  getLatestDiagnosticReport,
  getMockDiagnosticReport,
} from "@/lib/data/diagnostic";
import {
  getRecentRoleplaySessions,
  roleplaySessionsToPracticeHistory,
} from "@/lib/data/roleplay";
import { mockFocusAreas, mockProgressMetrics } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  FocusArea,
  PracticeHistoryItem,
  ProgressMetric,
  ProgressSummary,
} from "@/lib/types";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function buildMetrics({
  diagnosticScore,
  latestScore,
  practiceCount,
  completedLessons,
}: {
  diagnosticScore: number | null;
  latestScore: number | null;
  practiceCount: number;
  completedLessons: number;
}): ProgressMetric[] {
  return [
    {
      label: "Baseline",
      value: diagnosticScore ? String(diagnosticScore) : "Not set",
      helper: diagnosticScore ? "diagnostic score" : "complete diagnostic",
      progress: diagnosticScore ?? 0,
    },
    {
      label: "Latest score",
      value: latestScore ? String(latestScore) : "No analysis",
      helper: latestScore ? "most recent recording" : "analyse a recording",
      progress: latestScore ?? 0,
    },
    {
      label: "Practice count",
      value: String(practiceCount),
      helper: "analysed recordings",
      progress: Math.min(100, practiceCount * 10),
    },
    {
      label: "Lessons",
      value: `${completedLessons}/10`,
      helper: "completed lessons",
      progress: Math.min(100, completedLessons * 10),
    },
  ];
}

export const getProgressSummary = cache(async (): Promise<ProgressSummary> => {
  if (!isSupabaseConfigured()) {
    const diagnostic = getMockDiagnosticReport();
    const roleplayHistory = roleplaySessionsToPracticeHistory(
      await getRecentRoleplaySessions(5)
    );

    return {
      diagnostic,
      focusAreas: diagnostic.focus_areas.map((area) => ({
        label: area.label,
        category: area.category,
        description: area.description,
        priority: area.priority,
        related_lesson_slug: area.related_lesson_slug,
      })),
      metrics: buildMetrics({
        diagnosticScore: diagnostic.overall_score,
        latestScore: 82,
        practiceCount: 3,
        completedLessons: 1,
      }),
      practiceHistory: [
        ...roleplayHistory,
        {
          title: "Diagnostic baseline",
          type: "Diagnostic",
          date: "Today",
          status: "Analysed",
          score: diagnostic.overall_score,
          feedbackHref: "/feedback/mock-recording-id",
        },
        {
          title: "Clear vowel workplace sentence",
          type: "Lesson",
          date: "Today",
          status: "Analysed",
          score: 82,
          feedbackHref: "/feedback/mock-recording-id",
        },
      ],
      analysedRecordingsCount: 3,
      completedLessonsCount: 1,
      latestScore: 82,
      developerMessage:
        "Supabase is not configured, so progress is shown with mock diagnostic data.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      diagnostic: null,
      focusAreas: mockFocusAreas,
      metrics: mockProgressMetrics,
      practiceHistory: [],
      analysedRecordingsCount: 0,
      completedLessonsCount: 0,
      latestScore: null,
      developerMessage: "Sign in to load progress.",
    };
  }

  const [
    diagnostic,
    focusResult,
    analysisResult,
    progressResult,
    roleplaySessions,
  ] = await Promise.all([
    getLatestDiagnosticReport(),
    supabase
      .from("focus_areas")
      .select("*")
      .eq("user_id", user.id)
      .is("resolved_at", null)
      .order("priority", { ascending: true })
      .limit(5),
    supabase
      .from("speech_analysis_results")
      .select("*, recordings(recording_type, lesson_id, created_at)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase.from("user_progress").select("*").eq("user_id", user.id),
    getRecentRoleplaySessions(8),
  ]);

  const analyses = analysisResult.data ?? [];
  const focusAreas: FocusArea[] = (focusResult.data ?? []).map((area) => ({
    label: area.label,
    category: area.category,
    description: area.description ?? "",
    priority: area.priority,
    related_lesson_slug: area.related_lesson_slug,
  }));
  const completedLessons = (progressResult.data ?? []).filter(
    (progress) => progress.status === "complete"
  ).length;
  const latestScore = analyses[0]?.overall_score
    ? Number(analyses[0].overall_score)
    : null;

  const practiceHistory: PracticeHistoryItem[] = analyses.map((analysis) => ({
    title:
      analysis.recordings?.recording_type === "diagnostic"
        ? "Diagnostic recording"
        : "Practice recording",
    type: analysis.recordings?.recording_type ?? "Practice",
    date: dateLabel(analysis.created_at),
    status: "Analysed",
    score: Number(analysis.overall_score ?? 0),
    feedbackHref: `/feedback/${analysis.recording_id}`,
  }));
  const roleplayHistory = roleplaySessionsToPracticeHistory(roleplaySessions);

  return {
    diagnostic,
    focusAreas: focusAreas.length ? focusAreas : mockFocusAreas,
    metrics: buildMetrics({
      diagnosticScore: diagnostic?.overall_score ?? null,
      latestScore,
      practiceCount: analyses.length,
      completedLessons,
    }),
    practiceHistory: [...roleplayHistory, ...practiceHistory],
    analysedRecordingsCount: analyses.length,
    completedLessonsCount: completedLessons,
    latestScore,
    developerMessage: null,
  };
});
