-- Supabase beta verification queries.
-- Run these in the Supabase SQL editor after applying migrations and seed data.
-- These queries inspect schema, policies, and storage configuration. They do not
-- prove end-user RLS by themselves; complete the two-user app checks in
-- docs/PROVIDER_QA_CHECKLIST.md as well.

-- 1. Confirm migrations applied in order.
select version, name, inserted_at
from supabase_migrations.schema_migrations
order by version;

-- 2. Confirm all expected public tables exist and have RLS enabled.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'onboarding_responses',
    'lessons',
    'lesson_steps',
    'practice_prompts',
    'recordings',
    'speech_analysis_results',
    'diagnostic_results',
    'user_progress',
    'focus_areas',
    'roleplay_sessions',
    'roleplay_messages',
    'subscriptions',
    'user_settings',
    'data_deletion_requests'
  )
order by tablename;

-- 3. Review RLS policies for user-owned and content tables.
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Confirm the private recordings bucket exists.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'recordings';

-- 5. Review Storage object policies for the recordings bucket.
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like 'recordings_bucket_%'
order by policyname;

-- 6. Confirm seed content is available to authenticated users.
select count(*) as published_lessons
from public.lessons
where is_published = true;

select l.slug, count(ls.id) as step_count
from public.lessons l
left join public.lesson_steps ls on ls.lesson_id = l.id
group by l.slug
order by l.slug;

select prompt_type, count(*) as prompt_count
from public.practice_prompts
group by prompt_type
order by prompt_type;

-- 7. Confirm profile creation trigger exists.
select trigger_name, event_manipulation, action_timing
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users'
order by trigger_name;

-- 8. Confirm useful indexes are present.
select schemaname, tablename, indexname
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'recordings',
    'speech_analysis_results',
    'diagnostic_results',
    'user_progress',
    'focus_areas',
    'roleplay_sessions',
    'roleplay_messages',
    'data_deletion_requests'
  )
order by tablename, indexname;

-- 9. Spot-check deletion request table shape.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'data_deletion_requests'
order by ordinal_position;
