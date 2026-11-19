# Supabase → Authentication → Emails → Templates

Paste each subject and the matching file’s contents. “Magic link” is the one the app uses for sign-in and password-reset codes.

| Template in Supabase | Subject | File |
|---|---|---|
| Magic link | `{{ .Token }} is your My Chama code` | `magic_link.html` |
| Confirm signup | `{{ .Token }} — confirm your email for My Chama` | `confirmation.html` |
| Reset password | `Reset your My Chama password` | `recovery.html` |
| Change email address | `{{ .Token }} — confirm your new email for My Chama` | `email_change.html` |
| Reauthentication | `{{ .Token }} is your My Chama security code` | `reauthentication.html` |
| Invite user | `You’re invited to My Chama` | `invite.html` |

Optional: the app reads `#otp=…&e=…` links, so “Fill it in for me” signs the person in on the same phone.
