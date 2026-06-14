import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubscriptionBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          Free beta
        </Badge>
        <p className="font-medium">
          Subscription-ready, with live charging off.
        </p>
        <p className="text-sm text-muted-foreground">
          Upgrade flows will stay feature-flagged until payment testing is
          approved.
        </p>
      </div>
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-fit no-underline"
        )}
        href="/settings"
      >
        View settings
      </Link>
    </div>
  );
}
