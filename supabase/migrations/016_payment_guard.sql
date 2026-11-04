-- 016_payment_guard.sql
-- Purpose: stop a double tap, retry or repeated M-Pesa code from recording the same payment twice.
-- Applied to staging (tuvkzsmqgvtwrxuzvuul) on 2026-11-04 and tested there (7 cases, all as designed).
-- Prereqs: 000 to 015 applied. Rollback: drop function record_payment; drop table chama_payments (take a backup first).
begin;
create table if not exists public.chama_payments (
  id          uuid primary key default gen_random_uuid(),
  chama_id    text not null references public.chamas(id) on delete cascade,
  member_id   text not null,
  month       text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  amount      numeric(12,2) not null check (amount > 0 and amount < 10000000),
  mpesa_code  text check (mpesa_code is null or mpesa_code ~ '^[A-Z0-9]{6,15}$'),
  paid_on     date not null default current_date,
  idem_key    uuid not null,
  recorded_by uuid,
  created_at  timestamptz not null default now(),
  unique (chama_id, idem_key)
);
create unique index if not exists chama_payments_one_code on public.chama_payments (chama_id, mpesa_code) where mpesa_code is not null;
alter table public.chama_payments enable row level security;
revoke all on public.chama_payments from anon, authenticated;

create or replace function public.record_payment(p_cid text, p_member text, p_month text, p_amount numeric, p_code text, p_date date, p_idem uuid)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); code text := nullif(upper(btrim(coalesce(p_code, ''))), ''); newid uuid; existing uuid;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.chama_can(p_cid, 'finance.record') then raise exception 'Only the treasurer can record payments'; end if;
  if p_idem is null then raise exception 'Missing request key'; end if;
  if p_month is null or p_month !~ '^[0-9]{4}-[0-9]{2}$' then raise exception 'Month must look like 2026-11'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Amount must be more than zero'; end if;
  if not exists (select 1 from public.chamas c, jsonb_array_elements(case when jsonb_typeof(c.data->'members') = 'array' then c.data->'members' else '[]'::jsonb end) e
                  where c.id = p_cid and e->>'id' = p_member) then
    raise exception 'That member is not in this Chama';
  end if;
  select id into existing from public.chama_payments where chama_id = p_cid and idem_key = p_idem;
  if found then return jsonb_build_object('ok', true, 'status', 'duplicate_request', 'id', existing); end if;
  begin
    insert into public.chama_payments (chama_id, member_id, month, amount, mpesa_code, paid_on, idem_key, recorded_by)
    values (p_cid, p_member, p_month, p_amount, code, coalesce(p_date, current_date), p_idem, uid)
    returning id into newid;
  exception when unique_violation then
    if code is not null and exists (select 1 from public.chama_payments where chama_id = p_cid and mpesa_code = code) then
      return jsonb_build_object('ok', false, 'status', 'duplicate_code', 'error', 'This M-Pesa code is already recorded in this Chama.');
    end if;
    select id into existing from public.chama_payments where chama_id = p_cid and idem_key = p_idem;
    return jsonb_build_object('ok', true, 'status', 'duplicate_request', 'id', existing);
  end;
  perform public.audit_log(p_cid, uid, 'payment.record', p_member, jsonb_build_object('month', p_month, 'amount', p_amount, 'code', code));
  return jsonb_build_object('ok', true, 'status', 'created', 'id', newid);
end $$;
revoke all on function public.record_payment(text, text, text, numeric, text, date, uuid) from public, anon;
grant execute on function public.record_payment(text, text, text, numeric, text, date, uuid) to authenticated;
commit;
