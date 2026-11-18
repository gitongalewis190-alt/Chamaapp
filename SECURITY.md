# Security policy

My Chama App holds financial records for savings groups. We take reports seriously.

## Reporting a problem
- Write to the security contact in `/.well-known/security.txt`. Please do not open a public GitHub issue for a security problem.
- Describe what you found and how to reproduce it. Do not access, change or delete other people's data, and do not run denial-of-service or automated scans against the live site.
- We aim to acknowledge reports within 3 working days and to fix confirmed issues as fast as their severity requires.

## How the app is protected (summary)
- Every read and write is checked in the database (Row Level Security and `SECURITY DEFINER` functions that check `auth.uid()` and the caller's role). Hiding a button is never the only protection.
- Members receive only their own money and group totals (`get_chama_view`). Only treasurers can update a Chama.
- Password sign-in goes through the throttled `auth-login` function. Invitation tokens and invite codes are stored only as SHA-256 hashes.
- Payments carry an idempotency key; repeated M-Pesa codes are refused by the database.
- The web app ships a strict Content-Security-Policy (no inline scripts, no third-party scripts except the optional on-device OCR library), HSTS, `frame-ancestors 'none'`, `nosniff` and a restrictive Permissions-Policy (`vercel.json`). supabase-js is served from this site, pinned to 2.45.4.
- All data shown in the page is HTML-escaped; image sources and in-app links from stored data are checked against strict patterns.
