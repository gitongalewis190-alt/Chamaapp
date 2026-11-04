# My Chama App (MCA)

A savings-group app for chamas (groups that save together and lend to each other). It runs as a phone-first web app (PWA), with a Supabase backend and email from Brevo.

**Current version:** 0.12.3-dev.1 (development build; one profile for every Chama, needs migration 019 on the database first). Migration 016 (payment guard) must also be applied. **Build in progress:** UI update (Choose a Chama, Create a Chama, Join a Chama, drawer, bottom-bar profile photo, toasts). Service worker cache `mca-app-v38`. The version string in `index.html` still reads 0.12.0-dev.4; bump it before release (section 15, rule 11).
**Last updated:** 2026-11-03
**Owner:** Lewis Gitonga
**Live site:** https://chama-livid.vercel.app (Vercel, deploys from branch `main`)
**Supabase project ref:** `sgfvjsxmchohawhqraii`

> Status rule: a feature is “working” only when the owner has tested it on a phone and reported PASS. Anything else is listed as unverified.

—

## Contents

0. Status at a glance
1. What the app is
2. Quick start for a builder
3. Repository layout
4. Architecture
5. Roles and permissions
6. Identity: account, access, and member record
7. Sign-in and sessions
8. Invitations: email and invite codes
9. Security model
10. Data integrity and sync
11. Database migrations ledger
12. Configuration and secrets (names only)
13. Deploy runbook (phone)
14. Testing
15. Rules for every builder
16. Troubleshooting
17. Roadmap and open decisions
18. Release history
19. Licence and contact

—

## 0. Status at a glance

| Feature | Built | Deployed | Verified on phone |
|—|—|—|—|
| Email code sign-in | Yes | Yes | Yes (owner) |
| Username and password sign-in | Yes | Yes | Owner reports it works. 0.12.0-dev.4 throttle messages: **pending** |
| Email invitations (Brevo) | Yes | Yes | Sent and resent: yes. Accept flow: **not yet tested** |
| Invitation expiry 7 days | Yes | Yes (secret set) | Owner confirmed the 168-hour setting. Email wording: **pending test** |
| Invite codes (create, join, cancel) | Yes | **Pending deploy** | **Pending** |
| Chama display tag | Yes | **Pending migration 012** | **Pending** |
| Listed as member, or officer only | Yes | **Pending deploy** | **Pending** |
| Rename, then invitation shows new name | Yes | **Pending migration 011** | **Pending** |
| Creator linked as member | Yes | **Pending migration 011** | **Pending** |
| Switch or add a Chama entry | Yes | **Pending deploy** | **Pending** |
| Choose a Chama screen (selected state, sign-out, switch toast) | Yes | **Pending deploy** | **Built, unverified** (stub tests only) |
| Create a Chama screen (inline validation, welcome toast) | Yes | **Pending deploy** | **Built, unverified** (stub tests only) |
| Join a Chama modal (key entry, friendly errors) | Yes | **Pending deploy and migration 012** | **Built, unverified** (stub tests only) |
| Choose a Chama: scanning step, plural copy, selected state applied on tap | Yes | **Pending deploy** | **Built, unverified** (stub tests only) |
| Centred pop-ups for every toast; new-Chama message as a dialog with Continue; deletion outcome as a dialog | Yes | **Pending deploy** | **Built, unverified** |
| Join by key confirmation (fixed “Modal is not defined”) | Yes | **Pending deploy** | **Built, unverified** (stub tests only) |
| Members: confirm code-joined people as members (Members page, treasurer button) | Yes | **Pending migration 013 run and deploy** | **Built, unverified** (stub tests only) |
| Navigation drawer redesign (groups, version footer, Escape and swipe to close) | Yes | **Pending deploy** | **Built, unverified** |
| Profile photo or initials in bottom bar | Yes | **Pending deploy** | **Built, unverified** |
| Chama name in header | Yes | **Pending deploy** | **Built, unverified** |
| Remove access rule (own and treasurer rows) | Yes | **Pending deploy** | **Pending** |
| Members list for non-treasurers | Messaging fixed | **Pending deploy** | **Pending** |
| Realtime sync (polling about 45 seconds) | Yes | Yes | Owner reports it works across browsers |
| Account deletion with 30-day restore | Yes (0.10.0), changed in 0.12.0-dev.4 | Pending deploy | **Pending** |

