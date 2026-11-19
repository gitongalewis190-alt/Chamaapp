-- ============================================================================================
-- 020 — RUN THIS IN SUPABASE (project ref: sgfvjsxmchohawhqraii). Needs explicit approval
-- because it replaces one foreign key and the nightly account-purge function.
--
-- Instruction for the assistant running it:
--   "Run this whole file as ONE migration named 020_consent_keep_and_full_purge on project
--    sgfvjsxmchohawhqraii, then run the two SELECT checks at the bottom and show me the result."
--
-- What it does:
--   1. Consent records survive account deletion (the link to the account is cleared, the
--      record stays), so the app can later show what a person accepted and when.
--   2. The nightly purge (cron job "purge-deleted-accounts", 03:15) now also removes the
--      person's failed code attempts, code redemptions, join requests, sign-in throttle rows,
--      and replaces their email in the audit log and old access rows; their chat messages keep
--      only "Former member"; consent rows are copied to consent_archive before deletion.
-- Migration 019 must already be applied (it is: applied 2026-11-19).
-- ============================================================================================

begin;

-- 1. consent outlives the account
alter table public.consent_records drop constraint if exists consent_records_user_id_fkey;
alter table public.consent_records alter column user_id drop not null;
alter table public.consent_records
  add constraint consent_records_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

-- 2. complete purge
create or replace function public.purge_due_account_deletions()
returns integer language plpgsql security definer set search_path = public, extensions, pg_temp as $$
declare r record; n int := 0; tag text;
begin
  for r in select p.id, lower(u.email) as email from public.profiles p join auth.users u on u.id = p.id
            where p.deletion_requested_at < now() - interval '30 days'
              and not exists (select 1 from public.chama_members m where m.user_id = p.id and m.status = 'active') loop
    tag := 'deleted-' || substr(md5(r.email), 1, 12);
    insert into public.consent_archive (id, email_hash, policy_version, accepted_at, app_version, method, ip, user_agent, locale, timezone, client_time, context)
      select c.id, coalesce(c.email_hash, encode(extensions.digest(r.email, 'sha256'), 'hex')), c.policy_version, c.accepted_at, c.app_version,
             c.method, c.ip, c.user_agent, c.locale, c.timezone, c.client_time, c.context
        from public.consent_records c where c.user_id = r.id
      on conflict (id) do nothing;
    update public.chama_messages set sender_name = 'Former member' where sender = r.id;
    delete from public.chama_invitations where invited_email = r.email and status = 'pending';
    delete from public.chama_join_requests where user_id = r.id;
    delete from public.chama_members where user_id = r.id and status <> 'active';
    update public.chama_members set email = tag || '@invalid' where email = r.email and user_id is null and status <> 'active';
    delete from public.chama_invite_attempts where user_id = r.id;
    delete from public.chama_invite_redemptions where user_id = r.id;
    delete from public.auth_throttle where key ilike '%' || r.email || '%';
    update public.chama_audit set target = tag where target = r.email;
    delete from auth.users where id = r.id;   -- cascades profiles, member_profiles, notifications, responses, reads, private messages to them
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function public.purge_due_account_deletions() from public, anon, authenticated;

-- 3. the new app functions are for signed-in people only (they already refuse anonymous callers; this closes the door too)
revoke execute on function public.list_join_requests(text), public.decide_join_request(uuid, boolean, text, text, text), public.my_join_requests(),
  public.cancel_join_request(text), public.link_member_record(text, text, text, text), public.mark_notifications_read(uuid[]),
  public.chat_contacts(text), public.send_chama_message(text, text, text, jsonb, uuid), public.respond_chama_message(uuid, text),
  public.record_attendance(uuid, jsonb), public.close_poll(uuid), public.pin_chama_message(uuid, boolean), public.retract_chama_message(uuid),
  public.mark_thread_read(text, text), public.chat_unread(text), public.record_consent_v2(text, text, text, text, text, timestamptz, jsonb), public.my_consents()
  from public, anon;
grant execute on function public.list_join_requests(text), public.decide_join_request(uuid, boolean, text, text, text), public.my_join_requests(),
  public.cancel_join_request(text), public.link_member_record(text, text, text, text), public.mark_notifications_read(uuid[]),
  public.chat_contacts(text), public.send_chama_message(text, text, text, jsonb, uuid), public.respond_chama_message(uuid, text),
  public.record_attendance(uuid, jsonb), public.close_poll(uuid), public.pin_chama_message(uuid, boolean), public.retract_chama_message(uuid),
  public.mark_thread_read(text, text), public.chat_unread(text), public.record_consent_v2(text, text, text, text, text, timestamptz, jsonb), public.my_consents()
  to authenticated;

commit;

-- checks (should show "SET NULL" and "true")
select confdeltype = 'n' as consent_fk_is_set_null from pg_constraint where conname = 'consent_records_user_id_fkey';
select position('consent_archive' in pg_get_functiondef('public.purge_due_account_deletions'::regproc)) > 0 as purge_updated;
