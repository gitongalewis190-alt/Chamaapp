-- 019: join approvals, server notifications, chama messages with role tools, consent evidence.
-- Written so it can be applied without dropping or revoking anything:
--   * join requests live in their own table (chama_members keeps its constraint)
--   * internal helpers live in schema "private", which the API does not expose
--   * consent uses a new function record_consent_v2 (the old one keeps working)
-- The few changes that do need a DROP are in 020_manual_requires_approval.sql.
-- Safe to re-run.

create schema if not exists private;

------------------------------------------------------------------------------------------------
-- 0. Helpers (not reachable from the app)
------------------------------------------------------------------------------------------------
create or replace function private.add_member_record(p_cid text, p_name text)
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

create or replace function private.person_name(p_user uuid, p_email text default null)
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(nullif(btrim(p.full_name), ''), nullif(p.username, ''), nullif(initcap(split_part(coalesce(p_email, ''), '@', 1)), ''), 'Member')
    from (select 1) x left join public.profiles p on p.id = p_user;
$$;

create or replace function private.my_role(p_cid text)
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select m.role from public.chama_members m where m.chama_id = p_cid and m.user_id = auth.uid() and m.status = 'active' limit 1;
$$;

-- secretaries keep the member register: they may see the member list and contact details
insert into public.role_permissions (role, permission) values ('secretary', 'members.view_list') on conflict do nothing;

------------------------------------------------------------------------------------------------
-- 1. Notifications kept on the server, one row per person
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
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_notifications' and policyname = 'notifications_read_own') then
    create policy notifications_read_own on public.chama_notifications for select using (recipient = (select auth.uid()));
  end if;
end $$;

-- one notification to the active people of a Chama (optionally only some roles, only one person, or all but one)
create or replace function private.notify(p_cid text, p_kind text, p_title text, p_body text default null, p_link text default null,
  p_roles text[] default null, p_only uuid default null, p_except uuid default null, p_priority text default 'normal', p_data jsonb default '{}'::jsonb)
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare n int;
begin
  if p_only is not null then
    insert into public.chama_notifications (chama_id, recipient, kind, title, body, link, priority, actor, data)
    values (p_cid, p_only, p_kind, left(p_title, 160), left(p_body, 600), p_link, p_priority, auth.uid(), coalesce(p_data, '{}'::jsonb));
    return 1;
  end if;
  insert into public.chama_notifications (chama_id, recipient, kind, title, body, link, priority, actor, data)
  select p_cid, m.user_id, p_kind, left(p_title, 160), left(p_body, 600), p_link, p_priority, auth.uid(), coalesce(p_data, '{}'::jsonb)
    from public.chama_members m
   where m.chama_id = p_cid and m.user_id is not null and m.status = 'active'
     and (p_roles is null or m.role = any (p_roles))
     and (p_except is null or m.user_id <> p_except);
  get diagnostics n = row_count;
  return n;
end $$;

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
-- 2. Join requests: a code asks to join; the treasurer (or secretary, for non-treasurer roles) decides
------------------------------------------------------------------------------------------------
create table if not exists public.chama_join_requests (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('member', 'secretary', 'treasurer')),
  requested_member_id text,
  code_id uuid references public.chama_invite_codes(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'cancelled')),
  requested_at timestamptz not null default now(),
  decided_by uuid,
  decided_at timestamptz,
  final_role text,
  member_id text
);
create unique index if not exists chama_join_requests_one_pending on public.chama_join_requests (chama_id, user_id) where status = 'pending';
create index if not exists chama_join_requests_chama_idx on public.chama_join_requests (chama_id, status);
alter table public.chama_join_requests enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_join_requests' and policyname = 'join_requests_read_own') then
    create policy join_requests_read_own on public.chama_join_requests for select using (user_id = (select auth.uid()));
  end if;
end $$;

