import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/lib/types";

function formatStatus(status: Lesson["status"]) {
  if (status === "in_progress") return "In progress";
  if (status === "complete") return "Completed";
  if (status === "coming_soon") return "Preview";
  return "Not started";
}

export function LessonProgressBadge({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex flex-wrap gap-2">
      {lesson.recommended ? (
        <Badge variant="secondary">Recommended</Badge>
      ) : null}
      <Badge variant="outline">{formatStatus(lesson.status)}</Badge>
      {typeof lesson.latest_score === "number" ? (
        <Badge variant="outline">{Math.round(lesson.latest_score)}/100</Badge>
      ) : null}
    </div>
  );
}
