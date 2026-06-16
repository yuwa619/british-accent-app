# Staging QA Results

Date: 2026-06-16
Starting commit: `e01ccef Phase 12 staging deployment QA readiness`

## Summary

`.env.local` is now present and contains the required staging Supabase variables. The local app can reach the staging Supabase project, Supabase Auth works, the protected health endpoint works, and the private `recordings` bucket exists. Staging is not yet ready for full app QA because the public app tables are not available through the Supabase API schema cache. App data writes currently fail until migrations and seed data are applied to the staging database.

## Status Matrix

| Area                               | Status          | Notes                                                                                                                                       |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase QA                        | Failed/blocking | Staging connection and Auth work, but public app tables return `PGRST205` schema-cache/table-not-found errors.                              |
| Supabase migrations/seed readiness | Not applied     | Migration files `001` through `005` and `supabase/seed.sql` are present locally; staging API cannot see app tables.                         |
| Supabase RLS/storage QA            | Partial         | `recordings` bucket exists and is private. Upload is blocked until Storage policies from migration `001` are applied.                       |
| Vercel preview QA                  | Partial pass    | New preview serves the app and `/api/system/health` returns JSON `401`; deeper unauthenticated app-flow tests need staging auth/data setup. |
| Playwright preview tests           | Partial pass    | Preview tests reach the app: 6/12 pass. The remaining failures are unauthenticated staging-mode states, not Vercel middleware/auth HTML.    |
| Local Playwright tests             | Passed          | `npm run test:e2e` and `npm run test` each pass 12 local mock-mode checks.                                                                  |
| Azure QA                           | Not run         | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                                           |
| OpenAI QA                          | Not run         | `ENABLE_REAL_AI=false`; provider smoke should wait until Supabase staging passes.                                                           |
| ElevenLabs QA                      | Not run         | `ENABLE_ELEVENLABS=false`; provider smoke should wait until Supabase staging passes.                                                        |
| PostHog QA                         | Not run         | Analytics remains disabled.                                                                                                                 |
| Sentry QA                          | Not run         | Sentry remains disabled.                                                                                                                    |
| Stripe status                      | Disabled        | `.env.local` has `ENABLE_STRIPE_CHECKOUT=false`. Live billing was not enabled or tested.                                                    |

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
https://british-accent-ol3kns4nc-yuwa619-2396s-projects.vercel.app
```

The previous preview failed with `x-vercel-error: MIDDLEWARE_INVOCATION_FAILED` on `GET /api/system/health`. The middleware now matches only protected app routes and no longer runs for `/api/:path*`, public routes, Next.js internals, or static assets.

Verification:

- `curl -i https://british-accent-ol3kns4nc-yuwa619-2396s-projects.vercel.app/api/system/health` returned HTTP `401`.
- Response content type was `application/json`.
- Response body was the expected safe unauthorised health-check error.
- No `x-vercel-error` header was present.
- No `MIDDLEWARE_INVOCATION_FAILED` response was present.
- `curl -I https://british-accent-ol3kns4nc-yuwa619-2396s-projects.vercel.app/` returned HTTP `200`.

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

| Command                | Result                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `npm run format`       | Passed                                                     |
| `npm run format:check` | Passed                                                     |
| `npm run typecheck`    | Passed                                                     |
| `npm run lint`         | Passed                                                     |
| `npm run build`        | Passed                                                     |
| `npm run test:e2e`     | Passed: 12 local mock-mode checks                          |
| `npm run test`         | Passed: 12 local mock-mode checks                          |
| `npx vercel build`     | Passed: detected Next.js and created all app/API functions |

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

1. Staging Supabase migrations and seed data must be applied.
2. Preview Playwright app-flow assertions need either an authenticated staging test user/session flow or test expectations that explicitly cover signed-out staging mode.
3. Provider keys should wait until Supabase staging passes.

## Exact Next Actions

1. Apply Supabase migrations and seed data to staging.
2. Run `docs/SUPABASE_VERIFICATION_QUERIES.sql`.
3. Rerun the direct staging QA checks.
4. If Vercel Deployment Protection is enabled, configure a Preview protection exception or automation bypass.
5. Run preview smoke tests:

```bash
PLAYWRIGHT_BASE_URL=<preview-url> \
npm run test:e2e
```

Add `VERCEL_AUTOMATION_BYPASS_SECRET=<secret>` only when Vercel Deployment Protection is enabled.

6. Complete two-user RLS/storage QA.
7. Keep `ENABLE_STRIPE_CHECKOUT=false`.
8. Only after Supabase staging passes, run one small provider smoke test at a time.
