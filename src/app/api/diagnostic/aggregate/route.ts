import { NextResponse } from "next/server";

import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import { createMockAnalysis } from "@/lib/ai/mock-analysis";
import { aggregateDiagnosticResults } from "@/lib/diagnostic/aggregate";
import { diagnosticPrompts } from "@/lib/diagnostic/prompts";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type AggregateRequest = {
  recordingIds?: string[];
  analyses?: SpeechAnalysisFeedback[];
};

function safeError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function readBody(request: Request): Promise<AggregateRequest | null> {
  try {
    return (await request.json()) as AggregateRequest;
  } catch {
    return null;
  }
}

function createMockAnalyses(recordingIds: string[]) {
  return diagnosticPrompts.map((prompt, index) =>
    createMockAnalysis({
      recordingId: recordingIds[index] ?? `mock-diagnostic-${index + 1}`,
      userId: "mock-user",
      recordingType: "diagnostic",
      expectedText: prompt.text,
    })
  );
}

function rowToFeedback(row: {
  id: string;
  recording_id: string;
  user_id: string;
  overall_score: number | null;
  pronunciation_score: number | null;
  rhythm_score: number | null;
  intonation_score: number | null;
  pace_score: number | null;
  clarity_score: number | null;
  word_feedback: unknown;
  sound_feedback: unknown;
  missed_words: unknown;
  suggested_correction: string | null;
  ai_summary: string | null;
  one_thing_done_well: string | null;
  one_thing_to_improve: string | null;
  next_exercise: string | null;
  confidence_note: string | null;
  provider: string;
  is_mock: boolean;
  raw_provider_response: unknown;
  created_at: string;
  recordings?: { transcript?: string | null } | null;
}): SpeechAnalysisFeedback {
  return {
    id: row.id,
    recording_id: row.recording_id,
    user_id: row.user_id,
    overall_score: Number(row.overall_score ?? 0),
    pronunciation_score: Number(row.pronunciation_score ?? 0),
    rhythm_score: Number(row.rhythm_score ?? 0),
    intonation_score: Number(row.intonation_score ?? 0),
    pace_score: Number(row.pace_score ?? 0),
    clarity_score: Number(row.clarity_score ?? 0),
    transcript: row.recordings?.transcript ?? "",
    word_feedback: Array.isArray(row.word_feedback) ? row.word_feedback : [],
    sound_feedback: Array.isArray(row.sound_feedback) ? row.sound_feedback : [],
    missed_words: Array.isArray(row.missed_words)
      ? row.missed_words.filter(
          (word): word is string => typeof word === "string"
        )
      : [],
    suggested_correction: row.suggested_correction ?? "",
    ai_summary: row.ai_summary ?? "",
    one_thing_done_well: row.one_thing_done_well ?? "",
    one_thing_to_improve: row.one_thing_to_improve ?? "",
    next_exercise: row.next_exercise ?? "",
    confidence_note: row.confidence_note ?? "",
    provider:
      row.provider === "azure-openai" || row.provider === "azure-fallback"
        ? row.provider
        : "mock",
    is_mock: row.is_mock,
    raw_provider_response: null,
    created_at: row.created_at,
  };
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const recordingIds = body?.recordingIds?.filter(Boolean) ?? [];

  if (recordingIds.length < 3) {
    return safeError("Analyse all three diagnostic recordings first.");
  }

  if (!isSupabaseConfigured()) {
    const analyses =
      body?.analyses && body.analyses.length >= 3
        ? body.analyses.slice(0, 3)
        : createMockAnalyses(recordingIds);

    return NextResponse.json({
      diagnostic: aggregateDiagnosticResults({
        analyses,
        userId: "mock-user",
        recordingIds,
      }),
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return safeError("Sign in to generate a diagnostic report.", 401);
  }

  const { data: rows, error } = await supabase
    .from("speech_analysis_results")
    .select("*, recordings!inner(id, user_id, recording_type, transcript)")
    .eq("user_id", user.id)
    .in("recording_id", recordingIds);

  if (error || !rows || rows.length < 3) {
    return safeError(
      "We could not find three analysed diagnostic recordings.",
      400
    );
  }

  const diagnosticRows = rows.filter(
    (row) =>
      row.recordings?.user_id === user.id &&
      row.recordings?.recording_type === "diagnostic"
  );

  if (diagnosticRows.length < 3) {
    return safeError(
      "All selected recordings must be diagnostic recordings.",
      400
    );
  }

  const diagnostic = aggregateDiagnosticResults({
    analyses: diagnosticRows.map(rowToFeedback),
    userId: user.id,
    recordingIds,
  });

  const { data: savedDiagnostic, error: insertError } = await supabase
    .from("diagnostic_results")
    .insert({
      user_id: user.id,
      overall_score: diagnostic.overall_score,
      pronunciation_score: diagnostic.pronunciation_score,
      rhythm_score: diagnostic.rhythm_score,
      intonation_score: diagnostic.intonation_score,
      pace_score: diagnostic.pace_score,
      clarity_score: diagnostic.clarity_score,
      summary: diagnostic.summary,
      focus_areas: diagnostic.focus_areas,
      strengths: diagnostic.strengths,
      recommended_lessons: diagnostic.recommended_lessons,
      practice_plan: diagnostic.practice_plan,
      recording_ids: recordingIds,
    })
    .select("*")
    .single();

  if (insertError || !savedDiagnostic) {
    return safeError("Unable to save diagnostic report.", 500);
  }

  await supabase
    .from("focus_areas")
    .delete()
    .eq("user_id", user.id)
    .eq("source", "diagnostic")
    .is("resolved_at", null);

  await supabase.from("focus_areas").insert(
    diagnostic.focus_areas.map((area) => ({
      user_id: user.id,
      label: area.label,
      category: area.category,
      description: area.description,
      priority: area.priority,
      source: "diagnostic",
      related_lesson_slug: area.related_lesson_slug ?? null,
    }))
  );

  return NextResponse.json({
    diagnostic: {
      ...diagnostic,
      id: savedDiagnostic.id,
      created_at: savedDiagnostic.created_at,
    },
    mode: "supabase",
  });
}
