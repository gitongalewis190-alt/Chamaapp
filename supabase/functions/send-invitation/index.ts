// Deploy: supabase functions deploy send-invitation   (JWT verification stays ON; see README for secrets)
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { handle } from './core.ts';

const url = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });

Deno.serve((req) => handle(req, {
  env: (k) => Deno.env.get(k),
  getUser: async (jwt) => { const { data, error } = await admin.auth.getUser(jwt); return error || !data.user ? null : { id: data.user.id }; },
  rpc: async (fn, args) => { const { data, error } = await admin.rpc(fn, args); return { data, error: error ? { message: error.message } : null }; },
  fetchFn: (u, init) => fetch(u, init),
}));
