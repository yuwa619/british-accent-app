"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/client";
import { analyticsEvents } from "@/lib/analytics/events";

type CheckoutResponse = {
  enabled?: boolean;
  url?: string;
  message?: string;
  error?: string;
};

export function UpgradeButton({ className }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function startCheckout() {
    setIsLoading(true);
    setMessage(null);
    trackEvent(analyticsEvents.upgradeClicked, { plan: "pro" });

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      const payload = (await response
        .json()
        .catch(() => null)) as CheckoutResponse | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to prepare checkout.");
      }

      if (payload?.url) {
        window.location.assign(payload.url);
        return;
      }

      setMessage(
        payload?.message ??
          "Checkout is not enabled for this MVP build. Your current plan is unchanged."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to prepare checkout right now."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        className={className}
        disabled={isLoading}
        onClick={startCheckout}
      >
        <ArrowUpRightIcon data-icon="inline-start" />
        {isLoading ? "Checking checkout..." : "Upgrade to Pro"}
      </Button>
      {message ? (
        <p className="text-sm leading-6 text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
