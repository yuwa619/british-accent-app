begin;

create table if not exists public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text,
  request_type text not null default 'delete_all_data'
    check (request_type in ('delete_all_data', 'delete_recordings', 'delete_account')),
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'complete', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists data_deletion_requests_user_created_idx
  on public.data_deletion_requests(user_id, created_at desc);

alter table public.data_deletion_requests enable row level security;

drop policy if exists "Users can create their own deletion requests"
  on public.data_deletion_requests;
drop policy if exists "Users can read their own deletion requests"
  on public.data_deletion_requests;

create policy "Users can create their own deletion requests"
  on public.data_deletion_requests
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can read their own deletion requests"
  on public.data_deletion_requests
  for select
  to authenticated
  using (user_id = auth.uid());

commit;
