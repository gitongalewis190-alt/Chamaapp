# Handover for the next Claude session (20 November 2026, release 0.19.0 live)

Read this whole file before you change anything. The owner (Lewis, a founder in Nairobi) prefers short, dense answers. Work out what
they mean instead of asking, and build real, working features, never placeholders. They will give you **big changes and a
redesign** as directives. Fix what they report first, then do the redesign.


## 0. START HERE: the owner's work order after testing 0.19.0 (20 Nov 2026)
Source: the owner's marks and notes on the release check (https://claude.ai/artifact/JQV7pav2YSmiWCeBqCzsHq, collection `results`,
plus `feedback/general`). Re-read them yourself with `ArtifactData list results` before starting; quotes below are the owner's
words cleaned of voice typos. **Every item is a directive.** Fix the failures first (A), then the notes on passed checks (B), then
the new features (C). Use parallel agents (each edits with exact-string Edits only and appends CSS under its own marker).

### A. Failures to fix first
1. **Code email reaches everyone (F-S2, F-A4; also old A2, A4).** "Everyone gets the email." The codes don't work for them (the
   `OTP_REQ` guard holds), but the email itself must reach only the requester. The app sends ONE `signInWithOtp` to one address, so
   the copy is outside the app. Investigate with the Supabase connector and tell the owner exactly what to change:
   Auth → Hooks (a send-email hook?), Auth → SMTP settings (sender = Brevo?), and ask the owner to read Brevo → Transactional → Logs
   (the To/BCC of one code email) and Brevo → Settings for a BCC / "copy to" address or a contact-list send. Also grep the repo
   `supabase/functions/` and `supabase/email-templates/` for anything that sends to a list. If the template or a hook is the cause,
   fix it; if it is Brevo config, give the owner exact clicks. Re-test F-A4.
2. **Password change elsewhere does not sign the other phone out (F-A6).** "Both are still signed in yet the password changed on one
   side." Fix: on password change (and on "sign out everywhere"), call `supabase.auth.signOut({ scope: 'others' })` right after
   `updateUser({ password })`; on every app focus/resume and every ~5 min, call `auth.getUser()` (not `getSession`, which is local)
   and on 401/403/`session_not_found` sign out cleanly with the "your password was changed on another device" message that already
   exists. Check JWT expiry in the Supabase dashboard (Auth → Sessions; suggest 1 h access tokens). Add a test in the mock.
3. **M-Pesa screenshot reader unreliable (F-M3; old P1).** "Make it clear that pasting is recommended, and if the scanner finds
   nothing the user is redirected to pasting with a clear message." Do: paste is the first, recommended tab ("Recommended: paste
   the M-Pesa SMS"); screenshots marked "may miss some". After an upload, show at once that each image was received (thumbnail +
   "Reading…" state, never blank). If OCR finds 0 payments, automatically switch to the paste tab with "We could not read that
   picture. Copy the M-Pesa message and paste it here." Also old P1: simpler, modern UI with less text; recent payments keep the full
   M-Pesa message (stored, shown in the payment).
4. **Old fails still open:** M5 "the signing happens on their phone and is submitted to the treasurer and kept well" (the loan
   signing flow from 0.17/0.19: verify the signed terms are visible to the treasurer and stored with the loan; there is
   `sign_loan_terms`); R5 "member removed furiously" (removal must go through notice; see B4 for the emergency override);
   S10 backups (Free plan has none: remind the owner, Pro plan or weekly Reports → Full backup).

