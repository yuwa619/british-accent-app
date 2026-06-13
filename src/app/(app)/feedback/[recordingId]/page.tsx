import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ recordingId: string }>;
}) {
  const { recordingId } = await params;

  return (
    <RoutePlaceholder
      title={`Feedback: ${recordingId}`}
      description="Feedback pages will show clarity, pronunciation, rhythm, intonation, pace, word tips, and the next exercise."
      phase="Phase 5"
      primaryHref="/dashboard"
      primaryLabel="Back to dashboard"
      items={[
        "Overall clarity score",
        "One thing done well",
        "One thing to improve",
        "Next exercise",
      ]}
    />
  );
}
