-- 006_global_auth.sql                      STATUS: DRAFT, not applied anywhere. Requires 001-002.
-- Purpose: one global account, one global password, sign in with email OR username (Master Prompt 2.1, 7).
--   Passwords live only in Supabase Auth. This file adds: the account-status check, a throttle table,
--   and a server-only function that maps a username to its sign-in email. That function is never exposed to browsers.
begin;

-- Is my account fully set up? profile (username) + a password in Supabase Auth. Reports yes/no only; never the hash.
create or replace function public.my_account_status() returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'has_profile',  exists (select 1 from public.profiles p where p.id = auth.uid()),
    'has_password', exists (select 1 from auth.users u where u.id = auth.uid() and coalesce(u.encrypted_password, '') <> ''),
    'username',     (select p.username from public.profiles p where p.id = auth.uid()),
    'full_name',    (select p.full_name from public.profiles p where p.id = auth.uid()));
$$;
revoke all on function public.my_account_status() from public, anon;
grant execute on function public.my_account_status() to authenticated;

-- Sign-in throttle (used only by the auth-login Edge Function through the service role).
create table if not exists public.auth_throttle (
  key text primary key, window_start timestamptz not null default now(), attempts int not null default 0);
alter table public.auth_throttle enable row level security;
revoke all on public.auth_throttle from anon, authenticated;

-- true = allowed. Counts this attempt. Window resets after p_window_seconds.
create or replace function public.auth_throttle_hit(p_key text, p_max int, p_window_seconds int) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare n int;
begin
  insert into public.auth_throttle as t (key, window_start, attempts) values (p_key, now(), 1)
  on conflict (key) do update
     set attempts = case when t.window_start < now() - make_interval(secs => p_window_seconds) then 1 else t.attempts + 1 end,
         window_start = case when t.window_start < now() - make_interval(secs => p_window_seconds) then now() else t.window_start end
  returning attempts into n;
  return n <= p_max;
end $$;
create or replace function public.auth_throttle_clear(p_key text) returns void
language sql security definer set search_path = public, pg_temp as $$ delete from public.auth_throttle where key = p_key; $$;

-- identifier -> sign-in email. Server only. Returns null for unknown usernames. Email identifiers pass through normalised.
create or replace function public.resolve_login_email(p_identifier text) returns text
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare ident text := lower(btrim(p_identifier));
begin
  if ident is null or ident = '' or char_length(ident) > 254 then return null; end if;
  if position('@' in ident) > 0 then return ident; end if;
  return (select lower(u.email) from public.profiles p join auth.users u on u.id = p.id where lower(p.username) = ident);
end $$;

revoke all on function public.auth_throttle_hit(text, int, int), public.auth_throttle_clear(text), public.resolve_login_email(text) from public, anon, authenticated;
grant execute on function public.auth_throttle_hit(text, int, int), public.auth_throttle_clear(text), public.resolve_login_email(text) to service_role;

-- housekeeping: forget throttle rows older than a day (call from a scheduled job or by hand)
create or replace function public.auth_throttle_sweep() returns void
language sql security definer set search_path = public, pg_temp as $$ delete from public.auth_throttle where window_start < now() - interval '1 day'; $$;
revoke all on function public.auth_throttle_sweep() from public, anon, authenticated;
grant execute on function public.auth_throttle_sweep() to service_role;

commit;
-- ROLLBACK NOTES: drop function my_account_status(), auth_throttle_hit(text,int,int), auth_throttle_clear(text), resolve_login_email(text), auth_throttle_sweep(); drop table auth_throttle.
