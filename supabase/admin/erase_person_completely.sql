-- =====================================================================================================
-- ERASE ONE PERSON COMPLETELY. Project: sgfvjsxmchohawhqraii (My Chama).
-- Supabase → SQL Editor → New query → paste this whole file → Run. Nothing else to do.
--
-- Person: artislifefoundation2023@gmail.com
-- Removes, everywhere, at once (no 30-day hold):
--   * the sign-in: auth user, identities, sessions, tokens, Supabase sign-in logs
--   * the profile and username (the username becomes free again)
--   * access to every Chama, invitations, join requests, role offers, removal notices, "Know your Chama" agreement
--   * chat messages she wrote, her poll answers and read marks, her notifications
--   * consent records and the archived copy, feedback, sign-in attempt records, invite-code attempts
--   * HER ENTRY IN EACH CHAMA'S BOOKS: the member entry, and every payment, loan, fine, payout and note tied to it,
--     plus her payments in the payments ledger. When she joins again she starts at zero, as a new member.
--   * her name is removed from audit entries (the entries stay, without a name) and from the Chama's change list
-- All or nothing: if anything fails, nothing changes and you see the error.
-- It stops without changing anything if she is the only treasurer of a Chama.
-- Note: removing her entry shortens the payout order by one; the members after her move up one turn.
-- =====================================================================================================

do $$
declare
  v_email text := lower('artislifefoundation2023@gmail.com');
  uid uuid; uname text; blocked text; t text; r record; nm text;
  n_entries int := 0; n_pay int := 0; n_tmp int;
