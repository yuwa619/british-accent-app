import Link from "next/link";
import { BookOpenTextIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecommendedLesson } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecommendedLessonsPanel({
  lessons,
}: {
  lessons: RecommendedLesson[];
}) {
  return (
    <Card>
      <CardHeader>
        <BookOpenTextIcon className="size-5 text-primary" />
        <CardTitle>Recommended next lessons</CardTitle>
        <CardDescription>
          Start with the lessons most closely matched to your baseline.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {lessons.map((lesson) => (
          <div
            className="rounded-lg border bg-background p-4"
            key={lesson.slug}
          >
            <p className="font-medium">{lesson.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {lesson.reason}
            </p>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "mt-3 no-underline"
              )}
              href={`/lessons/${lesson.slug}`}
            >
              Start lesson
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
