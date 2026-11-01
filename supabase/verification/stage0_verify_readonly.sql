-- MY CHAMA  Stage 0 verification  INSPECTION ONLY  (provisional check IDs: PV-xx)
-- Replaces the missing earlier Stage0_verification.sql. NOT the original; IDs are provisional.
-- Read-only: only SELECTs on catalogs, plus aggregate counts / key names from public.chamas.
-- Returns NO emails, NO password hashes, NO function bodies (md5 of definition only), NO money values.
-- RUN ONLY AFTER the owner confirms the target project (dashboard URL shows the project ref).
-- Run STAGING first. Run each block separately in the SQL Editor and paste results back.
-- Supabase SQL Editor wraps scripts in one transaction; this script writes nothing.

-- PV-01 identity (the project ref is NOT in the database; confirm it from the dashboard URL)
select 'PV-01' as id, current_database() as db, current_user as usr, version() as pg_version, now() as checked_at;

-- PV-02 public tables: RLS enabled/forced, approximate rows (estimate, no table scan)
select 'PV-02' id, c.relname tbl, c.relrowsecurity rls_on, c.relforcerowsecurity rls_forced, c.reltuples::bigint approx_rows
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind in ('r','p') order by 2;

-- PV-03 columns (names/types only)
select 'PV-03' id, table_name, ordinal_position pos, column_name, data_type, is_nullable, column_default
from information_schema.columns where table_schema='public' order by table_name, ordinal_position;

-- PV-04 constraints and indexes
select 'PV-04' id, conrelid::regclass::text tbl, conname, contype, pg_get_constraintdef(oid) def
from pg_constraint where connamespace='public'::regnamespace order by 3;
select 'PV-04b' id, tablename, indexname, indexdef from pg_indexes where schemaname='public' order by 2,3;

-- PV-05 functions: signature, SECURITY DEFINER, search_path config, definition fingerprint (compare with SQL files)
select 'PV-05' id, p.oid::regprocedure::text fn, p.prosecdef security_definer, p.provolatile vol,
       p.proconfig config, md5(pg_get_functiondef(p.oid)) def_md5
from pg_proc p where p.pronamespace='public'::regnamespace and p.prokind='f' order by 2;

-- PV-06 EXECUTE privileges per function (anon / authenticated / PUBLIC)
select 'PV-06' id, p.oid::regprocedure::text fn,
  exists(select 1 from pg_roles where rolname='anon') has_anon_role,
  case when exists(select 1 from pg_roles where rolname='anon') then has_function_privilege('anon',p.oid,'EXECUTE') end anon_exec,
  case when exists(select 1 from pg_roles where rolname='authenticated') then has_function_privilege('authenticated',p.oid,'EXECUTE') end auth_exec,
  coalesce((select bool_or(a.grantee=0) from aclexplode(coalesce(p.proacl, acldefault('f',p.proowner))) a where a.privilege_type='EXECUTE'),false) public_exec
from pg_proc p where p.pronamespace='public'::regnamespace and p.prokind='f' order by 2;

-- PV-07 table privileges for anon / authenticated
select 'PV-07' id, c.relname tbl,
  r.rolname role,
  has_table_privilege(r.oid,c.oid,'SELECT') sel, has_table_privilege(r.oid,c.oid,'INSERT') ins,
  has_table_privilege(r.oid,c.oid,'UPDATE') upd, has_table_privilege(r.oid,c.oid,'DELETE') del
from pg_class c join pg_namespace n on n.oid=c.relnamespace
cross join (select oid, rolname from pg_roles where rolname in ('anon','authenticated')) r
where n.nspname='public' and c.relkind in ('r','p') order by 2,3;

-- PV-08 column-level privilege on password_hash (expected: no SELECT for anon/authenticated). Skips if column absent.
select 'PV-08' as id, r.rolname as role, has_column_privilege(r.oid, a.attrelid, a.attname, 'SELECT') as can_select_hash
from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace
cross join pg_roles r
where n.nspname='public' and c.relname='chama_members' and a.attname='password_hash' and not a.attisdropped
  and r.rolname in ('anon','authenticated');

