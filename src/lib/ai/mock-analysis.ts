import type { AnalysisContext, SpeechAnalysisFeedback } from "@/lib/ai/types";

function scoreFromId(recordingId: string, base: number, span: number) {
  const total = Array.from(recordingId).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );

  return Math.min(100, base + (total % span));
}

function getMockTranscript(context: AnalysisContext) {
  if (context.expectedText?.trim()) {
    return context.expectedText.trim();
  }

  if (context.recordingType === "diagnostic") {
    return "I am preparing for a meeting with my team, and I would like to explain the update clearly.";
  }

  if (context.recordingType === "shadowing") {
    return "Please check the plan and send it back by Friday afternoon.";
  }

  return "I think this meeting is important, and I would like to ask for clarification before Friday.";
}

export function createMockAnalysis(
  context: AnalysisContext
): SpeechAnalysisFeedback {
  const transcript = getMockTranscript(context);
  const overallScore = scoreFromId(context.recordingId, 76, 9);
  const pronunciationScore = scoreFromId(context.recordingId, 72, 12);
  const rhythmScore = scoreFromId(context.recordingId, 68, 14);
  const intonationScore = scoreFromId(context.recordingId, 70, 12);
  const paceScore = scoreFromId(context.recordingId, 78, 10);
  const clarityScore = scoreFromId(context.recordingId, 75, 12);

  return {
    recording_id: context.recordingId,
    user_id: context.userId,
    overall_score: overallScore,
    pronunciation_score: pronunciationScore,
    rhythm_score: rhythmScore,
    intonation_score: intonationScore,
    pace_score: paceScore,
    clarity_score: clarityScore,
    transcript,
    word_feedback: [
      {
        word: "important",
        issue: "The middle vowel can become too strong in longer phrases.",
        suggestion:
          "Try reducing the middle vowel so the word feels lighter: im-POR-tant.",
        score: 74,
      },
      {
        word: "meeting",
        issue: "The first syllable could carry a little more stress.",
        suggestion:
          "Keep the start clear and relaxed, then let the second syllable soften.",
        score: 78,
      },
      {
        word: "clarification",
        issue: "This longer word benefits from a slightly slower pace.",
        suggestion:
          "Pause briefly before it and stress the correct syllable: clar-i-fi-CA-tion.",
        score: 72,
      },
    ],
    sound_feedback: [
      {
        sound: "schwa /ə/",
        example: "important, clarification",
        issue:
          "Some unstressed vowels can be reduced further for a more natural UK rhythm.",
        suggestion:
          "Practise saying the content words clearly while letting smaller vowels relax.",
        priority: 1,
      },
      {
        sound: "dental fricative /θ/",
        example: "think, through",
        issue:
          "Keep this sound gentle and forward rather than replacing it with /t/ or /s/.",
        suggestion:
          "Place the tongue lightly between the teeth, release air, then move into the next word.",
        priority: 2,
      },
      {
        sound: "non-rhotic final /r/",
        example: "clear, Friday afternoon",
        issue:
          "In modern British English, final /r/ is often softened unless the next word starts with a vowel.",
        suggestion:
          "Let the vowel finish cleanly instead of adding a strong final /r/.",
        priority: 3,
      },
    ],
    missed_words: [],
    suggested_correction: transcript,
    ai_summary:
      "Your speech was clear overall, with a steady pace and a confident structure. The main area to practise is reducing unstressed vowels, especially schwa sounds in longer workplace phrases.",
    one_thing_done_well:
      "You kept the message easy to follow and paced the sentence calmly.",
    one_thing_to_improve:
      "Focus on lighter unstressed syllables so key words stand out naturally.",
    next_exercise:
      "Read the sentence once slowly, then repeat it at normal speed while making the unstressed syllables shorter and softer.",
    confidence_note:
      "These scores are guidance for noticing patterns over time, not a judgement of your voice or identity.",
    provider: "mock",
    is_mock: true,
    raw_provider_response: {
      mode: "mock",
      recording_type: context.recordingType,
    },
  };
}
