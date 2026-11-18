-- 019_global_profile.sql
-- Purpose: one profile for every Chama. Photo, name, username, phone and contact email live on the account
-- (public.profiles) and are used in every Chama. Adds the three functions the app has called since 0.12.2:
--   save_my_details, set_my_photo, get_chama_member_profiles
-- and extends get_my_profile with photo, contact_email and sign_in_email.
-- Members of the same Chama see each other's name and photo only (never phone or email).
-- Prereqs: 000 to 018 applied.
-- Rollback:
--   drop function public.get_chama_member_profiles(text); drop function public.set_my_photo(text);
--   drop function public.save_my_details(text, text, text, text);
--   restore get_my_profile from 001; alter table public.profiles drop column photo, drop column contact_email;
begin;

alter table public.profiles add column if not exists photo text;
alter table public.profiles add column if not exists contact_email text;

alter table public.profiles drop constraint if exists profiles_photo_ok;
alter table public.profiles add constraint profiles_photo_ok
  check (photo is null or (photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$' and octet_length(photo) <= 200000));
alter table public.profiles drop constraint if exists profiles_contact_email_ok;
alter table public.profiles add constraint profiles_contact_email_ok
  check (contact_email is null or (char_length(contact_email) <= 254 and contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'));

-- one-time copy: the newest per-Chama photo and email become the account's, where the account has none
update public.profiles p set photo = s.photo
  from (select distinct on (user_id) user_id, photo from public.member_profiles
         where photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$' and octet_length(photo) <= 200000
         order by user_id, updated_at desc) s
 where s.user_id = p.id and p.photo is null;
update public.profiles p set contact_email = lower(s.email)
  from (select distinct on (user_id) user_id, btrim(email) email from public.member_profiles
         where email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254
         order by user_id, updated_at desc) s
 where s.user_id = p.id and p.contact_email is null;
update public.profiles p set phone = s.phone
  from (select distinct on (user_id) user_id, btrim(phone) phone from public.member_profiles
         where phone ~ '^\+?[0-9 ()-]{7,20}$' order by user_id, updated_at desc) s
 where s.user_id = p.id and p.phone is null;

-- the signed-in person's account profile
create or replace function public.get_my_profile()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('id', p.id, 'username', p.username, 'full_name', p.full_name, 'phone', p.phone,
                            'contact_email', p.contact_email, 'photo', p.photo,
                            'sign_in_email', (select u.email from auth.users u where u.id = p.id))
  from public.profiles p where p.id = auth.uid();
$$;
revoke all on function public.get_my_profile() from public, anon;
grant execute on function public.get_my_profile() to authenticated;

-- name, phone, contact email and (optionally) username, for every Chama at once. Empty phone or email clears it.
create or replace function public.save_my_details(p_full_name text, p_phone text default null,
                                                  p_contact_email text default null, p_username text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  uid uuid := auth.uid();
  u   text := public.normalize_username(p_username);
  fn  text := nullif(btrim(coalesce(p_full_name, '')), '');
  ph  text := nullif(btrim(coalesce(p_phone, '')), '');
  em  text := lower(nullif(btrim(coalesce(p_contact_email, '')), ''));
  rec public.profiles;
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if fn is null then raise exception 'Enter your name'; end if;
  if char_length(fn) > 120 then raise exception 'Name is too long'; end if;
  if ph is not null and ph !~ '^\+?[0-9 ()-]{7,20}$' then raise exception 'Phone number looks wrong'; end if;
  if em is not null and (char_length(em) > 254 or em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then raise exception 'Email address looks wrong'; end if;
  if u is not null and u !~ '^[a-z0-9._-]{3,20}$' then raise exception 'Username must be 3 to 20 letters, numbers, dot, dash or underscore'; end if;
  if u is not null and u ~ '^user[0-9a-f]{8}$' then raise exception 'Choose a different username'; end if;

  if not exists (select 1 from public.profiles where id = uid) then
    if u is null then raise exception 'Choose a username'; end if;
    insert into public.profiles (id, username, full_name, phone, contact_email) values (uid, u, fn, ph, em) returning * into rec;
  else
    update public.profiles
       set username = coalesce(u, username), full_name = fn, phone = ph, contact_email = em, updated_at = now()
     where id = uid returning * into rec;
  end if;
  -- keep the per-Chama copies in step, so older screens show the same details
  update public.member_profiles set name = fn, phone = ph, email = em, updated_at = now() where user_id = uid;
  return jsonb_build_object('id', rec.id, 'username', rec.username, 'full_name', rec.full_name,
                            'phone', rec.phone, 'contact_email', rec.contact_email);
exception when unique_violation then
  raise exception 'That username is already taken';
end $$;
revoke all on function public.save_my_details(text, text, text, text) from public, anon;
grant execute on function public.save_my_details(text, text, text, text) to authenticated;

-- one photo for every Chama. Empty or null removes it. Only a plain base64 JPEG is accepted.
create or replace function public.set_my_photo(p_photo text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare uid uuid := auth.uid(); ph text := nullif(btrim(coalesce(p_photo, '')), '');
begin
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if ph is not null and ph !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$' then raise exception 'Photo must be a JPEG image'; end if;
  if ph is not null and octet_length(ph) > 200000 then raise exception 'Photo is too large'; end if;
  update public.profiles set photo = ph, updated_at = now() where id = uid;
  if not found then raise exception 'Finish creating your account first'; end if;
  update public.member_profiles set photo = ph, updated_at = now() where user_id = uid;
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.set_my_photo(text) from public, anon;
grant execute on function public.set_my_photo(text) to authenticated;

-- names and photos of the linked, active members of a Chama, for anyone active in that Chama
create or replace function public.get_chama_member_profiles(p_cid text)
returns table (member_id text, name text, photo text)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not (public.is_active_member(p_cid) or public.chama_can(p_cid, 'chama.view_shared')) then
    raise exception 'Not a member of this Chama' using errcode = '42501';
  end if;
  return query
    select m.member_id, coalesce(nullif(p.full_name, ''), mp.name), coalesce(p.photo, mp.photo)
      from public.chama_members m
      left join public.profiles p on p.id = m.user_id
      left join public.member_profiles mp on mp.chama_id = m.chama_id and mp.user_id = m.user_id
     where m.chama_id = p_cid and m.status = 'active' and m.user_id is not null and m.member_id is not null;
end $$;
revoke all on function public.get_chama_member_profiles(text) from public, anon;
grant execute on function public.get_chama_member_profiles(text) to authenticated;

commit;