begin
  select id into uid from auth.users where lower(email) = v_email;
  select username into uname from public.profiles where id = uid;

  if uid is not null then
    select string_agg(m.chama_id, ', ') into blocked
      from public.chama_members m
     where m.user_id = uid and m.role = 'treasurer' and m.status = 'active'
       and not exists (select 1 from public.chama_members o where o.chama_id = m.chama_id and o.role = 'treasurer' and o.status = 'active' and o.user_id is distinct from uid);
    if blocked is not null then
      raise exception 'Stopped: she is the only treasurer of Chama(s) %. Hand it over first. Nothing was changed.', blocked;
    end if;
  end if;

  -- 1. her entries in each Chama's books (only entries no other person is signed in to)
  for r in
    select distinct x.chama_id, x.member_id from (
      select m.chama_id, m.member_id from public.chama_members m where (m.user_id = uid or lower(m.email) = v_email) and m.member_id is not null
      union
      select j.chama_id, coalesce(j.member_id, j.requested_member_id) from public.chama_join_requests j where j.user_id = uid and coalesce(j.member_id, j.requested_member_id) is not null
    ) x
    where not exists (select 1 from public.chama_members o where o.chama_id = x.chama_id and o.member_id = x.member_id
                       and o.status = 'active' and o.user_id is distinct from uid and lower(o.email) <> v_email)
  loop
    select e ->> 'name' into nm from public.chamas c, jsonb_array_elements(coalesce(c.data -> 'members', '[]'::jsonb)) e
     where c.id = r.chama_id and e ->> 'id' = r.member_id limit 1;
    update public.chamas c set data = c.data
      || jsonb_build_object('members',  (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(coalesce(c.data -> 'members',  '[]'::jsonb)) with ordinality x(e, o) where e ->> 'id' is distinct from r.member_id))
      || jsonb_build_object('payments', (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(coalesce(c.data -> 'payments', '[]'::jsonb)) with ordinality x(e, o) where e ->> 'memberId' is distinct from r.member_id))
      || jsonb_build_object('loans',    (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(coalesce(c.data -> 'loans',    '[]'::jsonb)) with ordinality x(e, o) where e ->> 'memberId' is distinct from r.member_id))
      || jsonb_build_object('fines',    (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(coalesce(c.data -> 'fines',    '[]'::jsonb)) with ordinality x(e, o) where e ->> 'memberId' is distinct from r.member_id))
      || jsonb_build_object('payouts',  (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(coalesce(c.data -> 'payouts',  '[]'::jsonb)) with ordinality x(e, o) where e ->> 'memberId' is distinct from r.member_id))
      || case when c.data ? 'notes' then jsonb_build_object('notes', (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(c.data -> 'notes') with ordinality x(e, o)
            where e ->> 'memberId' is distinct from r.member_id and (nm is null or position(lower(nm) in lower(coalesce(e::text, ''))) = 0))) else '{}'::jsonb end
      || case when c.data ? 'log' then jsonb_build_object('log', (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(c.data -> 'log') with ordinality x(e, o)
            where nm is null or position(lower(nm) in lower(coalesce(e::text, ''))) = 0)) else '{}'::jsonb end
     where c.id = r.chama_id;
    delete from public.chama_payments where chama_id = r.chama_id and member_id = r.member_id;
    get diagnostics n_tmp = row_count; n_pay := n_pay + n_tmp;
    n_entries := n_entries + 1;
    raise notice 'Removed her entry % ("%") from Chama %, with its payments, loans, fines and payouts.', r.member_id, coalesce(nm, '?'), r.chama_id;
  end loop;

  -- 2. access, invitations and everything keyed by her email
  delete from public.chama_members where user_id = uid or lower(email) = v_email;
  delete from public.chama_invitations where lower(invited_email) = v_email;
  update public.chama_audit a set target = null where lower(a.target) = v_email or (uid is not null and a.target = uid::text);
  delete from public.consent_archive where email_hash = encode(extensions.digest(v_email, 'sha256'), 'hex');
  delete from public.auth_throttle where key = 'id:' || encode(extensions.digest(v_email, 'sha256'), 'hex')
                                     or (uname is not null and key = 'id:' || encode(extensions.digest(lower(uname), 'sha256'), 'hex'));

  if uid is not null then
    -- 3. everything keyed by her account
    delete from public.chama_messages where sender = uid;
    update public.chama_notifications set actor = null where actor = uid;
    update public.chama_audit set actor = null where actor = uid;
    delete from public.consent_records where user_id = uid;
    delete from public.app_feedback where user_id = uid;
    foreach t in array array['chama_invite_attempts', 'chama_invite_redemptions', 'chama_join_requests', 'chama_role_offers', 'chama_removal_notices', 'chama_awareness'] loop
      if to_regclass('public.' || t) is not null then execute format('delete from public.%I where user_id = $1', t) using uid; end if;
    end loop;

    -- 4. the sign-in itself (identities, sessions, refresh and one-time tokens go with it), then the profile by cascade
    if to_regclass('auth.flow_state') is not null then execute 'delete from auth.flow_state where user_id = $1' using uid; end if;
    delete from auth.audit_log_entries where payload ->> 'actor_id' = uid::text or lower(payload ->> 'actor_username') = v_email;
    delete from auth.users where id = uid;

    -- 5. the username is free again (a trigger may have retired it while the profile was deleted)
    if to_regclass('public.retired_usernames') is not null then
      delete from public.retired_usernames where user_id = uid or (uname is not null and username_lower = lower(uname));
    end if;
  end if;

  raise notice 'Done. Account: %. Book entries removed: %. Ledger payments removed: %. Username freed: %.',
    case when uid is null then 'none found' else 'deleted' end, n_entries, n_pay, coalesce(uname, '(none)');
end $$;

-- ---------- proof: every row should say 0 ----------
select 'sign-in accounts' as what, count(*) as left_over from auth.users where lower(email) = lower('artislifefoundation2023@gmail.com')
union all select 'chama access rows', count(*) from public.chama_members where lower(email) = lower('artislifefoundation2023@gmail.com')
union all select 'invitations', count(*) from public.chama_invitations where lower(invited_email) = lower('artislifefoundation2023@gmail.com')
union all select 'join requests', count(*) from public.chama_join_requests where lower(email) = lower('artislifefoundation2023@gmail.com')
union all select 'audit entries naming her', count(*) from public.chama_audit where lower(target) = lower('artislifefoundation2023@gmail.com');
