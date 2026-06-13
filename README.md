# Accent Confidence Coach

Modern AI British Accent and Speech Confidence Coach MVP.

The product helps non-native English speakers in the UK improve clarity, confidence, intelligibility, rhythm, intonation, connected speech, and workplace communication. It is not positioned as accent erasure.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase planned for Auth, Postgres, Storage, and RLS
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

## Phase Status

Phase 1 creates the Next.js foundation, shadcn/ui setup, route groups, placeholder MVP routes, environment template, and project documentation. Supabase, auth, storage, AI analysis, recording, analytics, and subscription flows begin in later phases.
