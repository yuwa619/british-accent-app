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
          ? "Before any voice upload, the app explains consent, retention, and delete controls."
          : "Before any voice upload, the app explains consent, AI processing plans, and retention controls. Recordings can be deleted, and future scores are guidance for practice, not a judgement of your accent or identity."}
      </AlertDescription>
    </Alert>
  );
}
