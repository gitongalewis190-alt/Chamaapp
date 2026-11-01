-- 009_ownership_leaving_deletion.sql       STATUS: DRAFT, not applied anywhere. Requires 002, 006.
-- Purpose: hand the treasurer role to someone else, leave a Chama, and delete a whole account (D6: leaving a Chama is NOT deleting an account).
begin;

-- Ownership transfer: the treasurer promotes an active member and steps down, in one step.
-- p_stay_as_treasurer = true makes the person a co-treasurer instead of stepping down.
create or replace function public.transfer_ownership(cid text, p_email text, p_stay_as_treasurer boolean default false) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email)); me public.chama_members; tgt public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = cid and user_id = auth.uid() and status = 'active' and role = 'treasurer' for update;
  if not found or not public.chama_can(cid, 'roles.assign') then raise exception 'Only a treasurer can hand over the Chama'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member'; end if;
  if tgt.user_id = auth.uid() then raise exception 'Choose someone else'; end if;
  update public.chama_members set role = 'treasurer' where chama_id = cid and email = em;                 -- promote first: the Chama always has a treasurer
  if not p_stay_as_treasurer then update public.chama_members set role = 'member' where chama_id = cid and email = me.email; end if;
  perform public.audit_log(cid, auth.uid(), 'ownership.transfer', em, jsonb_build_object('stay_as_treasurer', p_stay_as_treasurer));
end $$;

-- Leave one Chama. Records stay in the Chama. A sole treasurer is stopped by the last-treasurer guard and told to hand over first.
create or replace function public.leave_chama(cid text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = cid and user_id = auth.uid() and status = 'active' for update;
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if me.role = 'treasurer' and not exists (select 1 from public.chama_members x where x.chama_id = cid and x.role = 'treasurer' and x.status = 'active' and x.email <> me.email) then
    raise exception 'You are the only treasurer. Hand the Chama to someone else first.';
  end if;
  update public.chama_members set status = 'removed' where chama_id = cid and email = me.email;
  perform public.audit_log(cid, auth.uid(), 'member.leave', me.email, '{}');
end $$;

-- Whole-account deletion (global). Needs: no active Chama, a sign-in within the last 10 minutes, then a 30-day hold.
alter table public.profiles add column if not exists deletion_requested_at timestamptz, add column if not exists deletion_reason text;
revoke update on public.profiles from authenticated; grant update (full_name, phone) on public.profiles to authenticated;   -- new columns stay server-only

create or replace function public.request_account_deletion(p_reason text default null) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); n int; last_in timestamptz;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select u.last_sign_in_at into last_in from auth.users u where u.id = uid;
  if last_in is null or last_in < now() - interval '10 minutes' then raise exception 'For your safety, sign in again, then try straight away'; end if;
  select count(*) into n from public.chama_members where user_id = uid and status = 'active';
  if n > 0 then raise exception 'Leave your % Chama(s) first. Deleting an account is separate from leaving a Chama.', n; end if;
  if not exists (select 1 from public.profiles where id = uid) then raise exception 'No profile found'; end if;
  update public.profiles set deletion_requested_at = now(), deletion_reason = left(nullif(btrim(p_reason), ''), 300) where id = uid;
  return jsonb_build_object('requested_at', now(), 'purge_at', now() + interval '30 days');
end $$;
create or replace function public.cancel_account_deletion() returns void
language sql security definer set search_path = public, pg_temp as $$ update public.profiles set deletion_requested_at = null, deletion_reason = null where id = auth.uid(); $$;
create or replace function public.account_deletion_status() returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select case when p.deletion_requested_at is null then jsonb_build_object('pending', false)
              else jsonb_build_object('pending', true, 'requested_at', p.deletion_requested_at, 'purge_at', p.deletion_requested_at + interval '30 days') end
    from public.profiles p where p.id = auth.uid(); $$;

-- Run by the service role (or a schedule) to finish deletions whose 30 days are over. Deletes the sign-in account.
create or replace function public.purge_due_account_deletions() returns int
language plpgsql security definer set search_path = public, pg_temp as $$
declare r record; n int := 0;
begin
  for r in select p.id, lower(u.email) as email from public.profiles p join auth.users u on u.id = p.id
            where p.deletion_requested_at < now() - interval '30 days'
              and not exists (select 1 from public.chama_members m where m.user_id = p.id and m.status = 'active') loop
    delete from public.chama_invitations where invited_email = r.email and status = 'pending';
    delete from public.chama_members where user_id = r.id and status <> 'active';
    delete from auth.users where id = r.id;           -- cascades profiles and member_profiles
    n := n + 1;
  end loop;
  return n;
end $$;

revoke all on function public.transfer_ownership(text, text, boolean), public.leave_chama(text), public.request_account_deletion(text),
  public.cancel_account_deletion(), public.account_deletion_status() from public, anon;
revoke all on function public.purge_due_account_deletions() from public, anon, authenticated;   -- server only
grant execute on function public.transfer_ownership(text, text, boolean), public.leave_chama(text), public.request_account_deletion(text),
  public.cancel_account_deletion(), public.account_deletion_status() to authenticated;
grant execute on function public.purge_due_account_deletions() to service_role;
commit;
-- To schedule the purge when pg_cron is installed:  select cron.schedule('purge-deleted-accounts','15 3 * * *','select public.purge_due_account_deletions()');
-- ROLLBACK NOTES: drop the 6 functions above; alter table profiles drop column deletion_requested_at, drop column deletion_reason.
