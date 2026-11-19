-- =====================================================================================================
-- My Chama: EVERY database change from the 0.16 to 0.18 work, in one file. Project: sgfvjsxmchohawhqraii (My Chama).
-- NOT "The lees app" (emimwlpsfchndxaxzswh).
--
-- Contains migrations 023, 024, 025, 026, 027 (files in supabase/migrations/). One transaction: all or nothing.
-- Safe to run again: the owner already ran 023-025 on 2026-11-20 (release check S1/S2 passed); every statement here
-- uses "if not exists", "create or replace" or a guard, so re-running changes nothing that is already in place.
-- It adds tables, columns, functions and triggers. It drops nothing and does not change payments or chama records,
-- except 027's one-time fill of EMPTY member phone numbers from each person's profile.
--
-- HOW (owner): Supabase -> SQL Editor -> New query -> paste ALL of this file -> Run. Then read the checks at the bottom.
-- HOW (agent): see docs/SUPABASE_FOR_NEXT_AGENT.md (dry run with ROLLBACK first, then apply).
-- =====================================================================================================
begin;

-- ======================================== 023_roles_offers_reasons_notices ========================================
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

-- ======================================== 024_edit_messages ========================================
-- 024: edit messages and announcements. NOT YET APPLIED. Written 2026-11-19; test inside BEGIN ... ROLLBACK first.
-- Who can edit:
--   * the sender, for their own text, announcement and minutes messages;
--   * the treasurer or secretary, for any GROUP announcement or pinned message (they keep the notice board).
-- The previous wording is kept in meta.history (last 5 versions) with who changed it and when, so an edit is never silent.
-- Removed messages cannot be edited. Meetings, polls and payment requests are not edited this way.

create or replace function public.edit_chama_message(p_id uuid, p_body text, p_title text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text; hist jsonb; v_body text := btrim(coalesce(p_body, ''));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into msg from public.chama_messages where id = p_id for update;
  if not found then raise exception 'Message not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null then raise exception 'Message not found'; end if;
  if msg.deleted_at is not null then raise exception 'This message was removed'; end if;
  if msg.kind not in ('text', 'announcement', 'minutes') then raise exception 'This kind of message cannot be edited'; end if;
  if not (msg.sender = auth.uid() or (me in ('treasurer', 'secretary') and msg.recipient is null and (msg.kind = 'announcement' or msg.pinned))) then
    raise exception 'You can edit only your own messages';
  end if;
  if char_length(v_body) = 0 then raise exception 'The message cannot be empty'; end if;
  if char_length(v_body) > 4000 then raise exception 'Keep it under 4000 characters'; end if;
  hist := coalesce(msg.meta -> 'history', '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
    'body', left(msg.body, 4000), 'title', msg.meta ->> 'title', 'at', coalesce(msg.edited_at, msg.created_at), 'by', private.person_name(auth.uid(), null)));
  if jsonb_array_length(hist) > 5 then hist := (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(hist) with ordinality x(e, o) where o > jsonb_array_length(hist) - 5); end if;
  update public.chama_messages
     set body = v_body,
         meta = (case when p_title is not null and msg.kind in ('announcement', 'minutes') then msg.meta || jsonb_build_object('title', left(btrim(p_title), 120)) else msg.meta end)
                || jsonb_build_object('history', hist, 'edited_by', private.person_name(auth.uid(), null)),
         edited_at = now()
   where id = p_id;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.edit_chama_message(uuid, text, text) from public, anon;
grant execute on function public.edit_chama_message(uuid, text, text) to authenticated;

-- CHECK (inside BEGIN ... ROLLBACK): as the sender, select public.edit_chama_message('<id>', 'new words');
-- then select body, edited_at, meta -> 'history' from public.chama_messages where id = '<id>';

-- ======================================== 025_invite_routing_and_usernames ========================================
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

