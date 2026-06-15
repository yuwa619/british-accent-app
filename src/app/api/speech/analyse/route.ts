import { NextResponse } from "next/server";

import { analyseWithAzureSpeech } from "@/lib/ai/azure-speech";
import { canUseAzureSpeech } from "@/lib/ai/env";
import { createMockAnalysis } from "@/lib/ai/mock-analysis";
import { generateOpenAiCoachFeedback } from "@/lib/ai/openai-coach";
import type { AnalysisContext, SpeechAnalysisFeedback } from "@/lib/ai/types";
import { maxRecordingSeconds } from "@/lib/recordings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { RecordingItem } from "@/lib/types";

export const runtime = "nodejs";

const dailyAnalysisLimit = 20;

type AnalyseRequestBody = {
  recordingId?: string;
  expectedText?: string | null;
  lessonId?: string | null;
  promptId?: string | null;
  force?: boolean;
};

function safeError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function startOfTodayIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

function toInsertPayload(feedback: SpeechAnalysisFeedback) {
  return {
    recording_id: feedback.recording_id,
    user_id: feedback.user_id,
    overall_score: feedback.overall_score,
    pronunciation_score: feedback.pronunciation_score,
    rhythm_score: feedback.rhythm_score,
    intonation_score: feedback.intonation_score,
    pace_score: feedback.pace_score,
    clarity_score: feedback.clarity_score,
    word_feedback: feedback.word_feedback,
    sound_feedback: feedback.sound_feedback,
    missed_words: feedback.missed_words,
    suggested_correction: feedback.suggested_correction,
    ai_summary: feedback.ai_summary,
    one_thing_done_well: feedback.one_thing_done_well,
    one_thing_to_improve: feedback.one_thing_to_improve,
    next_exercise: feedback.next_exercise,
    confidence_note: feedback.confidence_note,
    provider: feedback.provider,
    is_mock: feedback.is_mock,
    raw_provider_response: feedback.raw_provider_response ?? null,
  };
}

function toExistingAnalysisResponse({
  analysis,
  recording,
}: {
  analysis: {
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
  };
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
    word_feedback: Array.isArray(analysis.word_feedback)
      ? analysis.word_feedback
      : [],
    sound_feedback: Array.isArray(analysis.sound_feedback)
      ? analysis.sound_feedback
      : [],
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
    raw_provider_response: null,
    created_at: analysis.created_at,
  };
}

async function readBody(request: Request): Promise<AnalyseRequestBody | null> {
  try {
    return (await request.json()) as AnalyseRequestBody;
  } catch {
    return null;
  }
}

async function createRealAnalysis({
  context,
  recording,
  audio,
  contentType,
}: {
  context: AnalysisContext;
  recording: RecordingItem;
  audio: ArrayBuffer;
  contentType: string;
}): Promise<SpeechAnalysisFeedback> {
  if ((recording.duration_seconds ?? 0) > 60) {
    throw new Error(
      "Real speech analysis currently supports clips up to 60 seconds."
    );
  }

  const azure = await analyseWithAzureSpeech({
    audio,
    contentType,
    expectedText: context.expectedText,
  });

  return generateOpenAiCoachFeedback({ context, azure });
}

export async function POST(request: Request) {
  const body = await readBody(request);

  if (!body?.recordingId?.trim()) {
    return safeError("Choose a saved recording to analyse.");
  }

  const recordingId = body.recordingId.trim();

  if (!isSupabaseConfigured()) {
    const feedback = createMockAnalysis({
      recordingId,
      userId: "mock-user",
      recordingType: "lesson",
      expectedText: body.expectedText,
    });

    return NextResponse.json({
      analysis: feedback,
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return safeError("Sign in to analyse recordings.", 401);
  }

  const { data: recording, error: recordingError } = await supabase
    .from("recordings")
    .select("*")
    .eq("id", recordingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (recordingError || !recording) {
    return safeError("Recording not found.", 404);
  }

  if (!recording.storage_path) {
    return safeError("This recording does not have an audio file.", 400);
  }

  if ((recording.duration_seconds ?? 0) <= 0) {
    return safeError("Record a non-empty clip before analysis.", 400);
  }

  if ((recording.duration_seconds ?? 0) > maxRecordingSeconds) {
    return safeError("Please analyse a clip shorter than two minutes.", 400);
  }

  const { data: existingAnalysis } = await supabase
    .from("speech_analysis_results")
    .select("*")
    .eq("recording_id", recording.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingAnalysis && !body.force) {
    return NextResponse.json({
      analysis: toExistingAnalysisResponse({
        analysis: existingAnalysis,
        recording,
      }),
      mode: existingAnalysis.is_mock ? "mock" : "supabase",
      reused: true,
    });
  }

  const { count } = await supabase
    .from("speech_analysis_results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfTodayIso());

  if ((count ?? 0) >= dailyAnalysisLimit) {
    return safeError(
      "You have reached today's practice analysis limit. Please try again tomorrow.",
      429
    );
  }

  const context: AnalysisContext = {
    recordingId: recording.id,
    userId: user.id,
    recordingType: recording.recording_type,
    expectedText: body.expectedText,
  };

  await supabase
    .from("recordings")
    .update({ status: "analysing" })
    .eq("id", recording.id)
    .eq("user_id", user.id);

  try {
    let feedback: SpeechAnalysisFeedback;

    if (!canUseAzureSpeech()) {
      feedback = createMockAnalysis(context);
    } else {
      const { data: audioBlob, error: downloadError } = await supabase.storage
        .from("recordings")
        .download(recording.storage_path);

      if (downloadError || !audioBlob) {
        throw new Error("Unable to download recording audio.");
      }

      feedback = await createRealAnalysis({
        context,
        recording,
        audio: await audioBlob.arrayBuffer(),
        contentType: audioBlob.type || "audio/webm",
      });
    }

    const { data: savedAnalysis, error: insertError } = await supabase
      .from("speech_analysis_results")
      .upsert(toInsertPayload(feedback), {
        onConflict: "recording_id",
      })
      .select("*")
      .single();

    if (insertError || !savedAnalysis) {
      throw new Error("Unable to save speech feedback.");
    }

    const { error: updateError } = await supabase
      .from("recordings")
      .update({
        transcript: feedback.transcript,
        status: "complete",
      })
      .eq("id", recording.id)
      .eq("user_id", user.id);

    if (updateError) {
      throw new Error("Unable to update recording status.");
    }

    if (recording.lesson_id && recording.recording_type === "lesson") {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          lesson_id: recording.lesson_id,
          status: "complete",
          completion_percent: 100,
          last_score: feedback.overall_score,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
    }

    return NextResponse.json({
      analysis: {
        ...feedback,
        id: savedAnalysis.id,
        created_at: savedAnalysis.created_at,
      },
      mode: feedback.is_mock ? "mock" : "supabase",
    });
  } catch (error) {
    console.error("Speech analysis failed", error);

    await supabase
      .from("recordings")
      .update({ status: "failed" })
      .eq("id", recording.id)
      .eq("user_id", user.id);

    return safeError(
      "We could not analyse this recording. Please try again with a shorter, clear clip.",
      500
    );
  }
}
