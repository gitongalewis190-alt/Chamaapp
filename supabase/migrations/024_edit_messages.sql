-- 024: edit messages and announcements. NOT YET APPLIED. Written 2026-11-19; test inside BEGIN ... ROLLBACK first.
-- Who can edit:
--   * the sender, for their own text, announcement and minutes messages;
--   * the treasurer or secretary, for any GROUP announcement or pinned message (they keep the notice board).
-- The previous wording is kept in meta.history (last 5 versions) with who changed it and when, so an edit is never silent.
-- Removed messages cannot be edited. Meetings, polls and payment requests are not edited this way.

create or replace function public.edit_chama_message(p_id uuid, p_body text, p_title text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare msg public.chama_messages; me text; hist jsonb; v_body text := btrim(coalesce(p_body, ''));
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into msg from public.chama_messages where id = p_id for update;
  if not found then raise exception 'Message not found'; end if;
  me := private.my_role(msg.chama_id);
  if me is null then raise exception 'Message not found'; end if;
  if msg.deleted_at is not null then raise exception 'This message was removed'; end if;
  if msg.kind not in ('text', 'announcement', 'minutes') then raise exception 'This kind of message cannot be edited'; end if;
  if not (msg.sender = auth.uid() or (me in ('treasurer', 'secretary') and msg.recipient is null and (msg.kind = 'announcement' or msg.pinned))) then
    raise exception 'You can edit only your own messages';
  end if;
  if char_length(v_body) = 0 then raise exception 'The message cannot be empty'; end if;
  if char_length(v_body) > 4000 then raise exception 'Keep it under 4000 characters'; end if;
  hist := coalesce(msg.meta -> 'history', '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
    'body', left(msg.body, 4000), 'title', msg.meta ->> 'title', 'at', coalesce(msg.edited_at, msg.created_at), 'by', private.person_name(auth.uid(), null)));
  if jsonb_array_length(hist) > 5 then hist := (select coalesce(jsonb_agg(e order by o), '[]'::jsonb) from jsonb_array_elements(hist) with ordinality x(e, o) where o > jsonb_array_length(hist) - 5); end if;
  update public.chama_messages
     set body = v_body,
         meta = (case when p_title is not null and msg.kind in ('announcement', 'minutes') then msg.meta || jsonb_build_object('title', left(btrim(p_title), 120)) else msg.meta end)
                || jsonb_build_object('history', hist, 'edited_by', private.person_name(auth.uid(), null)),
         edited_at = now()
   where id = p_id;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.edit_chama_message(uuid, text, text) from public, anon;
grant execute on function public.edit_chama_message(uuid, text, text) to authenticated;

-- CHECK (inside BEGIN ... ROLLBACK): as the sender, select public.edit_chama_message('<id>', 'new words');
-- then select body, edited_at, meta -> 'history' from public.chama_messages where id = '<id>';
