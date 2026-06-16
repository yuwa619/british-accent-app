import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

function authorised(request: Request) {
  const configuredSecret = process.env.MAINTENANCE_SECRET;
  if (!configuredSecret) return false;

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const explicitHeader = request.headers.get("x-maintenance-secret");

  return (
    bearerToken === configuredSecret || explicitHeader === configuredSecret
  );
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json(
      { error: "System health checks require maintenance authorisation." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    checks: {
      supabaseConfigured: isSupabaseConfigured(),
      supabaseServiceRoleConfigured: Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
      realAiEnabled: process.env.ENABLE_REAL_AI === "true",
      azureConfigured: Boolean(
        process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION
      ),
      openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
      elevenLabsEnabled: process.env.ENABLE_ELEVENLABS === "true",
      elevenLabsConfigured: Boolean(
        process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID
      ),
      analyticsEnabled:
        process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" &&
        Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
      sentryEnabled:
        process.env.ENABLE_SENTRY === "true" &&
        Boolean(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),
      stripeCheckoutEnabled:
        process.env.ENABLE_STRIPE_CHECKOUT === "true" &&
        Boolean(process.env.STRIPE_SECRET_KEY) &&
        Boolean(process.env.STRIPE_PRO_MONTHLY_PRICE_ID),
      maintenanceSecretConfigured: Boolean(process.env.MAINTENANCE_SECRET),
    },
  });
}
