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
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return mockLessons;
  }

  return data.map((lesson, index) => ({
    ...lesson,
    status: index === 0 ? "in_progress" : "not_started",
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

    return {
      ...lesson,
      status: "not_started",
      steps: stepsResult.data ?? [],
      prompts: promptsResult.data ?? [],
    };
  }
);
