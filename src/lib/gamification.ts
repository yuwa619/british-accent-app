import type { DashboardSummary, ProgressMetric } from "@/lib/types";

/**
 * Gamification is intentionally derived from existing progress data so the app
 * can feel motivating without any new database tables or migrations. Everything
 * here is pure and deterministic: given the same inputs it returns the same
 * output, which keeps server and client renders identical (no hydration drift).
 */

export type BadgeKey =
  | "first-steps"
  | "baseline-set"
  | "lesson-cleared"
  | "consistent"
  | "clarity-climber"
  | "roleplay-ready"
  | "five-lessons"
  | "rhythm-master";

export type Achievement = {
  key: BadgeKey;
  label: string;
  description: string;
  /** Maps to a lucide icon in the badge component. */
  icon:
    | "sparkles"
    | "target"
    | "check"
    | "flame"
    | "trending"
    | "mic"
    | "medal"
    | "music";
  earned: boolean;
};

export type StrengthArea = {
  label: string;
  score: number;
};

export type LevelTier = {
  level: number;
  title: string;
  subtitle: string;
};

export type GameStats = {
  xp: number;
  level: number;
  levelTitle: string;
  levelSubtitle: string;
  isMaxLevel: boolean;
  xpIntoLevel: number;
  xpForLevel: number;
  xpToNext: number;
  progressToNext: number;
  streakDays: number;
  dailyGoalTarget: number;
  dailyGoalDone: number;
  dailyGoalProgress: number;
  dailyGoalMet: boolean;
  weeklyGoalTarget: number;
  weeklyGoalDone: number;
  weeklyGoalProgress: number;
  achievements: Achievement[];
  earnedCount: number;
  strengths: StrengthArea[];
};

export const LEVEL_TIERS: LevelTier[] = [
  {
    level: 1,
    title: "Clear Foundations",
    subtitle: "Shaping core British sounds",
  },
  {
    level: 2,
    title: "Workplace Rhythm",
    subtitle: "Natural stress, pace and flow",
  },
  {
    level: 3,
    title: "Confident Conversations",
    subtitle: "Speaking with quiet assurance",
  },
  { level: 4, title: "Fluent Presence", subtitle: "Polished, easy delivery" },
  {
    level: 5,
    title: "Native-like Flow",
    subtitle: "Effortless UK communication",
  },
];

