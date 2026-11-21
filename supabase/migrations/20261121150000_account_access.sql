create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  email text not null,
  success boolean not null,
  occurred_at timestamptz not null default now()
);

create index if not exists login_events_occurred_at_idx
  on public.login_events (occurred_at desc);

alter table public.login_events enable row level security;

revoke all on table public.login_events from anon, authenticated;
grant select on table public.login_events to authenticated;

drop policy if exists "Administrators can read login events" on public.login_events;
create policy "Administrators can read login events"
  on public.login_events
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
