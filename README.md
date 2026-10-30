# My Chama App (MCA)

A savings-group app (chama) that runs as a plain web app on a phone. It works offline once opened, and can be added to the home screen.

**Version 0.6.12**

## What is in this repository

| File | What it does |
|—|—|
| `index.html` | The whole app in one file (HTML, CSS and JavaScript). This is what runs. |
| `sw.js` | Offline cache. Cache name `mca-app-v20`. |
| `manifest.json` | Home-screen install details. |
| `chama_auth.sql` | Supabase tables, access rules and functions for sign-in and roles. Run once in the Supabase SQL Editor. |
| `SETUP_GUIDE.md` | Step-by-step Supabase setup and how to add a new feature to the backend. |
| `icons/` | Home-screen and header logos. |
| `README.md` | This file. |

Everything the app runs is in `index.html`. Edit that file directly.

## Running it

Serve the folder over `https://` (GitHub Pages does this). Opening `index.html` straight from the file system works for a quick look, but offline mode, the home-screen install and sign-in links need a web address.

## Modes

- **Cloud mode (current setting):** the `supabase` line in the app’s config is set. People sign in by email link. The treasurer adds each person by email and gives roles (treasurer or member). Data is kept in Supabase under the access rules in `chama_auth.sql`. Before the app works for a real group, complete `SETUP_GUIDE.md`.
- **Demo mode:** set `supabase: null` in the config. Everyone opening the app is treated as treasurer and all data stays in that browser. Do not use it for a real group’s money.

## Features

- Contributions, loans, members, fines, expenses and history.
- Reports and backup, including the full-backup file.
- Notifications with a bell on the main tabs, unread counts, search and filters, and a detail page per item. An item is read only when opened.
- Automatic reminders for amounts due, and a late-payments summary for the treasurer.
- Help centre with searchable guides and troubleshoot checks.
- Settings for text size, colour, contrast and read-aloud.
- Sign-in by email link, with a treasurer who adds members and removes access.

## Updating the app

1. Edit `index.html`.
2. Bump the version in the app’s info block (`APP` in the script) and add a line to its version history, so Notifications shows the new release.
3. Bump the cache name in `sw.js`, for example `mca-app-v2` to `mca-app-v3`. Without this, phones may keep the old version.
4. If the database changes, add the change to `chama_auth.sql` as a new, re-runnable block and run it in Supabase.
5. Commit and push. GitHub Pages updates in about a minute.

## Checking a release

Open the app on a phone and check:

- The app name shows in full at the top of the sign-in screen and on Home. The opening animation draws MCA, then shows the name.
- The bell appears top-right on Home, Contribs, Loans, Members and Profile.
- The menu slides in softly, the page behind it stays still, the green marker follows your finger and rests on the current page, and Settings is the last item.
- Settings, then Account actions (treasurer): adding a person shows them in “People with access” straight away.
- Notifications lists each version.

## Notes

- Money rules and the audit trail live in the app’s core files. Keep a backup before any change to the data format.
- Reports and backup files contain member details. Keep them private.
- Any signed-in member can read the whole chama record (this is how the app is designed). Only the treasurer can change it.
- The Supabase URL and anon key in the config are public by design. Never put the `service_role` key in this app.
