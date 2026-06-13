import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function PrivacyPage() {
  return (
    <RoutePlaceholder
      title="Privacy"
      description="Voice recording consent, AI processing, retention, and deletion controls will be documented here before beta launch."
      phase="Phase 9"
      primaryHref="/auth/sign-up"
      primaryLabel="Create account"
      items={[
        "Default 30-day recording retention policy",
        "Private audio storage and authenticated access",
        "Delete recordings and request full data deletion",
        "Plain-English AI processing disclosure",
      ]}
    />
  );
}
