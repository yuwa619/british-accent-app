import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  HeadphonesIcon,
  MessageSquareTextIcon,
  Mic2Icon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { FeatureCard } from "@/components/app/feature-card";
import { PrivacyConsentNotice } from "@/components/app/privacy-consent-notice";
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

const features = [
  {
    icon: Mic2Icon,
    title: "Accent diagnostic",
    description:
      "A short baseline speaking task that will guide your first focus areas.",
  },
  {
    icon: HeadphonesIcon,
    title: "British pronunciation lessons",
    description:
      "Practise vowels, schwa, stress, connected speech, and intonation.",
  },
  {
    icon: MessageSquareTextIcon,
    title: "AI roleplay",
    description:
      "Prepare for UK interviews, meetings, phone calls, and customer conversations.",
  },
  {
    icon: BarChart3Icon,
    title: "Progress tracking",
    description:
      "See clarity, rhythm, pronunciation, and confidence indicators over time.",
  },
];

const steps = [
  "Complete your speaking profile",
  "Take a short diagnostic",
  "Practise with guided lessons",
  "Track clarity and confidence",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-center gap-7">
          <Badge variant="secondary" className="w-fit">
            UK professional communication coach
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
              Speak more clearly and confidently in UK workplace conversations.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Practise British pronunciation, rhythm, intonation, and
              professional speaking with guided lessons and AI speech feedback
              designed for adult learners.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(buttonVariants({ size: "lg" }), "no-underline")}
              href="/auth/sign-up"
            >
              Start practising
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
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              "British pronunciation",
              "UK workplace confidence",
              "Private practice",
            ].map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <CheckCircle2Icon className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-secondary/50 shadow-sm">
          <CardHeader>
            <CardTitle>Today&apos;s calm practice plan</CardTitle>
            <CardDescription>
              A preview of how your dashboard will turn goals into short,
              focused practice sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Diagnostic", "Read a short workplace passage"],
              ["Lesson", "Practise schwa in unstressed syllables"],
              ["Roleplay", "Ask for clarification in a meeting"],
            ].map(([title, description], index) => (
              <div
                className="flex items-center gap-4 rounded-lg border bg-background p-4"
                key={title}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
            <PrivacyConsentNotice compact />
          </CardContent>
        </Card>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div className="space-y-3">
            <Badge variant="outline">The challenge</Badge>
            <h2 className="text-3xl font-semibold tracking-normal text-balance">
              Fluent English can still feel harder in fast UK settings.
            </h2>
          </div>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            Many non-native English speakers already communicate well, yet
            meetings, interviews, phone calls, and informal workplace
            conversations can still feel demanding. This coach helps you tune
            pronunciation, pace, stress, and rhythm so listeners can follow your
            ideas with less effort.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Core features</Badge>
          <h2 className="text-3xl font-semibold tracking-normal">
            Built for guided practice, not guesswork.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline">How it works</Badge>
            <h2 className="text-3xl font-semibold tracking-normal">
              A simple path from profile to practice.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step}>
                <CardHeader>
                  <div className="grid size-10 place-items-center rounded-lg bg-background text-sm font-medium">
                    {index + 1}
                  </div>
                  <CardTitle className="text-base">{step}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Card>
          <CardHeader>
            <ShieldCheckIcon className="size-5 text-primary" />
            <CardTitle>Clarity without identity erasure</CardTitle>
            <CardDescription>
              Your accent is part of your identity. This product is designed to
              support intelligibility, confidence, and natural British speech
              rhythm, not to judge where you are from.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <SparklesIcon className="size-5 text-primary" />
            <CardTitle>Premium practice for real conversations</CardTitle>
            <CardDescription>
              Lessons focus on common UK workplace phrases, interviews, phone
              calls, clarification, and professional small talk.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BriefcaseBusinessIcon className="size-4" />
                UK work, study, and public-service conversations
              </div>
              <h2 className="text-3xl font-semibold tracking-normal">
                Start with a speaking profile today.
              </h2>
              <p className="max-w-2xl text-primary-foreground/80">
                Recording and AI scoring arrive in later phases. The MVP now
                gives you the account, onboarding, and lesson foundation.
              </p>
            </div>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "shrink-0 no-underline"
              )}
              href="/auth/sign-up"
            >
              Start practising
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
