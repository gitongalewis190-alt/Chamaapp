/* In-memory stand-in for supabase-js, used only by the browser tests.
   The tests serve this file in place of vendor/supabase-2.45.4.js and describe the world in window.__MOCK
   (set with page.addInitScript before the app loads). Every call is recorded in window.__CALLS. */
(function () {
  const M = window.__MOCK || {};
  let saved = []; try { saved = JSON.parse(sessionStorage.getItem('mock-calls') || '[]'); } catch (e) {}
  const calls = (window.__CALLS = saved);
  const keep = () => { try { sessionStorage.setItem('mock-calls', JSON.stringify(calls.slice(-200))); } catch (e) {} };
  const push0 = calls.push.bind(calls); calls.push = (...a) => { const r = push0(...a); keep(); return r; };
  const clone = v => (v == null ? v : JSON.parse(JSON.stringify(v)));
  const ok = data => Promise.resolve({ data: clone(data), error: null });
  const err = message => Promise.resolve({ data: null, error: { message } });
  const later = (v, ms) => new Promise(r => setTimeout(() => r(v), ms || 0));

  const db = (window.__DB = {
    session: M.session || (() => { try { return JSON.parse(sessionStorage.getItem('mock-session') || 'null'); } catch (e) { return null; } })(),
    account: M.account || { has_profile: true, has_password: true, needs_username: false, full_name: 'Wanjiku Kamau', username: 'wanjiku' },
    profile: M.profile || { full_name: 'Wanjiku Kamau', username: 'wanjiku', phone: '0712345678', contact_email: '', photo: null, sign_in_email: 'wanjiku@example.com' },
    workspaces: M.workspaces || [],
    chamas: M.chamas || {},        // id -> { data, version }
    roles: M.roles || {},          // id -> { role, member_id }
    access: M.access || [],
    invites: M.invites || [],
    codes: M.codes || [],
    otpOk: M.otpOk || '12345678',
    failSave: !!M.failSave,
  });
  const listeners = [];
  const fire = (ev, s) => listeners.forEach(f => { try { f(ev, s); } catch (e) { console.error(e); } });

  function view(cid) {
    const c = db.chamas[cid], r = db.roles[cid];
    if (!c || !r) return null;
    if (r.role === 'treasurer') return { limited: false, role: r.role, member_id: r.member_id, version: c.version, data: clone(c.data) };
    const d = c.data, mid = r.member_id, sum = (a, f) => a.reduce((x, y) => x + (Number(f(y)) || 0), 0);
    const mine = a => (a || []).filter(x => mid && x.memberId === mid);
    const monthCollected = {};
    (d.payments || []).forEach(p => { monthCollected[p.month] = (monthCollected[p.month] || 0) + p.amount; });
    const collected = sum(d.payments || [], p => p.amount), finesPaid = sum((d.fines || []).filter(f => f.paid), f => f.amount);
    const loansOut = sum(d.loans || [], l => l.principal), repaid = sum(d.loans || [], l => sum(l.repayments || [], r => r.amount));
    const payoutsTotal = sum(d.payouts || [], p => p.amount), expensesTotal = sum(d.expenses || [], e => e.amount);
    const shared = { memberCount: (d.members || []).length, collected, monthCollected, finesPaid, loansOut, repaid,
      loansBalance: sum(d.loans || [], l => Math.max(0, l.principal * (1 + l.rate / 100 * l.months) - sum(l.repayments || [], r => r.amount))),
      finesDue: sum((d.fines || []).filter(f => !f.paid), f => f.amount), payoutsTotal, expensesTotal,
      cashOnHand: collected + finesPaid + repaid - loansOut - payoutsTotal - expensesTotal };
    return { limited: true, role: r.role, member_id: mid, version: c.version, data: {
      chama: d.chama, members: (d.members || []).map(m => ({ id: m.id, name: m.name, shares: m.shares, joined: m.joined })),
      payments: mine(d.payments), loans: mine(d.loans), fines: mine(d.fines), payouts: mine(d.payouts), expenses: d.expenses || [], log: [],
      notes: (d.notes || []).filter(n => mid && n.to === mid), shared } };
  }

  const RPC = {
    get_app_config: () => ok({ otp_length: (M.otpLength || 8) }),
    my_account_status: () => ok(db.account),
    my_workspaces: () => ok(db.workspaces),
    get_chama_view: a => { const v = view(a.cid); return v ? ok(v) : err('You are not a member of this Chama'); },
    get_my_profile: () => ok(db.profile),
    get_chama_member_profiles: () => ok(M.memberProfiles || []),
    set_my_profile: a => { db.account = { ...db.account, has_profile: true, needs_username: false, full_name: a.p_full_name, username: a.p_username }; return ok({ ok: true }); },
    save_my_details: a => { db.profile = { ...db.profile, full_name: a.p_full_name, phone: a.p_phone, contact_email: a.p_contact_email, username: a.p_username || db.profile.username }; return ok({ username: db.profile.username }); },
    set_my_photo: a => { db.profile.photo = a.p_photo || null; return ok({ ok: true }); },
    list_access: () => ok(db.access),
    list_invitations: () => ok(db.invites),
    list_invite_codes: () => ok(db.codes),
    create_invite_code: a => { const c = { id: 'c' + Date.now(), prefix: 'ABCD', role: a.p_role, uses: 0, max_uses: a.p_max_uses, expires_at: new Date(Date.now() + a.p_hours * 3600e3).toISOString() }; db.codes.push(c); return ok([{ out_code: 'ABCD-EFGH-JK', out_expires_at: c.expires_at }]); },
    revoke_invite_code: a => { const c = db.codes.find(x => x.id === a.p_id); if (c) c.revoked_at = new Date().toISOString(); return ok(true); },
    set_display_tag: a => ok(String(a.p_tag).toUpperCase()),
    record_payment: a => db.failSave ? err('Failed to fetch') : ok({ ok: true, status: 'created', id: 'p' + Math.random() }),
    record_consent: a => ok({ ok: true, policy_version: a.p_policy_version }),
    account_deletion_status: () => ok({ pending: false }),
    request_account_deletion: () => ok({ ok: true }),
    cancel_account_deletion: () => ok({ ok: true }),
    create_chama_global: a => { const id = 'new-' + Date.now(); sessionStorage.setItem('mock-session', JSON.stringify(db.session)); db.chamas[id] = { data: a.cdata, version: 1 }; db.roles[id] = { role: 'treasurer', member_id: null }; db.workspaces.push({ chama_id: id, chama_name: a.cname, role: 'treasurer' }); return ok({ chama_id: id, role: 'treasurer' }); },
    preview_invite_code: a => a.p_code === 'ABCDEFGHJK' ? ok({ ok: true, chama_id: 'umoja', chama_name: 'Umoja Savings', display_tag: 'UMOJ', role: 'member' }) : ok({ ok: false, error: 'That code was not found.' }),
    redeem_invite_code: () => ok({ ok: true, chama_id: 'umoja' }),
    verify_invitation: () => ok(M.invitation || { ok: false, code: 'invalid' }),
    accept_invitation: () => ok({ ok: true, chama_id: 'umoja' }),
    decline_invitation: () => ok({ ok: true }),
    revoke_invitation: () => ok(true),
    remove_member: () => ok(true),
    leave_chama: () => ok(true),
    transfer_ownership: () => ok(true),
    confirm_joined_member: () => ok({ ok: true }),
  };

  function query(table) {
    const st = { table, filters: {}, op: 'select', patch: null };
    const run = () => {
      calls.push({ kind: 'from', table, op: st.op, filters: clone(st.filters), patch: st.op === 'update' ? '[doc]' : undefined });
      if (table === 'chama_members') {
        const r = db.roles[st.filters.chama_id];
        return ok(r ? { role: r.role, member_id: r.member_id } : null);
      }
      if (table === 'chamas') {
        const c = db.chamas[st.filters.id];
        if (st.op === 'update') {
          if (db.failSave) return err('Failed to fetch');
          if (!c || (st.filters.version != null && Number(st.filters.version) !== c.version)) return ok([]);
          c.data = clone(st.patch.data); c.version++;
          return ok([{ id: st.filters.id, version: c.version }]);
        }
        return ok(c ? { data: c.data } : null);
      }
      return ok(null);
    };
    const q = {
      select() { return q; }, eq(k, v) { st.filters[k] = v; return q; },
      update(p) { st.op = 'update'; st.patch = p; return q; },
      maybeSingle: run, single: run,
      then(a, b) { return run().then(a, b); },
    };
    return q;
  }

  window.supabase = {
    createClient() {
      return {
        auth: {
          getSession: () => ok({ session: db.session }),
          onAuthStateChange(cb) { listeners.push(cb); setTimeout(() => cb('INITIAL_SESSION', db.session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
          signInWithOtp: a => { calls.push({ kind: 'otp', email: a.email }); return later({ data: {}, error: null }, 50); },
          verifyOtp: a => {
            calls.push({ kind: 'verify', token: a.token });
            if (a.token !== db.otpOk) return later({ data: null, error: { message: 'Token has expired or is invalid' } }, 100);
            db.session = { access_token: 'x', refresh_token: 'y', user: { id: 'u-new', email: a.email, identities: [], app_metadata: {}, user_metadata: {} } };
            setTimeout(() => fire('SIGNED_IN', db.session), 0);
            return later({ data: { session: db.session }, error: null }, 100);
          },
          setSession: () => ok({}),
          signOut: () => { db.session = null; sessionStorage.removeItem('mock-session'); setTimeout(() => fire('SIGNED_OUT', null), 0); return ok({}); },
          updateUser: () => { db.account.has_password = true; return ok({}); },
        },
        rpc(name, args) { calls.push({ kind: 'rpc', name, args: clone(args) }); const f = RPC[name]; return f ? f(args || {}) : err('Could not find the function public.' + name); },
        from: query,
        functions: {
          invoke(name, o) {
            calls.push({ kind: 'fn', name, body: clone(o && o.body) });
            if (name === 'sync-config') return ok({ otp_length: M.otpLength || 8 });
            if (name === 'send-invitation') return ok({ ok: true, email_status: 'sent' });
            if (name === 'auth-login') {
              const b = o.body || {};
              if (b.password === 'Right#123') { db.session = { access_token: 'x', refresh_token: 'y', user: M.loginUser || { id: 'u1', email: 'wanjiku@example.com', identities: [], app_metadata: {}, user_metadata: {} } }; sessionStorage.setItem('mock-session', JSON.stringify(db.session)); setTimeout(() => fire('SIGNED_IN', db.session), 0); return ok({ session: db.session }); }
              return Promise.resolve({ data: null, error: { context: { status: 401, json: async () => ({ error: 'Email, username or password is not right' }) } } });
            }
            return err('unknown function');
          },
        },
        channel() { const c = { on() { return c; }, subscribe() { return c; } }; return c; },
      };
    },
  };
})();
