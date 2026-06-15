import Link from "next/link";
import { ArrowLeftIcon, HeadphonesIcon } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { LessonProgressBadge } from "@/components/app/lesson-progress-badge";
import { PageHeader } from "@/components/app/page-header";
import { LessonFlow } from "@/components/lessons/lesson-flow";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getLessonBySlug } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getLessonBySlug(lessonId);

  if (!lesson) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-fit no-underline"
          )}
          href="/lessons"
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to lessons
        </Link>
        <EmptyState
          icon={HeadphonesIcon}
          title="Lesson not found"
          description="This lesson may not be published yet. Browse the available curriculum and choose another practice topic."
          actionHref="/lessons"
          actionLabel="Browse lessons"
        />
      </section>
    );
  }

  const firstPrompt = lesson.prompts[0] ?? null;
  const practiceText =
    firstPrompt?.prompt_text ??
    lesson.steps.find((step) => step.practice_text)?.practice_text ??
    "Please read the practice phrase clearly, with calm rhythm and confident pacing.";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit no-underline"
        )}
        href="/lessons"
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to lessons
      </Link>

      <PageHeader
        eyebrow={lesson.skill_focus}
        title={lesson.title}
        description={
          lesson.description ??
          "A guided pronunciation and confidence practice lesson."
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{lesson.difficulty}</Badge>
            <Badge variant="outline">{lesson.estimated_minutes} minutes</Badge>
            <LessonProgressBadge lesson={lesson} />
          </div>
        }
      />

      <LessonFlow
        lesson={lesson}
        practiceText={practiceText}
        promptId={firstPrompt?.id ?? null}
      />
    </section>
  );
}
