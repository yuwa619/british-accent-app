# Supabase Setup

Phase 2 adds the Supabase foundation for Auth, Postgres, Storage, and RLS.

## 1. Create a Supabase Project

1. Create a Supabase project in the Supabase dashboard.
2. Prefer a UK/EU region for the MVP because users are UK-based and recordings are sensitive.
3. In the project dashboard, open **Connect** or **Project Settings > API**.
4. Copy the project URL and anon/publishable key for browser/server SSR use.
5. Copy the service role key only for trusted server-side jobs and admin scripts.

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit `.env.local`. The browser client only uses the public URL and anon key. The service role key is only read by `src/lib/supabase/admin.ts`, which is marked server-only.

## 3. Run Migrations

Install or invoke the Supabase CLI:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref your-project-ref
npx supabase@latest db push
```

The initial migration is:

```bash
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_onboarding_phase3_fields.sql
supabase/migrations/003_speech_analysis_phase5_fields.sql
```

It creates:

- Auth-linked `profiles`
- Onboarding, lesson, recording, feedback, diagnostic, progress, focus area, roleplay, subscription, and settings tables
- `updated_at` trigger function
- Profile/settings/subscription creation trigger after Supabase Auth sign-up
- RLS policies for user-owned data
- Private `recordings` storage bucket and object policies

## 4. Seed Lessons and Prompts

After migrations:

```bash
npx supabase@latest db seed
```

Seed file:

```bash
supabase/seed.sql
```

It inserts the first 10 MVP lessons, 2-3 steps for each lesson, and one practice prompt for each lesson.

## 5. Configure Auth Redirect URLs

In **Authentication > URL Configuration**, set:

```text
Site URL: http://localhost:3000
Redirect URLs:
http://localhost:3000/**
```

For preview/production, also add your Vercel URLs:

```text
https://your-preview-domain.vercel.app/**
https://your-production-domain.com/**
```

Email/password auth is used in Phase 2. OAuth and magic link can be added later without changing the schema.

## 6. Storage Bucket

The migration creates a private bucket:

```text
recordings
```

Recommended object paths:

```text
{user_id}/{recording_id}.webm
```

The policies also tolerate the more explicit path:

```text
recordings/{user_id}/{recording_id}.webm
```

Authenticated users can read, upload, update, and delete only objects under their own user id. The service role bypasses RLS for admin cleanup jobs such as retention purges.

Phase 4 upload behaviour:

- `POST /api/recordings` accepts multipart form data with an `audio` file, `recording_type`, optional `lesson_id`, optional `prompt_id`, and optional `duration_seconds`.
- The server validates the authenticated user, recording type, audio MIME type, and file size before upload.
- Audio uploads to the private `recordings` bucket and then inserts a row into `public.recordings`.
- If the metadata insert fails after Storage upload, the route removes the uploaded object.
- `GET /api/recordings` returns the signed-in user's latest recordings.
- `DELETE /api/recordings/[recordingId]` verifies ownership, removes the Storage object, and deletes the metadata row.
- If Supabase env vars are missing locally, the API returns mock success and does not persist audio.

Phase 5 analysis behaviour:

- `POST /api/speech/analyse` accepts JSON with `recordingId`, optional `expectedText`, optional `lessonId`, optional `promptId`, and optional `force`.
- The route verifies the signed-in user owns the recording before reading Storage or writing feedback.
- Existing feedback is reused unless `force=true`.
- The route enforces a simple 20-analysis daily cap per user and a maximum clip length of two minutes.
- Results are saved in `speech_analysis_results`; Phase 5 migration adds `confidence_note`, `provider`, `is_mock`, and a unique index on `recording_id`.
- Missing AI provider env vars keep the app in mock mode and do not call external providers.

Real AI provider variables:

```bash
ENABLE_REAL_AI=true
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
OPENAI_API_KEY=
```

Provider notes:

- Azure Speech is used for `en-GB` transcription and pronunciation assessment.
- GPT-4o-mini converts raw scoring into British English coaching feedback focused on clarity and confidence.
- Azure's short-audio REST path is best tested with short clips. Browser `webm` support may require later transcoding if real-mode provider tests reject the uploaded format.

## 7. RLS Model

RLS is enabled on all user-owned tables. Policies follow this pattern:

```sql
user_id = (select auth.uid())
```

Using `(select auth.uid())` lets Postgres evaluate the current user once per statement instead of once per row. Foreign key and user lookup columns are indexed to support RLS checks and cascade operations.

Content tables are read-only for authenticated users:

- `lessons`
- `lesson_steps`
- `practice_prompts`

Normal users cannot modify lesson content. Admin/content editing is deferred to service-role scripts or Supabase Studio.

## 8. Local Development Notes

If Supabase env vars are missing:

- The app does not crash.
- Middleware does not block protected routes.
- Auth forms show a clear setup message when submitted.
- Dashboard and onboarding show developer setup guidance.
- Recording pages still allow browser recording and preview. Save actions use mock mode and are not persistent.

Once env vars are set, middleware protects:

- `/dashboard`
- `/diagnostic`
- `/lessons`
- `/practice/*`
- `/feedback/*`
- `/progress`
- `/settings`

Unauthenticated users are redirected to `/auth/sign-in`.
