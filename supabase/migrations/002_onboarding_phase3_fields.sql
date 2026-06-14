alter table public.onboarding_responses
add column if not exists current_challenge text,
add column if not exists allow_ai_processing boolean not null default true;
