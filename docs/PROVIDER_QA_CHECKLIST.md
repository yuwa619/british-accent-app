# Provider QA Checklist

Use this before inviting beta users into a real environment. Keep mock mode as the default for local development.

For the first staging run, record exact outcomes in `docs/STAGING_QA_RESULTS.md`. Do not mark a provider as passed unless a real staging key was used and the result was observed.

## Supabase

- Confirm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are configured only in trusted environments.
- Run migrations through `supabase/migrations/005_data_deletion_requests.sql`.
- Run `supabase/seed.sql` and confirm the first 10 lessons are published.
- Run `docs/SUPABASE_VERIFICATION_QUERIES.sql` in the Supabase SQL editor and save dated notes outside the repo.
- Configure Auth site URL and redirect URLs for local, preview, and production domains.
- Confirm protected routes redirect when signed out and render when signed in.
- Confirm `profiles`, `recordings`, `speech_analysis_results`, `diagnostic_results`, `focus_areas`, `roleplay_sessions`, `roleplay_messages`, `user_settings`, and `data_deletion_requests` RLS policies prevent cross-user reads and writes.
- Confirm private `recordings` bucket exists and user objects use `{user_id}/{recording_id}.webm`.
- Upload, read via signed URL where available, delete one recording, and bulk-delete recordings for a test user.
- Verify service-role maintenance actions work only on the server.

## Azure Speech

- Configure `ENABLE_REAL_AI=true`, `AZURE_SPEECH_KEY`, and `AZURE_SPEECH_REGION` in a non-production test environment first.
- Confirm `GET /api/system/health` reports `realAiEnabled=true` and `azureConfigured=true` without exposing key values.
- Confirm `en-GB` pronunciation assessment is used.
- Test a short clear clip under 30 seconds.
- Test a noisy or silent clip and confirm the app shows a safe retry/error state.
- Confirm browser `webm` files are accepted. If Azure rejects the format, add transcoding before beta.
- Record observed latency and provider cost for 10 analyses.
- Confirm provider errors do not expose raw Azure response details to users.

## OpenAI

- Configure `OPENAI_API_KEY` only server-side.
- Confirm `GET /api/system/health` reports `openAiConfigured=true` without exposing key values.
- Confirm mock mode is used unless `ENABLE_REAL_AI=true`.
- Run one real speech feedback request and confirm GPT-4o-mini returns valid coaching JSON.
- Confirm JSON parse fallback produces deterministic guidance if the model response is malformed.
- Run one real roleplay turn and one end-session summary.
- Confirm prompts avoid accent erasure, native-sounding claims, legal/medical/immigration advice, and overcorrection during roleplay.

## ElevenLabs

- Configure `ENABLE_ELEVENLABS=true`, `ELEVENLABS_API_KEY`, and `ELEVENLABS_VOICE_ID` in test mode.
- Confirm `GET /api/system/health` reports `elevenLabsConfigured=true` without exposing key values.
- Generate one reference audio clip through `POST /api/reference-audio`.
- Generate one roleplay assistant audio response.
- Confirm cached audio is reused when Supabase service role storage is configured.
- Confirm text-only fallback appears when ElevenLabs is disabled or fails.
- Confirm generated audio is not treated as user voice data.

## PostHog

- Configure `NEXT_PUBLIC_ENABLE_ANALYTICS=true`, `NEXT_PUBLIC_POSTHOG_KEY`, and `NEXT_PUBLIC_POSTHOG_HOST`.
- Confirm `GET /api/system/health` reports `analyticsEnabled=true` only after analytics is intentionally enabled.
- Confirm key events fire: recording uploaded, speech analysis completed, feedback viewed, roleplay started, roleplay completed, settings updated, data delete requested, and upgrade clicked.
- Confirm analytics events never include raw transcripts, roleplay messages, audio blobs, audio URLs, provider raw responses, or secrets.
- Confirm analytics are disabled when flags or keys are missing.

## Sentry

- Configure `ENABLE_SENTRY=true` and `SENTRY_DSN`.
- Confirm `GET /api/system/health` reports `sentryEnabled=true` only after Sentry is intentionally enabled.
- Trigger a safe test server error in a non-production environment.
- Confirm captured context excludes raw transcripts, roleplay text, audio paths, and secrets.
- Confirm missing DSN is a no-op and never breaks API routes.

## Stripe

- Keep `ENABLE_STRIPE_CHECKOUT=false` for MVP beta unless explicitly testing Stripe.
- Use Stripe test mode only.
- Configure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_PRO_MONTHLY_PRICE_ID` for checkout testing.
- Confirm `GET /api/system/health` reports `stripeCheckoutEnabled=false` for beta readiness.
- Confirm checkout disabled state returns a safe explanatory message.
- Confirm success and cancel URLs return to `/settings`.
- Confirm no live charges are possible in beta.
- Webhook handling is not production-ready yet; do not enable live subscription state without a webhook QA pass.
