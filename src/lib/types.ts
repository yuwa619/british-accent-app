import type {
  Lesson as SupabaseLesson,
  LessonStep,
  PracticePrompt,
  Profile,
} from "@/lib/supabase/database.types";

export type Lesson = SupabaseLesson & {
  status?: "not_started" | "in_progress" | "complete" | "coming_soon";
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
  lessons: Lesson[];
  focusAreas: FocusArea[];
  metrics: ProgressMetric[];
  recentPractice: PracticeHistoryItem[];
  developerMessage: string | null;
};

export type OnboardingOption = {
  label: string;
  description: string;
};
