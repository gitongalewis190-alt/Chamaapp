# MY CHAMA: compliance checklist (Kenya Data Protection Act, 2019), 4 Nov 2026

This is a technical and documentary checklist. It is not legal advice. A Kenyan lawyer must review the privacy policy and the points marked LAWYER before launch.

## Built and tested
| Item | Where | Status |
|—|—|—|
| Acceptance of the policy recorded on the server, with version and time | Migration 017, app 0.12.1-dev.2 | Built; DB tested on staging; app not yet browser-tested |
| Policy wording corrected: sign-in, service providers (Brevo added), retention, re-acceptance | index.html, policy version 2026-11-04-v2 | Built; needs lawyer review |
| Payments cannot be recorded twice (double tap, retry, repeated M-Pesa code) | Migration 016, app 0.12.1-dev.1 | Built; DB tested on staging |
| Only treasurers can change records (server-checked) | Migrations 002, 004, 005 | Built; live and staging match |
| Member sees only own payments, loans and fines, plus group totals | Migration 008 | Built |
| Download my data (export) | App, Settings > Privacy and data | Built |
| Account deletion with a 30-day hold, then removal of sign-in and profile | Migration 009, nightly job | Built; the job ran successfully on the last two recorded nights |
| No third-party data processing beyond the listed providers (M-Pesa import runs in the browser) | App code review | Confirmed by code search |

## Still open: the owner must supply these
1. Registered name of the data controller, and the ODPC registration number. The policy says “to be added before launch”.
2. Privacy contact (an email address). The app shows “Not set yet” until this is set (APP.privacyContact).
3. Hosting region for the database. It is eu-west-1 (Ireland). The policy must say this, and it must say that Vercel and Brevo may process data outside Kenya.
4. Retention periods for financial records (how many years). The policy currently says “as long as the law requires”.
5. Google Fonts: the app loads fonts from Google, which sends visitors’ IP addresses to Google. Either disclose this or host the fonts in the app. (Not yet done.)

## Needs a Kenyan lawyer (LAWYER)
- Whether a chama that lends to members through the app needs licensing (for example under the Sacco Societies Act, the Microfinance Act, or Central Bank rules). This is a real risk, and it is not something the app can decide.
- Whether a Data Protection Impact Assessment is required, and whether the processing needs to stay in Kenya under the regulations.
- Cross-border transfer safeguards for Supabase (Ireland), Vercel and Brevo.
- Review of the whole policy text before launch.

## Before public launch (not optional)
- ODPC registration completed.
- Items 1 to 4 above filled in, with no placeholder text left.
- A written breach response procedure: notify the ODPC within 72 hours where required, and the people affected.
- Leaked-password protection turned on in Supabase (manual).
- Staging test of the full flow with two real email addresses.
