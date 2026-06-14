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

## Recording Development Notes

- Recording starts only after the user clicks `Record`.
- The app prefers `audio/webm` when supported and falls back to another browser-supported audio MIME type.
- Saved Supabase objects use the private `recordings` bucket with paths like `{user_id}/{recording_id}.webm`.
- If Supabase env vars are blank, uploads return mock success and stay local to the current recording page state.
- Users can preview before saving, discard and re-record, and delete saved recordings.
- AI analysis, transcription, scoring, reference audio, and pitch feedback are not active yet.
