import Link from "next/link";
import { HeadphonesIcon, Mic2Icon, WavesIcon } from "lucide-react";

import { ComingSoonCard } from "@/components/app/coming-soon-card";
import { PageHeader } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

      <ComingSoonCard
        icon={Mic2Icon}
        title="Audio controls arrive next"
        description="Phase 4 adds microphone permission, recording timer, preview playback, upload, and delete flows."
        phase="Phase 4"
      >
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href="/lessons"
        >
          Choose a lesson
        </Link>
      </ComingSoonCard>
    </section>
  );
}
