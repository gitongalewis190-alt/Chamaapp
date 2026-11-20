# Handover for the next Claude session (20 November 2026, release 0.19.0 live)

Read this whole file before you change anything. The owner (Lewis, a founder in Nairobi) prefers short, dense answers. Work out what
they mean instead of asking, and build real, working features, never placeholders. They will give you **big changes and a
redesign** as directives. Fix what they report first, then do the redesign.

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