-- 4. "I understand this Chama": the walkthrough every member completes once per Chama (kept on the server so it follows
--    them to a new phone). One row per person per Chama and version of the walkthrough.
create table if not exists public.chama_awareness (
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null,
  agreed_at timestamptz not null default now(),
  primary key (chama_id, user_id, version)
);
alter table public.chama_awareness enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'chama_awareness' and policyname = 'awareness_read_own') then
    create policy awareness_read_own on public.chama_awareness for select using (user_id = (select auth.uid()));
  end if;
end $$;
create or replace function public.record_awareness(p_cid text, p_version text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if private.my_role(p_cid) is null then raise exception 'You are not in this Chama'; end if;
  insert into public.chama_awareness (chama_id, user_id, version) values (p_cid, auth.uid(), left(coalesce(p_version, 'v1'), 20)) on conflict do nothing;
  perform public.audit_log(p_cid, auth.uid(), 'member.aware', null, jsonb_build_object('version', p_version));
end $$;
revoke all on function public.record_awareness(text, text) from public, anon;
grant execute on function public.record_awareness(text, text) to authenticated;

-- ======================================== 026_details_loan_signing_chama_faces ========================================
-- 026: About you, loan signing on the borrower's phone, Chama photos in the chooser. Written 2026-11-20.
-- Run in Supabase SQL Editor (supabase/RUN_026.sql has it wrapped as one transaction). Adds only; drops nothing.
--   1. profiles gain birth_date and gender. set_my_details / clear_my_details: the person sets or removes them.
--   2. request_loan_signature (treasurer) tells the borrower; sign_loan_terms (the borrower, on their own phone) stores
--      the ticked agreement and signature on the loan and tells the treasurer. Only the borrower can sign their loan.
--   3. my_chama_faces(): the photo of each Chama the person belongs to, for the Chama chooser.

------------------------------------------------------------------------------------------------
-- 1. About you
------------------------------------------------------------------------------------------------
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists details_at timestamptz;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_gender_check') then
    alter table public.profiles add constraint profiles_gender_check check (gender is null or gender in ('female', 'male', 'other', 'prefer_not'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_birth_date_check') then
    alter table public.profiles add constraint profiles_birth_date_check check (birth_date is null or birth_date > date '1900-01-01');
  end if;
end $$;

create or replace function public.set_my_details(p_full_name text default null, p_phone text default null, p_birth_date date default null, p_gender text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); fn text := nullif(btrim(coalesce(p_full_name, '')), ''); ph text := nullif(regexp_replace(coalesce(p_phone, ''), '[\s-]', '', 'g'), '');
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if fn is not null and char_length(fn) > 120 then raise exception 'Name is too long'; end if;
  if ph is not null and ph !~ '^\+?[0-9]{9,15}$' then raise exception 'That phone number looks wrong'; end if;
  if p_gender is not null and p_gender not in ('female', 'male', 'other', 'prefer_not') then raise exception 'Choose one of the options'; end if;
  if p_birth_date is not null and (p_birth_date <= date '1900-01-01' or p_birth_date > current_date - 13 * 365) then raise exception 'That date of birth does not look right'; end if;
  update public.profiles set full_name = coalesce(fn, full_name), phone = coalesce(ph, phone), birth_date = coalesce(p_birth_date, birth_date),
         gender = coalesce(p_gender, gender), details_at = now(), updated_at = now()
   where id = uid;
  if not found then raise exception 'Finish setting up your account first'; end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.get_my_details()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('full_name', p.full_name, 'phone', p.phone, 'birth_date', p.birth_date, 'gender', p.gender, 'details_at', p.details_at)
    from public.profiles p where p.id = auth.uid();
$$;

-- the person removes what they gave (name stays: it is needed to show who they are in a Chama)
create or replace function public.clear_my_details(p_what text[] default array['phone', 'birth_date', 'gender'])
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  update public.profiles set
    phone = case when 'phone' = any (p_what) then null else phone end,
    birth_date = case when 'birth_date' = any (p_what) then null else birth_date end,
    gender = case when 'gender' = any (p_what) then null else gender end,
    updated_at = now()
   where id = auth.uid();
end $$;

------------------------------------------------------------------------------------------------
-- 2. Loan terms signed on the borrower's own phone
------------------------------------------------------------------------------------------------
create or replace function public.request_loan_signature(p_cid text, p_loan text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare l jsonb; who uuid; cname text;
begin
  if private.my_role(p_cid) is distinct from 'treasurer' then raise exception 'Only the treasurer can send loan terms'; end if;
  select e into l from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'loans')) e where c.id = p_cid and e ->> 'id' = p_loan;
  if l is null then raise exception 'That loan was not found. Save it first, then try again.'; end if;
  select m.user_id into who from public.chama_members m where m.chama_id = p_cid and m.member_id = l ->> 'memberId' and m.status = 'active' and m.user_id is not null limit 1;
  if who is null then return jsonb_build_object('ok', false, 'reason', 'no_account'); end if;
  select name into cname from public.chamas where id = p_cid;
  perform private.notify(p_cid, 'loan_terms', 'Please read and sign your loan terms', 'Loan of KES ' || to_char(public.jnum(l -> 'principal'), 'FM999,999,999') || ' from ' || coalesce(cname, 'your Chama') || '. Open it to read what you will pay back and when, then sign.', '#/loans', null, who, null, 'action', jsonb_build_object('loan', p_loan));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.sign_loan_terms(p_cid text, p_loan text, p_sig text, p_total numeric, p_installment numeric, p_last_due date)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members; l jsonb; nm text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active';
  if not found or me.member_id is null then raise exception 'Your sign-in is not linked to a member yet'; end if;
  if p_sig is null or p_sig !~ '^data:image/png;base64,[A-Za-z0-9+/=]+$' or char_length(p_sig) > 80000 then raise exception 'The signature could not be read. Sign again.'; end if;
  select e into l from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'loans')) e where c.id = p_cid and e ->> 'id' = p_loan for update of c;
  if l is null then raise exception 'That loan was not found'; end if;
  if l ->> 'memberId' is distinct from me.member_id then raise exception 'Only the borrower can sign these terms'; end if;
  if l ? 'agreement' then return jsonb_build_object('ok', true, 'already', true); end if;
  update public.chamas c set data = jsonb_set(c.data, '{loans}', (
      select coalesce(jsonb_agg(case when e ->> 'id' = p_loan then e || jsonb_build_object('agreement', jsonb_build_object(
               'at', now(), 'sig', p_sig, 'total', p_total, 'installment', p_installment, 'lastDue', p_last_due, 'on', 'borrower phone', 'by', auth.uid())) else e end order by o), '[]'::jsonb)
        from jsonb_array_elements(public.jarr(c.data -> 'loans')) with ordinality x(e, o)))
   where c.id = p_cid;
  nm := private.person_name(auth.uid(), me.email);
  perform public.audit_log(p_cid, auth.uid(), 'loan.terms.signed', p_loan, jsonb_build_object('total', p_total));
  perform private.notify(p_cid, 'loan_signed', nm || ' signed the loan terms', 'The signed terms are kept with the loan.', '#/loans', array['treasurer'], null, auth.uid(), 'important', jsonb_build_object('loan', p_loan));
  return jsonb_build_object('ok', true);
