import { LogOutIcon } from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
import { PageHeader } from "@/components/app/page-header";
import { SettingsControlCentre } from "@/components/settings/settings-control-centre";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSettingsSummary } from "@/lib/data/settings";

export default async function SettingsPage() {
  const summary = await getSettingsSummary();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Settings"
        title="Privacy and account control centre."
        description="Manage your speaking profile, voice data preferences, recordings, account data requests, and subscription readiness."
      />

      <SettingsControlCentre
        deletionRequests={summary.deletionRequests}
        developerMessage={summary.developerMessage}
        profile={summary.profile}
        recentRecordings={summary.recentRecordings}
        settings={summary.settings}
      />

      <Card>
        <CardHeader>
          <LogOutIcon className="size-5 text-primary" />
          <CardTitle>Account access</CardTitle>
          <CardDescription>
            Sign out from this device when you finish practising.
          </CardDescription>
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
