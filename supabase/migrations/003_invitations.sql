-- 003_invitations.sql                      STATUS: DRAFT, not applied anywhere   (invitations last 48 hours by default)
-- Purpose: secure invitation system (Master Prompt 10). Requires 001 + 002.
-- Design: the raw token exists only (a) in the return value of the two *_internal functions, which only the
--   service role can execute (the send-invitation Edge Function), and (b) in the invitation email.
--   The table stores SHA-256(token) only. Verifying a token never changes state. Accepting needs a signed-in,
--   email-verified account whose email equals the invited email.
begin;

create table if not exists public.chama_invitations (
  id             uuid primary key default gen_random_uuid(),
  chama_id       text not null references public.chamas(id) on delete cascade,
  invited_email  text not null check (invited_email = lower(invited_email)),
  invited_by     uuid references auth.users(id) on delete set null,
  intended_role  text not null check (intended_role in ('member', 'secretary', 'treasurer')),
  member_id      text,
  token_hash     text not null unique,
  status         text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired', 'revoked')),
  expires_at     timestamptz not null,
  accepted_by    uuid references auth.users(id) on delete set null,
  accepted_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create unique index if not exists chama_invitations_one_pending on public.chama_invitations (chama_id, invited_email) where status = 'pending';
create index if not exists chama_invitations_chama on public.chama_invitations (chama_id, created_at desc);
drop trigger if exists chama_invitations_touch on public.chama_invitations;
create trigger chama_invitations_touch before update on public.chama_invitations for each row execute function public.touch_updated_at();

-- Locked table: no direct access for app roles. Everything goes through the functions below.
alter table public.chama_invitations enable row level security;
revoke all on public.chama_invitations from anon, authenticated;

-- ---------- create / resend (service role only; returns the raw token ONCE) ----------
create or replace function public.create_invitation_internal(p_actor uuid, cid text, p_email text, p_role text, p_member text default null, p_hours int default 48)
returns table (invitation_id uuid, raw_token text, expires_at timestamptz, chama_name text, inviter_name text)
language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare em text := lower(btrim(p_email)); tok text; inv uuid; exp timestamptz; mid text := nullif(btrim(p_member), '');
begin
  if p_actor is null or not public.chama_can_user(p_actor, cid, 'members.invite') then raise exception 'Only the treasurer can invite people'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  if em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(em) > 254 then raise exception 'That email address looks wrong'; end if;
  if p_hours < 1 or p_hours > 720 then raise exception 'Expiry must be between 1 and 720 hours'; end if;
  if exists (select 1 from public.chama_members m where m.chama_id = cid and m.email = em and m.status = 'active') then
    raise exception 'That person is already a member';
  end if;
  if mid is not null then
    if not exists (select 1 from public.chamas c, jsonb_array_elements(case when jsonb_typeof(c.data -> 'members') = 'array' then c.data -> 'members' else '[]'::jsonb end) e
                    where c.id = cid and e ->> 'id' = mid) then
      raise exception 'That member record was not found in this Chama';
    end if;
    if exists (select 1 from public.chama_members m where m.chama_id = cid and m.member_id = mid and m.email <> em and m.status in ('active', 'invited'))
       or exists (select 1 from public.chama_invitations i where i.chama_id = cid and i.member_id = mid and i.invited_email <> em and i.status = 'pending' and i.expires_at > now()) then
      raise exception 'That member record is already linked to another person';   -- never merge two people onto one record
    end if;
  end if;
  update public.chama_invitations i set status = 'expired' where i.chama_id = cid and i.invited_email = em and i.status = 'pending' and i.expires_at <= now();
  if exists (select 1 from public.chama_invitations i where i.chama_id = cid and i.invited_email = em and i.status = 'pending') then
    raise exception 'An invitation is already pending for this email. Resend it instead.';
  end if;
  tok := encode(extensions.gen_random_bytes(32), 'hex');                       -- 256 bits
  exp := now() + make_interval(hours => p_hours);
  insert into public.chama_invitations (chama_id, invited_email, invited_by, intended_role, member_id, token_hash, expires_at)
  values (cid, em, p_actor, p_role, mid, encode(extensions.digest(tok, 'sha256'), 'hex'), exp) returning id into inv;
  perform public.audit_log(cid, p_actor, 'invitation.create', em, jsonb_build_object('role', p_role, 'invitation', inv));
  return query select inv, tok, exp, (select c.name from public.chamas c where c.id = cid),
                      (select coalesce(p.full_name, p.username) from public.profiles p where p.id = p_actor);
end $$;

create or replace function public.resend_invitation_internal(p_actor uuid, p_id uuid, p_hours int default 48)
returns table (invitation_id uuid, raw_token text, expires_at timestamptz, chama_name text, inviter_name text, invited_email text, chama_id text, intended_role text)
language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare inv public.chama_invitations; tok text; exp timestamptz;
begin
  select * into inv from public.chama_invitations where id = p_id for update;
  if not found or p_actor is null or not public.chama_can_user(p_actor, inv.chama_id, 'members.invite') then raise exception 'Invitation not found'; end if;
  if inv.status not in ('pending', 'expired') then raise exception 'This invitation can no longer be resent (%).', inv.status; end if;
  if p_hours < 1 or p_hours > 720 then raise exception 'Expiry must be between 1 and 720 hours'; end if;
  tok := encode(extensions.gen_random_bytes(32), 'hex');
  exp := now() + make_interval(hours => p_hours);
  update public.chama_invitations i set token_hash = encode(extensions.digest(tok, 'sha256'), 'hex'),   -- old token stops working
         status = 'pending', expires_at = exp where i.id = p_id;
  perform public.audit_log(inv.chama_id, p_actor, 'invitation.resend', inv.invited_email, jsonb_build_object('invitation', p_id));
  return query select p_id, tok, exp, (select c.name from public.chamas c where c.id = inv.chama_id),
                      (select coalesce(p.full_name, p.username) from public.profiles p where p.id = p_actor), inv.invited_email, inv.chama_id, inv.intended_role;
end $$;

revoke all on function public.create_invitation_internal(uuid, text, text, text, text, int), public.resend_invitation_internal(uuid, uuid, int) from public, anon, authenticated;
grant execute on function public.create_invitation_internal(uuid, text, text, text, text, int), public.resend_invitation_internal(uuid, uuid, int) to service_role;

-- ---------- treasurer-facing: list and revoke (no token involved) ----------
create or replace function public.list_invitations(cid text)
returns table (id uuid, invited_email text, intended_role text, member_id text, status text, expires_at timestamptz, created_at timestamptz, accepted_at timestamptz)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.chama_can(cid, 'members.invite') then raise exception 'Only the treasurer can see invitations'; end if;
  return query select i.id, i.invited_email, i.intended_role, i.member_id,
                      case when i.status = 'pending' and i.expires_at <= now() then 'expired' else i.status end,
                      i.expires_at, i.created_at, i.accepted_at
                 from public.chama_invitations i where i.chama_id = cid order by i.created_at desc;
end $$;

create or replace function public.revoke_invitation(p_id uuid) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare inv public.chama_invitations;
begin
  select * into inv from public.chama_invitations where id = p_id for update;
  if not found or not public.chama_can(inv.chama_id, 'members.invite') then raise exception 'Invitation not found'; end if;
  if inv.status <> 'pending' then raise exception 'Only a pending invitation can be revoked'; end if;
  update public.chama_invitations set status = 'revoked' where id = p_id;
  perform public.audit_log(inv.chama_id, auth.uid(), 'invitation.revoke', inv.invited_email, jsonb_build_object('invitation', p_id));
end $$;

-- ---------- invitee-facing: verify (read-only) / accept / decline ----------
create or replace function public.verify_invitation(p_token text) returns jsonb
language plpgsql stable security definer set search_path = public, extensions, pg_temp as $$
declare inv public.chama_invitations; eff text; local_part text; dom text;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  select * into inv from public.chama_invitations where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  eff := case when inv.status = 'pending' and inv.expires_at <= now() then 'expired' else inv.status end;
  if eff <> 'pending' then return jsonb_build_object('ok', false, 'code', eff); end if;
  local_part := split_part(inv.invited_email, '@', 1); dom := split_part(inv.invited_email, '@', 2);
  return jsonb_build_object('ok', true, 'code', 'pending',
    'chama_name', (select c.name from public.chamas c where c.id = inv.chama_id),
    'role', inv.intended_role,
    'inviter_name', (select coalesce(p.full_name, p.username) from public.profiles p where p.id = inv.invited_by),
    'invited_at', inv.created_at, 'expires_at', inv.expires_at,
    'email_hint', left(local_part, 1) || '***@' || dom);
end $$;

create or replace function public.accept_invitation(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); inv public.chama_invitations; u_email text; u_confirmed timestamptz; cur public.chama_members;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  select * into inv from public.chama_invitations where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') for update;
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  if inv.status = 'pending' and inv.expires_at <= now() then
    update public.chama_invitations set status = 'expired' where id = inv.id;
    return jsonb_build_object('ok', false, 'code', 'expired');
  end if;
  if inv.status <> 'pending' then return jsonb_build_object('ok', false, 'code', inv.status); end if;

  select lower(u.email), u.email_confirmed_at into u_email, u_confirmed from auth.users u where u.id = uid;
  if u_email is distinct from inv.invited_email or u_confirmed is null then return jsonb_build_object('ok', false, 'code', 'wrong_email'); end if;

  select * into cur from public.chama_members m where m.chama_id = inv.chama_id and m.user_id = uid and m.status = 'active';
  if found then   -- already in this chama: consume the invitation, create nothing
    update public.chama_invitations set status = 'accepted', accepted_by = uid, accepted_at = now() where id = inv.id;
    return jsonb_build_object('ok', true, 'code', 'already_member', 'chama_id', inv.chama_id, 'role', cur.role);
  end if;

  insert into public.chama_members (chama_id, email, user_id, role, member_id, status)
  values (inv.chama_id, inv.invited_email, uid, inv.intended_role, inv.member_id, 'active')
  on conflict (chama_id, email) do update
     set user_id = uid, role = excluded.role, status = 'active',
         member_id = coalesce(excluded.member_id, public.chama_members.member_id);
  update public.chama_invitations set status = 'accepted', accepted_by = uid, accepted_at = now() where id = inv.id;
  perform public.audit_log(inv.chama_id, uid, 'invitation.accept', inv.invited_email, jsonb_build_object('invitation', inv.id, 'role', inv.intended_role));
  return jsonb_build_object('ok', true, 'code', 'ok', 'chama_id', inv.chama_id, 'role', inv.intended_role);
end $$;

create or replace function public.decline_invitation(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); inv public.chama_invitations; u_email text;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then return jsonb_build_object('ok', false, 'code', 'invalid'); end if;
  select * into inv from public.chama_invitations where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') for update;
  if not found or inv.status <> 'pending' then return jsonb_build_object('ok', false, 'code', coalesce(inv.status, 'invalid')); end if;
  select lower(u.email) into u_email from auth.users u where u.id = uid;
  if u_email is distinct from inv.invited_email then return jsonb_build_object('ok', false, 'code', 'wrong_email'); end if;
  update public.chama_invitations set status = 'declined' where id = inv.id;
  perform public.audit_log(inv.chama_id, uid, 'invitation.decline', inv.invited_email, jsonb_build_object('invitation', inv.id));
  return jsonb_build_object('ok', true, 'code', 'declined');
end $$;

revoke all on function public.list_invitations(text), public.revoke_invitation(uuid), public.accept_invitation(text), public.decline_invitation(text), public.verify_invitation(text) from public, anon;
grant execute on function public.list_invitations(text), public.revoke_invitation(uuid), public.accept_invitation(text), public.decline_invitation(text) to authenticated;
grant execute on function public.verify_invitation(text) to anon, authenticated;   -- possession of the 256-bit token is the credential

commit;

-- ROLLBACK NOTES: drop functions create_invitation_internal, resend_invitation_internal, list_invitations, revoke_invitation,
--   verify_invitation, accept_invitation, decline_invitation; drop table public.chama_invitations. Memberships created by accepted
--   invitations stay (they are normal chama_members rows).
