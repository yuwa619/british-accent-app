import type { FocusAreaRecommendation, PracticePlanItem } from "@/lib/types";

export const focusLessonMap: Record<
  string,
  { slug: string; title: string; reason: string }
> = {
  schwa: {
    slug: "schwa-unstressed-syllables",
    title: "The schwa /ə/ and unstressed syllables",
    reason: "Useful for lighter unstressed vowels in longer UK phrases.",
  },
  "dental-fricatives": {
    slug: "dental-fricatives-think-this-that-through",
    title: "Dental fricatives: think, this, that, through",
    reason: "Targets /θ/ and /ð/ in common professional words.",
  },
  "sentence-stress": {
    slug: "sentence-stress-confident-speaking",
    title: "Sentence stress for confident speaking",
    reason: "Helps key content words stand out in meetings and interviews.",
  },
  "connected-speech": {
    slug: "connected-speech-linking-smoothly",
    title: "Connected speech: linking words smoothly",
    reason: "Builds smoother rhythm while keeping speech clear.",
  },
  "non-rhoticity": {
    slug: "dropping-final-r-non-rhotic",
    title: "Dropping final /r/ in non-rhotic British English",
    reason: "Practises final /r/ patterns in modern British English.",
  },
  pace: {
    slug: "interview-answers-structure-rhythm",
    title: "Interview answers with clear structure and rhythm",
    reason: "Supports calm pacing in higher-pressure workplace situations.",
  },
  intonation: {
    slug: "intonation-statements-questions",
    title: "Intonation for statements and questions",
    reason: "Builds confident pitch movement for questions and statements.",
  },
};

export function recommendLessonsForFocusAreas(
  focusAreas: FocusAreaRecommendation[]
) {
  return focusAreas
    .map((area) => {
      const lesson = focusLessonMap[area.key];

      return lesson
        ? {
            ...lesson,
            focus_area: area.label,
          }
        : null;
    })
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
    .slice(0, 3);
}

export function buildSevenDayPracticePlan(
  focusAreas: FocusAreaRecommendation[]
): PracticePlanItem[] {
  const lessons = recommendLessonsForFocusAreas(focusAreas);

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const focus = focusAreas[index % Math.max(focusAreas.length, 1)];
    const lesson = lessons[index % Math.max(lessons.length, 1)];

    return {
      day,
      title:
        day === 1
          ? "Review your baseline"
          : (lesson?.title ?? "Short clarity practice"),
      description:
        day === 1
          ? "Read your focus areas and repeat the diagnostic sentence once calmly."
          : `Spend 8-10 minutes on ${focus?.label.toLowerCase() ?? "clear speech"} with one listen-and-repeat recording.`,
      lesson_slug: lesson?.slug ?? "clear-british-vowels",
    };
  });
}
