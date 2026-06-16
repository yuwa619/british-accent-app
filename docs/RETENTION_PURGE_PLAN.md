# Retention Purge Plan

The MVP includes a protected maintenance route:

```text
POST /api/maintenance/purge-old-recordings
```

It is intentionally server-only and requires `MAINTENANCE_SECRET`.

The same secret protects `GET /api/system/health`, which is useful for checking deployment configuration without exposing key values.

## Environment

```bash
MAINTENANCE_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## How It Works

- The route accepts either `Authorization: Bearer <MAINTENANCE_SECRET>` or `x-maintenance-secret`.
- If Supabase admin credentials are missing, it returns a safe mock/no-op response.
- It loads candidate recordings older than one day, capped at 500 rows per run.
- It reads each user's `user_settings.retain_recordings_days`, falling back to 30 days.
- It deletes stale Storage objects from the private `recordings` bucket first.
- It deletes matching `recordings` rows after Storage deletion succeeds.
- Related speech analysis rows cascade through existing foreign keys.

## Vercel Cron Example

Configure a daily cron job once the app is deployed:

```json
{
  "crons": [
    {
      "path": "/api/maintenance/purge-old-recordings",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Vercel cron cannot set custom headers directly in all plans, so use a small scheduled function, external scheduler, or platform secret forwarding if needed. Do not expose the secret in a query string.

## Manual Test

```bash
curl -X POST "https://your-domain.com/api/maintenance/purge-old-recordings" \
  -H "Authorization: Bearer $MAINTENANCE_SECRET"
```

Expected response:

```json
{
  "success": true,
  "mode": "supabase",
  "purgedCount": 0
}
```

## Safety Checks Before Enabling

- Test against a staging Supabase project first.
- Confirm Storage deletion and row deletion both succeed.
- Confirm user-specific retention settings are respected.
- Confirm no current recordings are selected.
- Confirm Sentry does not capture sensitive object paths or transcripts.
- Log only counts and high-level status in production.

## Known Gaps

- The route processes at most 500 candidate recordings per run.
- It does not currently write a purge audit table.
- It does not purge orphaned Storage objects without database rows.
- Full account deletion automation remains separate from retention purging.
