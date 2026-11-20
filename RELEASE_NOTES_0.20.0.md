# 0.20.0 — 20 November 2026

<!-- FEATURES: planned list from the 0.20 work order. The lead reconciles this with what actually shipped. -->
## New and fixed
- **Sign-in:** changing your password signs you out on your other phones (within about 5 minutes, or when they reopen the app).
  You stay signed in for days without random sign-outs. A calm "Signing you in" screen with no flash. A "Fill it in for me" code
  link opened while someone else is signed in asks before switching. Eye button on every password box. The lock screen shows a
  fingerprint icon on Android and a face icon on iPhone. Messages never cover an open panel.
- **M-Pesa import:** paste the messages first; screenshots are the second choice, and an unreadable screenshot takes you to paste.
- **Treasurer's own payments need proof:** the M-Pesa SMS or a photo. They show "Awaiting check" until the secretary confirms.
  Very large and backdated payments are flagged. Fines have a clearer chooser. Loan signatures are easier to see.
- **Receipts and serial numbers:** every payment gets a serial number. Receipts as PDF and image, with a QR code and signatures
  at one standard size on screen and paper. Denser reports.
- **Verify:** anyone signed in, in any Chama or none, can type or scan a serial and see whether a document is genuine (date,
  amount, kind and short name only).
- **Chat:** PDFs and reports go into chat; the phone's real file picker opens. Chama rules are pinned at the top of the chat.
- **People:** About you is edited in My profile and is not asked again on a new phone. Scan your ID to fill your date of birth
  (on the phone only; the photo is not kept). Usernames are checked as you type. Chama rules page with a reminder to read them.
  Emergency removal for the treasurer, with a reason and your password; normal removal still gives notice.
- **Home:** the payout card is its own card, separate from the live card. One payout order used everywhere. A bigger "Need help?"
  card in the premium look. A new Chama starts a treasurer setup guide (can be turned off). Live member count.
- **Feel:** no blur on short pages that do not scroll; faster on low-end phones.
- **Guide:** answers about you (what you owe, your payout turn) in English and Kiswahili, remembers what you asked, a cleaner
  look, a "verify" answer that opens Verify, and tours that land on the right buttons.
<!-- /FEATURES -->

## Code email going to everyone (A1) — what we found and what you need to click
**What we found.** The Supabase auth logs for 19–20 November show exactly **one** `/otp` request per code, each for a single
address (thelees442, artislifefoundation2023, gitongalewis190, agnesgitosh2026, …). There is **no send-email hook**: no hook
functions in the database, and the only Edge Functions are `send-invitation`, `auth-login` and two `sync-config` copies, which only
read the code length. The email template sends to `{{ .Email }}` only. So Supabase hands each code email over for one person; the
copying happens **after** that, in the email provider (SMTP, likely Brevo) or in the mailboxes.

**What you need to click:**
1. **Supabase → Authentication → Emails → SMTP Settings:** note the sender address and the host (is it `smtp-relay.brevo.com`?).
   If the sender is one of your own Gmail accounts, the "copies" may just be that account's **Sent** folder.
2. **Brevo → Transactional → Logs** (or Statistics → Logs): open one code email and read **To / Cc / Bcc**. It must show one recipient.
3. **Brevo → Settings → SMTP & API / Senders**, and **Transactional → Settings**: remove any BCC, "copy to" or "send a copy to" address.
4. **Brevo → Automations:** turn off any workflow triggered by transactional emails, or that sends to a contact list.
5. **In each Gmail account:** Settings → *Forwarding and POP/IMAP* and *Filters*: remove forwarding or filters that copy "My Chama"
   mails. Note: all test accounts were used on one phone from the same network, so a Gmail app with several accounts shows each
   account's **own** code. Check the **To** line of each "copy" before deciding it is a leak.
6. Then re-test **F-A4** (and F-V2) on the release check.

## Supabase dashboard
- **Backups (S10):** the Free plan has **no** backups. Either move to Pro (7 days of daily backups), or download
  Reports → Full backup in the app every week.
- **Sessions:** set access tokens to 1 hour (Authentication → Sessions / JWT expiry `3600`). This is what lets a password change
  sign out other phones quickly.
- **Leaked-password protection:** turn it on (Authentication → Sign In / Providers → Email, or Attack Protection).

## ID verification — where we are
- **Stage (a), built:** scan your national ID on your own phone to fill your date of birth. It is still *self-declared* (it reads
  what is printed; it does not check it with the government), and the photo is never uploaded or kept.
- **Stage (b), needs you:** real verification needs a KYC provider that supports Kenyan IDs:
  **Smile ID** (checks the national ID register plus a live selfie), Veriff, Onfido or Sumsub. You would need an account with them,
  API keys and a fee per check. The keys go into a Supabase Edge Function secret and are only used from an Edge Function, never the
  app. We also need a consent screen and a privacy-policy update under Kenya's Data Protection Act (ODPC registration).
  **Which provider do you want?** Smile ID is the usual choice for Kenya.

## Server
`supabase/migrations/030_*.sql` (adds only): `record_payment_v2` with evidence for self-recorded payments, `confirm_payment`,
`payment_checks`, serial numbers (`issue_serial`, `verify_serial`), `emergency_remove_member`, About you timestamps and date-of-birth
source, and the private `payment-evidence` bucket. Apply it first (release check F-V1).

## Release check
`docs/release-check.html`: new group **F-V "New in 0.20"** (25 checks, only what a person must see on a real phone). Updated wording
for F-M3 (paste first), F-N12 (blur only on scrolling pages), F-R2 (biometric icon), F-U2 (About you in My profile) and F-P3
(emergency removal). 81 checks in all.