create or replace function public.preview_invite_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); norm text; inv public.chama_invite_codes; ch public.chamas; recent int; active boolean; pend boolean; tname text; mcount int;
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
  active := exists (select 1 from public.chama_members m where m.chama_id = inv.chama_id and m.user_id = uid and m.status = 'active');
  pend := exists (select 1 from public.chama_join_requests r where r.chama_id = inv.chama_id and r.user_id = uid and r.status = 'pending');
  if not active and not pend and inv.uses >= inv.max_uses then return jsonb_build_object('ok', false, 'error', 'This code has been used up. Ask for a new one.'); end if;
  select private.person_name(m.user_id, m.email) into tname from public.chama_members m
   where m.chama_id = inv.chama_id and m.role = 'treasurer' and m.status = 'active' order by m.created_at limit 1;
  select count(*) into mcount from public.chama_members m where m.chama_id = inv.chama_id and m.status = 'active';
  return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag,
    'role', inv.role, 'already_member', active, 'pending', pend, 'expires_at', inv.expires_at,
    'treasurer_name', tname, 'people', mcount,
    'members_listed', jsonb_array_length(public.jarr(ch.data -> 'members')),
    'contribution', public.jnum(ch.data -> 'chama' -> 'contribution'),
    'currency', coalesce(ch.data -> 'chama' ->> 'currency', 'KES'),
    'listed', inv.listed_member_id is not null);
end $$;

create or replace function public.redeem_invite_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); em text; norm text; inv public.chama_invite_codes; ch public.chamas; mem public.chama_members; req public.chama_join_requests;
        recent int; fail text; nm text;
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
  select * into mem from public.chama_members m where m.chama_id = inv.chama_id and m.user_id = uid and m.status = 'active';
  if found then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, true);
    return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', mem.role, 'already_member', true);
  end if;
  select * into req from public.chama_join_requests r where r.chama_id = inv.chama_id and r.user_id = uid and r.status = 'pending';
  if found then
    return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', req.role, 'pending', true);
  end if;
  if inv.uses >= inv.max_uses then
    insert into public.chama_invite_attempts (user_id, ok) values (uid, false);
    return jsonb_build_object('ok', false, 'error', 'This code has been used up. Ask for a new one.');
  end if;
  insert into public.chama_join_requests (chama_id, user_id, email, role, requested_member_id, code_id)
  values (inv.chama_id, uid, em, inv.role, inv.listed_member_id, inv.id);
  update public.chama_invite_codes set uses = uses + 1 where id = inv.id;
  insert into public.chama_invite_redemptions (code_id, user_id) values (inv.id, uid);
  insert into public.chama_invite_attempts (user_id, ok) values (uid, true);
  perform public.audit_log(inv.chama_id, uid, 'join.request', em, jsonb_build_object('role', inv.role, 'code', inv.id));
  nm := private.person_name(uid, em);
  perform private.notify(inv.chama_id, 'join_request', nm || ' wants to join',
    'Asked to join as ' || initcap(inv.role) || ' with an invite code. Approve or decline.', '#/requests',
    case when inv.role = 'treasurer' then array['treasurer'] else array['treasurer', 'secretary'] end, null, uid, 'action',
    jsonb_build_object('email', em, 'role', inv.role));
  return jsonb_build_object('ok', true, 'chama_id', inv.chama_id, 'chama_name', ch.name, 'display_tag', ch.display_tag, 'role', inv.role, 'pending', true);
end $$;

create or replace function public.list_join_requests(p_cid text)
returns table(id uuid, email text, name text, username text, phone text, photo text, role text, requested_member_id text, requested_at timestamptz)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare me text := private.my_role(p_cid);
begin
  if me is null or me = 'member' then return; end if;
  return query
    select r.id, r.email, private.person_name(r.user_id, r.email), p.username, p.phone, p.photo, r.role, r.requested_member_id, r.requested_at
      from public.chama_join_requests r left join public.profiles p on p.id = r.user_id
     where r.chama_id = p_cid and r.status = 'pending' and (me = 'treasurer' or r.role <> 'treasurer')
     order by r.requested_at;
end $$;

