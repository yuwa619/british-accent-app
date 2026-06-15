import { NextResponse } from "next/server";

import { captureServerError } from "@/lib/monitoring/sentry";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function checkoutDisabled(message: string) {
  return NextResponse.json({
    enabled: false,
    message,
  });
}

export async function POST() {
  try {
    if (process.env.ENABLE_STRIPE_CHECKOUT !== "true") {
      return checkoutDisabled(
        "Checkout is disabled for this MVP build. Subscription UI is ready, but live charging is feature-flagged off."
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

    if (!secretKey || !priceId) {
      return checkoutDisabled(
        "Stripe checkout is not configured. Add the secret key and price id to enable beta billing tests."
      );
    }

    let customerEmail: string | null = null;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Sign in before upgrading." },
          { status: 401 }
        );
      }

      customerEmail = user.email ?? null;
    }

    const formData = new URLSearchParams({
      mode: "subscription",
      success_url: `${appUrl()}/settings?checkout=success`,
      cancel_url: `${appUrl()}/settings?checkout=cancelled`,
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      allow_promotion_codes: "true",
      billing_address_collection: "auto",
    });

    if (customerEmail) {
      formData.set("customer_email", customerEmail);
    }

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Stripe-Version": "2026-02-25.clover",
        },
        body: formData,
      }
    );

    const payload = (await response.json().catch(() => null)) as {
      url?: string;
      error?: { message?: string };
    } | null;

    if (!response.ok || !payload?.url) {
      return NextResponse.json(
        {
          error:
            payload?.error?.message ??
            "Unable to create a checkout session right now.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ enabled: true, url: payload.url });
  } catch (error) {
    await captureServerError(error, {
      route: "/api/stripe/create-checkout-session",
    });
    return NextResponse.json(
      { error: "Unable to prepare checkout right now." },
      { status: 500 }
    );
  }
}
