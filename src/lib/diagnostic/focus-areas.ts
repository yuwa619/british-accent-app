import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import type { FocusAreaRecommendation } from "@/lib/types";

const defaultFocusAreas: FocusAreaRecommendation[] = [
  {
    key: "schwa",
    label: "Schwa and unstressed syllables",
    category: "rhythm",
    description:
      "Practise reducing unstressed vowels so longer phrases sound smoother and easier to follow.",
    priority: 1,
    related_lesson_slug: "schwa-unstressed-syllables",
  },
  {
    key: "dental-fricatives",
    label: "Dental fricatives",
    category: "pronunciation",
    description:
      "Practise light tongue placement for sounds like think, this, and that.",
    priority: 2,
    related_lesson_slug: "dental-fricatives-think-this-that-through",
  },
  {
    key: "sentence-stress",
    label: "Sentence stress",
    category: "rhythm",
    description:
      "Practise stressing key content words so your message sounds clearer and more confident.",
    priority: 3,
    related_lesson_slug: "sentence-stress-confident-speaking",
  },
];

const focusTemplates: Record<
  string,
  Omit<FocusAreaRecommendation, "priority">
> = {
  schwa: {
    key: "schwa",
    label: "Schwa and unstressed syllables",
    category: "rhythm",
    description:
      "Practise reducing unstressed vowels so longer phrases sound smoother and easier to follow.",
    related_lesson_slug: "schwa-unstressed-syllables",
  },
  "dental-fricatives": {
    key: "dental-fricatives",
    label: "Dental fricatives",
    category: "pronunciation",
    description:
      "Practise light tongue placement for sounds like think, this, and that.",
    related_lesson_slug: "dental-fricatives-think-this-that-through",
  },
  "sentence-stress": {
    key: "sentence-stress",
    label: "Sentence stress",
    category: "rhythm",
    description:
      "Practise stressing key content words so your message sounds clearer and more confident.",
    related_lesson_slug: "sentence-stress-confident-speaking",
  },
  "connected-speech": {
    key: "connected-speech",
    label: "Connected speech",
    category: "rhythm",
    description:
      "Practise linking words smoothly while keeping the main message easy to hear.",
    related_lesson_slug: "connected-speech-linking-smoothly",
  },
  "non-rhoticity": {
    key: "non-rhoticity",
    label: "Final /r/ in British English",
    category: "pronunciation",
    description:
      "Practise softening final /r/ sounds where modern British English would usually leave them unspoken.",
    related_lesson_slug: "dropping-final-r-non-rhotic",
  },
  pace: {
    key: "pace",
    label: "Calm speaking pace",
    category: "fluency",
    description:
      "Practise slowing slightly around important phrases so listeners have time to follow you.",
    related_lesson_slug: "interview-answers-structure-rhythm",
  },
  intonation: {
    key: "intonation",
    label: "Intonation movement",
    category: "intonation",
    description:
      "Practise pitch movement for confident statements, questions, and clarification phrases.",
    related_lesson_slug: "intonation-statements-questions",
  },
};

function scoreFocusAreas(analyses: SpeechAnalysisFeedback[]) {
  const scores = new Map<string, number>();

  function add(key: string, weight: number) {
    scores.set(key, (scores.get(key) ?? 0) + weight);
  }

  for (const analysis of analyses) {
    if (analysis.rhythm_score < 76) add("sentence-stress", 3);
    if (analysis.pronunciation_score < 76) add("dental-fricatives", 2);
    if (analysis.intonation_score < 76) add("intonation", 2);
    if (analysis.pace_score < 76) add("pace", 2);

    for (const sound of analysis.sound_feedback) {
      const text =
        `${sound.sound} ${sound.example} ${sound.issue}`.toLowerCase();
      if (text.includes("schwa") || text.includes("/ə/")) add("schwa", 4);
      if (text.includes("fricative") || text.includes("/θ/")) {
        add("dental-fricatives", 4);
      }
      if (text.includes("stress")) add("sentence-stress", 3);
      if (text.includes("connected") || text.includes("linking")) {
        add("connected-speech", 3);
      }
      if (text.includes("non-rhotic") || text.includes("final /r/")) {
        add("non-rhoticity", 3);
      }
      if (text.includes("intonation") || text.includes("pitch")) {
        add("intonation", 2);
      }
    }
  }

  return scores;
}

export function deriveFocusAreasFromAnalysis(
  analyses: SpeechAnalysisFeedback[]
): FocusAreaRecommendation[] {
  if (!analyses.length) return defaultFocusAreas;

  const scores = scoreFocusAreas(analyses);
  const ranked = Array.from(scores.entries())
    .sort(([, first], [, second]) => second - first)
    .map(([key], index) => {
      const template = focusTemplates[key];

      return template
        ? {
            ...template,
            priority: index + 1,
          }
        : null;
    })
    .filter((item): item is FocusAreaRecommendation => Boolean(item));

  const merged = [...ranked];

  for (const fallback of defaultFocusAreas) {
    if (!merged.some((area) => area.key === fallback.key)) {
      merged.push({
        ...fallback,
        priority: merged.length + 1,
      });
    }
  }

  return merged.slice(0, 3).map((area, index) => ({
    ...area,
    priority: index + 1,
  }));
}
