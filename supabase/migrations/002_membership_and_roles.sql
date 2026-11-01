-- 002_membership_and_roles.sql             STATUS: DRAFT, not applied anywhere
-- Purpose: membership architecture + central permission map + audit trail (Master Prompt 6, 12, 12.1).
-- Adapts public.chama_members (keeps PK (chama_id,email) and text chama ids so v0.11.0 keeps working, D1).
-- Adds: membership uuid, updated_at, 'secretary' role value, one-active-membership-per-user-per-chama index,
--       last-treasurer guard, role_permissions table, chama_can(), chama_role(), chama_audit, set_member_role(),
--       hardened invite_member()/remove_member() (same signatures).
-- NOTE: there is deliberately NO cap on how many chamas one user may belong to.
begin;

do $$ begin
  if exists (select 1 from public.chama_members where user_id is not null and status = 'active'
             group by chama_id, user_id having count(*) > 1) then
    raise exception '002 aborted: a user has more than one active membership row in the same chama. Reconcile first.';
  end if;
end $$;

alter table public.chama_members
  add column if not exists id         uuid        not null default gen_random_uuid(),
  add column if not exists updated_at timestamptz not null default now();
create unique index if not exists chama_members_id_key on public.chama_members (id);
create unique index if not exists chama_members_one_active_per_user
  on public.chama_members (chama_id, user_id) where user_id is not null and status = 'active';

alter table public.chama_members drop constraint if exists chama_members_role_check;
alter table public.chama_members add  constraint chama_members_role_check check (role in ('member', 'secretary', 'treasurer'));

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists chama_members_touch on public.chama_members;
create trigger chama_members_touch before update on public.chama_members for each row execute function public.touch_updated_at();

-- A chama must always keep one active treasurer (Master Prompt 10.1, 12.1).
create or replace function public.guard_last_treasurer() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare remaining int;
begin
  if tg_op = 'UPDATE' and not (old.role = 'treasurer' and old.status = 'active'
                               and (new.role <> 'treasurer' or new.status <> 'active')) then return new; end if;
  if tg_op = 'DELETE' and not (old.role = 'treasurer' and old.status = 'active') then return old; end if;
  if not exists (select 1 from public.chamas where id = old.chama_id) then return coalesce(new, old); end if;  -- chama itself is being deleted
  select count(*) into remaining from public.chama_members
   where chama_id = old.chama_id and role = 'treasurer' and status = 'active' and email <> old.email;
  if remaining = 0 then raise exception 'A Chama must keep at least one active treasurer' using errcode = '23514'; end if;
  return coalesce(new, old);
end $$;
drop trigger if exists chama_members_last_treasurer on public.chama_members;
create trigger chama_members_last_treasurer before update or delete on public.chama_members for each row execute function public.guard_last_treasurer();

-- ---------- central permission map (mirror of ws/permissions/permissions.js) ----------
create table if not exists public.role_permissions (
  role text not null check (role in ('member', 'secretary', 'treasurer')),
  permission text not null,
  primary key (role, permission)
);
alter table public.role_permissions enable row level security;
drop policy if exists role_permissions_read on public.role_permissions;
create policy role_permissions_read on public.role_permissions for select to authenticated using (true);
revoke all on public.role_permissions from anon, authenticated;
grant select on public.role_permissions to authenticated;

insert into public.role_permissions (role, permission)
select r, p from (values
  ('treasurer','chama.view_shared'),('treasurer','finance.view_own'),('treasurer','finance.view_all'),('treasurer','finance.record'),
  ('treasurer','members.view_list'),('treasurer','members.invite'),('treasurer','members.remove'),('treasurer','roles.assign'),
  ('treasurer','chama.settings'),('treasurer','audit.view'),
  ('secretary','chama.view_shared'),('secretary','finance.view_own'),
  ('member','chama.view_shared'),('member','finance.view_own')
) v(r, p) on conflict do nothing;

-- Permission check for an explicit user id: internal only (service role / other definer functions).
create or replace function public.chama_can_user(p_user uuid, cid text, perm text) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.chama_members m join public.role_permissions rp on rp.role = m.role
    where m.chama_id = cid and m.user_id = p_user and m.status = 'active' and rp.permission = perm);
$$;
create or replace function public.chama_can(cid text, perm text) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select public.chama_can_user(auth.uid(), cid, perm);
$$;
-- My role in a chama (null when not an active member). Also the missing dependency of chama_deletion_notices (REC-13).
create or replace function public.chama_role(cid text) returns text
language sql stable security definer set search_path = public, pg_temp as $$
  select m.role from public.chama_members m where m.chama_id = cid and m.user_id = auth.uid() and m.status = 'active';
$$;

