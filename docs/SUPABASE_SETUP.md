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

Once env vars are set, middleware protects:

- `/dashboard`
- `/diagnostic`
- `/lessons`
- `/practice/*`
- `/feedback/*`
- `/progress`
- `/settings`

Unauthenticated users are redirected to `/auth/sign-in`.
