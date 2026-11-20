-- 029: group chat rebuild (0.19.0) and phone numbers shared within the group. Written 2026-11-20. Adds only; drops no data.
--   1. Messages may be voice notes, photos and files (kind voice | image | file). Stored files go in a private bucket
--      'chat-media' at <chama>/<sender>/<uuid>.<ext>; only people who can read the message can read the file.
--   2. View once: the photo or sound is kept in a table no one can read directly. open_chat_once hands it over one time
--      per person and records who opened it; once everyone it was meant for has opened it, the data is deleted.
--   3. Reactions (one per person per message), "seen by" for a conversation, and a group chat theme anyone can change.
--   4. Phone numbers: a person agrees to share theirs with their Chama (profiles.phone_shared_at). member_phones shows
--      the numbers of members who agreed, only to members who agreed too.
-- Safe to run twice.

------------------------------------------------------------------------------------------------
-- 1. Media messages
------------------------------------------------------------------------------------------------
alter table public.chama_messages drop constraint if exists chama_messages_kind_check;
alter table public.chama_messages add constraint chama_messages_kind_check
  check (kind in ('text', 'announcement', 'meeting', 'minutes', 'poll', 'payment_request', 'statement', 'system', 'voice', 'image', 'file'));
create index if not exists chama_messages_path_idx on public.chama_messages ((meta ->> 'path')) where meta ? 'path';

create or replace function public.send_chama_message(p_cid text, p_kind text, p_body text, p_meta jsonb default '{}'::jsonb, p_recipient uuid default null)
returns public.chama_messages language plpgsql security definer set search_path = public, pg_temp as $$
declare me public.chama_members; tgt public.chama_members; msg public.chama_messages; nm text; b text := btrim(coalesce(p_body, '')); meta jsonb := coalesce(p_meta, '{}'::jsonb);
        title text; recent int; media boolean := p_kind in ('voice', 'image', 'file');
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into me from public.chama_members where chama_id = p_cid and user_id = auth.uid() and status = 'active';
  if not found then raise exception 'You are not a member of this Chama'; end if;
  if p_kind not in ('text', 'announcement', 'meeting', 'minutes', 'poll', 'payment_request', 'statement', 'voice', 'image', 'file') then raise exception 'Unknown message type'; end if;
  if p_kind in ('announcement', 'meeting', 'minutes', 'poll') and me.role = 'member' then raise exception 'Only the treasurer or secretary can post this'; end if;
  if p_kind in ('payment_request', 'statement') and me.role <> 'treasurer' then raise exception 'Only the treasurer can send this'; end if;
  if p_kind = 'text' and b = '' then raise exception 'Write a message first'; end if;
  if char_length(b) > 4000 then raise exception 'That message is too long'; end if;
  if jsonb_typeof(meta) <> 'object' then raise exception 'Bad message details'; end if;
  if media then
    -- a stored file must be the sender's own upload for this Chama; view once comes only through send_chat_once
    if coalesce((meta ->> 'once')::boolean, false) then
      if current_setting('chama.once', true) is distinct from 'on' then raise exception 'Send view once through the app'; end if;
      meta := meta - 'path';
    elsif cardinality(string_to_array(coalesce(meta ->> 'path', ''), '/')) <> 3
       or split_part(meta ->> 'path', '/', 1) <> p_cid or split_part(meta ->> 'path', '/', 2) <> auth.uid()::text
       or split_part(meta ->> 'path', '/', 3) !~ '^[0-9a-f-]{36}\.[a-z0-9]{1,5}$' then
      raise exception 'The file was not uploaded';
    end if;
    meta := meta - 'opened_by';
  end if;
  select count(*) into recent from public.chama_messages where sender = auth.uid() and created_at > now() - interval '1 minute';
  if recent >= 30 then raise exception 'You are sending messages too fast. Wait a minute.'; end if;
  if p_recipient is not null then
    if p_kind in ('announcement', 'meeting', 'minutes', 'poll') then raise exception 'This goes to the whole group'; end if;
    if p_recipient = auth.uid() then raise exception 'Choose someone else'; end if;
    select * into tgt from public.chama_members where chama_id = p_cid and user_id = p_recipient and status = 'active';
    if not found then raise exception 'That person is not in this Chama'; end if;
    if me.role = 'member' and tgt.role = 'member' then raise exception 'Members can message the treasurer or secretary privately'; end if;
  end if;
  if p_kind = 'poll' then
    if jsonb_typeof(meta -> 'options') <> 'array' or jsonb_array_length(meta -> 'options') < 2 or jsonb_array_length(meta -> 'options') > 8 then
      raise exception 'A poll needs 2 to 8 options'; end if;
    if b = '' then raise exception 'Write the poll question'; end if;
  elsif p_kind = 'meeting' then
    if coalesce(meta ->> 'when', '') = '' then raise exception 'Choose the meeting date and time'; end if;
  elsif p_kind = 'payment_request' then
    if coalesce(public.jnum(meta -> 'amount'), 0) <= 0 then raise exception 'Enter the amount'; end if;
  end if;
  nm := private.person_name(auth.uid(), me.email);
  insert into public.chama_messages (chama_id, sender, sender_name, sender_role, recipient, kind, body, meta, pinned)
  values (p_cid, auth.uid(), nm, me.role, p_recipient, p_kind, b, meta, p_kind = 'announcement' and coalesce((meta ->> 'pin')::boolean, true))
  returning * into msg;
  insert into public.chama_message_reads (chama_id, user_id, thread, last_read_at)
  values (p_cid, auth.uid(), coalesce(p_recipient::text, 'group'), now())
  on conflict (chama_id, user_id, thread) do update set last_read_at = excluded.last_read_at;
  -- conversation messages (text, voice, photo, file) never become notifications: no preview leaves the chat
  if p_kind not in ('text', 'voice', 'image', 'file') then
    title := case p_kind when 'announcement' then 'Announcement from ' || nm
                         when 'meeting' then 'Meeting called: ' || coalesce(nullif(meta ->> 'title', ''), 'Chama meeting')
                         when 'minutes' then 'Minutes shared: ' || coalesce(nullif(meta ->> 'title', ''), 'last meeting')
                         when 'poll' then 'Vote: ' || left(b, 100)
                         when 'payment_request' then 'Payment request: KES ' || to_char(public.jnum(meta -> 'amount'), 'FM999,999,990')
                         else 'Statement from the treasurer' end;
    perform private.notify(p_cid, 'message_' || p_kind, title, left(coalesce(nullif(b, ''), meta ->> 'title', ''), 200),
      '#/chat/' || case when p_recipient is null then 'group' else auth.uid()::text end, null, p_recipient, auth.uid(),
      case when p_kind in ('payment_request', 'meeting', 'poll') then 'important' else 'normal' end, jsonb_build_object('message', msg.id));
  end if;
  return msg;