export type GameInput = {
  completedLessons: number;
  analysedRecordings: number;
  practiceCount: number;
  diagnosticComplete: boolean;
  baselineScore: number | null;
  latestScore: number | null;
  onboardingComplete?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** XP earned for the current cumulative effort. Bounded, integer, deterministic. */
export function computeXp(input: GameInput): number {
  const lessonXp = input.completedLessons * 150;
  const analysisXp = input.analysedRecordings * 70;
  const practiceXp = input.practiceCount * 30;
  const diagnosticXp = input.diagnosticComplete ? 200 : 0;
  const scoreXp = input.latestScore
    ? Math.round(clamp(input.latestScore, 0, 100))
    : 0;
  return lessonXp + analysisXp + practiceXp + diagnosticXp + scoreXp;
}

/** Resolve a level (and the XP window for it) from a cumulative XP total. */
export function resolveLevel(xp: number) {
  let level = 1;
  let cumulativeStart = 0;
  let need = 300; // XP required to advance from level 1 to level 2

  while (level < LEVEL_TIERS.length && xp >= cumulativeStart + need) {
    cumulativeStart += need;
    level += 1;
    need += 150; // each subsequent level asks for a little more
  }

  const tier = LEVEL_TIERS[level - 1];
  const isMaxLevel = level >= LEVEL_TIERS.length;
  const xpIntoLevel = xp - cumulativeStart;
  const xpForLevel = isMaxLevel ? Math.max(xpIntoLevel, 1) : need;
  const xpToNext = isMaxLevel ? 0 : Math.max(0, need - xpIntoLevel);
  const progressToNext = isMaxLevel
    ? 100
    : clamp(Math.round((xpIntoLevel / need) * 100), 0, 100);

  return {
    level,
    title: tier.title,
    subtitle: tier.subtitle,
    isMaxLevel,
    xpIntoLevel,
    xpForLevel,
    xpToNext,
    progressToNext,
  };
}

function buildAchievements(
  input: GameInput,
  streakDays: number
): Achievement[] {
  const {
    analysedRecordings,
    completedLessons,
    diagnosticComplete,
    latestScore,
    practiceCount,
  } = input;

  return [
    {
      key: "first-steps",
      label: "First steps",
      description: "Recorded and analysed your first practice clip.",
      icon: "sparkles",
      earned: analysedRecordings >= 1 || diagnosticComplete,
    },
    {
      key: "baseline-set",
      label: "Baseline set",
      description: "Completed the diagnostic to map your starting point.",
      icon: "target",
      earned: diagnosticComplete,
    },
    {
      key: "lesson-cleared",
      label: "Lesson cleared",
      description: "Finished a full guided lesson.",
      icon: "check",
      earned: completedLessons >= 1,
    },
    {
      key: "consistent",
      label: "On a roll",
      description: "Built a three-day practice streak.",
      icon: "flame",
      earned: streakDays >= 3,
    },
    {
      key: "clarity-climber",
      label: "Clarity climber",
      description: "Scored 80 or above on a recording.",
      icon: "trending",
      earned: (latestScore ?? 0) >= 80,
    },
    {
      key: "roleplay-ready",
      label: "Roleplay ready",
      description: "Practised a live workplace conversation.",
      icon: "mic",
      earned: practiceCount >= 1,
    },
    {
      key: "five-lessons",
      label: "Curriculum mover",
      description: "Completed five lessons.",
      icon: "medal",
      earned: completedLessons >= 5,
    },
    {
      key: "rhythm-master",
      label: "Rhythm master",
      description: "Reached a strong rhythm score across practice.",
      icon: "music",
      earned: completedLessons >= 3 && (latestScore ?? 0) >= 75,
    },
  ];
}

function buildStrengths(metrics: ProgressMetric[]): StrengthArea[] {
  const wanted = ["Clarity", "Pronunciation", "Rhythm", "Intonation"];
  return metrics
    .filter(
      (metric) =>
        wanted.includes(metric.label) && typeof metric.progress === "number"
    )
    .map((metric) => ({
      label: metric.label,
      score: clamp(metric.progress ?? 0, 0, 100),
    }));
}

export function deriveGameStats(
  input: GameInput,
  metrics: ProgressMetric[] = []
): GameStats {
  const xp = computeXp(input);
  const level = resolveLevel(xp);

  // Streak is an encouraging, deterministic read of recent activity.
  const streakDays = clamp(
    input.analysedRecordings + (input.diagnosticComplete ? 1 : 0),
    0,
    30
  );

  // Daily goal: three short practice reps a day. "Done" is a stable read of
  // recent activity so the ring always renders the same on server and client.
  const dailyGoalTarget = 3;
  const dailyGoalDone = clamp(input.analysedRecordings, 0, dailyGoalTarget);
  const dailyGoalProgress = clamp(
    Math.round((dailyGoalDone / dailyGoalTarget) * 100),
    0,
    100
  );

  // Weekly goal: five practice sessions across the week.
  const weeklyGoalTarget = 5;
  const weeklyGoalDone = clamp(
    input.practiceCount + input.completedLessons,
    0,
    weeklyGoalTarget
  );
  const weeklyGoalProgress = clamp(
    Math.round((weeklyGoalDone / weeklyGoalTarget) * 100),
    0,
    100
  );

  const achievements = buildAchievements(input, streakDays);

  return {
    xp,
    level: level.level,
    levelTitle: level.title,
    levelSubtitle: level.subtitle,
    isMaxLevel: level.isMaxLevel,
    xpIntoLevel: level.xpIntoLevel,
    xpForLevel: level.xpForLevel,
    xpToNext: level.xpToNext,
    progressToNext: level.progressToNext,
    streakDays,
    dailyGoalTarget,
    dailyGoalDone,
    dailyGoalProgress,
    dailyGoalMet: dailyGoalDone >= dailyGoalTarget,
    weeklyGoalTarget,
    weeklyGoalDone,
    weeklyGoalProgress,
    achievements,
    earnedCount: achievements.filter((badge) => badge.earned).length,
    strengths: buildStrengths(metrics),
  };
}

export function deriveGameStatsFromDashboard(
  summary: DashboardSummary
): GameStats {
  const completedLessons = summary.lessons.filter(
    (lesson) => lesson.status === "complete"
  ).length;

  return deriveGameStats(
    {
      completedLessons,
      analysedRecordings: summary.analysedRecordingsCount,
      practiceCount: summary.practiceCount,
      diagnosticComplete: summary.diagnosticComplete,
      baselineScore: summary.baselineScore,
      latestScore: summary.baselineScore,
      onboardingComplete: summary.onboardingComplete,
    },
    summary.metrics
  );
}

/** The single most useful next action, with a small XP incentive. */
export type DailyMission = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  xpReward: number;
  minutes: number;
};

export function deriveDailyMission(summary: DashboardSummary): DailyMission {
  if (!summary.onboardingComplete) {
    return {
      title: "Set up your speaking profile",
      description:
        "Tell us your goals so we can shape your sessions around the UK situations that matter to you.",
      href: "/onboarding",
      ctaLabel: "Start profile",
      xpReward: 40,
      minutes: 3,
    };
  }

  if (!summary.diagnosticComplete) {
    return {
      title: "Record your clarity baseline",
      description:
        "Three short prompts give you a personalised starting score and your first focus areas.",
      href: "/diagnostic",
      ctaLabel: "Start diagnostic",
      xpReward: 60,
      minutes: 5,
    };
  }

  if (summary.recommendedLesson) {
    return {
      title: summary.recommendedLesson.title,
      description:
        "A short, focused lesson picked from your latest focus areas. Listen, shadow, record, repeat.",
      href: `/lessons/${summary.recommendedLesson.slug}`,
      ctaLabel: "Start lesson",
      xpReward: 50,
      minutes: summary.recommendedLesson.estimated_minutes ?? 6,
    };
  }

  return {
    title: "Quick 3-minute practice",
    description:
      "Warm up with a short shadowing rep to keep your streak alive and your rhythm sharp.",
    href: "/practice/shadowing",
    ctaLabel: "Start practice",
    xpReward: 30,
    minutes: 3,
  };
}
