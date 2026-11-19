-- 022: leaving and rejoining. Applied to project sgfvjsxmchohawhqraii on 2026-11-19 (no drops).
-- What changed (the live definitions are authoritative; dump them with the query at the bottom):
--   * private.set_member_left(cid, member_id, 'YYYY-MM' | null): marks a member-list entry as left, or clears it.
--   * private.previous_member_id(cid, email, user): the entry a person had before they left, if it is still unclaimed.
--   * leave_chama, remove_member: mark the entry "left" from this month, so the person is not owed new contributions.
--   * accept_invitation, decide_join_request: "new" reuses the person's previous entry instead of adding a duplicate; clear "left".
--   * link_member_record: clears "left" when an entry is linked again.
--   * get_chama_view: members see "left" on entries; memberCount counts only current members.
--   * chama_join_requests added to supabase_realtime, so an approval reaches the waiting person at once.
--   * Repair: the duplicate "Agnes" entry in "Test chama sample." was merged into her original entry (payments moved).

create or replace function private.set_member_left(p_cid text, p_mid text, p_left text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if p_mid is null then return; end if;
  update public.chamas c set data = jsonb_set(c.data, '{members}', (
      select coalesce(jsonb_agg(case when e ->> 'id' = p_mid then (case when p_left is null then e - 'left' else e || jsonb_build_object('left', p_left) end) else e end order by o), '[]'::jsonb)
        from jsonb_array_elements(public.jarr(c.data -> 'members')) with ordinality x(e, o)))
   where c.id = p_cid;
end $$;

create or replace function private.previous_member_id(p_cid text, p_email text, p_user uuid)
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select m.member_id from public.chama_members m
   where m.chama_id = p_cid and (m.email = lower(p_email) or m.user_id = p_user) and m.member_id is not null
     and exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = p_cid and e ->> 'id' = m.member_id)
     and not exists (select 1 from public.chama_members a where a.chama_id = p_cid and a.member_id = m.member_id and a.status = 'active' and a.user_id is distinct from p_user)
   order by m.updated_at desc nulls last limit 1;
$$;

do $$ begin begin alter publication supabase_realtime add table public.chama_join_requests; exception when duplicate_object then null; end; end $$;

-- To export the current definitions of the changed public functions:
-- select string_agg(pg_get_functiondef(p.oid) || ';', E'\n\n') from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--  where n.nspname = 'public' and p.proname in ('leave_chama','remove_member','accept_invitation','decide_join_request','link_member_record','get_chama_view');
