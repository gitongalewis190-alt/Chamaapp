-- 030_integrity_serials_verify.sql  (My Chama 0.20.0)
-- Purpose:
--   1. Serials: every payment (and on request payouts, loans, fines, expenses, documents, receipts) gets a serial
--      MC-<TAG4>-<YYMM>-<XXXX>-<CC> kept in public.chama_serials with a SHA-256 hash of its details.
--      verify_serial lets any signed-in person check a serial (rate-limited, returns only short facts).
--   2. Self-recorded payments: the treasurer recording their OWN payment must attach evidence (M-Pesa SMS or a photo
--      in the private bucket payment-evidence). Such payments are marked self_recorded and wait for another officer
--      to confirm them (confirm_payment). Large and backdated payments are flagged.
--   3. A trigger on public.chamas refuses NEW JSON payments that were not recorded through the server, keeps
--      selfRec / chk / serial / flags in the JSON equal to the server row (treasurers cannot forge them), and
--      notifies + audit-logs changes and deletions of payments.
--   4. Emergency removal of a member by the treasurer, confirmed with the treasurer's own password.
--   5. Profiles: details_at (already present) and dob_source; get_my_details returns both; set_dob_source.
-- Re-runnable. Prereqs: 000 to 029. Project: sgfvjsxmchohawhqraii only.
--
-- Serial check characters (the app may check them offline): s = serial body "MC-TAG4-YYMM-XXXX" without dashes,
--   a = sum over i = 1..len(s) of i * ascii(s[i]);  b = sum of (2i + 1) * ascii(s[i]);
--   CC = ALPHA[a mod 31] || ALPHA[b mod 31] with ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' (0-based).
--
-- Rollback (take a backup first): drop trigger chamas_payment_integrity on public.chamas; drop the new functions;
--   drop table public.chama_serials; alter table public.chama_payments drop column evidence, self_recorded, checked_by,
--   checked_at, flags, serial; alter table public.profiles drop column dob_source; restore record_payment and
--   get_my_details / set_my_details from 016 / 029.

------------------------------------------------------------------------------------------------
-- 1. Tables and columns
------------------------------------------------------------------------------------------------
alter table public.chama_payments add column if not exists evidence jsonb;
alter table public.chama_payments add column if not exists self_recorded boolean not null default false;
alter table public.chama_payments add column if not exists checked_by uuid;
alter table public.chama_payments add column if not exists checked_at timestamptz;
alter table public.chama_payments add column if not exists flags text[] not null default '{}';
alter table public.chama_payments add column if not exists serial text;

create table if not exists public.chama_serials (
  serial     text primary key check (serial ~ '^MC-[A-Z0-9]{4}-[0-9]{4}-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{2}$'),
  chama_id   text not null references public.chamas(id) on delete cascade,
  kind       text not null check (kind in ('payment', 'payout', 'loan', 'fine', 'expense', 'document', 'receipt')),
  ref_id     text not null check (char_length(ref_id) between 1 and 100),
  member_id  text,
  amount     numeric(14,2),
  date       date,
  mpesa_code text,
  issued_at  timestamptz not null default now(),
  issued_by  uuid,
  hash       text not null
);
create unique index if not exists chama_serials_ref on public.chama_serials (chama_id, kind, ref_id);
alter table public.chama_serials enable row level security;
revoke all on public.chama_serials from public, anon, authenticated;

alter table public.profiles add column if not exists details_at timestamptz;
alter table public.profiles add column if not exists dob_source text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_dob_source_check') then
    alter table public.profiles add constraint profiles_dob_source_check check (dob_source is null or dob_source in ('self', 'id_scan', 'verified'));
  end if;
end $$;

------------------------------------------------------------------------------------------------
-- 2. Serial helpers (private: not callable by clients)
------------------------------------------------------------------------------------------------
create or replace function private.serial_check(p_body text)
returns text language sql immutable set search_path = public, pg_temp as $$
  with s as (select replace(p_body, '-', '') t),
       x as (select coalesce(sum(i * ascii(substr(t, i, 1))), 0) a, coalesce(sum((2 * i + 1) * ascii(substr(t, i, 1))), 0) b
               from s, generate_series(1, char_length(t)) i)
  select substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', (a % 31)::int + 1, 1) || substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', (b % 31)::int + 1, 1) from x;
$$;

