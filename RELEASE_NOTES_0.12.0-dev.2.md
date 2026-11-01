# My Chama App 0.12.0-dev.2: release notes

**Status: development build. Not production. Not deployed.**
Service-worker cache: `mca-app-v32`.

## What changed and why
- **One account, one password.** Sign in with email or username. The password is held only by Supabase Auth. The username is resolved on the server, so the browser never learns the email behind it.
- **Account setup.** New accounts confirm an email code, then choose a full name, a username and a password. Forgot password uses an email code, then a new password (D7).
- **Several Chamas.** After sign-in: one Chama opens; several show a chooser; none shows "Create" or "Join". A `?c=` link opens a Chama only if the server confirms membership. The URL is a hint, not proof.
- **Switch Chama and leave.** Menu items for switching (when you belong to more than one) and leaving (members). Treasurers hand over the role in Settings, choosing to step down or stay as co-treasurer. The last treasurer cannot leave or be removed.
- **Roles.** Treasurer, Secretary and Member are fixed identifiers, stored per membership. The central permission map is mirrored in the database. Secretary currently has Member-level access; the owner configures more later.
- **Invitations.** Email invitations for Member, Secretary or Treasurer, valid 48 hours. Opening a link never joins anyone. The invitee signs in with the invited email and presses Accept. Only a SHA-256 hash of the token is stored. Resending issues a fresh token and kills the old one.
- **Financial privacy (D3).** Members see their own payments, loans, fines, payouts and notes, plus group totals. They never receive other members' money, phone numbers or emails. Treasurers keep the full record.
- **Safe saving.** Saves carry a version number. A stale save is refused, and the treasurer chooses between the latest version and their own changes. Nothing is overwritten silently.
- **Account deletion.** Needs no active Chama and a sign-in within 10 minutes. Kept for 30 days; restorable; purged by the server afterwards. Leaving a Chama is a separate action and never deletes records.
- **Shared phones.** When a different person signs in, the previous person's cached Chama data is moved aside on that phone (kept, not shown).
- **Retired.** The v0.11.0 password functions, the per-Chama password hashes, the auto-accept invitation flow and the per-Chama deletion functions. Migration 007 removes them.

## Database migrations in this release
| File | Purpose | Reversible |
|---|---|---|
| 001 | Global profile: username, full name, phone; closes self-role editing | Yes (notes) |
| 002 | Membership: roles, one active membership per person per Chama, last-treasurer guard, permission map, audit trail, role changes | Yes (notes) |
| 003 | Invitations: hashed tokens, 48-hour expiry, accept/decline/revoke/resend | Yes (notes) |
| 004 | Removes broad "signed-in" policies on Chamas; membership writes only through functions | Yes, restores risky state |
| 005 | Chama creation (server-made UUID ids, creator becomes treasurer); workspace list | Yes |
| 006 | Account status; username-to-email lookup (server only); sign-in throttle | Yes |
| 007 | **Destructive.** Drops legacy password, claim, invite and deletion functions and per-Chama password hashes | Not for hashes |
| 008 | Member privacy view; save versions; personal-detail visibility | Yes (notes) |
| 009 | Ownership transfer, leaving a Chama, account deletion with 30-day hold, server-only purge | Yes (notes) |

## Authentication transition
v0.11.0 clients cannot sign in after 007 runs. Because no live users exist (owner decision), no migration of accounts is needed. Test accounts must be recreated through the new setup flow.

## New configuration
- Edge functions: `send-invitation` (JWT on), `auth-login` (JWT off).
- Brevo secrets, sender, optional template, app URL, origin, invitation hours. Names in the README; values never in files.
- Supabase Auth dashboard settings: see the setup guide, section 3.

## Known limitations (not done in this release)
- Nothing has run against the live Supabase project yet.
- Duplicate payments from a double-tap are not prevented. This is an existing issue and remains open.
- Payments and loans are still saved as one document (the version check stops overwrites but does not split the data).
- Secretary has no extra powers yet.
- Members refresh about every 45 seconds rather than receiving live updates.
- Offline-first behaviour has been checked for the cases above only, not as a full audit.
- Audit entries cover roles, invitations, membership and ownership. Payment-level history stays in the Chama's own log.
- The purge of deleted accounts needs a schedule (pg_cron), or a manual run.
- The notification bell still shows app release notes; these are public by design.
- Version naming (0.12.0 versus 0.12.0-dev.2) is for the owner to decide at release.

## Testing performed (local only)
- Database, real Postgres 16, synthetic data: 39 of 39 pass across migrations 001–009. Includes a stand-in for the encryption extension and the auth schema.
- Browser, Chromium, stubbed backend: 23 of 23 regression and invitation checks; 16 of 16 new-screen and privacy checks.
- Email function: 13 of 13. Sign-in function: 10 of 10. Permission map: 10 of 10.
- Screenshots taken for sign-in, setup, welcome, chooser, invitations and member view.

## Not yet tested
Real email sending, real sign-in, real database policies on the live project, PWA update behaviour on phones, and all acceptance tests against staging or production.
