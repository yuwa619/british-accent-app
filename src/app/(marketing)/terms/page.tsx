import Link from "next/link";
import { ScaleIcon } from "lucide-react";

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
    title: "Beta learning product",
    description:
      "This MVP is an educational coaching tool for pronunciation, rhythm, confidence, and UK professional communication. It is not a certification, employment guarantee, medical service, or legal advice.",
  },
  {
    title: "Speech feedback",
    description:
      "Scores and suggestions are practice guidance. They may be incomplete or imperfect, and should be interpreted as prompts for reflection rather than judgements of identity or ability.",
  },
  {
    title: "Responsible use",
    description:
      "Use the app for your own learning and workplace preparation. Do not upload recordings you do not have permission to process.",
  },
  {
    title: "Subscription-ready status",
    description:
      "The codebase includes subscription-ready architecture, but live charging remains disabled unless the relevant Stripe feature flag and environment variables are configured.",
  },
  {
    title: "Data controls",
    description:
      "Privacy controls, recording deletion, and data deletion request flows will be expanded as audio storage and analysis are implemented.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Terms"
        title="Plain-English beta terms."
        description="These placeholder terms explain the current MVP boundaries while the product is still being built."
      />

      <Card>
        <CardHeader>
          <ScaleIcon className="size-5 text-primary" />
          <CardTitle>Use this product as coaching support</CardTitle>
          <CardDescription>
            The app is here to support clearer, more confident communication.
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
