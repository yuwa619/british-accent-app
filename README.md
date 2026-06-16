# Accent Confidence Coach

Modern AI British Accent and Speech Confidence Coach MVP.

The product helps non-native English speakers in the UK improve clarity, confidence, intelligibility, rhythm, intonation, connected speech, and workplace communication. It is not positioned as accent erasure.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase for Auth, Postgres, Storage, and RLS
- Azure AI Speech, OpenAI, and ElevenLabs planned behind server routes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run test:all
npm run build
npm run format:check
```

## Environment

Copy `.env.example` or `.env.local.example` to `.env.local` and fill in provider values as each phase needs them. Expensive AI and Stripe flows are feature-flagged off by default:

```bash
ENABLE_REAL_AI=false
ENABLE_STRIPE_CHECKOUT=false
ENABLE_ANALYTICS=false
ENABLE_SENTRY=false
```

For Phase 2 Supabase setup, configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

For optional Phase 7 reference audio, keep generation off locally unless you have a test ElevenLabs key:

```bash
ENABLE_ELEVENLABS=false
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for migrations, seed data, Auth redirect URLs, RLS, and the private recordings bucket.

## Phase Status

Phase 1 created the Next.js foundation, shadcn/ui setup, route groups, placeholder MVP routes, environment template, and project documentation.

Phase 2 adds Supabase packages, SSR clients, auth middleware, email/password auth actions, onboarding persistence, dashboard data loading, migrations, RLS policies, private recordings bucket setup, and seed data for the first 10 lessons.

Phase 3 polishes the core UI and onboarding experience: premium landing page, auth shell, multi-section onboarding form, Supabase/mock-aware dashboard and lessons, polished diagnostic/practice/progress/settings placeholders, privacy/terms content, reusable UI components, and graceful mock-mode states.

Phase 4 adds browser audio recording with MediaRecorder, microphone permission handling, recording timer, preview playback, mock-mode saving, Supabase Storage upload, recordings metadata, individual recording deletion, recent recordings UI, and privacy messaging. Real speech analysis remains deferred to Phase 5.

Phase 5 adds the speech analysis foundation: `POST /api/speech/analyse`, mock feedback by default, optional Azure Speech pronunciation assessment for `en-GB`, optional GPT-4o-mini coaching feedback, saved `speech_analysis_results`, recording status updates, dashboard feedback previews, and the polished `/feedback/[recordingId]` page.

Phase 6 adds the diagnostic journey and progress layer: a 3-part diagnostic session, `POST /api/diagnostic/aggregate`, aggregated baseline report, generated focus areas, recommended lessons, 7-day practice plan, lesson progress updates, richer dashboard status, and a progress page with practice history.

Phase 7 upgrades lessons and shadowing into guided practice flows: structured lesson step navigation, reference text/audio support, optional ElevenLabs generation through `POST /api/reference-audio`, side-by-side reference vs user comparison, post-recording energy and approximate pitch movement visuals, mini feedback summaries, and lesson completion controls.

Phase 8 adds turn-based AI roleplay practice: scenario selection, session creation, typed and recorded user turns, mock or GPT-4o-mini assistant replies, optional ElevenLabs assistant audio, saved roleplay sessions/messages, transcript UI, end-session feedback summaries, and dashboard/progress activity updates.

Phase 9 hardens beta readiness: privacy/account settings, persisted voice data preferences, delete-all-recordings, data deletion requests, safe PostHog analytics helpers, safe Sentry error capture helpers, subscription-ready usage limits, and Stripe Checkout behind `ENABLE_STRIPE_CHECKOUT=false`.

Phase 10 adds beta readiness hardening: Playwright smoke tests, accessibility landmark fixes, protected retention purge maintenance route, provider QA checklist, retention purge plan, known limitations, launch checklist, and final documentation updates.

Phase 11 adds real-environment deployment readiness: a protected `/api/system/health` endpoint that returns safe configuration booleans only, `.env.local.example`, Supabase SQL verification queries, Vercel deployment instructions, and preview-friendly Playwright targeting through `PLAYWRIGHT_BASE_URL`.

## Recording Development Notes

- Recording starts only after the user clicks `Record`.
- The app prefers `audio/webm` when supported and falls back to another browser-supported audio MIME type.
- Saved Supabase objects use the private `recordings` bucket with paths like `{user_id}/{recording_id}.webm`.
- If Supabase env vars are blank, uploads return mock success and stay local to the current recording page state.
- Users can preview before saving, discard and re-record, and delete saved recordings.
- Users can bulk-delete recordings from Settings. In Supabase mode, audio objects are removed before recording rows; analysis rows cascade from deleted recordings.
- Speech analysis is active in mock mode without provider keys. Set `ENABLE_REAL_AI=true` plus Azure/OpenAI keys to enable provider calls.
- Real Azure analysis currently uses the short-audio REST path and is best suited to short clips. Keep practice recordings under 60 seconds when testing real provider mode.
- Reference audio uses text-mode fallback by default. Set `ENABLE_ELEVENLABS=true` with `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` to request generated reference audio server-side.
- The Phase 7 pitch/intensity panels use browser Web Audio after recording. They are visual guidance for rhythm and energy, not scientific acoustic scoring.

## Speech Analysis Development Notes