—

## 1. What the app is

- **Chama:** a savings group. Members pay monthly contributions, take loans, pay fines, and receive payouts in rotation.
- **One account per person:** one email and one password open every Chama that person belongs to.
- **Three roles:** Treasurer (full finance control), Secretary (manages members and records), Member (sees their own money plus group totals).
- **Access is not the same as membership.** A treasurer may be an officer who is not in the member list. This is a deliberate design choice, explained in section 6.

—

## 2. Quick start for a builder

You can work entirely from a phone:

1. **Code:** GitHub repo, edited with Working Copy (iPhone). Release branch `release/0.12.0-dev.2` (or the current release branch), merged to `main` when ready.
2. **Database and functions:** Supabase dashboard in Safari. SQL Editor, Edge Functions, Secrets.
3. **Hosting:** Vercel deploys `main` automatically.
4. **Email:** Brevo dashboard (API keys, senders, templates).

Read this file, then `MIGRATION_AND_SETUP_GUIDE.md`, then section 15 (rules) before changing anything.

—

## 3. Repository layout

```
index.html                       the whole frontend (single file, about 350 KB)
sw.js                            service worker. Cache name must change every release (now mca-app-v42)
manifest.json                    PWA manifest
icons/                           app icons (192 and 512 px)
tips/                            onboarding images
supabase/
  migrations/                    ordered SQL, 001 to 012 (see section 11)
  functions/
    auth-login/                  sign-in by email or username (core.ts + index.ts)
    send-invitation/             invitation email and link (core.ts + index.ts)
  verification/
    stage0_verify_readonly.sql   read-only checks, run before consequential changes
README.md                        this file
CHANGES.md                       change note for the current UI build (merge into the release notes when the build is released)
MIGRATION_AND_SETUP_GUIDE.md     first-time setup
RELEASE_NOTES_*.md               release notes per development build
```

**Single source of truth for functions:** the repo copy is the source. The Supabase dashboard holds a copy too. After any change, paste the same code into the dashboard and deploy, and record that you did so in the release notes. For dashboard deploys, use the single-file version (`core.ts` and `index.ts` joined into one file).

—

## 4. Architecture

### 4.1 Frontend

- One HTML file with inline CSS and JavaScript. No build step, no framework.
- Main objects inside the script: `Backend` (Supabase client), `Session` (sign-in, workspace, roles, invitations, codes, switching, creating), `Store` (the Chama document, local cache, sync), `Policy` (what this role may write), `Gate` (sign-in and Chama-hub screens: Welcome, Choose, Create, Join modal), `Invite` (invitation links), `Menu` and `Drawer` (navigation drawer), `Modal`, `toast`.
- Local cache: `localStorage` keys prefixed `chama:`. Keys containing `dirty` hold unsent changes and must not be deleted silently.
- Screen routing uses the URL hash (for example `#/settings/actions`). Opening a Chama uses `?c=<chama-id>`. Switching Chamas loads `?c=<chama-id>` as a full page load.
- One-time messages across a reload (for example “Switched to …” and the welcome message after creating a Chama) are stored in `sessionStorage` under `mca-flash`. The app reads and removes the key after sign-in and shows it as a toast.
- Bilingual copy (English and Kiswahili) for the Chama hub screens comes from `HUB_T`, read through `HL()`.

### 4.2 Backend

- **Supabase Postgres** holds all data. Row Level Security (RLS) is on for every table.
- **Business logic lives in database functions** (RPCs), most marked `SECURITY DEFINER` with `search_path = public, pg_temp`. The app never trusts its own role checks.
- **Edge Functions** (Deno) do three jobs only: sign-in throttling (`auth-login`), invitation emails (`send-invitation`), and nothing else.
- **Email:** Brevo REST API for invitations (`BREVO_API_KEY`). Brevo SMTP is used by Supabase Auth for login emails. These are separate keys.

### 4.3 The Chama document and the tables

