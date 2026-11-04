-- 000_base_tables.sql
-- RECONSTRUCTED on 2026-11-03 from the live database state. The original core-tables file was never
-- supplied in the project ZIP, and no migration in the repo created these three tables. Every object below
-- already exists in production: DO NOT apply to live. Use only to rebuild a fresh database. Runs before 001.

create table if not exists public.chamas (
  id          text primary key,
  data        jsonb not null,                       -- the whole Chama document (legacy whole-document model)
  updated_at  timestamptz not null default now(),
  name        text,
  version     bigint not null default 1,            -- bumped by trigger chamas_bump (008) for safe saves
  display_tag text unique
);
alter table public.chamas enable row level security;

create table if not exists public.chama_members (
  chama_id   text not null references public.chamas(id) on delete cascade,
  email      text not null,
  user_id    uuid references auth.users(id) on delete set null,
  role       text not null default 'member' check (role in ('member','secretary','treasurer')),
  member_id  text,
  status     text not null default 'invited' check (status in ('invited','active','removed')),
  created_at timestamptz not null default now(),
  id         uuid not null default gen_random_uuid(),
  updated_at timestamptz not null default now(),
  joined_at  timestamptz,
  primary key (chama_id, email)
);
create unique index if not exists chama_members_id_key on public.chama_members (id);
create index if not exists chama_members_user_idx on public.chama_members (user_id);
create unique index if not exists chama_members_one_active_per_user on public.chama_members (chama_id, user_id)
  where user_id is not null and status = 'active';
alter table public.chama_members enable row level security;

create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  username                text not null unique check (username ~ '^[A-Za-z0-9._-]{3,20}$'),
  role                    text not null default 'member' check (role in ('member','treasurer','developer')),
  created_at              timestamptz not null default now(),
  full_name               text check (full_name is null or char_length(full_name) <= 120),
  phone                   text check (phone is null or phone ~ '^\+?[0-9 ()-]{7,20}$'),
  updated_at              timestamptz not null default now(),
  deletion_requested_at   timestamptz,
  deletion_reason         text
);
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));
alter table public.profiles enable row level security;


-- Per-Chama member profile row. Created here because migrations 004 and 008 reference it before 012 adds its policies.
create table if not exists public.member_profiles (
  chama_id   text not null references public.chamas(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  email      text,
  photo      text,
  updated_at timestamptz not null default now(),
  primary key (chama_id, user_id)
);
alter table public.member_profiles enable row level security;

-- Membership helpers used by RLS policies. Live definitions, copied verbatim in behaviour.
create or replace function public.is_active_member(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.chama_members m
    where m.chama_id = cid and m.user_id = auth.uid() and m.status = 'active'
  );
$$;

create or replace function public.is_treasurer(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.chama_members m
    where m.chama_id = cid and m.user_id = auth.uid()
      and m.status = 'active' and m.role = 'treasurer'
  );
$$;

revoke all on function public.is_active_member(text), public.is_treasurer(text) from public, anon;
grant execute on function public.is_active_member(text), public.is_treasurer(text) to authenticated;

-- ROLLBACK NOTES: drop tables profiles, chama_members, chamas (only on a fresh database; never on live).

-- Policies that existed in the live base schema but were missing from the repo (restored 2026-11-04, applied to staging).
create policy members_read on public.chama_members for select to authenticated
  using (user_id = auth.uid() or public.is_treasurer(chama_id));
create policy chamas_update_treasurer on public.chamas for update to authenticated
  using (public.is_treasurer(id)) with check (public.is_treasurer(id));
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
