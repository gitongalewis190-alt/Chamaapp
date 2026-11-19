# 0.15.0: the app notices things, new emails, motion everywhere

Service worker cache `mca-app-v72`. Browser tests: 123 of 123. Migration 021 applied live (no drops).

## Emails
- `supabase/email-templates/`: sign-in code (Magic link), Confirm signup, Reset password, Change email, Reauthentication, Invite user. Built by `build.js` from one design; subjects in `SUBJECTS.md`.
  - The code is in the subject and preview text, so iPhone, Gmail and Outlook show "Copy code" on the notification.
  - In Apple Mail the code types itself in with a blinking caret; other clients show it whole.
  - "Fill it in for me" opens the app with the code; the app reads `#otp=…&e=…`, fills the boxes and signs in.
  - Light and dark, account, purpose and validity facts, a scam warning, and a "didn’t ask for this?" note.
  - **To apply:** Supabase → Authentication → Emails → Templates, paste each subject and file.
- Invitation email (`send-invitation`): Chama hero, who invited you, your role and what it means, expiry date, steps and fallback link. Needs the function redeployed (see below).

## Audit fixes
- Notification settings and read marks were shared by everyone who used the same phone: now per account.
- A savings-mode Chama showed members a payout "Turn" that does not exist: now "Member".

## 26 new things
Algorithms: 1 risk radar, 2 three-month cash forecast, 3 suggested loan limits, 4 unusual-payment check, 5 overdue and due-soon loans, 6 streaks, 7 savings projection to December, 8 payout countdown, 9 meeting attendance rate, 10 monthly recap.
Getting things done: 11 "Needs you today" for treasurer, secretary and member, 12 setup checklist, 13 remind everyone who is late (WhatsApp, group text, or post in chat), 14 one-tap late fines from the task list, 15 loan advisor inside the new-loan form, 16 search with `/` or Ctrl+K (people, M-Pesa codes, amounts, pages, actions), 17 keyboard shortcuts (`g` then h/p/c/m/s/n/l/i), 18 pull down to refresh.
Satisfaction and privacy: 19 savings goal with progress, 20 12-month payment heatmap per member, 21 hide amounts (privacy mode), 22 app lock with a 4-digit PIN, 23 share a payment receipt, 24 copy the pay-to number.
Data and records: 25 member register for officers with call, WhatsApp, email and CSV export, 26 calendar file for due dates and meetings with reminders, 27 in-app feedback with ratings (table `app_feedback`).

## Motion
Pages slide in from the right going deeper, from the left going back, and toward the tab you tap. Sheets slide up and back down, dialogs rise in, steps inside a sheet slide across. "Less movement" turns it all off.
