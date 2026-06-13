import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function ShadowingPage() {
  return (
    <RoutePlaceholder
      title="Shadowing practice"
      description="Listen, repeat, compare, and receive post-recording pitch and clarity feedback."
      phase="Phase 7"
      primaryHref="/practice/roleplay"
      primaryLabel="Open roleplay"
      items={[
        "Reference audio",
        "Browser recording",
        "Side-by-side playback",
        "Simplified pitch feedback",
      ]}
    />
  );
}
