import Link from "next/link";
import { ArrowRightIcon, type LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "primary" | "xp" | "streak" | "success";

const toneRing: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  xp: "bg-xp/12 text-xp",
  streak: "bg-streak/12 text-streak",
  success: "bg-success/12 text-success",
};

export function PracticeCtaCard({
  icon: Icon,
  title,
  description,
  href,
  ctaLabel,
  tone = "primary",
  meta,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone?: Tone;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="tap-scale group/cta block rounded-xl no-underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                "grid size-10 place-items-center rounded-2xl",
                toneRing[tone]
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            {meta ? (
              <span className="text-xs font-medium text-muted-foreground">
                {meta}
              </span>
            ) : null}
          </div>
          <CardTitle className="mt-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {ctaLabel}
            <ArrowRightIcon className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
