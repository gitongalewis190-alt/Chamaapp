// sync-config: copies the sign-in code length from Supabase Auth settings into app_config,
// so the code boxes on the sign-in screen always match the length of the emailed code.
// The app calls it on every open (before sign-in), so it answers from a 10-minute in-memory cache
// and only then asks the Supabase Management API. It reads one number and exposes nothing else.
//
// Secrets (Edge Functions > Secrets):
//   SUPABASE_PAT  = personal access token (Account > Access Tokens). Required.
//   PROJECT_REF   = sgfvjsxmchohawhqraii (optional; this default is used when not set)
// Deploy: supabase functions deploy sync-config
//   The slug MUST be "sync-config": the app calls functions.invoke('sync-config').

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const TTL_MS = 10 * 60 * 1000;
let cached: { n: number; at: number } | null = null;

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function stored(): Promise<number | null> {
  const { data } = await admin.from('app_config').select('value').eq('key', 'otp_length').maybeSingle();
  const n = Number(data?.value);
  return Number.isInteger(n) && n >= 4 && n <= 10 ? n : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (cached && Date.now() - cached.at < TTL_MS) return json({ otp_length: cached.n });

  const PAT = Deno.env.get('SUPABASE_PAT');
  const REF = Deno.env.get('PROJECT_REF') || 'sgfvjsxmchohawhqraii';
  const fallback = async (error: string, status = 502) => {
    const n = await stored().catch(() => null);
    return n ? json({ otp_length: n, stale: true }) : json({ error }, status);
  };
  if (!PAT) return fallback('Server setting missing: SUPABASE_PAT', 500);

  let n: number;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, { headers: { Authorization: `Bearer ${PAT}` }, signal: ctl.signal });
    clearTimeout(t);
    if (!res.ok) return fallback('Could not read Supabase auth settings');
    n = Number((await res.json()).mailer_otp_length);
  } catch { return fallback('Could not reach Supabase auth settings'); }
  if (!Number.isInteger(n) || n < 4 || n > 10) return fallback('Unexpected code length from Supabase');

  const { error } = await admin.from('app_config').upsert({ key: 'otp_length', value: n }, { onConflict: 'key' });
  if (error) return json({ error: 'Could not save the setting' }, 502);
  cached = { n, at: Date.now() };
  return json({ otp_length: n });
});
