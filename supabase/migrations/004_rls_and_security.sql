-- 004_rls_and_security.sql                 STATUS: DRAFT, *** PRODUCTION RLS CHANGE: staging first, owner approval required ***
-- Purpose: close the confirmed policy gaps from the Stage 0 export (REC-01, REC-11) and make membership writes RPC-only.
-- Risk (D1): any v0.11.0 client that relied on the broad "signed-in *" chamas policies would lose that access.
--   Known app usage: chamas is read through is_active_member and written by the treasurer (both kept). Verify on staging
--   with a v0.11.0 build before production.
begin;

-- 1. Remove the broad policies: with PERMISSIVE policies OR-ed together they cancelled the narrow ones.
drop policy if exists "signed-in read chamas"   on public.chamas;
drop policy if exists "signed-in update chamas" on public.chamas;
drop policy if exists "signed-in write chamas"  on public.chamas;
-- Kept as exported: chamas_read (is_active_member) and chamas_update_treasurer (is_treasurer).
-- Chama creation happens only through the create_chama* RPCs, so no direct INSERT policy exists.
revoke insert, delete on public.chamas from anon, authenticated;
revoke all on public.chamas from anon;

-- 2. Membership rows change only through RPCs (invite_member, remove_member, set_member_role, accept_invitation).
revoke insert, update, delete on public.chama_members from anon, authenticated;
revoke all on public.chama_members from anon;

-- 3. member_profiles: unchanged policies (active members read, owner writes) but anon gets nothing.
revoke all on public.member_profiles from anon;

commit;

-- ROLLBACK NOTES (restores the RISKY exported state; use only to recover a broken client):
--   create policy "signed-in read chamas"   on public.chamas for select to authenticated using (true);
--   create policy "signed-in update chamas" on public.chamas for update to authenticated using (true) with check (true);
--   create policy "signed-in write chamas"  on public.chamas for insert to authenticated with check (true);
--   grant insert, delete on public.chamas to authenticated;
--   grant insert, update, delete on public.chama_members to authenticated;
-- KNOWN LIMITATION (D3): chamas_read still returns the whole financial JSON to every active member.
--   Role-appropriate snapshots are a separate migration (needs MISS-14 JSON structure evidence).
