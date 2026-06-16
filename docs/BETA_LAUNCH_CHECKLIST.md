# Beta Launch Checklist

## Environment

- [ ] Set production `NEXT_PUBLIC_APP_URL`.
- [ ] Set Supabase public URL and anon key.
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` only in trusted server environments.
- [ ] Set `MAINTENANCE_SECRET`.
- [ ] Confirm `GET /api/system/health` returns safe booleans only when called with `MAINTENANCE_SECRET`.
- [ ] Complete `docs/STAGING_DEPLOYMENT_RUNBOOK.md`.
- [ ] Record the outcome in `docs/STAGING_QA_RESULTS.md`.
- [ ] Keep `ENABLE_REAL_AI=false` until provider QA is complete.
- [ ] Keep `ENABLE_STRIPE_CHECKOUT=false` unless running Stripe test mode.
- [ ] Keep analytics and Sentry disabled until their privacy checks pass.

## Supabase

- [ ] Apply all migrations through `005_data_deletion_requests.sql`.
- [ ] Seed the first 10 lessons.
- [ ] Run `docs/SUPABASE_VERIFICATION_QUERIES.sql` in the Supabase SQL editor.
- [ ] Complete `docs/STAGING_SUPABASE_RUNBOOK.md`.
- [ ] Confirm no app-table requests return Supabase `PGRST205` schema-cache errors.
- [ ] Configure Auth redirect URLs for production and preview domains.
- [ ] Confirm private `recordings` bucket and policies.
- [ ] Verify RLS with two test users.
- [ ] Verify individual recording deletion.
- [ ] Verify bulk recording deletion.
- [ ] Verify data deletion request creation.
- [ ] Verify retention purge route in staging.

## Providers

- [ ] Complete `docs/PROVIDER_QA_CHECKLIST.md`.
- [ ] Test Azure short recording analysis with `en-GB`.
- [ ] Test OpenAI coaching JSON and roleplay replies.
- [ ] Test ElevenLabs reference and assistant audio fallback.
- [ ] Confirm provider errors show safe user-facing messages.
- [ ] Record rough latency and cost observations.

## Privacy And Safety

- [ ] Review `/privacy` and `/terms`.
- [ ] Confirm no raw transcripts, roleplay text, audio blobs, or secrets are tracked in analytics.
- [ ] Confirm Sentry context excludes sensitive speech content.
- [ ] Confirm scores are consistently described as guidance, not judgement.
- [ ] Confirm copy does not promise accent removal, native-sounding speech, job outcomes, or perfect results.
- [ ] Confirm beta tester consent wording is visible near recording controls.

## Product QA

- [ ] Run `npm run format:check`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:e2e`.
- [ ] Smoke test core routes in a browser.
- [ ] Test desktop width.
- [ ] Test tablet width.
- [ ] Test mobile width around 375px.
- [ ] Test keyboard navigation through Settings, Roleplay, Lesson, and Diagnostic controls.
- [ ] Test denied microphone permission manually.
- [ ] Test empty states for no recordings, no progress, and no roleplay sessions.

## Deployment

- [ ] Deploy to Vercel preview.
- [ ] Follow `docs/VERCEL_DEPLOYMENT_GUIDE.md`.
- [ ] Run smoke tests against preview.
- [ ] Check Vercel logs for server errors.
- [ ] Confirm cache/build output does not expose secrets.
- [ ] Configure domain and HTTPS.
- [ ] Document rollback commit and deployment.

## Beta Operations

- [ ] Prepare feedback form for beta testers.
- [ ] Prepare support contact or issue intake.
- [ ] Keep a list of invited testers.
- [ ] Monitor error volume after each invite batch.
- [ ] Review deletion requests manually during beta.
- [ ] Schedule retention purge only after staging validation.

## Rollback Plan

- [ ] Keep previous stable deployment available in Vercel.
- [ ] If provider errors spike, set `ENABLE_REAL_AI=false`.
- [ ] If checkout misbehaves, set `ENABLE_STRIPE_CHECKOUT=false`.
- [ ] If analytics privacy risk is found, set `NEXT_PUBLIC_ENABLE_ANALYTICS=false`.
- [ ] If retention purge risk is found, disable the scheduler and leave manual deletion controls active.
