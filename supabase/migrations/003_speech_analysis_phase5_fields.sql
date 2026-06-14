alter table public.speech_analysis_results
  add column if not exists confidence_note text,
  add column if not exists provider text not null default 'mock',
  add column if not exists is_mock boolean not null default true;

create unique index if not exists speech_analysis_results_recording_unique_idx
  on public.speech_analysis_results (recording_id);