### B. Notes on checks that passed (all are requests)
1. **Scroll blur hides content (F-N12, F-M6).** "The blur should not affect no-need-to-scroll pages; it's masking important info. One
   can't see the data on the lower grids and can't scroll to remove the blur." Fix the scroll-reveal IIFE (search
   "edge-reveal scroll feel" in app.js, CSS under `@@AGENT-SCROLL-CSS@@`): apply ONLY when the scroll container is actually
   scrollable (scrollHeight > clientHeight + 40) and never to the last screenful of a page (items that cannot be scrolled into the
   middle must show at full reveal: compute reveal against the max scroll position, e.g. if `scrollY` can never bring the item to
   the reveal zone, `--rv = 1`). Never blur tiles/grids/stats/heroes (`.stats`, `.mtile`, profile tiles, `.cg-hero`, `.hero`,
   `.po-card`, cards inside sheets that don't scroll). Opacity floor higher (≥ .6), blur ≤ 1.5 px. Add a test: on a short page no
   element has `--rv < 1`.
2. **Guide (F-N10, F-X1).** The "Set a savings goal" tour clicked an existing goal and replaced it instead of adding a new one: the
   selector `[data-act="goalEdit"]` matches edit buttons. Make the goal tour target the "Add another goal" button (create action), and
   **audit every TASK tour selector** against the real DOM for treasurer, secretary and member (write a test that runs each tour and
   asserts each step's element is the intended action, not an edit/delete). "It should answer all questions about the user: how much
   I've paid, when I get my payout, my name, when I joined, my loan qualification, my recent actions, advice, and many more." Extend
   `ANSWERS` widely (personal facts from the records: saved, paid this year, next payout month and amount, join date, loan limit via
   Smart loan limits, last 5 actions from the log, fines, streak, advice such as "pay by day X to avoid a fine"), English and Kiswahili
   phrasing, through the same fuzzy `words()`.
3. **Chama rules (F-X10).** "They should be visible in full to all users when opened, not truncated. Make these perfect, design them for
   texting and chatting with members, and remind users to follow them." Full rules page for everyone; rules shown in the chat (pinned
   "Group rules" entry + a gentle reminder in the composer area once a week or when someone joins); add chat etiquette rules as a
   default section the treasurer can edit; treasurer can "remind everyone of the rules" (posts a system/announcement card).
4. **Removal (F-P3; old R5, R1).** Add an **emergency removal** that skips the notice, only for the treasurer, requires their password,
   and requires a reason; logged and announced. **Every password field in the app gets an eye toggle** (treasurer hand-over,
   step-down, emergency removal, change password, sign-in, lock PIN where sensible). R1: toasts must not cover these sheets.
5. **Lock screen (F-R2).** Replace the hand icon on the lock screen's biometric button with a proper fingerprint / Face ID mark
   (fingerprint on Android, face on iPhone by user agent; generic biometric otherwise).
6. **About you (F-U2).** "It works in the background but users don't have access to editing their details, birthday etc., and the cycle
   repeats where the app says updated then takes them through it again. Remove that for someone who has already done it; they should
   just see their details and edit them, and they should be listed in My profile too (age etc.), and editing affects the live app."
   Fix: never re-run the full flow for a user whose details are complete; if only the new consent step is missing show only that
   step. Add an "About you" section on My profile listing name, phone, date of birth with age, gender, phone sharing, each editable in
   place; saving re-applies `Adapt` immediately. Make sure the "done" key is also stored server-side (`details_at`) so a new phone
   does not repeat it.
7. **Username (F-X6).** Editing the username inside the app must use the same live checks as setup (availability tick, reasons,
   suggestions: `username_available`, `username_suggestions`).
8. **Payout order (F-X8).** "The payout order should match everywhere when changed": after a turn change, Home payout card + rail,
   Members order, Guide answers, reports and notifications must all reflect it at once (same source of truth; no cached order).
9. **Files in chat (F-N6).** The treasurer can send a PDF of the Chama details/reports straight into chat (from Reports and from the
   chat clip menu: "Chama report (PDF)", "My statement (PDF)" generated in-app), and the File option must open the phone's real file
   picker for both treasurer and members (check `accept` and iOS behaviour).
10. **Old notes still wanted:** M3 "fines should not be offered for people who have paid up; the chooser looks old-fashioned: make it
    non-generic, not just a list"; M4 "I like the live number count: apply it to most similar numbers, including when coming back to
    Home"; D2 reports "more detailed, precise and data dense"; G1 Guide "beautiful, easy, with memory" (remember recent questions);
    J2 "laggy" (profile performance on low-end phones: reduce re-renders, the scroll IIFE cost, heavy blur/backdrop-filter).

### C. New features from the owner's general feedback
1. **Anti-cheat for money records.** "The treasurer recording their own payments needs evidence." Design: when the treasurer records a
   payment for **themselves** (memberId = treasurer's own member), evidence is required: the M-Pesa message (pasted, parsed and
   matched) or a screenshot, stored with the payment, and the payment is marked "self-recorded" and needs confirmation by a second
   officer (secretary) before it counts as verified; until then it shows as "awaiting check" to members. Also: every edit/delete of
   a payment keeps the history (already in log) and notifies the member concerned; duplicate M-Pesa codes blocked (exists); amounts
   above a threshold or back-dated entries flagged. Needs a server RPC so the rule cannot be bypassed by the client (the chama doc is
   written by the treasurer, so enforce in a trigger or move payment writes behind `record_payment` checks — look at 016/020).
2. **Serial numbers on payments and documents + receipts.** Each payment, payout, loan, fine, expense and generated document gets a
   unique, non-guessable serial, e.g. `MC-UMOJ-2611-7K3Q-9X` (Chama tag, yymm, random base32, check characters). Issue serials on the
   server (new table `chama_serials(serial pk, chama_id, kind, ref_id, member_id, amount, date, mpesa_code, issued_at, issued_by,
   hash)`; RPC `issue_serial` called by the payment save path; hash = sha256 of the canonical details so tampering is detectable).
   When the treasurer marks a payment received, the member gets a **receipt**: ready to save/print (PDF and image), with serial,
   Chama, member, amount, month, M-Pesa code, date/time, QR code of the serial, and the treasurer's and member's signatures.
3. **Signatures smaller and consistent.** All signatures (loans, payouts, receipts, reports) are drawn at one standard size, scaled
   down for display and print so they line up on screen and on paper (store the vector/trimmed PNG; render at a fixed box).
4. **Verify engine for everyone (Guide → "Verify").** Any signed-in user, in any Chama or none, types "verify" in the Guide (or taps
   Verify), pastes a serial (or scans the receipt QR with the camera), optionally with name/date/amount/code. RPC `verify_serial`
   (security definer, rate-limited, returns only: genuine yes/no, kind, Chama name, date, amount, the member's first name + initial, and
   whether the supplied details match the stored hash; never other data). The checking state is a modern, satisfying scan animation
   (sweep line, ticks per field, then a clear "Genuine" seal or "Not found / details don't match"). Works across Chamas.
5. **Age verification from a physical ID.** The owner wants the date of birth confirmed by scanning the person's ID. Tell the owner
   plainly: reading an ID photo on the phone (OCR, which the app already has via Tesseract) can pre-fill the date of birth, but it
   cannot prove the ID is real or belongs to the person. Real verification needs an **external KYC provider** with Kenyan ID support,
   for example Smile ID (Smile Identity, Kenya IPRS lookup + selfie liveness), or Veriff / Onfido / Sumsub; these need an account,
   API keys (stored as a Supabase Edge Function secret, called from an Edge Function, never from the browser) and a per-check fee, plus
   a consent screen and a privacy-policy update (ODPC: sensitive data). Build the flow so that: (a) on-device ID scan pre-fills and
   marks "self-declared, ID scanned"; (b) when the owner provides KYC keys, the Edge Function upgrades it to "verified". Ask the owner
   which provider before building (b). Do not store ID images longer than needed.
6. **Stay signed in; premium sign-in.** "When I leave my account I should not be signed out every now and then." Investigate why sessions
   drop: persistSession/autoRefreshToken settings, the lock flow, the `sessionDead` handling, refresh on resume (refresh the session when
   the app becomes visible), storage being cleared by the service worker or by sign-out on transient network errors (only sign out on a
   definite auth error, never on a network failure). This must not undo A2 (password change on another phone must still sign out).
   Redesign the "Signing you in…" state to feel premium (brand animation, smooth hand-off into Home, no flash).

### D. Then
Add new checks for everything above to the release check (new group, e.g. `F-V` for 0.20, keep old ids), republish to the same URL,
write `RELEASE_NOTES_0.20.0.md`, bump versions (0.20.0, cache `mca-app-v82`), run tests + lint, push branch and `HEAD:main`.

## 1. Where things are
| | |
|---|---|
| Repo | `gitongalewis190-alt/Chamaapp`. Work on the branch you are given, then push it **and** `HEAD:main`, because Vercel deploys `main` |
| Live | https://chama-livid.vercel.app |
| Supabase | project ref **`sgfvjsxmchohawhqraii`** (dashboard name "gitongalewis100-bot's Project"). **Never** use "The lees app" (`emimwlpsfchndxaxzswh`) |
| Database | Migrations 000-027 **and 029** are applied and verified (20 Nov 2026). `028_local_phone_search_path.sql` is optional and not applied: one-line advisor fix. Nothing else to run |
| Release check | https://claude.ai/artifact/JQV7pav2YSmiWCeBqCzsHq (source `docs/release-check.html`). See section 5 |

## 2. How the app is built
- **Plain static PWA, no build step.** `index.html`, `assets/boot.js` (runs early: theme, accent, simple view), `assets/app.js` (about 8,700 lines),
  `assets/app.css` (about 2,400 lines), `sw.js` (service worker), `vendor/tesseract/` (self-hosted OCR), `legal/`, `vercel.json` (CSP and headers).
- `app.js` is a set of IIFE modules named `__M_src_<path>_js`, for example `__M_src_features_guide_js` and `__M_src_core_rerender_js`.
  Views return HTML strings. Actions are `data-act="name"` and are dispatched centrally. A real `<a href>` that has a `data-act` still navigates.
  `render()` diffs the HTML and adds the class `quiet` when it repaints the same route. Hero animations are excluded from that so they don't flicker.
- **Data model:** each Chama is one JSON document in `public.chamas.data` (members, contributions, loans, fines, expenses, goals and so on), with
  versioning and realtime. Membership and roles live in `public.chama_members`, and people in `public.profiles`. Anything privileged goes
  through **SECURITY DEFINER RPCs** with `search_path` set. The helpers are in schema `private` (`notify`, `my_role`, `person_name`,
  `local_phone`), and `public.jarr` and `public.jnum` are JSON helpers. RLS is on for every table.
- **Rule:** if an RPC is missing, the app shows a clear "Nothing was changed, needs the server update" message (`NOTREADY`). It never
  silently does something weaker. Keep that rule.
- Main features already shipped:
  - **Sign-in and recovery:** forgot password with a reset screen. A code link only signs in on the phone that asked for it (the `OTP_REQ`
    guard, 30 minutes). Google sign-in is supported.
  - **Lock:** a PIN lock, plus biometrics through WebAuthn (built to the standard, not tried on a real phone).
  - **Roles:** role offers that the person accepts or declines; one treasurer and one secretary per Chama; reasons for stepping down,
    leaving or being removed; notices.
  - **Messages:** editable messages and pinned announcements, with history.
  - **Invitations:** invite routing and usernames (usernames are never reused).
  - **Home:** the hero card tiers are late, part, due (silver), gold, ahead (purple), paid and idle, chosen by `Domain.tone`. The payout
    sits under the hero card.
  - **Money:** pay ahead, fines, expenses with a cash meter, loans with terms signed on the borrower's phone (`request_loan_signature` and
    `sign_loan_terms`), and themed PDF reports.
  - **M-Pesa import:** from SMS text or screenshots through OCR, with a matcher. Verifying codes with Safaricom is designed in
    `docs/MPESA_VERIFICATION.md` but not built, because it needs Daraja keys.
  - **Guide:** the Guide, Tour and Aware features, with the winking face and OK hand icon. The hand colour is `--guide-hand`.
  - **About you:** required for every user (version 2): name, phone, date of birth and gender, which the user can clear. Calls
    `set_my_details` and `get_my_details`.
  - **Age-adaptive view (`Adapt`):** under 45 gets the standard view; 45-59 gets larger text; 60-74 gets Simple view with large text;
    75+ gets Simple view with extra-large text. The person can turn it off in Settings, and their own accessibility choices win.
  - **One phone number for every Chama:** handled by database triggers.
  - **Chama photo:** only the treasurer can set it. It shows in the Chama chooser and in PDFs (`my_chama_faces`).


