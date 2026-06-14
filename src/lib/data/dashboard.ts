import { cache } from "react";

import {
  mockDashboardSummary,
  mockFocusAreas,
  mockPracticeHistory,
  mockProgressMetrics,
} from "@/lib/mock-data";
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary } from "@/lib/types";
import { getLessons } from "@/lib/data/lessons";

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

    const [profileResult, onboardingResult, lessons] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("onboarding_responses")
        .select("id")
        .eq("user_id", user.id)
        .limit(1),
      getLessons(),
    ]);

    return {
      profile: profileResult.data,
      onboardingComplete: Boolean(onboardingResult.data?.length),
      diagnosticComplete: false,
      lessons: lessons.slice(0, 4),
      focusAreas: mockFocusAreas,
      metrics: mockProgressMetrics,
      recentPractice: mockPracticeHistory,
      developerMessage: profileResult.error
        ? `Supabase query fallback: ${profileResult.error.message}`
        : getMissingSupabaseEnvKeys().length
          ? `Missing Supabase env vars: ${getMissingSupabaseEnvKeys().join(", ")}`
          : null,
    };
  }
);
