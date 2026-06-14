"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecordingItem } from "@/lib/types";

export function DeleteRecordingDialog({
  recording,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  recording: RecordingItem;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: (recording: RecordingItem) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete this recording?</CardTitle>
        <CardDescription>
          This removes the saved recording from your practice history. In mock
          mode, it only removes the local session item.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button
          disabled={isDeleting}
          onClick={() => onConfirm(recording)}
          type="button"
          variant="destructive"
        >
          <Trash2Icon data-icon="inline-start" />
          {isDeleting ? "Deleting..." : "Delete recording"}
        </Button>
        <Button
          disabled={isDeleting}
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Keep recording
        </Button>
      </CardContent>
    </Card>
  );
}
