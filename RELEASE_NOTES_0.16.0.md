# My Chama 0.16.0 (19 November 2026)

## For everyone
- **Smart Guide** (the sparkle next to the bell, the search box in the menu, or `/`): ask questions in plain English or Kiswahili, find people, payments by M-Pesa code and pages, or tap **Show me** for a live, step-by-step tour that highlights each button and waits for your tap.
- **Home** puts this month's payout first. Your card changes colour with your state: red late, amber part paid, blue due, green paid, purple paid ahead, grey nothing due.
- **Know your Chama**: new members (and existing members, once) go through the Chama's money rules, payout turn, people, rules and privacy, and agree before entering.
- **Make it yours**: choose Light, Dark or Follow phone, an accent colour, text size, hidden amounts and sounds. New people see it before creating or joining a Chama; everyone sees it once after this update.
- **App lock**: no more flicker while typing the PIN; turning the lock off keeps your PIN; change PIN; lock after 1 to 30 minutes without use; fingerprint or face unlock where the phone supports it.
- **PDF**: My statement and the Chama report, in the app's colours, saved with "Save as PDF".
- Bottom sheets close when dragged down. Same-page updates no longer replay animations (the blinking).
- "I have paid" and recorded payments give clear confirmation, not a passing message.

## Sign-in
- Forgot password: the reset screen now appears even when the email's "Fill it in for me" link opens in a new tab or another browser. An email-code sign-in on an account with a password always offers a new password (or keep the current one).
- Sign in and Create account come first; Continue with Google is below.
- When the server ends a session, the sign-in screen says why.
- Invitation links go straight to sign-in (account exists) or create account with the code sent (no account). *Needs migration 025; without it, sign-in with a clear hint.*
- Usernames: live green tick, reasons when taken, suggestions from your name; a username is never reused. *Needs migration 025.*

## Treasurer and secretary
- **Roles are offered**: the person accepts or declines. One treasurer and one secretary at a time. Handing over the books needs your password and their name typed, and every member is told. Moving someone down needs a reason they see. *Needs migration 023; until then the older direct change is used.*
- **Stepping down and leaving** need a written reason. **Removing access** needs a category and reason; by default the person gets 3 days' notice and can reply; you can withdraw it. *Needs 023.*
- Join requests: a request the person cancels closes on your screen with a message; requests refresh every 20 seconds; a declined person sees a clear card, and is reminded if they try the same Chama again.
- **Payments**: record extra money that pays ahead; Add fine lists members who owe first; expenses, loans and payouts show the cash left as you type.
- **Loans**: the borrower reads the instalments and last date, ticks that they understand, and signs; it is kept with the loan.
- **M-Pesa import**: screenshots are read on the phone with a self-hosted reader (no third-party site), including dark-mode screenshots; masked numbers are matched by the visible digits and name, with a plain reason for each match.
- **Change payout turn**: choose the exact turn; each shows its month.
- Several savings goals at once; edit messages and pinned announcements (*needs migration 024*); member photos and phone numbers when adding by name; group rules in Chama settings.
- WhatsApp "Send" in Remind and the New message person picker now open (they were blocked).

## Security
- CSP no longer allows cdn.jsdelivr.net or tessdata hosts.
- Removal, role and leaving reasons are written to the audit log (023).