| Storage | What it holds |
|—|—|
| `chamas.data` (JSON) | The whole Chama document: settings, members list, payments, loans, fines, payouts, expenses, notes |
| `chamas.name` | The Chama name, kept equal to `data.chama.name` by a trigger (migration 011) |
| `chamas.display_tag` | 4-character tag, unique, identifies the Chama to people only (migration 012) |
| `chamas.version` | Increases on every save. Used for optimistic concurrency |
| `chama_members` | Access: who may sign in to which Chama, with role and status. `member_id` links to an entry in `data.members`, or is null for officers |
| `chama_invitations` | Email invitations: token hash only, expiry, status |
| `chama_invite_codes` | Invite codes: hash only, role, expiry, uses, limit, revocation (migration 012) |
| `chama_invite_redemptions` | One row per person per code |
| `chama_invite_attempts` | Failed and successful code attempts, for rate limiting |
| `chama_audit` | Audit trail of sensitive actions (never contains codes or tokens) |
| `auth_throttle` | Sign-in attempt counters |

Whole-document saves go straight to `chamas` with a version check. Only treasurers may update it (policy `chamas_update_treasurer`, which uses `is_treasurer(id)`).

The Choose a Chama screen reads the signed-in person’s Chamas through `my_workspaces`. The UI reads `display_tag` and `member_count` from that result when present. Confirm the function returns them (section 9.3).

—

## 5. Roles and permissions

Enforced in the database. Hiding a button in the app is cosmetic only.

| Action | Treasurer | Secretary | Member |
|—|—|—|—|
| See the full finance record | Yes | Per `role_permissions` (confirm before relying on it) | No: own money plus group totals only |
| Change finance records | Yes | Per policy (treasurer-only writes today) | No |
| Create an email invitation | Yes, any role | Members and secretaries only (proposed) | No |
| Create an invite code | Yes, any role | Member and secretary codes only | No |
| Cancel an invite code | Yes | Yes, codes they created | No |
| Change the Chama tag | Yes | No | No |
| Remove access (another person) | Yes, never own row or treasurer rows | No | No |
| Hand over the treasurer role | Yes | No | No |
| Leave a Chama | No, hand over first | Yes | Yes |
| Delete own account | Only after leaving all Chamas | Same | Same |

**Last-treasurer rule:** a Chama must always have one active treasurer. Enforced by the trigger `guard_last_treasurer` (migration 002). The button is hidden as well, but the trigger is the protection.

**Nobody can grant a role higher than their own.** Enforced in the invitation and code functions.

—

## 6. Identity: account, access, and member record

Three separate things. Keep them separate in code and in your head.

1. **Account:** a sign-in identity (email, username, password) in Supabase Auth. Created once, reused for every Chama.
2. **Access:** a row in `chama_members` saying this account may open this Chama, with a role. This is what the database checks for every read and write.
3. **Member record:** an entry in the Chama’s member list (`data.members`), with its own id, name, shares, and payment history. Money belongs to member records.

A person can be:

- **Listed:** access row with `member_id` set. Their payments and loans are linked to a member record.
- **Officer only:** access row with `member_id` null. They manage the group but have no member record and no money of their own in the Chama. The access list says “officer only, not listed as a member”.

When creating a Chama, the creator is listed by default and can untick the box. Invitations choose the same way (“Listed as a member” or “Officer only”).

**Empty member list:** a Chama can have access accounts and still have no member records. The Members page then shows an empty list, which is correct. Add member records in the Members tab, then link accounts when inviting.

—

## 7. Sign-in and sessions

- **Email code (passwordless):** enter email, receive a code by email (length set in Supabase, currently 8 digits), type it. Used for first sign-in and sign-up confirmation.
- **Email or username, plus password:** handled by the `auth-login` function. It throttles by IP (40 tries per 10 minutes) and by identifier (8 tries per 10 minutes), then returns HTTP 429 “Too many tries”. Unknown usernames get the same generic error as wrong passwords.
- **No password fallback.** The app must never call Supabase’s password sign-in directly. That would skip the throttle.
- **Passwords:** minimum 6 characters with letters, digits and a symbol (set in Supabase Auth).
- **Create account:** if a session for a different email is open, it is signed out first.
- **Sign-out:** available from the drawer and from the Choose a Chama screen (bottom of the screen). Signing out clears this phone’s Chama cache except unsent changes (section 9.3).
- **Account deletion:** requests a 30-day hold. The person is signed out on every device, and this phone’s Chama cache is cleared except unsent changes. Blocked while the person still belongs to any Chama. Restore is possible during the 30 days.

—

## 8. Invitations

### 8.1 Email invitation (live)

