# Staging Supabase Runbook

Use this runbook for the first real staging Supabase setup. Do not disable RLS to make a failing check pass.

## 1. Create Staging Project

1. Create a new Supabase project named clearly as staging, for example `accent-confidence-coach-staging`.
2. Prefer a UK/EU region because user voice recordings are sensitive.
3. In **Project Settings > API**, collect:
   - Project URL
   - Anon/publishable key
   - Service role key
4. Store keys only in `.env.local` and Vercel environment variables. Do not paste them into docs, commits, screenshots, or issue comments.

## 2. Configure Auth

In **Authentication > Providers**:

1. Enable Email provider.
2. Enable email/password sign-in.
3. Keep OAuth providers disabled unless separately configured.

In **Authentication > URL Configuration**:

```text
Site URL:
http://localhost:3000

Redirect URLs:
http://localhost:3000/**
https://*.vercel.app/**
https://your-future-production-domain.com/**
```

After a Vercel preview URL exists, add the exact preview URL too:

```text
https://your-project-git-branch-team.vercel.app/**
```

## 3. Apply Migrations

Install or invoke the Supabase CLI:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref your-staging-project-ref
npx supabase@latest db push
```

Expected migration files:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_onboarding_phase3_fields.sql
supabase/migrations/003_speech_analysis_phase5_fields.sql
supabase/migrations/004_diagnostic_progress_phase6_fields.sql
supabase/migrations/005_data_deletion_requests.sql
```

Do not edit applied migration files directly after staging is live. Add a new migration for follow-up fixes.

## 4. Seed Lessons

```bash
npx supabase@latest db seed
```

Expected seed outcome:

- 10 published lessons.
- Each lesson has lesson steps.
- Practice prompts exist for the MVP lessons.

## 5. Verify Schema, RLS, And Storage

Run:

```text
docs/SUPABASE_VERIFICATION_QUERIES.sql
```

in the Supabase SQL editor.

Expected outcomes:

- Migration versions `001` through `005` are applied.
- Every user-owned public table has `rowsecurity = true`.
- `lessons`, `lesson_steps`, and `practice_prompts` have read policies only for normal authenticated users.
- `recordings` bucket exists and `public = false`.
- Storage object policies named `recordings_bucket_*` exist.
- `published_lessons` is at least `10`.
- The auth user profile trigger exists.

## 6. Two-User RLS QA

Create two test accounts through the deployed app:

```text
staging-user-a@example.com
staging-user-b@example.com
```

For User A:

1. Sign up.
2. Complete onboarding.
3. Record and save one lesson or shadowing recording.
4. Analyse it in mock mode.
5. Start and end a roleplay session.
6. Save settings.
7. Create a data deletion request.

For User B:

1. Sign up in a separate browser/private window.
2. Confirm User B cannot see User A recordings, feedback, roleplay sessions, focus areas, or settings.
3. Confirm User B can read the published lesson catalogue.

Manual ownership checks:

- User A can delete User A recording.
- User B cannot delete User A recording by direct URL/API request.
- User A cannot insert/update/delete lesson content with the anon client.
- User A can update only User A settings.
- User A can create only User A data deletion request.

## 7. Storage QA

With User A signed in:

1. Record a short browser clip.
2. Save/upload it.
3. Confirm a row exists in `public.recordings`.
4. Confirm a Storage object exists under:

```text
{user_id}/{recording_id}.webm
```

5. Confirm the bucket remains private.
6. Delete the recording in the app.
7. Confirm both the Storage object and recording row are gone.

## 8. Bulk Delete And Retention QA

1. Create two recordings for User A.
2. Use Settings > Delete all recordings.
3. Confirm all User A recording rows are gone.
4. Confirm related speech analysis rows cascade.
5. Confirm User B recordings remain.
6. Test retention endpoint only with `MAINTENANCE_SECRET`:

```bash
curl -X POST "https://your-preview-url/api/maintenance/purge-old-recordings" \
  -H "Authorization: Bearer $MAINTENANCE_SECRET"
```

Expected: safe JSON with `success: true` and a count. Do not schedule the route until staging behaviour is reviewed.
