-- ============================================================================
-- Migration 013: confirm people who joined by invite code as members
-- STATUS: APPROVED BY OWNER. NOT YET RUN IN THE DATABASE. Run in the SQL Editor, then record the result here and in README section 11.
-- ============================================================================
-- Purpose
--   A person who joins by invite code gets an access row (chama_members) but no
--   member record in the Chama document (chamas.data.members), so the Members
--   page shows nobody. This function lets the treasurer confirm such a person as
--   a member: it creates the member record and links the access row to it.
--   Nothing is confirmed automatically. The treasurer presses a button per person.
--
-- Affected objects
--   function public.confirm_joined_member(text, text, text)  (new)
--   public.chamas.data (jsonb, members array)                 (written by the function)
--   public.chama_members.member_id                            (set by the function)
--   public.audit_log(...)                                     (called)
--   Existing: chama_role(cid), touch/version trigger on chamas
--
-- Why a function and not a client write
--   Only treasurers may update chamas. The function checks that the caller is the
--   active treasurer of that Chama itself (not a client-side check), then writes.
--
-- Prerequisites
--   Migration 012 applied (invite codes). chama_role(text) and audit_log(...) exist (002).
--
-- Compatibility
--   Additive only. No existing function, policy or row changes.
--
-- Validation (after running, read-only)
--   1. select proname from pg_proc where proname = 'confirm_joined_member';   -- one row
--   2. As a non-treasurer, call it: must raise 'Only the treasurer can confirm members'.
--   3. As the treasurer, on a Chama with one unlinked access row: the member
--      appears in chamas.data->'members' and chama_members.member_id is set.
--   4. Call it twice for the same person: second call must raise 'Already confirmed'.
--
-- Rollback
--   drop function if exists public.confirm_joined_member(text, text, text);
--   Member records already created stay (financial history is never deleted).
-- ============================================================================

create or replace function public.confirm_joined_member(p_cid text, p_email text, p_name text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  em text := lower(btrim(p_email));
  nm text := btrim(coalesce(p_name, ''));
  acc public.chama_members;
  mid text;
  c public.chamas;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if public.chama_role(p_cid) is distinct from 'treasurer' then
    raise exception 'Only the treasurer can confirm members';
  end if;
  if nm = '' then raise exception 'Enter the member''s name'; end if;

  select * into acc from public.chama_members
   where chama_id = p_cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member of this Chama'; end if;
  if acc.member_id is not null then raise exception 'Already confirmed'; end if;
  if acc.role = 'treasurer' then raise exception 'Treasurers are officers and are not confirmed as members'; end if;

  select * into c from public.chamas where id = p_cid for update;
  mid := 'm' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6);

  update public.chamas
     set data = jsonb_set(
           data, '{members}',
           coalesce(data->'members', '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
             'id', mid, 'name', nm, 'shares', 1,
             'joined', to_char(now() at time zone 'Africa/Nairobi', 'YYYY-MM')))
         )
   where id = p_cid;

  update public.chama_members set member_id = mid
   where chama_id = p_cid and email = em and status = 'active';

  perform public.audit_log(p_cid, auth.uid(), 'member.confirmed', em, jsonb_build_object('member_id', mid));
  return jsonb_build_object('ok', true, 'member_id', mid);
end $$;

revoke all on function public.confirm_joined_member(text, text, text) from public, anon;
grant execute on function public.confirm_joined_member(text, text, text) to authenticated;
