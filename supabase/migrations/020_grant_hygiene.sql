-- 020_grant_hygiene.sql
-- Purpose: remove table privileges the app never uses. RLS already blocks rows, but TRUNCATE ignores RLS,
-- and server-only tables should not be writable by the public roles at all (defence in depth).
-- The app reaches these tables only through SECURITY DEFINER functions or the service role (edge functions).
-- Kept: chamas SELECT/UPDATE (treasurer save), chama_members column SELECT (role lookup),
--       profiles SELECT + UPDATE(full_name, phone), member_profiles SELECT/INSERT/UPDATE (RLS-guarded).
-- Prereqs: 000 to 019. Rollback: re-grant the listed privileges (not recommended).
begin;
revoke all on public.app_config  from anon, authenticated;
revoke all on public.chama_slots from anon, authenticated;
revoke all on public.profiles    from anon;
revoke truncate, trigger, references on public.profiles        from authenticated;
revoke truncate, trigger, references on public.chamas          from anon, authenticated;
revoke truncate, trigger, references on public.chama_members   from anon, authenticated;
revoke truncate, trigger, references, delete on public.member_profiles from anon, authenticated;
commit;