-- p_record: 'new' adds them to the member list, 'none' keeps them an officer only, anything else is an existing member record id
create or replace function public.decide_join_request(p_id uuid, p_approve boolean, p_role text default null, p_record text default 'new', p_name text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare req public.chama_join_requests; me text; fin_role text; mid text; nm text; cname text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into req from public.chama_join_requests where id = p_id for update;
  if not found or req.status <> 'pending' then raise exception 'This request was already handled'; end if;
  me := private.my_role(req.chama_id);
  if me is null or me = 'member' then raise exception 'Only the treasurer or secretary can decide requests'; end if;
  fin_role := coalesce(nullif(p_role, ''), req.role);
  if fin_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  if me = 'secretary' and (req.role = 'treasurer' or fin_role = 'treasurer') then raise exception 'Only the treasurer can approve a treasurer'; end if;
  select name into cname from public.chamas where id = req.chama_id;
  nm := private.person_name(req.user_id, req.email);
  if not p_approve then
    update public.chama_join_requests set status = 'declined', decided_by = auth.uid(), decided_at = now() where id = p_id;
    perform public.audit_log(req.chama_id, auth.uid(), 'join.decline', req.email, '{}'::jsonb);
    perform private.notify(req.chama_id, 'join_declined', 'Your request to join ' || coalesce(cname, 'the Chama') || ' was declined',
      'Ask the treasurer if you think this is a mistake.', null, null, req.user_id, null, 'important');
    return jsonb_build_object('ok', true, 'approved', false);
  end if;
  if p_record is null or p_record = 'new' then
    mid := coalesce(req.requested_member_id, private.add_member_record(req.chama_id, coalesce(nullif(btrim(p_name), ''), nm)));
  elsif p_record = 'none' then mid := null;
  else
    if not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = req.chama_id and e ->> 'id' = p_record) then
      raise exception 'That member record is not in this Chama';
    end if;
    if exists (select 1 from public.chama_members m where m.chama_id = req.chama_id and m.member_id = p_record and m.status = 'active' and m.user_id is distinct from req.user_id) then
      raise exception 'That member record already belongs to someone else';
    end if;
    mid := p_record;
  end if;
  insert into public.chama_members (chama_id, email, user_id, role, member_id, status, joined_at)
  values (req.chama_id, req.email, req.user_id, fin_role, mid, 'active', now())
  on conflict (chama_id, email) do update set user_id = excluded.user_id, role = excluded.role, status = 'active', joined_at = now(),
         member_id = coalesce(excluded.member_id, public.chama_members.member_id);
  update public.chama_join_requests set status = 'approved', decided_by = auth.uid(), decided_at = now(), final_role = fin_role, member_id = mid where id = p_id;
  update public.chama_notifications set read_at = coalesce(read_at, now()) where chama_id = req.chama_id and kind = 'join_request' and data ->> 'email' = req.email;
  perform public.audit_log(req.chama_id, auth.uid(), 'join.approve', req.email, jsonb_build_object('role', fin_role, 'member_id', mid));
  perform private.notify(req.chama_id, 'join_approved', 'Welcome to ' || coalesce(cname, 'the Chama'),
    'You were approved as ' || initcap(fin_role) || '. Open the app to see your Chama.', '#/home', null, req.user_id, null, 'important');
  perform private.notify(req.chama_id, 'member_joined', nm || ' joined the Chama', 'Joined as ' || initcap(fin_role) || '.', '#/members', null, null, req.user_id);
  return jsonb_build_object('ok', true, 'approved', true, 'member_id', mid, 'role', fin_role);
end $$;

create or replace function public.my_join_requests()
returns table(chama_id text, chama_name text, display_tag text, role text, requested_at timestamptz, treasurer_name text)
language sql stable security definer set search_path = public, pg_temp as $$
  select r.chama_id, c.name, c.display_tag, r.role, r.requested_at,
         (select private.person_name(m.user_id, m.email) from public.chama_members m where m.chama_id = r.chama_id and m.role = 'treasurer' and m.status = 'active' order by m.created_at limit 1)
    from public.chama_join_requests r join public.chamas c on c.id = r.chama_id
   where r.user_id = auth.uid() and r.status = 'pending' order by r.requested_at desc;
$$;