1. Treasurer enters an email, a role, and optionally a member record (or leaves it as officer only).
2. App calls `send-invitation` (action `create`). The function calls `create_invitation_internal`, which stores a hash of the token and returns the raw token once.
3. Brevo emails the link: `APP_URL/?c=<chama-id>#invite=<token>`. The raw token is never returned to the browser.
4. The person opens the link, sees who invited them, signs in with the invited email, and presses **Accept**. Nobody joins until they accept.
5. Expiry: **7 days** (secret `INVITE_EXPIRY_HOURS` = 168; code default is also 168).
6. Resend creates a new token and invalidates the old link.

### 8.2 Invite code (in 0.12.0-dev.4)

1. Treasurer (or secretary, for member and secretary codes) opens Settings, Access. The Chama tag shows at the top.
2. Chooses role, validity (1, 7 or 30 days), number of uses (1 to 100), and optionally a listed member record.
3. The database generates a 10-character code from a set with no look-alikes (no 0, O, 1, I, L), shown as `XXXX-XXXX-XX`. Only its SHA-256 hash is stored. The code is shown once.
4. The person opens **Join a Chama** (Choose a Chama screen), types the code (case, hyphens and spaces are ignored), sees a confirmation with the Chama name, tag and role, and confirms.
5. The redemption locks the code row, so two people can never use the last use at the same moment.
6. Already a member: the existing membership is returned, nothing changes, and no use is counted.
7. Five failed attempts in 10 minutes block further attempts for that person.
8. Codes can be cancelled. Expired and cancelled codes stay in the list for audit.

Codes are never written to logs, the audit trail, or the email.

### 8.3 Chama hub screens (this UI build)

- **Choose a Chama:** lists the person’s Chamas under “Your Chamas”. The Chama currently open is pale green with a green border, a “Selected” label and a tick. “Manage your Chamas” holds Create a Chama and Join a Chama. Sign-out is at the bottom. Choosing a Chama opens it and shows “Switched to <name>”.
- **Create a Chama:** “Let’s create your Chama.” Group details (name: trimmed, inner spaces collapsed, at least 2 characters, inline error) and Membership status (“Existing member” checkbox). On success the person is taken to the new Chama with: “Welcome to your new Chama <name>. You are the treasurer by default. Add members via the invitations.” The draft stays if creation fails.
- **Join a Chama:** a centred modal with “Have an invitation link?”, Chama key entry, Join Chama, Sign out and Cancel. It closes on Cancel, Escape and a tap on the backdrop. Known database errors show a sentence the person can act on. A missing function reads as “keys not ready”.

—

## 9. Security model

### 9.1 Rules enforced in the database

- RLS on every table. Tables with no client policy are closed to clients (`revoke all ... from anon, authenticated`).
- Every RPC checks `auth.uid()` and the caller’s active membership and role before doing anything.
- `SECURITY DEFINER` functions set `search_path` explicitly, so nothing can be hijacked by a same-named object in another schema.
- Hashes, not secrets, are stored: invitation tokens and invite codes.
- Membership is explicit. Removing access sets status to `removed`. Removed people cannot regain access silently.
- Sensitive actions write to `chama_audit`. The audit record holds ids and actions, never codes, tokens or passwords.
- Email is confirmed before creating a Chama or redeeming a code.

### 9.2 Rules for the app

- Hiding a control is not authorization. Every write is checked again in the database.
- Local data is shown with its state: local only, pending sync, synced, failed, conflict, or stale. Never say a transaction is recorded remotely when it is only on the device.
- The app does not show raw database error text to members where it would reveal internal detail.

### 9.3 Known risks (open)

| Risk | Impact | Status |
|—|—|—|
| Treasurer can set `display_tag` directly through the table, skipping the format check | Uniqueness holds; format may be wrong | Open. Fix with a column guard in a later migration |
| Sign-out on a phone clears local Chama cache, including unsent changes | Possible loss of unsent entries | Open. Owner decision: warn before sign-out, or keep a recovery copy |
| Choose a Chama reads `display_tag` and `member_count` from `my_workspaces`, which may not return them | Tags and member counts missing on the chooser; the screen still works | Open. Confirm the function output |
| “Existing member” checkbox on Create a Chama is misleading: checking it creates member 1 | Owner may expect a different result | Open. Owner to confirm wording or behaviour |
| Realtime is polling (about 45 seconds), not push | Changes appear with a delay | Accepted for now |
| Whole-document writes can overwrite concurrent edits | Protected by version check; conflicts shown to treasurer | Working design. Test with two devices |
| Email sign-in depends on `auth-login` | If the function is down, password sign-in fails | Accepted. No fallback by design |
| Brevo sends from a Gmail address; no DNS authentication | Lower deliverability, possible spam filtering | Open. Set SPF, DKIM and DMARC on a domain you control |
| `get_app_config` is called by the app but not defined in the repo migrations | Unknown until checked in the database | Open. Confirm it exists |
| Migration 010 is referenced by older notes but is not in the repo | Unknown content | Open. Find it in Git history, or confirm it is not needed |

