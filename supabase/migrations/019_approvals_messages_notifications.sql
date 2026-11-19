-- 019: join approvals, server notifications, chama messages (role tools), consent evidence, complete account purge.
-- Applied to project sgfvjsxmchohawhqraii on 2026-11-19. Safe to re-run.

------------------------------------------------------------------------------------------------
-- 0. Membership: a code no longer lets anyone straight in. It creates a request the treasurer decides.
------------------------------------------------------------------------------------------------
alter table public.chama_members drop constraint if exists chama_members_status_check;
alter table public.chama_members add constraint chama_members_status_check check (status in ('invited', 'pending', 'active', 'removed'));
alter table public.chama_members add column if not exists requested_at timestamptz;
alter table public.chama_members add column if not exists requested_member_id text;
alter table public.chama_members add column if not exists decided_by uuid;
alter table public.chama_members add column if not exists decided_at timestamptz;

-- secretaries keep the member register: they may see the member list and contact details
insert into public.role_permissions (role, permission) values ('secretary', 'members.view_list') on conflict do nothing;

-- one place that adds a person to the member list inside the Chama document
create or replace function public._add_member_record(p_cid text, p_name text)
returns text language plpgsql security definer set search_path = public, pg_temp as $$
declare mid text := 'm' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6);
        nm text := left(btrim(coalesce(nullif(btrim(p_name), ''), 'New member')), 120);
begin
  update public.chamas
     set data = jsonb_set(coalesce(data, '{}'::jsonb), '{members}',
           coalesce(case when jsonb_typeof(data -> 'members') = 'array' then data -> 'members' end, '[]'::jsonb)
           || jsonb_build_array(jsonb_build_object('id', mid, 'name', nm, 'shares', 1,
                                                   'joined', to_char(now() at time zone 'Africa/Nairobi', 'YYYY-MM'))))
   where id = p_cid;
  return mid;
end $$;
revoke all on function public._add_member_record(text, text) from public, anon, authenticated;

create or replace function public._person_name(p_user uuid, p_email text default null)
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(nullif(btrim(p.full_name), ''), nullif(p.username, ''), initcap(split_part(coalesce(p_email, ''), '@', 1)), 'Member')
    from (select 1) x left join public.profiles p on p.id = p_user;
$$;
revoke all on function public._person_name(uuid, text) from public, anon, authenticated;

------------------------------------------------------------------------------------------------
-- 1. Notifications kept on the server, one row per person, so everyone hears about joins, exits and messages
------------------------------------------------------------------------------------------------
create table if not exists public.chama_notifications (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  recipient uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null check (char_length(title) <= 160),
  body text check (body is null or char_length(body) <= 600),
  link text check (link is null or link ~ '^#/[A-Za-z0-9/_?=&.-]*$'),
  priority text not null default 'normal' check (priority in ('normal', 'important', 'action')),
  actor uuid,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists chama_notifications_recipient_idx on public.chama_notifications (recipient, created_at desc);
create index if not exists chama_notifications_chama_idx on public.chama_notifications (chama_id);
alter table public.chama_notifications enable row level security;
drop policy if exists notifications_read_own on public.chama_notifications;
create policy notifications_read_own on public.chama_notifications for select using (recipient = (select auth.uid()));

-- fan out one notification to the active people of a Chama (optionally only some roles, only one person, or everyone but one)
create or replace function public.notify_chama(p_cid text, p_kind text, p_title text, p_body text default null, p_link text default null,
  p_roles text[] default null, p_only uuid default null, p_except uuid default null, p_priority text default 'normal', p_data jsonb default '{}'::jsonb)
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare n int;
begin
  insert into public.chama_notifications (chama_id, recipient, kind, title, body, link, priority, actor, data)
  select p_cid, m.user_id, p_kind, left(p_title, 160), left(p_body, 600), p_link, p_priority, auth.uid(), coalesce(p_data, '{}'::jsonb)
    from public.chama_members m
   where m.chama_id = p_cid and m.user_id is not null
     and (m.status = 'active' or (p_only is not null and m.user_id = p_only))
     and (p_roles is null or m.role = any (p_roles))
     and (p_only is null or m.user_id = p_only)
     and (p_except is null or m.user_id <> p_except);
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.notify_chama(text, text, text, text, text, text[], uuid, uuid, text, jsonb) from public, anon, authenticated;

create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  update public.chama_notifications set read_at = now()
   where recipient = auth.uid() and read_at is null and (p_ids is null or id = any (p_ids));
  get diagnostics n = row_count;
  return n;
end $$;

------------------------------------------------------------------------------------------------
-- 2. Join requests
------------------------------------------------------------------------------------------------
create or replace function public.preview_invite_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); norm text; inv public.chama_invite_codes; ch public.chamas; recent int; mem public.chama_members; tname text; mcount int;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select count(*) into recent from public.chama_invite_attempts a where a.user_id = uid and a.ok = false and a.attempted_at > now() - interval '10 minutes';
  if recent >= 5 then return jsonb_build_object('ok', false, 'error', 'Too many tries. Wait 10 minutes, then try again.'); end if;
  norm := public.invite_code_normalise(p_code);
  if norm !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{10}$' then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, false);
    return jsonb_build_object('ok', false, 'error', 'That code does not look right. Check it and try again.');
  end if;
  select * into inv from public.chama_invite_codes c where c.code_hash = encode(extensions.digest(norm, 'sha256'), 'hex');
  if not found then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, false);
    return jsonb_build_object('ok', false, 'error', 'That code was not found.');
  end if;
  if inv.revoked_at is not null then return jsonb_build_object('ok', false, 'error', 'This code was cancelled.'); end if;
  if inv.expires_at <= now() then return jsonb_build_object('ok', false, 'error', 'This code has expired. Ask for a new one.'); end if;
  select * into ch from public.chamas where id = inv.chama_id;
  select * into mem from public.chama_members m where m.chama_id = inv.chama_id and m.user_id = uid and m.status in ('active', 'pending');
  if mem.id is null and inv.uses >= inv.max_uses then return jsonb_build_object('ok', false, 'error', 'This code has been used up. Ask for a new one.'); end if;
  select public._person_name(m.user_id, m.email) into tname from public.chama_members m
   where m.chama_id = inv.chama_id and m.role = 'treasurer' and m.status = 'active' order by m.created_at limit 1;
  select count(*) into mcount from public.chama_members m where m.chama_id = inv.chama_id and m.status = 'active';
  return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag,
    'role', inv.role, 'already_member', coalesce(mem.status = 'active', false), 'pending', coalesce(mem.status = 'pending', false), 'expires_at', inv.expires_at,
    'treasurer_name', tname, 'people', mcount,
    'members_listed', jsonb_array_length(public.jarr(ch.data -> 'members')),
    'contribution', public.jnum(ch.data -> 'chama' -> 'contribution'),
    'listed', inv.listed_member_id is not null);
