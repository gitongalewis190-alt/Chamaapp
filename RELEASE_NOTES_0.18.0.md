# My Chama 0.18.0 (20 November 2026)

## The app matches your age
From the date of birth, the app sets itself up (people can always choose otherwise):

| Age | What changes | Why |
|---|---|---|
| under 45 | standard app | |
| 45 to 59 | larger text | near reading starts to fade in the mid-40s |
| 60 to 74 | Simple view: larger text, bigger buttons, calmer motion, fewer words and panels, a big "Need help?" tile on Home | small text, small targets, motion and busy screens get harder |
| 75 and up | Simple view with the largest text | |

- The person is told what was set up and can choose "Use the standard app" right away.
- Settings, Display shows "Matched to your age" with **Use the standard app**, or **Match my age** to go back.
- Changing text size, Simple view, bigger buttons or less movement by hand is their own choice: the app never overrides it.
- On a new phone the age is fetched from the server, so the app is set up the same way there.

## Everyone checks their details once
Existing members see "My Chama has been updated" with what changed, then name, phone, birth year and gender (one question per
screen, prefilled where known; exact month and day may be skipped; "Prefer not to say" counts). It cannot be put off.
If everything is already known, they only see the update notice.

## One phone number for every Chama (migration 027)
The phone on a person's profile goes into their entry in every Chama they join (approval or invitation), and a new number replaces
the old one in every Chama that still had it. A different number typed by a treasurer is left alone. Today's empty numbers are
filled in when the update runs.

## Needs you
Run `supabase/RUN_THIS_NEXT.sql` (026 + 027, one transaction, safe to re-run). It replaces `RUN_026.sql`.
