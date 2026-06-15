import type { SpeechAnalysisFeedback } from "@/lib/ai/types";
import { deriveFocusAreasFromAnalysis } from "@/lib/diagnostic/focus-areas";
import {
  buildSevenDayPracticePlan,
  recommendLessonsForFocusAreas,
} from "@/lib/diagnostic/recommendations";
import type { DiagnosticReport } from "@/lib/types";

function average(values: number[]) {
  if (!values.length) return 0;

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length
  );
}

function getStrengths(report: {
  pronunciation_score: number;
  rhythm_score: number;
  intonation_score: number;
  pace_score: number;
  clarity_score: number;
}) {
  const ranked = [
    ["Clear pronunciation", report.pronunciation_score],
    ["Steady rhythm", report.rhythm_score],
    ["Helpful intonation", report.intonation_score],
    ["Calm pace", report.pace_score],
    ["Overall clarity", report.clarity_score],
  ].sort(([, first], [, second]) => Number(second) - Number(first));

  return ranked.slice(0, 2).map(([label]) => String(label));
}

export function aggregateDiagnosticResults({
  analyses,
  userId,
  recordingIds,
}: {
  analyses: SpeechAnalysisFeedback[];
  userId: string;
  recordingIds: string[];
}): DiagnosticReport {
  const scores = {
    overall_score: average(analyses.map((analysis) => analysis.overall_score)),
    pronunciation_score: average(
      analyses.map((analysis) => analysis.pronunciation_score)
    ),
    rhythm_score: average(analyses.map((analysis) => analysis.rhythm_score)),
    intonation_score: average(
      analyses.map((analysis) => analysis.intonation_score)
    ),
    pace_score: average(analyses.map((analysis) => analysis.pace_score)),
    clarity_score: average(analyses.map((analysis) => analysis.clarity_score)),
  };
  const focusAreas = deriveFocusAreasFromAnalysis(analyses);
  const recommendedLessons = recommendLessonsForFocusAreas(focusAreas);
  const practicePlan = buildSevenDayPracticePlan(focusAreas);
  const strengths = getStrengths(scores);

  return {
    id: `diagnostic-${recordingIds.join("-").slice(0, 24) || "mock"}`,
    user_id: userId,
    ...scores,
    summary:
      "Your baseline shows clear, understandable speech with a few focused areas that can make UK workplace conversations feel smoother and more confident.",
    strengths,
    focus_areas: focusAreas,
    recommended_lessons: recommendedLessons,
    practice_plan: practicePlan,
    recording_ids: recordingIds,
    created_at: new Date().toISOString(),
    is_mock: userId === "mock-user",
  };
}