## 0.19.0: what shipped and where it lives (read before fixing)
- **Home** (`__M_src_features_home_index_js`): nothing renders above the hero. `Urgent` (same module, exported) shows full-screen
  priority prompts after each render (`renderPage` calls `Urgent.check`): unsigned loan terms, removal notice, account deletion.
  "Remind me later" snoozes 2 h in localStorage `mca-urgent-<key>`. `Account.banner()` no longer shows on Home. Payout card = `.po-*`,
  next turns = `.po-rail`. "Need help?" card shows for everyone.
- **Contributions** (`__M_src_features_contributions_index_js`): `.cg-hero` tiers `g-over/met/near/mid/low/fut` (own palette), gauge,
  count-up via exported `heroCount`, rows `.cg-row`, payments `.cg-pay`.
- **Guide** (`__M_src_features_guide_js`): `words()` = stopwords + stemming + Damerau typo fix against a vocab of SYN + TASKS;
  `calc()` = safe parser with record variables (`vars()`) and loan maths; no help articles in results, every TASK has a `tour`;
  input focused synchronously in `Guide.show`. `Tour.paint` measures the card and places it above/below the target (inverse theme,
  CSS vars on `#tourRoot`).
- **Chat** (`__M_src_features_chat_index_js`, ported from The Lees): `Media` (signed URLs, bucket `chat-media`), `Player`, `Rec`
  (MediaRecorder), `Review` (decode, trim, WAV 16 kHz), `Chat` (inbox, threadView, bubble, composer, sendMedia, onceOpen, themes,
  typing via realtime channel `live-<cid>` broadcast `typing`/`read` + presence). Global typing banner `#tyBanner`. No message text
  appears outside the thread. Kinds: text, voice, image, file (+ cards). Themes: `CHAT_THEMES`, CSS `[data-ct=...]` light+dark.
