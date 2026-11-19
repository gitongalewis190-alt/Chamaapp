/* Builds the Supabase Auth email templates from one design. Run: node supabase/email-templates/build.js
   Output: one .html per template plus SUBJECTS.md. Paste each into Supabase → Authentication → Emails → Templates.
   Variables are Supabase's own ({{ .Token }}, {{ .Email }}, {{ .SiteURL }}, {{ .ConfirmationURL }}, {{ .NewEmail }}).
   Design notes:
   - The code is in the subject and the first line of the preview text, so iOS Mail, Gmail and Outlook offer "Copy code"
     on the notification itself, before the email is opened.
   - In Apple Mail the code types itself in, with a blinking caret. Clients without CSS animation (Gmail, Outlook) show it whole.
   - "Fill it in for me" opens the app with the code, so on the same phone nothing has to be typed.
   - Light and dark mode, 600px max, bulletproof buttons, no images needed to read it (the logo is optional). */
const fs = require('fs'), path = require('path');
const APP = 'https://chama-livid.vercel.app';
const F = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SF Mono',SFMono-Regular,Menlo,Consolas,'Roboto Mono',monospace";

const shell = ({ title, preheader, body }) => `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  body{margin:0!important;padding:0!important;width:100%!important;background:#eef2ef}
  a{color:#0b6b4d}
  .code{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;border-right:3px solid transparent}
  @keyframes type{from{max-width:0}to{max-width:14ch}}
  @keyframes caret{0%,100%{border-color:transparent}50%{border-color:#0b6b4d}}
  @keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @media screen{
    .code{max-width:14ch;animation:type 1.4s steps(10,end) .35s both,caret .9s step-end 6}
    .rise{animation:rise .6s ease-out both}
  }
  @media (prefers-reduced-motion:reduce){.code,.rise{animation:none!important;max-width:none!important}}
  @media only screen and (max-width:600px){
    .wrap{width:100%!important}.pad{padding:26px 22px!important}.h1{font-size:24px!important;line-height:30px!important}
    .codebox{font-size:34px!important;letter-spacing:6px!important}.stack{display:block!important;width:100%!important}
  }
  @media (prefers-color-scheme:dark){
    body,.bg{background:#090c0b!important}.card{background:#141917!important;border-color:#232a27!important}
    .ink{color:#eef3f0!important}.mute{color:#9aa8a1!important}.soft{background:#1a201e!important;border-color:#2a332f!important}
    .codewrap{background:#0f1513!important;border-color:#2a332f!important}.codebox{color:#4fd09c!important}
    .chip{background:#1a201e!important;color:#aab5af!important}.rule{border-color:#232a27!important}
  }
  [data-ogsc] .ink{color:#eef3f0!important}[data-ogsc] .mute{color:#9aa8a1!important}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#eef2ef;font-family:${F};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${preheader}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" class="bg" style="background:#eef2ef;"><tr><td align="center" style="padding:28px 12px 40px;">
<table role="presentation" width="560" class="wrap" style="width:560px;max-width:560px;">
<tr><td style="padding:0 6px 16px;">
  <table role="presentation" width="100%"><tr>
    <td valign="middle"><table role="presentation"><tr>
      <td valign="middle" style="width:38px;"><img src="${APP}/icons/logo-192.png" width="38" height="38" alt="" style="display:block;border-radius:11px;"></td>
      <td valign="middle" class="ink" style="padding-left:10px;font-family:${F};font-size:16px;font-weight:800;letter-spacing:-.2px;color:#0f1713;">My Chama</td>
    </tr></table></td>
    <td align="right" valign="middle" class="mute" style="font-family:${F};font-size:12px;color:#78837d;">Every shilling, accounted for</td>
  </tr></table>
</td></tr>
<tr><td class="card pad" style="background:#ffffff;border:1px solid #e1e7e3;border-radius:22px;padding:34px 34px 30px;">
${body}
</td></tr>
<tr><td style="padding:22px 14px 0;" class="mute">
  <p style="margin:0 0 8px;font-family:${F};font-size:12px;line-height:18px;color:#78837d;">My Chama will never ask for your code or password by phone, SMS or WhatsApp. If anyone does, it is a scam.</p>
  <p style="margin:0;font-family:${F};font-size:12px;line-height:18px;color:#78837d;">Sent to {{ .Email }} · <a href="${APP}/legal/privacy.html" style="color:#47524c;">Privacy</a> · <a href="${APP}/legal/terms.html" style="color:#47524c;">Terms</a> · <a href="${APP}" style="color:#47524c;">Open the app</a><br>My Chama App · Nairobi, Kenya</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

const eyebrow = (t, color = '#0b6b4d', bg = '#e2f1e9') => `<span class="chip" style="display:inline-block;padding:5px 11px;border-radius:99px;background:${bg};color:${color};font-family:${F};font-size:12px;font-weight:700;letter-spacing:.3px;">${t}</span>`;
const h1 = t => `<h1 class="h1 ink rise" style="margin:16px 0 10px;font-family:${F};font-size:27px;line-height:33px;font-weight:800;letter-spacing:-.6px;color:#0f1713;">${t}</h1>`;
const p = (t, mute) => `<p class="${mute ? 'mute' : 'ink'}" style="margin:0 0 14px;font-family:${F};font-size:15px;line-height:23px;color:${mute ? '#5b6b64' : '#1b2a24'};">${t}</p>`;
const codeBlock = note => `
<table role="presentation" width="100%" style="margin:22px 0 8px;"><tr><td align="center" class="codewrap soft" style="background:#f4f7f5;border:1px solid #dfe7e2;border-radius:18px;padding:22px 12px 18px;">
  <div class="mute" style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#78837d;margin-bottom:10px;">Your code</div>
  <div class="codebox" style="font-family:${MONO};font-size:40px;line-height:48px;font-weight:700;letter-spacing:10px;color:#0b6b4d;"><span class="code" style="-webkit-user-select:all;user-select:all;">{{ .Token }}</span></div>
  <div class="mute" style="font-family:${F};font-size:12px;color:#78837d;margin-top:10px;">${note}</div>