create or replace function public.cancel_join_request(p_cid text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare em text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select lower(email) into em from auth.users where id = auth.uid();
  update public.chama_join_requests set status = 'cancelled', decided_by = auth.uid(), decided_at = now()
   where chama_id = p_cid and user_id = auth.uid() and status = 'pending';
  update public.chama_notifications set read_at = coalesce(read_at, now()) where chama_id = p_cid and kind = 'join_request' and data ->> 'email' = em;
end $$;

-- the treasurer puts someone who is already in (but not on the member list) onto the list in one tap
create or replace function public.link_member_record(p_cid text, p_email text, p_record text default 'new', p_name text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare acc public.chama_members; mid text;
begin
  if private.my_role(p_cid) is distinct from 'treasurer' then raise exception 'Only the treasurer can change the member list'; end if;
  select * into acc from public.chama_members where chama_id = p_cid and email = lower(btrim(p_email)) and status = 'active' for update;
  if not found then raise exception 'That person is not active in this Chama'; end if;
  if p_record is null or p_record = 'new' then mid := private.add_member_record(p_cid, coalesce(nullif(btrim(p_name), ''), private.person_name(acc.user_id, acc.email)));
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
  if mid is not null and acc.user_id is not null then
    perform private.notify(p_cid, 'member_linked', 'You are on the member list', 'Your contributions, loans and fines now show on your profile.', '#/me', null, acc.user_id);
  end if;
  return jsonb_build_object('ok', true, 'member_id', mid);
end $$;

------------------------------------------------------------------------------------------------
-- 3. Email invitations: member record "new" adds the person to the member list when they accept
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
  nm := private.person_name(uid, u_email);
  mid := case when inv.member_id = 'new' then private.add_member_record(inv.chama_id, nm) else inv.member_id end;
  insert into public.chama_members (chama_id, email, user_id, role, member_id, status, joined_at)
  values (inv.chama_id, inv.invited_email, uid, inv.intended_role, mid, 'active', now())
  on conflict (chama_id, email) do update set user_id = uid, role = excluded.role, status = 'active', joined_at = now(),
         member_id = coalesce(excluded.member_id, public.chama_members.member_id);
  update public.chama_invitations set status = 'accepted', accepted_by = uid, accepted_at = now() where id = inv.id;
  update public.chama_join_requests set status = 'cancelled', decided_at = now() where chama_id = inv.chama_id and user_id = uid and status = 'pending';
  perform public.audit_log(inv.chama_id, uid, 'invitation.accept', inv.invited_email, jsonb_build_object('invitation', inv.id, 'role', inv.intended_role));
  perform private.notify(inv.chama_id, 'member_joined', nm || ' joined the Chama', 'Accepted an email invitation as ' || initcap(inv.intended_role) || '.', '#/members', null, null, uid);
  return jsonb_build_object('ok', true, 'code', 'ok', 'chama_id', inv.chama_id, 'role', inv.intended_role);
end $$;

------------------------------------------------------------------------------------------------
-- 4. Leaving, removal, roles and hand-over now tell everyone
------------------------------------------------------------------------------------------------
create or replace function public.leave_chama(cid text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = cid and user_id = auth.uid() and status = 'active' for update;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if me.role = 'treasurer' and not exists (select 1 from public.chama_members x where x.chama_id = cid and x.role = 'treasurer' and x.status = 'active' and x.email <> me.email) then
    raise exception 'You are the only treasurer. Hand the Chama to someone else first.';
  end if;
  update public.chama_members set status = 'removed' where chama_id = cid and email = me.email;
  perform public.audit_log(cid, auth.uid(), 'member.leave', me.email, '{}');
  perform private.notify(cid, 'member_left', private.person_name(me.user_id, me.email) || ' left the Chama', 'Their past records stay in the books.', '#/members', null, null, auth.uid(), 'important');
end $$;

create or replace function public.remove_member(cid text, p_email text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); tgt public.chama_members; cname text;
begin
  if not public.chama_can(cid, 'members.remove') then raise exception 'Only the treasurer can remove access'; end if;
  if em = lower(auth.jwt() ->> 'email') then raise exception 'You cannot remove your own access'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em;
  update public.chama_members set status = 'removed' where chama_id = cid and email = em;
  perform public.audit_log(cid, auth.uid(), 'member.remove', em, '{}');
  if tgt.status = 'active' then
    select name into cname from public.chamas where id = cid;
    perform private.notify(cid, 'member_removed', private.person_name(tgt.user_id, tgt.email) || ' no longer has access', 'The treasurer removed their access. Their records are kept.', '#/members', null, null, tgt.user_id, 'important');
    if tgt.user_id is not null then
      perform private.notify(cid, 'access_removed', 'Your access to ' || coalesce(cname, 'a Chama') || ' was removed', 'Your past records stay with the Chama.', null, null, tgt.user_id, null, 'important');
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
  if tgt.user_id is not null then
    perform private.notify(cid, 'role_changed', 'You are now ' || initcap(p_role), 'Your role changed from ' || initcap(tgt.role) || '. What you can see and do changed with it.', '#/home', null, tgt.user_id, null, 'important');
  end if;
  perform private.notify(cid, 'role_changed_all', private.person_name(tgt.user_id, tgt.email) || ' is now ' || initcap(p_role), null, '#/members', null, null, tgt.user_id);
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
  perform private.notify(cid, 'ownership', private.person_name(tgt.user_id, tgt.email) || ' is now the treasurer', 'The books were handed over.', '#/home', null, null, null, 'important');
end $$;

------------------------------------------------------------------------------------------------
-- 5. Messages: one group conversation per Chama plus private conversations, with tools per role
--    member:    text (group, or privately to an officer), vote, RSVP, "I have paid"
--    secretary: + announcements, meeting notices, attendance register, minutes and resolutions, polls, pin; private to anyone
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
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_messages' and policyname = 'messages_read') then
    create policy messages_read on public.chama_messages for select using (
      public.is_active_member(chama_id) and (recipient is null or recipient = (select auth.uid()) or sender = (select auth.uid())));
  end if;
end $$;

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
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_message_responses' and policyname = 'responses_read') then
    create policy responses_read on public.chama_message_responses for select using (public.is_active_member(chama_id));
  end if;
end $$;

create table if not exists public.chama_message_reads (
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  thread text not null,
  last_read_at timestamptz not null default now(),
  primary key (chama_id, user_id, thread)
);
alter table public.chama_message_reads enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_message_reads' and policyname = 'reads_own') then
    create policy reads_own on public.chama_message_reads for select using (user_id = (select auth.uid()));
  end if;
end $$;

create or replace function public.chat_contacts(p_cid text)
returns table(user_id uuid, name text, role text, photo text, member_id text, can_message boolean)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare me text := private.my_role(p_cid);
begin
  if me is null then raise exception 'You are not a member of this Chama'; end if;
  return query
    select m.user_id, private.person_name(m.user_id, m.email), m.role, p.photo, m.member_id, (me <> 'member' or m.role <> 'member')
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
  nm := private.person_name(auth.uid(), me.email);
  insert into public.chama_messages (chama_id, sender, sender_name, sender_role, recipient, kind, body, meta, pinned)
  values (p_cid, auth.uid(), nm, me.role, p_recipient, p_kind, b, meta, p_kind = 'announcement' and coalesce((meta ->> 'pin')::boolean, true))
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
    perform private.notify(p_cid, 'message_' || p_kind, title, left(coalesce(nullif(b, ''), meta ->> 'title', ''), 200),
      '#/chat/' || case when p_recipient is null then 'group' else auth.uid()::text end, null, p_recipient, auth.uid(),
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
    if coalesce((msg.meta ->> 'closed')::boolean, false) then raise exception 'This poll is closed'; end if;
    ok := p_choice ~ '^[0-9]$' and p_choice::int < jsonb_array_length(msg.meta -> 'options');
  elsif msg.kind = 'meeting' then ok := p_choice in ('yes', 'no', 'maybe');
  elsif msg.kind = 'payment_request' then ok := p_choice in ('paid', 'later');
  end if;
  if not ok then raise exception 'That answer is not allowed'; end if;
  insert into public.chama_message_responses (message_id, user_id, chama_id, choice, name)
  values (p_id, auth.uid(), msg.chama_id, p_choice, private.person_name(auth.uid(), null))
  on conflict (message_id, user_id) do update set choice = excluded.choice, created_at = now();
  if msg.kind = 'payment_request' and p_choice = 'paid' then
    perform private.notify(msg.chama_id, 'payment_claimed', private.person_name(auth.uid(), null) || ' says they paid',
      'Answer to your request for KES ' || to_char(public.jnum(msg.meta -> 'amount'), 'FM999,999,990') || '. Check M-Pesa and record it.', '#/contributions', array['treasurer'], null, auth.uid(), 'action');
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- the secretary (or treasurer) keeps the attendance register of a meeting
create or replace function public.record_attendance(p_id uuid, p_attendance jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text;
begin
  select * into msg from public.chama_messages where id = p_id and kind = 'meeting' and deleted_at is null for update;
  if not found then raise exception 'Meeting not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null or me = 'member' then raise exception 'Only the secretary or treasurer keeps the register'; end if;
  if jsonb_typeof(p_attendance) <> 'object' then raise exception 'Bad register'; end if;
  update public.chama_messages set meta = meta || jsonb_build_object('attendance', p_attendance, 'register_by', private.person_name(auth.uid(), null), 'register_at', now()), edited_at = now()
   where id = p_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.close_poll(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text;
begin
  select * into msg from public.chama_messages where id = p_id and kind = 'poll' for update;
  if not found then raise exception 'Poll not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null or me = 'member' then raise exception 'Only the treasurer or secretary can close a poll'; end if;
  update public.chama_messages set meta = meta || jsonb_build_object('closed', true), edited_at = now() where id = p_id;
end $$;

create or replace function public.pin_chama_message(p_id uuid, p_pin boolean)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text;
begin
  select * into msg from public.chama_messages where id = p_id;
  if not found then raise exception 'Message not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null or me = 'member' then raise exception 'Only the treasurer or secretary can pin'; end if;
  if msg.recipient is not null then raise exception 'Only group messages can be pinned'; end if;
  update public.chama_messages set pinned = p_pin where id = p_id;
end $$;

create or replace function public.retract_chama_message(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text;
begin
  select * into msg from public.chama_messages where id = p_id for update;
  if not found then raise exception 'Message not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null then raise exception 'Message not found'; end if;
  if msg.sender is distinct from auth.uid() and me <> 'treasurer' then raise exception 'You can remove only your own messages'; end if;
  update public.chama_messages set deleted_at = now(), body = '', meta = jsonb_build_object('removed_by', private.person_name(auth.uid(), null)), pinned = false where id = p_id;
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
  select x.thread, (count(*) filter (where x.sender is distinct from auth.uid() and x.created_at > coalesce(r.last_read_at, '-infinity'::timestamptz)))::int, max(x.created_at)
    from mine x left join public.chama_message_reads r on r.chama_id = p_cid and r.user_id = auth.uid() and r.thread = x.thread
   group by x.thread, r.last_read_at;
$$;

-- live updates (Row Level Security still decides what each person receives)
do $$ begin
  begin alter publication supabase_realtime add table public.chama_messages; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.chama_message_responses; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.chama_notifications; exception when duplicate_object then null; end;
end $$;

------------------------------------------------------------------------------------------------
-- 6. Consent evidence: when, which version, how, from where
------------------------------------------------------------------------------------------------
alter table public.consent_records add column if not exists method text;
alter table public.consent_records add column if not exists ip text;
alter table public.consent_records add column if not exists user_agent text;
alter table public.consent_records add column if not exists locale text;
alter table public.consent_records add column if not exists timezone text;
alter table public.consent_records add column if not exists client_time timestamptz;
alter table public.consent_records add column if not exists context jsonb not null default '{}'::jsonb;
alter table public.consent_records add column if not exists email_hash text;

-- a copy that outlives the account: if a deleted person later disputes the terms, this shows what they accepted
create table if not exists public.consent_archive (
  id uuid primary key,
  email_hash text,
  policy_version text not null,
  accepted_at timestamptz not null,
  app_version text, method text, ip text, user_agent text, locale text, timezone text, client_time timestamptz, context jsonb,
  archived_at timestamptz not null default now()
);
alter table public.consent_archive enable row level security;   -- no policies: server only

create or replace function public.record_consent_v2(p_policy_version text, p_app_version text default null, p_method text default 'continue',
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
-- 7. Repair: people who joined by code before approvals existed and never reached the member list
------------------------------------------------------------------------------------------------
do $$ declare r record; mid text; begin
  for r in select m.id, m.chama_id, m.user_id, m.email from public.chama_members m
            where m.status = 'active' and m.member_id is null and m.role in ('member', 'secretary') and m.user_id is not null loop
    mid := private.add_member_record(r.chama_id, private.person_name(r.user_id, r.email));
    update public.chama_members set member_id = mid where id = r.id;
    perform public.audit_log(r.chama_id, null, 'member.link.repair', r.email, jsonb_build_object('member_id', mid));
  end loop;
end $$;