end $$;

------------------------------------------------------------------------------------------------
-- 3. Chama photos for the chooser
------------------------------------------------------------------------------------------------
create or replace function public.my_chama_faces()
returns table(chama_id text, photo text)
language sql stable security definer set search_path = public, pg_temp as $$
  select c.id, c.data -> 'chama' ->> 'photo'
    from public.chamas c join public.chama_members m on m.chama_id = c.id
   where m.user_id = auth.uid() and m.status = 'active' and (c.data -> 'chama' ->> 'photo') ~ '^data:image/jpeg;base64,';
$$;

do $$ declare f text; begin
  foreach f in array array['public.set_my_details(text, text, date, text)', 'public.get_my_details()', 'public.clear_my_details(text[])',
    'public.request_loan_signature(text, text)', 'public.sign_loan_terms(text, text, text, numeric, numeric, date)', 'public.my_chama_faces()']
  loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;


-- ======================================== 027_one_phone_every_chama ========================================
-- 027: one phone number for every Chama. Written 2026-11-20. Adds only; drops nothing.
-- A person's phone lives on their profile. Their entry in each Chama's books gets that number:
--   * when they join a Chama (approved request, accepted invitation, linked to an entry) and the entry has no phone yet;
--   * when they change their number: every entry that still has the OLD number (or none) gets the new one.
-- A number the treasurer typed that differs from the profile is left alone, so a Chama can keep a different number on purpose.
-- Numbers are written the way the app writes them: 07XXXXXXXX / 01XXXXXXXX.

