create or replace function public.mon_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.mon_set_updated_at() from public, anon, authenticated;

drop trigger if exists mon_user_state_set_updated_at on public.mon_user_state;
create trigger mon_user_state_set_updated_at
before update on public.mon_user_state
for each row execute function public.mon_set_updated_at();
