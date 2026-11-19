# Installing the My Chama emails in Supabase

Each Supabase email is a separate template, so pasting one file changes only that one email. To change all of them, repeat the steps below for every row in the table.

## Where
1. Open https://supabase.com/dashboard and choose the project **sgfvjsxmchohawhqraii** (My Chama).
2. In the left menu: **Authentication → Emails**. (On older dashboards: **Authentication → Email Templates**.)
3. Open the **Templates** tab. You will see one tab per email: Confirm signup, Invite user, Magic link, Change email address, Reset password, Reauthentication.

## For each email
1. Click its tab (left column below).
2. **Subject:** delete what is there and paste the subject from the table.
3. **Message body:** click inside the body box, select everything (Ctrl+A / Cmd+A) and delete it. Then open the matching file, copy **all** of it (from `<!doctype html>` to `</html>`) and paste.
4. Click **Save changes** at the bottom of that tab.
5. Move to the next tab and repeat.

| Supabase tab | Subject (paste exactly) | File | When people get it |
|---|---|---|---|
| **Magic link** | `{{ .Token }} is your My Chama code` | `magic_link.html` | **Most important.** Every sign-in code and every "Forgot password" code. |
| **Confirm signup** | `{{ .Token }} — confirm your email for My Chama` | `confirmation.html` | The first code when someone creates an account. |
| **Reset password** | `Reset your My Chama password` | `recovery.html` | Only if a reset is ever sent from the Supabase dashboard (the app itself uses codes). |
| **Change email address** | `{{ .Token }} — confirm your new email for My Chama` | `email_change.html` | When someone changes their sign-in email. |
| **Reauthentication** | `{{ .Token }} is your My Chama security code` | `reauthentication.html` | Security check before a sensitive change. |
| **Invite user** | `You’re invited to My Chama` | `invite.html` | Only if someone is invited from the Supabase dashboard. |

Do not change the `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}` or `{{ .ConfirmationURL }}` parts. Supabase replaces them with the real code, address or link.

## The Chama invitation email is different
The email a treasurer sends from **People and access → Send an email** is not a Supabase template. It comes from the app's own server function (`send-invitation`), which is already redesigned and live. You do not need to paste anything for it.

## Check it worked
Sign out of the app, tap **Sign in → Forgot password?**, and enter your email. The email should:
- show the code in the notification and subject, with a "Copy code" button on iPhone or Gmail;
- show the new design (green code box, "Fill it in for me" button);
- open the app with the code filled in when you tap "Fill it in for me".

If the email still looks old, the tab was not saved; open it again and click **Save changes**.
