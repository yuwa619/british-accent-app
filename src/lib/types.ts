import type {
  Lesson as SupabaseLesson,
  LessonStep,
  PracticePrompt,
  Profile,
  Recording,
  SpeechAnalysisResult,
} from "@/lib/supabase/database.types";
import type { SpeechAnalysisFeedback } from "@/lib/ai/types";

export type Lesson = SupabaseLesson & {
  status?: "not_started" | "in_progress" | "complete" | "coming_soon";
  latest_score?: number | null;
  recommended?: boolean;
};

export type LessonWithSteps = Lesson & {
  steps: LessonStep[];
  prompts: PracticePrompt[];
};

export type FocusArea = {
  label: string;
  category: string;
  description: string;
  priority: number;
  related_lesson_slug?: string | null;
};

export type ProgressMetric = {
  label: string;
  value: string;
  helper: string;
  progress?: number;
};

export type PracticeHistoryItem = {
  title: string;
  type: string;
  date: string;
  status: string;
  score?: number | null;
  feedbackHref?: string | null;
};

export type RoleplayScenario = {
  key: string;
  title: string;
  description: string;
  context: string;
  turns: number;
};

export type DashboardSummary = {
  profile: Profile | null;
  onboardingComplete: boolean;
  diagnosticComplete: boolean;
  diagnosticStatus: "not_started" | "in_progress" | "completed";
  baselineScore: number | null;
  practiceCount: number;
  analysedRecordingsCount: number;
  lessons: Lesson[];
  focusAreas: FocusArea[];
  metrics: ProgressMetric[];
  recentPractice: PracticeHistoryItem[];
  recommendedLesson: Lesson | null;
  developerMessage: string | null;
};

export type OnboardingOption = {
  label: string;
  description: string;
};

export type RecordingType = Recording["recording_type"];

export type RecordingItem = Recording & {
  local_audio_url?: string;
  is_mock?: boolean;
};

export type RecordingWithAnalysis = {
  recording: RecordingItem;
  analysis: SpeechAnalysisResult | null;
  feedback: SpeechAnalysisFeedback | null;
};

export type FocusAreaRecommendation = {
  key: string;
  label: string;
  category: string;
  description: string;
  priority: number;
  related_lesson_slug?: string | null;
};

export type RecommendedLesson = {
  slug: string;
  title: string;
  reason: string;
  focus_area: string;
};

export type PracticePlanItem = {
  day: number;
  title: string;
  description: string;
  lesson_slug: string;
};

export type DiagnosticReport = {
  id: string;
  user_id: string;
  overall_score: number;
  pronunciation_score: number;
  rhythm_score: number;
  intonation_score: number;
  pace_score: number;
  clarity_score: number;
  summary: string;
  strengths: string[];
  focus_areas: FocusAreaRecommendation[];
  recommended_lessons: RecommendedLesson[];
  practice_plan: PracticePlanItem[];
  recording_ids: string[];
  created_at: string;
  is_mock?: boolean;
};

export type ProgressSummary = {
  diagnostic: DiagnosticReport | null;
  focusAreas: FocusArea[];
  metrics: ProgressMetric[];
  practiceHistory: PracticeHistoryItem[];
  analysedRecordingsCount: number;
  completedLessonsCount: number;
  latestScore: number | null;
  developerMessage: string | null;
};
