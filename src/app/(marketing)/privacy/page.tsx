import Link from "next/link";
import { Mic2Icon, ShieldCheckIcon, Trash2Icon } from "lucide-react";

import { FeatureCard } from "@/components/app/feature-card";
import { PageHeader } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PrivacyPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Privacy"
        title="Voice practice needs clear consent and control."
        description="This MVP is designed to explain what happens to recordings before upload, keep voice data private, and treat speech scores as coaching guidance."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={Mic2Icon}
          title="Recording consent"
          description="The app will ask before using your microphone or uploading voice recordings."
        />
        <FeatureCard
          icon={ShieldCheckIcon}
          title="AI processing disclosure"
          description="Future analysis may use speech-to-text, pronunciation scoring, and AI coach feedback."
        />
        <FeatureCard
          icon={Trash2Icon}
          title="Retention controls"
          description="The MVP plans a default 30-day recording retention policy with delete controls."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice recordings</CardTitle>
          <CardDescription>
            Recording upload is available in the MVP. Analysis and feedback are
            planned for Phase 5.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Before any recording is uploaded, the app will explain why the
            recording is needed, how it will be processed, and how long it will
            be retained. The planned default retention period is 30 days unless
            you delete recordings earlier or configure a different setting when
            available.
          </p>
          <p>
            Speech scores are intended as learning guidance. They are not a
            judgement of your identity, background, ethnicity, nationality, or
            value as a communicator.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI processing</CardTitle>
          <CardDescription>
            Provider integrations will stay server-side and feature-flagged
            during MVP development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Future speech feedback may use Azure AI Speech for transcription and
            pronunciation assessment, OpenAI for plain-English coaching
            summaries, and ElevenLabs for British reference audio. API keys are
            server-only and should never be exposed to the browser.
          </p>
          <p>
            The product is positioned around clarity, intelligibility,
            confidence, and natural British speech rhythm. It is not designed to
            erase accents or pressure users to hide where they are from.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete recordings and data</CardTitle>
          <CardDescription>
            The full automation arrives after storage is connected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            The settings page includes placeholders for deleting individual
            recordings and requesting full data deletion. Once storage is live,
            users should be able to remove their own recordings and related
            records.
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "no-underline"
            )}
            href="/settings"
          >
            View settings
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
