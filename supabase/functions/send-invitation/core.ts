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

const ROLE_DESC: Record<string, string> = {
  treasurer: 'Keeps the books: records money, approves members and runs the Chama.',
  secretary: 'Keeps the member register, calls meetings, shares minutes and runs votes.',
  member: 'Sees your own savings, loans and fines, and the group totals. Votes and chats with the group.',
};
export function emailHtml(o: { chama: string; inviter: string; role: string; link: string; hours: number; app: string; privacy: string; email?: string }) {
  const validFor = o.hours % 24 === 0 ? (o.hours / 24) + (o.hours === 24 ? ' day' : ' days') : o.hours + ' hours';
  const until = new Date(Date.now() + o.hours * 3600e3).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Nairobi' });
  const chama = esc(o.chama), inviter = esc(o.inviter), role = esc(roleName(o.role)), link = esc(o.link), app = esc(o.app), privacy = esc(o.privacy);
  const desc = esc(ROLE_DESC[o.role] || ROLE_DESC.member), to = esc(o.email || '');
  const ini = esc(String(o.chama || 'C').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'C');
  const inIni = esc(String(o.inviter || 'T').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'T');
  const F = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const row = (k: string, v: string, first = false) => `<tr><td class="mute${first ? '' : ' rule'}" style="padding:12px 16px;${first ? '' : 'border-top:1px solid #e3e9e5;'}font-family:${F};font-size:13px;color:#78837d;width:38%;">${k}</td><td class="ink${first ? '' : ' rule'}" style="padding:12px 16px;${first ? '' : 'border-top:1px solid #e3e9e5;'}font-family:${F};font-size:13px;font-weight:600;color:#1b2a24;">${v}</td></tr>`;
  const step = (n: string, t: string, d: string) => `<tr><td valign="top" style="width:34px;padding:0 0 12px;"><span class="chip" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:13px;background:#e2f1e9;color:#0b6b4d;font-family:${F};font-size:13px;font-weight:800;">${n}</span></td><td valign="top" style="padding:2px 0 12px;font-family:${F};font-size:14px;line-height:21px;"><b class="ink" style="color:#1b2a24;">${t}</b><br><span class="mute" style="color:#5b6b64;">${d}</span></td></tr>`;
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<title>${inviter} invited you to ${chama}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse}
  img{border:0;outline:none;text-decoration:none}body{margin:0!important;padding:0!important;width:100%!important;background:#eef2ef}a{color:#0b6b4d}
  @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(11,107,77,.45)}70%{box-shadow:0 0 0 14px rgba(11,107,77,0)}100%{box-shadow:0 0 0 0 rgba(11,107,77,0)}}
  @media screen{.rise{animation:rise .6s ease-out both}.rise2{animation:rise .6s .15s ease-out both}.pulse{animation:pulse 2.2s ease-out 1s 3}}
  @media (prefers-reduced-motion:reduce){.rise,.rise2,.pulse{animation:none!important}}
  @media only screen and (max-width:600px){.wrap{width:100%!important}.pad{padding:26px 22px!important}.h1{font-size:24px!important;line-height:30px!important}}
  @media (prefers-color-scheme:dark){body,.bg{background:#090c0b!important}.card{background:#141917!important;border-color:#232a27!important}.ink{color:#eef3f0!important}
    .mute{color:#9aa8a1!important}.soft{background:#1a201e!important;border-color:#2a332f!important}.chip{background:#1a201e!important;color:#9fe3c6!important}.rule{border-color:#232a27!important}}
</style></head>
<body class="bg" style="margin:0;padding:0;background:#eef2ef;font-family:${F};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${inviter} invited you to join ${chama} as ${role}. The link works until ${esc(until)}.&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" class="bg" style="background:#eef2ef;"><tr><td align="center" style="padding:28px 12px 40px;">
<table role="presentation" width="560" class="wrap" style="width:560px;max-width:560px;">
<tr><td style="padding:0 6px 16px;"><table role="presentation" width="100%"><tr>
  <td valign="middle"><table role="presentation"><tr><td style="width:38px;"><img src="${app}/icons/logo-192.png" width="38" height="38" alt="" style="display:block;border-radius:11px;"></td>
  <td class="ink" style="padding-left:10px;font-family:${F};font-size:16px;font-weight:800;color:#0f1713;">My Chama</td></tr></table></td>
  <td align="right" class="mute" style="font-family:${F};font-size:12px;color:#78837d;">Invitation</td></tr></table></td></tr>
<tr><td class="card" style="background:#ffffff;border:1px solid #e1e7e3;border-radius:22px;overflow:hidden;">
  <table role="presentation" width="100%"><tr><td align="center" style="background:#0b6b4d;background-image:linear-gradient(140deg,#0d7f5b 0%,#06402e 100%);padding:34px 24px 30px;border-radius:22px 22px 0 0;">
    <div class="rise" style="display:inline-block;width:76px;height:76px;line-height:76px;border-radius:24px;background:#ffffff;color:#0b6b4d;font-family:${F};font-size:28px;font-weight:800;text-align:center;">${ini}</div>
    <div class="rise2" style="font-family:${F};font-size:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#bfe6d6;margin-top:16px;">You’re invited to join</div>
    <div class="rise2" style="font-family:${F};font-size:26px;line-height:32px;font-weight:800;letter-spacing:-.5px;color:#ffffff;margin-top:6px;">${chama}</div>
  </td></tr></table>
  <table role="presentation" width="100%"><tr><td class="pad" style="padding:28px 32px 30px;">
    <table role="presentation" width="100%"><tr>
      <td valign="middle" style="width:46px;"><span class="chip" style="display:inline-block;width:42px;height:42px;line-height:42px;border-radius:21px;background:#f6eedd;color:#b0843a;font-family:${F};font-size:15px;font-weight:800;text-align:center;">${inIni}</span></td>
      <td valign="middle" style="padding-left:12px;font-family:${F};font-size:15px;line-height:22px;"><b class="ink" style="color:#1b2a24;">${inviter}</b><br><span class="mute" style="color:#5b6b64;">invited you to keep the books together on My Chama</span></td>
    </tr></table>
    <table role="presentation" width="100%" class="soft" style="margin:22px 0 0;background:#e2f1e9;border:1px solid #c6e4d6;border-radius:16px;"><tr><td style="padding:16px 18px;">
      <div style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#0b6b4d;">Your role</div>
      <div class="ink" style="font-family:${F};font-size:19px;font-weight:800;color:#0f1713;margin-top:4px;">${role}</div>
      <div class="mute" style="font-family:${F};font-size:14px;line-height:21px;color:#47524c;margin-top:4px;">${desc}</div>
    </td></tr></table>
    <table role="presentation" width="100%" style="margin:24px 0 8px;"><tr><td align="center"><table role="presentation"><tr><td align="center" bgcolor="#0b6b4d" class="pulse" style="border-radius:14px;background:#0b6b4d;">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${link}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="27%" stroke="f" fillcolor="#0b6b4d"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Review and accept</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${link}" style="display:inline-block;padding:16px 30px;font-family:${F};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:14px;background:#0b6b4d;">Review and accept &rarr;</a><!--<![endif]-->
    </td></tr></table></td></tr></table>
    <p class="mute" style="margin:0 0 20px;text-align:center;font-family:${F};font-size:12px;color:#78837d;">Works until ${esc(until)} · only for ${to || 'this email address'}</p>
    <table role="presentation" width="100%" class="soft" style="background:#f4f7f5;border:1px solid #e3e9e5;border-radius:16px;">
      ${row('Chama', chama, true)}${row('Invited by', inviter)}${row('Your role', role)}${to ? row('Sent to', to) : ''}${row('Link valid for', validFor)}
    </table>
    <table role="presentation" width="100%" style="margin-top:22px;">${step('1', 'Open the invitation', 'It opens My Chama in your browser. Add it to your home screen later if you like.')}${step('2', 'Sign in with this email', 'New here? You will get a one-time code to confirm it is you, then choose a password.')}${step('3', 'Accept', 'You join ' + chama + ' as ' + role + ' straight away.')}</table>
    <table role="presentation" width="100%" style="margin-top:6px;"><tr><td class="rule" style="border-top:1px solid #e9eeeb;padding-top:16px;font-family:${F};font-size:12px;line-height:18px;color:#78837d;" >
      Button not working? Copy this link into your browser:<br><span style="word-break:break-all;color:#0b6b4d;">${link}</span></td></tr></table>
  </td></tr></table>
</td></tr>
<tr><td class="mute" style="padding:22px 14px 0;font-family:${F};font-size:12px;line-height:18px;color:#78837d;">
  <p style="margin:0 0 8px;">Didn’t expect this? Ignore this email. No account is created and nothing changes. My Chama will never ask for your code or password by phone, SMS or WhatsApp.</p>
  <p style="margin:0;"><a href="${privacy}" style="color:#47524c;">Privacy</a> · <a href="${app}" style="color:#47524c;">Open the app</a><br>My Chama App · Nairobi, Kenya</p>
</td></tr>
</table></td></tr></table></body></html>`;
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
  return { sender, to: [{ email }], subject: `${inviter} invited you to join ${chama} on My Chama`, htmlContent: emailHtml({ chama, inviter, role: row.role, link, hours, app, privacy, email }) };
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
