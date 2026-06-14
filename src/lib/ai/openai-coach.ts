import { aiEnv } from "@/lib/ai/env";
import type {
  AnalysisContext,
  AzurePronunciationResult,
  SoundFeedbackItem,
  SpeechAnalysisFeedback,
  WordFeedbackItem,
} from "@/lib/ai/types";
import { createMockAnalysis } from "@/lib/ai/mock-analysis";

type CoachJson = {
  ai_summary?: string;
  one_thing_done_well?: string;
  one_thing_to_improve?: string;
  next_exercise?: string;
  confidence_note?: string;
  suggested_correction?: string;
  word_feedback?: WordFeedbackItem[];
  sound_feedback?: SoundFeedbackItem[];
  missed_words?: string[];
  rhythm_score?: number;
  intonation_score?: number;
  pace_score?: number;
  clarity_score?: number;
};

function clampScore(value: number | null | undefined, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function createFallbackCoachFeedback({
  context,
  azure,
}: {
  context: AnalysisContext;
  azure: AzurePronunciationResult;
}): SpeechAnalysisFeedback {
  const mock = createMockAnalysis({
    ...context,
    expectedText: azure.transcript || context.expectedText,
  });
  const pronunciation = clampScore(
    azure.pronunciationScore ?? azure.accuracyScore,
    mock.pronunciation_score
  );
  const rhythm = clampScore(azure.fluencyScore, mock.rhythm_score);
  const intonation = clampScore(azure.prosodyScore, mock.intonation_score);
  const clarity = clampScore(azure.completenessScore, mock.clarity_score);

  return {
    ...mock,
    overall_score: Math.round((pronunciation + rhythm + clarity) / 3),
    pronunciation_score: pronunciation,
    rhythm_score: rhythm,
    intonation_score: intonation,
    clarity_score: clarity,
    transcript: azure.transcript || mock.transcript,
    word_feedback:
      azure.words
        .filter((word) => (word.accuracyScore ?? 100) < 85)
        .slice(0, 5)
        .map((word) => ({
          word: word.word,
          issue:
            word.errorType && word.errorType !== "None"
              ? `Azure marked this as ${word.errorType.toLowerCase()}.`
              : "This word may need a little more clarity.",
          suggestion:
            "Repeat it slowly, then place it back into the full sentence.",
          score: word.accuracyScore,
        })) || mock.word_feedback,
    provider: "azure-fallback",
    is_mock: false,
    raw_provider_response: {
      azure: azure.raw,
      coach: "fallback",
    },
  };
}

function buildCoachPrompt({
  context,
  azure,
}: {
  context: AnalysisContext;
  azure: AzurePronunciationResult;
}) {
  return {
    recording_type: context.recordingType,
    expected_text: context.expectedText ?? null,
    lesson_title: context.lessonTitle ?? null,
    prompt_title: context.promptTitle ?? null,
    transcript: azure.transcript,
    azure_scores: {
      pronunciation: azure.pronunciationScore,
      accuracy: azure.accuracyScore,
      fluency: azure.fluencyScore,
      completeness: azure.completenessScore,
      prosody: azure.prosodyScore,
    },
    low_scoring_words: azure.words
      .filter((word) => (word.accuracyScore ?? 100) < 85)
      .slice(0, 12),
  };
}

function parseCoachJson(content: string): CoachJson {
  const parsed = JSON.parse(content) as CoachJson;

  if (!parsed.ai_summary || !parsed.one_thing_to_improve) {
    throw new Error("Coach response missed required feedback fields.");
  }

  return parsed;
}

export async function generateOpenAiCoachFeedback({
  context,
  azure,
}: {
  context: AnalysisContext;
  azure: AzurePronunciationResult;
}): Promise<SpeechAnalysisFeedback> {
  if (!aiEnv.openAiApiKey) {
    return createFallbackCoachFeedback({ context, azure });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiEnv.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a UK professional communication and speech confidence coach. Use British English. Focus on clarity, rhythm, pronunciation, intelligibility, and confidence. Never frame feedback as erasing identity, sounding native, or having a bad accent. Scores are guidance, not judgement. Return only valid JSON matching the schema.",
        },
        {
          role: "user",
          content: JSON.stringify(buildCoachPrompt({ context, azure })),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "speech_coaching_feedback",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "ai_summary",
              "one_thing_done_well",
              "one_thing_to_improve",
              "next_exercise",
              "confidence_note",
              "suggested_correction",
              "word_feedback",
              "sound_feedback",
              "missed_words",
              "rhythm_score",
              "intonation_score",
              "pace_score",
              "clarity_score",
            ],
            properties: {
              ai_summary: { type: "string" },
              one_thing_done_well: { type: "string" },
              one_thing_to_improve: { type: "string" },
              next_exercise: { type: "string" },
              confidence_note: { type: "string" },
              suggested_correction: { type: "string" },
              missed_words: { type: "array", items: { type: "string" } },
              rhythm_score: { type: "number" },
              intonation_score: { type: "number" },
              pace_score: { type: "number" },
              clarity_score: { type: "number" },
              word_feedback: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["word", "issue", "suggestion", "score"],
                  properties: {
                    word: { type: "string" },
                    issue: { type: "string" },
                    suggestion: { type: "string" },
                    score: { type: ["number", "null"] },
                  },
                },
              },
              sound_feedback: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "sound",
                    "example",
                    "issue",
                    "suggestion",
                    "priority",
                  ],
                  properties: {
                    sound: { type: "string" },
                    example: { type: "string" },
                    issue: { type: "string" },
                    suggestion: { type: "string" },
                    priority: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    return createFallbackCoachFeedback({ context, azure });
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    return createFallbackCoachFeedback({ context, azure });
  }

  try {
    const coach = parseCoachJson(content);
    const fallback = createFallbackCoachFeedback({ context, azure });
    const pronunciation = clampScore(
      azure.pronunciationScore ?? azure.accuracyScore,
      fallback.pronunciation_score
    );

    return {
      ...fallback,
      overall_score: Math.round(
        (pronunciation +
          clampScore(coach.rhythm_score, fallback.rhythm_score) +
          clampScore(coach.clarity_score, fallback.clarity_score)) /
          3
      ),
      pronunciation_score: pronunciation,
      rhythm_score: clampScore(coach.rhythm_score, fallback.rhythm_score),
      intonation_score: clampScore(
        coach.intonation_score,
        fallback.intonation_score
      ),
      pace_score: clampScore(coach.pace_score, fallback.pace_score),
      clarity_score: clampScore(coach.clarity_score, fallback.clarity_score),
      suggested_correction:
        coach.suggested_correction ?? fallback.suggested_correction,
      ai_summary: coach.ai_summary ?? fallback.ai_summary,
      one_thing_done_well:
        coach.one_thing_done_well ?? fallback.one_thing_done_well,
      one_thing_to_improve:
        coach.one_thing_to_improve ?? fallback.one_thing_to_improve,
      next_exercise: coach.next_exercise ?? fallback.next_exercise,
      confidence_note: coach.confidence_note ?? fallback.confidence_note,
      word_feedback: coach.word_feedback?.length
        ? coach.word_feedback
        : fallback.word_feedback,
      sound_feedback: coach.sound_feedback?.length
        ? coach.sound_feedback
        : fallback.sound_feedback,
      missed_words: coach.missed_words ?? fallback.missed_words,
      provider: "azure-openai",
      is_mock: false,
      raw_provider_response: {
        azure: azure.raw,
        openai_model: "gpt-4o-mini",
      },
    };
  } catch {
    return createFallbackCoachFeedback({ context, azure });
  }
}
