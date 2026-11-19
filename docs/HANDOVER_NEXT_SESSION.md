# Handover for the next Claude session (written 19 November 2026, release 0.16.0)

Read this first. The previous session could **not** run SQL (the Supabase MCP returned "You do not have permission"), so the
database changes below are written and reviewed but **not applied**. The app works without them (it falls back), but these
features stay off until they run.

Project: My Chama, Supabase ref `sgfvjsxmchohawhqraii` (NOT "The lees app"). Owner approved running SQL in this request.
Repo: `gitongalewis190-alt/Chamaapp`. Live: https://chama-livid.vercel.app (Vercel deploys `main`).

## 0a. Status at 0.17.0
The owner applied 023-025 (release check S1/S2 passed). Migration 026 (`supabase/RUN_026.sql`) is written and parse-checked, NOT yet applied.
After it runs: About you saves date of birth and gender on the server, Chama photos show in the chooser, loan terms can be signed on the borrower's phone.
The code email reaching many inboxes is outside the app: check Brevo transactional logs and BCC, Supabase SMTP and Auth Hooks.

## 0. Fastest path for the owner
`supabase/RUN_THIS_IN_SQL_EDITOR.sql` contains 023 + 024 + 025 as ONE transaction (all or nothing), checked with Postgres's own
parser (libpg_query 18). Paste it into Supabase → SQL Editor and run. Then run `supabase/AFTER_UPDATE_CHECKS.sql`: every row
should be `ok = true`. If the owner already did this, skip section 1.

## 1. Apply the migrations, in order, each tested first

For each file: run it inside `begin; … rollback;` with the checks at the bottom of the file, read the output, then apply it
for real with `apply_migration` (name = file name without `.sql`).

| File | What it turns on | Falls back to |
|---|---|---|
| `supabase/migrations/023_roles_offers_reasons_notices.sql` | Role offers you accept/decline, one treasurer and one secretary, step down and leave with a reason, removal with category, reason and notice | Direct role change; leave and remove without reasons |
| `supabase/migrations/024_edit_messages.sql` | Editing messages and pinned announcements, with history | "Editing needs the latest server update" |
| `supabase/migrations/025_invite_routing_and_usernames.sql` | Invitation link goes straight to sign-in / create account; usernames never reused; live username check and suggestions; "Know your Chama" agreement stored on the server | Sign-in screen with a hint; format-only username check; agreement kept on the phone |

Important details:
- 023 **does not redefine** `leave_chama` or `remove_member`. Their LIVE definitions (from 022) mark the member as "left";
  023 only calls them. Do not replace them from the repo files 009/019, which are older.
- 023 does not change Chamas that already have two treasurers or two secretaries. The app shows a warning on People and
  access so the treasurer picks one. Check with: `select chama_id, role, count(*) from chama_members where status='active' and role in ('treasurer','secretary') group by 1,2 having count(*) > 1;`
- 025 adds triggers on `public.profiles`. Test that an ordinary profile update (name, phone) still works inside the rollback.
- After applying: run `get_advisors` (security and performance) and fix anything new.

A test transaction looks like:
```sql
begin;
select set_config('request.jwt.claims', json_build_object('sub', '<treasurer uuid>', 'role', 'authenticated')::text, true);
set local role authenticated;
select public.offer_role('<chama id>', '<member email>', 'secretary', null);
-- switch claims to the member, then:
-- select public.respond_role_offer('<offer id>', true, null);
select role, count(*) from public.chama_members where chama_id = '<chama id>' and status = 'active' group by role;
rollback;
```

## 2. The "forgot password code goes to every group member" report

The app sends one `signInWithOtp` to the single email typed, and no database trigger or Edge Function sends group email.
The most likely cause: the owner's seven sample accounts share one inbox (for example Gmail `+` aliases or the same
address), so every "member" receives it. Check, read-only:
```sql
select lower(split_part(email,'+',1)) || '@' || split_part(email,'@',2) as inbox, count(*), array_agg(email)
from auth.users group by 1 having count(*) > 1;
```
If that is empty, open Supabase Auth logs for one Forgot password attempt and see which addresses the code was sent to;
report back before changing anything.

The second part of the report (reset screen not appearing) **was fixed** in 0.16.0: the reset intent now survives the
email link opening in a new tab, and any email-code sign-in on an account with a password offers a new password.

## 3. Still needs the owner
- Legal placeholders in `legal/privacy.html`, `legal/terms.html`, `APP` in `assets/app.js`, `.well-known/security.txt`.
- M-Pesa code verification against Safaricom: see `docs/MPESA_VERIFICATION.md` (needs a Paybill/Till and Daraja keys).
- SMS sending to members added by name (phones are now stored): needs an SMS provider (e.g. Africa's Talking) and keys.

## 4. Not verified in the last session (verify on real devices)
- Fingerprint/face unlock (WebAuthn platform authenticator): built to the standard, not tried on a real phone.
- "Save as PDF" from the print dialog on iPhone Safari and in the installed app.
- Swipe-down to close sheets on a real touch screen (the gesture was written carefully, not driven by a test).
- Everything that depends on 023/024/025 above.
- Live realtime: role offers and removal notices arrive through notifications (also polled), not tested against the live database.

## 5. How to test locally
- `NODE_PATH=$(npm root -g) node tests/run.js` → 196 scenarios passed at 0.17.0.
- Lint: `npx eslint@8.57.0 --no-eslintrc -c <config with no-undef> --global Tesseract,supabase assets/app.js assets/boot.js sw.js` → clean.
- OCR was verified end to end with real Tesseract on light and dark SMS screenshots under the production CSP.

## 6. Release routine
Bump `?v=` in `index.html` and `sw.js`, bump the `sw.js` cache name (`mca-app-v74` now; the OCR cache `mca-ocr-v1`
changes only when `vendor/tesseract` changes), add release notes, run tests and lint, push the branch, then `HEAD:main`.
