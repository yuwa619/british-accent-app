import type { LucideIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 py-8">
        <div className="grid size-11 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {actionHref && actionLabel ? (
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "no-underline"
            )}
            href={actionHref}
          >
            {actionLabel}
          </Link>
        ) : (
          <Button disabled variant="outline">
            Coming soon
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
