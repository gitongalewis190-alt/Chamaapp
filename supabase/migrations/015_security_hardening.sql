-- 015_security_hardening.sql
-- Applied to the live project on 2026-11-03 (migration names: security_hardening_helpers,
-- security_hardening_restore_helper_grants). This file records exactly what was applied. Idempotent.
-- Behaviour of app RPCs is unchanged. Only EXECUTE privileges and search_path settings change.

-- 1. Triggers and event-trigger helpers run as their owner: callers need no EXECUTE.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.guard_last_treasurer() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.chamas_bump_version() from public, anon, authenticated;
revoke execute on function public.chamas_sync_name() from public, anon, authenticated;
revoke execute on function public.chamas_fill_display_tag() from public, anon, authenticated;

-- 2. Helpers used inside SECURITY DEFINER functions: no anonymous access.
revoke execute on function public.jnum(jsonb) from public, anon;
revoke execute on function public.jarr(jsonb) from public, anon;
revoke execute on function public.normalize_username(text) from public, anon;
revoke execute on function public.make_invite_code() from public, anon;
revoke execute on function public.make_display_tag() from public, anon;
revoke execute on function public.invite_code_normalise(text) from public, anon;
-- authenticated keeps EXECUTE on the three pure helpers above (invoker-context trigger may call them).
grant execute on function public.make_invite_code() to authenticated;
grant execute on function public.make_display_tag() to authenticated;
grant execute on function public.invite_code_normalise(text) to authenticated;

-- 3. Pin search_path on functions that lacked it.
alter function public.touch_updated_at() set search_path = public, pg_temp;
alter function public.chamas_bump_version() set search_path = public, pg_temp;
alter function public.jnum(jsonb) set search_path = public, pg_temp;
alter function public.jarr(jsonb) set search_path = public, pg_temp;

-- 4. Document intent for RLS-enabled tables with no policies (server-only by design).
comment on table public.chama_slots is 'RLS on, no policies: server-only. Read by SECURITY DEFINER functions.';
comment on table public.chama_invite_attempts is 'RLS on, no policies: server-only rate-limit log.';
comment on table public.chama_invite_redemptions is 'RLS on, no policies: server-only audit of redemptions.';
comment on table public.chama_invite_codes is 'RLS on, no policies: server-only. Codes stored as SHA-256 hashes.';
comment on table public.app_config is 'RLS on, no policies: read via get_app_config(). Must hold no secrets.';
comment on table public.auth_throttle is 'RLS on, no policies: server-only rate-limit state.';
comment on table public.chama_invitations is 'RLS on, no policies: server-only. Tokens stored as SHA-256 hashes.';

-- ROLLBACK NOTES: grant execute back to anon/public on the functions above only if a specific feature needs it.

-- 5. remove_member was created in 002 without revoking the default PUBLIC/anon grant. Live has it locked
--    down; this makes a fresh rebuild match. Added 2026-11-04 after comparing staging with live.
revoke execute on function public.remove_member(text, text) from public, anon;
grant execute on function public.remove_member(text, text) to authenticated;
