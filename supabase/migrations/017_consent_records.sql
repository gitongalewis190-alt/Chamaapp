-- 017_consent_records.sql
-- Purpose: keep proof of when each person accepted each version of the privacy policy (Data Protection Act 2019).
-- Applied to staging (tuvkzsmqgvtwrxuzvuul) on 2026-11-04 and tested (repeat accept is harmless; signed-out is refused).
-- Rollback: drop function record_consent; drop table consent_records (take a backup first).
begin;
create table if not exists public.consent_records (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  policy_version text not null,
  accepted_at    timestamptz not null default now(),
  app_version    text,
  unique (user_id, policy_version)
);
alter table public.consent_records enable row level security;
revoke all on public.consent_records from anon, authenticated;
drop policy if exists consent_records_own_read on public.consent_records;
create policy consent_records_own_read on public.consent_records for select to authenticated using (user_id = auth.uid());
grant select on public.consent_records to authenticated;

create or replace function public.record_consent(p_policy_version text, p_app_version text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if p_policy_version is null or char_length(p_policy_version) > 40 then raise exception 'Policy version missing'; end if;
  insert into public.consent_records (user_id, policy_version, app_version) values (uid, p_policy_version, left(p_app_version, 40))
  on conflict (user_id, policy_version) do nothing;
  return jsonb_build_object('ok', true, 'policy_version', p_policy_version);
end $$;
revoke all on function public.record_consent(text, text) from public, anon;
grant execute on function public.record_consent(text, text) to authenticated;
commit;