- **Phones**: About you is **v3** (`mca-about-v3`), 5th step = required consent to share phone with the group (`set_phone_sharing`).
  Members list: `Phones` (members module) via `member_phones`; call/WhatsApp/SMS sheet. Privacy page: share / stop sharing.
- **Settings > Display** reuses the first-run `Pz` components (a11y module), 21 accents (12 solid, 9 gradient, `--brand-grad`),
  boot.js accepts them. **Scroll reveal**: one IIFE before `src/features/smart` sets `--rv` on list items (`[data-rv]`); off for
  reduced motion / `a-rm`, lighter in Simple view. Profile tiles `mt-due/saved/loan/fines`.
- **Server (029)**: kinds voice/image/file; `send_chama_message` validates `meta.path` = `<cid>/<uid>/<uuid>.<ext>`, never notifies
  for chat kinds; private bucket `chat-media` + 3 storage policies; `chama_once_media` (no policies, functions only),
  `send_chat_once`, `open_chat_once` (once per person, deletes when all opened); `react_chama_message` (6 emojis), `chat_seen`,
  `chama_chat_prefs` + `set_chat_theme` (posts a system message); `profiles.phone_shared_at`, `set_phone_sharing`, `member_phones`
  (only if caller also shares); `get_my_details` returns `phone_shared_at`. Mock has all of these (`tests/mock-supabase.js`,
  `window.__live(ev,payload)` simulates another member typing).
