-- 027: one phone number for every Chama. Written 2026-11-20. Adds only; drops nothing.
-- A person's phone lives on their profile. Their entry in each Chama's books gets that number:
--   * when they join a Chama (approved request, accepted invitation, linked to an entry) and the entry has no phone yet;
--   * when they change their number: every entry that still has the OLD number (or none) gets the new one.
-- A number the treasurer typed that differs from the profile is left alone, so a Chama can keep a different number on purpose.
-- Numbers are written the way the app writes them: 07XXXXXXXX / 01XXXXXXXX.

create or replace function private.local_phone(p text) returns text language sql immutable as $$
  select case
    when p is null or btrim(p) = '' then null
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^254[17][0-9]{8}$' then '0' || substr(regexp_replace(p, '[^0-9]', '', 'g'), 4)
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^0[17][0-9]{8}$' then regexp_replace(p, '[^0-9]', '', 'g')
    when regexp_replace(p, '[^0-9]', '', 'g') ~ '^[17][0-9]{8}$' then '0' || regexp_replace(p, '[^0-9]', '', 'g')
    else null end;
$$;

-- put the profile number on one member entry, if that entry has none (or still has the old number)
create or replace function private.member_phone_from_profile(p_cid text, p_mid text, p_phone text, p_old text default null)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare ph text := private.local_phone(p_phone); old text := private.local_phone(p_old);
begin
  if ph is null or p_mid is null then return; end if;
  update public.chamas c set data = jsonb_set(c.data, '{members}', (
      select coalesce(jsonb_agg(case when e ->> 'id' = p_mid and (coalesce(e ->> 'phone', '') = '' or (old is not null and private.local_phone(e ->> 'phone') = old))
                                     then e || jsonb_build_object('phone', ph) else e end order by o), '[]'::jsonb)
        from jsonb_array_elements(public.jarr(c.data -> 'members')) with ordinality x(e, o)))
   where c.id = p_cid
     and exists (select 1 from jsonb_array_elements(public.jarr(c.data -> 'members')) e
                  where e ->> 'id' = p_mid and coalesce(e ->> 'phone', '') is distinct from ph
                    and (coalesce(e ->> 'phone', '') = '' or (old is not null and private.local_phone(e ->> 'phone') = old)));
end $$;

-- joining (or being linked to an entry) brings the number along
create or replace function private.on_member_link_phone() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare ph text;
begin
  if new.status = 'active' and new.member_id is not null and new.user_id is not null
     and (tg_op = 'INSERT' or old.member_id is distinct from new.member_id or old.status is distinct from new.status or old.user_id is distinct from new.user_id) then
    select phone into ph from public.profiles where id = new.user_id;
    perform private.member_phone_from_profile(new.chama_id, new.member_id, ph, null);
  end if;
  return new;
end $$;
drop trigger if exists chama_members_link_phone on public.chama_members;
create trigger chama_members_link_phone after insert or update of status, member_id, user_id on public.chama_members
  for each row execute function private.on_member_link_phone();

-- changing the number on the profile updates every Chama that had the old one (or none)
create or replace function private.on_profile_phone() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare r record;
begin
  if new.phone is distinct from old.phone and private.local_phone(new.phone) is not null then
    for r in select m.chama_id, m.member_id from public.chama_members m where m.user_id = new.id and m.status = 'active' and m.member_id is not null loop
      perform private.member_phone_from_profile(r.chama_id, r.member_id, new.phone, old.phone);
    end loop;
  end if;
  return new;
end $$;
drop trigger if exists profiles_phone_to_chamas on public.profiles;
create trigger profiles_phone_to_chamas after update of phone on public.profiles
  for each row execute function private.on_profile_phone();

-- today: fill every empty member phone from the person's profile
do $$ declare r record; begin
  for r in select m.chama_id, m.member_id, p.phone from public.chama_members m join public.profiles p on p.id = m.user_id
            where m.status = 'active' and m.member_id is not null and p.phone is not null loop
    perform private.member_phone_from_profile(r.chama_id, r.member_id, r.phone, null);
  end loop;
end $$;