end $$;

create or replace function public.redeem_invite_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); em text; norm text; inv public.chama_invite_codes; ch public.chamas; mem public.chama_members; recent int; fail text; nm text;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select lower(u.email) into em from auth.users u where u.id = uid and u.email_confirmed_at is not null;
  if em is null then raise exception 'Confirm your email first'; end if;
  select count(*) into recent from public.chama_invite_attempts a where a.user_id = uid and a.ok = false and a.attempted_at > now() - interval '10 minutes';
  if recent >= 5 then return jsonb_build_object('ok', false, 'error', 'Too many tries. Wait 10 minutes, then try again.'); end if;
  norm := public.invite_code_normalise(p_code);
  if norm !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{10}$' then fail := 'That code does not look right. Check it and try again.';
  else
    select * into inv from public.chama_invite_codes c where c.code_hash = encode(extensions.digest(norm, 'sha256'), 'hex') for update;
    if not found then fail := 'That code was not found.';
    elsif inv.revoked_at is not null then fail := 'This code was cancelled.';
    elsif inv.expires_at <= now() then fail := 'This code has expired. Ask for a new one.';
    end if;
  end if;
  if fail is not null then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, false);
    return jsonb_build_object('ok', false, 'error', fail);
  end if;
  select * into ch from public.chamas where id = inv.chama_id;
  select * into mem from public.chama_members m where m.chama_id = inv.chama_id and m.email = em for update;
  if mem.id is not null and mem.status = 'active' then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, true);
    return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', mem.role, 'already_member', true);
  end if;
  if mem.id is not null and mem.status = 'pending' then
    return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', mem.role, 'pending', true);
  end if;
  if inv.uses >= inv.max_uses then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, false);
    return jsonb_build_object('ok', false, 'error', 'This code has been used up. Ask for a new one.');
  end if;
  if mem.id is not null then
    update public.chama_members set user_id = uid, status = 'pending', role = inv.role, requested_member_id = inv.listed_member_id,
           requested_at = now(), decided_by = null, decided_at = null where id = mem.id;
  else
    insert into public.chama_members (chama_id, email, user_id, role, status, requested_member_id, requested_at)
      values (inv.chama_id, em, uid, inv.role, 'pending', inv.listed_member_id, now());
  end if;
  update public.chama_invite_codes set uses = uses + 1 where id = inv.id;
  insert into public.chama_invite_redemptions (code_id, user_id) values (inv.id, uid);
  insert into public.chama_invite_attempts (user_id, ok) values (uid, true);
  perform public.audit_log(inv.chama_id, uid, 'join.request', em, jsonb_build_object('role', inv.role, 'code', inv.id));
  nm := public._person_name(uid, em);
  perform public.notify_chama(inv.chama_id, 'join_request', nm || ' wants to join',
    'Asked to join as ' || initcap(inv.role) || ' with an invite code. Approve or decline.', '#/requests',
    case when inv.role = 'treasurer' then array['treasurer'] else array['treasurer', 'secretary'] end, null, uid, 'action',
    jsonb_build_object('email', em, 'role', inv.role));
  return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', inv.role, 'pending', true);
end $$;

create or replace function public.list_join_requests(p_cid text)
returns table(id uuid, email text, name text, username text, phone text, photo text, role text, requested_member_id text, requested_at timestamptz)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare my_role text;
begin
  select m.role into my_role from public.chama_members m where m.chama_id = p_cid and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null or my_role = 'member' then return; end if;
  return query
    select m.id, m.email, public._person_name(m.user_id, m.email), p.username, p.phone, p.photo, m.role, m.requested_member_id, m.requested_at
      from public.chama_members m left join public.profiles p on p.id = m.user_id
     where m.chama_id = p_cid and m.status = 'pending' and (my_role = 'treasurer' or m.role <> 'treasurer')
     order by m.requested_at nulls last;
end $$;

