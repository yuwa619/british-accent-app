"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  DownloadIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

import { SubscriptionPanel } from "@/components/billing/subscription-panel";
import { RecordingList } from "@/components/recording/recording-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics/client";
import { analyticsEvents } from "@/lib/analytics/events";
import type {
  DataDeletionRequest,
  Profile,
  UserSettings,
} from "@/lib/supabase/database.types";
import type { RecordingItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type SettingsControlCentreProps = {
  profile: Profile | null;
  settings: UserSettings;
  recentRecordings: RecordingItem[];
  deletionRequests: DataDeletionRequest[];
  developerMessage: string | null;
};

type SaveResponse = {
  error?: string;
  mode?: "mock" | "supabase";
};

type DeleteAllResponse = {
  error?: string;
  deletedCount?: number;
  mode?: "mock" | "supabase";
  message?: string;
};

type DataDeletionResponse = {
  error?: string;
  request?: DataDeletionRequest;
  mode?: "mock" | "supabase";
};

export function SettingsControlCentre({
  profile,
  settings,
  recentRecordings,
  deletionRequests,
  developerMessage,
}: SettingsControlCentreProps) {
  const [retainDays, setRetainDays] = useState(settings.retain_recordings_days);
  const [allowAiProcessing, setAllowAiProcessing] = useState(
    settings.allow_ai_processing
  );
  const [emailReminders, setEmailReminders] = useState(
    settings.email_reminders
  );
  const [recordings, setRecordings] = useState(recentRecordings);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [notes, setNotes] = useState("");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requests, setRequests] = useState(deletionRequests);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveSettings() {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/user-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retainRecordingsDays: retainDays,
          allowAiProcessing,
          emailReminders,
        }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as SaveResponse | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save settings.");
      }

      setSaveMessage(
        payload?.mode === "mock"
          ? "Mock settings saved for this session."
          : "Settings saved."
      );
      trackEvent(analyticsEvents.settingsUpdated, {
        retain_recordings_days: retainDays,
        allow_ai_processing: allowAiProcessing,
        email_reminders: emailReminders,
      });
    } catch (error) {
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings right now."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteAllRecordings() {
    if (!deleteConfirm) {
      setDeleteMessage("Confirm that you want to delete all recordings first.");
      return;
    }

    setIsDeletingAll(true);
    setDeleteMessage(null);

    try {
      const response = await fetch("/api/recordings", { method: "DELETE" });
      const payload = (await response
        .json()
        .catch(() => null)) as DeleteAllResponse | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to delete recordings.");
      }

      setRecordings([]);
      setDeleteConfirm(false);
      setDeleteMessage(
        payload?.message ??
          `Deleted ${payload?.deletedCount ?? 0} recording${
            payload?.deletedCount === 1 ? "" : "s"
          }.`
      );
      trackEvent(analyticsEvents.allRecordingsDeleted, {
        count: payload?.deletedCount ?? 0,
        mode: payload?.mode ?? "unknown",
      });
    } catch (error) {
      setDeleteMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete recordings right now."
      );
    } finally {
      setIsDeletingAll(false);
    }
  }

  async function requestDataDeletion() {
    setIsRequestingDeletion(true);
    setRequestMessage(null);

    try {
      const response = await fetch("/api/account/delete-data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as DataDeletionResponse | null;

      if (!response.ok || !payload?.request) {
        throw new Error(payload?.error ?? "Unable to create request.");
      }

      setRequests((current) => [
        payload.request as DataDeletionRequest,
        ...current,
      ]);
      setNotes("");
      setRequestMessage(
        payload.mode === "mock"
          ? "Mock deletion request created for this session."
          : "Data deletion request received. We will review it before any irreversible account-level action."
      );
      trackEvent(analyticsEvents.dataDeleteRequested, {
        request_type: payload.request.request_type,
        mode: payload.mode ?? "unknown",
      });
    } catch (error) {
      setRequestMessage(
        error instanceof Error
          ? error.message
          : "Unable to request data deletion right now."
      );
    } finally {
      setIsRequestingDeletion(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {developerMessage ? (
        <Alert>
          <AlertTitle>Developer note</AlertTitle>
          <AlertDescription>{developerMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <UserRoundIcon className="size-5 text-primary" />
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your speaking profile helps tailor lesson recommendations without
            changing who you are or how you identify.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <ProfileField label="Email" value={profile?.email ?? "Mock user"} />
          <ProfileField label="Name" value={profile?.full_name ?? "Not set"} />
          <ProfileField
            label="Main goal"
            value={profile?.target_goal ?? "Build UK workplace confidence"}
          />
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit no-underline md:col-span-3"
            )}
            href="/onboarding"
          >
            Update speaking profile
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ShieldCheckIcon className="size-5 text-primary" />
          <CardTitle>Voice data settings</CardTitle>
          <CardDescription>
            Choose how recordings are retained and whether future AI processing
            can be used for speech feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2 sm:max-w-xs">
            <Label htmlFor="retain-recordings-days">
              Retain recordings for
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="retain-recordings-days"
                min={1}
                max={365}
                onChange={(event) => setRetainDays(Number(event.target.value))}
                type="number"
                value={retainDays}
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              The MVP default is 30 days. Automated purging is part of launch
              hardening; manual deletion is available now.
            </p>
          </div>

          <CheckboxRow
            checked={allowAiProcessing}
            description="Allow recordings to be processed for transcription, pronunciation assessment, and coaching feedback."
            id="allow-ai-processing"
            label="Allow AI processing for future voice feedback"
            onCheckedChange={setAllowAiProcessing}
          />
          <CheckboxRow
            checked={emailReminders}
            description="Optional gentle practice reminders. No marketing email is enabled in this MVP."
            id="email-reminders"
            label="Email reminders"
            onCheckedChange={setEmailReminders}
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button disabled={isSaving} onClick={saveSettings} type="button">
              {isSaving ? "Saving..." : "Save settings"}
            </Button>
            {saveMessage ? (
              <p className="text-sm text-muted-foreground" role="status">
                {saveMessage}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Trash2Icon className="size-5 text-primary" />
          <CardTitle>Recording management</CardTitle>
          <CardDescription>
            Delete individual recordings or remove all saved recordings from
            your account. Feedback records may remain until a full data deletion
            request is processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <RecordingList
            emptyDescription="Recordings from lessons, diagnostics, shadowing, and roleplay will appear here when storage is configured."
            emptyTitle="No recordings to manage"
            onRecordingsChange={setRecordings}
            recordings={recordings}
          />
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">Delete all recordings</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This removes stored audio and recording metadata for the current
              account. It does not immediately delete your profile or account.
            </p>
            <CheckboxRow
              checked={deleteConfirm}
              description="I understand this will remove all saved recording audio where storage is configured."
              id="confirm-delete-all-recordings"
              label="Confirm bulk recording deletion"
              onCheckedChange={setDeleteConfirm}
            />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                disabled={isDeletingAll}
                onClick={deleteAllRecordings}
                type="button"
                variant="destructive"
              >
                {isDeletingAll ? "Deleting..." : "Delete all recordings"}
              </Button>
              {deleteMessage ? (
                <p className="text-sm text-muted-foreground" role="status">
                  {deleteMessage}
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <DownloadIcon className="size-5 text-primary" />
          <CardTitle>Account data</CardTitle>
          <CardDescription>
            Request deletion of account-level data. Export tooling is planned
            for a later release.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">Export data</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              A self-serve export is not part of this MVP yet. This is tracked
              for launch readiness alongside stronger admin tooling.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">Delete my data request</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This creates a pending request for profile, practice history,
              analysis, transcripts, and recordings to be reviewed before any
              irreversible action.
            </p>
            <div className="mt-4 grid gap-2">
              <Label htmlFor="delete-data-notes">Optional notes</Label>
              <Textarea
                id="delete-data-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add context for the deletion request, if useful."
                value={notes}
              />
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                disabled={isRequestingDeletion}
                onClick={requestDataDeletion}
                type="button"
                variant="outline"
              >
                {isRequestingDeletion
                  ? "Creating request..."
                  : "Request data deletion"}
              </Button>
              {requestMessage ? (
                <p className="text-sm text-muted-foreground" role="status">
                  {requestMessage}
                </p>
              ) : null}
            </div>
          </div>
          {requests.length ? (
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="font-medium">Recent deletion requests</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {requests.slice(0, 3).map((request) => (
                  <p key={request.id}>
                    {new Date(request.created_at).toLocaleDateString()} ·{" "}
                    {request.status}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <SubscriptionPanel />

      <Card>
        <CardHeader>
          <BellIcon className="size-5 text-primary" />
          <CardTitle>Privacy reminder</CardTitle>
          <CardDescription>
            Speech scores are guidance to help you notice patterns over time,
            not a judgement of identity, culture, or worth.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function CheckboxRow({
  checked,
  description,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  description: string;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-background p-4">
      <Checkbox
        checked={checked}
        id={id}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <div>
        <Label className="font-medium" htmlFor={id}>
          {label}
        </Label>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
