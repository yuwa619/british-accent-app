# Staging QA Results

Date: 2026-06-16
Starting commit: `e01ccef Phase 12 staging deployment QA readiness`

## Summary

`.env.local` is present and contains the required staging Supabase variables. The local app can reach the staging Supabase project, Supabase Auth works, the protected health endpoint works, the private `recordings` bucket exists, and the public app tables are now reachable. Staging is not yet ready for full authenticated app QA because the seed content is empty and authenticated E2E credentials have not been configured.

## Status Matrix

| Area                               | Status         | Notes                                                                                                                    |
| ---------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Supabase QA                        | Partial        | Staging connection, Auth, and app table access work. Seed content is empty and two-user RLS/storage QA is still pending. |
| Supabase migrations/seed readiness | Seed missing   | Tables are reachable, but `lessons`, `lesson_steps`, and `practice_prompts` currently return count `0`.                  |
| Supabase RLS/storage QA            | Pending        | `recordings` bucket exists and is private. Upload/read/delete ownership checks still need authenticated two-user QA.     |
| Vercel preview QA                  | Passed         | Latest preview serves the app and `/api/system/health` returns JSON `401` with no middleware/Vercel auth failure.        |
| Playwright preview tests           | Passed partial | Signed-out preview suite passed: 24 checks passed, 16 authenticated/local-only checks skipped by design.                 |
| Local Playwright tests             | Passed         | `npm run test:e2e` and `npm run test` each pass 12 local mock-mode checks with 28 staging-only checks skipped.           |
| Azure QA                           | Not run        | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                        |
| OpenAI QA                          | Not run        | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                        |
| ElevenLabs QA                      | Not run        | `ENABLE_ELEVENLABS=false`; provider smoke should wait until Supabase staging passes.                                     |
| PostHog QA                         | Not run        | Analytics remains disabled.                                                                                              |
| Sentry QA                          | Not run        | Sentry remains disabled.                                                                                                 |
| Stripe status                      | Disabled       | `.env.local` has `ENABLE_STRIPE_CHECKOUT=false`. Live billing was not enabled or tested.                                 |

## Local Environment Verification

- Confirmed `.env.local` exists.
- Confirmed required variables are present without printing values: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `MAINTENANCE_SECRET`.
- Confirmed `NEXT_PUBLIC_SUPABASE_URL` matches the staging project URL supplied by the project owner.
- Confirmed feature flags are conservative: `ENABLE_STRIPE_CHECKOUT=false`, `ENABLE_REAL_AI=false`, and `ENABLE_ELEVENLABS=false`.
- Confirmed Vercel CLI is installed.
- Confirmed local `npx vercel build` detects Next.js and creates all app/API serverless functions after adding `vercel.json` and using the standard `next build` script.
- Confirmed the latest preview no longer returns Vercel Authentication HTML or `MIDDLEWARE_INVOCATION_FAILED` for `/api/system/health`.
- Confirmed the app serves locally at `http://localhost:3000` with `.env.local` loaded.
- Confirmed the in-app browser renders the landing page with the expected heading, one `<main>` landmark, no framework overlay, and no relevant console errors.

## Health Endpoint Verification

- `GET /api/system/health` without the maintenance secret returns `401`.
- `GET /api/system/health` with the maintenance secret returns `200`.
- Health checks report Supabase configured, service role configured, real AI disabled, ElevenLabs disabled, analytics disabled, Sentry disabled, and Stripe checkout disabled.
- The health response did not include secret values or secret variable names.

## Vercel Middleware Fix Verification

Latest preview URL:

```text
https://british-accent-ooxy1mwhx-yuwa619-2396s-projects.vercel.app
```

The previous preview failed with `x-vercel-error: MIDDLEWARE_INVOCATION_FAILED` on `GET /api/system/health`. The middleware now matches only protected app routes and no longer runs for `/api/:path*`, public routes, Next.js internals, or static assets.

Verification:

- `curl -i https://british-accent-ooxy1mwhx-yuwa619-2396s-projects.vercel.app/api/system/health` returned HTTP `401`.
- Response content type was `application/json`.
- Response body was the expected safe unauthorised health-check error.
- No `x-vercel-error` header was present.
- No `MIDDLEWARE_INVOCATION_FAILED` response was present.
- `curl -I https://british-accent-ol3kns4nc-yuwa619-2396s-projects.vercel.app/` returned HTTP `200`.

## Supabase Direct Check Results

| Check                            | Result                                                              |
| -------------------------------- | ------------------------------------------------------------------- |
| Project connection               | Passed                                                              |
| Auth admin create/delete user    | Passed                                                              |
| Email/password sign-in           | Passed                                                              |
| Public app tables                | Passed: schema is reachable through the Supabase API                |
| Published lessons                | Seed missing: `lessons` count is `0`                                |
| Lesson steps                     | Seed missing: `lesson_steps` count is `0`                           |
| Practice prompts                 | Seed missing: `practice_prompts` count is `0`                       |
| Private `recordings` bucket      | Passed                                                              |
| Storage upload as signed-in user | Pending two-user storage/RLS QA                                     |
| Onboarding insert                | Pending authenticated app QA                                        |
| Settings upsert                  | Pending authenticated app QA                                        |
| Data deletion request insert     | Table reachable; count is `0`; create flow pending authenticated QA |
| Recording metadata insert        | Pending authenticated app QA                                        |
| Diagnostic/focus area insert     | Pending authenticated app QA                                        |
| Roleplay session/message insert  | Pending authenticated app QA                                        |

