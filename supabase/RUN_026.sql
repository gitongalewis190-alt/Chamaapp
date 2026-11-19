-- My Chama 0.17 database update (026). Paste ALL into Supabase -> SQL Editor -> Run. One transaction: all or nothing.
begin;

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


insert into supabase_migrations.schema_migrations (version, name) select '20261120090000', '026_details_loan_signing_chama_faces' where exists (select 1 from information_schema.tables where table_schema = 'supabase_migrations' and table_name = 'schema_migrations') on conflict do nothing;
commit;
notify pgrst, 'reload schema';

-- check: every row ok = true
select f as check, exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = f) as ok from unnest(array['set_my_details','get_my_details','clear_my_details','request_loan_signature','sign_loan_terms','my_chama_faces']) f
union all select 'birth_date column', exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='birth_date');