end $$;

-- private bucket for chat files, 10 MB each
insert into storage.buckets (id, name, public, file_size_limit)
values ('chat-media', 'chat-media', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists chat_media_insert on storage.objects;
create policy chat_media_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'chat-media' and (storage.foldername(name))[2] = (select auth.uid())::text and public.is_active_member((storage.foldername(name))[1]));
drop policy if exists chat_media_read on storage.objects;
create policy chat_media_read on storage.objects for select to authenticated using (
  bucket_id = 'chat-media' and (
    ((storage.foldername(name))[2] = (select auth.uid())::text and public.is_active_member((storage.foldername(name))[1]))
    or exists (select 1 from public.chama_messages m where m.meta ->> 'path' = storage.objects.name and m.deleted_at is null
               and public.is_active_member(m.chama_id) and (m.recipient is null or m.recipient = (select auth.uid()) or m.sender = (select auth.uid())))));
drop policy if exists chat_media_delete on storage.objects;
create policy chat_media_delete on storage.objects for delete to authenticated using (
  bucket_id = 'chat-media' and (storage.foldername(name))[2] = (select auth.uid())::text);

------------------------------------------------------------------------------------------------
-- 2. View once
------------------------------------------------------------------------------------------------
create table if not exists public.chama_once_media (
  message_id uuid primary key references public.chama_messages(id) on delete cascade,
  chama_id text not null references public.chamas(id) on delete cascade,
  mime text not null,
  data text not null check (octet_length(data) <= 8500000),
  created_at timestamptz not null default now()
);
alter table public.chama_once_media enable row level security;   -- no policies: only the functions below read it
revoke all on public.chama_once_media from anon, authenticated;