create or replace function private.local_phone(p text) returns text language sql immutable as $$
  select case
    when p is null or btrim(p) = '' then null
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^254[17][0-9]{8}$' then '0' || substr(regexp_replace(p, '[^0-9]', '', 'g'), 4)
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^0[17][0-9]{8}$' then regexp_replace(p, '[^0-9]', '', 'g')
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^[17][0-9]{8}$' then '0' || regexp_replace(p, '[^0-9]', '', 'g')
    else null end;
$$;

-- put the profile number on one member entry, if that entry has none (or still has the old number)
create or replace function private.member_phone_from_profile(p_cid text, p_mid text, p_phone text, p_old text default null)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare ph text := private.local_phone(p_phone); old text := private.local_phone(p_old);
begin
  if ph is null or p_mid is null then return; end if;
  update public.chamas c set data = jsonb_set(c.data, '{members}', (
      select coalesce(jsonb_agg(case when e ->> 'id' = p_mid and (coalesce(e ->> 'phone', '') = '' or (old is not null and private.local_phone(e ->> 'phone') = old))
                                     then e || jsonb_build_object('phone', ph) else e end order by o), '[]'::jsonb)
        from jsonb_array_elements(public.jarr(c.data -> 'members')) with ordinality x(e, o)))
   where c.id = p_cid
     and exists (select 1 from jsonb_array_elements(public.jarr(c.data -> 'members')) e
                  where e ->> 'id' = p_mid and coalesce(e ->> 'phone', '') is distinct from ph
                    and (coalesce(e ->> 'phone', '') = '' or (old is not null and private.local_phone(e ->> 'phone') = old)));
end $$;

-- joining (or being linked to an entry) brings the number along
create or replace function private.on_member_link_phone() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare ph text;
begin
  if new.status = 'active' and new.member_id is not null and new.user_id is not null
     and (tg_op = 'INSERT' or old.member_id is distinct from new.member_id or old.status is distinct from new.status or old.user_id is distinct from new.user_id) then
    select phone into ph from public.profiles where id = new.user_id;
    perform private.member_phone_from_profile(new.chama_id, new.member_id, ph, null);
  end if;
  return new;
end $$;
drop trigger if exists chama_members_link_phone on public.chama_members;
create trigger chama_members_link_phone after insert or update of status, member_id, user_id on public.chama_members
  for each row execute function private.on_member_link_phone();

-- changing the number on the profile updates every Chama that had the old one (or none)
create or replace function private.on_profile_phone() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare r record;
begin
  if new.phone is distinct from old.phone and private.local_phone(new.phone) is not null then
    for r in select m.chama_id, m.member_id from public.chama_members m where m.user_id = new.id and m.status = 'active' and m.member_id is not null loop
      perform private.member_phone_from_profile(r.chama_id, r.member_id, new.phone, old.phone);
    end loop;
  end if;
  return new;
end $$;
drop trigger if exists profiles_phone_to_chamas on public.profiles;
create trigger profiles_phone_to_chamas after update of phone on public.profiles
  for each row execute function private.on_profile_phone();