—

## 10. Data integrity and sync

- **Versioned saves:** each save sends the version it started from. If someone else saved first, the save is refused and the treasurer sees a conflict prompt. Nothing is overwritten without a choice.
- **Derived balances:** cash on hand, loan balances and fines due are calculated from records, never edited directly.
- **Never silently discard financial history.** Deletions of records are recorded in the Chama log.
- **Offline:** edits are kept on the phone, marked as unsent, and sent when the connection returns. The app must not say they are recorded remotely until the server confirms.
- **Timing:** members refresh about every 45 seconds. Treasurers save as they go.

—

## 11. Database migrations ledger

Each migration must have: an ordered id, purpose, affected objects, prerequisites, validation queries, rollback notes, and execution status. Migrations are run by the owner in the Supabase SQL Editor, after approval.

| File | Purpose | Status |
|—|—|—|
| 001_identity_and_profiles | Profiles and identity | Applied (per handover) |
| 002_membership_and_roles | Membership, roles, last-treasurer trigger, audit | Applied (per handover) |
| 003_invitations | Email invitation tables and functions | Applied |
| 004_rls_and_security | Row Level Security hardening | Applied (see the note about `chamas_update_treasurer`) |
| 005_chama_rpcs | Create Chama, workspace list | Applied |
| 006_global_auth | Sign-in throttle, login email resolution | Applied (per handover) |
| 007_retire_legacy | Removes old code paths | Applied |
| 008_member_privacy_and_versions | Limited member view, version column | Applied |
| 009_ownership_leaving_deletion | Hand-over, leaving, 30-day deletion | Applied |
| 019_global_profile | One profile for every Chama: photo, name, username, phone, contact email on the account; member photos for members of the same Chama | **Draft, not applied.** Test on staging first (tested on local PostgreSQL 16 with stubs) |
| 010 | Username rule and sample-data cleanup (per older notes) | **Unknown. Not in repo** |
| 011_chama_name_and_creator_link | Name sync trigger; creator member link | **Ready. Run after approval** |
| 012_invite_codes_and_display_tag | Display tags; invite codes; redemption; rate limit | **Ready. Run after approval** |
| 013_confirm_joined_members | Treasurer confirms a code-joined person as a member (creates the member record, links the access row) | **Approved by owner. Not yet run in the database** |
| 014_chama_members_joined_at | Adds `chama_members.joined_at`, which the invite-code join wrote to. Its absence caused every join by key or link to fail | **Applied by owner (column confirmed 2026-11-03). Join test pending** |

The UI build in section 8.3 does not add a migration. Its chooser and Join a Chama screens depend on 012 for display tags and key-based joining.

**Note on 004:** the live policy `chamas_update_treasurer` was verified by the owner (UPDATE, `is_treasurer(id)` in both clauses). Repo copies of some policies are commented out. Keep the live policy as the reference.

—

## 12. Configuration and secrets

Names only. Never write values in files, chats or commits.

**Supabase Edge Function secrets**
- `BREVO_API_KEY`: Brevo REST key (starts `xkeysib-`). Not the SMTP key.
- `BREVO_SENDER_EMAIL`: verified sender address.
- `BREVO_TEMPLATE_ID`: template number (0 means use the built-in HTML).
- `ALLOWED_ORIGIN`: exactly `https://chama-livid.vercel.app`, no trailing slash.
- `APP_URL`: app address used in invitation links.
- `INVITE_EXPIRY_HOURS`: `168` (7 days).

**Supabase Auth settings**
- Email code length: 8.
- Password: minimum 6, letters, digits and symbols.
- Sign-up email template shows `{{ .Token }}` as a code only. Check this is still set.

**Brevo**
- Verified sender. Do not use the `brevosend.com` address suggested by the error message.
- Unused SMTP key `chama-invites` can be deleted.

