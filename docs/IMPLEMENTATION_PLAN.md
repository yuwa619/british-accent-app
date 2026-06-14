# Implementation Plan — Modern AI British Accent & Speech Confidence Coach (MVP)

## Context

We are turning a 49-page PRD into a build-ready MVP plan. The product is a **UK professional communication & speech confidence coach** — not an "erase your accent" tool. It helps non-native English speakers in the UK improve clarity, confidence, rhythm, intonation, connected speech, and workplace communication using AI speech feedback and guided practice, teaching **contemporary Standard Southern British English (SSBE)**, not exaggerated RP.

**Decisions confirmed with the founder (drive the whole plan):**

1. **Architecture: Next.js-only** (TypeScript, App Router). No separate Python/FastAPI service for MVP. Azure Speech + OpenAI + ElevenLabs are called over REST from Next.js route handlers. Pitch analysis is **client-side** (Web Audio API). Parselmouth/FastAPI is deferred to V1.
2. **Hard features simplified:** Roleplay is **turn-based** (push-to-talk → STT → GPT-4o-mini → ElevenLabs TTS), not realtime WebSocket streaming. Pitch is a **post-recording overlay chart**, not a live 60fps canvas. Both full versions move to V1.
3. **Deliverable:** On approval, write this plan to `docs/IMPLEMENTATION_PLAN.md` in the project.

> NOTE: This plan file _is_ the deliverable. On exit-plan-mode approval, the same content is copied to `docs/IMPLEMENTATION_PLAN.md`. No code is written during planning.

---

## Current Implementation Status

- **Phase 1 complete:** Next.js 15 App Router foundation, TypeScript, Tailwind CSS, shadcn/ui setup, route groups, placeholder MVP routes, `.env.example`, README, and baseline documentation.
- **Phase 2 complete:** Supabase packages and SSR clients, auth middleware, email/password auth actions, onboarding persistence, MVP schema migration, RLS policies, private recordings bucket plan, seed data for the first 10 lessons, and Supabase setup documentation.
- **Phase 3 complete:** Premium landing page, polished auth shell, multi-section onboarding form, Supabase/mock-aware dashboard data, lesson list/detail UI, polished diagnostic/shadowing/roleplay/progress/settings placeholders, privacy and terms copy, reusable UI components, and graceful mock-mode states.

---

## 1. Executive Technical Summary

**What we're building:** A mobile-responsive web app where a UK-based learner records short speech samples and receives instant, encouraging, credible pronunciation/prosody feedback against an SSBE reference; works through a structured 30-day curriculum of pronunciation lessons; practices shadowing and side-by-side comparison; and rehearses UK workplace/interview scenarios with an AI roleplay partner. Progress, focus areas (problem sounds), and history are tracked.

**MVP includes (Must/Should from PRD):** Landing page; auth; 3-step onboarding; acoustic-profile dashboard; **accent diagnostic test**; browser audio recording; speech-to-text + **Azure pronunciation assessment**; **AI coach feedback** (LLM-synthesised, encouraging); 10 structured lessons; shadowing; side-by-side listen-and-repeat; **turn-based AI roleplay** (5 scenarios); progress tracking + streaks; saved focus areas; practice history; settings; privacy/GDPR voice-data handling; subscription-ready schema (Stripe wired but **not launched**); admin via Supabase + seed scripts.

**Intentionally excluded (V1/Later):** custom ML speech models; native iOS/Android; realtime conversational avatars; realtime WebSocket roleplay; live 60fps pitch canvas with server-side Parselmouth; human tutoring; community/peer circles; leaderboards/XP/badges; bilingual mouth-position animations; mock-interview report generator; B2B licensing portal; live payments at launch.

**Main technical risks:** (1) Pronunciation-score _credibility_ and fairness to accented speech; (2) AI cost runaway (Azure/OpenAI/ElevenLabs) without hard caps; (3) round-trip latency target (<800ms is aggressive for REST — set realistic ~1.5–3s and message it well); (4) browser mic compatibility (Safari/iOS quirks); (5) noisy consumer mics producing bad scores; (6) over-promising "accent transformation." Mitigations in §21.

---

## 2. MVP Scope

| Feature                               | Description                                                     | Priority | Complexity | User value   | Implementation notes                             | Dependencies              |
| ------------------------------------- | --------------------------------------------------------------- | -------- | ---------- | ------------ | ------------------------------------------------ | ------------------------- |
| Landing page                          | Hero, value prop, "Try it now" mini-demo, CTA → sign-up         | Must     | Low        | High         | Static + one pre-recorded demo; no auth          | —                         |
| Auth (sign-up/login)                  | Email/password + magic link + Google OAuth                      | Must     | Low        | High         | Supabase Auth                                    | Supabase                  |
| Onboarding questionnaire              | 3 steps: native language, UK goal, industry                     | Must     | Low        | High         | Card selectors; writes `onboarding_responses`    | Auth                      |
| Dashboard (Acoustic Profile)          | Daily path card, streak calendar, focus areas, score ring/radar | Must     | Medium     | High         | Locked until diagnostic done                     | Diagnostic, progress      |
| Accent diagnostic test                | 3-step recorded reading → baseline score                        | Must     | Medium     | Very High    | Reuses recording + analysis pipeline             | Recording, Azure          |
| Browser audio recording               | MediaRecorder, waveform, timer, RMS noise check                 | Must     | Medium     | High         | Client-side; in-memory until submit              | —                         |
| Speech-to-text                        | Transcription of user audio                                     | Must     | Low        | Medium       | Azure STT (Whisper fallback)                     | Azure                     |
| Pronunciation/speech feedback         | Phoneme/word/prosody scores                                     | Must     | Medium     | Very High    | Azure Pronunciation Assessment en-GB             | Azure                     |
| AI coach feedback                     | Encouraging, plain-English summary from raw scores              | Must     | Medium     | Very High    | GPT-4o-mini turns JSON → coach object            | OpenAI, analysis          |
| Structured lessons (10)               | SSBE sound/prosody drills, progressive                          | Must     | Medium     | High         | DB-seeded curriculum                             | Recording, analysis       |
| Shadowing practice                    | Listen to native phrase → record → score                        | Must     | Medium     | Very High    | ElevenLabs ref audio (cached)                    | ElevenLabs, analysis      |
| Side-by-side comparison               | Play reference + own recording back-to-back                     | Must     | Low        | High         | HTML5 audio players                              | Recording, storage        |
| Pitch overlay (post-record)           | User F0 contour vs reference, static chart                      | Should   | Medium     | High         | Client Web Audio + pitchy lib; not live          | Recording                 |
| AI roleplay (5 scenarios, turn-based) | UK workplace/interview spoken practice                          | Should   | Medium     | Very High    | STT→LLM→TTS loop; per-turn clarity card          | OpenAI, ElevenLabs, Azure |
| Progress tracking + streaks           | Scores over time, completion, streak calendar                   | Should   | Low        | Medium       | `user_progress` aggregates                       | analysis                  |
| Saved focus areas                     | Auto-saved problem sounds/words                                 | Should   | Low        | Medium       | Derived from analysis results                    | analysis                  |
| Practice history                      | List of past recordings + feedback                              | Should   | Low        | Medium       | `recordings` table query                         | recording                 |
| Settings                              | Account, voice prefs, privacy/delete data                       | Must     | Low        | Medium       | Includes GDPR delete                             | Auth, storage             |
| Privacy/GDPR voice handling           | Consent, 30-day retention, delete-all                           | Must     | Medium     | High (trust) | Cron purge + delete endpoint                     | storage                   |
| Subscription-ready (Stripe stub)      | Free/Pro tiers, limits, paywall UI, Stripe wired off            | Must     | Low        | Medium       | Feature flags + usage caps; checkout behind flag | —                         |
| Admin/content mgmt                    | Seed scripts + Supabase Studio                                  | Must     | Low        | (internal)   | No custom admin UI in MVP                        | Supabase                  |

