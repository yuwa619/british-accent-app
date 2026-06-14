import { aiEnv } from "@/lib/ai/env";
import type { AzurePronunciationResult } from "@/lib/ai/types";
import type { Json } from "@/lib/supabase/database.types";

type AzureNBest = {
  Display?: string;
  PronunciationAssessment?: {
    AccuracyScore?: number;
    FluencyScore?: number;
    CompletenessScore?: number;
    PronScore?: number;
    ProsodyScore?: number;
  };
  Words?: Array<{
    Word?: string;
    PronunciationAssessment?: {
      AccuracyScore?: number;
      ErrorType?: string;
    };
  }>;
};

type AzureSpeechResponse = {
  RecognitionStatus?: string;
  DisplayText?: string;
  NBest?: AzureNBest[];
};

function createAssessmentHeader(expectedText?: string | null) {
  const payload = {
    ReferenceText: expectedText?.trim() ?? "",
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    Dimension: "Comprehensive",
    EnableMiscue: true,
    EnableProsodyAssessment: true,
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function analyseWithAzureSpeech({
  audio,
  contentType,
  expectedText,
}: {
  audio: ArrayBuffer;
  contentType: string;
  expectedText?: string | null;
}): Promise<AzurePronunciationResult> {
  if (!aiEnv.azureSpeechKey || !aiEnv.azureSpeechRegion) {
    throw new Error("Azure Speech is not configured.");
  }

  const endpoint = new URL(
    `https://${aiEnv.azureSpeechRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
  );
  endpoint.searchParams.set("language", "en-GB");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": contentType || "audio/webm",
      "Ocp-Apim-Subscription-Key": aiEnv.azureSpeechKey,
      "Pronunciation-Assessment": createAssessmentHeader(expectedText),
    },
    body: audio,
  });

  if (!response.ok) {
    throw new Error(`Azure Speech request failed with ${response.status}.`);
  }

  const raw = (await response.json()) as AzureSpeechResponse;

  if (
    raw.RecognitionStatus &&
    !["Success", "EndOfDictation"].includes(raw.RecognitionStatus)
  ) {
    throw new Error("Azure Speech could not recognise the recording.");
  }

  const best = raw.NBest?.[0];
  const scores = best?.PronunciationAssessment;

  return {
    transcript: best?.Display ?? raw.DisplayText ?? "",
    pronunciationScore: scores?.PronScore ?? null,
    accuracyScore: scores?.AccuracyScore ?? null,
    fluencyScore: scores?.FluencyScore ?? null,
    completenessScore: scores?.CompletenessScore ?? null,
    prosodyScore: scores?.ProsodyScore ?? null,
    words:
      best?.Words?.map((word) => ({
        word: word.Word ?? "",
        accuracyScore: word.PronunciationAssessment?.AccuracyScore ?? null,
        errorType: word.PronunciationAssessment?.ErrorType ?? null,
      })).filter((word) => word.word.length > 0) ?? [],
    raw: raw as Json,
  };
}
