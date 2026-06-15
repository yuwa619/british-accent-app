"use client";

import { useEffect } from "react";
import { CheckIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react";

import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics/client";
import { analyticsEvents } from "@/lib/analytics/events";
import { getUsageLimitSummary } from "@/lib/billing/usage-limits";

export function SubscriptionPanel() {
  useEffect(() => {
    trackEvent(analyticsEvents.paywallViewed, { surface: "settings" });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CreditCardIcon className="size-5 text-primary" />
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Subscription</CardTitle>
          <Badge variant="secondary">Current plan: Free</Badge>
        </div>
        <CardDescription>
          Billing is subscription-ready, but Stripe checkout is disabled by
          default for the MVP until live pricing is explicitly configured.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="font-medium">Free beta</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Enough to test the main practice loop while the product is in beta.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            {getUsageLimitSummary("free").map((item) => (
              <li className="flex gap-2" key={item}>
                <CheckIcon className="mt-0.5 size-4 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5 text-primary" />
            <p className="font-medium">Pro ready</p>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Planned for users who want more roleplay, deeper feedback history,
            and advanced workplace packs.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            {getUsageLimitSummary("pro").map((item) => (
              <li className="flex gap-2" key={item}>
                <CheckIcon className="mt-0.5 size-4 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <UpgradeButton className="mt-4 w-full sm:w-fit" />
        </div>
      </CardContent>
    </Card>
  );
}