---

## 3. User Flows

**New visitor → sign-up:** Landing `/` → click "Start My Free Accent Diagnostic" → `/auth/sign-up` (email/Google/magic link) → email verify (if used) → profile row auto-created (trigger) → redirect `/onboarding`.

**Onboarding:** `/onboarding` 3 cards (native language → UK goal → industry); "Next" disabled until selection; final submit writes `onboarding_responses` + flags `profiles.onboarding_complete=true` → redirect `/diagnostic` (with privacy/mic consent modal first).

**First diagnostic test:** `/diagnostic` → `PrivacyConsentModal` (record consent) → mic permission → Step 1 read passage → Step 2 target sentences → Step 3 spontaneous prompt. Each step: record (waveform + timer, RMS check) → upload → analyse. After step 3 → processing animation → results written to `diagnostic_results` + seed `focus_areas` + unlock dashboard → redirect `/dashboard` showing score ring, radar, top-3 improvement areas, "Start My Study Plan" CTA.

**First pronunciation lesson:** `/dashboard` daily card → `/lessons/[id]` → text panel (sentence + IPA) → "Listen to Reference" (ElevenLabs cached) → "Record" → analyse → `FeedbackScoreCard` + word highlights (green/amber) → click amber word → phonetic tip → mark step complete → next step / lesson complete → `user_progress` + streak update.

**Shadowing practice:** `/practice/shadowing` → pick phrase (or from lesson) → play native audio → record imitation → analyse → side-by-side player + score → repeat or save.

**AI roleplay session (turn-based):** `/practice/roleplay` → choose scenario (e.g. "Job interview – Alistair, Senior Recruiter") → `POST /api/roleplay/start` creates session + AI opening line (text + TTS audio) → push-to-talk record → `POST /api/roleplay/message` (audio) → STT → GPT-4o-mini reply (in persona) + quick clarity check on the user's turn → ElevenLabs TTS → render reply + ClarityCheck card → loop until goal/turn cap → "Scenario Review" summary.

**Progress review:** `/progress` → line chart of diagnostic/lesson scores over time, per-category radar deltas, streak history, focus-area mastery rings, practice history table.

**Returning daily user:** Login → `/dashboard` → "Day N" recommended lesson + streak status + focus-area review CTA → completes daily goal (e.g. 10 min) → progress bar fills → checkmark + subtle celebration.

---

## 4. Information Architecture (routes)

| Route                            | Purpose               | Main components                                                                               | Data                        | User actions                        | Empty state                  | Error state                         |
| -------------------------------- | --------------------- | --------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------- | ---------------------------- | ----------------------------------- |
| `/`                              | Convert visitors      | Hero, TryItNow demo, CTA, pricing teaser                                                      | static + 1 demo asset       | play demo, sign up                  | —                            | demo audio fails → static image     |
| `/auth/sign-in`                  | Login                 | OnboardingForm-style auth card                                                                | —                           | login, OAuth, magic link            | —                            | "Account not found…"                |
| `/auth/sign-up`                  | Register              | auth card                                                                                     | —                           | register, OAuth                     | —                            | inline validation                   |
| `/onboarding`                    | Capture profile       | OnboardingForm (3 steps)                                                                      | `onboarding_responses`      | select & next                       | —                            | retry on save fail                  |
| `/dashboard`                     | Home                  | DailyPathCard, StreakCalendar, ProgressCard, FocusAreaBadge list                              | profile, progress, focus    | start lesson, review                | no diagnostic → locked + CTA | retry load                          |
| `/diagnostic`                    | Baseline test         | DiagnosticStepper, RecordingButton, WaveformPreview                                           | prompts, recordings         | record 3 steps                      | —                            | mic denied modal; upload retry      |
| `/lessons`                       | Browse curriculum     | LessonCard grid, FocusAreaBadge                                                               | lessons, progress           | open lesson                         | none → seed note             | retry                               |
| `/lessons/[lessonId]`            | Do a lesson           | LessonPlayer, AudioPlayer, RecordingButton, FeedbackScoreCard, WordFeedbackList, PitchOverlay | lesson, steps, recordings   | listen, record, view feedback       | —                            | noise warning; analyse retry        |
| `/practice/shadowing`            | Shadowing             | AudioPlayer, RecordingButton, side-by-side player, FeedbackScoreCard                          | practice_prompts            | listen, record, compare             | none → seed                  | retry                               |
| `/practice/roleplay`             | Scenario picker       | ScenarioCard grid                                                                             | roleplay scenarios          | start                               | —                            | —                                   |
| `/practice/roleplay/[sessionId]` | Live turn-based chat  | RoleplayChat, RoleplayRecorder, ClarityCheck card                                             | session, messages           | speak, listen, end                  | —                            | "Alistair is thinking…"; turn retry |
| `/feedback/[recordingId]`        | Deep feedback view    | FeedbackScoreCard, WordFeedbackList, PitchOverlay, AudioPlayer                                | recording + analysis        | replay, save sound, next exercise   | —                            | retry                               |
| `/progress`                      | Track improvement     | charts, PracticeHistoryTable, mastery rings                                                   | progress, history           | filter, open recording              | "Complete your first lesson" | retry                               |
| `/settings`                      | Account/privacy/voice | settings form, PrivacyConsentModal, DeleteDataButton, SubscriptionBanner                      | user_settings, subscription | edit, delete data, (upgrade)        | —                            | confirm modal on destructive        |
| `/pricing` or `/upgrade`         | Paywall               | comparison table, SubscriptionBanner, testimonials                                            | plan config                 | (Stripe checkout — flag off in MVP) | —                            | card decline (future)               |
| `/legal/privacy`, `/legal/terms` | Compliance            | static MD                                                                                     | —                           | read                                | —                            | —                                   |
| Admin                            | Content mgmt          | **Supabase Studio + seed scripts** (no custom UI)                                             | all                         | seed/edit content                   | —                            | —                                   |

---

## 5. Database Schema (Supabase Postgres)

All tables have `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at`. RLS on every user-owned table: `auth.uid() = user_id`. Content tables (`lessons`, `lesson_steps`, `practice_prompts`, `roleplay_scenarios`) are world-readable, service-role-writable.

**profiles** (1:1 with `auth.users`) — `id` (=auth uid, pk/fk), `email`, `full_name`, `avatar_url`, `role` text default `'user'` (`user`|`admin`), `onboarding_complete` bool default false, `diagnostic_complete` bool default false. _Created via on-signup trigger._

**onboarding_responses** — `id`, `user_id` fk, `native_language` text, `primary_goal` enum(`interviews`,`workplace_clarity`,`socialising`,`presenting`), `industry` enum(`technology`,`healthcare`,`finance`,`hospitality`,`student`,`other`). Index `user_id`.

