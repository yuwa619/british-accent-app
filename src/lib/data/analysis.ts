import { cache } from "react";

import { createMockAnalysis } from "@/lib/ai/mock-analysis";
import type {
  SoundFeedbackItem,
  SpeechAnalysisFeedback,
  WordFeedbackItem,
} from "@/lib/ai/types";
import type { SpeechAnalysisResult } from "@/lib/supabase/database.types";
import { createMockRecording } from "@/lib/recordings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  RecordingItem,
  RecordingType,
  RecordingWithAnalysis,
} from "@/lib/types";

function toFeedback({
  analysis,
  recording,
}: {
  analysis: NonNullable<RecordingWithAnalysis["analysis"]>;
  recording: RecordingItem;
}): SpeechAnalysisFeedback {
  return {
    id: analysis.id,
    recording_id: analysis.recording_id,
    user_id: analysis.user_id,
    overall_score: Number(analysis.overall_score ?? 0),
    pronunciation_score: Number(analysis.pronunciation_score ?? 0),
    rhythm_score: Number(analysis.rhythm_score ?? 0),
    intonation_score: Number(analysis.intonation_score ?? 0),
    pace_score: Number(analysis.pace_score ?? 0),
    clarity_score: Number(analysis.clarity_score ?? 0),
    transcript: recording.transcript ?? "",
    word_feedback: toWordFeedbackItems(analysis.word_feedback),
    sound_feedback: toSoundFeedbackItems(analysis.sound_feedback),
    missed_words: Array.isArray(analysis.missed_words)
      ? analysis.missed_words.filter(
          (word): word is string => typeof word === "string"
        )
      : [],
    suggested_correction: analysis.suggested_correction ?? "",
    ai_summary: analysis.ai_summary ?? "",
    one_thing_done_well: analysis.one_thing_done_well ?? "",
    one_thing_to_improve: analysis.one_thing_to_improve ?? "",
    next_exercise: analysis.next_exercise ?? "",
    confidence_note:
      analysis.confidence_note ??
      "Scores are guidance to help you notice patterns over time, not a judgement of your voice.",
    provider:
      analysis.provider === "azure-openai" ||
      analysis.provider === "azure-fallback"
        ? analysis.provider
        : "mock",
    is_mock: analysis.is_mock,
    raw_provider_response: analysis.raw_provider_response ?? undefined,
    created_at: analysis.created_at,
  };
}

function toWordFeedbackItems(value: unknown): WordFeedbackItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Partial<WordFeedbackItem>;
      if (
        typeof candidate.word !== "string" ||
        typeof candidate.issue !== "string" ||
        typeof candidate.suggestion !== "string"
      ) {
        return null;
      }

      return {
        word: candidate.word,
        issue: candidate.issue,
        suggestion: candidate.suggestion,
        score:
          typeof candidate.score === "number" &&
          Number.isFinite(candidate.score)
            ? candidate.score
            : null,
      };
    })
    .filter((item): item is WordFeedbackItem => Boolean(item));
}

function toSoundFeedbackItems(value: unknown): SoundFeedbackItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Partial<SoundFeedbackItem>;
      if (
        typeof candidate.sound !== "string" ||
        typeof candidate.example !== "string" ||
        typeof candidate.issue !== "string" ||
        typeof candidate.suggestion !== "string"
      ) {
        return null;
      }

      return {
        sound: candidate.sound,
        example: candidate.example,
        issue: candidate.issue,
        suggestion: candidate.suggestion,
        priority:
          typeof candidate.priority === "number" &&
          Number.isFinite(candidate.priority)
            ? candidate.priority
            : 1,
      };
    })
    .filter((item): item is SoundFeedbackItem => Boolean(item));
}

function getMockFeedback(recordingId: string): RecordingWithAnalysis {
  const recording = {
    ...createMockRecording({
      recordingType: "lesson",
      durationSeconds: 18,
    }),
    id: recordingId,
    transcript:
      "I think this meeting is important, and I would like to ask for clarification before Friday.",
    status: "complete" as const,
  };
  const analysis = createMockAnalysis({
    recordingId,
    userId: "mock-user",
    recordingType: recording.recording_type,
    expectedText: recording.transcript,
  });

  return {
    recording,
    feedback: analysis,
    analysis: {
      id: `mock-analysis-${recordingId}`,
      recording_id: recordingId,
      user_id: "mock-user",
      overall_score: analysis.overall_score,
      pronunciation_score: analysis.pronunciation_score,
      rhythm_score: analysis.rhythm_score,
      intonation_score: analysis.intonation_score,
      pace_score: analysis.pace_score,
      clarity_score: analysis.clarity_score,
      word_feedback: analysis.word_feedback,
      sound_feedback: analysis.sound_feedback,
      missed_words: analysis.missed_words,
      suggested_correction: analysis.suggested_correction,
      ai_summary: analysis.ai_summary,
      one_thing_done_well: analysis.one_thing_done_well,
      one_thing_to_improve: analysis.one_thing_to_improve,
      next_exercise: analysis.next_exercise,
      confidence_note: analysis.confidence_note,
      provider: analysis.provider,
      is_mock: analysis.is_mock,
      raw_provider_response: analysis.raw_provider_response ?? null,
      created_at: new Date().toISOString(),
    },
  };
}

export const getRecordingWithAnalysis = cache(
  async (recordingId: string): Promise<RecordingWithAnalysis | null> => {
    if (!isSupabaseConfigured()) {
      return getMockFeedback(recordingId);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: recording } = await supabase
      .from("recordings")
      .select("*")
      .eq("id", recordingId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!recording) {
      return null;
    }

    const { data: analysis } = await supabase
      .from("speech_analysis_results")
      .select("*")
      .eq("recording_id", recordingId)
      .eq("user_id", user.id)
      .maybeSingle();

    return {
      recording,
      analysis,
      feedback: analysis ? toFeedback({ analysis, recording }) : null,
    };
  }
);

export const getRecentAnalysedRecordings = cache(
  async (limit = 3): Promise<RecordingWithAnalysis[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data } = await supabase
      .from("speech_analysis_results")
      .select("*, recordings(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data ?? []).reduce<RecordingWithAnalysis[]>((items, row) => {
      const recording = row.recordings as RecordingItem | null;
      if (!recording) return items;

      const analysis = row as unknown as SpeechAnalysisResult;

      items.push({
        recording,
        analysis,
        feedback: toFeedback({ analysis, recording }),
      });

      return items;
    }, []);
  }
);

export function getMockAnalysisForRecordingType(
  recordingId: string,
  recordingType: RecordingType,
  expectedText?: string | null
) {
  return createMockAnalysis({
    recordingId,
    userId: "mock-user",
    recordingType,
    expectedText,
  });
}
