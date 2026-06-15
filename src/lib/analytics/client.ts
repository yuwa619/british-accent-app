"use client";

import type { AnalyticsEvent } from "@/lib/analytics/events";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

function analyticsEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
}

function posthogHost() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/$/, "") ??
    "https://app.posthog.com"
  );
}

function sanitiseProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(
      ([key, value]) =>
        value !== undefined &&
        !["transcript", "message", "messageText", "audio", "raw"].includes(key)
    )
  );
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === "undefined" || !analyticsEnabled()) return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  const payload = {
    api_key: apiKey,
    event,
    properties: {
      ...sanitiseProperties(properties),
      source: "web",
      app_surface: "mvp",
      $current_url: window.location.href,
    },
  };

  const body = JSON.stringify(payload);
  const url = `${posthogHost()}/capture/`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => undefined);
}
