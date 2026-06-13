import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function OnboardingPage() {
  return (
    <RoutePlaceholder
      title="Onboarding"
      description="Capture each learner's language background, UK communication goals, and professional context."
      phase="Phase 3"
      primaryHref="/diagnostic"
      primaryLabel="Open diagnostic"
      items={[
        "Native language",
        "Primary UK speaking goal",
        "Industry or study context",
      ]}
    />
  );
}
