import { ShieldCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PrivacyConsentNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Alert>
      <ShieldCheckIcon className="size-4" />
      <AlertTitle>Voice privacy first</AlertTitle>
      <AlertDescription>
        {compact
          ? "Before any voice upload, the app will ask for consent and explain retention controls."
          : "Recording features arrive in Phase 4. Before any voice upload, the app will ask for consent, explain AI processing, and show retention controls. Scores are guidance for practice, not a judgement of your accent or identity."}
      </AlertDescription>
    </Alert>
  );
}