revoke all on function public.chama_can_user(uuid, text, text) from public, anon, authenticated;
revoke all on function public.chama_can(text, text), public.chama_role(text) from public, anon;
grant execute on function public.chama_can(text, text), public.chama_role(text) to authenticated;

-- ---------- server-side audit trail ----------
create table if not exists public.chama_audit (
  id uuid primary key default gen_random_uuid(),
  chama_id text not null references public.chamas(id) on delete cascade,
  actor uuid,
  action text not null,
  target text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists chama_audit_chama_time on public.chama_audit (chama_id, created_at desc);
alter table public.chama_audit enable row level security;
drop policy if exists chama_audit_read on public.chama_audit;
create policy chama_audit_read on public.chama_audit for select to authenticated using (public.chama_can(chama_id, 'audit.view'));
revoke all on public.chama_audit from anon, authenticated;
grant select on public.chama_audit to authenticated;

create or replace function public.audit_log(cid text, p_actor uuid, p_action text, p_target text, p_detail jsonb default '{}')
returns void language sql security definer set search_path = public, pg_temp as $$
  insert into public.chama_audit (chama_id, actor, action, target, detail) values (cid, p_actor, p_action, p_target, coalesce(p_detail, '{}'));
$$;
revoke all on function public.audit_log(text, uuid, text, text, jsonb) from public, anon, authenticated;

-- ---------- role changes (server-enforced) ----------
create or replace function public.set_member_role(cid text, p_email text, p_role text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare tgt public.chama_members; em text := lower(btrim(p_email));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.chama_can(cid, 'roles.assign') then raise exception 'Only the treasurer can change roles'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  select * into tgt from public.chama_members where chama_id = cid and email = em and status = 'active' for update;
  if not found then raise exception 'That person is not an active member'; end if;
  if tgt.user_id = auth.uid() and tgt.role <> p_role then raise exception 'You cannot change your own role'; end if;
  if tgt.role = p_role then return; end if;
  update public.chama_members set role = p_role where chama_id = cid and email = em;   -- last-treasurer trigger guards demotions
  perform public.audit_log(cid, auth.uid(), 'role.change', em, jsonb_build_object('from', tgt.role, 'to', p_role));
end $$;
revoke all on function public.set_member_role(text, text, text) from public, anon;
grant execute on function public.set_member_role(text, text, text) to authenticated;

-- ---------- legacy RPCs: same signatures, tighter behaviour (v0.11.0 clients keep working) ----------
-- Differences from the exported definitions: accepts 'secretary'; a REMOVED person is not silently re-activated
-- (they go back to 'invited' and must sign in/claim again after an explicit treasurer action); writes an audit row.
create or replace function public.invite_member(cid text, p_email text, p_member text, p_role text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email));
begin
  if not public.chama_can(cid, 'members.invite') then raise exception 'Only the treasurer can add people'; end if;
  if p_role not in ('member', 'secretary', 'treasurer') then raise exception 'Unknown role'; end if;
  if em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'That email address looks wrong'; end if;
  insert into public.chama_members (chama_id, email, member_id, role, status)
  values (cid, em, nullif(p_member, ''), p_role, 'invited')
  on conflict (chama_id, email) do update
     set role = excluded.role,
         member_id = coalesce(excluded.member_id, public.chama_members.member_id),
         user_id = case when public.chama_members.status = 'removed' then null else public.chama_members.user_id end,
         status = case when public.chama_members.status = 'removed' then 'invited'
                       when public.chama_members.user_id is null then 'invited' else public.chama_members.status end;
  perform public.audit_log(cid, auth.uid(), 'member.invite_legacy', em, jsonb_build_object('role', p_role));
end $$;

create or replace function public.remove_member(cid text, p_email text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare em text := lower(btrim(p_email));
begin
  if not public.chama_can(cid, 'members.remove') then raise exception 'Only the treasurer can remove access'; end if;
  if em = lower(auth.jwt() ->> 'email') then raise exception 'You cannot remove your own access'; end if;
  update public.chama_members set status = 'removed' where chama_id = cid and email = em;   -- last-treasurer trigger guards
  perform public.audit_log(cid, auth.uid(), 'member.remove', em, '{}');
end $$;

commit;

-- ROLLBACK NOTES: restore legacy invite_member/remove_member from the exported definitions (Stage 0 export);
--   drop trigger chama_members_last_treasurer on public.chama_members; drop function guard_last_treasurer();
--   drop function set_member_role(text,text,text), chama_role(text), chama_can(text,text), chama_can_user(uuid,text,text), audit_log(...);
--   drop table chama_audit, role_permissions;  alter table chama_members drop constraint chama_members_role_check,
--   add constraint chama_members_role_check check (role in ('member','treasurer'));  (fails if secretary rows exist: change them first)
--   drop index chama_members_one_active_per_user, chama_members_id_key; alter table chama_members drop column id, drop column updated_at;
