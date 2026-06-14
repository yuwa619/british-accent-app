import { LessonCard } from "@/components/app/lesson-card";
import { PageHeader } from "@/components/app/page-header";
import { getLessons } from "@/lib/data/lessons";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Lessons"
        title="Practise the sounds and rhythm that carry UK workplace speech."
        description="Start with foundations such as British vowels, schwa, dental fricatives, word stress, and sentence rhythm, then move towards interviews and everyday professional phrases."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}