-- PV-09 RLS policies (definitions only)
select 'PV-09' id, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname='public' order by 2,3;

-- PV-10 trigger attachments (public + auth + storage; internal triggers excluded)
select 'PV-10' id, t.tgrelid::regclass::text tbl, t.tgname, t.tgenabled, t.tgfoid::regproc::text fn
from pg_trigger t where not t.tgisinternal
  and t.tgrelid::regclass::text ~ '^(public\.|auth\.|storage\.|"?public"?\.)' order by 2,3;

-- PV-11 extensions
select 'PV-11' id, extname, extversion from pg_extension order by 2;

-- PV-12 cron jobs (guarded: only reads cron.job if it exists; command text omitted)
select 'PV-12' id, case when to_regclass('cron.job') is null then 'pg_cron not installed'
  else query_to_xml('select jobname, schedule, active from cron.job', false, true, '')::text end cron;

-- PV-13 realtime publication membership
select 'PV-13' id, pubname, schemaname, tablename from pg_publication_tables order by 2,3,4;

-- PV-14 storage (guarded): bucket names/public flag, policy count on storage.objects
select 'PV-14' id, case when to_regclass('storage.buckets') is null then 'storage schema absent'
  else query_to_xml('select name, public from storage.buckets', false, true, '')::text end buckets;
select 'PV-14b' id, policyname, cmd, roles from pg_policies where schemaname='storage' order by 2;

-- PV-15 migration history (guarded; names/versions only)
select 'PV-15' as id, case when to_regclass('supabase_migrations.schema_migrations') is null then 'no migration history table'
  else query_to_xml('select version from supabase_migrations.schema_migrations order by 1', false, true, '')::text end as hist;

-- NOTE (audit): PV-16a key names may themselves be personal if the app uses names as keys; review output before pasting.
-- PV-16 financial JSON shape (KEY NAMES AND COUNTS ONLY, no values). Needed for D3 snapshots (MISS-14).
select 'PV-16' id, count(*) chamas, count(*) filter (where jsonb_typeof(data)='object') obj_docs from public.chamas;
select 'PV-16a' id, k top_level_key, jsonb_typeof(c.data->k) json_type, count(*) chamas
from public.chamas c, jsonb_object_keys(case when jsonb_typeof(c.data)='object' then c.data else '{}'::jsonb end) k
group by 2,3 order by 2,3;
select 'PV-16b' id, a.section, ek element_key, count(*) occurrences
from public.chamas c
cross join (values ('members'),('payments'),('loans'),('fines'),('payouts'),('expenses'),('log')) a(section)
cross join lateral jsonb_array_elements(case when jsonb_typeof(c.data->a.section)='array' then c.data->a.section else '[]'::jsonb end) e
cross join lateral jsonb_object_keys(case when jsonb_typeof(e)='object' then e else '{}'::jsonb end) ek
group by 2,3 order by 2,3;

-- PV-17 membership integrity (counts only)
select 'PV-17' id, role, status, (user_id is not null) linked, count(*) n from public.chama_members group by 2,3,4 order by 2,3,4;
select 'PV-17b' id, count(*) dup_chama_email_groups from (
  select chama_id, lower(email) from public.chama_members group by 1,2 having count(*)>1) d;
select 'PV-17c' id, count(*) members_without_chama from public.chama_members m
where not exists (select 1 from public.chamas c where c.id=m.chama_id);
select 'PV-17d' id, count(*) users_in_more_than_one_chama from (
  select user_id from public.chama_members where user_id is not null and status='active' group by 1 having count(distinct chama_id)>1) x;

-- PV-18 role helper dependencies (REC-13): do these exist?
select 'PV-18' id, f.name, to_regprocedure(f.sig) is not null exists_in_db
from (values ('chama_role','public.chama_role(text)'),('is_treasurer','public.is_treasurer(text)'),
             ('is_active_member','public.is_active_member(text)')) f(name,sig);

-- NOT obtainable from SQL (dashboard/owner evidence): Auth settings, SMTP, OTP length/expiry, backups/PITR,
-- Edge Function source (sync-config), secrets, project ref.
