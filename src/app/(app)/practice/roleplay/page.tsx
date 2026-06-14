import Link from "next/link";
import { MessageSquareTextIcon, Mic2Icon } from "lucide-react";

import { ComingSoonCard } from "@/components/app/coming-soon-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockRoleplayScenarios } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function RoleplayPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Roleplay"
        title="Practise UK workplace conversations turn by turn."
        description="Roleplay will use recorded user turns, transcription, AI text responses, and optional British reference audio. It is intentionally turn-based for the MVP."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockRoleplayScenarios.map((scenario) => (
          <Card key={scenario.key}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <MessageSquareTextIcon className="size-5 text-primary" />
                <Badge variant="outline">{scenario.turns} turns</Badge>
              </div>
              <CardTitle>{scenario.title}</CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
              <p className="text-sm text-muted-foreground">
                Context: {scenario.context}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <ComingSoonCard
        icon={Mic2Icon}
        title="Turn recording arrives after audio foundation"
        description="Phase 8 will save roleplay sessions and messages after recording, speech-to-text, and AI response generation are ready."
        phase="Phase 8"
      >
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </ComingSoonCard>
    </section>
  );
}
