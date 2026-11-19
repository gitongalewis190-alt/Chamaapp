-- Run after RUN_THIS_IN_SQL_EDITOR.sql. Read-only: it only looks. Every row should say ok = true.
select 'role offers table' as check, to_regclass('public.chama_role_offers') is not null as ok
union all select 'removal notices table', to_regclass('public.chama_removal_notices') is not null
union all select 'retired usernames table', to_regclass('public.retired_usernames') is not null
union all select 'awareness table', to_regclass('public.chama_awareness') is not null
union all select 'function ' || f, exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = f)
  from unnest(array['offer_role','respond_role_offer','cancel_role_offer','my_role_offers','list_role_offers','step_down','leave_chama_with_reason',
                    'remove_with_reason','reply_removal_notice','cancel_removal_notice','finish_removal','list_removal_notices','my_removal_notice',
                    'edit_chama_message','invitation_account','username_available','username_suggestions','record_awareness']) f
union all select 'anon cannot run offer_role', not has_function_privilege('anon', 'public.offer_role(text,text,text,text)', 'execute')
union all select 'anon cannot run edit_chama_message', not has_function_privilege('anon', 'public.edit_chama_message(uuid,text,text)', 'execute')
union all select 'role offers in realtime', exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chama_role_offers')
union all select 'username triggers on profiles', (select count(*) = 2 from pg_trigger where tgrelid = 'public.profiles'::regclass and tgname in ('profiles_retire_username', 'profiles_block_retired'));

-- Chamas that still have two treasurers or two secretaries (the app warns; the treasurer picks one). Empty is best.
select chama_id, role, count(*) from public.chama_members where status = 'active' and role in ('treasurer', 'secretary') group by 1, 2 having count(*) > 1;

-- The "same code for everyone" report: sample accounts that share one inbox (Gmail + aliases). Rows here explain it.
select lower(split_part(split_part(email, '@', 1), '+', 1)) || '@' || lower(split_part(email, '@', 2)) as inbox, count(*) as accounts, array_agg(email) as emails
  from auth.users group by 1 having count(*) > 1;
