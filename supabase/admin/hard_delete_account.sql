-- =====================================================================================================
-- HARD DELETE ONE ACCOUNT, NOW (no 30-day hold). Project: sgfvjsxmchohawhqraii (My Chama).
-- Supabase → SQL Editor. Run STEP 1 first and read it. Then run STEP 2.
--
-- What is removed: the sign-in (auth user, identities, sessions, tokens, auth logs), the profile and username,
-- access to every Chama, invitations, join requests, role offers, removal notices, notifications, chat messages
-- they wrote, poll answers and read marks, consent records (and the consent archive copy), feedback,
-- sign-in throttle rows, invite-code attempts, and the "Know your Chama" agreement.
-- Their name in the audit log is erased (the entries stay, without who did them), so each Chama's history
-- of payments still adds up.
--
-- What stays, on purpose: the person's ENTRY IN EACH CHAMA'S BOOKS (name, payments, loans, fines). That is the
-- group's money record, not the account. When the new account joins, the treasurer links it to the old entry,
-- and the payments come back. If you also want that entry renamed, say so and use STEP 3.
--
-- Safety: STEP 2 is one transaction. It stops, and changes nothing, if this account is the only treasurer of any Chama:
-- hand that Chama to someone first (or tell Claude to delete that Chama on purpose). The username becomes free again.
-- =====================================================================================================

-- ---------- STEP 1: look before deleting (read-only) ----------
with u as (select id, email, created_at, last_sign_in_at from auth.users where lower(email) = lower('artislifefoundation2023@gmail.com'))
select 'account' as what, u.id::text as detail, u.email || ' · created ' || u.created_at::date || ' · last sign-in ' || coalesce(u.last_sign_in_at::date::text, 'never') as info from u
union all
select 'profile', p.username, coalesce(p.full_name, '') from public.profiles p join u on p.id = u.id
union all
select 'chama access', m.chama_id, m.role || ' · ' || m.status || ' · member entry ' || coalesce(m.member_id, 'none')
  from public.chama_members m, u where m.user_id = u.id or lower(m.email) = lower(u.email)
union all
select 'ONLY TREASURER (blocks delete)', m.chama_id, (select count(*) from public.chama_members x where x.chama_id = m.chama_id and x.status = 'active' and x.user_id is distinct from m.user_id)::text || ' other people with access · ' || coalesce((select jsonb_array_length(c.data -> 'members')::text from public.chamas c where c.id = m.chama_id), '?') || ' entries in its books'
  from public.chama_members m join u on m.user_id = u.id
 where m.role = 'treasurer' and m.status = 'active'
   and not exists (select 1 from public.chama_members o where o.chama_id = m.chama_id and o.role = 'treasurer' and o.status = 'active' and o.user_id is distinct from u.id)
union all
select 'messages written', count(*)::text, '' from public.chama_messages c join u on c.sender = u.id
union all
select 'notifications', count(*)::text, '' from public.chama_notifications n join u on n.recipient = u.id;
-- No "account" row = no account with that email (nothing to delete).


-- ---------- STEP 2: delete (one transaction; all or nothing) ----------
do $$
declare
  v_email text := lower('artislifefoundation2023@gmail.com');
  uid uuid; uname text; blocked text; t text;
begin
  select id into uid from auth.users where lower(email) = v_email;
  if uid is null then raise notice 'No account with % . Nothing was changed.', v_email; return; end if;
  select username into uname from public.profiles where id = uid;

  -- never leave a Chama without a treasurer: its books (including members added by name) would have no keeper
  select string_agg(m.chama_id, ', ') into blocked
    from public.chama_members m
   where m.user_id = uid and m.role = 'treasurer' and m.status = 'active'
     and not exists (select 1 from public.chama_members o where o.chama_id = m.chama_id and o.role = 'treasurer' and o.status = 'active' and o.user_id is distinct from uid);
  if blocked is not null then
    raise exception 'Stopped: this account is the only treasurer of Chama(s) %. Hand each one to someone else first (or delete that Chama on purpose). Nothing was changed.', blocked;
  end if;

  -- things keyed by email or by the account, that do not disappear on their own
  delete from public.chama_members where user_id = uid or lower(email) = v_email;
  delete from public.chama_invitations where lower(invited_email) = v_email;
  delete from public.chama_messages where sender = uid;                       -- their chat messages (replies by others stay)
  update public.chama_notifications set actor = null where actor = uid;
  update public.chama_audit a set target = null where lower(a.target) = v_email or a.target = uid::text;
  update public.chama_audit set actor = null where actor = uid;
  delete from public.consent_records where user_id = uid;
  delete from public.consent_archive where email_hash = encode(extensions.digest(v_email, 'sha256'), 'hex');
  delete from public.app_feedback where user_id = uid;
  delete from public.auth_throttle where key = 'id:' || encode(extensions.digest(v_email, 'sha256'), 'hex')
                                     or (uname is not null and key = 'id:' || encode(extensions.digest(lower(uname), 'sha256'), 'hex'));

  -- tables that only exist after some migrations: remove rows if the table is there
  foreach t in array array['chama_invite_attempts', 'chama_invite_redemptions', 'chama_join_requests', 'chama_role_offers', 'chama_removal_notices', 'chama_awareness'] loop
    if to_regclass('public.' || t) is not null then execute format('delete from public.%I where user_id = $1', t) using uid; end if;
  end loop;

  -- Supabase sign-in records (identities, sessions, refresh tokens and one-time tokens go with the user)
  if to_regclass('auth.flow_state') is not null then execute 'delete from auth.flow_state where user_id = $1' using uid; end if;
  delete from auth.audit_log_entries where payload ->> 'actor_id' = uid::text or lower(payload ->> 'actor_username') = v_email;
  delete from auth.users where id = uid;                                      -- cascades: profiles, member_profiles, notifications, poll answers, read marks

  -- free the username (a trigger may have retired it while the profile was deleted)
  if to_regclass('public.retired_usernames') is not null then delete from public.retired_usernames where user_id = uid; end if;

  raise notice 'Deleted % (%). Username % is free again.', v_email, uid, coalesce(uname, '(none)');
end $$;

-- ---------- check: should return no rows ----------
select 'still there' as problem, id::text from auth.users where lower(email) = lower('artislifefoundation2023@gmail.com')
union all select 'access row', chama_id from public.chama_members where lower(email) = lower('artislifefoundation2023@gmail.com')
union all select 'invitation', chama_id from public.chama_invitations where lower(invited_email) = lower('artislifefoundation2023@gmail.com');


-- ---------- STEP 3 (optional): also rename their entry in a Chama's books ----------
-- Only if the group agrees the old name should go. Payments stay attached to the entry.
-- update public.chamas c set data = jsonb_set(c.data, '{members}', (
--     select jsonb_agg(case when e ->> 'id' = '<member entry id from STEP 1>' then e || '{"name": "Former member"}'::jsonb - 'phone' - 'photo' else e end order by o)
--       from jsonb_array_elements(c.data -> 'members') with ordinality x(e, o)))
--  where c.id = '<chama id from STEP 1>';
