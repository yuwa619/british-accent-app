import type { Lesson } from "@/lib/types";

export type LessonState = "completed" | "in_progress" | "available" | "locked";

export function lessonState(lesson: Lesson): LessonState {
  if (lesson.status === "complete") return "completed";
  if (lesson.status === "in_progress") return "in_progress";
  if (lesson.status === "coming_soon") return "locked";
  return "available";
}

export function lessonXp(lesson: Lesson): number {
  switch (lesson.difficulty) {
    case "advanced":
      return 90;
    case "intermediate":
      return 70;
    default:
      return 50;
  }
}

export type LessonPathGroup = {
  level: number;
  title: string;
  subtitle: string;
  lessons: Lesson[];
  completed: number;
};

const PATH_TITLES = [
  { title: "Clear Foundations", subtitle: "Core British sounds and rhythm" },
  { title: "Workplace Rhythm", subtitle: "Stress, pace and connected speech" },
  {
    title: "Confident Conversations",
    subtitle: "Intonation, introductions and interviews",
  },
];

/** Split the curriculum into three ordered "levels" for a skill-path layout. */
export function groupLessonsIntoPath(lessons: Lesson[]): LessonPathGroup[] {
  const sorted = [...lessons].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const groupCount = PATH_TITLES.length;
  const perGroup = Math.max(1, Math.ceil(sorted.length / groupCount));
  const groups: Lesson[][] = [[], [], []];

  sorted.forEach((lesson, index) => {
    const target = Math.min(groupCount - 1, Math.floor(index / perGroup));
    groups[target].push(lesson);
  });

  return groups
    .map((groupLessons, index) => ({
      level: index + 1,
      title: PATH_TITLES[index].title,
      subtitle: PATH_TITLES[index].subtitle,
      lessons: groupLessons,
      completed: groupLessons.filter(
        (lesson) => lessonState(lesson) === "completed"
      ).length,
    }))
    .filter((group) => group.lessons.length > 0);
}
