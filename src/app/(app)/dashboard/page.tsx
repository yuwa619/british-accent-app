import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lesson, Profile } from "@/lib/supabase/database.types";
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

async function getDashboardData(): Promise<{
  profile: Profile | null;
  lessons: Lesson[];
  message: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      profile: null,
      lessons: [],
      message: `Supabase is not configured. Missing: ${getMissingSupabaseEnvKeys().join(", ")}`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      lessons: [],
      message: "Sign in to load your profile and lesson path.",
    };
  }

  const [{ data: profile }, { data: lessons }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(4),
  ]);

  return {
    profile,
    lessons: lessons ?? [],
    message: null,
  };
}

export default async function DashboardPage() {
  const { profile, lessons, message } = await getDashboardData();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Phase 2
        </Badge>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
            Dashboard
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Your Supabase-backed home base for profile status, onboarding, and
            the first available lessons.
          </p>
        </div>
      </div>

      {message ? (
        <Card>
          <CardHeader>
            <CardTitle>Developer setup</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>
              {profile?.full_name ? `Welcome, ${profile.full_name}` : "Profile"}
            </CardTitle>
            <CardDescription>
              Basic profile fields created by the Supabase auth trigger.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="rounded-lg border bg-background p-3">
              Email: {profile?.email ?? "Waiting for Supabase session"}
            </div>
            <div className="rounded-lg border bg-background p-3">
              Goal: {profile?.target_goal ?? "Onboarding not completed yet"}
            </div>
            <div className="rounded-lg border bg-background p-3">
              Native language: {profile?.native_language ?? "Not set"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available lessons</CardTitle>
            <CardDescription>
              Seeded from `supabase/seed.sql` after migrations are applied.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Link
                  className="rounded-lg border bg-background p-4 hover:bg-muted"
                  href={`/lessons/${lesson.slug}`}
                  key={lesson.id}
                >
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {lesson.skill_focus} · {lesson.estimated_minutes} min
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                Lesson data will appear here after Supabase migrations and seed
                data are applied.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Link
        className={cn(buttonVariants({ size: "lg" }), "w-fit no-underline")}
        href="/lessons"
      >
        Browse all lessons
      </Link>
    </section>
  );
}