—

## 13. Deploy runbook (phone)

Do these in order. Stop at any unexpected result and report it.

1. **Read-only checks first.** Run `supabase/verification/stage0_verify_readonly.sql` in SQL Editor and paste the result.
2. **Migrations, after approval:** 011, then 012. Copy each file’s full text into a new query, Run. Expected: “Success. No rows returned.” A message beginning “STOP:” means nothing changed.
3. **Check:** `select name, display_tag from chamas order by name;` Every Chama has a 4-character tag.
4. **Edge function:** Supabase, Edge Functions, `send-invitation`. Paste the single-file version, Deploy. Check secret `INVITE_EXPIRY_HOURS` = 168.
5. **App:** Working Copy. Replace `index.html`, `sw.js`, `README.md`, and add `CHANGES.md`. Commit with a message such as `UI: chooser, create, join, drawer; sw mca-app-v35`. Merge to `main`. Vercel deploys.
6. **Confirm:** reload the app. Settings, About shows the version. If an old version still appears, clear the site data in Safari and reload once. Open Choose a Chama and confirm the screen is the new one.
7. **Record:** update the status table in section 0, the ledger in section 11, and the release history in section 18.

—

## 14. Testing

There is no automated test suite in the repo. Testing is manual, on a phone, with at least two accounts and one Chama.

For the UI build in section 14.2, a browser test harness was run outside the repo (Python Playwright, Chromium, 390 × 844 viewport, Supabase library stubbed). It is evidence for layout and flow only. It is not a substitute for the phone checks.

### 14.1 Test plan for 0.12.0-dev.4

Record PASS or FAIL with a short note.

1. **Version:** Settings, About shows 0.12.0-dev.4.
2. **Existing data intact:** open an existing Chama. Totals and past payments are unchanged.
3. **Sign-in throttle:** eight wrong passwords. The last attempt shows “Too many tries”.
4. **Switch entry:** menu shows “Switch or add a Chama”. The chooser lists each Chama with its tag.
5. **Create, listed:** the creator appears as member 1 in Members.
6. **Create, officer only:** the access list shows “officer only, not listed as a member”.
7. **Rename, then invite:** the invitation email and link show the new name. The email says 7 days.
8. **Invite code, happy path:** create a Member code (7 days, 1 use). A second account types it, sees the confirmation, joins. A second use says “used up”.
9. **Invite code, failures:** six wrong codes. The sixth says “Too many tries”.
10. **Invite code, cancel:** a cancelled code says “cancelled”.
11. **Remove access rule:** own row and treasurer rows have no Remove button. Member rows do.
12. **Create account:** signed in as one account, start Create account with another email. The first account is signed out.
13. **Toasts:** errors stay about 6 seconds, text is larger.
14. **Payments still work:** record a payment, reload on a second device, it appears.
15. **Invitation accept flow:** open an invitation link on a second device, sign in with the invited email, press Accept. The person appears in the access list.
16. **Wrong email on accept:** signed in as another email, the invitation is refused.
17. **Revoke invitation:** a revoked link no longer works.
18. **Deletion:** request deletion, the account is signed out everywhere, sign-in shows the days left, restore works.
19. **Two-device conflict:** two devices edit the same Chama. The second save shows a conflict prompt and does not overwrite.

### 14.2 Test plan for the UI build (chooser, create, join, drawer)

Record PASS or FAIL on a phone, with a short note.

1. **Choose a Chama, layout:** no header. Back arrow top-left. “Your Chamas” and “Manage your Chamas” sections. Sign-out at the bottom.
2. **Selected state:** the open Chama is pale green with a green border, “Selected” and a tick. Only one is selected.
3. **Switch toast:** choosing another Chama reloads and shows “Switched to <name>”. Test a long name; it wraps cleanly.
4. **Create, validation:** blank name, or one character, shows an inline error. Spaces are collapsed. The draft survives an error.
5. **Create, welcome:** creating shows “Welcome to your new Chama <name>. You are the treasurer by default. Add members via the invitations.” The Chama opens with the name in the header.
6. **Join, key:** a short key shows a validation error. A well-formed key that does not exist shows a clear message that the key was not recognised (check the exact wording on the phone and record it). A valid key joins.
7. **Join, missing database function:** before migration 012 is run, the message reads “keys not ready”, not a raw error.
8. **Join, closing:** Cancel, Escape and a tap on the backdrop each close the modal.
9. **Drawer, groups:** Chama, Money, Records and Account groups show. Menu wording is unchanged from before. Empty groups are hidden.
10. **Drawer, closing:** the close button, Escape and swipe left each close it.
11. **Drawer, version footer:** shows the same version as Settings, About.
12. **Bottom bar:** the profile tab shows the user’s photo, or initials when there is no photo.
13. **Mobile layout:** no horizontal scroll at 390 px width on the chooser, create and join screens.
14. **Sign-out:** from the chooser and from the drawer, the account is signed out and the local cache is cleared except unsent changes.

