import Link from "next/link";
import { CreditCardIcon, ScaleIcon, ShieldAlertIcon } from "lucide-react";

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

const sections = [
  {
    title: "Educational coaching purpose",
    description:
      "The app supports pronunciation, rhythm, clarity, confidence, and UK professional communication practice. It does not provide certification, employment guarantees, immigration advice, medical advice, legal advice, or official workplace assessment.",
  },
  {
    title: "AI feedback limitations",
    description:
      "Transcripts, scores, coaching summaries, reference audio, and roleplay replies can be incomplete or inaccurate. Treat feedback as a prompt for practice and reflection, not as a judgement of identity or ability.",
  },
  {
    title: "User responsibility",
    description:
      "Use the app for your own learning. Do not upload recordings without permission, impersonate others, submit sensitive third-party information, or use roleplay scenarios to create harmful, abusive, or misleading content.",
  },
  {
    title: "Voice data controls",
    description:
      "Recordings can be deleted individually or in bulk from Settings. Account-level data deletion is handled as a reviewed request in the MVP so irreversible actions can be completed carefully.",
  },
  {
    title: "Subscriptions",
    description:
      "Subscription tables, UI, usage limits, and a Stripe checkout route are present for readiness. Live charging remains disabled unless the Stripe feature flag and price environment variables are explicitly configured.",
  },
  {
    title: "Beta status",
    description:
      "This is a beta MVP. Features, limits, pricing, provider integrations, and retention automation may change as the product is tested and hardened.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Terms"
        title="Plain-English beta terms."
        description="Use the product as coaching support for clearer, more confident communication, with realistic expectations about AI and beta software."
      />

      <Card>
        <CardHeader>
          <ScaleIcon className="size-5 text-primary" />
          <CardTitle>Use this product as practice support</CardTitle>
          <CardDescription>
            These placeholder terms define the MVP boundaries before formal
            legal review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <div
              className="rounded-lg border bg-background p-4"
              key={section.title}
            >
              <h2 className="font-medium">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <ShieldAlertIcon className="size-5 text-primary" />
            <CardTitle>Acceptable use</CardTitle>
            <CardDescription>
              Keep roleplay and recording features focused on legitimate
              communication practice.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CreditCardIcon className="size-5 text-primary" />
            <CardTitle>Payments off by default</CardTitle>
            <CardDescription>
              Checkout is disabled unless explicitly enabled for a Stripe test
              or launch environment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className={cn(buttonVariants({ size: "lg" }), "no-underline")}
          href="/auth/sign-up"
        >
          Start practising
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "no-underline"
          )}
          href="/privacy"
        >
          Read privacy
        </Link>
      </div>
    </section>
  );
}
