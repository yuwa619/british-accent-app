import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function LessonsPage() {
  return (
    <RoutePlaceholder
      title="Lessons"
      description="Structured practice for British vowels, schwa, dental fricatives, non-rhoticity, stress, rhythm, and workplace phrases."
      phase="Phase 3"
      primaryHref="/lessons/clear-british-vowels"
      primaryLabel="Open first lesson"
      items={[
        "Clear British vowels for professional speech",
        "The schwa and unstressed syllables",
        "Dental fricatives: think, this, that, through",
        "Interview answers with clear structure and rhythm",
      ]}
    />
  );
}
