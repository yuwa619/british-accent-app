import Link from "next/link";
import { HeadphonesIcon, Mic2Icon, WavesIcon } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const referenceText =
  "Please check the plan and send it back by Friday afternoon.";

export default function ShadowingPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Shadowing"
        title="Listen, repeat, compare, and refine."
        description="Shadowing practice will help you match clear British rhythm and intonation while keeping your own voice and identity."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: HeadphonesIcon,
            title: "Listen to reference audio",
            description:
              "Hear a natural British model for the lesson phrase or workplace scenario.",
          },
          {
            icon: Mic2Icon,
            title: "Record your version",
            description:
              "Capture your attempt in the browser and play it back before upload.",
          },
          {
            icon: WavesIcon,
            title: "Compare side by side",
            description:
              "Review timing, pace, and simplified pitch movement after recording.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-primary" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <HeadphonesIcon className="size-5 text-primary" />
            <CardTitle>Reference side</CardTitle>
            <CardDescription>
              Reference audio generation arrives later. Use the text as a calm
              listen-and-repeat placeholder for now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <blockquote className="rounded-lg border bg-muted/40 p-4 text-base leading-7">
              {referenceText}
            </blockquote>
            <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
              British reference audio placeholder. ElevenLabs integration comes
              after the recording foundation.
            </div>
          </CardContent>
        </Card>

        <RecordingUploadCard
          description="Record your version after reading the reference text, then listen back before saving."
          practiceText={referenceText}
          recordingType="shadowing"
          title="Your shadowing attempt"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Side-by-side playback is partially ready: your recording can be
          previewed now, while generated reference audio arrives later.
        </p>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href="/lessons"
        >
          Choose a lesson
        </Link>
      </div>
    </section>
  );
}
