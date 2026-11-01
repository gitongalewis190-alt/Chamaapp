-- 007_retire_legacy.sql                    STATUS: DRAFT, not applied anywhere. *** DESTRUCTIVE: owner approved (no real users yet) ***
-- Purpose: switch off the unsafe v0.11.0 functions and the per-Chama password model (D1 end, D5, D7, owner decision).
-- After this, the v0.11.0 app stops working. Only the 0.12 app can sign in. Per-Chama password hashes are dropped, never imported.
-- Everything uses IF EXISTS because the live database may not match the old SQL files (Stage 0 findings).
begin;

-- Drop every overload of each legacy function by name.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig from pg_proc p
     where p.pronamespace = 'public'::regnamespace
       and p.proname in ('check_login','set_password','check_signup_password','password_reused','password_rules_ok',
                         'claim_invites','create_chama','invite_member','my_chamas','chama_exists','handle_new_user',
                         'request_account_deletion','cancel_account_deletion','account_deletion_status',
                         'purge_due_account_deletions','chama_deletion_notices')
  loop
    execute 'drop function if exists ' || r.sig || ' cascade';   -- cascade also removes any trigger that used handle_new_user
  end loop;
end $$;

-- Per-Chama password hashes: gone for good.
alter table public.chama_members drop column if exists password_hash;

-- The old per-chama deletion columns (present in the old SQL, absent from the export) are dropped if they exist.
alter table public.chama_members drop column if exists deletion_requested_at, drop column if exists deletion_reason;

commit;
-- ROLLBACK: none for the dropped hashes (by design). The old functions can be re-created from chama_auth.sql / chama_passwords.sql if ever needed, but that restores the unsafe model.
