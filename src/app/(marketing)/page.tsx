import Link from "next/link";
import {
  ArrowRightIcon,
  Mic2Icon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const focusAreas = [
  "British vowel sounds",
  "Schwa and unstressed syllables",
  "Workplace rhythm and intonation",
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            UK speech confidence coach
          </Badge>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
              Speak with more clarity and confidence at work in the UK.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Practise pronunciation, rhythm, intonation, and everyday
              professional conversations with calm AI feedback after each
              recording.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(buttonVariants({ size: "lg" }), "no-underline")}
              href="/auth/sign-up"
            >
              Start my free diagnostic
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "no-underline"
              )}
              href="/lessons"
            >
              View lessons
            </Link>
          </div>
        </div>

        <Card className="bg-secondary/60">
          <CardHeader>
            <CardTitle>Today&apos;s practice path</CardTitle>
            <CardDescription>
              A preview of the MVP dashboard experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {focusAreas.map((area, index) => (
              <div
                className="flex items-center gap-3 rounded-lg bg-background p-4"
                key={area}
              >
                <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{area}</p>
                  <p className="text-sm text-muted-foreground">
                    Short listen, repeat, and reflect drill
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Mic2Icon className="size-5 text-primary" />
            <CardTitle>Record</CardTitle>
            <CardDescription>
              Browser-based audio practice with private uploads in later phases.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <SparklesIcon className="size-5 text-primary" />
            <CardTitle>Reflect</CardTitle>
            <CardDescription>
              AI coaching focused on intelligibility, pace, rhythm, and
              confidence.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ShieldCheckIcon className="size-5 text-primary" />
            <CardTitle>Control</CardTitle>
            <CardDescription>
              Clear privacy controls for recordings, retention, and data
              deletion.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
