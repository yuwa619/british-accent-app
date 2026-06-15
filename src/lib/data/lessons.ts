import { cache } from "react";

import { mockLessonDetails, mockLessons } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, LessonWithSteps } from "@/lib/types";

export const getLessons = cache(async (): Promise<Lesson[]> => {
  if (!isSupabaseConfigured()) {
    return mockLessons;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [lessonsResult, progressResult, focusResult] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    user
      ? supabase.from("user_progress").select("*").eq("user_id", user.id)
      : Promise.resolve({ data: [], error: null }),
    user
      ? supabase
          .from("focus_areas")
          .select("related_lesson_slug")
          .eq("user_id", user.id)
          .is("resolved_at", null)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (lessonsResult.error || !lessonsResult.data?.length) {
    return mockLessons;
  }

  const progressByLesson = new Map(
    (progressResult.data ?? [])
      .filter((progress) => progress.lesson_id)
      .map((progress) => [progress.lesson_id, progress])
  );
  const recommendedSlugs = new Set(
    (focusResult.data ?? [])
      .map((area) => area.related_lesson_slug)
      .filter((slug): slug is string => Boolean(slug))
  );

  return lessonsResult.data.map((lesson) => ({
    ...lesson,
    status: progressByLesson.get(lesson.id)?.status ?? "not_started",
    latest_score: progressByLesson.get(lesson.id)?.last_score ?? null,
    recommended: recommendedSlugs.has(lesson.slug),
  }));
});

export const getLessonBySlug = cache(
  async (slug: string): Promise<LessonWithSteps | null> => {
    if (!isSupabaseConfigured()) {
      return mockLessonDetails.find((lesson) => lesson.slug === slug) ?? null;
    }

    const supabase = await createClient();
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !lesson) {
      return mockLessonDetails.find((item) => item.slug === slug) ?? null;
    }

    const [stepsResult, promptsResult] = await Promise.all([
      supabase
        .from("lesson_steps")
        .select("*")
        .eq("lesson_id", lesson.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("practice_prompts")
        .select("*")
        .eq("lesson_id", lesson.id)
        .order("created_at", { ascending: true }),
    ]);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: progress } = user
      ? await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("lesson_id", lesson.id)
          .maybeSingle()
      : { data: null };

    const { data: focusAreas } = user
      ? await supabase
          .from("focus_areas")
          .select("related_lesson_slug")
          .eq("user_id", user.id)
          .eq("related_lesson_slug", lesson.slug)
          .is("resolved_at", null)
          .limit(1)
      : { data: [] };

    return {
      ...lesson,
      status: progress?.status ?? "not_started",
      latest_score: progress?.last_score ?? null,
      recommended: Boolean(focusAreas?.length),
      steps: stepsResult.data ?? [],
      prompts: promptsResult.data ?? [],
    };
  }
);
