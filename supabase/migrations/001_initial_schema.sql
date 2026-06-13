create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user',
  native_language text,
  target_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('user', 'admin'))
);

create table public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  native_language text,
  current_level text,
  primary_goal text,
  profession text,
  speaking_confidence integer,
  target_situations text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onboarding_responses_confidence_check
    check (speaking_confidence is null or speaking_confidence between 1 and 5)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  skill_focus text not null,
  difficulty text not null default 'beginner',
  estimated_minutes integer not null default 5,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint lessons_difficulty_check
    check (difficulty in ('beginner', 'intermediate', 'advanced'))
);

create table public.lesson_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  step_type text not null,
  title text not null,
  body text,
  practice_text text,
  reference_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint lesson_steps_type_check
    check (step_type in ('explain', 'listen', 'shadow', 'read', 'reflect', 'tip'))
);

create table public.practice_prompts (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete set null,
  prompt_type text not null,
  title text not null,
  prompt_text text not null,
  target_sound text,
  difficulty text not null default 'beginner',
  created_at timestamptz not null default now(),
  constraint practice_prompts_difficulty_check
    check (difficulty in ('beginner', 'intermediate', 'advanced'))
);

create table public.recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  prompt_id uuid references public.practice_prompts(id) on delete set null,
  recording_type text not null,
  storage_path text not null,
  duration_seconds numeric,
  transcript text,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recordings_type_check
    check (recording_type in ('diagnostic', 'lesson', 'shadowing', 'roleplay')),
  constraint recordings_status_check
    check (status in ('uploaded', 'analysing', 'complete', 'failed'))
);

create table public.speech_analysis_results (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid not null references public.recordings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  overall_score numeric,
  pronunciation_score numeric,
  rhythm_score numeric,
  intonation_score numeric,
  pace_score numeric,
  clarity_score numeric,
  word_feedback jsonb not null default '[]'::jsonb,
  sound_feedback jsonb not null default '[]'::jsonb,
  missed_words jsonb not null default '[]'::jsonb,
  suggested_correction text,
  ai_summary text,
  one_thing_done_well text,
  one_thing_to_improve text,
  next_exercise text,
  raw_provider_response jsonb,
  created_at timestamptz not null default now()
);

create table public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  overall_score numeric,
  pronunciation_score numeric,
  rhythm_score numeric,
  intonation_score numeric,
  pace_score numeric,
  clarity_score numeric,
  summary text,
  focus_areas jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  status text not null default 'not_started',
  completion_percent integer not null default 0,
  last_score numeric,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_user_lesson_unique unique (user_id, lesson_id),
  constraint user_progress_status_check
    check (status in ('not_started', 'in_progress', 'complete')),
  constraint user_progress_completion_check
    check (completion_percent between 0 and 100)
);

create table public.focus_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  category text not null,
  description text,
  priority integer not null default 1,
  source text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.roleplay_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scenario_key text not null,
  title text not null,
  status text not null default 'active',
  summary text,
  created_at timestamptz not null default now(),
  ended_at timestamptz,
  constraint roleplay_sessions_status_check
    check (status in ('active', 'complete', 'abandoned'))
);

create table public.roleplay_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.roleplay_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender text not null,
  message_text text,
  recording_id uuid references public.recordings(id) on delete set null,
  audio_storage_path text,
  created_at timestamptz not null default now(),
  constraint roleplay_messages_sender_check
    check (sender in ('user', 'assistant', 'system'))
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'free',
  plan text not null default 'free',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  retain_recordings_days integer not null default 30,
  allow_ai_processing boolean not null default true,
  email_reminders boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_retention_check
    check (retain_recordings_days between 1 and 365)
);

create index onboarding_responses_user_id_idx on public.onboarding_responses (user_id);
create index lesson_steps_lesson_id_idx on public.lesson_steps (lesson_id);
create index practice_prompts_lesson_id_idx on public.practice_prompts (lesson_id);
create index recordings_user_id_created_at_idx on public.recordings (user_id, created_at desc);
create index recordings_lesson_id_idx on public.recordings (lesson_id);
create index recordings_prompt_id_idx on public.recordings (prompt_id);
create index speech_analysis_results_user_id_created_at_idx on public.speech_analysis_results (user_id, created_at desc);
create index speech_analysis_results_recording_id_idx on public.speech_analysis_results (recording_id);
create index diagnostic_results_user_id_created_at_idx on public.diagnostic_results (user_id, created_at desc);
create index user_progress_user_id_idx on public.user_progress (user_id);
create index user_progress_lesson_id_idx on public.user_progress (lesson_id);
create index focus_areas_user_id_resolved_at_idx on public.focus_areas (user_id, resolved_at);
create index roleplay_sessions_user_id_created_at_idx on public.roleplay_sessions (user_id, created_at desc);
create index roleplay_messages_session_id_created_at_idx on public.roleplay_messages (session_id, created_at);
create index roleplay_messages_user_id_idx on public.roleplay_messages (user_id);
create index subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger onboarding_responses_set_updated_at
before update on public.onboarding_responses
for each row execute function public.set_updated_at();

create trigger recordings_set_updated_at
before update on public.recordings
for each row execute function public.set_updated_at();

