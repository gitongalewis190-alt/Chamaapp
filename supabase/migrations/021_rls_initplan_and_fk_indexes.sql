-- 021_rls_initplan_and_fk_indexes.sql
-- Purpose: performance advisor fixes. Same rules as before, faster at scale:
--  * RLS policies call (select auth.uid()) so Postgres evaluates it once per query, not once per row.
--  * profiles policies are scoped to "authenticated" (were "public"), with an explicit WITH CHECK on update.
--  * covering indexes for three foreign keys.
-- Prereqs: 000 to 020. Rollback: recreate the old policies from 001/004/017 and drop the three indexes.
begin;

drop policy if exists "read own profile"   on public.profiles;
drop policy if exists "update own profile" on public.profiles;
create policy "read own profile"   on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "update own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists members_read on public.chama_members;
create policy members_read on public.chama_members for select to authenticated
  using (user_id = (select auth.uid()) or public.is_treasurer(chama_id));

drop policy if exists profiles_read        on public.member_profiles;
drop policy if exists profiles_insert_own  on public.member_profiles;
drop policy if exists profiles_update_own  on public.member_profiles;
create policy profiles_read on public.member_profiles for select to authenticated
  using (user_id = (select auth.uid()) or public.chama_can(chama_id, 'members.view_list'));
create policy profiles_insert_own on public.member_profiles for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_active_member(chama_id));
create policy profiles_update_own on public.member_profiles for update to authenticated
  using (user_id = (select auth.uid()) and public.is_active_member(chama_id))
  with check (user_id = (select auth.uid()) and public.is_active_member(chama_id));

drop policy if exists consent_records_own_read on public.consent_records;
create policy consent_records_own_read on public.consent_records for select to authenticated
  using (user_id = (select auth.uid()));

create index if not exists chama_invitations_accepted_by_idx on public.chama_invitations (accepted_by);
create index if not exists chama_invitations_invited_by_idx  on public.chama_invitations (invited_by);
create index if not exists member_profiles_user_idx          on public.member_profiles (user_id);

commit;
