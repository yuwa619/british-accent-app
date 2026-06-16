# Staging Deployment Runbook

This runbook is for Vercel Preview plus staging Supabase verification. Stripe must remain disabled.

## Current Phase 12 Status

As of this commit:

- No `.env.local` file is present in the workspace.
- No `.vercel` project link is present in the workspace.
- Vercel CLI is installed, but `vercel whoami` reports an invalid token.
- Real Supabase and provider QA cannot be run until staging credentials are supplied.

## 1. Required Vercel Preview Environment Variables

Set these in Vercel **Preview** environment first.

Required for Supabase staging:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Required app config:

```bash
NEXT_PUBLIC_APP_URL=https://your-vercel-preview-url
MAINTENANCE_SECRET=
```

AI/provider flags, initially disabled:

```bash
ENABLE_REAL_AI=false
ENABLE_ELEVENLABS=false
```

Stripe, always disabled for this phase:

```bash
ENABLE_STRIPE_CHECKOUT=false
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_ANNUAL_PRICE_ID=
```

Analytics/monitoring, initially disabled:

```bash
ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
ENABLE_SENTRY=false
```

Optional later, after Supabase staging passes:

```bash
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

## 2. Link And Deploy Vercel Preview

Once Vercel authentication is fixed:

```bash
vercel login
vercel link
vercel env pull .env.local
vercel deploy
```

If the project is imported through the Vercel dashboard instead:

1. Import the repository.
2. Framework preset: Next.js.
3. Install command: `npm install`.
4. Build command: `npm run build`.
5. Output: Vercel default for Next.js.
6. Add Preview env vars.
7. Trigger a preview deployment from the branch/commit.

## 3. Preview Smoke Tests

After deployment, run:

```bash
PLAYWRIGHT_BASE_URL=https://your-vercel-preview-url npm run test:e2e
```

Manual preview checks:

- Landing page loads.
- Sign-up works.
- Sign-in works.
- Onboarding saves.
- Dashboard loads with a real user.
- Lessons load from Supabase seed data.
- Recording saves to Supabase Storage.
- Recording metadata saves.
- Recording delete works.
- Mock feedback analysis works with `ENABLE_REAL_AI=false`.
- Diagnostic mock/analysis flow works.
- Roleplay mock mode works.
- Settings save works.
- Delete all recordings works.
- Data deletion request saves.
- Stripe upgrade flow says checkout is disabled.
- `/api/system/health` rejects missing secret.
- `/api/system/health` accepts `MAINTENANCE_SECRET` and returns booleans only.

## 4. Protected Health Checks

Without secret:

```bash
curl -i "https://your-vercel-preview-url/api/system/health"
```

Expected:

```text
401
```

With secret:

```bash
curl -s "https://your-vercel-preview-url/api/system/health" \
  -H "Authorization: Bearer $MAINTENANCE_SECRET"
```

Expected:

```json
{
  "ok": true,
  "checks": {
    "supabaseConfigured": true,
    "supabaseServiceRoleConfigured": true,
    "realAiEnabled": false,
    "stripeCheckoutEnabled": false
  }
}
```

The real response includes more booleans, but must not include key values, project URLs, transcripts, roleplay text, audio paths, or provider responses.

## 5. Provider Testing Order

Only after Supabase staging passes:

1. Keep `ENABLE_REAL_AI=false` and verify mock analysis first.
2. Add Azure/OpenAI keys in Preview.
3. Temporarily set `ENABLE_REAL_AI=true`.
4. Analyse one short recording.
5. Record result and latency in `docs/STAGING_QA_RESULTS.md`.
6. Set `ENABLE_REAL_AI=false` again if Azure webm compatibility or latency is unstable.
7. Test ElevenLabs only after reference-audio fallback is confirmed.
8. Keep Stripe disabled throughout Phase 12.

## 6. Failure Handling

- Do not disable RLS.
- Do not make buckets public.
- Do not expose service-role functionality to client components.
- Do not enable Stripe checkout for live billing.
- Do not send transcripts, roleplay text, audio URLs, or voice data to analytics.
- If preview tests fail only because auth redirects are missing, update Supabase redirect URLs and redeploy/retest.
