import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-muted/35 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_0.7fr]">
        <section className="hidden flex-col gap-6 lg:flex">
          <Link className="text-sm font-medium" href="/">
            {siteConfig.name}
          </Link>
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-medium text-primary">
              UK speech confidence coach
            </p>
            <h1 className="text-5xl font-semibold tracking-normal text-balance">
              Build clearer, calmer speech for UK work and study.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Create a profile, set your speaking goals, and prepare for guided
              British pronunciation lessons, diagnostic feedback, and workplace
              roleplay.
            </p>
          </div>
          <div className="grid max-w-xl gap-3 text-sm text-muted-foreground">
            {[
              "Personalised onboarding for your UK communication goals",
              "Ethical coaching focused on clarity, not accent erasure",
              "Privacy controls before any future voice recording",
            ].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2Icon className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <Link className="text-center text-sm font-medium lg:hidden" href="/">
            {siteConfig.name}
          </Link>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
