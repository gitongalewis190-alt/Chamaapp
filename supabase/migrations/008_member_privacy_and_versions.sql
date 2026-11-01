-- 008_member_privacy_and_versions.sql      STATUS: DRAFT, not applied anywhere. Requires 002. Run AFTER the new app is ready (it changes what members can read).
-- Purpose: D3 / D8 financial and personal privacy + protection against two people overwriting each other.
--   * Only people with finance.view_all (the treasurer) may read the full chamas row.
--   * Everyone else reads get_chama_view(): own payments/loans/fines + group totals. Other members' money is never sent to their phone.
--   * chamas.version goes up on every save so the app can detect a conflicting save instead of silently overwriting.
--   * member_profiles (phone, email, photo): own row, or treasurer.
begin;

alter table public.chamas add column if not exists version bigint not null default 1;
create or replace function public.chamas_bump_version() returns trigger language plpgsql as $$
begin
  if new.data is distinct from old.data then new.version := old.version + 1; new.updated_at := now(); end if;
  return new;
end $$;
drop trigger if exists chamas_bump on public.chamas;
create trigger chamas_bump before update on public.chamas for each row execute function public.chamas_bump_version();

drop policy if exists chamas_read on public.chamas;
create policy chamas_read on public.chamas for select to authenticated using (public.chama_can(id, 'finance.view_all'));

drop policy if exists profiles_read on public.member_profiles;
create policy profiles_read on public.member_profiles for select to authenticated
  using (user_id = auth.uid() or public.chama_can(chama_id, 'members.view_list'));

-- safe numeric read from json (text or garbage counts as 0)
create or replace function public.jnum(x jsonb) returns numeric language sql immutable as $$
  select case when jsonb_typeof(x) = 'number' then (x #>> '{}')::numeric
              when jsonb_typeof(x) = 'string' and (x #>> '{}') ~ '^-?[0-9]+(\.[0-9]+)?$' then (x #>> '{}')::numeric else 0 end $$;
create or replace function public.jarr(x jsonb) returns jsonb language sql immutable as $$
  select case when jsonb_typeof(x) = 'array' then x else '[]'::jsonb end $$;

-- What the signed-in person may see of one Chama.
create or replace function public.get_chama_view(cid text) returns jsonb
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare c public.chamas; m public.chama_members; mid text; d jsonb; out jsonb; sh jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into m from public.chama_members x where x.chama_id = cid and x.user_id = auth.uid() and x.status = 'active';
  if not found then raise exception 'You are not a member of this Chama'; end if;
  select * into c from public.chamas where id = cid;
  if not found then raise exception 'Chama not found'; end if;
  if public.chama_can(cid, 'finance.view_all') then
    return jsonb_build_object('limited', false, 'role', m.role, 'member_id', m.member_id, 'version', c.version, 'updated_at', c.updated_at, 'data', c.data);
  end if;
  mid := m.member_id; d := c.data;
  sh := jsonb_build_object(
    'memberCount', jsonb_array_length(public.jarr(d -> 'members')),
    'collected',   (select coalesce(sum(public.jnum(e -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'payments')) e),
    'monthCollected', (select coalesce(jsonb_object_agg(mo, t), '{}'::jsonb) from (
                         select e ->> 'month' mo, sum(public.jnum(e -> 'amount')) t from jsonb_array_elements(public.jarr(d -> 'payments')) e
                          where e ->> 'month' is not null group by 1) q),
    'finesPaid',   (select coalesce(sum(public.jnum(e -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'fines')) e where e -> 'paid' = 'true'::jsonb),
    'loansOut',    (select coalesce(sum(public.jnum(e -> 'principal')), 0) from jsonb_array_elements(public.jarr(d -> 'loans')) e),
    'repaid',      (select coalesce(sum(public.jnum(r -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'loans')) e, jsonb_array_elements(public.jarr(e -> 'repayments')) r),
    'loansBalance',(select coalesce(sum(greatest(0, public.jnum(e -> 'principal') * (1 + public.jnum(e -> 'rate') / 100 * public.jnum(e -> 'months'))
                        - (select coalesce(sum(public.jnum(r -> 'amount')), 0) from jsonb_array_elements(public.jarr(e -> 'repayments')) r))), 0)
                      from jsonb_array_elements(public.jarr(d -> 'loans')) e),
    'finesDue',    (select coalesce(sum(public.jnum(e -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'fines')) e where e -> 'paid' is distinct from 'true'::jsonb),
    'payoutsTotal',(select coalesce(sum(public.jnum(e -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'payouts')) e),
    'expensesTotal',(select coalesce(sum(public.jnum(e -> 'amount')), 0) from jsonb_array_elements(public.jarr(d -> 'expenses')) e));
  sh := sh || jsonb_build_object('cashOnHand',
        (sh ->> 'collected')::numeric + (sh ->> 'finesPaid')::numeric + (sh ->> 'repaid')::numeric
        - (sh ->> 'loansOut')::numeric - (sh ->> 'payoutsTotal')::numeric - (sh ->> 'expensesTotal')::numeric);
  out := jsonb_build_object(
    'chama',    (d -> 'chama') - 'pin',
    'members',  (select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object('id', e -> 'id', 'name', e -> 'name', 'shares', e -> 'shares', 'joined', e -> 'joined'))), '[]'::jsonb)
                   from jsonb_array_elements(public.jarr(d -> 'members')) e),
    'payments', (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(public.jarr(d -> 'payments')) e where mid is not null and e ->> 'memberId' = mid),
    'loans',    (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(public.jarr(d -> 'loans'))    e where mid is not null and e ->> 'memberId' = mid),
    'fines',    (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(public.jarr(d -> 'fines'))    e where mid is not null and e ->> 'memberId' = mid),
    'payouts',  (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(public.jarr(d -> 'payouts')) e where mid is not null and e ->> 'memberId' = mid),
    'expenses', public.jarr(d -> 'expenses'),
    'log',      '[]'::jsonb,
    'notes',    (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(public.jarr(d -> 'notes')) e where mid is not null and e ->> 'to' = mid),
    'shared',   sh);
  return jsonb_build_object('limited', true, 'role', m.role, 'member_id', mid, 'version', c.version, 'updated_at', c.updated_at, 'data', out);
end $$;
revoke all on function public.get_chama_view(text) from public, anon;
grant execute on function public.get_chama_view(text) to authenticated;

commit;
-- ROLLBACK NOTES: recreate policy chamas_read ... using (public.is_active_member(id)); recreate profiles_read using (public.is_active_member(chama_id));
--   drop function get_chama_view(text), jnum(jsonb), jarr(jsonb); drop trigger chamas_bump on public.chamas; drop function chamas_bump_version(); alter table chamas drop column version.
-- KNOWN LIMITS: chat-style 'notes' addressed to everyone are not forwarded to members yet; the full 'log' stays treasurer-only.
