# 0.14.0: chat, join approvals, consent by continuing, and a deeper redesign

Service worker cache: `mca-app-v71`. Policy version: `2026-11-19-v4` (existing users see one "We updated our terms" sheet; Continue records it).
Browser tests: 111 of 111 pass (stub backend, production security headers). Database functions verified live against the real project inside rolled-back transactions.

## Bugs fixed
| Bug | What people saw | Cause and fix |
|---|---|---|
| Email invitation said "Sign in first" while signed in | Invite by email never sent | The server had ended the session (the account had no session row) but the app kept using the old token, which the database still accepted. The email function checks sessions strictly. Now: the session is checked with the server at start; a dead one goes to sign-in with a reason; the invite retries once after a refresh. |
| Sessions ended by themselves | Random sign-outs and the bug above | The sign-in library's cross-tab lock had been switched off, so two tabs could spend the same refresh token and Supabase revoked the session. The lock is back (Web Locks), with a timeout fallback so it cannot hang on iPhone. |
| "The treasurer has not added you to the member list" | People who joined by code saw no money, and the treasurer had no clear way to fix it | Code joins created access but no member record. Joins now go through approval, where the treasurer puts the person on the list. The live account affected (Wangare) was repaired by migration 019. |
| Join-by-code overlay covered the Chama details | A modal sat on top of the screen after the code was checked | The code screen is replaced in place by a full Chama preview. |
| Deleting an account was impossible after leaving the last Chama | The welcome hub had no delete or restore option, but deletion requires leaving every Chama | Delete and Restore are on the hub and the Chama picker. |
| Account purge left data behind | Failed code attempts, code redemptions, throttle rows and the email in the audit log survived deletion; consent proof was deleted | See migration 020 (needs approval, below). |
| No way to change someone's role | `set_member_role` existed on the server but nothing called it | Tap a person in People and access. |
| Tap sound on every touch | Every button clicked | Sounds are off by default; even when on, only important outcomes chime. |

## New
- **Join approvals.** A code creates a request. The treasurer (or secretary, for non-treasurer roles) gets a sheet that cannot be dismissed until they approve or decline, choosing the role and the member-list entry. The person waits on a "Request sent" screen and is let in automatically when approved.
- **Chat.** One group conversation per Chama plus private conversations (members can write privately to the treasurer or secretary; officers to anyone). Live updates.
  - Treasurer: payment requests (members answer "I have paid", which alerts the treasurer) and personal statements.
  - Secretary: announcements (pinned), meetings with replies and an attendance register, minutes with resolutions, votes, pinning. A "Meetings, minutes and votes" record page.
- **Secretary role** now has real work: member register (contacts), meetings, minutes, votes, approvals, and secretary quick actions on Home.
- **Server notifications** (table `chama_notifications`): joins, requests, exits, removals, role changes, hand-overs, announcements, meetings, votes, payment requests. Live, merged into the Notifications screen, marked read on the server.
- **Consent by continuing.** The checkbox page is gone. "By continuing, you agree to our Terms and Privacy Policy" sits under the buttons. Continuing records the policy version, phone time, method, time zone, language and screen; the server adds its own time, IP and browser (`record_consent_v2`). Settings → Privacy shows the server's record.

## Redesign
- Fonts: Inter (text) and Plus Jakarta Sans (headings), served from `assets/fonts` (SIL OFL).
- Toasts are floating cards with a status icon, a draining progress line, pause on hover and a close button.
- Every list row, card and button responds: hover lift on computers, press feedback on phones.
- Invite sheet: Share a code or Send an email, role cards, uses and validity, a ticket with Copy, Share and WhatsApp.
- People and access, Profile (one field per sheet), Chama settings (one rule per sheet), Members, Home (next meeting, pinned announcement, requests).

## Database
- **Migration 019 is applied** (project `sgfvjsxmchohawhqraii`). It drops nothing: join requests have their own table, helpers live in schema `private`, consent uses `record_consent_v2`.
- **Migration 020 needs approval** (`supabase/migrations/020_manual_requires_approval.sql`): keeps consent records after account deletion, completes the purge, and removes anonymous access to the new functions (they already refuse anonymous callers). Run it with the Supabase connector in Claude chat; the file has the instruction at the top.

## Still for the owner
- Fill in the legal placeholders in `legal/*.html` and `APP` (operator name, ODPC number, contacts, retention years).
- Run migration 020.
- Test on a phone: invite by email, join by code with a second account, approve, chat as each role.
