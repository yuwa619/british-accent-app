import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function DiagnosticPage() {
  return (
    <RoutePlaceholder
      title="Accent diagnostic"
      description="A three-step speaking baseline for passage reading, British sound sentences, and a short spoken prompt."
      phase="Phase 6"
      primaryHref="/feedback/demo"
      primaryLabel="Open sample feedback"
      items={[
        "Read a short passage",
        "Read key pronunciation sentences",
        "Answer a spoken prompt",
      ]}
    />
  );
}
