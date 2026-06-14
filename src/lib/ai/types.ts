import type { Json } from "@/lib/supabase/database.types";
import type { RecordingType } from "@/lib/types";

export type WordFeedbackItem = {
  word: string;
  issue: string;
  suggestion: string;
  score: number | null;
};

export type SoundFeedbackItem = {
  sound: string;
  example: string;
  issue: string;
  suggestion: string;
  priority: number;
};

export type SpeechAnalysisFeedback = {
  id?: string;
  recording_id: string;
  user_id: string;
  overall_score: number;
  pronunciation_score: number;
  rhythm_score: number;
  intonation_score: number;
  pace_score: number;
  clarity_score: number;
  transcript: string;
  word_feedback: WordFeedbackItem[];
  sound_feedback: SoundFeedbackItem[];
  missed_words: string[];
  suggested_correction: string;
  ai_summary: string;
  one_thing_done_well: string;
  one_thing_to_improve: string;
  next_exercise: string;
  confidence_note: string;
  provider: "mock" | "azure-openai" | "azure-fallback";
  is_mock: boolean;
  raw_provider_response?: Json;
  created_at?: string;
};

export type AnalysisContext = {
  recordingId: string;
  userId: string;
  recordingType: RecordingType;
  expectedText?: string | null;
  lessonTitle?: string | null;
  promptTitle?: string | null;
};

export type AzureWordFeedback = {
  word: string;
  accuracyScore: number | null;
  errorType?: string | null;
};

export type AzurePronunciationResult = {
  transcript: string;
  pronunciationScore: number | null;
  accuracyScore: number | null;
  fluencyScore: number | null;
  completenessScore: number | null;
  prosodyScore: number | null;
  words: AzureWordFeedback[];
  raw: Json;
};
