import Link from "next/link";
import { TargetIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FocusArea, FocusAreaRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FocusAreasPanel({
  focusAreas,
}: {
  focusAreas: Array<FocusArea | FocusAreaRecommendation>;
}) {
  return (
    <Card>
      <CardHeader>
        <TargetIcon className="size-5 text-primary" />
        <CardTitle>Focus areas</CardTitle>
        <CardDescription>
          The top patterns to practise first, based on your analysed speech.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {focusAreas.map((area) => (
          <div className="rounded-lg border bg-background p-4" key={area.label}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Priority {area.priority}</Badge>
              <Badge variant="outline">{area.category}</Badge>
            </div>
            <p className="mt-3 font-medium">{area.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {area.description}
            </p>
            {area.related_lesson_slug ? (
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "mt-3 no-underline"
                )}
                href={`/lessons/${area.related_lesson_slug}`}
              >
                Open related lesson
              </Link>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
