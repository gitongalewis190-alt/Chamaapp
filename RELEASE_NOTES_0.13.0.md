# 0.13.0: full redesign and production hardening

Built and tested against a stub backend (83 of 83 browser checks pass under the production security headers). **Not yet verified on a phone against the live database.** Service worker cache: `mca-app-v70`. No database migration is required.

## Bugs fixed (these are live in 0.12.7)
| Bug | Effect in 0.12.7 | Cause |
|---|---|---|
| Recording a payment failed | Tapping a status or importing M-Pesa payments did nothing but show an error | `savePayments` and its helpers were used outside the module that defined them |
| Consent never reached the server | `consent_records` stayed empty although people accepted the policy | `APP.version` was read in a module that could not see `APP`; the error was swallowed |
| Language search crashed | Typing in “Choose another language” did nothing | `OB`, `LG_ALL`, `lgMatches` not in scope in `main` |
| Enter in the password field did nothing | People had to tap Sign in | `Gate` not in scope in `main` |
| Create-account screen threw on every paint | Resend countdown never ran | `armUpCool` defined in another module |
| A fully repaid loan stayed “Active, KES 0 left” | e.g. 3,000 at 5% for 2 months | floating point: 3000 × 1.1 = 3300.0000000000005. Money is now rounded to the cent |
| Avatar photo could inject HTML | A crafted profile photo shown to other members | only the `data:image/jpeg;base64,` prefix was checked |
| Notification link could run script | A `javascript:` link stored in Chama data | the link target was not checked; now only in-app `#/…` links |
| CSV export could carry spreadsheet formulas | A member name like `=HYPERLINK(…)` ran in Excel | cells starting with `= + - @` are now text |
| The app waited 1.85 seconds on a skeleton after every sign-in | Felt slow | removed; a skeleton shows only while data is really loading |
| supabase-js was loaded from a CDN at runtime | A CDN problem or compromise would break or expose sign-in | now served from `vendor/`, pinned to 2.45.4 |

ESLint `no-undef` now passes for every script; run it before each release.

## Design
- One design system (`assets/app.css`) replaces about twenty stacked style blocks. Evergreen and gold, system fonts, light and dark (follows the phone).
- New monoline mark and app icons; the old purple icons are kept in `icons/legacy/`.
- Monoline illustrations for onboarding, empty states, errors, invitations and the code screen.
- New opening mark (about 1.4 s, once per session, skipped for “less movement”). Replaces the MCA handwriting animation.
- Home: greeting, one hero number (cash on hand for the treasurer; “your month” for a member), quick actions for the treasurer, one stats row, “This month” (payout and who is behind, with WhatsApp reminders), recent payments. Replaces the many tiles and the long skeleton.
- Code screen: one row of cells in two groups, one hidden input (typing, paste and the phone’s code autofill), a wave while checking, a drawn tick on success, a clear message and empty cells on a wrong code.
- Onboarding: language, three slides (was eight), then a privacy summary with links to the full Terms and Policy.
- Every list row opens a sheet with details and actions, instead of several buttons per row.
- Menu regrouped: Money and records, Chama, App. Settings regrouped in inset lists, with a Display and accessibility page.

## Legal and privacy
- New public pages: `legal/privacy.html` and `legal/terms.html` (also shown in-app). Written for the Kenya Data Protection Act, 2019 and the Consumer Protection Act, 2012, with a clear statement that the app keeps records and is not a bank, SACCO, lender or payment service.
- Policy version `2026-11-18-v3`: everyone accepts once. Acceptance now actually reaches `record_consent`.
- Settings, Privacy and my data: plain summary, download my data (now also for officers who are not members), correct details, the policy version and date you accepted, delete account.
- **The owner must fill in before public launch** (shown highlighted on the pages): registered legal name, ODPC registration number, privacy and support contacts, retention years for consent and audit records, and the security contact in `.well-known/security.txt`. Values go in `legal/*.html` and in `APP` (`assets/app.js`, “EDIT HERE”).

## Security
- `vercel.json`: Content-Security-Policy, HSTS, `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy.
- `.vercelignore`: tests, migrations and internal docs are no longer published.
- `SECURITY.md` and `.well-known/security.txt`.

## Tests
- `tests/run.js`, `tests/mock-supabase.js`, `tests/fixtures.js`; CI in `.github/workflows/test.yml`.

## Not changed
- Database, RLS, edge functions, sign-in strategy, roles, financial rules. The Supabase project and keys are the same.
- Phone numbers are still shown in full to the treasurer (`CG_MASK_PHONES` stays false) and Move up still moves at once: both need owner decisions.

## Files
`index.html`, `assets/*`, `vendor/*`, `legal/*`, `icons/*`, `manifest.json`, `sw.js`, `vercel.json`, `.vercelignore`, `robots.txt`, `.well-known/security.txt`, `SECURITY.md`, `tests/*`, `.github/workflows/test.yml`, `README.md`, this file.