create trigger user_progress_set_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_steps enable row level security;
alter table public.practice_prompts enable row level security;
alter table public.recordings enable row level security;
alter table public.speech_analysis_results enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.user_progress enable row level security;
alter table public.focus_areas enable row level security;
alter table public.roleplay_sessions enable row level security;
alter table public.roleplay_messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_settings enable row level security;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "onboarding_responses_select_own"
on public.onboarding_responses for select to authenticated
using (user_id = (select auth.uid()));

create policy "onboarding_responses_insert_own"
on public.onboarding_responses for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "onboarding_responses_update_own"
on public.onboarding_responses for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "onboarding_responses_delete_own"
on public.onboarding_responses for delete to authenticated
using (user_id = (select auth.uid()));

create policy "lessons_read_published"
on public.lessons for select to authenticated
using (is_published);

create policy "lesson_steps_read_published_lessons"
on public.lesson_steps for select to authenticated
using (
  exists (
    select 1
    from public.lessons
    where lessons.id = lesson_steps.lesson_id
      and lessons.is_published
  )
);

create policy "practice_prompts_read_published"
on public.practice_prompts for select to authenticated
using (
  lesson_id is null
  or exists (
    select 1
    from public.lessons
    where lessons.id = practice_prompts.lesson_id
      and lessons.is_published
  )
);

create policy "recordings_select_own"
on public.recordings for select to authenticated
using (user_id = (select auth.uid()));

create policy "recordings_insert_own"
on public.recordings for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "recordings_update_own"
on public.recordings for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "recordings_delete_own"
on public.recordings for delete to authenticated
using (user_id = (select auth.uid()));

create policy "speech_analysis_results_select_own"
on public.speech_analysis_results for select to authenticated
using (user_id = (select auth.uid()));

create policy "speech_analysis_results_insert_own"
on public.speech_analysis_results for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "speech_analysis_results_update_own"
on public.speech_analysis_results for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "speech_analysis_results_delete_own"
on public.speech_analysis_results for delete to authenticated
using (user_id = (select auth.uid()));

create policy "diagnostic_results_select_own"
on public.diagnostic_results for select to authenticated
using (user_id = (select auth.uid()));

create policy "diagnostic_results_insert_own"
on public.diagnostic_results for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "diagnostic_results_update_own"
on public.diagnostic_results for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "diagnostic_results_delete_own"
on public.diagnostic_results for delete to authenticated
using (user_id = (select auth.uid()));

create policy "user_progress_select_own"
on public.user_progress for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_progress_insert_own"
on public.user_progress for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "user_progress_update_own"
on public.user_progress for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "user_progress_delete_own"
on public.user_progress for delete to authenticated
using (user_id = (select auth.uid()));

create policy "focus_areas_select_own"
on public.focus_areas for select to authenticated
using (user_id = (select auth.uid()));

create policy "focus_areas_insert_own"
on public.focus_areas for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "focus_areas_update_own"
on public.focus_areas for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "focus_areas_delete_own"
on public.focus_areas for delete to authenticated
using (user_id = (select auth.uid()));

create policy "roleplay_sessions_select_own"
on public.roleplay_sessions for select to authenticated
using (user_id = (select auth.uid()));

create policy "roleplay_sessions_insert_own"
on public.roleplay_sessions for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "roleplay_sessions_update_own"
on public.roleplay_sessions for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "roleplay_sessions_delete_own"
on public.roleplay_sessions for delete to authenticated
using (user_id = (select auth.uid()));

create policy "roleplay_messages_select_own"
on public.roleplay_messages for select to authenticated
using (user_id = (select auth.uid()));

create policy "roleplay_messages_insert_own"
on public.roleplay_messages for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.roleplay_sessions
    where roleplay_sessions.id = roleplay_messages.session_id
      and roleplay_sessions.user_id = (select auth.uid())
  )
);

create policy "roleplay_messages_update_own"
on public.roleplay_messages for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "roleplay_messages_delete_own"
on public.roleplay_messages for delete to authenticated
using (user_id = (select auth.uid()));

create policy "subscriptions_select_own"
on public.subscriptions for select to authenticated
using (user_id = (select auth.uid()));

create policy "subscriptions_insert_own"
on public.subscriptions for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "subscriptions_update_own"
on public.subscriptions for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "subscriptions_delete_own"
on public.subscriptions for delete to authenticated
using (user_id = (select auth.uid()));

create policy "user_settings_select_own"
on public.user_settings for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_settings_update_own"
on public.user_settings for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recordings',
  'recordings',
  false,
  52428800,
  array['audio/webm', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "recordings_bucket_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'recordings'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (
      (storage.foldername(name))[1] = 'recordings'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
  )
);

create policy "recordings_bucket_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'recordings'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (
      (storage.foldername(name))[1] = 'recordings'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
  )
);

create policy "recordings_bucket_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'recordings'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (
      (storage.foldername(name))[1] = 'recordings'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
  )
)
with check (
  bucket_id = 'recordings'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (
      (storage.foldername(name))[1] = 'recordings'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
  )
);

create policy "recordings_bucket_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'recordings'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (
      (storage.foldername(name))[1] = 'recordings'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
  )
);
