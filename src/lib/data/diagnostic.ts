import { cache } from "react";

import { createMockAnalysis } from "@/lib/ai/mock-analysis";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import { aggregateDiagnosticResults } from "@/lib/diagnostic/aggregate";
import { diagnosticPrompts } from "@/lib/diagnostic/prompts";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  DiagnosticReport,
  FocusAreaRecommendation,
  PracticePlanItem,
  RecommendedLesson,
} from "@/lib/types";

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isFocusAreaArray(value: unknown): value is FocusAreaRecommendation[] {
  return Array.isArray(value);
}

function isRecommendedLessonArray(
  value: unknown
): value is RecommendedLesson[] {
  return Array.isArray(value);
}

function isPracticePlanArray(value: unknown): value is PracticePlanItem[] {
  return Array.isArray(value);
}

export function toDiagnosticReport(row: {
  id: string;
  user_id: string;
  overall_score: number | null;
  pronunciation_score: number | null;
  rhythm_score: number | null;
  intonation_score: number | null;
  pace_score: number | null;
  clarity_score: number | null;
  summary: string | null;
  focus_areas: unknown;
  strengths?: unknown;
  recommended_lessons?: unknown;
  practice_plan?: unknown;
  recording_ids?: string[] | null;
  created_at: string;
}): DiagnosticReport {
  return {
    id: row.id,
    user_id: row.user_id,
    overall_score: Number(row.overall_score ?? 0),
    pronunciation_score: Number(row.pronunciation_score ?? 0),
    rhythm_score: Number(row.rhythm_score ?? 0),
    intonation_score: Number(row.intonation_score ?? 0),
    pace_score: Number(row.pace_score ?? 0),
    clarity_score: Number(row.clarity_score ?? 0),
    summary: row.summary ?? "",
    strengths: isStringArray(row.strengths) ? row.strengths : [],
    focus_areas: isFocusAreaArray(row.focus_areas) ? row.focus_areas : [],
    recommended_lessons: isRecommendedLessonArray(row.recommended_lessons)
      ? row.recommended_lessons
      : [],
    practice_plan: isPracticePlanArray(row.practice_plan)
      ? row.practice_plan
      : [],
    recording_ids: row.recording_ids ?? [],
    created_at: row.created_at,
  };
}

export function getMockDiagnosticReport() {
  const analyses: SpeechAnalysisFeedback[] = diagnosticPrompts.map(
    (prompt, index) =>
      createMockAnalysis({
        recordingId: `mock-diagnostic-${index + 1}`,
        userId: "mock-user",
        recordingType: "diagnostic",
        expectedText: prompt.text,
      })
  );

  return aggregateDiagnosticResults({
    analyses,
    userId: "mock-user",
    recordingIds: analyses.map((analysis) => analysis.recording_id),
  });
}

export const getLatestDiagnosticReport = cache(
  async (): Promise<DiagnosticReport | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("diagnostic_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data ? toDiagnosticReport(data) : null;
  }
);