- `vercel.json`: microphone allowed (`microphone=(self)`), `media-src 'self' blob: data:`.
- **Not yet tried on real phones / live data**: voice record + playback (iPhone Safari especially), view once across devices,
  realtime typing banner, storage policies with real uploads, phone sharing. These are release checks F-N3 to F-N9.
- **Release check** has group F-N (12 checks); F-N1 marked pass. Read the owner's results first:
  `ArtifactData list results` on https://claude.ai/artifact/JQV7pav2YSmiWCeBqCzsHq, then fix the fails.
- Parallel agents work well here if each edits only with exact-string Edits and appends CSS under its own marker; never let two
  agents rewrite whole files.

## 3. How to test and release (do this every time)
- Tests: `NODE_PATH=$(npm root -g) node tests/run.js`. This runs Playwright against a mock Supabase (`tests/mock-supabase.js`, `tests/fixtures.js`).
  **246 scenarios pass** (test `v019` covers 0.19). The harness marks the first-run screens (`mca-personal-v1`, `mca-about-v3:<uid>`) as done unless a test passes
  `opt.personal` or `opt.about`. When you add an RPC, add it to the mock too.
- Chromium is already installed: use `require('playwright')` and do not install it again.
- Lint: `npx eslint@8.57.0 --no-eslintrc -c <config with no-undef, browser globals> --global Tesseract,supabase assets/app.js assets/boot.js sw.js`.
  The result must be clean.
