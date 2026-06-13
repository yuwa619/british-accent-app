import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function RoleplayPage() {
  return (
    <RoutePlaceholder
      title="Roleplay practice"
      description="Turn-based UK workplace conversations using speech-to-text, AI coaching, and optional spoken reference responses."
      phase="Phase 8"
      primaryHref="/progress"
      primaryLabel="Open progress"
      items={[
        "UK job interview",
        "Introducing yourself at work",
        "Asking for clarification",
        "Professional phone call",
      ]}
    />
  );
}
