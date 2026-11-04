// send-invitation: the only place the raw invitation token leaves the database, and it goes straight into the email.
// Pure logic with injected dependencies so it can be tested without Deno, Supabase or Brevo.
export type Deps = {
  env: (k: string) => string | undefined;
  getUser: (jwt: string) => Promise<{ id: string } | null>;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: { message: string } | null }>;
  fetchFn: (url: string, init: any) => Promise<{ ok: boolean; status: number }>;
};

const ROLES = ['member', 'secretary', 'treasurer'];
const esc = (v: string) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]);
const roleName = (r: string) => (r === 'treasurer' ? 'Treasurer' : r === 'secretary' ? 'Secretary' : 'Member');

function cors(origin: string | null, allowed: string | undefined) {
  const h: Record<string, string> = { 'Content-Type': 'application/json', 'Vary': 'Origin', 'Cache-Control': 'no-store' };
  if (origin && allowed && origin === allowed) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info';
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  return h;
}

export function emailHtml(o: { chama: string; inviter: string; role: string; link: string; hours: number; app: string; privacy: string }) {
  const validFor = o.hours % 24 === 0 ? (o.hours / 24) + (o.hours === 24 ? ' day' : ' days') : o.hours + ' hours';
  const esc2 = (v: string) => esc(v);
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>You're invited to ${esc2(o.chama)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table,td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
  body { margin:0 !important; padding:0 !important; width:100% !important; background:#eef4f1; }
  a { color:#0f7b5f; }
  @media only screen and (max-width:600px) {
    .wrap { width:100% !important; }
    .pad { padding:24px 20px !important; }
    .h1 { font-size:24px !important; line-height:30px !important; }
    .code { font-size:30px !important; letter-spacing:6px !important; }
  }
  @media (prefers-color-scheme: dark) {
    body, .bg { background:#0c1713 !important; }
    .card { background:#15231e !important; }
    .ink { color:#e8f1ed !important; }
    .mute { color:#a9bdb4 !important; }
    .soft { background:#1d3229 !important; }
    .line { border-color:#2a3f36 !important; }
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#eef4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(o.inviter)} invited you to join ${esc2(o.chama)} as ${esc(roleName(o.role))}. The link works for ${validFor}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:#eef4f1;">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:560px;max-width:560px;">
<tr><td style="background:#00543b;background-image:linear-gradient(135deg,#00543b 0%,#0f7b5f 100%);border-radius:16px 16px 0 0;padding:26px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;border-radius:10px;background:#ffffff;color:#00543b;font-weight:800;font-size:16px;vertical-align:middle;">MC</span>
  <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:.4px;vertical-align:middle;padding-left:10px;">MY CHAMA</span>
</td>
<td align="right" valign="middle" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#cfe9df;">Savings group records</td>
</tr></table></td></tr><tr><td class="card pad" style="background:#ffffff;padding:34px 32px;border-left:1px solid #dde7e2;border-right:1px solid #dde7e2;"><h1 class="h1 ink" style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:28px;line-height:34px;font-weight:800;color:#1b2a24;">You’re invited to join ${esc2(o.chama)}</h1><p class="ink" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:23px;color:#1b2a24;"><b>${esc(o.inviter)}</b> invited you to join <b>${esc2(o.chama)}</b> as a <b>${esc(roleName(o.role))}</b> on My Chama App.</p><p class="mute" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;color:#5b6b64;">Your role decides what you can see and change. Nothing happens until you open the link, sign in with this email address and press Accept.</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 26px;"><tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;"><tr><td align="center" bgcolor="#0f7b5f" style="border-radius:12px;background:#0f7b5f;">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${esc(o.link)}" style="height:50px;v-text-anchor:middle;width:250px;" arcsize="24%" stroke="f" fillcolor="#0f7b5f"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Review invitation</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${esc(o.link)}" style="display:inline-block;padding:15px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;background:#0f7b5f;">Review invitation</a><!--<![endif]-->
</td></tr></table></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" style="padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="top" width="34"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#e8f3ee;color:#0f7b5f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;">1</span></td>
<td valign="top" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#1b2a24;"><b class="ink" style="color:#1b2a24;">Tap the button</b><br><span class="mute" style="color:#5b6b64;">It opens My Chama App in your browser.</span></td>
</tr></table></td></tr><tr><td valign="top" style="padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="top" width="34"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#e8f3ee;color:#0f7b5f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;">2</span></td>
<td valign="top" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#1b2a24;"><b class="ink" style="color:#1b2a24;">Sign in with this email</b><br><span class="mute" style="color:#5b6b64;">Use the same address that received this message. You will get a one-time code to confirm it is you.</span></td>
</tr></table></td></tr><tr><td valign="top" style="padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="top" width="34"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#e8f3ee;color:#0f7b5f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;">3</span></td>
<td valign="top" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#1b2a24;"><b class="ink" style="color:#1b2a24;">Press Accept</b><br><span class="mute" style="color:#5b6b64;">You join the chama with the role shown above.</span></td>
</tr></table></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;"><tr><td class="soft" style="background:#e8f3ee;border-radius:12px;padding:14px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#00543b;">
<b>This link works for ${validFor}.</b><br>It opens only for the email address that received this message. After it expires, ask your treasurer for a new invitation.</td></tr></table><p class="mute" style="margin:22px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#5b6b64;">If the button does not work, copy this address into your browser:<br><span style="word-break:break-all;color:#0f7b5f;">${esc(o.link)}</span></p></td></tr>
<tr><td class="card" style="background:#ffffff;border-radius:0 0 16px 16px;border:1px solid #dde7e2;border-top:1px solid #dde7e2;padding:18px 32px 26px;">
<p class="mute" style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#5b6b64;">Did not expect this? You can ignore this email. No account is created and nothing changes.</p><p class="mute" style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#5b6b64;">Never share a sign-in code with anyone, even someone who says they are from My Chama.</p><p class="mute" style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#5b6b64;">You received this because someone invited you to a chama on My Chama App. <a href="${esc(o.privacy)}" style="color:#0f7b5f;">Privacy policy</a> · <a href="${esc(o.app)}" style="color:#0f7b5f;">Open the app</a></p><p class="mute" style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#5b6b64;">My Chama App · Nairobi, Kenya</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/* If BREVO_TEMPLATE_ID is set, the Brevo template is used and these params are available in it:
   {{ params.CHAMA }}  {{ params.INVITER }}  {{ params.ROLE }}  {{ params.LINK }}  {{ params.EXPIRY }}  {{ params.APP }}  {{ params.PRIVACY }}  {{ params.HOURS }}
   Otherwise the built-in HTML above is sent. */
export function payload(d: Deps, email: string, row: any, link: string, hours: number) {
  const sender = { email: d.env('BREVO_SENDER_EMAIL'), name: d.env('BREVO_SENDER_NAME') || 'My Chama App' };
  const chama = row.chama_name || 'a Chama', inviter = row.inviter_name || 'The treasurer', role = roleName(row.role);
  const app = (d.env('APP_URL') || '').replace(/\/+$/, '');
  const privacy = app + '/#privacy';
  const expiry = hours % 24 === 0 ? (hours / 24) + (hours === 24 ? ' day' : ' days') : hours + ' hours';
  const tpl = Number(d.env('BREVO_TEMPLATE_ID') || 0);
  if (tpl > 0) return { sender, to: [{ email }], templateId: tpl, params: { CHAMA: chama, INVITER: inviter, ROLE: role, LINK: link, HOURS: hours, EXPIRY: expiry, APP: app, PRIVACY: privacy } };
  return { sender, to: [{ email }], subject: `${inviter} invited you to ${chama}`, htmlContent: emailHtml({ chama, inviter, role: row.role, link, hours, app, privacy }) };
}

export async function handle(req: Request, d: Deps): Promise<Response> {
  const allowed = d.env('ALLOWED_ORIGIN');
  const headers = cors(req.headers.get('origin'), allowed);
  const out = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return out(405, { error: 'Use POST' });

  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const user = jwt ? await d.getUser(jwt) : null;
  if (!user) return out(401, { error: 'Sign in first' });

  let b: any;
  try { b = await req.json(); } catch { return out(400, { error: 'Bad request' }); }
  const hours = Number(d.env('INVITE_EXPIRY_HOURS') || 168);
  let row: any, email = '';

  if (b.action === 'create') {
    email = String(b.email || '').trim().toLowerCase();
    if (typeof b.chama_id !== 'string' || !b.chama_id) return out(400, { error: 'Chama is missing' });
    if (!ROLES.includes(b.role)) return out(400, { error: 'Unknown role' });
    const r = await d.rpc('create_invitation_internal', { p_actor: user.id, cid: b.chama_id, p_email: email, p_role: b.role, p_member: b.member_id || null, p_hours: hours });
    if (r.error) return out(400, { error: r.error.message });
    row = Array.isArray(r.data) ? r.data[0] : r.data;
    row = { ...row, chama_id: b.chama_id, role: b.role };
  } else if (b.action === 'resend') {
    if (typeof b.invitation_id !== 'string') return out(400, { error: 'Invitation is missing' });
    const r = await d.rpc('resend_invitation_internal', { p_actor: user.id, p_id: b.invitation_id, p_hours: hours });
    if (r.error) return out(400, { error: r.error.message });
    row = Array.isArray(r.data) ? r.data[0] : r.data;
    email = row.invited_email;
    row = { ...row, role: row.intended_role };
  } else return out(400, { error: 'Unknown action' });

  // The invitation now exists. From here on the answer reports email delivery honestly and separately.
  const res: Record<string, unknown> = { ok: true, invitation_id: row.invitation_id, expires_at: row.expires_at };
  const key = d.env('BREVO_API_KEY'), sender = d.env('BREVO_SENDER_EMAIL'), app = (d.env('APP_URL') || '').replace(/\/+$/, '');
  if (!key || !sender || !app) { res.email_status = 'not_configured'; return out(200, res); }
  const link = `${app}/?c=${encodeURIComponent(row.chama_id)}#invite=${row.raw_token}`;
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const r = await d.fetchFn('https://api.brevo.com/v3/smtp/email', {
      method: 'POST', signal: ctl.signal,
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload(d, email, row, link, hours)),
    });
    if (r.ok) res.email_status = 'sent';
    else { res.email_status = 'failed'; res.email_error = r.status === 401 || r.status === 403 ? 'email service rejected our key or sender' : r.status === 429 ? 'email service is busy, try again soon' : `email service answered ${r.status}`; }
  } catch (e: any) { res.email_status = 'failed'; res.email_error = e && e.name === 'AbortError' ? 'email service took too long' : 'could not reach the email service'; }
  finally { clearTimeout(timer); }
  return out(200, res);   // the token is never part of the response
}