-- p_record: 'new' adds them to the member list, 'none' keeps them as an officer only, anything else is an existing member record id
create or replace function public.decide_join_request(p_id uuid, p_approve boolean, p_role text default null, p_record text default 'new', p_name text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare req public.chama_members; my_role text; fin_role text; mid text; nm text; cname text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into req from public.chama_members where id = p_id for update;
  if not found or req.status <> 'pending' then raise exception 'This request was already handled'; end if;
  select m.role into my_role from public.chama_members m where m.chama_id = req.chama_id and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null or my_role = 'member' then raise exception 'Only the treasurer or secretary can decide requests'; end if;
  fin_role := coalesce(nullif(p_role, ''), req.role);
  if fin_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  if my_role = 'secretary' and (req.role = 'treasurer' or fin_role = 'treasurer') then raise exception 'Only the treasurer can approve a treasurer'; end if;
  select name into cname from public.chamas where id = req.chama_id;
  nm := public._person_name(req.user_id, req.email);
  if not p_approve then
    update public.chama_members set status = 'removed', decided_by = auth.uid(), decided_at = now() where id = p_id;
    perform public.audit_log(req.chama_id, auth.uid(), 'join.decline', req.email, '{}'::jsonb);
    perform public.notify_chama(req.chama_id, 'join_declined', 'Your request to join ' || coalesce(cname, 'the Chama') || ' was declined',
      'Ask the treasurer if you think this is a mistake.', null, null, req.user_id, null, 'important');
    return jsonb_build_object('ok', true, 'approved', false);
  end if;
  if p_record is null or p_record = 'new' then
    mid := coalesce(req.requested_member_id, public._add_member_record(req.chama_id, coalesce(nullif(btrim(p_name), ''), nm)));
  elsif p_record = 'none' then mid := null;
  else
    if not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = req.chama_id and e ->> 'id' = p_record) then
      raise exception 'That member record is not in this Chama';
    end if;
    if exists (select 1 from public.chama_members m where m.chama_id = req.chama_id and m.member_id = p_record and m.status = 'active' and m.id <> p_id) then
      raise exception 'That member record already belongs to someone else';
    end if;
    mid := p_record;
  end if;
  update public.chama_members set status = 'active', role = fin_role, member_id = mid, joined_at = now(), decided_by = auth.uid(), decided_at = now(), requested_member_id = null
   where id = p_id;
  perform public.audit_log(req.chama_id, auth.uid(), 'join.approve', req.email, jsonb_build_object('role', fin_role, 'member_id', mid));
  perform public.notify_chama(req.chama_id, 'join_approved', 'Welcome to ' || coalesce(cname, 'the Chama'),
    'You were approved as ' || initcap(fin_role) || '. You can open the Chama now.', '#/home', null, req.user_id, null, 'important');
  perform public.notify_chama(req.chama_id, 'member_joined', nm || ' joined the Chama', 'Joined as ' || initcap(fin_role) || '.', '#/members', null, null, req.user_id);
  return jsonb_build_object('ok', true, 'approved', true, 'member_id', mid, 'role', fin_role);
end $$;

