import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function ProgressPage() {
  return (
    <RoutePlaceholder
      title="Progress"
      description="Track score movement, practice history, focus area mastery, and daily consistency."
      phase="Phase 6"
      primaryHref="/settings"
      primaryLabel="Open settings"
      items={[
        "Baseline scores",
        "Score trend",
        "Practice history",
        "Focus area mastery",
      ]}
    />
  );
}
