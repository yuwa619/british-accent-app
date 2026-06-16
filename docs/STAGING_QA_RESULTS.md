# Staging QA Results

Date: 2026-06-16
Starting commit: `e01ccef Phase 12 staging deployment QA readiness`

## Summary

`.env.local` is now present and contains the required staging Supabase variables. The local app can reach the staging Supabase project, Supabase Auth works, the protected health endpoint works, and the private `recordings` bucket exists. Staging is not yet ready for full app QA because the public app tables are not available through the Supabase API schema cache. App data writes currently fail until migrations and seed data are applied to the staging database.

## Status Matrix

| Area                               | Status          | Notes                                                                                                                 |
| ---------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Supabase QA                        | Failed/blocking | Staging connection and Auth work, but public app tables return `PGRST205` schema-cache/table-not-found errors.        |
| Supabase migrations/seed readiness | Not applied     | Migration files `001` through `005` and `supabase/seed.sql` are present locally; staging API cannot see app tables.   |
| Supabase RLS/storage QA            | Partial         | `recordings` bucket exists and is private. Upload is blocked until Storage policies from migration `001` are applied. |
| Vercel preview QA                  | Not run         | Local Vercel build passed after pulling ignored project settings; no preview deployment URL was tested.               |
| Playwright preview tests           | Not run         | No preview URL is available. Use `PLAYWRIGHT_BASE_URL=<preview-url> npm run test:e2e` once deployed.                  |
| Local Playwright tests             | Failed/blocking | `npm run test:e2e` and `npm run test` each passed 6 checks and failed 6 staging-data-dependent checks.                |
| Azure QA                           | Not run         | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                     |
| OpenAI QA                          | Not run         | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                     |
| ElevenLabs QA                      | Not run         | `ENABLE_ELEVENLABS=false`; provider smoke should wait until Supabase staging passes.                                  |
| PostHog QA                         | Not run         | Analytics remains disabled.                                                                                           |
| Sentry QA                          | Not run         | Sentry remains disabled.                                                                                              |
| Stripe status                      | Disabled        | `.env.local` has `ENABLE_STRIPE_CHECKOUT=false`. Live billing was not enabled or tested.                              |

## Local Environment Verification

- Confirmed `.env.local` exists.
- Confirmed required variables are present without printing values: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `MAINTENANCE_SECRET`.
- Confirmed `NEXT_PUBLIC_SUPABASE_URL` matches the staging project URL supplied by the project owner.
- Confirmed feature flags are conservative: `ENABLE_STRIPE_CHECKOUT=false`, `ENABLE_REAL_AI=false`, and `ENABLE_ELEVENLABS=false`.
- Confirmed Vercel CLI is installed.
- Confirmed local `npx vercel build --yes` can pull ignored Vercel project settings and complete a preview build.
- Removed the downloaded `.vercel/.env.preview.local` file after the build check so Vercel preview secrets are not retained in the repo workspace.
- Confirmed the app serves locally at `http://localhost:3000` with `.env.local` loaded.
- Confirmed the in-app browser renders the landing page with the expected heading, one `<main>` landmark, no framework overlay, and no relevant console errors.

## Health Endpoint Verification

- `GET /api/system/health` without the maintenance secret returns `401`.
- `GET /api/system/health` with the maintenance secret returns `200`.
- Health checks report Supabase configured, service role configured, real AI disabled, ElevenLabs disabled, analytics disabled, Sentry disabled, and Stripe checkout disabled.
- The health response did not include secret values or secret variable names.

## Supabase Direct Check Results

| Check                            | Result                                                                    |
| -------------------------------- | ------------------------------------------------------------------------- |
| Project connection               | Passed                                                                    |
| Auth admin create/delete user    | Passed                                                                    |
| Email/password sign-in           | Passed                                                                    |
| Public app tables                | Failed: `PGRST205` table/schema-cache errors                              |
| Published lessons                | Failed: `lessons` table unavailable through API                           |
| Private `recordings` bucket      | Passed                                                                    |
| Storage upload as signed-in user | Failed: RLS policy violation, expected until Storage policies are applied |
| Onboarding insert                | Failed: `onboarding_responses` table unavailable                          |
| Settings upsert                  | Failed: `user_settings` table unavailable                                 |
| Data deletion request insert     | Failed: `data_deletion_requests` table unavailable                        |
| Recording metadata insert        | Failed: `recordings` table unavailable                                    |
| Diagnostic/focus area insert     | Failed: `diagnostic_results` / `focus_areas` unavailable                  |
| Roleplay session/message insert  | Failed: `roleplay_sessions` unavailable                                   |

## App-Level Staging Check Results

- Auth page loads.
- Temporary test user sign-in succeeds.
- Sign-in redirects to `/dashboard`.
- Dashboard renders without crashing.
- App-level `POST /api/recordings` currently returns a safe `500` response with `Unable to upload recording. Please try again.` This is expected while migrations and Storage policies are missing.

## Required Staging Fix

Apply migrations and seed data to the staging Supabase project:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref cckrdkskxagtaptbeopi
npx supabase@latest db push
npx supabase@latest db seed
```

If CLI access is not available, use the Supabase Dashboard SQL editor and run these files in order:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_onboarding_phase3_fields.sql
supabase/migrations/003_speech_analysis_phase5_fields.sql
supabase/migrations/004_diagnostic_progress_phase6_fields.sql
supabase/migrations/005_data_deletion_requests.sql
supabase/seed.sql
```

After applying SQL, reload the PostgREST schema cache from the Supabase dashboard if needed, then rerun `docs/SUPABASE_VERIFICATION_QUERIES.sql`.

## Local Check Results

| Command                  | Result                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run format`         | Passed                                                              |
| `npm run format:check`   | Passed                                                              |
| `npm run typecheck`      | Passed                                                              |
| `npm run lint`           | Passed                                                              |
| `npm run build`          | Passed                                                              |
| `npm run test:e2e`       | Failed: 6 passed, 6 failed while staging app tables are unavailable |
| `npm run test`           | Failed: 6 passed, 6 failed while staging app tables are unavailable |
| `npx vercel build`       | Failed: project settings were not present locally                   |
| `npx vercel build --yes` | Passed: project settings pulled, build completed successfully       |

## Blockers

1. Staging Supabase migrations and seed data must be applied.
2. A linked Vercel project or valid Vercel login/token is required.
3. A Vercel preview URL is required before preview Playwright tests can run.
4. Provider keys should wait until Supabase staging passes.

## Exact Next Actions

1. Apply Supabase migrations and seed data to staging.
2. Run `docs/SUPABASE_VERIFICATION_QUERIES.sql`.
3. Rerun the direct staging QA checks.
4. Fix Vercel auth with `vercel login` or provide a valid project link/token.
5. Add Preview env vars from `docs/STAGING_DEPLOYMENT_RUNBOOK.md`.
6. Deploy Vercel preview.
7. Run:

```bash
PLAYWRIGHT_BASE_URL=https://your-vercel-preview-url npm run test:e2e
```

8. Complete two-user RLS/storage QA.
9. Keep `ENABLE_STRIPE_CHECKOUT=false`.
10. Only after Supabase staging passes, run one small provider smoke test at a time.
