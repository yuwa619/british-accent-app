# Staging QA Results

Date: 2026-06-16
Starting commit: `c4ed329 Phase 11 beta deployment readiness`

## Summary

Phase 12 prepared staging runbooks and local verification. Real staging QA was not run because staging environment variables are not present, the repo is not linked to a Vercel project, and the available Vercel CLI token is invalid.

## Status Matrix

| Area                               | Status           | Notes                                                                                                                 |
| ---------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Supabase QA                        | Not run          | `.env.local` is missing and no Supabase staging credentials are available.                                            |
| Supabase migrations/seed readiness | Reviewed locally | Migration files `001` through `005` and `supabase/seed.sql` are present. SQL checklist updated for staging execution. |
| Supabase RLS/storage QA            | Not run          | Requires a real staging project and two test users. Manual runbook added.                                             |
| Vercel preview QA                  | Not run          | `.vercel` is missing and `vercel whoami` reports an invalid token.                                                    |
| Playwright preview tests           | Not run          | No preview URL is available. Use `PLAYWRIGHT_BASE_URL=<preview-url> npm run test:e2e` once deployed.                  |
| Local Playwright tests             | Passed           | `npm run test:e2e` and `npm run test` both passed with 12 tests.                                                      |
| Azure QA                           | Not run          | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, and staging Supabase are not available.                                    |
| OpenAI QA                          | Not run          | `OPENAI_API_KEY` and staging Supabase are not available.                                                              |
| ElevenLabs QA                      | Not run          | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, and staging Supabase are not available.                                  |
| PostHog QA                         | Not run          | Analytics remains disabled. No PostHog keys are available.                                                            |
| Sentry QA                          | Not run          | Sentry remains disabled. No DSN is available.                                                                         |
| Stripe status                      | Disabled         | `ENABLE_STRIPE_CHECKOUT=false` remains the required staging setting. Live billing was not enabled or tested.          |

## Local Verification Completed

- Confirmed no `.env.local` exists.
- Confirmed no `.vercel` project link exists.
- Confirmed Vercel CLI is installed.
- Confirmed Vercel CLI version `50.23.2`.
- Confirmed Vercel CLI authentication is not usable in this workspace because `vercel whoami` returns an invalid-token error.
- Confirmed the app still serves locally at `http://localhost:3000`.
- Confirmed the in-app browser renders the landing page with the expected heading, one `<main>` landmark, no framework overlay, and no relevant console errors.
- Reviewed migration and seed file presence.
- Updated `docs/SUPABASE_VERIFICATION_QUERIES.sql` to avoid relying on non-portable migration-table timestamp columns.

## Local Check Results

| Command                | Result                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `npm run format`       | Passed                                                     |
| `npm run format:check` | Passed                                                     |
| `npm run typecheck`    | Passed after clearing stale local `.next` generated output |
| `npm run lint`         | Passed                                                     |
| `npm run build`        | Passed                                                     |
| `npm run test:e2e`     | Passed, 12 tests                                           |
| `npm run test`         | Passed, 12 tests                                           |

Note: the first `npm run typecheck` attempt hit a stale generated `.next/types/routes.d 2.ts` duplicate identifier. `.next` is ignored build output; after removing `.next`, typecheck passed.

## Blockers

1. Staging Supabase credentials are required.
2. A linked Vercel project or valid Vercel login/token is required.
3. A Vercel preview URL is required before preview Playwright tests can run.
4. Provider keys are required for Azure, OpenAI, ElevenLabs, PostHog, and Sentry QA.

## Exact Next Actions

1. Create or provide staging Supabase project credentials.
2. Run `docs/STAGING_SUPABASE_RUNBOOK.md`.
3. Fix Vercel auth with `vercel login` or provide a valid project link/token.
4. Add Preview env vars from `docs/STAGING_DEPLOYMENT_RUNBOOK.md`.
5. Deploy Vercel preview.
6. Run:

```bash
PLAYWRIGHT_BASE_URL=https://your-vercel-preview-url npm run test:e2e
```

7. Complete two-user RLS/storage QA.
8. Keep `ENABLE_STRIPE_CHECKOUT=false`.
9. Only after Supabase staging passes, run one small provider smoke test at a time.
