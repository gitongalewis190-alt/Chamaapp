-- 023: fair roles and removals. NOT YET APPLIED. Written 2026-11-19; apply with approval, test first inside a
-- transaction that ends in ROLLBACK (see the checks at the bottom).
--
-- What it adds (nothing is dropped; leave_chama and remove_member keep their LIVE definitions from 022 and are only called):
--   1. One treasurer and one secretary per Chama. A role is OFFERED; the person accepts or declines in the app.
--      Accepting "secretary" moves the current secretary back to member. Accepting "treasurer" replaces the treasurer who
--      offered it (they become a member). Everyone in the Chama is told about a treasurer change.
--   2. Moving someone DOWN (to member) happens at once but needs a written reason, which the person sees.
--   3. Stepping down from an officer role, or leaving the Chama, needs a written reason (10+ characters).
--   4. Removing access is graceful: by default a notice period (3 days) during which the person sees the reason and can
--      reply; the treasurer can cancel it. Only three cases may remove at once: they asked to leave, a duplicate account,
--      or a security risk. Every removal records a category and reason in the audit log.
--
-- The app calls these functions when they exist and falls back to the older behaviour when they do not.

------------------------------------------------------------------------------------------------
-- 1. Role offers
------------------------------------------------------------------------------------------------
create table if not exists public.chama_role_offers (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  from_role text not null check (from_role in ('member', 'secretary', 'treasurer')),
  to_role text not null check (to_role in ('secretary', 'treasurer')),
  offered_by uuid not null,
  note text check (note is null or char_length(note) <= 400),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  answer text check (answer is null or char_length(answer) <= 400),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create unique index if not exists chama_role_offers_one_pending on public.chama_role_offers (chama_id, email) where status = 'pending';
alter table public.chama_role_offers enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_role_offers' and policyname = 'role_offers_read_own') then
    create policy role_offers_read_own on public.chama_role_offers for select using (user_id = (select auth.uid()));
  end if;
end $$;
do $$ begin begin alter publication supabase_realtime add table public.chama_role_offers; exception when duplicate_object then null; end; end $$;

-- the treasurer offers a role. Moving someone down to member is immediate but needs a reason.
create or replace function public.offer_role(p_cid text, p_email text, p_role text, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); tgt public.chama_members; me public.chama_members; oid uuid; nm text; cname text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active' and role = 'treasurer';
  if not found then raise exception 'Only the treasurer can change roles'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  select * into tgt from public.chama_members where chama_id = p_cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member'; end if;
  if tgt.user_id = auth.uid() then raise exception 'You cannot change your own role. Hand the Chama over instead.'; end if;
  if tgt.role = p_role then return jsonb_build_object('ok', true, 'unchanged', true); end if;
  nm := private.person_name(tgt.user_id, tgt.email);
  select name into cname from public.chamas where id = p_cid;

  if p_role = 'member' then
    if char_length(btrim(coalesce(p_note, ''))) < 10 then raise exception 'Write a short reason (at least 10 characters). They will see it.'; end if;
    update public.chama_members set role = 'member' where chama_id = p_cid and email = em;
    perform public.audit_log(p_cid, auth.uid(), 'role.demote', em, jsonb_build_object('from', tgt.role, 'reason', left(btrim(p_note), 400)));
    if tgt.user_id is not null then
      perform private.notify(p_cid, 'role_changed', 'You are now a Member of ' || coalesce(cname, 'the Chama'), 'Reason from the treasurer: ' || left(btrim(p_note), 400), '#/home', null, tgt.user_id, null, 'important');
    end if;
    perform private.notify(p_cid, 'role_changed_all', nm || ' is now a Member', 'They were ' || initcap(tgt.role) || ' before.', '#/members', null, null, tgt.user_id);
    return jsonb_build_object('ok', true, 'applied', true);
  end if;

  if tgt.user_id is null then raise exception 'They need to sign in to the app once before they can be offered a role'; end if;
  update public.chama_role_offers set status = 'cancelled', decided_at = now() where chama_id = p_cid and email = em and status = 'pending';
  insert into public.chama_role_offers (chama_id, user_id, email, from_role, to_role, offered_by, note)
  values (p_cid, tgt.user_id, em, tgt.role, p_role, auth.uid(), nullif(left(btrim(coalesce(p_note, '')), 400), '')) returning id into oid;
  perform public.audit_log(p_cid, auth.uid(), 'role.offer', em, jsonb_build_object('to', p_role, 'offer', oid));
  perform private.notify(p_cid, 'role_offer', 'You are invited to be ' || initcap(p_role) || ' of ' || coalesce(cname, 'the Chama'),
    case when p_role = 'treasurer' then 'If you accept, you take over the books and ' || private.person_name(me.user_id, me.email) || ' becomes a member.'
         else 'If you accept, you keep the register, call meetings and take minutes. Any current secretary becomes a member.' end,
    '#/home', null, tgt.user_id, null, 'action', jsonb_build_object('offer', oid, 'role', p_role));
  return jsonb_build_object('ok', true, 'offer_id', oid);
end $$;

-- the person answers. Accepting enforces one treasurer and one secretary.
create or replace function public.respond_role_offer(p_id uuid, p_accept boolean, p_answer text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare o public.chama_role_offers; tgt public.chama_members; giver public.chama_members; nm text; cname text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into o from public.chama_role_offers where id = p_id for update;
  if not found or o.user_id <> auth.uid() then raise exception 'This offer was not found'; end if;
  if o.status <> 'pending' then raise exception 'This offer was already answered or withdrawn'; end if;
  select * into tgt from public.chama_members where chama_id = o.chama_id and user_id = auth.uid() and status = 'active' for update;
  if not found then raise exception 'You are no longer in this Chama'; end if;
  nm := private.person_name(auth.uid(), tgt.email);
  select name into cname from public.chamas where id = o.chama_id;

  if not p_accept then
    update public.chama_role_offers set status = 'declined', answer = nullif(left(btrim(coalesce(p_answer, '')), 400), ''), decided_at = now() where id = p_id;
    perform public.audit_log(o.chama_id, auth.uid(), 'role.offer.decline', tgt.email, jsonb_build_object('to', o.to_role));
    perform private.notify(o.chama_id, 'role_offer_declined', nm || ' declined the ' || initcap(o.to_role) || ' role',
      coalesce('Their answer: ' || nullif(left(btrim(coalesce(p_answer, '')), 400), ''), 'Nothing changed.'), '#/settings/actions', null, o.offered_by, null, 'important');
    return jsonb_build_object('ok', true, 'accepted', false);
  end if;

  if o.to_role = 'treasurer' then
    select * into giver from public.chama_members where chama_id = o.chama_id and user_id = o.offered_by and status = 'active' and role = 'treasurer' for update;
    if not found then raise exception 'The person who offered this is no longer the treasurer. Ask the current treasurer.'; end if;
    update public.chama_members set role = 'treasurer' where chama_id = o.chama_id and email = tgt.email;
    -- one treasurer: every other treasurer becomes a member (the new one is active, so the last-treasurer guard passes)
    update public.chama_members set role = 'member' where chama_id = o.chama_id and role = 'treasurer' and status = 'active' and email <> tgt.email;
    perform public.audit_log(o.chama_id, auth.uid(), 'ownership.accept', tgt.email, jsonb_build_object('from', giver.email, 'offer', p_id));
    perform private.notify(o.chama_id, 'ownership', nm || ' is now the treasurer of ' || coalesce(cname, 'the Chama'),
      private.person_name(giver.user_id, giver.email) || ' handed over the books and is now a member. Check that this was expected.', '#/members', null, null, null, 'important');
  else
    update public.chama_members set role = 'member' where chama_id = o.chama_id and role = 'secretary' and status = 'active' and email <> tgt.email;
    update public.chama_members set role = 'secretary' where chama_id = o.chama_id and email = tgt.email;
    perform public.audit_log(o.chama_id, auth.uid(), 'role.accept', tgt.email, jsonb_build_object('to', 'secretary', 'offer', p_id));
    perform private.notify(o.chama_id, 'role_changed_all', nm || ' is now the secretary', 'There is one secretary at a time.', '#/members', null, null, auth.uid(), 'important');
  end if;
  update public.chama_role_offers set status = 'accepted', decided_at = now() where id = p_id;
  update public.chama_role_offers set status = 'cancelled', decided_at = now() where chama_id = o.chama_id and to_role = o.to_role and status = 'pending' and id <> p_id;
  return jsonb_build_object('ok', true, 'accepted', true, 'role', o.to_role);
end $$;

create or replace function public.cancel_role_offer(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare o public.chama_role_offers;
begin
  select * into o from public.chama_role_offers where id = p_id for update;
  if not found or private.my_role(o.chama_id) is distinct from 'treasurer' then raise exception 'Only the treasurer can withdraw an offer'; end if;
  update public.chama_role_offers set status = 'cancelled', decided_at = now() where id = p_id and status = 'pending';
end $$;

create or replace function public.my_role_offers(p_cid text)
returns table(id uuid, to_role text, from_role text, note text, created_at timestamptz, offered_by_name text)
language sql stable security definer set search_path = public, pg_temp as $$
  select o.id, o.to_role, o.from_role, o.note, o.created_at, private.person_name(o.offered_by)
    from public.chama_role_offers o where o.chama_id = p_cid and o.user_id = auth.uid() and o.status = 'pending' order by o.created_at desc;
$$;

create or replace function public.list_role_offers(p_cid text)
returns table(id uuid, email text, name text, to_role text, created_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select o.id, o.email, private.person_name(o.user_id, o.email), o.to_role, o.created_at
    from public.chama_role_offers o where o.chama_id = p_cid and o.status = 'pending' and private.my_role(p_cid) = 'treasurer' order by o.created_at desc;
$$;

------------------------------------------------------------------------------------------------
-- 2. Stepping down and leaving, with a reason
------------------------------------------------------------------------------------------------
create or replace function public.step_down(p_cid text, p_reason text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if char_length(btrim(coalesce(p_reason, ''))) < 10 then raise exception 'Write your reason (at least 10 characters)'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active' for update;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if me.role = 'member' then raise exception 'You are already a member'; end if;
  if me.role = 'treasurer' then raise exception 'A treasurer hands the books to someone else instead of stepping down'; end if;
  update public.chama_members set role = 'member' where chama_id = p_cid and email = me.email;
  perform public.audit_log(p_cid, auth.uid(), 'role.step_down', me.email, jsonb_build_object('from', me.role, 'reason', left(btrim(p_reason), 400)));
  perform private.notify(p_cid, 'role_changed_all', private.person_name(me.user_id, me.email) || ' stepped down as ' || initcap(me.role),
    'Their reason: ' || left(btrim(p_reason), 400), '#/members', array['treasurer', 'secretary'], null, auth.uid(), 'important');
end $$;

create or replace function public.leave_chama_with_reason(p_cid text, p_reason text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if char_length(btrim(coalesce(p_reason, ''))) < 10 then raise exception 'Write your reason (at least 10 characters)'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active';
  if not found then raise exception 'You are not a member of this Chama'; end if;
  perform public.audit_log(p_cid, auth.uid(), 'member.leave.reason', me.email, jsonb_build_object('reason', left(btrim(p_reason), 400)));
  perform private.notify(p_cid, 'member_left_reason', private.person_name(me.user_id, me.email) || ' gave a reason for leaving',
    left(btrim(p_reason), 400), '#/members', array['treasurer', 'secretary'], null, auth.uid());
  perform public.leave_chama(p_cid);   -- the live definition marks their entry as left
end $$;

------------------------------------------------------------------------------------------------
-- 3. Removal with notice, reason and category
------------------------------------------------------------------------------------------------
create table if not exists public.chama_removal_notices (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  email text not null,
  user_id uuid references auth.users(id) on delete cascade,
  category text not null check (category in ('stopped_contributing', 'broke_rules', 'asked_to_leave', 'duplicate', 'security', 'other')),
  reason text not null check (char_length(reason) between 15 and 600),
  given_by uuid not null,
  effective_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'done', 'cancelled')),
  reply text check (reply is null or char_length(reply) <= 600),
  created_at timestamptz not null default now()
);
create unique index if not exists chama_removal_notices_one on public.chama_removal_notices (chama_id, email) where status = 'pending';
alter table public.chama_removal_notices enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_removal_notices' and policyname = 'removal_notices_read_own') then
    create policy removal_notices_read_own on public.chama_removal_notices for select using (user_id = (select auth.uid()));
  end if;
end $$;

create or replace function public.remove_with_reason(p_cid text, p_email text, p_category text, p_reason text, p_notice_days int default 3)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); tgt public.chama_members; nid uuid; cname text; immediate boolean; days int := greatest(0, least(coalesce(p_notice_days, 3), 14));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if private.my_role(p_cid) is distinct from 'treasurer' then raise exception 'Only the treasurer can remove access'; end if;
  if p_category not in ('stopped_contributing', 'broke_rules', 'asked_to_leave', 'duplicate', 'security', 'other') then raise exception 'Choose why'; end if;
  if char_length(btrim(coalesce(p_reason, ''))) < 15 then raise exception 'Explain the reason in a sentence (at least 15 characters). They will see it.'; end if;
  select * into tgt from public.chama_members where chama_id = p_cid and email = em and status = 'active';
  if not found then raise exception 'That person does not have access now'; end if;
  if tgt.user_id = auth.uid() then raise exception 'You cannot remove your own access'; end if;
  if tgt.role = 'treasurer' then raise exception 'A treasurer cannot be removed. Ask them to hand the books over first.'; end if;
  select name into cname from public.chamas where id = p_cid;
  immediate := p_category in ('asked_to_leave', 'duplicate', 'security');   -- every other reason gets a notice period
  perform public.audit_log(p_cid, auth.uid(), case when immediate then 'member.remove.now' else 'member.remove.notice' end, em,
    jsonb_build_object('category', p_category, 'reason', left(btrim(p_reason), 600), 'days', case when immediate then 0 else greatest(days, 1) end));
  if immediate then
    perform public.remove_member(p_cid, em);   -- live definition: marks the entry left, tells everyone
    if tgt.user_id is not null then
      perform private.notify(p_cid, 'access_removed_reason', 'Why your access to ' || coalesce(cname, 'the Chama') || ' ended', left(btrim(p_reason), 600), null, null, tgt.user_id, null, 'important');
    end if;
    return jsonb_build_object('ok', true, 'removed', true);
  end if;
  update public.chama_removal_notices set status = 'cancelled' where chama_id = p_cid and email = em and status = 'pending';
  insert into public.chama_removal_notices (chama_id, email, user_id, category, reason, given_by, effective_at)
  values (p_cid, em, tgt.user_id, p_category, left(btrim(p_reason), 600), auth.uid(), now() + make_interval(days => greatest(days, 1))) returning id into nid;
  if tgt.user_id is not null then
    perform private.notify(p_cid, 'removal_notice', 'Your access to ' || coalesce(cname, 'the Chama') || ' ends in ' || greatest(days, 1) || ' days',
      'Reason: ' || left(btrim(p_reason), 500) || ' You can reply before then.', '#/home', null, tgt.user_id, null, 'action', jsonb_build_object('notice', nid));
  end if;
  perform private.notify(p_cid, 'removal_notice_officers', private.person_name(tgt.user_id, tgt.email) || ' was given notice', 'Category: ' || replace(p_category, '_', ' ') || '.', '#/settings/actions', array['secretary'], null, auth.uid());
  return jsonb_build_object('ok', true, 'notice_id', nid);
end $$;

create or replace function public.reply_removal_notice(p_id uuid, p_reply text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare n public.chama_removal_notices;
begin
  select * into n from public.chama_removal_notices where id = p_id for update;
  if not found or n.user_id <> auth.uid() or n.status <> 'pending' then raise exception 'This notice is no longer open'; end if;
  if char_length(btrim(coalesce(p_reply, ''))) < 5 then raise exception 'Write a short reply'; end if;
  update public.chama_removal_notices set reply = left(btrim(p_reply), 600) where id = p_id;
  perform private.notify(n.chama_id, 'removal_reply', private.person_name(n.user_id, n.email) || ' replied to the removal notice', left(btrim(p_reply), 500), '#/settings/actions', null, n.given_by, null, 'action');
end $$;

create or replace function public.cancel_removal_notice(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare n public.chama_removal_notices; cname text;
begin
  select * into n from public.chama_removal_notices where id = p_id for update;
  if not found or private.my_role(n.chama_id) is distinct from 'treasurer' then raise exception 'Only the treasurer can cancel a notice'; end if;
  update public.chama_removal_notices set status = 'cancelled' where id = p_id and status = 'pending';
  select name into cname from public.chamas where id = n.chama_id;
  if n.user_id is not null then perform private.notify(n.chama_id, 'removal_cancelled', 'You keep your access to ' || coalesce(cname, 'the Chama'), 'The treasurer withdrew the notice.', '#/home', null, n.user_id, null, 'important'); end if;
end $$;

-- after the notice period the treasurer finishes the removal (the app offers it once the date has passed)
create or replace function public.finish_removal(p_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare n public.chama_removal_notices;
begin
  select * into n from public.chama_removal_notices where id = p_id for update;
  if not found or private.my_role(n.chama_id) is distinct from 'treasurer' then raise exception 'Only the treasurer can finish a removal'; end if;
  if n.status <> 'pending' then raise exception 'This notice is no longer open'; end if;
  if n.effective_at > now() then raise exception 'The notice period has not ended yet'; end if;
  update public.chama_removal_notices set status = 'done' where id = p_id;
  perform public.remove_member(n.chama_id, n.email);
  if n.user_id is not null then perform private.notify(n.chama_id, 'access_removed_reason', 'Your notice period ended', 'Reason given: ' || n.reason, null, null, n.user_id, null, 'important'); end if;
end $$;

create or replace function public.list_removal_notices(p_cid text)
returns table(id uuid, email text, name text, category text, reason text, reply text, effective_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select n.id, n.email, private.person_name(n.user_id, n.email), n.category, n.reason, n.reply, n.effective_at
    from public.chama_removal_notices n where n.chama_id = p_cid and n.status = 'pending' and private.my_role(p_cid) in ('treasurer', 'secretary') order by n.effective_at;
$$;

create or replace function public.my_removal_notice(p_cid text)
returns table(id uuid, category text, reason text, reply text, effective_at timestamptz)
language sql stable security definer set search_path = public, pg_temp as $$
  select n.id, n.category, n.reason, n.reply, n.effective_at from public.chama_removal_notices n
   where n.chama_id = p_cid and n.user_id = auth.uid() and n.status = 'pending' limit 1;
$$;

------------------------------------------------------------------------------------------------
-- 4. Grants: signed-in people only
------------------------------------------------------------------------------------------------
do $$ declare f text; begin
  foreach f in array array[
    'public.offer_role(text, text, text, text)', 'public.respond_role_offer(uuid, boolean, text)', 'public.cancel_role_offer(uuid)',
    'public.my_role_offers(text)', 'public.list_role_offers(text)', 'public.step_down(text, text)', 'public.leave_chama_with_reason(text, text)',
    'public.remove_with_reason(text, text, text, text, int)', 'public.reply_removal_notice(uuid, text)', 'public.cancel_removal_notice(uuid)',
    'public.finish_removal(uuid)', 'public.list_removal_notices(text)', 'public.my_removal_notice(text)']
  loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;

-- CHECKS (run inside: begin; ... ; rollback;)
-- 1) select count(*) from public.chama_members where status = 'active' and role = 'treasurer' group by chama_id having count(*) > 1;
--    Existing Chamas with two treasurers are NOT changed by this migration; the app shows a warning so they can choose one.
-- 2) As a treasurer (set request.jwt.claims), offer_role(cid, email, 'secretary') then, as that person, respond_role_offer(id, true):
--    exactly one active secretary remains.
