import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  return (
    <RoutePlaceholder
      title={`Lesson: ${lessonId}`}
      description="Lesson detail pages will combine explanation, reference audio, recording, feedback, and progress updates."
      phase="Phase 7"
      primaryHref="/practice/shadowing"
      primaryLabel="Open shadowing"
      items={[
        "Listen to reference",
        "Record your version",
        "Compare side by side",
        "Save next focus area",
      ]}
    />
  );
}
