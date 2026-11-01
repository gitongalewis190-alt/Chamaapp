// Deploy WITHOUT JWT verification (people are signed out when they call it):
//   supabase functions deploy auth-login --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { handle } from './core.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
const sha256 = async (s: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, '0')).join('');

Deno.serve((req) => handle(req, {
  env: (k) => Deno.env.get(k),
  rpc: async (fn, args) => { const { data, error } = await admin.rpc(fn, args); return { data, error: error ? { message: error.message } : null }; },
  fetchFn: (u, init) => fetch(u, init),
  sha256,
}));
