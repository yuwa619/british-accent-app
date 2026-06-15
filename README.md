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
npm run build
npm run format:check
```

## Environment

Copy `.env.example` to `.env.local` and fill in provider values as each phase needs them. Expensive AI and Stripe flows are feature-flagged off by default:

```bash
ENABLE_REAL_AI=false
ENABLE_STRIPE_CHECKOUT=false
```

For Phase 2 Supabase setup, configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for migrations, seed data, Auth redirect URLs, RLS, and the private recordings bucket.

## Phase Status

Phase 1 created the Next.js foundation, shadcn/ui setup, route groups, placeholder MVP routes, environment template, and project documentation.

Phase 2 adds Supabase packages, SSR clients, auth middleware, email/password auth actions, onboarding persistence, dashboard data loading, migrations, RLS policies, private recordings bucket setup, and seed data for the first 10 lessons.

Phase 3 polishes the core UI and onboarding experience: premium landing page, auth shell, multi-section onboarding form, Supabase/mock-aware dashboard and lessons, polished diagnostic/practice/progress/settings placeholders, privacy/terms content, reusable UI components, and graceful mock-mode states.

Phase 4 adds browser audio recording with MediaRecorder, microphone permission handling, recording timer, preview playback, mock-mode saving, Supabase Storage upload, recordings metadata, individual recording deletion, recent recordings UI, and privacy messaging. Real speech analysis remains deferred to Phase 5.

Phase 5 adds the speech analysis foundation: `POST /api/speech/analyse`, mock feedback by default, optional Azure Speech pronunciation assessment for `en-GB`, optional GPT-4o-mini coaching feedback, saved `speech_analysis_results`, recording status updates, dashboard feedback previews, and the polished `/feedback/[recordingId]` page.

Phase 6 adds the diagnostic journey and progress layer: a 3-part diagnostic session, `POST /api/diagnostic/aggregate`, aggregated baseline report, generated focus areas, recommended lessons, 7-day practice plan, lesson progress updates, richer dashboard status, and a progress page with practice history.

## Recording Development Notes

- Recording starts only after the user clicks `Record`.
- The app prefers `audio/webm` when supported and falls back to another browser-supported audio MIME type.
- Saved Supabase objects use the private `recordings` bucket with paths like `{user_id}/{recording_id}.webm`.
- If Supabase env vars are blank, uploads return mock success and stay local to the current recording page state.
- Users can preview before saving, discard and re-record, and delete saved recordings.
- Speech analysis is active in mock mode without provider keys. Set `ENABLE_REAL_AI=true` plus Azure/OpenAI keys to enable provider calls.
- Real Azure analysis currently uses the short-audio REST path and is best suited to short clips. Keep practice recordings under 60 seconds when testing real provider mode.
- Reference audio, roleplay audio responses, and pitch feedback remain future phases.

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
