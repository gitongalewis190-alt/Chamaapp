# 0.12.7-dev.1

Built, unverified. The owner has not reported PASS on a phone.

Service worker cache: `mca-app-v63`.

## What changed
- Home, Contributions, Members and Profile use the approved markup: raised cards, money tiles, and a sliding month pill on Contributions.
- Reset all data is no longer on Home, and the reset action is removed.
- Saving a photo that fails because `set_my_photo` is not on the server shows: "Photos are not available on this server yet. Try again after the database update."
- Drawer rows and money tiles use the depth styles in `style#cg-redesign-v1`.

## Not applied (needs owner approval)
- Confirm before changing payout order (`moveAsk`). Up still uses `moveMember` and moves at once.
- Masking phone numbers. `CG_MASK_PHONES` is false, so full numbers still show.
- Migration 019 and the missing photo functions. No SQL was written or run.
- Render coalescing and the short paint key (03, Part B).

## Database check
The connected Supabase account cannot open project `sgfvjsxmchohawhqraii`. The read-only function check was not run.

## Files
- index.html
- sw.js
- README.md
- RELEASE_NOTES_0.12.7-dev.1.md
