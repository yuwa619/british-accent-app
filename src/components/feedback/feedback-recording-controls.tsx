"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SettingsIcon, Trash2Icon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/client";
import { analyticsEvents } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export function FeedbackRecordingControls({
  recordingId,
  recordingType,
}: {
  recordingId: string;
  recordingType: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    trackEvent(analyticsEvents.feedbackViewed, {
      recording_type: recordingType,
    });
  }, [recordingType]);

  async function deleteRecording() {
    if (!confirming) {
      setConfirming(true);
      setMessage("Confirm deletion to remove this recording.");
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/recordings/${recordingId}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to delete recording.");
      }

      setMessage(
        "Recording deleted. Existing feedback may remain until a full data deletion request is processed."
      );
      trackEvent(analyticsEvents.recordingDeleted, {
        recording_type: recordingType,
        source: "feedback",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete recording right now."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
      <p className="font-medium">Recording controls</p>
      <p className="text-sm leading-6 text-muted-foreground">
        You can remove the saved audio for this recording. Manage retention and
        account-level deletion requests from Settings.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          disabled={isDeleting}
          onClick={deleteRecording}
          type="button"
          variant="destructive"
        >
          <Trash2Icon data-icon="inline-start" />
          {isDeleting
            ? "Deleting..."
            : confirming
              ? "Confirm delete"
              : "Delete recording"}
        </Button>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href="/settings"
        >
          <SettingsIcon data-icon="inline-start" />
          Privacy settings
        </Link>
      </div>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