create or replace function private.serial_hash(r public.chama_serials)
returns text language sql stable set search_path = public, extensions, pg_temp as $$
  select encode(extensions.digest(concat_ws('|', r.serial, r.chama_id, r.kind, r.ref_id, coalesce(r.member_id, ''),
           coalesce(trim_scale(r.amount)::text, ''), coalesce(r.date::text, ''), coalesce(r.mpesa_code, ''),
           to_char(r.issued_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'), coalesce(r.issued_by::text, '')), 'sha256'), 'hex');
$$;

create or replace function private.issue_serial(p_cid text, p_kind text, p_ref text, p_member text, p_amount numeric, p_date date, p_code text, p_by uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare r public.chama_serials; tag text; d date := coalesce(p_date, (now() at time zone 'Africa/Nairobi')::date);
        alpha constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; body text; x text; tries int := 0; b bytea;
begin
  select * into r from public.chama_serials where chama_id = p_cid and kind = p_kind and ref_id = p_ref;
  if found then return jsonb_build_object('serial', r.serial, 'hash', r.hash, 'issued_at', r.issued_at); end if;
  select left(regexp_replace(upper(coalesce(nullif(c.display_tag, ''), c.name, c.id)), '[^A-Z0-9]', '', 'g') || 'XXXX', 4) into tag
    from public.chamas c where c.id = p_cid;
  if tag is null then raise exception 'Chama not found'; end if;
  loop
    tries := tries + 1;
    b := extensions.gen_random_bytes(4); x := '';
    for i in 0..3 loop x := x || substr(alpha, (get_byte(b, i) % 31) + 1, 1); end loop;
    body := 'MC-' || tag || '-' || to_char(d, 'YYMM') || '-' || x;
    r := null;
    r.serial := body || '-' || private.serial_check(body);
    r.chama_id := p_cid; r.kind := p_kind; r.ref_id := p_ref; r.member_id := p_member; r.amount := p_amount; r.date := d;
    r.mpesa_code := nullif(upper(btrim(coalesce(p_code, ''))), ''); r.issued_at := now(); r.issued_by := p_by;
    r.hash := private.serial_hash(r);
    begin
      insert into public.chama_serials values (r.*);
      exit;
    exception when unique_violation then
      -- same (chama, kind, ref) issued at the same moment: return that one; otherwise a serial clash: try again
      if exists (select 1 from public.chama_serials where chama_id = p_cid and kind = p_kind and ref_id = p_ref) then
        select * into r from public.chama_serials where chama_id = p_cid and kind = p_kind and ref_id = p_ref; exit;
      end if;
      if tries > 8 then raise; end if;
    end;
  end loop;
  return jsonb_build_object('serial', r.serial, 'hash', r.hash, 'issued_at', r.issued_at);
end $$;

------------------------------------------------------------------------------------------------
-- 3. issue_serial / verify_serial
------------------------------------------------------------------------------------------------
create or replace function public.issue_serial(p_cid text, p_kind text, p_ref text, p_member text default null, p_amount numeric default null,
                                               p_date date default null, p_code text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active' limit 1;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if p_kind is null or p_kind not in ('payment', 'payout', 'loan', 'fine', 'expense', 'document', 'receipt') then raise exception 'Unknown kind'; end if;
  if p_ref is null or btrim(p_ref) = '' or char_length(p_ref) > 100 then raise exception 'Missing reference'; end if;
  if p_amount is not null and (p_amount < 0 or p_amount >= 1000000000) then raise exception 'Amount looks wrong'; end if;
  if me.role not in ('treasurer', 'secretary') then
    if p_kind <> 'document' or p_member is null or p_member is distinct from me.member_id then raise exception 'Only an officer can issue this serial'; end if;
  end if;
  if p_member is not null and not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e
                                           where c.id = p_cid and e ->> 'id' = p_member) then
    raise exception 'That member is not in this Chama';
  end if;
  return private.issue_serial(p_cid, p_kind, btrim(p_ref), p_member, p_amount, p_date, p_code, auth.uid());
end $$;

create or replace function private.short_name(p_name text)
returns text language sql immutable set search_path = public, pg_temp as $$
  select case when p_name is null or btrim(p_name) = '' then null
              when array_length(regexp_split_to_array(btrim(p_name), '\s+'), 1) = 1 then btrim(p_name)
              else (regexp_split_to_array(btrim(p_name), '\s+'))[1] || ' '
                   || upper(left((regexp_split_to_array(btrim(p_name), '\s+'))[array_length(regexp_split_to_array(btrim(p_name), '\s+'), 1)], 1)) || '.' end;
$$;

create or replace function public.verify_serial(p_serial text, p_name text default null, p_date date default null, p_amount numeric default null, p_code text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare s text := upper(regexp_replace(coalesce(p_serial, ''), '\s', '', 'g')); r public.chama_serials; full_name text; cname text;
        given text[]; have text[]; name_ok boolean;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.auth_throttle_hit('verify:' || auth.uid()::text, 30, 60) then
    return jsonb_build_object('found', false, 'status', 'slow_down', 'error', 'Too many checks. Wait a minute.');
  end if;
  if s !~ '^MC-[A-Z0-9]{4}-[0-9]{4}-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{2}$' then
    return jsonb_build_object('found', false, 'genuine', false, 'error', 'That is not a My Chama serial');
  end if;
  if private.serial_check(left(s, char_length(s) - 3)) <> right(s, 2) then
    return jsonb_build_object('found', false, 'genuine', false, 'error', 'That serial has a typing mistake');
  end if;
  select * into r from public.chama_serials where serial = s;
  if not found then return jsonb_build_object('found', false, 'genuine', false); end if;
  select c.name, (select e ->> 'name' from jsonb_array_elements(public.jarr(c.data -> 'members')) e where e ->> 'id' = r.member_id limit 1)
    into cname, full_name from public.chamas c where c.id = r.chama_id;
  if nullif(btrim(coalesce(p_name, '')), '') is not null then
    given := array(select t from regexp_split_to_table(lower(regexp_replace(p_name, '[^[:alpha:] ]', ' ', 'g')), '\s+') t where t <> '');
    have := array(select t from regexp_split_to_table(lower(regexp_replace(coalesce(full_name, ''), '[^[:alpha:] ]', ' ', 'g')), '\s+') t where t <> '');
    name_ok := cardinality(given) > 0 and cardinality(have) > 0
               and not exists (select 1 from unnest(given) g where not exists (select 1 from unnest(have) h where h = g or (char_length(g) = 1 and left(h, 1) = g)));
  end if;
  return jsonb_build_object('found', true, 'genuine', r.hash = private.serial_hash(r), 'kind', r.kind, 'chama', cname, 'date', r.date,
    'amount', r.amount, 'member', private.short_name(full_name),
    'match', jsonb_build_object(
      'name', name_ok,
      'date', case when p_date is null then null else p_date = r.date end,
      'amount', case when p_amount is null then null else p_amount = r.amount end,
      'code', case when nullif(btrim(coalesce(p_code, '')), '') is null then null else upper(btrim(p_code)) = coalesce(r.mpesa_code, '') end));
end $$;

------------------------------------------------------------------------------------------------
-- 4. Payments: record_payment_v2, old record_payment, confirm_payment, payment_checks
------------------------------------------------------------------------------------------------
create or replace function public.record_payment_v2(p_cid text, p_member text, p_month text, p_amount numeric, p_code text, p_date date, p_idem uuid,
                                                    p_evidence jsonb default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); code text := nullif(upper(btrim(coalesce(p_code, ''))), ''); d date := coalesce(p_date, (now() at time zone 'Africa/Nairobi')::date);
        me public.chama_members; is_self boolean; ev jsonb; t text; ecode text; amt numeric; monthly numeric; fl text[] := '{}';
        newid uuid; ex public.chama_payments; sr jsonb;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.chama_can(p_cid, 'finance.record') then return jsonb_build_object('ok', false, 'error', 'Only the treasurer can record payments'); end if;
  if p_idem is null then return jsonb_build_object('ok', false, 'error', 'Missing request key'); end if;
  if p_month is null or p_month !~ '^[0-9]{4}-[0-9]{2}$' then return jsonb_build_object('ok', false, 'error', 'Month must look like 2026-11'); end if;
  if p_amount is null or p_amount <= 0 or p_amount >= 10000000 then return jsonb_build_object('ok', false, 'error', 'Amount must be more than zero'); end if;
  if code is not null and code !~ '^[A-Z0-9]{6,15}$' then return jsonb_build_object('ok', false, 'error', 'That M-Pesa code looks wrong'); end if;
  if d > (now() at time zone 'Africa/Nairobi')::date + 1 then return jsonb_build_object('ok', false, 'error', 'The date is in the future'); end if;
  if not exists (select 1 from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = p_cid and e ->> 'id' = p_member) then
    return jsonb_build_object('ok', false, 'error', 'That member is not in this Chama');
  end if;
  select * into ex from public.chama_payments where chama_id = p_cid and idem_key = p_idem;
  if found then
    return jsonb_build_object('ok', true, 'status', 'duplicate_request', 'id', ex.id, 'serial', ex.serial, 'self_recorded', ex.self_recorded, 'flags', to_jsonb(ex.flags));
  end if;
  if code is not null and exists (select 1 from public.chama_payments where chama_id = p_cid and mpesa_code = code) then
    return jsonb_build_object('ok', false, 'status', 'duplicate_code', 'error', 'This M-Pesa code is already recorded in this Chama.');
  end if;

  select * into me from public.chama_members where chama_id = p_cid and user_id = uid and status = 'active' limit 1;
  is_self := me.member_id is not null and me.member_id = p_member;
  if is_self then
    if p_evidence is null or jsonb_typeof(p_evidence) <> 'object' or coalesce(p_evidence ->> 'kind', '') not in ('sms', 'image') then
      return jsonb_build_object('ok', false, 'status', 'needs_evidence', 'self_recorded', true, 'error', 'This is your own payment. Add the M-Pesa message or a photo of it.');
    end if;
    if p_evidence ->> 'kind' = 'sms' then
      t := btrim(coalesce(p_evidence ->> 'text', ''));
      ecode := nullif(upper(btrim(coalesce(p_evidence ->> 'code', ''))), '');
      if t = '' or char_length(t) > 1500 or ecode is null or code is null or ecode <> code or position(ecode in upper(t)) = 0 then
        return jsonb_build_object('ok', false, 'status', 'evidence_mismatch', 'self_recorded', true, 'error', 'The M-Pesa message does not show this code.');
      end if;
      amt := nullif(replace((regexp_match(t, '(?:Ksh|KSh|KSH|KES|Kes)\s?([0-9][0-9,]*(?:\.[0-9]{1,2})?)'))[1], ',', ''), '')::numeric;
      if amt is not null and amt <> p_amount then
        return jsonb_build_object('ok', false, 'status', 'evidence_mismatch', 'self_recorded', true, 'error', 'The amount in the message is different.');
      end if;
      ev := jsonb_build_object('kind', 'sms', 'code', ecode, 'text', t);
    else
      t := coalesce(p_evidence ->> 'path', '');
      if cardinality(string_to_array(t, '/')) <> 3 or split_part(t, '/', 1) <> p_cid or split_part(t, '/', 2) <> uid::text
         or split_part(t, '/', 3) !~ '^[0-9a-f-]{36}\.[a-z0-9]{1,5}$'
         or not exists (select 1 from storage.objects o where o.bucket_id = 'payment-evidence' and o.name = t) then
        return jsonb_build_object('ok', false, 'status', 'evidence_mismatch', 'self_recorded', true, 'error', 'The photo was not uploaded.');
      end if;
      ev := jsonb_build_object('kind', 'image', 'path', t);
    end if;
  end if;

  select public.jnum(c.data -> 'chama' -> 'monthly') into monthly from public.chamas c where c.id = p_cid;
  if p_amount > 50000 or (coalesce(monthly, 0) > 0 and p_amount > 3 * monthly) then fl := fl || 'large'::text; end if;
  if d < (now() at time zone 'Africa/Nairobi')::date - 31 then fl := fl || 'backdated'::text; end if;

  begin
    insert into public.chama_payments (chama_id, member_id, month, amount, mpesa_code, paid_on, idem_key, recorded_by, evidence, self_recorded, flags)
    values (p_cid, p_member, p_month, p_amount, code, d, p_idem, uid, ev, is_self, fl)
    returning id into newid;
  exception when unique_violation then
    if code is not null and exists (select 1 from public.chama_payments where chama_id = p_cid and mpesa_code = code) then
      return jsonb_build_object('ok', false, 'status', 'duplicate_code', 'error', 'This M-Pesa code is already recorded in this Chama.');
    end if;
    select * into ex from public.chama_payments where chama_id = p_cid and idem_key = p_idem;
    return jsonb_build_object('ok', true, 'status', 'duplicate_request', 'id', ex.id, 'serial', ex.serial, 'self_recorded', ex.self_recorded, 'flags', to_jsonb(ex.flags));
  end;
  sr := private.issue_serial(p_cid, 'payment', newid::text, p_member, p_amount, d, code, uid);
  update public.chama_payments set serial = sr ->> 'serial' where id = newid;
  perform public.audit_log(p_cid, uid, 'payment.record', p_member,
    jsonb_build_object('month', p_month, 'amount', p_amount, 'code', code, 'serial', sr ->> 'serial', 'self', is_self, 'flags', to_jsonb(fl), 'evidence', ev ->> 'kind'));
  if is_self then
    perform private.notify(p_cid, 'payment_needs_check', 'A payment needs checking',
      private.person_name(uid, me.email) || ' recorded their own payment of KES ' || to_char(p_amount, 'FM999,999,990') || '. Please check it.',
      '#/grid', array['secretary', 'treasurer'], null, uid, 'action', jsonb_build_object('payment', newid));
  end if;
  return jsonb_build_object('ok', true, 'status', 'created', 'id', newid, 'serial', sr ->> 'serial', 'self_recorded', is_self, 'flags', to_jsonb(fl));
end $$;

-- the old call keeps working for other members; for the treasurer's own payment it asks for evidence (v2)
create or replace function public.record_payment(p_cid text, p_member text, p_month text, p_amount numeric, p_code text, p_date date, p_idem uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare r jsonb;
begin
  r := public.record_payment_v2(p_cid, p_member, p_month, p_amount, p_code, p_date, p_idem, null);
  if coalesce((r ->> 'ok')::boolean, false) = false and r ->> 'status' is null then raise exception '%', r ->> 'error'; end if;
  return r;
end $$;

create or replace function public.confirm_payment(p_cid text, p_payment uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); p public.chama_payments; nm text; at timestamptz := now();
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if coalesce(private.my_role(p_cid), '') not in ('treasurer', 'secretary') then return jsonb_build_object('ok', false, 'error', 'Only the secretary or treasurer can check payments'); end if;
  select * into p from public.chama_payments where id = p_payment and chama_id = p_cid for update;
  if not found then return jsonb_build_object('ok', false, 'error', 'Payment not found'); end if;
  if p.recorded_by = uid then return jsonb_build_object('ok', false, 'error', 'Someone else must check a payment you recorded'); end if;
  if p.checked_at is not null then return jsonb_build_object('ok', true, 'already', true); end if;
  nm := private.person_name(uid, null);
  update public.chama_payments set checked_by = uid, checked_at = at where id = p.id;
  -- patch the JSON payment (the integrity trigger is told to stand aside for this one update)
  perform set_config('chama.pay_guard', 'off', true);
  update public.chamas c set data = jsonb_set(c.data, '{payments}', (
      select coalesce(jsonb_agg(case when e ->> 'sid' = p.id::text
                                     then e || jsonb_build_object('chk', true, 'chkBy', nm, 'chkAt', to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
                                     else e end order by o), '[]'::jsonb)
        from jsonb_array_elements(public.jarr(c.data -> 'payments')) with ordinality x(e, o)))
   where c.id = p_cid and exists (select 1 from jsonb_array_elements(public.jarr(c.data -> 'payments')) e where e ->> 'sid' = p.id::text);
  perform set_config('chama.pay_guard', '', true);
  perform public.audit_log(p_cid, uid, 'payment.confirm', p.member_id, jsonb_build_object('payment', p.id, 'amount', p.amount, 'serial', p.serial));
  if p.recorded_by is not null then
    perform private.notify(p_cid, 'payment_checked', 'Your payment was checked', nm || ' checked the payment of KES ' || to_char(p.amount, 'FM999,999,990') || '.',
      '#/grid', null, p.recorded_by, null, 'normal', jsonb_build_object('payment', p.id));
  end if;
  return jsonb_build_object('ok', true);
end $$;

drop function if exists public.payment_checks(text);
create or replace function public.payment_checks(p_cid text)
returns table(id uuid, member_id text, month text, amount numeric, mpesa_code text, date date, evidence jsonb, self_recorded boolean,
              checked_at timestamptz, checked_by_name text, flags text[], serial text, recorded_by_name text)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare me public.chama_members; officer boolean;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members m where m.chama_id = p_cid and m.user_id = auth.uid() and m.status = 'active' limit 1;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  officer := me.role in ('treasurer', 'secretary');
  return query
    select p.id, p.member_id, p.month, p.amount, p.mpesa_code, p.paid_on, case when officer then p.evidence else null end, p.self_recorded,
           p.checked_at, case when p.checked_by is null then null else private.person_name(p.checked_by, null) end, p.flags, p.serial,
           case when p.recorded_by is null then null else private.person_name(p.recorded_by, null) end
      from public.chama_payments p
     where p.chama_id = p_cid and (officer or p.member_id = me.member_id)
     order by p.created_at desc;
end $$;

------------------------------------------------------------------------------------------------
-- 5. Integrity trigger on chamas.data payments
------------------------------------------------------------------------------------------------
create or replace function private.chamas_payment_integrity()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); olds jsonb := '{}'::jsonb; e jsonb; o jsonb; oe jsonb; sid text; r public.chama_payments; out jsonb := '[]'::jsonb;
        seen text[] := '{}'; old_sids text[] := '{}'; is_new boolean; changed jsonb := '{}'::jsonb; mid text; k text; u uuid; n int;
begin
  if current_setting('chama.pay_guard', true) = 'off' then return new; end if;
  if uid is null then return new; end if;   -- server maintenance (no signed-in caller)
  if tg_op = 'UPDATE' then
    if new.data is not distinct from old.data then return new; end if;
    if (new.data -> 'payments') is not distinct from (old.data -> 'payments') then return new; end if;
    select coalesce(jsonb_object_agg(x ->> 'id', x), '{}'::jsonb), coalesce(array_agg(x ->> 'sid') filter (where x ? 'sid'), '{}')
      into olds, old_sids from jsonb_array_elements(public.jarr(old.data -> 'payments')) x where x ? 'id';
  end if;
  for e in select x from jsonb_array_elements(public.jarr(new.data -> 'payments')) x loop
    if jsonb_typeof(e) <> 'object' then out := out || jsonb_build_array(e); continue; end if;
    oe := olds -> (e ->> 'id');
    is_new := tg_op = 'UPDATE' and (e ->> 'id' is null or oe is null);
    sid := e ->> 'sid';
    if oe is not null and oe ? 'sid' and sid is distinct from (oe ->> 'sid') then
      sid := oe ->> 'sid';   -- a payment keeps the server id it was linked to
    end if;
    r := null;
    if sid is not null and sid ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      select * into r from public.chama_payments p where p.id = sid::uuid and p.chama_id = new.id;
    end if;
    if is_new then
      if r.id is null and sid is null then
        -- an app from before 0.20 does not store sid yet: link to the one matching server row it just recorded
        select * into r from public.chama_payments p
         where p.chama_id = new.id and p.member_id = e ->> 'memberId' and p.amount = public.jnum(e -> 'amount') and p.month = e ->> 'month'
           and p.mpesa_code is not distinct from nullif(upper(btrim(coalesce(e ->> 'code', ''))), '')
           and p.created_at > now() - interval '2 days' and not (p.id::text = any (old_sids || seen))
           and not exists (select 1 from jsonb_array_elements(public.jarr(new.data -> 'payments')) y where y ->> 'sid' = p.id::text)
         order by p.created_at limit 1;
      end if;
      if r.id is null then
        raise exception 'This payment was not recorded on the server. Nothing was changed.' using errcode = 'P0001', hint = 'payment_not_recorded';
      end if;
      if r.member_id is distinct from (e ->> 'memberId') or r.amount is distinct from public.jnum(e -> 'amount') then
        raise exception 'This payment does not match what the server recorded. Nothing was changed.' using errcode = 'P0001', hint = 'payment_mismatch';
      end if;
      if r.id::text = any (old_sids) or r.id::text = any (seen) then
        raise exception 'This payment is already in the book. Nothing was changed.' using errcode = 'P0001', hint = 'payment_duplicate';
      end if;
    elsif r.id is not null and r.id::text = any (seen) then
      r := null;   -- the same server id twice: only the first keeps it
    end if;
    if r.id is not null then
      seen := seen || r.id::text;
      e := (e - 'selfRec' - 'chk' - 'chkBy' - 'chkAt' - 'flags') || jsonb_build_object('sid', r.id::text);
      if r.serial is not null then e := e || jsonb_build_object('serial', r.serial); end if;
      if r.self_recorded then e := e || jsonb_build_object('selfRec', true); end if;
      if r.checked_at is not null then
        e := e || jsonb_build_object('chk', true, 'chkBy', private.person_name(r.checked_by, null),
                                     'chkAt', to_char(r.checked_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
      end if;
      if cardinality(r.flags) > 0 then e := e || jsonb_build_object('flags', to_jsonb(r.flags)); end if;
    else
      e := e - 'sid' - 'selfRec' - 'chk' - 'chkBy' - 'chkAt';
    end if;
    -- changes to a payment that was already in the book
    if oe is not null and ((oe -> 'amount') is distinct from (e -> 'amount') or (oe ->> 'memberId') is distinct from (e ->> 'memberId')
        or (oe ->> 'month') is distinct from (e ->> 'month') or (oe ->> 'date') is distinct from (e ->> 'date') or (oe ->> 'code') is distinct from (e ->> 'code')) then
      perform public.audit_log(new.id, uid, 'payment.change', e ->> 'memberId',
        jsonb_build_object('id', e ->> 'id', 'before', jsonb_build_object('memberId', oe -> 'memberId', 'month', oe -> 'month', 'amount', oe -> 'amount', 'date', oe -> 'date', 'code', oe -> 'code'),
                           'after', jsonb_build_object('memberId', e -> 'memberId', 'month', e -> 'month', 'amount', e -> 'amount', 'date', e -> 'date', 'code', e -> 'code')));
      foreach mid in array array_remove(array[oe ->> 'memberId', e ->> 'memberId'], null) loop
        changed := jsonb_set(changed, array[mid], to_jsonb(coalesce((changed ->> mid)::int, 0) + 1));
      end loop;
    end if;
    out := out || jsonb_build_array(e);
  end loop;
  -- deletions
  if tg_op = 'UPDATE' then
    for k, o in select key, value from jsonb_each(olds) loop
      if not exists (select 1 from jsonb_array_elements(out) y where y ->> 'id' = k) then
        perform public.audit_log(new.id, uid, 'payment.delete', o ->> 'memberId',
          jsonb_build_object('id', k, 'memberId', o -> 'memberId', 'month', o -> 'month', 'amount', o -> 'amount', 'date', o -> 'date', 'code', o -> 'code', 'sid', o -> 'sid'));
        if o ->> 'memberId' is not null then
          changed := jsonb_set(changed, array[o ->> 'memberId'], to_jsonb(coalesce((changed ->> (o ->> 'memberId'))::int, 0) + 1));
        end if;
      end if;
    end loop;
    for mid, n in select key, value::int from jsonb_each_text(changed) loop
      for u in select m.user_id from public.chama_members m where m.chama_id = new.id and m.member_id = mid and m.status = 'active' and m.user_id is not null and m.user_id <> uid loop
        perform private.notify(new.id, 'payment_changed', case when n = 1 then 'A payment of yours was changed' else n || ' payments of yours were changed' end,
          'The treasurer changed or removed your payment record. Open your contributions to see it.', '#/grid', null, u, null, 'important', jsonb_build_object('count', n));
      end loop;
    end loop;
  end if;
  if jsonb_typeof(new.data -> 'payments') = 'array' then new.data := jsonb_set(new.data, '{payments}', out); end if;
  return new;
end $$;
revoke all on function private.chamas_payment_integrity() from public, anon, authenticated;

drop trigger if exists chamas_payment_integrity on public.chamas;
create trigger chamas_payment_integrity before insert or update of data on public.chamas
  for each row execute function private.chamas_payment_integrity();

------------------------------------------------------------------------------------------------
-- 6. Emergency removal
------------------------------------------------------------------------------------------------
create or replace function public.emergency_remove_member(p_cid text, p_member text, p_reason text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare uid uuid := auth.uid(); why text := btrim(coalesce(p_reason, '')); me public.chama_members; tgt public.chama_members; pw text;
        tkey text := 'emergency_remove:' || coalesce(auth.uid()::text, ''); th public.auth_throttle; nm text; mname text;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = uid and status = 'active' limit 1;
  if not found or me.role <> 'treasurer' then return jsonb_build_object('ok', false, 'error', 'Only the treasurer can do this'); end if;
  if char_length(why) < 5 then return jsonb_build_object('ok', false, 'error', 'Give a reason (at least 5 letters)'); end if;
  if char_length(why) > 600 then return jsonb_build_object('ok', false, 'error', 'The reason is too long'); end if;
  select * into th from public.auth_throttle where key = tkey;
  if found and th.attempts >= 5 and th.window_start > now() - interval '15 minutes' then
    return jsonb_build_object('ok', false, 'error', 'Too many wrong passwords. Wait 15 minutes.');
  end if;
  select u.encrypted_password into pw from auth.users u where u.id = uid;
  if coalesce(pw, '') = '' then return jsonb_build_object('ok', false, 'error', 'Set a password for your account first'); end if;
  if p_password is null or p_password = '' or extensions.crypt(p_password, pw) <> pw then
    perform public.auth_throttle_hit(tkey, 5, 900);
    return jsonb_build_object('ok', false, 'error', 'That password is not right');
  end if;
  perform public.auth_throttle_clear(tkey);
  if p_member is null or p_member = me.member_id then return jsonb_build_object('ok', false, 'error', 'You cannot remove yourself'); end if;
  select e ->> 'name' into mname from public.chamas c, jsonb_array_elements(public.jarr(c.data -> 'members')) e where c.id = p_cid and e ->> 'id' = p_member limit 1;
  if mname is null then return jsonb_build_object('ok', false, 'error', 'That member is not in this Chama'); end if;
  select * into tgt from public.chama_members where chama_id = p_cid and member_id = p_member and status in ('active', 'invited') order by (status = 'active') desc limit 1;
  if found and tgt.role = 'treasurer' then return jsonb_build_object('ok', false, 'error', 'You cannot remove the treasurer'); end if;
  if tgt.email is not null then
    update public.chama_removal_notices set status = 'cancelled' where chama_id = p_cid and status = 'pending' and email = tgt.email;
  end if;
  if tgt.email is not null and tgt.status = 'active' then
    perform public.remove_member(p_cid, tgt.email);
  else
    if tgt.email is not null then update public.chama_members set status = 'removed' where chama_id = p_cid and email = tgt.email; end if;
    perform private.set_member_left(p_cid, p_member, to_char(now() at time zone 'Africa/Nairobi', 'YYYY-MM'));
  end if;
  perform public.audit_log(p_cid, uid, 'member.emergency_remove', p_member, jsonb_build_object('reason', why, 'name', mname, 'email', tgt.email));
  nm := private.person_name(uid, me.email);
  insert into public.chama_messages (chama_id, sender, sender_name, sender_role, kind, body, meta)
  values (p_cid, uid, nm, 'treasurer', 'system', left(nm || ' removed ' || mname || ' at once. Reason: ' || why, 4000),
          jsonb_build_object('event', 'emergency_removal', 'member_id', p_member));
  if tgt.user_id is not null then
    perform private.notify(p_cid, 'access_removed_reason', 'You were removed from the Chama', 'Reason given: ' || why, null, null, tgt.user_id, null, 'important');
  end if;
  return jsonb_build_object('ok', true);
end $$;

------------------------------------------------------------------------------------------------
-- 7. Profile details: details_at and dob_source
------------------------------------------------------------------------------------------------
create or replace function public.get_my_details()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('full_name', p.full_name, 'phone', p.phone, 'birth_date', p.birth_date, 'gender', p.gender, 'details_at', p.details_at,
                            'phone_shared_at', p.phone_shared_at, 'dob_source', p.dob_source)
    from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.set_my_details(p_full_name text default null, p_phone text default null, p_birth_date date default null, p_gender text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); fn text := nullif(btrim(coalesce(p_full_name, '')), ''); ph text := nullif(regexp_replace(coalesce(p_phone, ''), '[\s-]', '', 'g'), '');
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if fn is not null and char_length(fn) > 120 then raise exception 'Name is too long'; end if;
  if ph is not null and ph !~ '^\+?[0-9]{9,15}$' then raise exception 'That phone number looks wrong'; end if;
  if p_gender is not null and p_gender not in ('female', 'male', 'other', 'prefer_not') then raise exception 'Choose one of the options'; end if;
  if p_birth_date is not null and (p_birth_date <= date '1900-01-01' or p_birth_date > current_date - 13 * 365) then raise exception 'That date of birth does not look right'; end if;
  -- a typed date of birth that differs from the one on record is the person's own word again
  update public.profiles set full_name = coalesce(fn, full_name), phone = coalesce(ph, phone), birth_date = coalesce(p_birth_date, birth_date),
         gender = coalesce(p_gender, gender), details_at = now(), updated_at = now(),
         dob_source = case when p_birth_date is not null and p_birth_date is distinct from birth_date then 'self' else dob_source end
   where id = uid;
  if not found then raise exception 'Finish setting up your account first'; end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.set_dob_source(p_source text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if p_source is null or p_source not in ('self', 'id_scan') then raise exception 'Source must be self or id_scan'; end if;
  update public.profiles set dob_source = p_source, updated_at = now() where id = auth.uid() and birth_date is not null;
  if not found then raise exception 'Add your date of birth first'; end if;
  return jsonb_build_object('ok', true, 'dob_source', p_source);
end $$;

------------------------------------------------------------------------------------------------
-- 8. Storage: private bucket payment-evidence, path <cid>/<uid>/<uuid>.<ext>; officers of that Chama upload and read
------------------------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('payment-evidence', 'payment-evidence', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists payment_evidence_insert on storage.objects;
create policy payment_evidence_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'payment-evidence' and (storage.foldername(name))[2] = (select auth.uid())::text
  and public.chama_role((storage.foldername(name))[1]) in ('treasurer', 'secretary'));
drop policy if exists payment_evidence_read on storage.objects;
create policy payment_evidence_read on storage.objects for select to authenticated using (
  bucket_id = 'payment-evidence' and public.chama_role((storage.foldername(name))[1]) in ('treasurer', 'secretary'));

------------------------------------------------------------------------------------------------
-- 9. Grants
------------------------------------------------------------------------------------------------
do $$ declare f text; begin
  foreach f in array array['private.serial_check(text)', 'private.serial_hash(public.chama_serials)',
    'private.issue_serial(text, text, text, text, numeric, date, text, uuid)', 'private.short_name(text)'] loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
  end loop;
  foreach f in array array['public.issue_serial(text, text, text, text, numeric, date, text)', 'public.verify_serial(text, text, date, numeric, text)',
    'public.record_payment_v2(text, text, text, numeric, text, date, uuid, jsonb)', 'public.record_payment(text, text, text, numeric, text, date, uuid)',
    'public.confirm_payment(text, uuid)', 'public.payment_checks(text)', 'public.emergency_remove_member(text, text, text, text)',
    'public.get_my_details()', 'public.set_my_details(text, text, date, text)', 'public.set_dob_source(text)'] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;

notify pgrst, 'reload schema';

------------------------------------------------------------------------------------------------
-- CHECKS (safe to run any time; read-only)
------------------------------------------------------------------------------------------------
do $$ declare ok boolean; begin
  ok := to_regclass('public.chama_serials') is not null
    and (select relrowsecurity from pg_class where oid = 'public.chama_serials'::regclass)
    and not has_table_privilege('authenticated', 'public.chama_serials', 'select')
    and exists (select 1 from pg_trigger where tgname = 'chamas_payment_integrity' and tgrelid = 'public.chamas'::regclass)
    and private.serial_check('MC-UMOJ-2611-7K3Q') ~ '^[2-9A-HJKMNP-Z]{2}$'
    and has_function_privilege('authenticated', 'public.record_payment_v2(text, text, text, numeric, text, date, uuid, jsonb)', 'execute')
    and not has_function_privilege('anon', 'public.verify_serial(text, text, date, numeric, text)', 'execute')
    and exists (select 1 from storage.buckets where id = 'payment-evidence' and not public);
  raise notice '030 checks ok = %', ok;
end $$;