</td></tr></table>`;
const button = (href, label, color = '#0b6b4d') => `
<table role="presentation" style="margin:18px 0 6px;"><tr><td align="center" bgcolor="${color}" style="border-radius:14px;background:${color};">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:50px;v-text-anchor:middle;width:260px;" arcsize="28%" stroke="f" fillcolor="${color}"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${label}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${href}" style="display:inline-block;padding:15px 26px;font-family:${F};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:14px;background:${color};">${label} &rarr;</a><!--<![endif]-->
</td></tr></table>`;
const facts = rows => `<table role="presentation" width="100%" class="soft" style="margin:22px 0 4px;background:#f4f7f5;border:1px solid #e3e9e5;border-radius:16px;">
${rows.map(([k, v], i) => `<tr><td class="mute ${i ? 'rule' : ''}" style="padding:12px 16px;${i ? 'border-top:1px solid #e3e9e5;' : ''}font-family:${F};font-size:13px;color:#78837d;width:38%;">${k}</td><td class="ink ${i ? 'rule' : ''}" style="padding:12px 16px;${i ? 'border-top:1px solid #e3e9e5;' : ''}font-family:${F};font-size:13px;font-weight:600;color:#1b2a24;">${v}</td></tr>`).join('')}
</table>`;
const notYou = t => `<table role="presentation" width="100%" style="margin-top:22px;"><tr><td class="rule" style="border-top:1px solid #e9eeeb;padding-top:16px;">${p(t, true)}</td></tr></table>`;
const fillLink = `${APP}/#otp={{ .Token }}&e={{ .Email }}`;

