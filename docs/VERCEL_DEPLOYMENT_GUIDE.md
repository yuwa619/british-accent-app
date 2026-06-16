# Vercel Beta Deployment Guide

Use this guide after the mock-mode MVP checks pass. Do not enable live billing during beta readiness QA.

## 1. Prepare Supabase

1. Create separate Supabase projects for staging and production.
2. Prefer a UK/EU region because voice recordings are sensitive.
3. Link the CLI to the staging project:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref your-staging-project-ref
```

4. Apply migrations:

```bash
npx supabase@latest db push
```

5. Apply seed data:

```bash
npx supabase@latest db seed
```

6. Run the inspection queries in `docs/SUPABASE_VERIFICATION_QUERIES.sql`.
7. Complete two-user RLS checks from `docs/PROVIDER_QA_CHECKLIST.md`.
8. Confirm the private `recordings` bucket exists and is not public.

## 2. Configure Supabase Auth Redirects

For local development:

```text
Site URL: http://localhost:3000
Redirect URLs:
http://localhost:3000/**
```

For Vercel preview and production:

```text
https://*.vercel.app/**
https://your-production-domain.com/**
```

Replace `your-production-domain.com` with the real beta domain before inviting testers.

## 3. Create the Vercel Project

1. Import the Git repository into Vercel.
2. Framework preset: `Next.js`.
3. Install command: `npm install`.
4. Build command: `npm run build`.
5. Output settings: use the default Next.js/Vercel output.
6. Node version: use the current Vercel default compatible with Next.js 15, or pin the same major version used locally if needed.

## 4. Add Vercel Environment Variables

Add these to Preview first. Promote to Production only after QA passes.

Required for Supabase mode:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
MAINTENANCE_SECRET=
```

AI provider QA, still disabled until tested:

```bash
ENABLE_REAL_AI=false
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
OPENAI_API_KEY=
```

Reference and roleplay audio:

```bash
ENABLE_ELEVENLABS=false
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

Analytics and monitoring:

```bash
ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
ENABLE_SENTRY=false
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

Stripe, disabled by default:

```bash
ENABLE_STRIPE_CHECKOUT=false
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_ANNUAL_PRICE_ID=
```

Optional:

```bash
RESEND_API_KEY=
```

Never put `SUPABASE_SERVICE_ROLE_KEY`, `AZURE_SPEECH_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `MAINTENANCE_SECRET` in client-side code or `NEXT_PUBLIC_` variables.

## 5. Deploy Preview

1. Open a Vercel preview deployment.
2. Confirm the landing page loads.
3. Confirm protected routes redirect when Supabase is configured and the user is signed out.
4. Sign up with a beta QA email address.
5. Complete onboarding.
6. Open Dashboard, Lessons, Diagnostic, Shadowing, Roleplay, Progress, Settings, Privacy, Terms, and a Feedback page.
7. Record, upload, analyse in mock mode first.
8. Confirm Settings delete-all recordings and data deletion request flows work.
9. Confirm Upgrade reports checkout disabled.

## 6. Protected System Health Check

The beta app includes:

```text
GET /api/system/health
```

It requires the same `MAINTENANCE_SECRET` used by the retention route:

```bash
curl "https://your-preview-domain.vercel.app/api/system/health" \
  -H "Authorization: Bearer $MAINTENANCE_SECRET"
```

The response reports safe booleans only, such as whether Supabase, real AI, ElevenLabs, analytics, Sentry, Stripe checkout, and maintenance secrets are configured. It never returns key values.

## 7. Provider QA Sequence

Run providers in this order on Preview:

1. Supabase Auth, RLS, Storage, delete-all recordings, and data deletion request.
2. Azure Speech with `ENABLE_REAL_AI=true` and a short test recording.
3. OpenAI feedback JSON and roleplay response generation.
4. ElevenLabs reference audio and roleplay assistant audio with `ENABLE_ELEVENLABS=true`.
5. PostHog events after confirming no transcript, roleplay text, or audio data is tracked.
6. Sentry test error capture after confirming sensitive context is excluded.
7. Stripe disabled flow. Do not enable live checkout in beta readiness.

If Azure rejects browser `webm`, keep `ENABLE_REAL_AI=false` and add an audio transcoding task before inviting beta users to real analysis.

## 8. Retention Purge Readiness

Do not schedule purge automation until staging validation passes.

Manual test:

```bash
curl -X POST "https://your-preview-domain.vercel.app/api/maintenance/purge-old-recordings" \
  -H "Authorization: Bearer $MAINTENANCE_SECRET"
```

Expected safe shape:

```json
{
  "success": true,
  "mode": "supabase",
  "purgedCount": 0
}
```

See `docs/RETENTION_PURGE_PLAN.md` before adding Vercel Cron or an external scheduler.

## 9. Post-Deploy Smoke Test

Run locally against the preview URL if you want Playwright coverage outside Vercel:

```bash
PLAYWRIGHT_BASE_URL=https://your-preview-domain.vercel.app npm run test:e2e
```

The Playwright config defaults to `http://localhost:3100` for local tests so it does not collide with a normal dev server on port 3000. When `PLAYWRIGHT_BASE_URL` is set, it targets that deployed URL and does not start the local dev server.

## 10. Production Promotion

Promote to Production only after:

- Supabase RLS and Storage checks pass with two users.
- Real provider QA is completed or real providers remain disabled.
- Stripe checkout is still disabled.
- Privacy and terms pages are reviewed.
- Error and analytics privacy checks pass.
- Retention purge is tested but not automatically scheduled until approved.
- A rollback deployment is identified in Vercel.

## 11. Exact Beta Invite Gate

Before inviting beta testers:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test
```

Then complete `docs/BETA_LAUNCH_CHECKLIST.md` and `docs/PROVIDER_QA_CHECKLIST.md` with dated notes.