- Local development defaults to mock analysis unless `ENABLE_REAL_AI=true`.
- Mock analysis does not call Azure or OpenAI and does not create provider cost.
- `POST /api/speech/analyse` accepts a saved `recordingId` and optional expected text.
- In Supabase mode, the route verifies ownership, prevents duplicate analysis unless forced, applies a simple 20-per-day user cap, updates `recordings.status`, and saves feedback into `speech_analysis_results`.
- GPT feedback must focus on clarity, confidence, rhythm, and intelligibility. Do not frame feedback as accent erasure or native-sounding speech.

## Diagnostic and Progress Notes

- `/diagnostic` now has three prompts: reading passage, British pronunciation sentences, and a spoken workplace prompt.
- Each prompt uses the recording and analysis flow from Phases 4-5.
- `POST /api/diagnostic/aggregate` averages the three analysis results, derives focus areas, recommends lessons, saves `diagnostic_results`, and seeds `focus_areas` when Supabase is configured.
- Mock mode can simulate analysed diagnostic clips so local QA works without Supabase, Azure, or OpenAI keys.
- Lesson recordings marked as analysed automatically update `user_progress` in Supabase mode.
- `/progress` shows baseline scores, latest score, focus areas, practice history, and the generated 7-day practice plan.

## Lesson and Shadowing Notes

- `/lessons/[lessonId]` now guides users through Learn, Listen, Shadow, Record, Compare, Analyse, and Complete.
- `/practice/shadowing` offers workplace prompt categories such as introductions, clarification, interviews, phone calls, customer-facing conversations, and meeting contributions.
- `POST /api/reference-audio` returns a mock/text fallback unless ElevenLabs is enabled. When Supabase and a service role key are configured, generated MP3s are cached in the private `recordings` bucket under `reference-audio/{hash}.mp3`.
- Mock mode remains fully usable without Supabase, Azure, OpenAI, or ElevenLabs keys.

## Roleplay Notes

- `/practice/roleplay` is turn-based: start a scenario, read the assistant prompt, reply by typed text or a saved voice turn, then end the session for feedback.
- `POST /api/roleplay/start`, `POST /api/roleplay/turn`, `POST /api/roleplay/end`, and `GET /api/roleplay/sessions` power the MVP flow.
- Local mock mode works without Supabase, OpenAI, Azure, or ElevenLabs keys. Real assistant replies use GPT-4o-mini only when `ENABLE_REAL_AI=true` and `OPENAI_API_KEY` is set.
- Assistant voice responses are optional and use ElevenLabs only when `ENABLE_ELEVENLABS=true`; otherwise roleplay remains text-based.
- MVP sessions are capped at 10 user turns. Transcripts and linked recordings are user-owned and follow existing Supabase RLS policies when Supabase is configured.

## Privacy, Analytics, and Billing Notes

- `/settings` is the privacy/account control centre: profile summary, retention preference, AI processing consent, email reminders, recording deletion, data deletion request, and subscription readiness.
- `POST /api/user-settings` saves voice-data preferences to `user_settings` when Supabase is configured and returns mock success otherwise.
- `DELETE /api/recordings` deletes all current-user recordings. `POST /api/account/delete-data-request` creates a pending request in `data_deletion_requests` when Supabase is configured.
- PostHog analytics are disabled unless `NEXT_PUBLIC_ENABLE_ANALYTICS=true` and `NEXT_PUBLIC_POSTHOG_KEY` are set. Do not track transcripts, raw roleplay messages, or voice data.
- Sentry capture is disabled unless `ENABLE_SENTRY=true` and `SENTRY_DSN` are set. Monitoring helpers are no-op safe when missing.
- Stripe Checkout is disabled unless `ENABLE_STRIPE_CHECKOUT=true`, `STRIPE_SECRET_KEY`, and `STRIPE_PRO_MONTHLY_PRICE_ID` are configured. Live charging is off by default.
- Retention purge is available at `POST /api/maintenance/purge-old-recordings` and requires `MAINTENANCE_SECRET`. See [docs/RETENTION_PURGE_PLAN.md](docs/RETENTION_PURGE_PLAN.md).
- System health is available at `GET /api/system/health` and also requires `MAINTENANCE_SECRET`. It reports safe booleans only and never returns secret values.

## Testing

Playwright e2e tests run in mock mode and do not require Supabase or provider keys:

```bash
npm run test:e2e
```

The local Playwright server uses `http://localhost:3100` so it does not collide with the usual `npm run dev` app on port 3000.

To run the same smoke suite against a Vercel preview:

```bash
PLAYWRIGHT_BASE_URL=https://your-preview-domain.vercel.app npm run test:e2e
```

The suite covers landing/auth routes, dashboard/progress, lessons, diagnostic mock baseline generation, feedback, shadowing, roleplay typed turns, settings privacy controls, data deletion request, and disabled checkout.

## Launch Readiness Docs

- [Provider QA Checklist](docs/PROVIDER_QA_CHECKLIST.md)
- [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT_GUIDE.md)
- [Supabase Verification Queries](docs/SUPABASE_VERIFICATION_QUERIES.sql)
- [Retention Purge Plan](docs/RETENTION_PURGE_PLAN.md)
- [Known Limitations](docs/KNOWN_LIMITATIONS.md)
- [Beta Launch Checklist](docs/BETA_LAUNCH_CHECKLIST.md)
