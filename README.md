# My Chama App (MCA)

A savings-group app (chama) that runs as a plain web app on a phone. It works offline once opened and can be added to the home screen.

**Version 0.7.0** · Service-worker cache `mca-app-v25` · Live site: https://chama-livid.vercel.app · Chama id `mrlees` (open with `/?c=mrlees`)

This one file is the complete guide: what the app is, how it is built, how to set up Supabase, how to release, and the rules for anyone (human or AI) who changes it.

—

## Contents

1. [Quick start for a new builder](#1-quick-start-for-a-new-builder)
2. [Files in this folder](#2-files-in-this-folder)
3. [How the app is built](#3-how-the-app-is-built)
4. [Rules for builders](#4-rules-for-builders)
5. [Supabase setup (once)](#5-supabase-setup-once)
6. [Using the app: treasurer and members](#6-using-the-app-treasurer-and-members)
7. [Releasing a new version](#7-releasing-a-new-version)
8. [Testing](#8-testing)
9. [Troubleshooting](#9-troubleshooting)
10. [Adding a backend feature later](#10-adding-a-backend-feature-later)
11. [Features, known gaps and notes](#11-features-known-gaps-and-notes)

—

## 1. Quick start for a new builder

1. Read this whole file.
2. Read section 4 (the rules) before editing anything.
3. Copy the folder, make a backup, then edit only `index.html` for app changes.
4. Run the checks in section 8 and the release checklist in section 7.
5. Deliver the changed files, one per message (see section 4).

—

## 2. Files in this folder

| File | Purpose | When it changes |
|—|—|—|
| `index.html` | The whole app: HTML, CSS and JavaScript in one file. This is what runs. | Most changes |
| `sw.js` | Offline cache. The constant `V` holds the cache name. | Every release |
| `manifest.json` | Home-screen install details | Rarely |
| `icons/` | Home-screen and header logos | Rarely |
| `chama_auth.sql` | Core tables, access rules (RLS) and RPC functions. Run once. | Only with a new re-runnable block |
| `chama_upgrade.sql` | Repairs older tables, adds `app_config` and `get_app_config()`. Safe to run again. | Once per upgrade |
| `supabase/functions/sync-config/index.ts` | Edge Function. Copies the email code length from Supabase Auth into `app_config`. | Only if that logic changes |
| `README.md` | This file. | When a rule or step changes |

`SETUP_GUIDE.md` is retired. Its steps are now in section 5 of this file.

—

## 3. How the app is built

### 3.1 Runtime modes
- **Cloud mode (current):** `CONFIG.supabase` is set. People sign in with an email code. The treasurer adds members by email and sets roles (`treasurer` or `member`). Data is kept in Supabase under the rules in `chama_auth.sql`.
- **Demo mode:** `CONFIG.supabase` is `null`. Everyone is treasurer and data stays in the browser. Never use demo mode for a real group’s money.

### 3.2 Layout of `index.html`
One `<script>` holds several IIFE modules named `__M_<path>`. Order matters:

1. **Top level, before any module:** `Skel` (skeleton markup) and `Welcome` (welcome typing, wave, hide). Every module can reach these.
2. **Modules:** `config`, `lib/dom`, `ui/toast`, `core/a11y`, `core/policy`, `core/backend`, `core/rerender`, `core/utils` (`esc`, `kes`, `uid` and others), `core/domain`, `core/store`, `core/session`, `core/auth`, `core/me`, `core/history`, `core/routes`, `features/auth/gate` (sign-in screens `Gate` and `Otp`), the feature modules (home, contributions, loans, members, fines, expenses, history, reports, profile, settings, notifications, help), `ui/menu`, `ui/nav`, `core/render`, `main`.
3. **Sharing between modules:** a module exports objects with a getter, for example `return { get Otp() { return Otp; } }`. A helper defined inside one module is not visible to another; import it (`const { esc } = __M_src_core_utils_js;`).

### 3.3 Sign-in flow (email code)
1. `Gate.paint()` shows the email screen. **Send code** calls `signInWithOtp` and shows a sending screen.
2. The code screen (`Otp`) shows 8 boxes in two rows (the count follows `app_config.otp_length`). You can type, paste, or long-press the first box to paste. A mail icon folds away when the check starts.
3. When the last digit lands, `Otp.submit` plays the full check animation (fill, ring, grey, merge), then calls `verifyOtp`.
4. **Accepted:** a tick shows, then `Welcome.start(firstName)` types “Welcome, <Name>” with a wave, then `Session.after()` loads membership, then the home skeleton shows for about 1.85 s, then the real page.
5. **Rejected:** the boxes slide back, turn red, shatter, clear, and the cursor returns to the first box.
6. **Code length:** `Session.loadConfig()` reads `app_config.otp_length` through `get_app_config()` before the email screen is drawn. `Session.syncOtp()` calls the `sync-config` function on each open, so the number follows Supabase.
7. **No second factor.** There is no authenticator app or QR step. Do not add one unless the owner asks.

### 3.4 Session states (`Session.status`)
`loading` → `ready` (or `demo`), or `signed-out`, `no-access`, `no-chama`, `error`.
- `error` is only for real sign-in failures. A page that fails to draw shows a toast and does not change the status.
- `Session.verifying` is true while a code is being checked. Focus and sign-in listeners ignore events during that time, so the app cannot flash in and out.

### 3.6 First run and sign-up (0.7.0)
Order on a new device: opening animation (no Skip) → language (English or Kiswahili, stored in `mca-onboard`) → a swipeable tour (images in `tips/01-welcome.png` … `tips/08-privacy.png`; a missing image shows the coloured tile) → privacy policy, which needs both boxes ticked → sign-in screen with **Sign in** and **Sign up** tabs.
- The policy version is `OB_POLICY_VERSION`. Change it when the policy changes, and everyone agrees again.
- **Sign up** sends the same email code. The chama is created only if its id is in `chama_slots` (unchanged). If the email already has a chama, the app says to sign in (`my_chamas`, added in `chama_auth_addon.sql`).
- **Sign in** never creates a chama. Access still depends only on `chama_members`.
- Supabase creates an auth account at the first code request for any email. That is not chama access. See `chama_auth_addon.sql` notes.

### 3.5 Data
- The chama record is one JSON document in `chamas.data`. Writes go through `Store` with a dirty flag and an offline queue.
- Member profiles are in `member_profiles`. Access is in `chama_members`. Chama ids allowed to start are in `chama_slots`.
- `Store.startSync()` subscribes to realtime changes on `chamas`.

—

## 4. Rules for builders

These rules come from the owner. Follow them even if a task seems to need an exception.

1. **Do not tamper.** Change only what the task asks for. Keep working features working.
2. **Email code sign-in only.** Do not add authenticator apps, QR codes, MFA or two-step screens.
3. **Modules cannot see each other’s locals.** Import a helper in every module that uses it.
4. **Every release** updates together: `APP.version` and `APP.notes` in `index.html`, `sw.js` `V`, and this file’s version line.
5. **Deliver files individually,** one per message, captioned “n of N”. Send only the files that changed.
6. **Audit before you present.** Run `node —check` on every `<script>` block, run the browser tests (section 8), and scan for undeclared helpers. Report done only after these pass.
7. **Say what you could not test.** Browser tests use a stub of Supabase. Phone behaviour and the live project must be checked by the owner.
8. **Never invent results.** Do not claim a fix works until it has run.
9. **Show real errors.** Error screens show the actual message. A rendering error never sends a signed-in person back to sign-in.
10. **Keep the owner’s wording.** Labels follow the owner’s copy (“Welcome, John”, “Send again”, “Use a different email”).
11. **Secrets stay out of files.** The personal access token lives only in the Edge Function secret `SUPABASE_PAT`. Never write it into code, docs or chat.
12. **Money rules.** Do not change the data format without a backup and a migration plan.

—

## 5. Supabase setup (once)

You need the Supabase project for this app, the project URL and anon key (already in `index.html`), and this folder. The project reference currently in use is `sgfvjsxmchohawhqraii`.

### 5.1 Create the database parts
1. Supabase → **SQL Editor** → **New query**.
2. Paste all of `chama_auth.sql` and press **Run**. Safe to run again. If it reports an error about an existing table or column, copy the message before running anything else.
3. Paste all of `chama_upgrade.sql` and press **Run**. It repairs older tables and adds the code-length setting. Safe to run again.

### 5.2 Set the code length (6 or 8)
1. Supabase → **Authentication** → **Email** → **OTP length**. Choose **8** (or 6).
2. In the SQL Editor run the same number, so the app matches:
   ```sql
   update public.app_config set value = ‘8’::jsonb where key = ‘otp_length’;
   ```
   Use `’6’` if you chose 6. Both places must match.

### 5.3 Email template shows the code
1. Supabase → **Authentication** → **Email Templates** → **Magic Link**.
2. The body must show the code, so it includes `{{ .Token }}`, for example: “Your sign-in code is {{ .Token }}”. Without it people get a link and no code.

### 5.4 Allow the site address
1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** your app’s address, for example `https://chama-livid.vercel.app/`.
3. **Redirect URLs:** add `https://chama-livid.vercel.app/**`.
4. Check that **Authentication** → **Providers** → **Email** is on.

### 5.5 Deploy the length-sync function (recommended)
This keeps the boxes matched to Supabase automatically. Without it, the setting in 5.2 is the only source.

1. **Get a token:** Supabase → account icon → **Account** → **Access Tokens** → **Generate new token**. Give it full access (the preset **Full access**). Copy it at once; it is shown only once.
2. **Store it:** Supabase → **Edge Functions** → **Secrets** → add `SUPABASE_PAT` with the token. Optional: add `PROJECT_REF` if the project differs from the one in the function.
3. **Deploy:** Supabase → **Edge Functions** → **Deploy a new function**. Name it exactly `sync-config`, paste the whole of `supabase/functions/sync-config/index.ts`, leave **Verify JWT** **on**, and deploy. The app sends the project’s public key, which passes this check.
4. **Check:** open the app on a phone. Then run `select value from public.app_config where key = ‘otp_length’;` in the SQL Editor. It should match 5.2.

If the function is not deployed, nothing breaks; the app uses the value in `app_config`.

### 5.6 Register the chama
The app opens the chama in the link: `https://<site>/?c=<chama-id>`. Without `?c=` it uses `demo`. Only ids in `chama_slots` can be started, so a stranger cannot take over a chama. Run:

```sql
insert into public.chama_slots (id) values (‘mrlees’) on conflict do nothing;
```

Use the same id as `?c=` in the link.

—

## 6. Using the app: treasurer and members

### 6.1 Start the chama (first treasurer)
1. Open `https://<site>/?c=<chama-id>` on a phone.
2. Enter your email and tap **Send code**. Enter the code from the email.
3. You see **This chama is not set up yet**. Tap **Start this chama**. You become its treasurer.

### 6.2 Add members
1. **Menu** → **Settings** → **Account actions**.
2. Type the person’s email, choose their member record, choose a role (member or treasurer), and tap **Add person**. Enter also works.
3. They open the app, enter their email, tap **Send code**, and enter the code. They then appear as signed in under **People with access**.

To remove access, tap **Remove access** next to their name. Their records are kept.

### 6.3 Before real use
- Sign in with an email you have not added. You should see “Not on the member list”.
- Sign in as a member. You can see the records, but the change buttons are hidden.
- Make one change as treasurer on one phone and check it on a second phone.
- Keep a full backup (**Menu** → **Reports and backup**) before entering real money.

—

## 7. Releasing a new version

1. Edit `index.html`.
2. Update `APP.version` and add a new first entry to `APP.notes` (Notifications shows it).
3. Update `sw.js`: change `V` to the next name, for example `mca-app-v24` → `mca-app-v25`. Without this, phones may keep the old version.
4. Update this file’s version line and cache name.
5. If the database changes, add a re-runnable block to `chama_auth.sql` (or `chama_upgrade.sql`) and run it in Supabase.
6. Run the tests in section 8, then the checklist below on a phone.
7. Commit and push. GitHub Pages or Vercel updates in about a minute.

### Phone checklist
- The app name shows in full on the sign-in screen and on Home.
- **Send code** → sending screen → 8 boxes in two rows.
- A wrong code: the boxes shatter, clear, and the cursor returns to the first box.
- The right code: tick → “Welcome, <First name>” → home skeleton → the page.
- Long-press the first box and choose **Paste**.
- The bell shows on Home, Contribs, Loans, Members and Profile.
- The menu slides in, and Settings is last.
- Notifications lists each version.

—

## 8. Testing

Browser tests run with Playwright against a stub of Supabase. The harness (`harness.js`, `stub.js`, and the `t_*.js` scripts) is kept in the build workspace, not in this folder. Each run must finish with no page errors.

| Script | Checks |
|—|—|
| `t_mail` | Mail icon renders and folds at the right moment |
| `t_back` | Back navigation |
| `t_persist` | Typed digits survive a reload |
| `t_verify` | Full check, then welcome, then skeleton, then home |
| `t_wrong` | Wrong code shatters and clears; right code signs in |
| `t_welcome` | Treasurer welcome |
| `t_menu` | Drawer and marker |
| `t_enter` | Adding a member |

Before presenting work, also run:
- `node —check` on each `<script>` block of `index.html`.
- A scan for helpers used in a module without an import.

A pass means no page errors in the stub. It does not prove the live project or a phone.

—

## 9. Troubleshooting

| What you see | What to check |
|—|—|
| “Could not connect” or “Something went wrong” with a message | Read the message. It is the real cause. Check the internet and that section 5.1 has run. |
| “This chama is not registered” | Section 5.6: the id is in `chama_slots` and matches `?c=`. |
| Sign-in opens the wrong chama | Section 5.4: the Redirect URLs include `https://<site>/**`, and the link keeps `?c=<chama-id>`. |
| Added person sees “Not on the member list” | They must use the exact email you typed. The app lowercases it. |
| Code screen never submits, or every code is rejected | The number of boxes must match Supabase (section 5.2). Use the newest email; each new code cancels the old one. |
| Email has a link but no code | Section 5.3: add `{{ .Token }}` to the Magic Link template. |
| Boxes show 6, email has 8 | `app_config.otp_length` is wrong. Set it (5.2) and check the function logs. |
| Stuck on “Signing in” | Wait 12 seconds. The app offers Try again and Cancel. |
| The app shows an old version | Bump the cache name (section 7, step 3) and reload. |

—

## 10. Adding a backend feature later

The chama record is one JSON document, so most features need no database change. Add the fields in the app and they are saved with the record.

When a feature needs its own table or a server function:
1. Add the table to `chama_auth.sql` with `create table if not exists`.
2. Turn on RLS and add policies using the helpers already there: `is_active_member(chama_id)` for reading and `is_treasurer(chama_id)` for changing.
3. Put any treasurer-only write in an RPC that checks `is_treasurer` first, like `invite_member`, and grant it to `authenticated` only.
4. Call it from `index.html` with `Backend.sb.from(...)` or `Backend.sb.rpc(...)`.
5. Re-run the SQL file in the SQL Editor.

—

## 11. Features, known gaps and notes

### Features
- Contributions, loans, members, fines, expenses and history.
- Reports and backup, including the full-backup file.
- Notifications with a bell, unread counts, search and filters, and a detail page per item. An item is read only when opened.
- Automatic reminders for amounts due, and a late-payments summary for the treasurer.
- Help centre with searchable guides and troubleshoot checks.
- Settings for text size, colour, contrast and read-aloud.
- Sign-in by email code, with a treasurer who adds members and removes access.

### Known gaps (open)
- The length-sync function and the `otp_length` value are not confirmed on the live project.
- Long-press paste on the first box is untested on an iPhone.
- The welcome name comes from the email. Member names saved in the app are not used yet.
- The landing page and wider design polish are planned for later.

### Notes
- Money rules and the audit trail live in the core modules. Keep a backup before any change to the data format.
- Reports and backup files contain member details. Keep them private.
- Any signed-in member can read the whole chama record (by design). Only the treasurer can change it.
- The Supabase URL and anon key in the config are public by design. Never put the `service_role` key in this app.
