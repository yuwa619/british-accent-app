import type {
  DashboardSummary,
  FocusArea,
  Lesson,
  LessonWithSteps,
  PracticeHistoryItem,
  ProgressMetric,
  RoleplayScenario,
} from "@/lib/types";

export const mockLessons: Lesson[] = [
  {
    id: "mock-lesson-1",
    slug: "clear-british-vowels",
    title: "Clear British vowels for professional speech",
    description:
      "Shape the core vowel sounds that make workplace updates easier to follow.",
    skill_focus: "British vowels",
    difficulty: "beginner",
    estimated_minutes: 6,
    sort_order: 1,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "in_progress",
  },
  {
    id: "mock-lesson-2",
    slug: "schwa-unstressed-syllables",
    title: "The schwa /ə/ and unstressed syllables",
    description:
      "Practise lighter unstressed syllables for a more natural British rhythm.",
    skill_focus: "Schwa and rhythm",
    difficulty: "beginner",
    estimated_minutes: 6,
    sort_order: 2,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "not_started",
  },
  {
    id: "mock-lesson-3",
    slug: "dental-fricatives-think-this-that-through",
    title: "Dental fricatives: think, this, that, through",
    description: "Polish /θ/ and /ð/ sounds in frequent professional phrases.",
    skill_focus: "Dental fricatives",
    difficulty: "intermediate",
    estimated_minutes: 7,
    sort_order: 3,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "not_started",
  },
  {
    id: "mock-lesson-4",
    slug: "dropping-final-r-non-rhotic",
    title: "Dropping final /r/ in non-rhotic British English",
    description:
      "Understand how final /r/ works in contemporary British pronunciation.",
    skill_focus: "Non-rhoticity",
    difficulty: "beginner",
    estimated_minutes: 7,
    sort_order: 4,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "not_started",
  },
  {
    id: "mock-lesson-5",
    slug: "word-stress-workplace-vocabulary",
    title: "Word stress in workplace vocabulary",
    description:
      "Place stress clearly in professional words such as proposal and analysis.",
    skill_focus: "Word stress",
    difficulty: "intermediate",
    estimated_minutes: 8,
    sort_order: 5,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "not_started",
  },
  {
    id: "mock-lesson-6",
    slug: "sentence-stress-confident-speaking",
    title: "Sentence stress for confident speaking",
    description:
      "Highlight the key words listeners need to understand in meetings.",
    skill_focus: "Sentence stress",
    difficulty: "intermediate",
    estimated_minutes: 8,
    sort_order: 6,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "coming_soon",
  },
  {
    id: "mock-lesson-7",
    slug: "connected-speech-linking-smoothly",
    title: "Connected speech: linking words smoothly",
    description:
      "Connect words naturally while keeping your speech clear and measured.",
    skill_focus: "Connected speech",
    difficulty: "intermediate",
    estimated_minutes: 8,
    sort_order: 7,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "coming_soon",
  },
  {
    id: "mock-lesson-8",
    slug: "intonation-statements-questions",
    title: "Intonation for statements and questions",
    description:
      "Use pitch movement to sound clear, polite, and confident in UK conversations.",
    skill_focus: "Intonation",
    difficulty: "intermediate",
    estimated_minutes: 8,
    sort_order: 8,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "coming_soon",
  },
  {
    id: "mock-lesson-9",
    slug: "professional-introductions-uk",
    title: "Professional introductions in the UK",
    description:
      "Build a concise, warm self-introduction for work, study, or placements.",
    skill_focus: "Workplace phrases",
    difficulty: "beginner",
    estimated_minutes: 6,
    sort_order: 9,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "coming_soon",
  },
  {
    id: "mock-lesson-10",
    slug: "interview-answers-structure-rhythm",
    title: "Interview answers with clear structure and rhythm",
    description: "Practise calm, structured answers for UK job interviews.",
    skill_focus: "Interview speaking",
    difficulty: "advanced",
    estimated_minutes: 9,
    sort_order: 10,
    is_published: true,
    created_at: new Date(0).toISOString(),
    status: "coming_soon",
  },
];

