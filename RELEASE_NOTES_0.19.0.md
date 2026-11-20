# 0.19.0 — 20 November 2026

## Fixes reported by the owner
- **Home:** nothing sits above the card any more. Loan terms to sign, a removal notice, or a scheduled account deletion open as a
  **full-screen prompt** once the app has loaded ("Read and sign" / "Remind me later", back after 2 hours or next open).
- **Payout card:** clean header (photo ring, name, amount, status), the next turns as a dotted rail (current month in brand colour,
  your turn in gold), one quiet meta line.
- **Guide:** typo-tolerant search (Damerau distance, stemming, English and Kiswahili words), a calculator that reads sums written any
  way (`2,000 x 12`, `5% of 20k`, `monthly * 12 + fines`, `(cash - loans) / members`) with record values as variables, loan maths
  (`10000 at 10% for 3 months`). No generic article answers: every result is a **live tour**; no match shows the closest tours.
  The keyboard opens with the Guide. Sheet restyled for light and dark.
- **Live tour:** the coach card is the inverse of the app theme (dark on light, light on dark) with a gold ring and pulse on the real
  button; it is measured and placed above or below the button, never over it or the tab bar, with an arrow and step dots.
- **Contributions:** live group card with its own colour scale by progress to target (aurora beaten, jade met, ocean almost, copper
  on the way, plum just started, slate future), gauge, count-up and rotating facts. Simpler member rows (progress ring) and payments.

## New
- **Chat rebuilt** (logic from The Lees, minus home, settings, draw, shield, ghost mode, previews, sounds and games): bubbles, live
  typing and recording indicators in the conversation, on the chooser and as a banner anywhere in the app; voice notes with level
  meter, review, trim and send; photos (compressed) and files to a private bucket; **view once** photos and voice notes served once per
  person by the server and deleted when all have opened; reply by swipe or menu; reactions; "seen by"; online count; a **group chat
  theme** anyone can change (8 themes, light and dark). New chooser: the group as a live card, private chats, people to write to.
- **Phone numbers in the group:** About you (v3) adds a required consent to share your number with your Chama. Members gets
  call / WhatsApp / SMS for people who share. Stop or start sharing in Privacy and my data.
- Parallel work this release: Settings personalisation matches the first-run screen, many more accents including gradients, a
  scroll reveal on long lists, the "Need help?" card always on Home, and coloured profile tiles.

## Server
`supabase/migrations/029_chat_media_typing_phones.sql` (adds only). **Not applied yet** — the apply was stopped mid-call and nothing
landed. Until it runs, sending photos, files, voice notes, reactions, chat themes and phone sharing shows "needs the latest server
update" and changes nothing. Text chat and everything else works.

## Also
`vercel.json`: `Permissions-Policy` now allows the microphone for this site (it was blocked), `media-src` allows `blob:` for playback.