**lessons** (content) — `id`, `day_number` int (1–30), `title`, `skill_focus` text (e.g. `schwa`,`trap_vowel`,`non_rhoticity`,`dental_fricative`,`word_stress`,`sentence_stress`,`connected_speech`,`intonation`), `user_goal` text, `scenario_context` text, `difficulty` enum(`beginner`,`intermediate`,`advanced`), `est_duration_min` int, `is_premium` bool default false, `order_index` int. Index `day_number`, `order_index`.

**lesson_steps** (content) — `id`, `lesson_id` fk, `step_index` int, `type` enum(`listen`,`shadow`,`read`,`tip`), `prompt_text` text, `ipa` text, `reference_phrase` text, `reference_audio_url` text (ElevenLabs cached), `target_phonemes` text[]. Index `lesson_id`.

**practice_prompts** (content) — `id`, `category` text, `text`, `ipa`, `reference_audio_url`, `difficulty`, `tags` text[]. For shadowing/standalone drills.

**recordings** — `id`, `user_id` fk, `context_type` enum(`diagnostic`,`lesson`,`shadowing`,`roleplay`), `context_id` uuid (lesson/step/scenario id, nullable), `storage_path` text (Supabase Storage), `duration_ms` int, `transcript` text, `status` enum(`uploaded`,`analysing`,`complete`,`failed`), `expires_at` timestamptz (default now()+30d). Index `user_id`, `context_type`, `expires_at`.

**speech_analysis_results** — `id`, `recording_id` fk (1:1), `overall_score` int, `pronunciation_score` int, `fluency_score` int, `completeness_score` int, `prosody_score` int, `pace_wpm` int, `rhythm_score` int, `intonation_score` int, `word_feedback` jsonb (array of {word, accuracy, error_type}), `phoneme_feedback` jsonb, `missed_words` text[], `coach_feedback` jsonb (the §8 object), `provider` text default `'azure'`, `raw` jsonb (full Azure payload, nullable). Index `recording_id`.

**diagnostic_results** — `id`, `user_id` fk, `attempt_number` int, `overall_score` int, `category_scores` jsonb ({short_vowels, intonation, fluency, weak_forms, …}), `top_focus_areas` text[], `recording_ids` uuid[]. Index `user_id`, `attempt_number`.

**user_progress** — `id`, `user_id` fk, `current_day` int default 1, `streak_count` int default 0, `last_practice_date` date, `daily_goal_min` int default 10, `total_minutes` int default 0, `lessons_completed` int default 0. _One row per user._ Index `user_id`.

**lesson_completions** — `id`, `user_id`, `lesson_id` fk, `score` int, `completed_at`. Unique(`user_id`,`lesson_id`). Drives progress + streaks.

**focus_areas** — `id`, `user_id` fk, `sound` text (e.g. `/θ/`, schwa), `label` text, `example_words` text[], `mastery` int default 0 (0–100), `times_practiced` int default 0, `source` enum(`diagnostic`,`lesson`,`roleplay`), `status` enum(`active`,`mastered`). Index `user_id`,`status`.

**roleplay_scenarios** (content) — `id`, `slug`, `title`, `persona_name`, `persona_role`, `persona_image_url`, `system_prompt` text, `opening_line` text, `goal_description` text, `turn_cap` int default 8, `is_premium` bool.

**roleplay_sessions** — `id`, `user_id` fk, `scenario_id` fk, `status` enum(`active`,`complete`,`abandoned`), `turn_count` int default 0, `summary` jsonb (scenario review). Index `user_id`.

**roleplay_messages** — `id`, `session_id` fk, `role` enum(`user`,`assistant`), `text`, `audio_url` text (TTS or user recording, nullable), `recording_id` uuid (nullable, for user turns), `clarity_check` jsonb (nullable). Index `session_id`, ordered by `created_at`.

**subscriptions** — `id`, `user_id` fk, `tier` enum(`free`,`pro`) default `free`, `status` enum(`active`,`trialing`,`canceled`,`none`) default `none`, `stripe_customer_id`, `stripe_subscription_id`, `current_period_end`. _MVP: all rows `free`; columns ready for Stripe._ Index `user_id`.

**user_settings** — `id`, `user_id` fk (1:1), `tts_voice` text default `'british_female'`, `tts_pace` numeric default 1.0, `tts_volume` numeric default 1.0, `recording_consent` bool default false, `consent_at` timestamptz, `marketing_opt_in` bool default false, `reduced_motion` bool default false. Index `user_id`.

**usage_counters** (for tier limits) — `id`, `user_id`, `period_date` date, `drills_used` int, `roleplay_turns_used` int. Unique(`user_id`,`period_date`).

**analytics_events** (optional server mirror; PostHog is primary) — `id`, `user_id`, `event` text, `properties` jsonb.

---

## 6. Audio Recording Architecture

- **API:** `navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})` → `MediaRecorder`. Lazily create `AudioContext` **on user tap** (iOS requires a user gesture; mitigates the "AudioContext suspended" risk).
- **Permission:** request only at point of need (diagnostic/lesson), preceded by a transparent prompt ("Find a quiet space, speak at your normal pace"). On denial show help modal with per-browser enable instructions.
- **Format:** record `audio/webm;codecs=opus` where supported; Safari/iOS fall back to `audio/mp4`/`aac`. Feature-detect with `MediaRecorder.isTypeSupported`. **Convert/normalise server-side if needed** before sending to Azure (Azure REST accepts WAV/Ogg/mp3; for reliability transcode to 16kHz mono WAV in a route handler using `ffmpeg`/`fluent-ffmpeg`, or send opus directly if Azure accepts). MVP: send the recorded blob; add transcode only if Azure rejects a format.
- **Upload:** client requests a **signed upload URL** (`POST /api/recordings/upload` → returns Supabase Storage signed URL + `recording` row id) → client `PUT`s blob directly to storage (keeps payload off the API) → client calls `POST /api/speech/analyse {recordingId}`.
- **Storage policy:** **store temporarily** — Supabase Storage bucket `recordings`, private, 30-day `expires_at`; nightly cron purges expired objects + nulls `storage_path`. Keep lightweight scores forever. (PRD says S3; we use Supabase Storage for single-vendor MVP — AES-256 at rest, signed URLs, TLS in transit. S3 is a drop-in V1 swap.)
- **Failed recordings:** client RMS volume check before upload (warn if too quiet/noisy: "We noticed some background noise…"); retry button; `recordings.status='failed'` on analyse error with friendly retry.
- **Waveform/timer:** live waveform via `AnalyserNode.getByteTimeDomainData` on a small canvas + monotonic timer; **WaveformPreview** component. Max clip length ~30s (cost + Azure short-audio).
- **Mobile-friendly:** big tap targets, single primary mic button with clear states (Ready / Recording…tap to stop / Processing), avoid relying on hover, test iOS Safari + Android Chrome.
- **Privacy consent:** `PrivacyConsentModal` before first recording writes `user_settings.recording_consent=true` + `consent_at`; explains where audio goes (Azure for scoring), retention (30 days), and delete rights.

---

## 7. Speech Analysis Pipeline

