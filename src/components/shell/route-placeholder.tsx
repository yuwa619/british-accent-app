import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

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

type RoutePlaceholderProps = {
  title: string;
  description: string;
  phase: string;
  primaryHref?: string;
  primaryLabel?: string;
  items?: string[];
};

export function RoutePlaceholder({
  title,
  description,
  phase,
  primaryHref = "/dashboard",
  primaryLabel = "Open dashboard",
  items = [],
}: RoutePlaceholderProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          {phase}
        </Badge>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MVP surface</CardTitle>
          <CardDescription>
            Route is wired for Phase 1 and ready for feature implementation.
          </CardDescription>
        </CardHeader>
        {items.length > 0 ? (
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <li
                  className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>

      <div>
        <Link
          className={cn(buttonVariants({ size: "lg" }), "no-underline")}
          href={primaryHref}
        >
          {primaryLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  );
}
