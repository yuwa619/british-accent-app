import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MicrophonePermissionHelp({
  error,
  isSupported,
}: {
  error: string | null;
  isSupported: boolean;
}) {
  if (!error && isSupported) return null;

  return (
    <Alert variant="destructive">
      <CircleAlertIcon className="size-4" />
      <AlertTitle>
        {isSupported ? "Recording needs attention" : "Recording unavailable"}
      </AlertTitle>
      <AlertDescription>
        {error ??
          "This browser does not support in-page audio recording. Try the latest version of Chrome, Edge, or Safari."}
      </AlertDescription>
    </Alert>
  );
}