```
[Browser] record (in-memory) --tap stop-->
  POST /api/recordings/upload {context_type, context_id, duration}
    -> create recordings row (status=uploaded), return {recordingId, signedUploadUrl}
  PUT blob -> Supabase Storage (private bucket)
  POST /api/speech/analyse {recordingId, referenceText}
    -> set status=analysing
    -> download blob (server) / read storage
    -> Azure Pronunciation Assessment (REST, en-GB, reference=referenceText,
         granularity=Phoneme, EnableProsody=true)  ──┐
    -> (transcript from same Azure response)         │ parallel-able
    -> map Azure JSON -> normalised scores           │
    -> GPT-4o-mini: scores+transcript -> coach_feedback (§8 schema, JSON mode)
    -> insert speech_analysis_results
    -> upsert focus_areas from low-accuracy phonemes/words
    -> update user_progress / lesson_completions / streak
    -> set recordings.status=complete
    <- return {analysisId} (or full feedback)
[Browser] GET /api/recordings/:id/feedback -> render FeedbackScoreCard
```

- **Diagnostic** runs this 3× (one per step) then aggregates into `diagnostic_results` (weighted: passage 40% / sentences 40% / spontaneous 20%) and seeds top-3 `focus_areas`.
- **Latency:** Azure short-audio ~0.5–1s + GPT-4o-mini ~0.8–1.5s ⇒ realistic **~1.5–3s**. Run a "Processing your speech…" animation; optionally return Azure scores immediately and stream the LLM coach summary after. Do **not** promise <800ms on REST (PRD's <800ms target was for streaming roleplay; see §21).
- **Fallback:** if Azure fails → retry once → fall back to transcript-only via OpenAI Whisper + a generic coach message ("We couldn't fully score this one — here's your transcript; try re-recording in a quieter spot"). If LLM fails → render raw scores with a templated (non-LLM) encouraging summary.

---

## 8. AI Feedback Schema (`coach_feedback` jsonb)

Returned to frontend; **confidence-first, never harsh**. LLM system prompt forbids words like "wrong/bad/incorrect/poor"; uses "let's polish / nearly there / strong / clear."

```ts
type CoachFeedback = {
  scores: {
    clarity: number; // 0-100 overall intelligibility (headline)
    pronunciation: number; // Azure accuracy
    rhythm: number; // from prosody/duration
    intonation: number; // pitch movement
    pace: number; // mapped from wpm to 0-100 band
  };
  pace_wpm: number;
  word_feedback: { word: string; status: "clear" | "polish"; tip?: string }[];
  sound_feedback: { sound: string; example: string; guidance: string }[]; // e.g. /θ/ tongue placement
  missed_words: string[];
  suggested_correction?: string; // a re-say model phrase
  summary: string; // 1-2 warm sentences
  did_well: string; // exactly one positive
  improve: string; // exactly one gentle focus
  next_exercise: { label: string; href: string };
  disclaimer: "Scores are guidance to help you grow, not a judgement of your accent.";
};
```

UI: green = `clear`, amber = `polish` (PRD palette). Headline = **clarity** (not "accuracy") to reinforce positioning.

---

## 9. Lesson & Curriculum Implementation

Seed the full **30-day plan** from the PRD into `lessons`/`lesson_steps` (script in `/scripts/seed-curriculum.ts`). MVP **builds + QAs the first 10 lessons end-to-end** with real reference audio; days 11–30 are seeded as data and progressively enabled.

**First 10 MVP lessons:**

| #   | Title                        | Skill focus              | User goal                                    | Practice text                                       | Reference phrase | Feedback type                       | Difficulty   | Duration |
| --- | ---------------------------- | ------------------------ | -------------------------------------------- | --------------------------------------------------- | ---------------- | ----------------------------------- | ------------ | -------- |
| 1   | The British Schwa /ə/        | Schwa reduction          | Reduce unstressed vowels naturally           | "A doctor should consider a better schedule."       | same             | Azure phoneme + schwa highlight     | Beginner     | 6 min    |
| 2   | The Modern TRAP Vowel        | Open front vowel [a]     | Say trap/bad/staff the modern SSBE way       | "The manager has a flat plan for the staff."        | same             | Vowel formant guidance              | Beginner     | 6 min    |
| 3   | The Long START Vowel         | Long open back vowel     | Lengthen START vowel cleanly                 | "We walked past the dark path after class."         | same             | Phoneme + length                    | Beginner     | 6 min    |
| 4   | Non-Rhoticity: Final /r/     | Drop final r             | Hold the vowel, drop final r                 | "Our manager was better on the computer."           | same             | Intrusive-r flag                    | Beginner     | 7 min    |
| 5   | Non-Rhoticity: Pre-Consonant | Drop r before consonants | Smooth "dark car" without r                  | "The dark car parked near the quiet store."         | same             | Phoneme flag                        | Intermediate | 7 min    |
| 6   | Voiceless Dental /θ/         | "th" placement           | Say think/three not fink/tree                | "Those three thinkers thought of their thesis."     | same             | Consonant substitution + tongue tip | Intermediate | 7 min    |
| 7   | Voiced Dental /ð/            | voiced "th"              | Say this/that/they clearly                   | "They preferred this method over that one."         | same             | Consonant substitution              | Intermediate | 7 min    |
| 8   | Word Stress: Multi-syllable  | Primary stress placement | Stress the right syllable                    | "Our developer will present the proposal."          | "de-VEL-op-er"   | Stress (prosody)                    | Intermediate | 8 min    |
| 9   | Weak Forms                   | Reduce to/for/of         | Use natural weak forms                       | "I need to apply for a series of positions."        | same             | Reduction/prosody                   | Intermediate | 8 min    |
| 10  | Sentence Stress & Rhythm     | Stress-timed rhythm      | Stress content words, shorten function words | "We need to clear the backlog by Friday afternoon." | same             | Prosody/rhythm                      | Advanced     | 9 min    |

**First 5 roleplay scenarios** (`roleplay_scenarios`):

1. **UK Job Interview** — Persona "Alistair, Senior Recruiter." Goal: answer intro + 2 behavioural questions with calm pacing. Turn cap 8.
2. **Introducing Yourself at Work** — "Priya, Team Lead." Goal: give a clear self-intro + role on first day. Cap 6.
3. **Asking for Clarification in a Meeting** — "James, Project Manager." Goal: politely ask someone to repeat/explain. Cap 6.
4. **Customer Service Conversation** — "Customer (frustrated, polite)." Goal: handle a request and de-escalate clearly. Cap 8.
5. **Professional Phone Call** — "Receptionist / client on a line." Goal: clear articulation + pacing on a call. Cap 6.

Each: `system_prompt` keeps the AI in persona, in SSBE register, supportive; ends with a `clarity_check` on the user's spoken turn (1 thing clear, 1 thing to polish).

---

## 10. Frontend Component Plan

| Component            | Props                     | Behaviour                                        | State                |
| -------------------- | ------------------------- | ------------------------------------------------ | -------------------- |
| AppShell             | `children`                | Auth gate, layout, toasts                        | session              |
| Navbar               | `user`                    | Top nav, account menu                            | menu open            |
| Sidebar              | `active`                  | Dashboard/Lessons/Practice/Progress/Settings nav | collapsed (mobile)   |
| ProgressCard         | `score, delta, label`     | Score ring/radar                                 | —                    |
| LessonCard           | `lesson, status`          | Open lesson, locked/done badge                   | —                    |
| RecordingButton      | `onComplete(blob), maxMs` | Mic states, RMS check, timer                     | recording/processing |
| AudioPlayer          | `src, label`              | Play/pause native audio                          | playing              |
| WaveformPreview      | `analyser`                | Live waveform canvas                             | —                    |
| PitchOverlay         | `userF0[], refF0[]`       | Static F0 overlay chart (post-record)            | —                    |
| FeedbackScoreCard    | `feedback: CoachFeedback` | Score rings + summary + did_well/improve         | expanded             |
| WordFeedbackList     | `wordFeedback[]`          | Green/amber words, tap → tip                     | selected word        |
| FocusAreaBadge       | `focusArea`               | Sound chip + mastery ring                        | —                    |
| RoleplayChat         | `messages[]`              | Scrolling transcript + persona window            | —                    |
| RoleplayRecorder     | `onTurn(blob)`            | Push-to-talk + waveform                          | recording            |
| DiagnosticStepper    | `step, total`             | 3-step indicator                                 | step                 |
| OnboardingForm       | `onSubmit`                | 3 card steps, next disabled until select         | step, answers        |
| PracticeHistoryTable | `rows[]`                  | Past recordings list, open feedback              | sort/filter          |
| SubscriptionBanner   | `tier, usage`             | Free-limit nudge / upgrade CTA                   | —                    |
| PrivacyConsentModal  | `onConsent`               | Explains data + records consent                  | open                 |
| DeleteDataButton     | `onDelete`                | Confirm modal → delete all voice data            | confirming           |

State management: React Server Components + server actions for data; **TanStack Query** for client mutations (record/analyse/roleplay); Zustand only if needed for recorder state. Charts: **Recharts** (radar + line) + custom SVG rings.

---

## 11. UI/UX Implementation Plan

- **Look & feel:** premium, calm, professional — inspired by Headspace/Stripe/Notion/Apple. Mature progress loops (streaks, rings), **no arcade gamification**.
- **Colour:** Primary Navy `#0F172A`; Accent Teal `#0D9488` (interactive, progress, "clear"); Warning Ochre `#D97706` (polish areas — never red/"error" framing); Background `#F8FAFC`; dividers `#E2E8F0`.
- **Typography:** Headings Inter/Cabinet Grotesk; body Inter/Satoshi; **IPA in JetBrains Mono**.
- **Layout/spacing:** card structures, generous padding, responsive 4/8px scale; mobile-first.
- **Empty states:** encouraging copy + single primary CTA (e.g. locked dashboard → "Take Your Diagnostic Test to Unlock Your Path").
- **Loading states:** skeletons for dashboard; "Processing your speech…" animation for analysis; "Alistair is thinking…" for roleplay.
- **Animations:** smooth Framer Motion transitions, gentle waveform load, celebratory ring fill for scores >85% (respect `prefers-reduced-motion` / `user_settings.reduced_motion`).
- **Feedback tone:** always lead with a positive; amber = "let's polish," never "wrong." Persistent disclaimer that scores are guidance.
- **Accessibility:** WCAG 2.1 AA — contrast, focus rings, keyboard nav, ARIA on recorder/players, captions/transcripts for all audio, screen-reader labels on score rings.
- **Mobile:** fluid layouts, large tap targets, bottom-anchored mic button on practice screens, test iOS Safari recording.
- **Dashboard:** daily path card first, then streak calendar, focus areas, score ring/radar.
- **Practice screen:** text+IPA panel → Listen/Record actions → feedback (scores, word highlights, pitch overlay).
- **Feedback screen:** clarity headline ring, secondary rings, word list, "one win / one focus / next exercise."

---

## 12. Backend API Design (Next.js route handlers / server actions)

All under `/app/api/*`, JWT via Supabase session, RLS enforced. JSON unless noted.

| Endpoint                              | Method    | Auth  | Request                                                  | Response                                                 | Errors                            |
| ------------------------------------- | --------- | ----- | -------------------------------------------------------- | -------------------------------------------------------- | --------------------------------- |
| `/api/onboarding`                     | POST      | user  | `{native_language, primary_goal, industry}`              | `{ok, redirect:"/diagnostic"}`                           | 400 validation                    |
| `/api/dashboard`                      | GET       | user  | —                                                        | `{profile, progress, focusAreas, dailyLesson, streak}`   | 401                               |
| `/api/recordings/upload`              | POST      | user  | `{context_type, context_id, duration_ms, mime}`          | `{recordingId, signedUploadUrl}`                         | 401, 429 (limit)                  |
| `/api/speech/analyse`                 | POST      | user  | `{recordingId, referenceText, context_type, context_id}` | `{analysisId, feedback}`                                 | 422 (audio), 502 (Azure), retried |
| `/api/recordings/:id/feedback`        | GET       | owner | —                                                        | `{recording, analysis, feedback}`                        | 403, 404                          |
| `/api/lessons`                        | GET       | user  | `?day=`                                                  | `{lessons[]}`                                            | 401                               |
| `/api/lessons/:id`                    | GET       | user  | —                                                        | `{lesson, steps[]}`                                      | 404, 402 (premium gate)           |
| `/api/practice/complete`              | POST      | user  | `{lessonId, score}`                                      | `{progress, streak, focusAreas}`                         | 400                               |
| `/api/roleplay/start`                 | POST      | user  | `{scenarioId}`                                           | `{sessionId, opening:{text,audioUrl}}`                   | 402 (premium), 429                |
| `/api/roleplay/message`               | POST      | user  | `{sessionId, recordingId}`                               | `{reply:{text,audioUrl}, clarityCheck, turnCount, done}` | 429 (turn cap), 502               |
| `/api/roleplay/:id/review`            | GET       | owner | —                                                        | `{summary}`                                              | 404                               |
| `/api/progress`                       | GET       | user  | —                                                        | `{scoresOverTime, categories, history, mastery}`         | 401                               |
| `/api/focus-areas`                    | GET/PATCH | user  | `{id, status}`                                           | `{focusAreas}`                                           | 401                               |
| `/api/settings`                       | POST      | user  | `{tts_voice, tts_pace, reduced_motion, ...}`             | `{settings}`                                             | 400                               |
| `/api/privacy/delete-voice-data`      | POST      | user  | —                                                        | `{deletedCount}`                                         | 401                               |
| `/api/account/delete`                 | POST      | user  | `{confirm:true}`                                         | `{ok}`                                                   | 401                               |
| `/api/tts`                            | POST      | user  | `{text, voice}`                                          | `{audioUrl}` (ElevenLabs, cached by hash)                | 502                               |
| `/api/stripe/create-checkout-session` | POST      | user  | `{plan}`                                                 | `{url}`                                                  | **disabled in MVP (flag)**        |
| `/api/stripe/webhook`                 | POST      | sig   | Stripe event                                             | `200`                                                    | sig verify                        |

Validation with **Zod** on every body. Rate-limit AI endpoints (Upstash Redis or in-Postgres `usage_counters`) to enforce free-tier caps + cost protection.

---

## 13. Authentication & Authorisation

- **Supabase Auth**: email/password + magic link + Google OAuth. (LinkedIn optional V1.)
- **Profile creation**: Postgres trigger on `auth.users` insert → creates `profiles`, `user_progress`, `user_settings`, `subscriptions(tier=free)` rows.
- **Protected routes**: Next.js middleware checks session; unauth → `/auth/sign-in`. Onboarding/diagnostic gating via `profiles.onboarding_complete` / `diagnostic_complete`.
- **Admin role**: `profiles.role='admin'`; MVP admin = Supabase Studio + seed scripts (no custom admin UI). Admin-only API guard helper.
- **RLS**: enabled on all user tables (`auth.uid() = user_id`); content tables read-all/write-service-role; storage bucket private with per-user path policy `recordings/{uid}/...`.
- **Sessions**: Supabase SSR cookies; refresh handled by `@supabase/ssr`.

---

## 14. Privacy, GDPR & Ethics Checklist

Voice processed under **UK GDPR Article 6** (language feedback only — not biometric identification, so **not** Article 9). Still treat as sensitive.

- [ ] Recording consent captured before first record (`user_settings.recording_consent`, timestamped) via `PrivacyConsentModal`.
- [ ] Plain-language privacy notice in onboarding: what's sent (Azure for scoring), where stored (Supabase Storage, EU region), retention (30 days), deletion rights.
- [ ] "Delete All My Voice Data and Recordings" button in settings → purges storage objects + `recordings` rows, keeps anonymised scores only if user consents (else delete).
- [ ] Full account deletion endpoint (right to erasure).
- [ ] **Temporary storage**: 30-day auto-purge cron; metadata-only retained.
- [ ] Encryption at rest (Supabase/AES-256) + TLS 1.3 in transit.
- [ ] AI processing disclosure: name third parties (Microsoft Azure, OpenAI, ElevenLabs) in privacy policy; confirm no training on user audio (Azure/OpenAI API data not used for training by default — document this).
- [ ] **Anti-discrimination framing**: never "correct/inferior accent"; clarity & confidence language only.
- [ ] Persistent disclaimer: "Scores are guidance, not judgement."
- [ ] Accessibility for speech differences: never block progress on low scores; allow skip; supportive messaging.
- [ ] EU/UK data region for Supabase + Azure resource.

---

## 15. Analytics & Success Metrics (PostHog)

Event names (snake_case) + key properties:

- `signup_completed` `{method}`
- `onboarding_completed` `{native_language, goal, industry}` — target >85%
- `diagnostic_started` / `diagnostic_completed` `{overall_score}` — target >80%
- `first_recording_made` `{context_type}`
- `feedback_viewed` `{recording_id, clarity}`
- `lesson_started` / `lesson_completed` `{lesson_id, day_number, score}`
- `roleplay_started` / `roleplay_completed` `{scenario_id, turns}`
- `daily_goal_met` `{minutes}`
- `streak_incremented` `{streak_count}`
- `focus_area_practiced` `{sound, mastery}`
- `upgrade_clicked` `{placement}` / `paywall_viewed`
- `feedback_usefulness_rated` `{stars}`

Dashboards: activation funnel (signup→onboarding→diagnostic→first lesson), 7/30-day retention, recordings/session, avg diagnostic score improvement (attempt 1 vs re-test), confidence survey, free→paid intent (upgrade clicks, since payments off).

---

## 16. Monetisation-Ready Plan

- **Free tier:** diagnostic + acoustic profile + **3 sound drills/day**; no roleplay (or 1 trial); no premium lessons.
- **Pro tier:** unlimited drills, all roleplays, full curriculum, pitch overlay, progress analytics. £15/mo or £120/yr.
- **Add-on (post-MVP):** UK Interview Booster Pack £45 (14-day sprint).
- **Limits enforced** via `usage_counters` + `subscriptions.tier` (also protects AI cost). Free caps: 3 drills/day, 1 roleplay total.
- **Stripe integration plan:** schema + `/api/stripe/*` routes + webhook handler **built but feature-flagged OFF** (`PAYMENTS_ENABLED=false`). Paywall UI (`/upgrade`) renders comparison table + "Join the waitlist / Coming soon" instead of live checkout in MVP. Flip flag + add price IDs to go live.
- **Paywall placement:** when free user hits daily drill cap, opens roleplay, or accesses premium lessons → `SubscriptionBanner` / `/upgrade`.

---

## 17. Development Roadmap (8 weeks)

**Week 1 — Setup, design system, auth, DB.** Goals: skeleton + login working. Tasks: Next.js+TS+Tailwind+shadcn, Supabase project, schema migrations + RLS, profile trigger, auth (email/Google/magic link), AppShell/Navbar/Sidebar, design tokens (colours/fonts), Sentry+PostHog. Deliverable: deployed shell on Vercel, user can sign up/in. Accept: protected routes redirect; profile row auto-created.

**Week 2 — Onboarding, dashboard, lessons structure.** Tasks: OnboardingForm + `/api/onboarding`; seed `lessons`/`lesson_steps` (30 days) + `roleplay_scenarios` + `practice_prompts`; dashboard (locked state); LessonCard/LessonList. Deliverable: onboarding → dashboard; lessons browsable. Accept: onboarding writes responses; dashboard locked until diagnostic.

**Week 3 — Audio recording & upload.** Tasks: RecordingButton, WaveformPreview, RMS check, MediaRecorder cross-browser, signed-URL upload, `recordings` rows, storage bucket + policies, PrivacyConsentModal. Deliverable: record → upload → stored. Accept: works Chrome/Safari/iOS; consent captured; mic-denied modal.

**Week 4 — STT + AI feedback (mock→real).** Tasks: `/api/speech/analyse` with **mock Azure response first**, then real Azure Pronunciation Assessment (en-GB), GPT-4o-mini coach synthesis, FeedbackScoreCard/WordFeedbackList, focus-area upsert, fallbacks. Deliverable: record → real feedback. Accept: scores + coach object render; Azure failure falls back gracefully.

**Week 5 — Diagnostic test & progress.** Tasks: DiagnosticStepper 3-step flow, aggregate diagnostic_results, acoustic-profile dashboard (rings/radar), `/api/progress`, streaks, lesson completion. Deliverable: full diagnostic → profile → unlocked path. Accept: 3 steps recorded+scored; top-3 focus areas seeded; dashboard unlocks.

**Week 6 — Shadowing & roleplay.** Tasks: ElevenLabs ref-audio generation + cache, side-by-side player, shadowing screen, pitch overlay (post-record), turn-based roleplay (start/message/review) with STT→GPT-4o-mini→TTS, ClarityCheck. Deliverable: shadowing + 5 roleplays working. Accept: roleplay completes a scenario; clarity card per turn; ref audio cached.

**Week 7 — Polish, privacy, analytics, testing.** Tasks: GDPR delete flows + 30-day purge cron, settings, paywall UI (flag off), usage caps, PostHog events, accessibility pass, error/empty/loading states, animations, mobile QA. Deliverable: feature-complete beta. Accept: delete-data works; caps enforced; AA contrast; events firing.

**Week 8 — Beta launch & bug-fixing.** Tasks: load/latency tuning, cost caps (hard monthly Azure/OpenAI limits), browser matrix QA, content QA of 10 lessons, seed remaining curriculum, deploy prod, onboard beta users. Deliverable: live MVP. Accept: §22 criteria met.

---

## 18. Engineering Tickets (sample backlog — Linear/GitHub format)

Format: **Title** — description / acceptance / tech notes / priority / estimate.

- **PLAT-1 Project scaffold** — Next.js 15 App Router + TS strict + Tailwind + shadcn/ui + ESLint/Prettier. AC: `pnpm dev` runs, CI lints. Notes: pnpm, app dir. P0, 0.5d.
- **PLAT-2 Supabase + schema migrations** — all §5 tables + RLS + profile trigger. AC: migrations apply clean; RLS denies cross-user. Notes: SQL in `/supabase/migrations`. P0, 2d.
- **AUTH-1 Auth flows** — email/pw, magic link, Google; middleware guard. AC: sign up/in/out; protected redirect. P0, 1.5d.
- **DS-1 Design system** — tokens, typography, IPA mono, AppShell/Navbar/Sidebar. AC: matches palette; responsive. P0, 1.5d.
- **ONB-1 Onboarding** — OnboardingForm + API + gating. AC: writes responses, redirects to diagnostic. P0, 1d.
- **REC-1 Recorder** — RecordingButton+Waveform+RMS, cross-browser. AC: records ≤30s on Chrome/Safari/iOS. P0, 2.5d.
- **REC-2 Upload pipeline** — signed URL + storage + recordings row. AC: blob in private bucket; row created. P0, 1.5d.
- **AI-1 Analyse (mock)** — `/api/speech/analyse` returns mock CoachFeedback. AC: UI renders from mock. P0, 0.5d.
- **AI-2 Azure pronunciation** — real en-GB assessment + mapping. AC: real scores; <3s typical. Notes: short-audio REST, prosody on. P0, 2.5d.
- **AI-3 Coach synthesis** — GPT-4o-mini JSON-mode → CoachFeedback, tone-guarded. AC: never harsh; one win/one focus. P0, 1.5d.
- **AI-4 Fallbacks** — Azure→Whisper, LLM→template. AC: graceful on failure. P1, 1d.
- **DIAG-1 Diagnostic flow** — stepper + aggregate + profile. AC: 3 steps → diagnostic_results + focus areas. P0, 2d.
- **DASH-1 Dashboard** — daily card, streak, focus, rings/radar. AC: locked→unlocked transition. P0, 2d.
- **LES-1 Curriculum seed** — 30-day data + first 10 QA'd. AC: lessons render with ref audio. P0, 1.5d.
- **TTS-1 ElevenLabs ref audio + cache** — `/api/tts` hash-cached. AC: cached on 2nd request. P1, 1.5d.
- **SHAD-1 Shadowing + side-by-side** — AC: play ref, record, compare, score. P1, 1.5d.
- **PITCH-1 Pitch overlay** — client F0 (pitchy) post-record chart. AC: user vs ref curve. P2, 2d.
- **RP-1 Roleplay turn loop** — start/message/review, STT→LLM→TTS. AC: complete a scenario; clarity card. P1, 3d.
- **PROG-1 Progress page** — charts + history table. AC: scores over time, mastery. P1, 1.5d.
- **PRIV-1 GDPR delete + purge cron** — delete-voice-data + 30-day cron. AC: objects+rows gone. P0, 1.5d.
- **SET-1 Settings** — voice prefs, consent, delete. P1, 1d.
- **PAY-1 Stripe (flagged off)** — schema/routes/webhook + paywall UI. AC: flag off → "coming soon"; on → checkout. P2, 2d.
- **OBS-1 Analytics + Sentry** — events §15 + error tracking. P1, 1d.
- **QA-1 Cost caps** — hard monthly Azure/OpenAI limits + rate limits. AC: blocks past cap with friendly msg. P0, 1d.

---

## 19. Testing Plan

- **Unit:** score-mapping (Azure JSON→CoachFeedback), tone guard (no banned words), usage-cap logic, streak calc, Zod schemas. (Vitest)
- **Integration:** onboarding→diagnostic gating; analyse pipeline with mocked Azure/OpenAI; focus-area upsert; roleplay turn loop.
- **Audio upload:** signed URL issuance, storage write, oversize/format rejection, RMS warning path.
- **API:** auth required, RLS denies cross-user, rate limits, error codes.
- **AI response:** golden-file tests on mock Azure payloads; assert no harsh language; assert schema validity; latency budget test.
- **Auth:** sign up/in/out, magic link, OAuth, protected redirects.
- **Mobile:** iOS Safari + Android Chrome recording/playback (manual + Playwright where possible).
- **Accessibility:** axe-core CI, keyboard nav, contrast, audio transcripts, reduced-motion.
- **Privacy:** delete-voice-data removes objects+rows; purge cron; consent gating before record.
- **Manual QA checklist:** full happy path (signup→diagnostic→lesson→roleplay→progress→delete data) on Chrome/Safari/Edge/iOS/Android; noisy-mic path; offline/slow-network; AI-failure fallbacks; cost-cap message.

---

## 20. Deployment Plan

- **Environments:** `local`, `preview` (Vercel PR), `production`. Separate Supabase projects for staging/prod.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AZURE_SPEECH_KEY/REGION`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `STRIPE_SECRET/WEBHOOK_SECRET`, `PAYMENTS_ENABLED`, `RESEND_API_KEY`, `SENTRY_DSN`, `POSTHOG_KEY`, `UPSTASH_REDIS_*`. Server-only keys never `NEXT_PUBLIC_`.
- **Hosting:** Vercel (Next.js). Supabase (DB/Auth/Storage, EU region). Optional Upstash Redis for rate limits.
- **CI/CD:** GitHub Actions — lint, typecheck, unit/integration, axe; Vercel auto-deploy on merge to `main`; preview per PR.
- **DB migrations:** Supabase CLI migrations in repo; apply via CI on deploy.
- **Storage:** private `recordings` bucket + RLS path policy; signed URLs; lifecycle/purge cron (Supabase scheduled function or Vercel cron).
- **API key security:** all third-party calls server-side only; secrets in Vercel/Supabase env; rotate keys; hard spend caps in Azure/OpenAI dashboards.
- **Monitoring/errors:** Sentry (FE+API), PostHog product analytics, Vercel logs, uptime check.
- **Launch checklist:** §22 met; privacy policy + terms live; cost caps set; backups on; OAuth redirect URLs set; Stripe flag off.

---

## 21. Risks & Mitigation (critical)

- **Scoring accuracy/credibility:** Azure is good but not infallible on accented speech; mitigate by leading with **clarity** not raw accuracy, smoothing/averaging, hiding phoneme detail behind tap-to-expand, and never blocking progress on low scores. Calibrate thresholds with a small internal test set.
- **British-model reliability:** lock `locale=en-GB`, SSBE reference text; QA reference audio with a native speaker before seeding.
- **AI cost:** Azure short-audio ($0.66/hr) + OpenAI + ElevenLabs can spike. **Hard monthly caps**, per-user free limits (`usage_counters`), cache ElevenLabs audio aggressively, cap clip length 30s.
- **Latency:** PRD's <800ms is realistic only for streaming; our REST path is ~1.5–3s — **set expectations with processing animation** and consider returning Azure scores first, streaming the LLM summary. Don't over-promise.
- **Privacy concerns:** transparent consent, 30-day purge, prominent delete, Article-6 framing documented, no training on user audio.
- **Browser mic issues:** feature-detect formats, lazy AudioContext on tap, iOS mp4 fallback, clear permission help modal.
- **Poor mobile audio:** RMS noise check + retry guidance; AGC/noise-suppression on.
- **Over-promising transformation:** strict copy guidelines — "clarity & confidence," never "sound native/erase accent"; persistent guidance disclaimer.
- **Complex pitch analysis:** keep pitch **client-side post-record** (pitchy/autocorrelation); defer Parselmouth + live 60fps to V1.
- **Retention risk:** daily path + streaks + visible improvement + re-test at day 29 to show measurable gains; email reminders (Resend).

---

## 22. MVP Acceptance Criteria (launch gate)

1. New user can sign up, complete onboarding, and finish the 3-step diagnostic, receiving a baseline acoustic profile with top-3 focus areas.
2. User can complete at least the **first 10 lessons** end-to-end with real reference audio and real Azure-based feedback rendered as the encouraging CoachFeedback object.
3. Browser recording works on **Chrome, Safari, Edge, iOS Safari, Android Chrome**; mic-denied and noisy-mic paths handled.
4. Speech analysis returns within **~3s typical** with a clear processing state; Azure/LLM failures fall back gracefully.
5. **Turn-based roleplay** completes a scenario across all 5 scenarios with per-turn clarity feedback.
6. Progress tracking, streaks, saved focus areas, and practice history all reflect real activity.
7. GDPR: consent captured before recording; "Delete all my voice data" works; 30-day purge cron runs; privacy policy live.
8. Subscription schema + paywall present; Stripe wired but **flag off** (no live charges).
9. Analytics events firing; Sentry capturing errors; AI **cost caps** enforced.
10. Crash-free session rate >99.5% in beta testing; AA contrast/accessibility pass; all copy adheres to clarity-not-erasure positioning.

---

## 23. Prompt for Claude Code to Start Building

> **Prompt for Claude Code to Start Building**
>
> Build the MVP for "a UK Professional Communication & Speech Confidence Coach" — a mobile-responsive web app helping non-native English speakers in the UK improve clarity, confidence, and natural British (SSBE) speech. **Positioning is strict: clarity & confidence, never "erase your accent."** Follow `docs/IMPLEMENTATION_PLAN.md` as the source of truth.
>
> **Stack (do not deviate):** Next.js 15 (App Router) + TypeScript (strict) + Tailwind + shadcn/ui; Supabase (Postgres + Auth + Storage, EU region); Azure AI Speech Pronunciation Assessment (en-GB) for scoring; OpenAI GPT-4o-mini for coach-feedback synthesis + roleplay; ElevenLabs Flash v2.5 for British reference/roleplay audio; client-side Web Audio API for recording + post-record pitch (pitchy); PostHog, Sentry, Resend, Stripe (flagged OFF). Deploy on Vercel.
>
> **Architecture rules:** Next.js-only (no separate Python backend). All third-party AI calls in server route handlers only — never expose keys client-side. Clean, typed, reusable components per the component plan. Validate all inputs with Zod. Enforce RLS on every user table.
>
> **Build in phases, commit after each phase:**
>
> 1. Scaffold + design system (tokens: Navy #0F172A, Teal #0D9488, Amber #D97706, bg #F8FAFC; Inter + JetBrains Mono for IPA) + Supabase schema/migrations + RLS + profile trigger + auth (email/magic link/Google). Commit.
> 2. Onboarding (3 steps) + dashboard (locked state) + seed 30-day curriculum & 5 roleplay scenarios. Commit.
> 3. Browser recording (cross-browser, RMS check, waveform) + signed-URL upload to private storage + PrivacyConsentModal. Commit.
> 4. `/api/speech/analyse` — **first return a mock CoachFeedback object**, render the full feedback UI, THEN integrate real Azure + GPT-4o-mini synthesis with tone guarding and fallbacks. Commit.
> 5. Diagnostic 3-step flow + acoustic-profile dashboard (rings/radar) + progress/streaks. Commit.
> 6. Shadowing + side-by-side + post-record pitch overlay + turn-based roleplay (STT→GPT-4o-mini→ElevenLabs TTS, per-turn clarity card). Commit.
> 7. GDPR delete + 30-day purge cron + settings + paywall UI (Stripe flagged off) + usage caps + PostHog/Sentry + accessibility (WCAG AA) + mobile QA. Commit.
>
> **Constraints:** Build only MVP scope from the plan. Do NOT build: realtime WebSocket roleplay, live 60fps pitch canvas, Parselmouth/Python service, native apps, avatars, community/leaderboards, live payments, human tutoring. Feedback copy must be encouraging — never use "wrong/bad/incorrect/inferior." Always show "scores are guidance, not judgement." Set hard AI cost caps and free-tier usage limits. Stop after each phase and report what was built + how to test it.

## Verification (how to test the build later)

- Run locally: `pnpm dev`; smoke the full happy path (signup → onboarding → diagnostic → lesson → roleplay → progress → delete data).
- Mock-first AI: confirm feedback UI renders from mock before wiring Azure; then verify real Azure scores + tone-guarded LLM summary.
- Cross-browser recording matrix incl. iOS Safari.
- Automated: `pnpm test` (Vitest unit/integration), axe-core a11y, RLS cross-user denial test, GDPR delete test, AI-failure fallback test.
- Confirm AI cost caps + free-tier limits block past threshold with a friendly message.

---

## Phase Progress Notes

### Phase 1 — Project foundation

Status: completed.

Completed:

- Created the Next.js 15 App Router foundation with TypeScript and Tailwind CSS.
- Initialised shadcn/ui using the project npm runner.
- Added marketing, auth, and app route groups.
- Added placeholder pages for all Phase 1 MVP routes.
- Added `.env.example`, README setup notes, lint/typecheck/format scripts, and this local implementation plan.

Next:

- Begin Phase 2 Supabase setup: clients, auth middleware, migrations, RLS, storage plan, and seed data.

Verification:

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Browser smoke test for all Phase 1 routes at `http://localhost:3000`

### Phase 2 — Supabase setup

Status: completed.

Completed:

- Installed `@supabase/supabase-js` and `@supabase/ssr`.
- Added browser, server, middleware, and server-only admin Supabase clients.
- Added auth middleware for protected app routes with local mock-mode fallback when env vars are missing.
- Made sign-in and sign-up pages functional with Supabase email/password server actions.
- Added sign-out action and app-shell sign-out control.
- Added onboarding persistence to `onboarding_responses` and profile goal fields.
- Updated dashboard to fetch the signed-in profile and available lessons from Supabase, with graceful setup fallback.
- Created `supabase/migrations/001_initial_schema.sql` with MVP tables, indexes, triggers, profile creation trigger, RLS policies, and private recordings bucket policies.
- Created `supabase/seed.sql` with the first 10 lessons, lesson steps, and practice prompts.
- Added `docs/SUPABASE_SETUP.md` and updated README setup notes.

Next:

- Begin Phase 3 core UI and onboarding polish once approved.

Verification:

- `npm run format`
- `npm run format:check`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Browser smoke test for `/`, `/auth/sign-in`, `/auth/sign-up`, `/onboarding`, `/dashboard`, `/lessons`, and `/settings`
