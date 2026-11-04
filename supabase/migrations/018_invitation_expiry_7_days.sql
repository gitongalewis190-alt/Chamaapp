-- 018_invitation_expiry_7_days.sql
-- Purpose: invitations last 7 days (168 hours) by default. Only the default argument changes; bodies are unchanged from 003.
-- Applied to staging and live on 2026-11-04. Also set INVITE_EXPIRY_HOURS=168 for the send-invitation Edge Function (see notes).
-- Rollback: recreate the functions with 'default 48' (003).
create or replace function public.create_invitation_internal(p_actor uuid, cid text, p_email text, p_role text, p_member text default null, p_hours int default 168)
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

create or replace function public.resend_invitation_internal(p_actor uuid, p_id uuid, p_hours int default 168)
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