- Release routine:
  1. Bump `?v=` in `index.html` and `sw.js` (currently `0.19.0`).
  2. Bump the cache name `V` in `sw.js` (currently `mca-app-v81`). Change the OCR cache `mca-ocr-v1` only when `vendor/tesseract` changes.
  3. Bump `APP` version, date and changelog in `app.js`.
  4. Add `RELEASE_NOTES_x.y.z.md`.
  5. Run the tests and lint.
  6. Commit, push the branch, then `git push origin HEAD:main`.
- **Before anything ships, check it on a phone-size screen** (390 px wide) **in light and dark themes, and in Simple view.**

## 4. Database rules
- New database work goes in a new numbered file, `supabase/migrations/029_*.sql` and up. Keep it idempotent (`if not exists`,
  `create or replace`, `drop trigger if exists`). Use SECURITY DEFINER with `set search_path = public, pg_temp`. Revoke from
  `public` and `anon`, then grant to `authenticated`. End with `notify pgrst, 'reload schema';`.
- **Dry run first:** run it inside `begin; ... rollback;`, then apply it with `apply_migration`, then run `get_advisors`.
- The owner has approved running SQL. Supabase's own confirmation prompt is still a safety step: **never work around it**. If you can't
  run SQL, write one file the owner can paste into the SQL Editor, with checks at the bottom that print `ok = true`.
- **Never run destructive SQL** (deleting data or users) without showing it to the owner and getting a clear yes.
- **Do not** replace `leave_chama` or `remove_member` from the old repo files 009 or 019. The live definitions are from 022 and 023.
- Never put the owner's email, name or Supabase keys in any request to an outside service.

## 5. The release check (the owner will keep using it)
- The page is at https://claude.ai/artifact/JQV7pav2YSmiWCeBqCzsHq. Its source is `docs/release-check.html`. It has 44 checks in groups:
  F-S (Supabase, 4), F-A (sign-in, 6), F-M (money, 7), F-P (import, 6), F-R (roles, 5), F-U (look and feel, 5) and F-X (the rest, 11).
  It also has a "Critical only" filter.
- The owner's results are stored in the page's shared database. Collection `results` has one document per check id, shaped
  `{status: 'pass'|'fail'|'skip'|'', note, at}`. Read them with the `ArtifactData` tool (`list`, collection `results`) to see what failed.
  F-S1 and F-S3 are already marked pass.
- **Keep the same page and add to it.** Do not make a new one. After your fixes and the redesign:
  1. Read `docs/release-check.html`.
  2. Add new checks for every new feature or redesigned screen, in a new group such as `F-N`. Don't renumber old ids, because the
     stored results are keyed by id.
  3. Change the wording of any old check whose screen the redesign moved.
  4. Republish to the **same URL** (Artifact publish with `url`, after an Artifact `read`).
- **Fallback:** if the new session can't open or write to that artifact, publish the updated `docs/release-check.html` as a new
  artifact with the same `db` capability, give the owner the new link, and say so plainly.
- Check rule from the owner: test only critical things and things a person can't see from tests. Don't ask them to test obvious things.

## 6. Open items (not done, needs the owner or real devices)
- **Code email reaching several members' inboxes** (A2/A4). The app sends one `signInWithOtp` to one address. Check Brevo →
  Transactional → Logs and the BCC setting, Supabase → Auth → SMTP, and Auth Hooks. The app side is already hardened.
- **Auth dashboard:** turn on leaked-password protection and more MFA options.
- **Backups:** the Free plan has none. Move to Pro or take regular full backups.
- **Legal placeholders** in `legal/privacy.html`, `legal/terms.html`, `APP` in `app.js`, and `.well-known/security.txt`.
- **Needs keys:** M-Pesa verification with Daraja, and SMS to members (for example Africa's Talking).
- **Never tried on real devices:** biometric unlock, Save as PDF on iPhone Safari, swipe-down to close sheets, and live realtime role
  offers and removal notices.
- **Optional admin script:** `supabase/admin/erase_person_completely.sql` (set for one person). Run it only if the owner asks again.

## 7. How to work with this owner
- They speak by voice, so typos are normal. Infer intent, act, verify, push live, then report in a few plain lines.
- They care most about: safety of members' money and data, ease for older and non-technical members, no flicker, and a UI that is
  alive and not generic. Fewer words on screen, bigger targets.
- Every existing user must get new required steps (like About you) the next time they open the app. Bump the version key so they do.
- Theme follows the phone unless the user picks one. Never force dark.
