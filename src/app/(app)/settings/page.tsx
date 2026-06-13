import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function SettingsPage() {
  return (
    <RoutePlaceholder
      title="Settings"
      description="Manage account preferences, recording consent, privacy controls, and subscription-ready plan state."
      phase="Phase 9"
      primaryHref="/privacy"
      primaryLabel="Read privacy"
      items={[
        "Recording consent",
        "Delete recordings",
        "Request data deletion",
        "Subscription status",
      ]}
    />
  );
}
