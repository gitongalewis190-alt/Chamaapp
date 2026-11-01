-- 001_identity_and_profiles.sql            STATUS: DRAFT, not applied anywhere (staging first, then owner approval)
-- Purpose: turn the EXISTING public.profiles table (id -> auth.users, username, role) into the global profile
--          (Master Prompt 5.2). We adapt it; we do not create a competing table.
-- Touches: public.profiles (+3 columns, +1 unique index, tighter privileges), 3 new functions.
-- Prereqs: none. Compatible with v0.11.0 clients (they do not touch profiles).
-- Rollback: see bottom.
begin;

-- Abort loudly if existing usernames collide when case is ignored.
do $$ begin
  if exists (select 1 from public.profiles group by lower(username) having count(*) > 1) then
    raise exception '001 aborted: usernames that differ only by case exist. Reconcile them first.';
  end if;
end $$;

alter table public.profiles
  add column if not exists full_name  text,
  add column if not exists phone      text,
  add column if not exists updated_at timestamptz not null default now();

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_full_name_len') then
    alter table public.profiles add constraint profiles_full_name_len check (full_name is null or char_length(full_name) <= 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_phone_fmt') then
    alter table public.profiles add constraint profiles_phone_fmt check (phone is null or phone ~ '^\+?[0-9 ()-]{7,20}$');
  end if;
end $$;

-- Case-insensitive uniqueness enforced by the database (existing UNIQUE(username) stays).
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));

-- The old "update own profile" policy has no WITH CHECK, so a user could edit their own `role`.
-- Close it with column privileges: users may edit only full_name and phone directly; username goes through the RPC.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant  update (full_name, phone) on public.profiles to authenticated;

create or replace function public.normalize_username(p text)
returns text language sql immutable set search_path = '' as $$ select lower(btrim(p)) $$;

-- Create or update MY global profile. Safe to retry (idempotent). Never touches `role`.
create or replace function public.set_my_profile(p_full_name text default null, p_phone text default null, p_username text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  uid uuid := auth.uid();
  u   text := public.normalize_username(p_username);
  fn  text := nullif(btrim(p_full_name), '');
  ph  text := nullif(btrim(p_phone), '');
  rec public.profiles;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if u is not null and u !~ '^[a-z0-9._-]{3,20}$' then
    raise exception 'Username must be 3 to 20 letters, numbers, dot, dash or underscore';
  end if;
  if fn is not null and char_length(fn) > 120 then raise exception 'Name is too long'; end if;
  if ph is not null and ph !~ '^\+?[0-9 ()-]{7,20}$' then raise exception 'Phone number looks wrong'; end if;

  if not exists (select 1 from public.profiles where id = uid) then
    if u is null then u := 'user' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8); end if;
    insert into public.profiles (id, username, full_name, phone) values (uid, u, fn, ph) returning * into rec;
  else
    update public.profiles
       set username = coalesce(u, username), full_name = coalesce(fn, full_name),
           phone = coalesce(ph, phone), updated_at = now()
     where id = uid returning * into rec;
  end if;
  return jsonb_build_object('id', rec.id, 'username', rec.username, 'full_name', rec.full_name, 'phone', rec.phone);
exception when unique_violation then
  raise exception 'That username is already taken';
end $$;

create or replace function public.get_my_profile()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('id', p.id, 'username', p.username, 'full_name', p.full_name, 'phone', p.phone)
  from public.profiles p where p.id = auth.uid();
$$;

revoke all on function public.set_my_profile(text, text, text), public.get_my_profile() from public, anon;
grant execute on function public.set_my_profile(text, text, text), public.get_my_profile() to authenticated;

commit;

-- ROLLBACK NOTES (manual, run only if nothing depends on the new objects):
--   drop function public.set_my_profile(text,text,text); drop function public.get_my_profile(); drop function public.normalize_username(text);
--   drop index public.profiles_username_lower_key;
--   alter table public.profiles drop constraint profiles_full_name_len, drop constraint profiles_phone_fmt;
--   alter table public.profiles drop column full_name, drop column phone, drop column updated_at;   -- loses those values
--   grant insert, update, delete on public.profiles to authenticated;                                 -- restores the old (risky) privilege
