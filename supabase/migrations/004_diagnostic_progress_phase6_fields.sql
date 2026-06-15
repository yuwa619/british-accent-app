alter table public.diagnostic_results
  add column if not exists strengths jsonb not null default '[]'::jsonb,
  add column if not exists recommended_lessons jsonb not null default '[]'::jsonb,
  add column if not exists practice_plan jsonb not null default '[]'::jsonb,
  add column if not exists recording_ids uuid[] not null default '{}';

alter table public.focus_areas
  add column if not exists related_lesson_slug text;

create index if not exists diagnostic_results_user_created_idx
  on public.diagnostic_results (user_id, created_at desc);

create index if not exists user_progress_user_status_idx
  on public.user_progress (user_id, status);