### 14.3 Database checks (read only)

- Every Chama has a `display_tag` (migration 012).
- Every Chama’s `name` equals `data.chama.name` (migration 011).
- No Chama has more than one active row per person.
- No invite code has `uses` above `max_uses`.
- `my_workspaces` returns `display_tag` and `member_count` for a signed-in person (needed for section 9.3).

—

## 15. Rules for every builder

These apply to people and to AI assistants. They are not optional.

1. **Security is enforced in the database.** Every sensitive action needs a server-side check: RLS, or a function that checks `auth.uid()` and the caller’s role.
2. **Never store or log secrets.** No invitation tokens, invite codes, passwords, API keys, or service keys in code, in logs, in the audit trail, or in chat. Store hashes.
3. **Authentication and authorization are separate.** Being signed in does not grant access to a Chama.
4. **Removed access stays removed.** Status changes are explicit and enforced by the database.
5. **Migrations:** numbered, one purpose per file, with the header block from section 11. Guarded with prerequisite checks that stop before changing anything. Never edit a migration that has been applied. Write a new one.
6. **No destructive SQL** (drop, truncate, delete from financial tables, or updates to balances) without explicit owner approval, a rollback note, and a read-only check first.
7. **SECURITY DEFINER functions** always set `search_path`, check `auth.uid()`, check membership and role, and never return hashes.
8. **Financial integrity:** never silently discard history. Derived balances come from records. Consider duplicates, retries, network drops, and concurrency.
9. **Offline honesty:** label local, pending, synced, failed and conflict states. Never imply remote success.
10. **Account deletion is not leaving a Chama.** Do not combine them.
11. **Every release:** bump the version in `index.html`, bump the service worker cache name in `sw.js`, add a release note, update this README’s status table. The UI build is not yet version-bumped; this is an open action (section 18).
12. **Done means verified.** Report a feature as complete only after the owner reports PASS. Until then, say “built, unverified”.
13. **Report format:** Completed / Changed / Verified / Outstanding / Risks / Approval required.
14. **Keep the repo and the dashboard in sync** for Edge Functions. Note in the release notes which copy was deployed.
15. **Approval is required for:** product requirement changes, sign-in strategy changes, role authority changes, financial rule changes, destructive migrations, production data changes, production RLS changes, recurring costs, and deployment environment changes.
16. **Dependencies:** justify each new one. Avoid services that are not needed.
17. **Privacy:** personal data is kept to what the chama needs. The in-app privacy policy must match what the app does. Changes to data use need owner approval.
18. **This README travels with every delivery.** Any agent that changes behaviour, schema, copy, a migration or the service worker updates this file in the same delivery, and sends it with the other files. A delivery without the current README is incomplete. The owner’s copy is also stored in the project (“My Chama App”) so future sessions read the latest version.

—

## 16. Troubleshooting

| Symptom | Likely cause | What to do |
|—|—|—|
| “Could not reach sign-in” | Edge function down, or no connection | Check internet, then check `auth-login` in Supabase |
| “Too many tries” | Throttle reached | Wait 10 minutes |
| Invitation email not received | Brevo sender or key, or spam | Check Brevo logs; use Resend; check spam |
| “email service rejected our key or sender” | Wrong Brevo key type, or sender not verified | Use the REST API key, and the verified sender |
| Invitation link shows the old Chama name | Migration 011 not run | Run 011 |
| Members page is empty but access rows exist | Chama has no member records | Add members in Members, then link accounts when inviting |
| Invite code says “not found” | Mistyped, or it is a link | Check the characters; a link must be pasted whole |
| Join a Chama says “keys not ready” | Migration 012 not run, or functions not deployed | Run 012 and deploy the functions |
| Chooser shows no tags or member counts | `my_workspaces` does not return them | Confirm the function output (section 9.3) |
| Switch Chama missing | Old build cached | Clear site data in Safari, reload |
| Conflict prompt on save | Two devices saved | Choose which version to keep. Do not force |
| App shows an old version | Service worker cache | Bump cache name, redeploy, reload once |

