-- MON cloud account schema for Supabase
create table if not exists public.mon_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sync_version integer not null default 1,
  profile jsonb not null default '{}'::jsonb,
  learning_state jsonb not null default '{}'::jsonb,
  client_updated_at timestamptz,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1 check (revision >= 1)
);

alter table public.mon_user_state add column if not exists revision bigint not null default 1;
alter table public.mon_user_state enable row level security;
revoke all on table public.mon_user_state from anon, authenticated;
grant select, insert, update, delete on table public.mon_user_state to authenticated;

create policy "mon users read own state"
on public.mon_user_state for select to authenticated
using ((select auth.uid()) = user_id);

create policy "mon users create own state"
on public.mon_user_state for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "mon users update own state"
on public.mon_user_state for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "mon users delete own state"
on public.mon_user_state for delete to authenticated
using ((select auth.uid()) = user_id);

create index if not exists mon_user_state_updated_at_idx on public.mon_user_state(updated_at);
