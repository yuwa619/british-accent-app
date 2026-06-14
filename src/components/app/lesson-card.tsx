import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

function formatStatus(status: Lesson["status"]) {
  if (status === "in_progress") return "In progress";
  if (status === "complete") return "Complete";
  if (status === "coming_soon") return "Preview";
  return "Not started";
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary">{lesson.difficulty}</Badge>
          <Badge variant="outline">{formatStatus(lesson.status)}</Badge>
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
