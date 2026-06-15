type SentryContext = Record<string, string | number | boolean | null>;

function sentryDsn() {
  return process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";
}

export function isSentryEnabled() {
  return process.env.ENABLE_SENTRY === "true" && Boolean(sentryDsn());
}

function eventId() {
  return crypto.randomUUID().replaceAll("-", "");
}

function envelopeEndpoint(dsn: string) {
  const parsed = new URL(dsn);
  const projectId = parsed.pathname.replace("/", "");

  if (!projectId) {
    throw new Error("Sentry DSN is missing a project id.");
  }

  return `${parsed.origin}/api/${projectId}/envelope/`;
}

export async function captureServerError(
  error: unknown,
  context: SentryContext = {}
) {
  if (!isSentryEnabled()) return;

  try {
    const dsn = sentryDsn();
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    const name = error instanceof Error ? error.name : "Error";
    const stack = error instanceof Error ? error.stack : undefined;
    const now = new Date().toISOString();
    const envelope = [
      JSON.stringify({ dsn, sent_at: now }),
      JSON.stringify({ type: "event" }),
      JSON.stringify({
        event_id: eventId(),
        timestamp: now,
        platform: "javascript",
        level: "error",
        message,
        exception: {
          values: [
            {
              type: name,
              value: message,
              stacktrace: stack
                ? {
                    frames: stack
                      .split("\n")
                      .slice(0, 12)
                      .map((line) => ({
                        filename: "server",
                        function: line.trim(),
                        lineno: 0,
                      })),
                  }
                : undefined,
            },
          ],
        },
        contexts: { app: context },
      }),
    ].join("\n");

    await fetch(envelopeEndpoint(dsn), {
      method: "POST",
      body: envelope,
      headers: { "Content-Type": "application/x-sentry-envelope" },
    });
  } catch {
    // Monitoring must never break application behaviour.
  }
}
