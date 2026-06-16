import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  LockIcon,
  PlayIcon,
  ZapIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { lessonState, lessonXp } from "@/lib/lesson-path";
import type { Lesson } from "@/lib/types";

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function StateNode({ lesson }: { lesson: Lesson }) {
  const state = lessonState(lesson);

  if (state === "completed") {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-success/15 text-success">
        <CheckIcon className="size-5" aria-hidden="true" />
      </span>
    );
  }
  if (state === "in_progress") {
    return (
      <span className="animate-pulse-ring grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground [--tw-shadow-color:var(--primary)]">
        <PlayIcon className="size-5" aria-hidden="true" />
      </span>
    );
  }
  if (state === "locked") {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <LockIcon className="size-5" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
      <PlayIcon className="size-5" aria-hidden="true" />
    </span>
  );
}

function MetaRow({ lesson }: { lesson: Lesson }) {
  const state = lessonState(lesson);
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="font-medium text-foreground/70">
        {difficultyLabel[lesson.difficulty] ?? lesson.difficulty}
      </span>
      <span className="inline-flex items-center gap-1">
        <ClockIcon className="size-3.5" aria-hidden="true" />
        {lesson.estimated_minutes} min
      </span>
      <span className="inline-flex items-center gap-1 text-xp">
        <ZapIcon className="size-3.5" aria-hidden="true" />
        {state === "completed" ? "Earned" : "+"}
        {lessonXp(lesson)} XP
      </span>
    </div>
  );
}

export function LessonPathCard({ lesson }: { lesson: Lesson }) {
  const state = lessonState(lesson);
  const inner = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-card p-4 ring-1 ring-foreground/5 transition-all",
        state === "completed" && "border-success/30",
        state === "locked" ? "opacity-65" : "tap-scale hover:shadow-md"
      )}
    >
      <StateNode lesson={lesson} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{lesson.title}</p>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {lesson.skill_focus}
        </p>
        <MetaRow lesson={lesson} />
      </div>
      <span className="shrink-0 text-xs font-semibold whitespace-nowrap">
        {state === "completed" ? (
          <span className="text-success">Done</span>
        ) : state === "in_progress" ? (
          <span className="text-primary">Resume</span>
        ) : state === "locked" ? (
          <span className="text-muted-foreground">Soon</span>
        ) : (
          <span className="text-primary">Start</span>
        )}
      </span>
    </div>
  );

  if (state === "locked") {
    return <div aria-label={`${lesson.title} — coming soon`}>{inner}</div>;
  }

  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="block rounded-2xl no-underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {inner}
    </Link>
  );
}