export const mockLessonDetails: LessonWithSteps[] = mockLessons.map(
  (lesson) => ({
    ...lesson,
    steps: [
      {
        id: `${lesson.id}-step-1`,
        lesson_id: lesson.id,
        step_type: "explain",
        title: "Understand the focus",
        body: lesson.description,
        practice_text: null,
        reference_text: null,
        sort_order: 1,
        created_at: new Date(0).toISOString(),
      },
      {
        id: `${lesson.id}-step-2`,
        lesson_id: lesson.id,
        step_type: "read",
        title: "Read aloud",
        body: "Read this phrase slowly first, then again at a natural workplace pace.",
        practice_text:
          lesson.slug === "schwa-unstressed-syllables"
            ? "I need to apply for a series of positions."
            : lesson.slug === "dental-fricatives-think-this-that-through"
              ? "I think this method is better than that one."
              : "Please check the plan and send it back by Friday.",
        reference_text:
          lesson.slug === "schwa-unstressed-syllables"
            ? "I need to apply for a series of positions."
            : lesson.slug === "dental-fricatives-think-this-that-through"
              ? "I think this method is better than that one."
              : "Please check the plan and send it back by Friday.",
        sort_order: 2,
        created_at: new Date(0).toISOString(),
      },
      {
        id: `${lesson.id}-step-3`,
        lesson_id: lesson.id,
        step_type: "reflect",
        title: "Reflect",
        body: "Notice which words felt easiest and which would benefit from another listen-and-repeat round.",
        practice_text: null,
        reference_text: null,
        sort_order: 3,
        created_at: new Date(0).toISOString(),
      },
    ],
    prompts: [
      {
        id: `${lesson.id}-prompt-1`,
        lesson_id: lesson.id,
        prompt_type: "shadowing",
        title: "Practice phrase",
        prompt_text: "Please check the plan and send it back by Friday.",
        target_sound: lesson.skill_focus,
        difficulty: lesson.difficulty,
        created_at: new Date(0).toISOString(),
      },
    ],
  })
);

export const mockFocusAreas: FocusArea[] = [
  {
    label: "Schwa in unstressed syllables",
    category: "Rhythm",
    description: "Lighten words such as to, for, of, and a in longer phrases.",
    priority: 1,
  },
  {
    label: "Dental fricatives",
    category: "Pronunciation",
    description:
      "Practise gentle tongue placement for think, this, and through.",
    priority: 2,
  },
  {
    label: "Question intonation",
    category: "Intonation",
    description: "Use a friendly pitch movement when asking for clarification.",
    priority: 3,
  },
];

export const mockProgressMetrics: ProgressMetric[] = [
  {
    label: "Clarity",
    value: "72",
    helper: "baseline placeholder",
    progress: 72,
  },
  {
    label: "Pronunciation",
    value: "68",
    helper: "awaiting diagnostic",
    progress: 68,
  },
  { label: "Rhythm", value: "64", helper: "practice target", progress: 64 },
  { label: "Intonation", value: "70", helper: "steady progress", progress: 70 },
  { label: "Lessons", value: "1/10", helper: "MVP curriculum", progress: 10 },
  {
    label: "Streak",
    value: "0 days",
    helper: "starts after practice",
    progress: 0,
  },
];

export const mockPracticeHistory: PracticeHistoryItem[] = [
  {
    title: "Clear vowel workplace sentence",
    type: "Lesson preview",
    date: "Today",
    status: "Ready",
  },
  {
    title: "Short diagnostic passage",
    type: "Diagnostic",
    date: "Ready to record",
    status: "Analysis next",
  },
];

export const mockRoleplayScenarios: RoleplayScenario[] = [
  {
    key: "uk-job-interview",
    title: "UK job interview",
    description: "Practise calm answers with a recruiter persona.",
    context: "Interview",
    turns: 8,
  },
  {
    key: "introducing-yourself-at-work",
    title: "Introducing yourself at work",
    description: "Build a clear first-day introduction.",
    context: "Workplace",
    turns: 6,
  },
  {
    key: "asking-for-clarification",
    title: "Asking for clarification",
    description: "Practise polite repair phrases in meetings.",
    context: "Meeting",
    turns: 6,
  },
  {
    key: "customer-service",
    title: "Customer-facing conversation",
    description: "Keep speech calm and clear in service situations.",
    context: "Service",
    turns: 8,
  },
  {
    key: "professional-phone-call",
    title: "Professional phone call",
    description: "Practise pacing and clarity when there are no visual cues.",
    context: "Phone",
    turns: 6,
  },
];

export const mockDashboardSummary: DashboardSummary = {
  profile: null,
  onboardingComplete: false,
  diagnosticComplete: false,
  lessons: mockLessons.slice(0, 4),
  focusAreas: mockFocusAreas,
  metrics: mockProgressMetrics,
  recentPractice: mockPracticeHistory,
  developerMessage:
    "Supabase is not configured, so this page is showing realistic mock data.",
};