—

## 17. Roadmap and open decisions

**Next, once the current build is verified**
- Invite method setting (email or code as the default), when the owner decides.
- Secretary’s panel for invite codes.
- In-app notice to the treasurer when a code is used (proposed: yes).
- Automatic cancellation of an inviter’s codes when they lose their role (open).
- Display tag column guard (section 9.3).
- Sign-out warning for unsent changes (section 9.3).
- Confirm `my_workspaces` returns `display_tag` and `member_count`, or add them (section 9.3).
- Decide the wording and behaviour of the “Existing member” checkbox (section 9.3).
- DNS authentication for the Brevo sender domain.
- Automated tests for the database functions.

**Later**
- QR codes for invite codes (same backend).
- Push notifications instead of polling.
- Removing and changing member records (out of scope for now).

**Owner decisions still open**
- Should secretaries create treasurer codes? (Proposed: no.)
- Should financial Chamas get a shorter default code expiry? (Open.)
- Link or raw code as the main share method? (Open.)
- Will email invitations ever be retired? (Open.)

—

## 18. Release history

Short list. Full notes are in the app (Settings, About) and in the release notes files.

- **0.12.3-dev.1 (service worker `mca-app-v42`):** design tokens and named card and button variants (first pass). Drawer header solid; Chama rows use the selection card. Other screens unchanged so far.
- **0.12.2-dev.1 (service worker `mca-app-v41`):** one profile for every Chama. Photo, name, username, phone and contact email are saved once on the account (migration 019) and used in every Chama. My profile has a Password card: one global password, checked before it changes. Members see each other’s photos through `get_chama_member_profiles`. The treasurer’s member list shows each person’s account name when the treasurer opens the Chama. Photos added on another phone before this build must be added again.
- **0.12.1-dev.2 (service worker `mca-app-v40`):** consent recorded on the server (migration 017), corrected privacy policy (version 2026-11-04-v2).
- **0.12.1-dev.1 (service worker `mca-app-v39`):** payments recorded on the server with a request key (migration 016). Needs 016 applied to the database before this build goes live.
- **0.12.0-dev.5 (service worker `mca-app-v38`):** scan fix round. Forces browsers to load the new build (v36 may have been served from cache, which explains the missing iOS-style pop-up). Adds centred pop-ups for all toasts, a new-Chama dialog with Continue, a scanning step on the chooser, and the join-by-key crash fix. Join errors now show the real server message unless the functions are missing. Known open items: the join-by-key message “Chama keys are not available on this server yet” means the live join-error text was previously mapped too broadly (checked: preview_invite_code and redeem_invite_code exist), so the real server message is now shown; member photos for people who joined by code are not visible to other members; migration 013 (approved by the owner) is not yet run in the database.
- **UI build, earlier (`mca-app-v35`):** Choose a Chama screen, Create a Chama screen, Join a Chama modal, redesigned navigation drawer with grouped menu and version footer, bottom-bar profile photo or initials, Chama name in the header, welcome and switched toasts. Built, unverified on phone. Open action: choose the version number (for example 0.12.0-dev.5), bump `index.html`, and write the release note.
- **0.12.0-dev.4:** sign-in messages and no password fallback; Remove access rule; switch entry; creator listed or officer only; invite codes; Chama tags; 7-day invitations; account sign-out fixes; larger toasts. Pending deploy.
- **0.12.0-dev.3:** receipts and fixes from live testing; requires migration 010 (not in repo).
- **0.12.0-dev.2:** one account for every Chama; username or email sign-in; 30-day account deletion.
- **0.12.0-dev.1:** email invitations with accept step.
- **0.11.0 and earlier:** see the in-app version history.

—

## 19. Licence and contact

- **Owner:** Lewis Gitonga.
- **Licence:** not yet decided. Until the owner chooses one, all rights are reserved.
- **Data protection:** the in-app privacy policy refers to the Kenyan Data Protection Act, 2019. The owner should confirm it with a qualified adviser before public use. This README is not legal advice.
