import { cache } from "react";

import { mockDashboardSummary } from "@/lib/mock-data";
import { getLessons } from "@/lib/data/lessons";
import { getProgressSummary } from "@/lib/data/progress";
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary } from "@/lib/types";

export const getDashboardSummary = cache(
  async (): Promise<DashboardSummary> => {
    if (!isSupabaseConfigured()) {
      return mockDashboardSummary;
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ...mockDashboardSummary,
        developerMessage: "Sign in to load your profile and saved progress.",
      };
    }

    const [profileResult, onboardingResult, lessons, progress] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("onboarding_responses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
        getLessons(),
        getProgressSummary(),
      ]);

    const recommendedLesson =
      lessons.find((lesson) =>
        progress.focusAreas.some(
          (area) => area.related_lesson_slug === lesson.slug
        )
      ) ??
      lessons.find((lesson) => lesson.status !== "complete") ??
      null;

    return {
      profile: profileResult.data,
      onboardingComplete: Boolean(onboardingResult.data?.length),
      diagnosticComplete: Boolean(progress.diagnostic),
      diagnosticStatus: progress.diagnostic
        ? "completed"
        : progress.analysedRecordingsCount
          ? "in_progress"
          : "not_started",
      baselineScore: progress.diagnostic?.overall_score ?? null,
      practiceCount: progress.practiceHistory.length,
      analysedRecordingsCount: progress.analysedRecordingsCount,
      lessons: lessons.slice(0, 4),
      focusAreas: progress.focusAreas,
      metrics: progress.metrics,
      recentPractice: progress.practiceHistory,
      recommendedLesson,
      developerMessage: profileResult.error
        ? `Supabase query fallback: ${profileResult.error.message}`
        : getMissingSupabaseEnvKeys().length
          ? `Missing Supabase env vars: ${getMissingSupabaseEnvKeys().join(", ")}`
          : null,
    };
  }
);
