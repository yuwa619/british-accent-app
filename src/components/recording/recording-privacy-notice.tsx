import { ShieldCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RecordingPrivacyNotice() {
  return (
    <Alert>
      <ShieldCheckIcon className="size-4" />
      <AlertTitle>Voice privacy and control</AlertTitle>
      <AlertDescription>
        Recordings are for practice and future feedback. You choose when to
        save, and you can delete saved recordings. The default retention policy
        is 30 days. AI analysis arrives in Phase 5 and will use your processing
        consent; scores are guidance, not judgement.
      </AlertDescription>
    </Alert>
  );
}
