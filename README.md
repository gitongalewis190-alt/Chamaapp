# Chama

A savings-group app (chama) that runs as a plain web app on a phone. It works offline once opened, and can be added to the home screen.

**Version 0.4.1**

## What is in this repository

| File | What it does |
|—|—|
| `index.html` | The whole app in one file (HTML, CSS and JavaScript). This is what runs. |
| `sw.js` | Offline cache. Cache name `chama-v4`. |
| `manifest.json` | Home-screen install details. |
| `README.md` | This file. |
| `chama_auth.sql` | Database rules for sign-in. Not part of the repo’s running app; run in Supabase when sign-in is switched on. |

The `src/` and `styles/` folders hold the modular source the bundle is built from. They are not in this repository yet. Until they are added, edit `index.html` directly and keep the bundle as the single source of truth.

## Running it

Serve the folder over `https://` (GitHub Pages does this). Opening `index.html` straight from the file system also works for a quick look, but offline mode and the home-screen install need a web address.

## Modes

- **Demo mode (current setting):** `supabase: null` in the app’s config. Everyone opening the app is treated as treasurer, and all data stays in that browser. Do not use this mode for a real group’s money.
- **Cloud mode (built, switched off):** sign-in by email link, with roles for treasurer and member, and data kept in Supabase under access rules. To switch it on, restore the Supabase line in the config and run `chama_auth.sql` in the Supabase SQL Editor. See `SETUP_GUIDE.md`.

## Features

- Contributions, loans, members, fines, expenses and history.
- Reports and backup, including the full-backup file.
- Notifications with a bell on the main tabs, unread counts, search and filters, and a detail page per item. An item is read only when opened.
- Automatic reminders for amounts due, and a late-payments summary for the treasurer.
- Help centre with searchable guides and troubleshoot checks.
- Settings for text size, colour, contrast and read-aloud.

## Updating the app

1. Edit `index.html`.
2. Bump the version in the app’s info block (`APP` in the script) and add a line to its version history, so Notifications shows the new release.
3. Bump the cache name in `sw.js`, for example `chama-v4` to `chama-v5`. Without this, phones may keep the old version.
4. Commit and push. GitHub Pages updates in about a minute.

## Checking a release

Open the app on a phone and check:

- The bell appears top-right on Home, Contribs, Loans, Members and Profile.
- The menu opens, the page behind it stays still, and Settings is the last item.
- Notifications lists each version.

## Notes

- Money rules and the audit trail live in the app’s core files. Keep a backup before any change to the data format.
- Reports and backup files contain member details. Keep them private.
