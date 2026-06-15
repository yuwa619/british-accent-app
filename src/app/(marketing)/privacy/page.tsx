import Link from "next/link";
import {
  BarChart3Icon,
  BrainCircuitIcon,
  Mic2Icon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";

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

const privacySections = [
  {
    title: "Voice recordings",
    description:
      "Recordings are used for practice playback, speech feedback, diagnostic baselines, shadowing comparisons, and roleplay turns. The app asks for microphone access only after you choose to record, and it does not upload audio until you choose to save.",
  },
  {
    title: "AI processing",
    description:
      "When enabled, recordings may be processed by server-side speech and AI providers for transcription, pronunciation assessment, reference audio, coaching feedback, and roleplay replies. Provider keys stay server-side.",
  },
  {
    title: "Retention and deletion",
    description:
      "The MVP default retention setting is 30 days. You can delete individual recordings, delete all recordings, or create a data deletion request from Settings. Full account deletion remains a reviewed request flow rather than an instant irreversible action.",
  },
  {
    title: "Analytics",
    description:
      "Analytics are disabled unless configured. When enabled, the app tracks product events such as recording uploaded or lesson completed, not raw transcripts, roleplay message text, or voice data.",
  },
  {
    title: "Scores and identity",
    description:
      "Speech scores are coaching guidance to help you notice patterns over time. They are not a judgement of nationality, ethnicity, identity, intelligence, or professional value.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Privacy"
        title="Voice practice should feel transparent and controlled."
        description="This MVP is built around consent, private recordings, clear AI processing notes, deletion controls, and feedback that supports clarity without erasing identity."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={Mic2Icon}
          title="Consent first"
          description="Microphone access and uploads are user-initiated. Nothing records automatically."
        />
        <FeatureCard
          icon={Trash2Icon}
          title="Delete controls"
          description="Delete individual recordings, bulk-delete recordings, or request wider data deletion."
        />
        <FeatureCard
          icon={ShieldCheckIcon}
          title="Careful wording"
          description="The app coaches clarity and confidence. It does not frame accent as something to erase."
        />
      </div>

      <Card>
        <CardHeader>
          <BrainCircuitIcon className="size-5 text-primary" />
          <CardTitle>What the app processes</CardTitle>
          <CardDescription>
            A plain-English view of the current MVP privacy model.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {privacySections.map((section) => (
            <div
              className="rounded-lg border bg-background p-4"
              key={section.title}
            >
              <h2 className="font-medium">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {section.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <BarChart3Icon className="size-5 text-primary" />
          <CardTitle>Limitations</CardTitle>
          <CardDescription>
            Practical controls are implemented, but this is still an MVP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            AI speech feedback can be imperfect, especially with background
            noise, short clips, or provider limitations. Use it as practice
            guidance rather than a formal assessment.
          </p>
          <p>
            Automated retention purging, self-serve data export, and full
            account deletion automation are launch-readiness tasks. The current
            data deletion request flow records a pending request for review.
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "no-underline"
            )}
            href="/settings"
          >
            Manage privacy settings
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
