-- 021: member register for officers, in-app feedback. Applied to project sgfvjsxmchohawhqraii on 2026-11-19 (no drops).
create or replace function public.member_register(p_cid text)
returns table(name text, email text, phone text, role text, member_id text, joined_at timestamptz, photo text)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare me text := private.my_role(p_cid);
begin
  if me is null or me = 'member' then raise exception 'Only the treasurer or secretary keeps the register'; end if;
  return query
    select private.person_name(m.user_id, m.email), coalesce(p.contact_email, m.email), p.phone, m.role, m.member_id, coalesce(m.joined_at, m.created_at), p.photo
      from public.chama_members m left join public.profiles p on p.id = m.user_id
     where m.chama_id = p_cid and m.status = 'active'
     order by case m.role when 'treasurer' then 0 when 'secretary' then 1 else 2 end, 1;
end $$;

create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  chama_id text, role text,
  rating smallint check (rating between 1 and 5),
  category text check (category in ('idea', 'problem', 'praise', 'other')),
  message text check (message is null or char_length(message) <= 2000),
  app_version text, context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.app_feedback enable row level security;   -- no policies: read it in the dashboard

create or replace function public.submit_feedback(p_rating int, p_category text, p_message text, p_cid text default null, p_app_version text default null, p_context jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select count(*) into n from public.app_feedback where user_id = auth.uid() and created_at > now() - interval '1 hour';
  if n >= 5 then raise exception 'Thank you. You have sent a lot of feedback this hour; try again later.'; end if;
  insert into public.app_feedback (user_id, chama_id, role, rating, category, message, app_version, context)
  values (auth.uid(), p_cid, case when p_cid is not null then private.my_role(p_cid) end, nullif(p_rating, 0), coalesce(p_category, 'other'), nullif(btrim(left(p_message, 2000)), ''), left(p_app_version, 20),
          case when jsonb_typeof(p_context) = 'object' and octet_length(p_context::text) < 2000 then p_context else '{}'::jsonb end);
  return jsonb_build_object('ok', true);
end $$;