-- today: fill every empty member phone from the person's profile
do $$ declare r record; begin
  for r in select m.chama_id, m.member_id, p.phone from public.chama_members m join public.profiles p on p.id = m.user_id
            where m.status = 'active' and m.member_id is not null and p.phone is not null loop
    perform private.member_phone_from_profile(r.chama_id, r.member_id, r.phone, null);
  end loop;
end $$;

-- record them in Supabase's migration history, so tools see them as applied
do $$
declare v text[] := array['20261119230000', '20261119230100', '20261119230200', '20261120090000', '20261120120000'];
        n text[] := array['023_roles_offers_reasons_notices', '024_edit_messages', '025_invite_routing_and_usernames', '026_details_loan_signing_chama_faces', '027_one_phone_every_chama'];
        i int;
begin
  if to_regclass('supabase_migrations.schema_migrations') is null then return; end if;
  for i in 1 .. array_length(v, 1) loop
    if exists (select 1 from information_schema.columns where table_schema = 'supabase_migrations' and table_name = 'schema_migrations' and column_name = 'name') then
      execute 'insert into supabase_migrations.schema_migrations (version, name) values ($1, $2) on conflict do nothing' using v[i], n[i];
    else
      execute 'insert into supabase_migrations.schema_migrations (version) values ($1) on conflict do nothing' using v[i];
    end if;
  end loop;
end $$;

commit;

-- let the API see the new functions at once
notify pgrst, 'reload schema';

-- ===================================== CHECKS (read-only). Every row: ok = true =====================================
select 'table ' || t as check, to_regclass('public.' || t) is not null as ok
  from unnest(array['chama_role_offers', 'chama_removal_notices', 'retired_usernames', 'chama_awareness']) t
union all
select 'function ' || f, exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'private') and p.proname = f)
  from unnest(array['offer_role', 'respond_role_offer', 'cancel_role_offer', 'my_role_offers', 'list_role_offers', 'step_down', 'leave_chama_with_reason',
                    'remove_with_reason', 'reply_removal_notice', 'cancel_removal_notice', 'finish_removal', 'list_removal_notices', 'my_removal_notice',
                    'edit_chama_message', 'invitation_account', 'username_available', 'username_suggestions', 'record_awareness',
                    'set_my_details', 'get_my_details', 'clear_my_details', 'request_loan_signature', 'sign_loan_terms', 'my_chama_faces',
                    'member_phone_from_profile', 'local_phone']) f
union all select 'RLS on new tables', (select bool_and(relrowsecurity) from pg_class where oid in ('public.chama_role_offers'::regclass, 'public.chama_removal_notices'::regclass, 'public.retired_usernames'::regclass, 'public.chama_awareness'::regclass))
union all select 'signed-out visitors cannot change roles', not has_function_privilege('anon', 'public.offer_role(text,text,text,text)', 'execute')
union all select 'signed-out visitors cannot sign loans', not has_function_privilege('anon', 'public.sign_loan_terms(text,text,text,numeric,numeric,date)', 'execute')
union all select 'role offers are live', exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chama_role_offers')
union all select 'username triggers', (select count(*) = 2 from pg_trigger where tgrelid = 'public.profiles'::regclass and tgname in ('profiles_retire_username', 'profiles_block_retired'))
union all select 'phone triggers', (select count(*) = 2 from pg_trigger where tgname in ('chama_members_link_phone', 'profiles_phone_to_chamas'))
union all select 'birth date and gender columns', (select count(*) = 2 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name in ('birth_date', 'gender'));

-- Chamas with two treasurers or two secretaries (the app warns; the treasurer picks one). Empty is best.
select chama_id, role, count(*) from public.chama_members where status = 'active' and role in ('treasurer', 'secretary') group by 1, 2 having count(*) > 1;

-- Sample accounts that share one inbox (Gmail + aliases): rows here would explain "the same code reached everyone".
select lower(split_part(split_part(email, '@', 1), '+', 1)) || '@' || lower(split_part(email, '@', 2)) as inbox, count(*) as accounts
  from auth.users group by 1 having count(*) > 1;
