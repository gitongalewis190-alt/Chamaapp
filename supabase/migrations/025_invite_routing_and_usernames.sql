-- 025: invitation routing and usernames. NOT YET APPLIED. Written 2026-11-19; test inside BEGIN ... ROLLBACK first.
--   1. invitation_account(token): for a valid, pending invitation, the invited email and whether it already has an account,
--      so the invitation link goes straight to "sign in" or "create account" with the email filled in.
--      Holding the 64-character token proves the person received the email, so this does not let anyone probe emails.
--   2. Usernames are never reused: a username that was changed or deleted is kept in retired_usernames and only its
--      original owner may take it back.
--   3. username_available(name) and username_suggestions(full name): live checks for the account setup screen.

create or replace function public.invitation_account(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions, pg_temp as $$
declare inv public.chama_invitations; has boolean;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then return jsonb_build_object('ok', false); end if;
  select * into inv from public.chama_invitations where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');
  if not found or inv.status <> 'pending' or inv.expires_at <= now() then return jsonb_build_object('ok', false); end if;
  select exists (select 1 from auth.users u where lower(u.email) = inv.invited_email and u.deleted_at is null) into has;
  return jsonb_build_object('ok', true, 'email', inv.invited_email, 'has_account', has);
end $$;
revoke all on function public.invitation_account(text) from public;
grant execute on function public.invitation_account(text) to anon, authenticated;

create table if not exists public.retired_usernames (
  username_lower text primary key,
  user_id uuid,
  retired_at timestamptz not null default now()
);
alter table public.retired_usernames enable row level security;   -- no policies: only the functions below read it

create or replace function private.retire_username() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'DELETE' then
    insert into public.retired_usernames (username_lower, user_id) values (lower(old.username), old.id) on conflict do nothing;
    return old;
  end if;
  if lower(new.username) <> lower(old.username) then
    if exists (select 1 from public.retired_usernames r where r.username_lower = lower(new.username) and r.user_id is distinct from new.id) then
      raise exception 'That username was used before and cannot be reused. Choose another.';
    end if;
    -- placeholder names (user + 8 hex) are not worth keeping
    if old.username !~ '^user[0-9a-f]{8}$' then
      insert into public.retired_usernames (username_lower, user_id) values (lower(old.username), old.id) on conflict do nothing;
    end if;
    delete from public.retired_usernames r where r.username_lower = lower(new.username) and r.user_id = new.id;
  end if;
  return new;
end $$;
create or replace function private.block_retired_username() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if exists (select 1 from public.retired_usernames r where r.username_lower = lower(new.username) and r.user_id is distinct from new.id) then
    raise exception 'That username was used before and cannot be reused. Choose another.';
  end if;
  return new;
end $$;
drop trigger if exists profiles_retire_username on public.profiles;
create trigger profiles_retire_username before update of username or delete on public.profiles for each row execute function private.retire_username();
drop trigger if exists profiles_block_retired on public.profiles;
create trigger profiles_block_retired before insert on public.profiles for each row execute function private.block_retired_username();

create or replace function public.username_available(p_username text)
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare u text := lower(btrim(coalesce(p_username, '')));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if u !~ '^[a-z0-9._-]{3,20}$' then return jsonb_build_object('available', false, 'reason', 'format'); end if;
  if u ~ '^user[0-9a-f]{8}$' or u in ('admin', 'treasurer', 'secretary', 'support', 'mychama', 'my.chama', 'help', 'system', 'root', 'mpesa', 'safaricom') then
    return jsonb_build_object('available', false, 'reason', 'reserved');
  end if;
  if exists (select 1 from public.profiles p where lower(p.username) = u and p.id <> auth.uid()) then return jsonb_build_object('available', false, 'reason', 'taken'); end if;
  if exists (select 1 from public.retired_usernames r where r.username_lower = u and r.user_id is distinct from auth.uid()) then return jsonb_build_object('available', false, 'reason', 'retired'); end if;
  return jsonb_build_object('available', true);
end $$;

create or replace function public.username_suggestions(p_full_name text)
returns text[] language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare parts text[]; f text; l text; c text; out text[] := '{}'; cands text[]; i int;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  parts := regexp_split_to_array(lower(regexp_replace(coalesce(p_full_name, ''), '[^A-Za-z ]', '', 'g')), '\s+');
  parts := array_remove(parts, '');
  if coalesce(array_length(parts, 1), 0) = 0 then return out; end if;
  f := left(parts[1], 12); l := left(coalesce(parts[array_length(parts, 1)], ''), 12);
  cands := array[f || '.' || l, f || l, left(f, 1) || l, f || '.' || left(l, 1), f || '_' || l, l || '.' || f];
  for i in 1..9 loop cands := cands || (f || (10 + floor(random() * 89))::int::text); end loop;
  foreach c in array cands loop
    c := left(regexp_replace(c, '^[._-]+|[._-]+$', '', 'g'), 20);
    if c ~ '^[a-z0-9._-]{3,20}$' and not c = any (out)
       and not exists (select 1 from public.profiles p where lower(p.username) = c)
       and not exists (select 1 from public.retired_usernames r where r.username_lower = c) then
      out := out || c;
    end if;
    exit when array_length(out, 1) >= 4;
  end loop;
  return out;
end $$;
revoke all on function public.username_available(text), public.username_suggestions(text) from public, anon;
grant execute on function public.username_available(text), public.username_suggestions(text) to authenticated;

-- CHECKS (inside BEGIN ... ROLLBACK):
-- select public.invitation_account('<a real pending token>');            -- ok, email, has_account
-- update public.profiles set username = 'newname1' where id = '<uid>';     -- old name goes to retired_usernames
-- then, as another user: select public.username_available('<old name>');  -- available false, reason retired
