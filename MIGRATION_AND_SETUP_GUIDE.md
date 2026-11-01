# My Chama App: step-by-step setup guide (0.12.0-dev.2)

You have one Supabase project and no live users. Because of that, the steps below run directly on that project, in order. Each step says what it does and what to check. Stop at any error, copy the exact message back to me, and do not skip ahead.

## 0. Back up first (5 minutes)
1. Supabase dashboard → your project → Table Editor → `chamas` → export as CSV. Keep the file.
2. Note the project reference from the dashboard URL (the part after `/project/`). It must read `sgfvjsxmchohawhqraii`, which is what the app's configuration points to. If it reads anything else, stop and tell me; the app would be talking to a different project.

## 1. Files and folders in your repository root
Replace these three files in the root (same names as the live ones):
- `index.html`
- `sw.js`
- `README.md`

Add these new folders and files at the root, next to `index.html`:
- `supabase/migrations/` (nine files, 001 to 009)
- `supabase/functions/send-invitation/` (`index.ts`, `core.ts`)
- `supabase/functions/auth-login/` (`index.ts`, `core.ts`)
- `supabase/verification/stage0_verify_readonly.sql`
- `tests/` (optional; not used by the website. Keep it for reference or leave it out.)

Do not add or change `manifest.json`, `icons/` or `tips/`. They are unchanged.

## 2. Supabase Auth settings (dashboard → Authentication)
1. **Providers → Email:** enabled. Keep **Confirm email** on.
2. **Sign-up:** "Allow new users to sign up" must be **on**. Account creation uses the email code.
3. **Password:** minimum length 6. The app enforces the rest (capital letter, symbol).
4. **OTP length:** 6 digits. The app reads the length from the database, so it must match.
5. **URL configuration:** Site URL = your real app address (no trailing slash). Add the same address to Redirect URLs.
6. **Email templates:** the Confirm sign-up, Magic link / OTP and Reset password templates must show the code, `{{ .Token }}`. The app uses codes, not links. A template with only a link will leave people unable to sign up or reset.
7. Save. Then send yourself a test code from the sign-up screen once the app is live.

## 3. Read-only check (safe to run anytime)
1. SQL Editor → open `supabase/verification/stage0_verify_readonly.sql`.
2. Run it in blocks, or all at once. It only reads. Paste the output back to me. The `PV-16a` block lists key names in the financial data; check it does not show any person's name before pasting.

## 4. Database migrations, in this exact order
For each file: SQL Editor → New query → paste the whole file → Run. Each file is wrapped in its own transaction, so a failure leaves nothing half-applied. Copy any error exactly.

1. `001_identity_and_profiles.sql`
2. `002_membership_and_roles.sql`
3. `003_invitations.sql`
4. `004_rls_and_security.sql`
5. `005_chama_rpcs.sql`
6. `006_global_auth.sql`
7. `007_retire_legacy.sql`  ← removes the old sign-in functions. Do this only when you are ready to deploy the new app (step 7), because the old app cannot sign in afterwards.
8. `008_member_privacy_and_versions.sql`
9. `009_ownership_leaving_deletion.sql`

Run 001 to 006 whenever you like. Run 007 only in the same session as the deployment in section 5 and 7, so there is no gap in which nobody can sign in.

After all nine: Table Editor should show `chama_invitations`, `chama_audit`, `auth_throttle` and `role_permissions`, and `chamas` should have a `version` column.

## 5. Edge functions and secrets
You need Node.js 18 or newer on your computer.

In a terminal, inside your repository root:
```
npx supabase@latest login
npx supabase@latest link --project-ref sgfvjsxmchohawhqraii
npx supabase@latest secrets set BREVO_API_KEY=... BREVO_SENDER_EMAIL=... BREVO_SENDER_NAME="My Chama App" APP_URL=https://YOUR-APP-ADDRESS ALLOWED_ORIGIN=https://YOUR-APP-ADDRESS INVITE_EXPIRY_HOURS=48
npx supabase@latest secrets set BREVO_TEMPLATE_ID=... (optional; only if you use your Brevo template)
npx supabase@latest functions deploy send-invitation
npx supabase@latest functions deploy auth-login --no-verify-jwt
```
Replace the placeholders with your real values. Never paste the API key into a file or a chat.

- `BREVO_SENDER_EMAIL` must be a sender verified in Brevo.
- `APP_URL` and `ALLOWED_ORIGIN` are the same address, with no trailing slash.
- If you use your customised Brevo template, its parameters are: `CHAMA`, `INVITER`, `ROLE`, `LINK`, `HOURS`. Put `{{ params.LINK }}` on the button.

## 6. Scheduled purge of deleted accounts (recommended)
1. Dashboard → Database → Extensions → enable `pg_cron`.
2. SQL Editor: `select cron.schedule('purge-deleted-accounts', '15 3 * * *', 'select public.purge_due_account_deletions()');`
Without this, deleted accounts are kept until someone runs that function by hand.

## 7. Deploy the website
Commit and push the repository to the same host you use now (Vercel). Wait for the deployment to finish, then open the site in a private window. The service worker is at version `mca-app-v32`, so old phones pick up the change on their next visit; a hard refresh helps during testing.

## 8. Test checklist (do in this order, with two email addresses you control)
1. Create account A with a new email: code → name, username, password. Sign out, sign in with the username and password.
2. Create a Chama as A. Confirm it opens and the menu shows the Chama.
3. As A, invite B's email as Member. Check the email arrives and the link shows the Chama name.
4. Open the link while signed out: it must only show details, not join. Create account B with that same email, sign in, press Accept.
5. As A, check the invitation list. Resend once; confirm the first link no longer works.
6. As B (member), open Contributions and Members: B must see only B's own payments and group totals.
7. Create a second Chama as B, then check the chooser appears and switching works.
8. As A, hand over the treasurer role to B and choose "step down". Try to leave the Chama as the only treasurer: it must be refused.
9. Sign out. Use Forgot password on B, enter the code, choose a new password, sign in again.
10. Delete a test account (after leaving every Chama): confirm the 30-day message and that restore works.

Report each step as passed or failed, with the message you saw if it failed.

## 9. Known gaps before real customers
- Duplicate payments from a double-tap are not yet blocked.
- Payments and loans are still saved as one document.
- The purge needs the schedule in step 6.
- Brevo delivery is not verified until step 8.3 passes.

## Rollback
- Migrations 001 to 006 and 008 to 009 each contain rollback notes at the bottom of the file.
- Migration 007 cannot restore the old password hashes. It is only reversible if you rebuild the old functions from your earlier SQL files, which I do not recommend.
- Before running 007, the CSV export from step 0 is your safety copy of the Chama records.
