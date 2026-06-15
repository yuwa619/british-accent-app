import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LessonProgressBadge } from "@/components/app/lesson-progress-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary">{lesson.difficulty}</Badge>
          <LessonProgressBadge lesson={lesson} />
        </div>
        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>{lesson.skill_focus}</p>
        <p className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          {lesson.estimated_minutes} minutes
        </p>
      </CardContent>
      <CardFooter>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href={`/lessons/${lesson.slug}`}
        >
          Open lesson
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Card>
  );
}