const T = {
  /* signInWithOtp: sign-in codes, forgotten passwords and returning users */
  magic_link: {
    subject: '{{ .Token }} is your My Chama code',
    html: shell({ title: 'Your My Chama code', preheader: '{{ .Token }} is your My Chama code. It works once and expires soon.', body:
      eyebrow('Sign-in code') + h1('Here is your code') +
      p('Enter this code in My Chama to continue as <b>{{ .Email }}</b>.') +
      codeBlock('Works once · expires soon · tap and hold to copy') +
      `<table role="presentation" width="100%"><tr><td align="center">${button(fillLink, 'Fill it in for me')}</td></tr></table>` +
      p('<span style="font-size:13px;">Opens the app on this phone with the code already filled in.</span>', true) +
      facts([['Account', '{{ .Email }}'], ['Used for', 'Signing in, or setting a new password'], ['Valid', 'Once, for a short time']]) +
      notYou('<b>Didn’t ask for this?</b> Someone may have typed your email by mistake. Ignore this email: without the code nobody can get in, and nothing has changed.') }) },
  /* first code for a brand-new account */
  confirmation: {
    subject: '{{ .Token }} — confirm your email for My Chama',
    html: shell({ title: 'Confirm your email', preheader: '{{ .Token }} is your code to finish creating your My Chama account.', body:
      eyebrow('Welcome') + h1('Confirm it’s you') +
      p('You are one step from your account. Enter this code in the app, then choose your name, username and password.') +
      codeBlock('Works once · expires soon · tap and hold to copy') +
      `<table role="presentation" width="100%"><tr><td align="center">${button(fillLink, 'Fill it in for me')}</td></tr></table>` +
      `<table role="presentation" width="100%" style="margin-top:20px;">${[['1', 'Confirm your email', 'With the code above.'], ['2', 'Finish your account', 'Your name, a username and one password for every Chama.'], ['3', 'Start or join a Chama', 'Create your own, or enter the code your treasurer shares.']].map(([n, t, d]) => `<tr><td valign="top" style="width:34px;padding:0 0 12px;"><span class="chip" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#e2f1e9;color:#0b6b4d;font-family:${F};font-size:13px;font-weight:800;">${n}</span></td><td valign="top" style="padding:2px 0 12px;font-family:${F};font-size:14px;line-height:21px;"><b class="ink" style="color:#1b2a24;">${t}</b><br><span class="mute" style="color:#5b6b64;">${d}</span></td></tr>`).join('')}</table>` +
      notYou('<b>Didn’t sign up?</b> Ignore this email. No account is created until the code is used.') }) },
  /* password reset by link (kept for completeness; the app resets with a code) */
  recovery: {
    subject: 'Reset your My Chama password',
    html: shell({ title: 'Reset your password', preheader: 'Use this link to choose a new My Chama password. If it wasn’t you, ignore this email.', body:
      eyebrow('Password', '#a8670f', '#fbf0dc') + h1('Choose a new password') +
      p('We received a request to reset the password for <b>{{ .Email }}</b>.') +
      `<table role="presentation" width="100%"><tr><td align="center">${button('{{ .ConfirmationURL }}', 'Reset my password')}</td></tr></table>` +
      p('<span style="font-size:13px;">Or enter this code in the app: <b style="font-family:' + MONO + ';letter-spacing:2px;color:#0b6b4d;">{{ .Token }}</b></span>', true) +
      facts([['Account', '{{ .Email }}'], ['Valid', 'Once, for a short time']]) +
      notYou('<b>Didn’t ask for this?</b> Your password has not changed. You can ignore this email. If you get several, consider changing your password.') }) },
  email_change: {
    subject: '{{ .Token }} — confirm your new email for My Chama',
    html: shell({ title: 'Confirm your new email', preheader: '{{ .Token }} confirms {{ .NewEmail }} as your My Chama sign-in email.', body:
      eyebrow('Account change', '#2e6bb8', '#e5eef9') + h1('Confirm your new email') +
      p('Confirm that <b>{{ .NewEmail }}</b> should become the sign-in email for your My Chama account.') +
      codeBlock('Works once · tap and hold to copy') +
      `<table role="presentation" width="100%"><tr><td align="center">${button('{{ .ConfirmationURL }}', 'Confirm new email')}</td></tr></table>` +
      facts([['Current email', '{{ .Email }}'], ['New email', '{{ .NewEmail }}']]) +
      notYou('<b>Didn’t ask for this?</b> Do not confirm. Sign in and change your password straight away.') }) },
  reauthentication: {
    subject: '{{ .Token }} is your My Chama security code',
    html: shell({ title: 'Security code', preheader: '{{ .Token }} confirms a sensitive change on your My Chama account.', body:
      eyebrow('Security check', '#c0392b', '#fbe6e3') + h1('Confirm this change') +
      p('Someone signed in as <b>{{ .Email }}</b> is making a sensitive change, such as a new password. Enter this code to confirm it’s you.') +
      codeBlock('Works once · expires soon') +
      notYou('<b>Not you?</b> Do not share this code. Change your password and sign out of other devices.') }) },
  invite: {
    subject: 'You’re invited to My Chama',
    html: shell({ title: 'You’re invited', preheader: 'Open the link to set up your My Chama account.', body:
      eyebrow('Invitation') + h1('You’re invited to My Chama') +
      p('An account was created for <b>{{ .Email }}</b>. Open the link to finish setting it up.') +
      `<table role="presentation" width="100%"><tr><td align="center">${button('{{ .ConfirmationURL }}', 'Accept the invitation')}</td></tr></table>` +
      notYou('Did not expect this? Ignore this email.') }) }
};

const out = path.join(__dirname);
let subjects = '# Supabase → Authentication → Emails → Templates\n\nPaste each subject and the matching file’s contents. “Magic link” is the one the app uses for sign-in and password-reset codes.\n\n| Template in Supabase | Subject | File |\n|---|---|---|\n';
const NAMES = { magic_link: 'Magic link', confirmation: 'Confirm signup', recovery: 'Reset password', email_change: 'Change email address', reauthentication: 'Reauthentication', invite: 'Invite user' };
for (const [k, v] of Object.entries(T)) {
  fs.writeFileSync(path.join(out, k + '.html'), v.html);
  subjects += `| ${NAMES[k]} | \`${v.subject}\` | \`${k}.html\` |\n`;
}
fs.writeFileSync(path.join(out, 'SUBJECTS.md'), subjects + '\nOptional: the app reads `#otp=…&e=…` links, so “Fill it in for me” signs the person in on the same phone.\n');
console.log('written', Object.keys(T).length, 'templates');