create or replace function public.send_chat_once(p_cid text, p_kind text, p_body text, p_meta jsonb, p_recipient uuid, p_data text)
returns public.chama_messages language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; mime text := coalesce(p_meta ->> 'mime', '');
begin
  if p_kind not in ('voice', 'image') then raise exception 'Only photos and voice notes can be view once'; end if;
  if coalesce(p_data, '') = '' or octet_length(p_data) > 8500000 then raise exception 'That is too big to send as view once'; end if;
  if p_data !~ '^[A-Za-z0-9+/=]+$' then raise exception 'Bad file'; end if;
  if (p_kind = 'image' and mime !~ '^image/') or (p_kind = 'voice' and mime !~ '^audio/') then raise exception 'Bad file type'; end if;
  perform set_config('chama.once', 'on', true);
  msg := public.send_chama_message(p_cid, p_kind, p_body, coalesce(p_meta, '{}'::jsonb) || jsonb_build_object('once', true, 'opened_by', '[]'::jsonb), p_recipient);
  perform set_config('chama.once', 'off', true);
  update public.chama_messages set meta = meta || jsonb_build_object('opened_by', '[]'::jsonb) where id = msg.id returning * into msg;
  insert into public.chama_once_media (message_id, chama_id, mime, data) values (msg.id, p_cid, mime, p_data);
  return msg;
end $$;

