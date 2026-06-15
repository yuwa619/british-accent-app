import type {
  DashboardSummary,
  FocusArea,
  Lesson,
  LessonWithSteps,
  PracticeHistoryItem,
  ProgressMetric,
  RoleplayScenario,
} from "@/lib/types";
import { roleplayScenarios } from "@/lib/roleplay/scenarios";

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

const lessonPracticeContent: Record<
  string,
  {
    explanation: string;
    phrases: [string, string, string];
    workplacePhrase: string;
    shadowingPhrase: string;
    reflectionTip: string;
    nextLessonSlug: string | null;
  }
> = {
  "clear-british-vowels": {
    explanation:
      "Keep the vowel shape clean and relaxed so key workplace words remain easy to follow.",
    phrases: [
      "Please check the plan and send it back by Friday.",
      "The team needs a clear update before the meeting.",
      "I can explain the change in a calm and simple way.",
    ],
    workplacePhrase: "I will send a clear summary after the call.",
    shadowingPhrase:
      "Please check the plan and send it back by Friday afternoon.",
    reflectionTip:
      "Notice whether the vowel in each stressed word feels open, steady, and easy to repeat.",
    nextLessonSlug: "schwa-unstressed-syllables",
  },
  "schwa-unstressed-syllables": {
    explanation:
      "In British speech, many unstressed syllables become lighter. This creates smoother rhythm without rushing.",
    phrases: [
      "I need to apply for a series of positions.",
      "Could you send the agenda before the meeting?",
      "We can discuss the details at the end of the call.",
    ],
    workplacePhrase: "Could you send the agenda before the meeting?",
    shadowingPhrase:
      "I need to apply for a series of positions in the department.",
    reflectionTip:
      "Make the important words clear and let smaller words become lighter.",
    nextLessonSlug: "dental-fricatives-think-this-that-through",
  },
  "dental-fricatives-think-this-that-through": {
    explanation:
      "Use light tongue placement for think, this, that, and through so the sound stays clear but not forced.",
    phrases: [
      "I think this method is better than that one.",
      "Thank you for taking the time to go through this.",
      "This Thursday works better than the third of the month.",
    ],
    workplacePhrase: "Thank you for taking the time to go through this.",
    shadowingPhrase:
      "I think this method is better than that one for the team.",
    reflectionTip:
      "Keep the tongue gentle and the airflow steady; avoid pressing too hard.",
    nextLessonSlug: "dropping-final-r-non-rhotic",
  },
  "dropping-final-r-non-rhotic": {
    explanation:
      "Many British accents do not pronounce final /r/ unless the next word begins with a vowel.",
    phrases: [
      "The manager will share the report later.",
      "Our customer care team can answer your question.",
      "The offer is for a better role in another department.",
    ],
    workplacePhrase: "The manager will share the report later.",
    shadowingPhrase:
      "Our customer care team can answer your question after four.",
    reflectionTip:
      "Let final /r/ soften at the end of a word, but link gently before a vowel.",
    nextLessonSlug: "word-stress-workplace-vocabulary",
  },
  "word-stress-workplace-vocabulary": {
    explanation:
      "Putting stress on the right syllable helps professional vocabulary sound clearer and more confident.",
    phrases: [
      "I have prepared an analysis of the proposal.",
      "The project requires careful communication.",
      "We should prioritise the most important action.",
    ],
    workplacePhrase: "I have prepared an analysis of the proposal.",
    shadowingPhrase:
      "The project requires careful communication with each department.",
    reflectionTip:
      "Tap once on the strongest syllable before you say the whole word.",
    nextLessonSlug: "sentence-stress-confident-speaking",
  },
  "sentence-stress-confident-speaking": {
    explanation:
      "Sentence stress guides the listener towards the words that carry the message.",
    phrases: [
      "I can send the report today, but the figures need checking.",
      "We need a short update before the client call.",
      "The main issue is timing, not the quality of the work.",
    ],
    workplacePhrase:
      "I can send the report today, but the figures need checking.",
    shadowingPhrase: "The main issue is timing, not the quality of the work.",
    reflectionTip:
      "Choose two or three message words and make them slightly stronger.",
    nextLessonSlug: "connected-speech-linking-smoothly",
  },
  "connected-speech-linking-smoothly": {
    explanation:
      "Connected speech helps words flow together while still keeping the message intelligible.",
    phrases: [
      "Could I have a quick update on it?",
      "I will look at it after the meeting.",
      "Let us talk about it in the afternoon.",
    ],
    workplacePhrase: "I will look at it after the meeting.",
    shadowingPhrase:
      "Could I have a quick update on it before the afternoon call?",
    reflectionTip: "Link words gently; clarity matters more than speed.",
    nextLessonSlug: "intonation-statements-questions",
  },
  "intonation-statements-questions": {
    explanation:
      "Pitch movement can make statements sound confident and questions sound open and polite.",
    phrases: [
      "I can help with that today.",
      "Could you clarify the deadline for me?",
      "Would Friday morning work for the interview?",
    ],
    workplacePhrase: "Could you clarify the deadline for me?",
    shadowingPhrase:
      "Would Friday morning work for the interview, or would Monday be better?",
    reflectionTip:
      "Let yes/no questions rise gently and keep statements steady at the end.",
    nextLessonSlug: "professional-introductions-uk",
  },
  "professional-introductions-uk": {
    explanation:
      "A clear professional introduction gives listeners your name, role, and purpose without sounding rushed.",
    phrases: [
      "Hello, I am pleased to meet you.",
      "I am joining the team as a project coordinator.",
      "I am looking forward to working with everyone.",
    ],
    workplacePhrase: "I am joining the team as a project coordinator.",
    shadowingPhrase:
      "Hello, I am pleased to meet you. I am joining the team this week.",
    reflectionTip:
      "Pause briefly after your name and make your role easy to hear.",
    nextLessonSlug: "interview-answers-structure-rhythm",
  },
  "interview-answers-structure-rhythm": {
    explanation:
      "A calm interview answer needs structure, clear stress, and a pace that gives listeners time to follow.",
    phrases: [
      "One example is when I helped improve a team process.",
      "First, I listened to the problem and clarified the goal.",
      "As a result, the team worked more efficiently.",
    ],
    workplacePhrase: "One example is when I helped improve a team process.",
    shadowingPhrase:
      "First, I listened to the problem, clarified the goal, and agreed the next step.",
    reflectionTip: "Use a short pause between situation, action, and result.",
    nextLessonSlug: null,
  },
};

