# My Chama: next work order and handover (after 0.20.0, 21 Nov 2026)

Owner: Lewis (Nairobi). Keep this file. When you want the fixes done, give it to the next agent and say "do NEXT_WORK_ORDER.md".
Status right now: **nothing in this file is started.** 0.20.0 is live on `main` (https://chama-livid.vercel.app).

---

## 0. Handover for the next agent (read first)

**Where things are**
- Repo `gitongalewis190-alt/Chamaapp`. Vercel deploys `main`. Work on your branch, push it **and** `HEAD:main`.
- Supabase project **`sgfvjsxmchohawhqraii`** only. Never touch "The lees app" (`emimwlpsfchndxaxzswh`).
- Release check page: https://claude.ai/artifact/JQV7pav2YSmiWCeBqCzsHq (source `docs/release-check.html`; results in its db collection `results`, feedback in `feedback/general`). Keep ids, add a new group per release, republish to the same URL.
- Background on the app's structure, rules and release routine: `RELEASE_NOTES_0.20.0.md`, `RELEASE_NOTES_0.19.0.md`, and the 0.19 handover in git history (commit `7e8c957`). Static PWA, no build: `index.html`, `assets/boot.js`, `assets/app.js` (modules `__M_src_<path>_js`, `data-act` actions), `assets/app.css`, `sw.js`.
- Tests: `NODE_PATH=$(npm root -g) node tests/run.js` (Playwright + `tests/mock-supabase.js`). At 0.20.0: 628 checks, all passing. Lint: eslint 8.57 `no-undef`, globals `Tesseract,supabase` on `assets/app.js assets/boot.js sw.js` — clean.
- Release routine: bump `?v=` in `index.html` and `sw.js`, cache name `V` in `sw.js` (now `mca-app-v82`), `APP` version + changelog in `app.js`, add `RELEASE_NOTES_x.y.z.md`, tests + lint, push branch then `HEAD:main`.

**State of the database (important)**
- Migration `supabase/migrations/030_integrity_serials_verify.sql` is written but **only applied if the owner ran it** (Supabase's approval prompt timed out for the agent). First thing: check with `select to_regclass('public.chama_serials') is not null, exists(select 1 from pg_trigger where tgname='chamas_payment_integrity');`. If false, the owner pastes the file into SQL Editor (or you apply it with `apply_migration` while the owner approves the prompt live). Until it runs: treasurer self-payments, serials, Verify, emergency removal and secretary checks show "needs the server update".
- Database rules: new work in `031_*.sql` and up; re-runnable; SECURITY DEFINER with `set search_path = public, pg_temp`; revoke public/anon, grant authenticated; end with `notify pgrst, 'reload schema';`; dry-run in `begin; … rollback;` first; never destructive SQL without the owner's clear yes; never replace `leave_chama`/`remove_member` with old files 009/019.

**How to work with this owner**
- Voice-typed, typos normal: infer intent, act, verify, push live, report in a few plain lines.
- Cares most about: members' money and data safety, ease for older and non-technical members, no flicker, a live non-generic UI, fewer words and bigger buttons. Real features only, no placeholders.
- Parallel agents work well if each edits only with exact-string Edits and puts CSS under its own marker. **Usage limits stopped agents 3 times in 0.20 — commit work-in-progress often.**

**0.20.0 areas that shipped untested on a real phone** (agents ran out of usage before their own visual check): receipts + QR + Verify (DOCS), PDFs into chat + denser reports (CHATDOCS), rules in chat + emergency removal (PEOPLE), parts of the Guide. Check these first.

---

## 1. Fix list from the owner's 0.20.0 release check (do first, in this order)

### F1. Code email reaches every member (F-S2, F-A4) — CRITICAL
- Owner: "Everyone gets the email." Codes only work on the phone that asked (the `OTP_REQ` guard holds), but the email must reach only the requester.
- Known facts: Supabase auth logs show **one** `/otp` call per request for one address; no send-email hook; Edge Functions are `send-invitation`, `auth-login`, two `sync-config` (OTP length only); template sends to `{{ .Email }}`. So copies come from the SMTP provider (Brevo) or the mailboxes.
- Do: ask the owner for one Brevo Transactional → Logs entry (To/Cc/Bcc) of a code email, and the SMTP sender address in Supabase → Authentication → Emails → SMTP. Check Brevo for BCC/"copy to", automations sending to a contact list, and Gmail forwarding/filters. If Brevo can't be made clean, move auth email to a dedicated Send Email hook (Edge Function calling Brevo's API with exactly one `to`) and test.
- Done when: a code request lands in exactly one inbox (owner confirms with 2 accounts).

### F2. Change password inside the app fails (F-V3, F-A6) — CRITICAL
- Owner: "Can't change the password from inside the app; it says error, old password needed, even though I have the right one."
- Do: reproduce in the change-password sheet. Likely Supabase's "Secure password change" setting requires a recent sign-in / reauthentication (`updateUser({ password, nonce })` after `reauthenticate()`), or the app sends the old password wrongly. Implement the correct flow: verify current password (sign-in with password on a throwaway client, or `reauthenticate` + nonce code), then `updateUser({ password })`, then `signOut({ scope: 'others' })` (already in code), then a clear success.
- Owner confirmed forgot-password → code → new password **does** sign the other phone out. Keep that.
- The signed-out reason message is too long: shorten to one line, e.g. "Your password was changed. Please sign in again." (Kiswahili too).
- Done when: change in-app works with the right old password, wrong one says "That password is not right", other phone signs out within 5 min or on reopen.

### F3. Sign-in and reset-password screens redesign (F-V3)
- Owner: reset-password page and sign-in language "look generic". Recreate them premium and simple.
- Google button: proper full-colour Google "G" mark.
- Other providers (Apple etc.): hidden under one "More ways to sign in" button; tapping one says "Still in development — available soon. Use Google or email for now."
- **Last used method:** remember how the person signed in last (Google / email+password / code) on this phone; show a green "Last used" tag on that option and put it first.
- Plain short words; check light/dark/Simple at 390 px.

### F4. M-Pesa screenshot reader (F-M3) — owner still marks it failing
- Paste must be clearly the recommended first option; if a screenshot yields no payments, switch to paste automatically with "We could not read that picture. Copy the M-Pesa message and paste it here." Verify the 0.20 build does this on a real phone; fix what doesn't. Improve OCR preprocessing if cheap; never a blank screen after upload.

### F5. Verify: QR scan says "can't scan in a browser" (F-V11)
- `BarcodeDetector` is missing on iPhone Safari and some Android browsers. Add a self-hosted QR decoder fallback (vendor a small MIT decoder such as jsQR into `vendor/`, no CDN — CSP blocks external scripts) reading camera frames via `getUserMedia` (`camera=(self)` in `vercel.json` Permissions-Policy). Test on iPhone Safari and Android Chrome.

### F6. ID scan for date of birth is poor (F-V15)
- Owner: on-phone OCR is poor and scanning IDs in-app "is also legally not very ok"; wants an external service.
- Do: stop promoting the on-phone ID OCR (keep typed date of birth as "self-declared"). Ask the owner to choose a KYC provider with Kenyan national-ID support (Smile ID recommended: ID register check + selfie liveness; alternatives Veriff, Onfido, Sumsub). Build: consent screen, provider SDK/hosted flow, Edge Function holding the API key as a Supabase secret, webhook sets `profiles.dob_source='verified'` and birth date; no ID images stored by us; privacy policy update (Kenya Data Protection Act / ODPC). **Needs the owner's provider choice and keys first.**

### F7. Emergency removal (F-V18)
- Owner: "should show real progress and the system should work."
- Do: confirm migration 030 is applied (else it can't work). Show real steps while it runs: "Checking your password… Removing… Telling the group… Done", each tick tied to the actual RPC result; clear errors (wrong password, too many tries — 15 min lock). Test on two phones.

---

## 2. New requests from the owner (after the fix list)

### N1. Language applies everywhere
- When Kiswahili (or any chosen language) is selected, **everything** follows: screens, toasts, sheets, notifications (in-app and push), system chat messages, emails where possible, PDFs/receipts/reports, Guide answers, errors. Server-generated text (`private.notify`, system messages) must be stored as a key + params and rendered in the reader's language, or generated per recipient language. Add a test that walks main screens in Kiswahili and fails on English strings.

### N2. Toasts: top, big, fewer
- Most toasts/cards appear at the **top** of the screen, large enough and long enough to notice (success ≥ 3.5 s, error ≥ 6 s, dismiss by tap/swipe). Never cover a sheet's buttons.
- **Remove toasts for obvious things** (e.g. a sheet just closed, a tab opened, a value saved that is already visible). Use a quiet check mark next to the control instead. Make a list of every `toast(` call and keep only those that tell the user something they can't see.

### N3. Members list: invite card replaces "Add member"
- The card under People and access (email field, code, "Invite someone") moves to the top of the Members list for the treasurer, replacing the "Add member" button. Big, fast, one place. Keep People and access working.

### N4. BUG: joining by code as "treasurer" creates two treasurers — CRITICAL
- Adding a new person with the code and choosing role treasurer gives the Chama two treasurers. Fix on the **server** (one treasurer per Chama enforced by a unique partial index / check in the join + role functions) and in the app (treasurer can't be chosen for a code join; hand-over uses the existing offer flow). Add a test and a SQL check that finds any Chama with 2+ active treasurers (report to the owner before changing any data).

### N5. Side menu lag
- Opening the hamburger menu lags and something forces it to close. Find the cause (double event, re-render on open, focus trap, swipe handler) and fix; open in < 100 ms, no self-close.

### N6. Invite code records
- Keep a record of every generated invite code: who made it, when, role, expiry, status, and **which members joined with it** (and when). Treasurer can see the list. Server table + RPC; RLS officers only.

### N7. Chama photo in the header
- If the treasurer set a Chama photo, show it at the top right of the header just before the Chama name (as the Chama's profile picture), and in all documents (already in PDFs — check receipts too).

### N8. Switch Chama opens at once
- Menu → Switch Chama currently returns to Home first and loads. It must open the chooser immediately (skeletons while loading, no Home flash).

### N9. Unstable network breaks creating/joining a Chama
- Make create and join resilient: idempotency keys, retry with backoff, saved draft on the phone, a clear "still working / try again" state, never half-created Chamas or double joins. Test with throttled/offline network.

### N10. Fines: reasons list and no double fine
- Rule: you cannot fine the same person twice for the same reason (e.g. lateness for the same month).
- Fine reasons become a list of options (Late contribution, Missed meeting, Lateness to meeting, Misconduct, …) with "Custom" last.
- If a fine for that person + reason (+ period) already exists, the option is disabled with "Already fined for this". Enforce on the server too.

### N11. Eye toggle to reveal amounts
- An eye toggle (privacy mode) that hides amounts and other sensitive numbers across the app (`KES ••••`), tap to reveal (auto re-hide after 10 s and when the app goes to background). See brief S-04 below.

### N12. Signatures required for received payments
- Every payment received must collect a signature (treasurer's, and the member's where present), and the secretary's verification must also be signed. Signatures stored trimmed at the standard size (0.20 standard box).

### N13. Remove "Get signature" when the loan is already signed
- On a loan whose terms were already signed, hide the extra "Collect signature" / "Get signature" button.

---

## 3. Future build brief: "Final Build Brief" (22 ticked features, 20 Nov 2026)

The owner's full brief ("Chama App: Final Build Brief, 22 ticked features, with engine-layer depth") applies after sections 1–2. Its rules: measure before/after on a throttled phone (CPU 4×, Slow 4G); money in whole shillings, round only at display; tap feedback < 100 ms; never lose data (save locally first, show conflicts); no placeholders; 44 px targets; tests every batch; 390 px light/dark/Simple.

**Budgets:** tap response < 100 ms; scroll frames < 16 ms; scripting < 50 ms per interaction; cold start to readable Home < 2.5 s on 3G; "still saving" after 1.5 s; no timers while hidden; < ~80 list rows in DOM; first-load JS −40% after the split; zero money and date errors (server time offset).

**Ticked features (done-means in short)**
- **P-01 Device tiers:** measure cores, memory, network, 60-frame sample, reduced motion → Lite / Standard / Rich (table `DEVICE_CLASSES` in `core/device.js`), set class in `boot.js` before paint; Lite = no blur anywhere; Settings → Display "Visual tier" override; measure < 300 ms; stays on device.
- **U-09 Toasts never cover actions:** above tab bar, inside sheet top when a sheet is open, success 3.5 s, error ≥ 6 s, max 2 visible, priority queue; test bounding boxes.
- **U-20 Quiet saved feedback:** 900 ms check mark beside the control instead of a toast, polite "Saved" announcement, only when something changed.
- **M-01 Motion tokens:** `--dur-fast 160ms`, `--dur-base 240ms`, `--dur-slow 360ms`, `--ease-out cubic-bezier(.2,.8,.2,1)`; no raw ms elsewhere (test greps); reduced motion → 0.
- **M-03 Skeletons:** hero, rows, tiles while loading; appear after 150 ms; cross-fade out within 100 ms; driven by per-screen loading state.
- **M-04 Sign-in → Home hand-off:** brand mark glides into header (View Transitions, fade fallback), no empty Home, 3 s cap then skeleton.
- **M-06 Haptics:** ~15 ms on payment saved, loan signed, removal confirmed, payout order changed; only after server confirms; setting; 1 s cooldown.
- **M-07 Press states:** 97% scale, back within 160 ms, `touch-action: manipulation`.
- **M-08 Spring sheets:** ≤ 6 px overshoot, settle < 300 ms, drag-to-close past half or fast flick, Escape closes, transform-only, one sheet state machine.
- **M-14 Chat bubbles:** group same sender within 2 min, Sent/Read by N on the last bubble, no overflow at 320 px, windowed rendering.
- **C-01 Member filters:** Status, Role, Joined, Payout turn chips (AND), "Showing 7 of 24", kept across screens, < 100 ms for 200 members, memoized selectors.
- **C-07 Chat search:** text only (no view-once/deleted), tap → scroll + 2 s highlight, < 200 ms for 2,000 messages, pages older messages in 50s, dedupe by id.
- **C-08 Read-aloud announcements:** "Listen" with device voice in the member's language; never wrong language; Stop; never auto.
- **C-09 Announcements until read:** "Important" pinned until each member taps "I have seen this"; "Seen by 17 of 24"; idempotent upsert per (message, member).
- **C-10 Rules reminder:** one dismissible line above the composer per rules version.
- **I-02 Date ranges:** This month, Last month, This year, Last 12 months, Custom; Nairobi time boundaries; one helper; < 300 ms.
- **S-04 Privacy mode:** amounts hidden, tap reveals 10 s, re-hide on background/lock (same as N11).
- **S-05 Quiet offline line:** "Offline. Changes will sync…", queued changes with idempotency keys, sent in order.
- **S-06 Rate-limit waits:** "Try again in 4 minutes" with live countdown from the server's retry-after; button disabled; Kiswahili.
- **S-07 Export and deletion:** member data export (CSV + PDF) from what they can see; deletion explains the 30-day hide/restore (verify against the code), password with eye toggle, one Cancel / one Delete.
- **S-08 Officer audit log:** who, what, record, when, before/after for money; search by person/action/date; officers only; append-only, server timestamps.
- **S-09 Safe offline edits:** versioned writes; server rejects stale; member chooses which version to keep.

**Engine items to build first (support the above):** E-01 device service; E-02 one scheduler (pauses when hidden, idle work); E-03 money module (whole shillings, round half up at display, remainder to last instalment, test vectors); E-04 optimistic update with rollback; E-05 per-screen loading state; E-06 memoized selectors keyed by data version; E-07 offline queue with idempotency + backoff 1–60 s ±20% jitter; E-08 windowed lists > 50 rows; E-09 server time offset; E-10 single source of truth for every number (test three screens match); E-11 error catalogue (EN + SW, never raw codes); E-12 retry policy (sign out only on definite auth error); E-13 versioned writes; E-14 crash-safe local save; E-15 UTC stored, Nairobi shown; E-16 local latency diagnostics; E-17 message timings; E-18 numeric inputs; E-19 screen-reader timing; E-20 cache policy.

**Brief build order:** (1) E-01, 02, 03, 05, 06, 10, 14, 15, 16 → (2) U-09, U-20, S-04, S-06, M-07, M-06 → (3) M-01, M-03, M-04, M-08, M-14, P-01 → (4) C-01, C-07, C-08, C-09, C-10 → (5) I-02, E-09, E-04, E-07, S-05, S-09, E-13 → (6) S-07, S-08, E-11, E-12, E-17, E-18, E-19 → (7) performance + precision tests and the owner's manual check.

**Not to build:** in-app money movement; automatic M-Pesa verification before Daraja keys; any paid service without approval.

**Open questions in the brief:** vibration default (members or officers only?); Kiswahili voice fallback; force Lite for slow-but-capable phones?; read-aloud automatic in Simple view?; can members see before/after of their own payments in the audit log?

---

## 4. Overall order for the next agent

1. Check migration 030 is live (section 0). Run tests and lint to confirm a green start.
2. Section 1: F2 and N4 (security and money roles) → F1 (with the owner) → F7 → F5 → F4 → F3 → F6 (after provider choice).
3. Section 2: N2, N10, N12, N13, N5, N8, N9, N3, N7, N6, N11, N1 (language last because it touches everything — or run it as its own agent).
4. Section 3 brief, in its own order.
5. Each release: new check group in the release check page (same URL), release notes, version + cache bump, tests + lint, push branch and `main`.

## 5. Still waiting on the owner (outside the code)
- Run migration 030 if not done; Brevo/Gmail settings for F1.
- Supabase: backups (Free plan has none → Pro, or weekly Reports → Full backup); access token 1 hour; leaked-password protection and MFA on.
- KYC provider choice + keys (F6); Daraja keys (M-Pesa verification); SMS provider (e.g. Africa's Talking).
- Legal placeholders in `legal/privacy.html`, `legal/terms.html`, `APP` in `app.js`, `.well-known/security.txt`.