## App-Level Staging Check Results

- Auth page loads.
- Temporary test user sign-in succeeds.
- Sign-in redirects to `/dashboard`.
- Dashboard renders without crashing.
- Signed-out app routes render safely in Preview.
- Roleplay start and Settings save actions require sign-in when no session is present.
- Authenticated app write flows are pending `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD`.

## Required Staging Fix

Apply or verify migrations, then seed data in the staging Supabase project:

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

If migrations are already applied, running only `supabase/seed.sql` is enough to populate the first 10 lessons, lesson steps, and practice prompts. After applying SQL, reload the PostgREST schema cache from the Supabase dashboard if needed, then rerun `docs/SUPABASE_VERIFICATION_QUERIES.sql`.

## Local Check Results

| Command                | Result                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `npm run format`       | Passed                                                     |
| `npm run format:check` | Passed                                                     |
| `npm run typecheck`    | Passed                                                     |
| `npm run lint`         | Passed                                                     |
| `npm run build`        | Passed                                                     |
| `npm run test:e2e`     | Passed: 12 local checks, 28 staging-only checks skipped    |
| `npm run test`         | Passed: 12 local checks, 28 staging-only checks skipped    |
| `npx vercel build`     | Passed: detected Next.js and created all app/API functions |

## Preview Playwright Results

Latest preview command:

```bash
PLAYWRIGHT_BASE_URL=https://british-accent-ooxy1mwhx-yuwa619-2396s-projects.vercel.app npm run test:e2e
```

Result:

- 24 signed-out preview checks passed across desktop and mobile projects.
- 16 checks were skipped intentionally:
  - Local mock-only workflow tests are skipped whenever `PLAYWRIGHT_BASE_URL` is set.
  - Authenticated staging workflow tests are skipped until `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` are set.

The previous 6 preview failures were:

1. `Speech feedback` heading missing on `/feedback/mock-recording-id` because Preview was using real staging state and no mock analysed recording existed.
2. The same feedback assertion failed on mobile for the same reason.
3. `Conversation transcript` missing after starting roleplay because the signed-out API response correctly asked the user to sign in.
4. The same roleplay assertion failed on mobile for the same reason.
5. `Mock settings saved for this session.` missing because staging mode correctly returned `Sign in to update privacy settings.`
6. The same settings assertion failed on mobile for the same reason.

The new E2E strategy separates public, signed-out app safety, local mock workflows, and optional authenticated staging workflows.

## Preview Deployment Protection

Earlier preview deployments returned Vercel Deployment Protection HTML to unauthenticated automation. A request that used `YOUR_NEW_BYPASS_SECRET` still returned Vercel Authentication because that string was a placeholder, not the real bypass value. Configure one of these if Deployment Protection is enabled before rerunning preview Playwright tests:

1. Disable Deployment Protection for Preview temporarily during staging QA.
2. Create a Protection Bypass for Automation in Vercel and run:

```bash
PLAYWRIGHT_BASE_URL=<preview-url> \
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> \
npm run test:e2e
```

Replace `<preview-url>` with the preview deployment URL and `<secret>` with the real Vercel bypass value. Do not use placeholder strings like `YOUR_NEW_BYPASS_SECRET`. Never commit the bypass value, and rotate it immediately if it is exposed. The test suite appends the bypass query parameters to browser navigations and API requests when the variable is present.

## Blockers

1. Staging Supabase seed data must be applied; `lessons`, `lesson_steps`, and `practice_prompts` currently have count `0`.
2. Authenticated staging E2E needs `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD`.
3. Provider keys should wait until Supabase staging passes.

## Exact Next Actions

1. Apply `supabase/seed.sql` to staging, or rerun migrations plus seed if migration state is uncertain.
2. Run `docs/SUPABASE_VERIFICATION_QUERIES.sql`.
3. Rerun the direct staging QA checks.
4. If Vercel Deployment Protection is enabled, configure a Preview protection exception or automation bypass.
5. Run preview smoke tests:

```bash
PLAYWRIGHT_BASE_URL=<preview-url> \
npm run test:e2e
```

Add `VERCEL_AUTOMATION_BYPASS_SECRET=<secret>` only when Vercel Deployment Protection is enabled.

To run authenticated staging flows, create a disposable staging test user and run:

```bash
PLAYWRIGHT_BASE_URL=<preview-url> \
E2E_TEST_EMAIL=<staging-test-email> \
E2E_TEST_PASSWORD=<staging-test-password> \
npm run test:e2e
```

Never commit real test credentials.

6. Complete two-user RLS/storage QA.
7. Keep `ENABLE_STRIPE_CHECKOUT=false`.
8. Only after Supabase staging passes, run one small provider smoke test at a time.