export const mockLessonDetails: LessonWithSteps[] = mockLessons.map(
  (lesson) => {
    const content = lessonPracticeContent[lesson.slug];

    return {
      ...lesson,
      steps: [
        {
          id: `${lesson.id}-step-1`,
          lesson_id: lesson.id,
          step_type: "explain",
          title: "Understand the focus",
          body: content.explanation,
          practice_text: null,
          reference_text: null,
          sort_order: 1,
          created_at: new Date(0).toISOString(),
        },
        {
          id: `${lesson.id}-step-2`,
          lesson_id: lesson.id,
          step_type: "listen",
          title: "Listen for the pattern",
          body: "Read the model phrase silently first, then listen or use text mode to notice stress, pace, and rhythm.",
          practice_text: content.shadowingPhrase,
          reference_text: content.shadowingPhrase,
          sort_order: 2,
          created_at: new Date(0).toISOString(),
        },
        {
          id: `${lesson.id}-step-3`,
          lesson_id: lesson.id,
          step_type: "practice",
          title: "Practise three phrases",
          body: content.phrases.join("\n"),
          practice_text: content.workplacePhrase,
          reference_text: content.workplacePhrase,
          sort_order: 3,
          created_at: new Date(0).toISOString(),
        },
        {
          id: `${lesson.id}-step-4`,
          lesson_id: lesson.id,
          step_type: "reflect",
          title: "Reflection tip",
          body: content.reflectionTip,
          practice_text: null,
          reference_text: null,
          sort_order: 4,
          created_at: new Date(0).toISOString(),
        },
      ],
      prompts: [
        {
          id: `${lesson.id}-prompt-1`,
          lesson_id: lesson.id,
          prompt_type: "shadowing",
          title: "Shadowing phrase",
          prompt_text: content.shadowingPhrase,
          target_sound: lesson.skill_focus,
          difficulty: lesson.difficulty,
          created_at: new Date(0).toISOString(),
        },
        {
          id: `${lesson.id}-prompt-2`,
          lesson_id: lesson.id,
          prompt_type: "workplace_phrase",
          title: "Workplace phrase",
          prompt_text: content.workplacePhrase,
          target_sound: lesson.skill_focus,
          difficulty: lesson.difficulty,
          created_at: new Date(0).toISOString(),
        },
      ],
    };
  }
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

export const mockRoleplayScenarios: RoleplayScenario[] = roleplayScenarios;

export const mockDashboardSummary: DashboardSummary = {
  profile: null,
  onboardingComplete: false,
  diagnosticComplete: true,
  diagnosticStatus: "completed",
  baselineScore: 78,
  practiceCount: 3,
  analysedRecordingsCount: 3,
  lessons: mockLessons.slice(0, 4),
  focusAreas: mockFocusAreas,
  metrics: mockProgressMetrics,
  recentPractice: mockPracticeHistory,
  recommendedLesson: mockLessons[1],
  developerMessage:
    "Supabase is not configured, so this page is showing realistic mock data.",
};
