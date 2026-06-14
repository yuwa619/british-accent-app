import {
  BellIcon,
  CreditCardIcon,
  type LucideIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
import { PageHeader } from "@/components/app/page-header";
import { SubscriptionBanner } from "@/components/app/subscription-banner";
import { RecordingList } from "@/components/recording/recording-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecentRecordings } from "@/lib/data/recordings";

function SettingRow({
  icon: Icon,
  title,
  description,
  value,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <Icon className="mt-1 size-5 text-primary" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{value}</span>
    </div>
  );
}

export default async function SettingsPage() {
  const recentRecordings = await getRecentRecordings(10);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Settings"
        title="Manage profile, privacy, and beta access."
        description="These controls prepare the MVP for responsible voice practice. Individual recording deletion is now available; full account-level data export and deletion come later."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your name, role, native language, and goal are shaped during
            onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <SettingRow
            icon={UserRoundIcon}
            title="Speaking profile"
            description="Update your language background and UK communication goals from onboarding."
            value="Editable soon"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice data and privacy</CardTitle>
          <CardDescription>
            Recording controls are designed around consent, retention, and
            deletion.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <SettingRow
            icon={ShieldCheckIcon}
            title="AI processing consent"
            description="Allow future voice recordings to be processed for transcription, pronunciation assessment, and coaching feedback."
            value="Onboarding choice"
          />
          <SettingRow
            icon={ShieldCheckIcon}
            title="Recording retention"
            description="Default retention policy for user recordings. Automated purge scheduling is planned for launch readiness."
            value="30 days"
          />
          <SettingRow
            icon={BellIcon}
            title="Email reminders"
            description="Gentle practice reminders will remain optional."
            value="Off by default"
          />
        </CardContent>
      </Card>

      <SubscriptionBanner />

      <Card>
        <CardHeader>
          <CardTitle>Recording controls</CardTitle>
          <CardDescription>
            Delete individual saved recordings from the current account. Mock
            recordings are session-only and disappear when the page state
            resets.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <RecordingList
            emptyDescription="Your saved recordings will appear here after you record and save from a lesson, diagnostic, or shadowing page."
            emptyTitle="No recordings to manage"
            recordings={recentRecordings}
          />
          <SettingRow
            icon={Trash2Icon}
            title="Delete all recordings"
            description="Bulk deletion will remove all stored voice recordings and matching metadata after a confirmation step."
            value="Coming later"
          />
          <SettingRow
            icon={Trash2Icon}
            title="Delete my data"
            description="Request deletion of profile, practice history, analysis results, and stored recordings."
            value="Documented placeholder"
          />
          <SettingRow
            icon={CreditCardIcon}
            title="Subscription"
            description="Stripe checkout remains feature-flagged and live charging is disabled by default."
            value="Free beta"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Leave this device securely.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
