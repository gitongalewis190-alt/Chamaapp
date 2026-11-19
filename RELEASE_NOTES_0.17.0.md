# My Chama 0.17.0 (20 November 2026)

Fixes from the release check, plus About you, Simple view and Chama photos.

## Fixed (from your checks)
- **A2/A4 Forgot password.** Accounts that had ever used Google skipped the reset screen; an emailed code now always opens "Choose a new password".
  A "Fill it in for me" link only signs in on the phone that asked for that code (within 30 minutes). Anywhere else it is not used
  and says who it was for, so an email that reaches the wrong inbox can no longer sign someone in as another person.
  The email itself reaching many inboxes happens outside the app (see "Needs you" below).
- **R5 Removal.** When the server had not yet picked up the new removal function, the app fell back to removing at once.
  Removal, role offers, hand-over and leaving now never fall back to a harsher action: they say "nothing was changed, try again".
  The database update ends with a schema reload so this does not happen after an update.
- **M5 Loan terms.** Ticked boxes in forms sent nothing, so "I agree" could never be ticked. Fixed. Terms can now be sent to the
  borrower's own phone: they read, tick, sign, and the treasurer is told; the signature is kept with the loan.
- **P1 M-Pesa import.** A simple start (Screenshots or Paste), thumbnails of what you added with a result on each, a second reading
  pass when nothing is found, and each payment keeps the sender, masked number and the original message (shown when you open it).
  A member who pays from another phone is still suggested ("a different phone than the one saved") instead of dropped.
  Recent payments now means recently recorded.
- **Know your Chama** no longer flashes between steps or after opening the Chama.

## New
- **About you**: name, phone, date of birth (picked in big taps) and gender, one question at a time, each with "Why we ask".
  Everything except the name can be skipped, changed or removed (Privacy and my data).
- **Simple view**: bigger letters and buttons, fewer things on each screen. Turned on for people 60 and over (they are told and
  can turn it off), and available to anyone in Settings, Display.
- **Chama photo**: only the treasurer sets it (Chama settings, the camera on the Chama's tile). It shows in the Chama chooser
  (tap to see it large), on the Chama page, in the welcome walkthrough and on PDF statements and reports.
- **Group rules** are one tap away for the treasurer: Home setup list, the Guide, and Chama settings.
- **New Guide mark**: a speech bubble with a compass needle, drawn for this app. The four-point star is gone everywhere.
- Privacy and my data, removal and hand-over screens are shorter and easier to read.

## Needs you
- Run `supabase/RUN_026.sql` in the SQL Editor (one transaction). Without it: About you saves name and phone only, Chama photos
  do not show in the chooser, and loan terms cannot be sent to the borrower's phone (the app says so).
- The code email reaching other members: check Brevo → Transactional → Logs for one forgot-password email (the "To" column),
  Brevo → Settings for a BCC address, and Supabase → Authentication → Emails → SMTP and Auth Hooks. The app sends one email to one address.
- Backups are not included on the Supabase Free plan; consider Pro before real members rely on the app, or download the full backup regularly.