create or replace function public.my_join_requests()
returns table(chama_id text, chama_name text, display_tag text, role text, requested_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select m.chama_id, c.name, c.display_tag, m.role, m.requested_at from public.chama_members m join public.chamas c on c.id = m.chama_id
   where m.user_id = auth.uid() and m.status = 'pending' order by m.requested_at desc;
$$;

create or replace function public.cancel_join_request(p_cid text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  update public.chama_members set status = 'removed', decided_by = auth.uid(), decided_at = now()
   where chama_id = p_cid and user_id = auth.uid() and status = 'pending';
  update public.chama_notifications set read_at = coalesce(read_at, now())
   where chama_id = p_cid and kind = 'join_request' and data ->> 'email' = (select lower(email) from auth.users where id = auth.uid());
end $$;

-- the treasurer can put someone who is already in (but not on the member list) onto the list in one tap
create or replace function public.link_member_record(p_cid text, p_email text, p_record text default 'new', p_name text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare acc public.chama_members; mid text; my_role text;
begin
  select m.role into my_role from public.chama_members m where m.chama_id = p_cid and m.user_id = auth.uid() and m.status = 'active';
  if my_role is distinct from 'treasurer' then raise exception 'Only the treasurer can change the member list'; end if;
  select * into acc from public.chama_members where chama_id = p_cid and email = lower(btrim(p_email)) and status = 'active' for update;
  if not found then raise exception 'That person is not active in this Chama'; end if;
  if p_record is null or p_record = 'new' then mid := public._add_member_record(p_cid, coalesce(nullif(btrim(p_name), ''), public._person_name(acc.user_id, acc.email)));
  elsif p_record = 'none' then mid := null;
  else
    if not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = p_cid and e ->> 'id' = p_record) then
      raise exception 'That member record is not in this Chama'; end if;
    if exists (select 1 from public.chama_members m where m.chama_id = p_cid and m.member_id = p_record and m.status = 'active' and m.id <> acc.id) then
      raise exception 'That member record already belongs to someone else'; end if;
    mid := p_record;
  end if;
  update public.chama_members set member_id = mid where id = acc.id;
  perform public.audit_log(p_cid, auth.uid(), 'member.link', acc.email, jsonb_build_object('member_id', mid));
  if mid is not null then
    perform public.notify_chama(p_cid, 'member_linked', 'You are on the member list', 'Your contributions, loans and fines now show on your profile.', '#/me', null, acc.user_id);
  end if;
  return jsonb_build_object('ok', true, 'member_id', mid);
end $$;

------------------------------------------------------------------------------------------------
-- 3. Email invitations: "new" adds the person to the member list when they accept
------------------------------------------------------------------------------------------------
create or replace function public.create_invitation_internal(p_actor uuid, cid text, p_email text, p_role text, p_member text default null, p_hours integer default 168)
returns table(invitation_id uuid, raw_token text, expires_at timestamptz, chama_name text, inviter_name text)
language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare em text := lower(btrim(p_email)); tok text; inv uuid; exp timestamptz; mid text := nullif(btrim(p_member), '');
begin
  if p_actor is null or not public.chama_can_user(p_actor, cid, 'members.invite') then raise exception 'Only the treasurer can invite people'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  if em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(em) > 254 then raise exception 'That email address looks wrong'; end if;
  if p_hours < 1 or p_hours > 720 then raise exception 'Expiry must be between 1 and 720 hours'; end if;
  if exists (select 1 from public.chama_members m where m.chama_id = cid and m.email = em and m.status = 'active') then raise exception 'That person is already a member'; end if;
  if mid is not null and mid <> 'new' then
    if not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = cid and e ->> 'id' = mid) then
      raise exception 'That member record was not found in this Chama';
    end if;
    if exists (select 1 from public.chama_members m where m.chama_id = cid and m.member_id = mid and m.email <> em and m.status in ('active', 'invited'))
       or exists (select 1 from public.chama_invitations i where i.chama_id = cid and i.member_id = mid and i.invited_email <> em and i.status = 'pending' and i.expires_at > now()) then
      raise exception 'That member record is already linked to another person';
    end if;
  end if;
  update public.chama_invitations i set status = 'expired' where i.chama_id = cid and i.invited_email = em and i.status = 'pending' and i.expires_at <= now();
  if exists (select 1 from public.chama_invitations i where i.chama_id = cid and i.invited_email = em and i.status = 'pending') then
    raise exception 'An invitation is already pending for this email. Resend it instead.';
  end if;
  tok := encode(extensions.gen_random_bytes(32), 'hex');
  exp := now() + make_interval(hours => p_hours);
  insert into public.chama_invitations (chama_id, invited_email, invited_by, intended_role, member_id, token_hash, expires_at)
  values (cid, em, p_actor, p_role, mid, encode(extensions.digest(tok, 'sha256'), 'hex'), exp) returning id into inv;
  perform public.audit_log(cid, p_actor, 'invitation.create', em, jsonb_build_object('role', p_role, 'invitation', inv));
  return query select inv, tok, exp, (select c.name from public.chamas c where c.id = cid),
                      (select coalesce(p.full_name, p.username) from public.profiles p where p.id = p_actor);
end $$;

create or replace function public.accept_invitation(p_token text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); inv public.chama_invitations; u_email text; u_confirmed timestamptz; cur public.chama_members; mid text; nm text;
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
  if found then
    update public.chama_invitations set status = 'accepted', accepted_by = uid, accepted_at = now() where id = inv.id;
    return jsonb_build_object('ok', true, 'code', 'already_member', 'chama_id', inv.chama_id, 'role', cur.role);
  end if;
  nm := public._person_name(uid, u_email);
  mid := case when inv.member_id = 'new' then public._add_member_record(inv.chama_id, nm) else inv.member_id end;
  insert into public.chama_members (chama_id, email, user_id, role, member_id, status, joined_at)
  values (inv.chama_id, inv.invited_email, uid, inv.intended_role, mid, 'active', now())
  on conflict (chama_id, email) do update set user_id = uid, role = excluded.role, status = 'active', joined_at = now(),
         member_id = coalesce(excluded.member_id, public.chama_members.member_id);
  update public.chama_invitations set status = 'accepted', accepted_by = uid, accepted_at = now() where id = inv.id;
  perform public.audit_log(inv.chama_id, uid, 'invitation.accept', inv.invited_email, jsonb_build_object('invitation', inv.id, 'role', inv.intended_role));
  perform public.notify_chama(inv.chama_id, 'member_joined', nm || ' joined the Chama', 'Accepted an email invitation as ' || initcap(inv.intended_role) || '.', '#/members', null, null, uid);
  return jsonb_build_object('ok', true, 'code', 'ok', 'chama_id', inv.chama_id, 'role', inv.intended_role);
end $$;

------------------------------------------------------------------------------------------------
-- 4. Leaving, removal, roles and hand-over now tell everyone
------------------------------------------------------------------------------------------------
create or replace function public.leave_chama(cid text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members; nm text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = cid and user_id = auth.uid() and status = 'active' for update;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if me.role = 'treasurer' and not exists (select 1 from public.chama_members x where x.chama_id = cid and x.role = 'treasurer' and x.status = 'active' and x.email <> me.email) then
    raise exception 'You are the only treasurer. Hand the Chama to someone else first.';
  end if;
  update public.chama_members set status = 'removed' where chama_id = cid and email = me.email;
  perform public.audit_log(cid, auth.uid(), 'member.leave', me.email, '{}');
  nm := public._person_name(me.user_id, me.email);
  perform public.notify_chama(cid, 'member_left', nm || ' left the Chama', 'Their past records stay in the books.', '#/members', null, null, auth.uid(), 'important');
end $$;

create or replace function public.remove_member(cid text, p_email text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); tgt public.chama_members; nm text; cname text;
begin
  if not public.chama_can(cid, 'members.remove') then raise exception 'Only the treasurer can remove access'; end if;
  if em = lower(auth.jwt() ->> 'email') then raise exception 'You cannot remove your own access'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em;
  update public.chama_members set status = 'removed' where chama_id = cid and email = em;
  perform public.audit_log(cid, auth.uid(), 'member.remove', em, '{}');
  if tgt.status = 'active' then
    nm := public._person_name(tgt.user_id, tgt.email); select name into cname from public.chamas where id = cid;
    perform public.notify_chama(cid, 'member_removed', nm || ' no longer has access', 'The treasurer removed their access. Their records are kept.', '#/members', null, null, tgt.user_id, 'important');
    if tgt.user_id is not null then
      perform public.notify_chama(cid, 'access_removed', 'Your access to ' || coalesce(cname, 'a Chama') || ' was removed', 'Your past records stay with the Chama.', null, null, tgt.user_id, null, 'important');
    end if;
  end if;
end $$;

create or replace function public.set_member_role(cid text, p_email text, p_role text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare tgt public.chama_members; em text := lower(btrim(p_email));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.chama_can(cid, 'roles.assign') then raise exception 'Only the treasurer can change roles'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member'; end if;
  if tgt.user_id = auth.uid() and tgt.role <> p_role then raise exception 'You cannot change your own role'; end if;
  if tgt.role = p_role then return; end if;
  update public.chama_members set role = p_role where chama_id = cid and email = em;
  perform public.audit_log(cid, auth.uid(), 'role.change', em, jsonb_build_object('from', tgt.role, 'to', p_role));
  perform public.notify_chama(cid, 'role_changed', 'You are now ' || initcap(p_role), 'Your role changed from ' || initcap(tgt.role) || '. What you can see and do has changed with it.', '#/home', null, tgt.user_id, null, 'important');
  perform public.notify_chama(cid, 'role_changed_all', public._person_name(tgt.user_id, tgt.email) || ' is now ' || initcap(p_role), null, '#/members', null, null, tgt.user_id);
end $$;

create or replace function public.transfer_ownership(cid text, p_email text, p_stay_as_treasurer boolean default false)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); me public.chama_members; tgt public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = cid and user_id = auth.uid() and status = 'active' and role = 'treasurer' for update;
  if not found or not public.chama_can(cid, 'roles.assign') then raise exception 'Only a treasurer can hand over the Chama'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member'; end if;
  if tgt.user_id = auth.uid() then raise exception 'Choose someone else'; end if;
  update public.chama_members set role = 'treasurer' where chama_id = cid and email = em;
  if not p_stay_as_treasurer then update public.chama_members set role = 'member' where chama_id = cid and email = me.email; end if;
  perform public.audit_log(cid, auth.uid(), 'ownership.transfer', em, jsonb_build_object('stay_as_treasurer', p_stay_as_treasurer));
  perform public.notify_chama(cid, 'ownership', public._person_name(tgt.user_id, tgt.email) || ' is now the treasurer', 'The books were handed over.', '#/home', null, null, null, 'important');
end $$;

------------------------------------------------------------------------------------------------
-- 5. Messages: one group conversation per Chama plus private conversations, with tools per role
--    member:    text (group, or privately to an officer), vote, RSVP
--    secretary: + announcements, meeting notices, minutes and resolutions, polls, pin; private to anyone
--    treasurer: + payment requests and statements; private to anyone
------------------------------------------------------------------------------------------------
create table if not exists public.chama_messages (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  sender uuid references auth.users(id) on delete set null,
  sender_name text not null,
  sender_role text not null,
  recipient uuid references auth.users(id) on delete cascade,
  kind text not null check (kind in ('text', 'announcement', 'meeting', 'minutes', 'poll', 'payment_request', 'statement', 'system')),
  body text not null default '' check (char_length(body) <= 4000),
  meta jsonb not null default '{}'::jsonb check (octet_length(meta::text) <= 16000),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
create index if not exists chama_messages_chama_idx on public.chama_messages (chama_id, created_at desc);
create index if not exists chama_messages_recipient_idx on public.chama_messages (recipient) where recipient is not null;
create index if not exists chama_messages_sender_idx on public.chama_messages (sender);
alter table public.chama_messages enable row level security;
drop policy if exists messages_read on public.chama_messages;
create policy messages_read on public.chama_messages for select using (
  public.is_active_member(chama_id) and (recipient is null or recipient = (select auth.uid()) or sender = (select auth.uid())));

create table if not exists public.chama_message_responses (
  message_id uuid not null references public.chama_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chama_id text not null references public.chamas(id) on delete cascade,
  choice text not null check (char_length(choice) <= 40),
  name text,
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);
create index if not exists chama_message_responses_chama_idx on public.chama_message_responses (chama_id);
alter table public.chama_message_responses enable row level security;
drop policy if exists responses_read on public.chama_message_responses;
create policy responses_read on public.chama_message_responses for select using (public.is_active_member(chama_id));

create table if not exists public.chama_message_reads (
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  thread text not null,
  last_read_at timestamptz not null default now(),
  primary key (chama_id, user_id, thread)
);
alter table public.chama_message_reads enable row level security;
drop policy if exists reads_own on public.chama_message_reads;
create policy reads_own on public.chama_message_reads for select using (user_id = (select auth.uid()));

create or replace function public.chat_contacts(p_cid text)
returns table(user_id uuid, name text, role text, photo text, member_id text, can_message boolean)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare my_role text;
begin
  select m.role into my_role from public.chama_members m where m.chama_id = p_cid and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null then raise exception 'You are not a member of this Chama'; end if;
  return query
    select m.user_id, public._person_name(m.user_id, m.email), m.role, p.photo, m.member_id,
           (my_role <> 'member' or m.role <> 'member')
      from public.chama_members m left join public.profiles p on p.id = m.user_id
     where m.chama_id = p_cid and m.status = 'active' and m.user_id is not null and m.user_id <> auth.uid()
     order by case m.role when 'treasurer' then 0 when 'secretary' then 1 else 2 end, 2;
end $$;

create or replace function public.send_chama_message(p_cid text, p_kind text, p_body text, p_meta jsonb default '{}'::jsonb, p_recipient uuid default null)
returns public.chama_messages language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members; tgt public.chama_members; msg public.chama_messages; nm text; b text := btrim(coalesce(p_body, '')); meta jsonb := coalesce(p_meta, '{}'::jsonb);
        title text; recent int;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active';
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if p_kind not in ('text', 'announcement', 'meeting', 'minutes', 'poll', 'payment_request', 'statement') then raise exception 'Unknown message type'; end if;
  if p_kind in ('announcement', 'meeting', 'minutes', 'poll') and me.role = 'member' then raise exception 'Only the treasurer or secretary can post this'; end if;
  if p_kind in ('payment_request', 'statement') and me.role <> 'treasurer' then raise exception 'Only the treasurer can send this'; end if;
  if p_kind = 'text' and b = '' then raise exception 'Write a message first'; end if;
  if char_length(b) > 4000 then raise exception 'That message is too long'; end if;
  if jsonb_typeof(meta) <> 'object' then raise exception 'Bad message details'; end if;
  select count(*) into recent from public.chama_messages where sender = auth.uid() and created_at > now() - interval '1 minute';
  if recent >= 20 then raise exception 'You are sending messages too fast. Wait a minute.'; end if;
  if p_recipient is not null then
    if p_kind in ('announcement', 'meeting', 'minutes', 'poll') then raise exception 'This goes to the whole group'; end if;
    if p_recipient = auth.uid() then raise exception 'Choose someone else'; end if;
    select * into tgt from public.chama_members where chama_id = p_cid and user_id = p_recipient and status = 'active';
    if not found then raise exception 'That person is not in this Chama'; end if;
    if me.role = 'member' and tgt.role = 'member' then raise exception 'Members can message the treasurer or secretary privately'; end if;
  end if;
  if p_kind = 'poll' then
    if jsonb_typeof(meta -> 'options') <> 'array' or jsonb_array_length(meta -> 'options') < 2 or jsonb_array_length(meta -> 'options') > 8 then
      raise exception 'A poll needs 2 to 8 options'; end if;
    if b = '' then raise exception 'Write the poll question'; end if;
  elsif p_kind = 'meeting' then
    if coalesce(meta ->> 'when', '') = '' then raise exception 'Choose the meeting date and time'; end if;
  elsif p_kind = 'payment_request' then
    if coalesce(public.jnum(meta -> 'amount'), 0) <= 0 then raise exception 'Enter the amount'; end if;
  end if;
  nm := public._person_name(auth.uid(), me.email);
  insert into public.chama_messages (chama_id, sender, sender_name, sender_role, recipient, kind, body, meta, pinned)
  values (p_cid, auth.uid(), nm, me.role, p_recipient, p_kind, b, meta, p_kind in ('announcement') and coalesce((meta ->> 'pin')::boolean, true))
  returning * into msg;
  insert into public.chama_message_reads (chama_id, user_id, thread, last_read_at)
  values (p_cid, auth.uid(), coalesce(p_recipient::text, 'group'), now())
  on conflict (chama_id, user_id, thread) do update set last_read_at = excluded.last_read_at;
  if p_kind <> 'text' then
    title := case p_kind when 'announcement' then 'Announcement from ' || nm
                         when 'meeting' then 'Meeting called: ' || coalesce(nullif(meta ->> 'title', ''), 'Chama meeting')
                         when 'minutes' then 'Minutes shared: ' || coalesce(nullif(meta ->> 'title', ''), 'last meeting')
                         when 'poll' then 'Vote: ' || left(b, 100)
                         when 'payment_request' then 'Payment request: KES ' || to_char(public.jnum(meta -> 'amount'), 'FM999,999,990')
                         else 'Statement from the treasurer' end;
    perform public.notify_chama(p_cid, 'message_' || p_kind, title, left(coalesce(nullif(b, ''), meta ->> 'title', ''), 200),
      '#/chat/' || coalesce(p_recipient::text, 'group'), null, p_recipient, auth.uid(),
      case when p_kind in ('payment_request', 'meeting', 'poll') then 'important' else 'normal' end, jsonb_build_object('message', msg.id));
  end if;
  return msg;
end $$;

create or replace function public.respond_chama_message(p_id uuid, p_choice text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; ok boolean := false;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into msg from public.chama_messages where id = p_id and deleted_at is null;
  if not found or not public.is_active_member(msg.chama_id) or not (msg.recipient is null or msg.recipient = auth.uid() or msg.sender = auth.uid()) then
    raise exception 'Message not found'; end if;
  if msg.kind = 'poll' then
    if coalesce((msg.meta ->> 'closed')::boolean, false) or (msg.meta ? 'closes_at' and (msg.meta ->> 'closes_at')::timestamptz < now()) then raise exception 'This poll is closed'; end if;
    ok := p_choice ~ '^[0-9]$' and p_choice::int < jsonb_array_length(msg.meta -> 'options');
  elsif msg.kind = 'meeting' then ok := p_choice in ('yes', 'no', 'maybe');
  elsif msg.kind = 'payment_request' then ok := p_choice in ('paid', 'later');
  end if;
  if not ok then raise exception 'That answer is not allowed'; end if;
  insert into public.chama_message_responses (message_id, user_id, chama_id, choice, name)
  values (p_id, auth.uid(), msg.chama_id, p_choice, public._person_name(auth.uid(), null))
  on conflict (message_id, user_id) do update set choice = excluded.choice, created_at = now();
  if msg.kind = 'payment_request' and p_choice = 'paid' then
    perform public.notify_chama(msg.chama_id, 'payment_claimed', public._person_name(auth.uid(), null) || ' says they paid',
      'Answer to your payment request of KES ' || to_char(public.jnum(msg.meta -> 'amount'), 'FM999,999,990') || '. Check and record it.', '#/contributions', array['treasurer'], null, auth.uid(), 'action');
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- the secretary (or treasurer) marks who attended a meeting. Stored on the meeting itself.
create or replace function public.record_attendance(p_id uuid, p_attendance jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; my_role text;
begin
  select * into msg from public.chama_messages where id = p_id and kind = 'meeting' and deleted_at is null for update;
  if not found then raise exception 'Meeting not found'; end if;
  select m.role into my_role from public.chama_members m where m.chama_id = msg.chama_id and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null or my_role = 'member' then raise exception 'Only the secretary or treasurer keeps the register'; end if;
  if jsonb_typeof(p_attendance) <> 'object' then raise exception 'Bad register'; end if;
  update public.chama_messages set meta = meta || jsonb_build_object('attendance', p_attendance, 'register_by', public._person_name(auth.uid(), null), 'register_at', now()), edited_at = now()
   where id = p_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.close_poll(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; my_role text;
begin
  select * into msg from public.chama_messages where id = p_id and kind = 'poll' for update;
  if not found then raise exception 'Poll not found'; end if;
  select m.role into my_role from public.chama_members m where m.chama_id = msg.chama_id and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null or (my_role = 'member') then raise exception 'Only the treasurer or secretary can close a poll'; end if;
  update public.chama_messages set meta = meta || jsonb_build_object('closed', true), edited_at = now() where id = p_id;
end $$;

create or replace function public.pin_chama_message(p_id uuid, p_pin boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; my_role text;
begin
  select * into msg from public.chama_messages where id = p_id;
  if not found then raise exception 'Message not found'; end if;
  select m.role into my_role from public.chama_members m where m.chama_id = msg.chama_id and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null or my_role = 'member' then raise exception 'Only the treasurer or secretary can pin'; end if;
  if msg.recipient is not null then raise exception 'Only group messages can be pinned'; end if;
  update public.chama_messages set pinned = p_pin where id = p_id;
end $$;

create or replace function public.delete_chama_message(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; my_role text;
begin
  select * into msg from public.chama_messages where id = p_id for update;
  if not found then raise exception 'Message not found'; end if;
  select m.role into my_role from public.chama_members m where m.chama_id = msg.chama_id and m.user_id = auth.uid() and m.status = 'active';
  if my_role is null then raise exception 'Message not found'; end if;
  if msg.sender is distinct from auth.uid() and my_role <> 'treasurer' then raise exception 'You can delete only your own messages'; end if;
  if msg.kind = 'minutes' and my_role = 'member' then raise exception 'Minutes are part of the record'; end if;
  update public.chama_messages set deleted_at = now(), body = '', meta = jsonb_build_object('deleted_by', public._person_name(auth.uid(), null)), pinned = false where id = p_id;
end $$;

create or replace function public.mark_thread_read(p_cid text, p_thread text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.is_active_member(p_cid) then return; end if;
  if p_thread !~ '^(group|[0-9a-f-]{36})$' then raise exception 'Bad thread'; end if;
  insert into public.chama_message_reads (chama_id, user_id, thread, last_read_at) values (p_cid, auth.uid(), p_thread, now())
  on conflict (chama_id, user_id, thread) do update set last_read_at = now();
end $$;

-- unread count per conversation for the badge on the Chat tab
create or replace function public.chat_unread(p_cid text)
returns table(thread text, unread integer, last_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  with mine as (
    select case when m.recipient is null then 'group' when m.sender = auth.uid() then m.recipient::text else m.sender::text end as thread, m.created_at, m.sender
      from public.chama_messages m
     where m.chama_id = p_cid and public.is_active_member(p_cid) and m.deleted_at is null
       and (m.recipient is null or m.recipient = auth.uid() or m.sender = auth.uid()))
  select x.thread, count(*) filter (where x.sender is distinct from auth.uid() and x.created_at > coalesce(r.last_read_at, '-infinity'))::int, max(x.created_at)
    from mine x left join public.chama_message_reads r on r.chama_id = p_cid and r.user_id = auth.uid() and r.thread = x.thread
   group by x.thread;
$$;

-- live updates (Row Level Security still applies to what each person receives)
do $$ begin
  begin alter publication supabase_realtime add table public.chama_messages; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.chama_message_responses; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.chama_notifications; exception when duplicate_object then null; end;
end $$;

------------------------------------------------------------------------------------------------
-- 6. Consent evidence: when, which version, how, from where. Kept after an account is deleted (legal claims).
------------------------------------------------------------------------------------------------
alter table public.consent_records add column if not exists method text;
alter table public.consent_records add column if not exists ip text;
alter table public.consent_records add column if not exists user_agent text;
alter table public.consent_records add column if not exists locale text;
alter table public.consent_records add column if not exists timezone text;
alter table public.consent_records add column if not exists client_time timestamptz;
alter table public.consent_records add column if not exists context jsonb not null default '{}'::jsonb;
alter table public.consent_records add column if not exists email_hash text;
alter table public.consent_records drop constraint if exists consent_records_user_id_fkey;
alter table public.consent_records alter column user_id drop not null;
alter table public.consent_records add constraint consent_records_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

drop function if exists public.record_consent(text, text);
create or replace function public.record_consent(p_policy_version text, p_app_version text default null, p_method text default null,
  p_locale text default null, p_timezone text default null, p_client_time timestamptz default null, p_context jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); hdr json; ip text; ua text; em text;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if p_policy_version is null or char_length(p_policy_version) > 40 then raise exception 'Policy version missing'; end if;
  begin hdr := current_setting('request.headers', true)::json; exception when others then hdr := null; end;
  ip := left(btrim(split_part(coalesce(hdr ->> 'cf-connecting-ip', hdr ->> 'x-real-ip', hdr ->> 'x-forwarded-for', ''), ',', 1)), 64);
  ua := left(coalesce(hdr ->> 'user-agent', ''), 400);
  select lower(email) into em from auth.users where id = uid;
  insert into public.consent_records (user_id, policy_version, app_version, method, ip, user_agent, locale, timezone, client_time, context, email_hash)
  values (uid, p_policy_version, left(p_app_version, 40), left(coalesce(p_method, 'continue'), 40), nullif(ip, ''), nullif(ua, ''),
          left(p_locale, 20), left(p_timezone, 60), p_client_time,
          case when jsonb_typeof(p_context) = 'object' and octet_length(p_context::text) < 4000 then p_context else '{}'::jsonb end,
          encode(extensions.digest(coalesce(em, ''), 'sha256'), 'hex'))
  on conflict (user_id, policy_version) do update set
    method = coalesce(public.consent_records.method, excluded.method), ip = coalesce(public.consent_records.ip, excluded.ip),
    user_agent = coalesce(public.consent_records.user_agent, excluded.user_agent), locale = coalesce(public.consent_records.locale, excluded.locale),
    timezone = coalesce(public.consent_records.timezone, excluded.timezone), client_time = coalesce(public.consent_records.client_time, excluded.client_time),
    email_hash = coalesce(public.consent_records.email_hash, excluded.email_hash),
    context = public.consent_records.context || excluded.context;
  return (select jsonb_build_object('ok', true, 'policy_version', c.policy_version, 'accepted_at', c.accepted_at)
            from public.consent_records c where c.user_id = uid and c.policy_version = p_policy_version);
end $$;

create or replace function public.my_consents()
returns table(policy_version text, accepted_at timestamptz, method text, app_version text, ip text, user_agent text, locale text, timezone text)
language sql stable security definer set search_path = public, pg_temp as $$
  select c.policy_version, c.accepted_at, c.method, c.app_version, c.ip, c.user_agent, c.locale, c.timezone
    from public.consent_records c where c.user_id = auth.uid() order by c.accepted_at desc;
$$;

------------------------------------------------------------------------------------------------
-- 7. Account deletion removes everything that is about the person; group records keep only a neutral name
------------------------------------------------------------------------------------------------
create or replace function public.purge_due_account_deletions()
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare r record; n int := 0;
begin
  for r in select p.id, lower(u.email) as email from public.profiles p join auth.users u on u.id = p.id
            where p.deletion_requested_at < now() - interval '30 days'
              and not exists (select 1 from public.chama_members m where m.user_id = p.id and m.status = 'active') loop
    update public.chama_messages set sender_name = 'Former member' where sender = r.id;
    update public.chama_message_responses set name = 'Former member' where user_id = r.id;   -- removed by cascade below; kept for clarity
    delete from public.chama_invitations where invited_email = r.email and status = 'pending';
    delete from public.chama_members where user_id = r.id and status <> 'active';
    update public.chama_members set email = 'deleted-' || substr(md5(r.email), 1, 12) || '@invalid' where email = r.email and user_id is null and status <> 'active';
    delete from public.chama_invite_attempts where user_id = r.id;
    delete from public.chama_invite_redemptions where user_id = r.id;
    delete from public.auth_throttle where key ilike '%' || r.email || '%';
    update public.chama_audit set target = 'deleted-' || substr(md5(r.email), 1, 12) where target = r.email;
    delete from auth.users where id = r.id;   -- cascades: profiles, member_profiles, notifications, responses, reads, private messages to them; consent kept without the link
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.purge_due_account_deletions() from public, anon, authenticated;

------------------------------------------------------------------------------------------------
-- 8. Grants for the new functions people call from the app
------------------------------------------------------------------------------------------------
grant execute on function public.list_join_requests(text), public.decide_join_request(uuid, boolean, text, text, text), public.my_join_requests(),
  public.cancel_join_request(text), public.link_member_record(text, text, text, text), public.mark_notifications_read(uuid[]),
  public.chat_contacts(text), public.send_chama_message(text, text, text, jsonb, uuid), public.respond_chama_message(uuid, text),
  public.record_attendance(uuid, jsonb), public.close_poll(uuid), public.pin_chama_message(uuid, boolean), public.delete_chama_message(uuid),
  public.mark_thread_read(text, text), public.chat_unread(text), public.record_consent(text, text, text, text, text, timestamptz, jsonb), public.my_consents()
  to authenticated;
revoke execute on function public.list_join_requests(text), public.decide_join_request(uuid, boolean, text, text, text), public.my_join_requests(),
  public.cancel_join_request(text), public.link_member_record(text, text, text, text), public.mark_notifications_read(uuid[]),
  public.chat_contacts(text), public.send_chama_message(text, text, text, jsonb, uuid), public.respond_chama_message(uuid, text),
  public.record_attendance(uuid, jsonb), public.close_poll(uuid), public.pin_chama_message(uuid, boolean), public.delete_chama_message(uuid),
  public.mark_thread_read(text, text), public.chat_unread(text), public.record_consent(text, text, text, text, text, timestamptz, jsonb), public.my_consents()
  from anon, public;

------------------------------------------------------------------------------------------------
-- 9. Repair: people who joined by code before approvals existed and never reached the member list
------------------------------------------------------------------------------------------------
do $$ declare r record; mid text; begin
  for r in select m.id, m.chama_id, m.user_id, m.email from public.chama_members m
            where m.status = 'active' and m.member_id is null and m.role in ('member', 'secretary') and m.user_id is not null loop
    mid := public._add_member_record(r.chama_id, public._person_name(r.user_id, r.email));
    update public.chama_members set member_id = mid where id = r.id;
    perform public.audit_log(r.chama_id, null, 'member.link.repair', r.email, jsonb_build_object('member_id', mid));
  end loop;
end $$;