create or replace function public.open_chat_once(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; od jsonb; d public.chama_once_media; meant int; opened int;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into msg from public.chama_messages where id = p_id for update;
  if not found or msg.deleted_at is not null or not public.is_active_member(msg.chama_id)
     or not (msg.recipient is null or msg.recipient = auth.uid() or msg.sender = auth.uid()) then raise exception 'Message not found'; end if;
  if not coalesce((msg.meta ->> 'once')::boolean, false) then raise exception 'This is not a view once message'; end if;
  if msg.sender = auth.uid() then raise exception 'You sent this. View once opens only for the people it was sent to.'; end if;
  od := coalesce(msg.meta -> 'opened_by', '[]'::jsonb);
  if od ? auth.uid()::text then raise exception 'You already opened this. View once opens one time.'; end if;
  select * into d from public.chama_once_media where message_id = p_id;
  if not found then raise exception 'This has already been opened by everyone and is gone'; end if;
  od := od || to_jsonb(auth.uid()::text);
  update public.chama_messages set meta = meta || jsonb_build_object('opened_by', od) where id = p_id;
  -- everyone it was meant for has opened it: delete the photo or sound for good
  if msg.recipient is not null then meant := 1;
  else select count(*) into meant from public.chama_members where chama_id = msg.chama_id and status = 'active' and user_id is not null and user_id <> msg.sender; end if;
  opened := jsonb_array_length(od);
  if opened >= meant then delete from public.chama_once_media where message_id = p_id; end if;
  return jsonb_build_object('data', d.data, 'mime', d.mime);
end $$;

------------------------------------------------------------------------------------------------
-- 3. Reactions, seen by, chat theme
------------------------------------------------------------------------------------------------
create or replace function public.react_chama_message(p_id uuid, p_emoji text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into msg from public.chama_messages where id = p_id and deleted_at is null;
  if not found or not public.is_active_member(msg.chama_id) or not (msg.recipient is null or msg.recipient = auth.uid() or msg.sender = auth.uid()) then
    raise exception 'Message not found'; end if;
  if msg.kind not in ('text', 'voice', 'image', 'file') then raise exception 'You cannot react to this'; end if;
  if p_emoji is null or p_emoji = '' then
    delete from public.chama_message_responses where message_id = p_id and user_id = auth.uid() and choice like 'r:%';
    return jsonb_build_object('ok', true);
  end if;
  if p_emoji not in ('👍', '❤️', '😂', '🙏', '👏', '😮') then raise exception 'That reaction is not allowed'; end if;
  insert into public.chama_message_responses (message_id, user_id, chama_id, choice, name)
  values (p_id, auth.uid(), msg.chama_id, 'r:' || p_emoji, private.person_name(auth.uid(), null))
  on conflict (message_id, user_id) do update set choice = excluded.choice, created_at = now();
  return jsonb_build_object('ok', true);
end $$;

-- who has read a conversation, and up to when (the other side of a private chat, or the group)
create or replace function public.chat_seen(p_cid text, p_thread text)
returns table(user_id uuid, name text, last_read_at timestamptz)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.is_active_member(p_cid) then raise exception 'You are not a member of this Chama'; end if;
  if p_thread = 'group' then
    return query select r.user_id, private.person_name(r.user_id, null), r.last_read_at
      from public.chama_message_reads r join public.chama_members m on m.chama_id = r.chama_id and m.user_id = r.user_id and m.status = 'active'
     where r.chama_id = p_cid and r.thread = 'group' and r.user_id <> auth.uid();
  elsif p_thread ~ '^[0-9a-f-]{36}$' then
    return query select r.user_id, private.person_name(r.user_id, null), r.last_read_at
      from public.chama_message_reads r where r.chama_id = p_cid and r.user_id = p_thread::uuid and r.thread = auth.uid()::text;
  else raise exception 'Bad thread'; end if;
end $$;

create table if not exists public.chama_chat_prefs (
  chama_id text primary key references public.chamas(id) on delete cascade,
  theme text not null default 'app' check (theme in ('app', 'savanna', 'ocean', 'forest', 'dusk', 'rose', 'sunset', 'slate')),
  updated_by uuid,
  updated_by_name text,
  updated_at timestamptz not null default now()
);
alter table public.chama_chat_prefs enable row level security;
drop policy if exists chat_prefs_read on public.chama_chat_prefs;
create policy chat_prefs_read on public.chama_chat_prefs for select to authenticated using (public.is_active_member(chama_id));

create or replace function public.set_chat_theme(p_cid text, p_theme text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare nm text; label text;
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  if not public.is_active_member(p_cid) then raise exception 'You are not a member of this Chama'; end if;
  if p_theme not in ('app', 'savanna', 'ocean', 'forest', 'dusk', 'rose', 'sunset', 'slate') then raise exception 'Unknown theme'; end if;
  nm := private.person_name(auth.uid(), null);
  insert into public.chama_chat_prefs (chama_id, theme, updated_by, updated_by_name, updated_at) values (p_cid, p_theme, auth.uid(), nm, now())
  on conflict (chama_id) do update set theme = excluded.theme, updated_by = excluded.updated_by, updated_by_name = excluded.updated_by_name, updated_at = now();
  label := case p_theme when 'app' then 'App colours' else initcap(p_theme) end;
  insert into public.chama_messages (chama_id, sender, sender_name, sender_role, kind, body)
  values (p_cid, auth.uid(), nm, coalesce(private.my_role(p_cid), 'member'), 'system', nm || ' changed the chat theme to ' || label);
  return jsonb_build_object('ok', true, 'theme', p_theme);
end $$;

------------------------------------------------------------------------------------------------
-- 4. Phone numbers shared within the group
------------------------------------------------------------------------------------------------
alter table public.profiles add column if not exists phone_shared_at timestamptz;

create or replace function public.set_phone_sharing(p_on boolean)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  update public.profiles set phone_shared_at = case when p_on then coalesce(phone_shared_at, now()) else null end, updated_at = now() where id = auth.uid();
  if not found then raise exception 'Finish setting up your account first'; end if;
  return jsonb_build_object('ok', true, 'shared', p_on);
end $$;

create or replace function public.member_phones(p_cid text)
returns table(user_id uuid, member_id text, name text, phone text)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.is_active_member(p_cid) then raise exception 'You are not a member of this Chama'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and phone_shared_at is not null) then
    raise exception 'Share your own number first to see the numbers of your group';
  end if;
  return query select m.user_id, m.member_id, private.person_name(m.user_id, m.email), p.phone
    from public.chama_members m join public.profiles p on p.id = m.user_id
   where m.chama_id = p_cid and m.status = 'active' and m.user_id <> auth.uid() and p.phone_shared_at is not null and coalesce(p.phone, '') <> '';
end $$;

create or replace function public.get_my_details()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('full_name', p.full_name, 'phone', p.phone, 'birth_date', p.birth_date, 'gender', p.gender, 'details_at', p.details_at, 'phone_shared_at', p.phone_shared_at)
    from public.profiles p where p.id = auth.uid();
$$;

------------------------------------------------------------------------------------------------
-- grants, live updates
------------------------------------------------------------------------------------------------
do $$ declare f text; begin
  foreach f in array array['public.send_chama_message(text, text, text, jsonb, uuid)', 'public.send_chat_once(text, text, text, jsonb, uuid, text)',
    'public.open_chat_once(uuid)', 'public.react_chama_message(uuid, text)', 'public.chat_seen(text, text)', 'public.set_chat_theme(text, text)',
    'public.set_phone_sharing(boolean)', 'public.member_phones(text)', 'public.get_my_details()'] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
grant select on public.chama_chat_prefs to authenticated;
do $$ begin
  begin alter publication supabase_realtime add table public.chama_chat_prefs; exception when duplicate_object then null; end;
end $$;
notify pgrst, 'reload schema';
