// auth-login: sign in with EMAIL or USERNAME + the one global password.
// The browser never learns which email belongs to a username, and every failure looks the same.
// Passwords are checked only by Supabase Auth; this function just forwards them and never logs or stores them.
export type Deps = {
  env: (k: string) => string | undefined;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: { message: string } | null }>;
  fetchFn: (url: string, init: any) => Promise<{ ok: boolean; status: number; json: () => Promise<any> }>;
  sha256: (s: string) => Promise<string>;
};
export const WRONG = 'Email, username or password is not right';
const DUMMY = 'no-such-account@invalid.example';

function cors(origin: string | null, allowed: string | undefined) {
  const h: Record<string, string> = { 'Content-Type': 'application/json', 'Vary': 'Origin', 'Cache-Control': 'no-store' };
  if (origin && allowed && origin === allowed) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info';
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  return h;
}

export async function handle(req: Request, d: Deps): Promise<Response> {
  const headers = cors(req.headers.get('origin'), d.env('ALLOWED_ORIGIN'));
  const out = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return out(405, { error: 'Use POST' });

  let b: any;
  try { b = await req.json(); } catch { return out(400, { error: 'Bad request' }); }
  const ident = typeof b.identifier === 'string' ? b.identifier.trim().toLowerCase() : '';
  const pw = typeof b.password === 'string' ? b.password : '';
  if (!ident || ident.length > 254 || !pw || pw.length > 200) return out(401, { error: WRONG });

  // throttle per network address and per identifier (hashed, so no raw usernames are stored)
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const idKey = 'id:' + (await d.sha256(ident));
  const a = await d.rpc('auth_throttle_hit', { p_key: 'ip:' + ip, p_max: 40, p_window_seconds: 600 });
  const c = await d.rpc('auth_throttle_hit', { p_key: idKey, p_max: 8, p_window_seconds: 600 });
  if (a.error || c.error) return out(503, { error: 'Sign-in is busy. Try again in a moment.' });
  if (a.data === false || c.data === false) return out(429, { error: 'Too many tries. Wait a few minutes and try again.' });

  const r = await d.rpc('resolve_login_email', { p_identifier: ident });
  const email: string | null = r.error ? null : r.data;
  const known = !!email;

  let res;
  try {
    res = await d.fetchFn(`${d.env('SUPABASE_URL')}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: { apikey: d.env('SUPABASE_ANON_KEY') || '', 'content-type': 'application/json' },
      body: JSON.stringify({ email: known ? email : DUMMY, password: pw }),   // unknown usernames still cost the same work
    });
  } catch { return out(502, { error: 'Could not reach sign-in. Check your internet and try again.' }); }
  if (!known || !res.ok) return out(401, { error: WRONG });

  const s = await res.json();
  await d.rpc('auth_throttle_clear', { p_key: idKey });
  return out(200, { session: { access_token: s.access_token, refresh_token: s.refresh_token, expires_in: s.expires_in, expires_at: s.expires_at, token_type: s.token_type } });
}
