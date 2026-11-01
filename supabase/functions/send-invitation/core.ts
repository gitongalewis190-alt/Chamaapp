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

export function emailHtml(o: { chama: string; inviter: string; role: string; link: string; hours: number }) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;color:#1b2a24">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;padding:28px" cellpadding="0" cellspacing="0"><tr><td>
<h1 style="font-size:22px;margin:0 0 12px">You are invited to ${esc(o.chama)}</h1>
<p style="font-size:16px;line-height:1.5;margin:0 0 12px">${esc(o.inviter)} invited you to join <b>${esc(o.chama)}</b> on My Chama App as <b>${esc(roleName(o.role))}</b>.</p>
<p style="font-size:16px;line-height:1.5;margin:0 0 20px">Joining lets you see this Chama’s records for your role. Nothing happens until you open the link, sign in with this email address and press Accept.</p>
<p style="margin:0 0 20px"><a href="${esc(o.link)}" style="background:#0f7b5f;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-size:16px;display:inline-block">Review invitation</a></p>
<p style="font-size:14px;line-height:1.5;color:#52615a;margin:0 0 8px">This link works for ${o.hours} hours and only for this email address. If the button does not work, copy this address into your browser:<br>${esc(o.link)}</p>
<p style="font-size:14px;color:#52615a;margin:0">Did not expect this? You can ignore the email. No account is created.</p>
</td></tr></table></td></tr></table></body></html>`;
}

/* If BREVO_TEMPLATE_ID is set, the Brevo template you designed is used and these params are available in it:
   {{ params.CHAMA }}  {{ params.INVITER }}  {{ params.ROLE }}  {{ params.LINK }}  {{ params.HOURS }}
   Otherwise the built-in HTML above is sent. */
export function payload(d: Deps, email: string, row: any, link: string, hours: number) {
  const sender = { email: d.env('BREVO_SENDER_EMAIL'), name: d.env('BREVO_SENDER_NAME') || 'My Chama App' };
  const chama = row.chama_name || 'a Chama', inviter = row.inviter_name || 'The treasurer', role = roleName(row.role);
  const tpl = Number(d.env('BREVO_TEMPLATE_ID') || 0);
  if (tpl > 0) return { sender, to: [{ email }], templateId: tpl, params: { CHAMA: chama, INVITER: inviter, ROLE: role, LINK: link, HOURS: hours } };
  return { sender, to: [{ email }], subject: `You are invited to ${chama}`, htmlContent: emailHtml({ chama, inviter, role: row.role, link, hours }) };
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
  const hours = Number(d.env('INVITE_EXPIRY_HOURS') || 48);
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
