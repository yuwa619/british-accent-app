import { PageHeader } from "@/components/app/page-header";
import { LessonPathCard } from "@/components/game/lesson-path-card";
import { Badge } from "@/components/ui/badge";
import { getLessons } from "@/lib/data/lessons";
import { groupLessonsIntoPath } from "@/lib/lesson-path";

export default async function LessonsPage() {
  const lessons = await getLessons();
  const path = groupLessonsIntoPath(lessons);
  const totalCompleted = lessons.filter(
    (lesson) => lesson.status === "complete"
  ).length;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader
        eyebrow="Learning path"
        title="Practise the sounds and rhythm that carry UK workplace speech."
        description="Move through three levels — from clear foundations to confident conversations. Each lesson is a short listen, shadow, record and review loop."
      />

      <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 ring-1 ring-foreground/5">
        <div className="flex-1">
          <p className="text-sm font-medium">Your path progress</p>
          <p className="text-xs text-muted-foreground">
            {totalCompleted} of {lessons.length} lessons complete
          </p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-muted sm:w-48">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${lessons.length ? Math.round((totalCompleted / lessons.length) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {path.map((group) => (
          <div key={group.level} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="shrink-0">
                  Level {group.level}
                </Badge>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    {group.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {group.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {group.completed}/{group.lessons.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {group.lessons.map((lesson) => (
                <LessonPathCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
