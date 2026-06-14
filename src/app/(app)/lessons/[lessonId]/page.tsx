import Link from "next/link";
import { ArrowLeftIcon, HeadphonesIcon } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    null;

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
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lesson steps</CardTitle>
            <CardDescription>
              Work through the explanation and read-aloud practice before
              analysing a saved recording for focused coaching feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.steps.map((step, index) => (
              <div
                className="rounded-lg border bg-background p-4"
                key={step.id}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-muted text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs uppercase tracking-normal text-muted-foreground">
                      {step.step_type}
                    </p>
                  </div>
                </div>
                {step.body ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                ) : null}
                {step.practice_text ? (
                  <blockquote className="mt-4 rounded-lg bg-muted p-4 text-base leading-7">
                    {step.practice_text}
                  </blockquote>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <RecordingUploadCard
            description="Record yourself reading the practice prompt, listen back, save it, then analyse the clip for coaching feedback."
            lessonId={lesson.id}
            practiceText={practiceText}
            promptId={firstPrompt?.id ?? null}
            recordingType="lesson"
            title="Record this lesson"
          />
          <Card>
            <CardHeader>
              <CardTitle>Practice prompt</CardTitle>
              <CardDescription>
                Use this text now as a low-pressure read-aloud drill.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.prompts.map((prompt) => (
                <div
                  className="rounded-lg border bg-muted/40 p-4"
                  key={prompt.id}
                >
                  <p className="font-medium">{prompt.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {prompt.prompt_text}
                  </p>
                  {prompt.target_sound ? (
                    <Badge className="mt-3" variant="outline">
                      {prompt.target_sound}
                    </Badge>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
