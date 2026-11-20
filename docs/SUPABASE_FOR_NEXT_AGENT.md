# Supabase work for the next agent (My Chama, release 0.18.2)

> **Status 2026-11-20: section 1 is DONE.** 023-027 are applied and verified (checks all ok, both in migration history,
> no advisor errors). Remaining: section 2 (dashboard items), and optionally `supabase/migrations/028_local_phone_search_path.sql`.

The owner (Lewis) has approved running all of this. The session that wrote it could not: its Supabase connector was signed
in to an account that only has **"The lees app"** (`emimwlpsfchndxaxzswh`). My Chama is **`sgfvjsxmchohawhqraii`**.

**Before anything:** call `list_projects`. If `sgfvjsxmchohawhqraii` is not listed, stop and tell the owner to reconnect the
Supabase connector with the account that owns My Chama (claude.ai → Settings → Connectors), then start a new session.
Never run any of this against "The lees app".

## 1. The database update (one file)
`supabase/APPLY_ALL_PENDING.sql` = migrations 023 + 024 + 025 + 026 + 027 in one transaction, then checks.
- 023-025 were already run by the owner (release check S1/S2 passed). 026 and 027 are new. The file is safe to re-run.
- It was checked with Postgres's own parser (libpg_query 18: 74 statements, 38 PL/pgSQL bodies), never run on a database.

Steps:
1. **Dry run.** `execute_sql` with the whole file, but replace the line `commit;` with `rollback;` and drop everything after it.
   It must finish without an error. If it errors, report the message and stop; nothing changed.
2. **Apply.** `execute_sql` with the whole file as it is (it has its own `begin; ... commit;`), or `apply_migration`
   named `apply_all_pending_023_027` with the part between `begin;` and `commit;` (apply_migration wraps it itself).
3. **Check.** Run the three queries after `commit;`. Every row of the first must say `ok = true`.
4. `get_advisors` security and performance. Every new table has RLS on and no policies except "read your own row"; report any new warning.
5. Tell the owner the result in plain words, then mark checks F-S1 and F-S3 on the release check page.

What each migration turns on in the live app (all already shipped; they switch on when the database has them):
| | Turns on |
|---|---|
| 023 | Role offers (accept/decline), one treasurer and one secretary, reasons for stepping down/leaving, removal with notice |
| 024 | Editing messages and pinned announcements |
| 025 | Invitation link goes straight to sign-in or create account; username check; usernames never reused; Know your Chama stored on the server |
| 026 | About you (date of birth, gender) on the server; loan terms signed on the borrower's phone; Chama photos in the chooser |
| 027 | One phone number for every Chama (profile phone fills each member entry on join; a changed number updates them) |

## 2. Not SQL, needs the owner or the dashboard
- **Code email reaching many inboxes** (release check A2/A4). The app sends one `signInWithOtp` to one address. Check Brevo →
  Transactional → Logs (the To of one "is your My Chama code" email), Brevo settings for a BCC copy, Supabase →
  Authentication → Emails → SMTP, and Authentication → Auth Hooks (a "send email" hook). The app side is already hardened:
  a code link only signs in on the phone that asked for it.
- **Backups**: the Free plan has none. Pro gives 7 days; otherwise download Reports → Full backup regularly.
- **Legal placeholders**: `legal/privacy.html`, `legal/terms.html`, `APP` in `assets/app.js`, `.well-known/security.txt`.

## 3. Optional admin script
`supabase/admin/erase_person_completely.sql` erases one person (set for artislifefoundation2023@gmail.com) including their
entry in each Chama's books. Run only if the owner still wants it; it stops if that person is the only treasurer of a Chama.

## 4. Nothing else to deploy
No Edge Function code changed in this work (auth-login, send-invitation unchanged). The email templates did not change.
