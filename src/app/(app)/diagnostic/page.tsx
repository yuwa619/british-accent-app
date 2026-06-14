import Link from "next/link";
import { BookOpenTextIcon, Mic2Icon, MessageCircleIcon } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { RecordingUploadCard } from "@/components/recording/recording-upload-card";
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

const steps = [
  {
    icon: BookOpenTextIcon,
    title: "Read a short passage",
    description:
      "A balanced paragraph to capture clarity, pace, and sentence rhythm.",
    sample:
      "I am preparing for a meeting with my team, and I would like to explain the update clearly.",
  },
  {
    icon: Mic2Icon,
    title: "Read key British pronunciation sentences",
    description:
      "Targeted lines for vowels, schwa, dental fricatives, word stress, and intonation.",
    sample: "I think this method is better than the first version.",
  },
  {
    icon: MessageCircleIcon,
    title: "Answer a short spoken prompt",
    description:
      "A workplace-style response so the coach can assess natural speech flow.",
    sample:
      "Tell us about a time you asked for clarification at work or study.",
  },
];

export default function DiagnosticPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Diagnostic"
        title="A short baseline for clarity, rhythm, and confidence."
        description="Record the three diagnostic prompts now. Phase 5 will add analysis and baseline scoring; for this phase, recordings are saved only for practice and storage validation."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <step.icon className="size-5" />
                </div>
                <Badge variant="outline">Step {index + 1}</Badge>
              </div>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="rounded-lg bg-muted p-4 text-sm leading-6">
                {step.sample}
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <RecordingUploadCard
            description={`${step.description} Diagnostic analysis arrives in Phase 5.`}
            key={`diagnostic-recorder-${step.title}`}
            practiceText={step.sample}
            recordingType="diagnostic"
            title={`Record diagnostic step ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Diagnostic analysis, score trends, and personalised focus areas come
          next in Phase 5.
        </p>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
