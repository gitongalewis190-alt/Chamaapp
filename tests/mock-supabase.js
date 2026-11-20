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
    requests: M.requests || [],
    pending: M.pending || [],
    messages: M.messages || [],
    responses: M.responses || [],
    notifications: M.notifications || [],
    contacts: M.contacts || [{ user_id: '11111111-1111-4111-8111-111111111111', name: 'Otieno Odhiambo', role: 'secretary', photo: null, member_id: 'm2', can_message: true }, { user_id: '22222222-2222-4222-8222-222222222222', name: 'Faith Mwende', role: 'member', photo: null, member_id: 'm3', can_message: true }],
    sessionDead: !!M.sessionDead,
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
    preview_invite_code: a => a.p_code === 'ABCDEFGHJK' ? ok({ ok: true, chama_id: 'umoja', chama_name: 'Umoja Savings', display_tag: 'UMOJ', role: 'secretary', treasurer_name: 'Wanjiku Kamau', people: 8, members_listed: 8, contribution: 2000, currency: 'KES' }) : ok({ ok: false, error: 'That code was not found.' }),
    redeem_invite_code: () => { db.pending = [{ chama_id: 'umoja', chama_name: 'Umoja Savings', display_tag: 'UMOJ', role: 'secretary', requested_at: new Date().toISOString(), treasurer_name: 'Wanjiku Kamau' }]; return ok({ ok: true, chama_id: 'umoja', chama_name: 'Umoja Savings', role: 'secretary', pending: true }); },
    my_join_requests: () => ok(db.pending),
    cancel_join_request: () => { db.pending = []; return ok(null); },
    list_join_requests: () => ok(db.requests),
    decide_join_request: a => { db.requests = db.requests.filter(r => r.id !== a.p_id); return ok({ ok: true, approved: a.p_approve }); },
    link_member_record: () => ok({ ok: true }),
    set_member_role: () => ok(null),
    mark_notifications_read: () => ok(1),
    record_consent_v2: a => ok({ ok: true, policy_version: a.p_policy_version, accepted_at: new Date().toISOString() }),
    chat_contacts: () => ok(db.contacts),
    chat_unread: () => ok([]),
    mark_thread_read: () => ok(null),
    send_chama_message: a => { const m = { id: 'aaaaaaaa-0000-4000-8000-' + String(Date.now()).slice(-12).padStart(12, '0'), chama_id: a.p_cid, sender: (db.session && db.session.user.id) || 'u1', sender_name: 'Wanjiku Kamau', sender_role: 'treasurer', recipient: a.p_recipient || null, kind: a.p_kind, body: a.p_body || '', meta: a.p_meta || {}, pinned: a.p_kind === 'announcement', created_at: new Date().toISOString() }; db.messages.push(m); return ok(m); },
    respond_chama_message: a => { db.responses = db.responses.filter(r => !(r.message_id === a.p_id && r.user_id === 'u1')).concat([{ message_id: a.p_id, user_id: 'u1', choice: a.p_choice, name: 'Wanjiku' }]); return ok({ ok: true }); },
    record_attendance: () => ok({ ok: true }),
    close_poll: () => ok(null),
    pin_chama_message: () => ok(null),
    retract_chama_message: () => ok(null),
    member_register: () => ok([{ name: 'Wanjiku Kamau', email: 'wanjiku@example.com', phone: '0712345678', role: 'treasurer', member_id: 'm1', joined_at: '2026-06-01T00:00:00Z', photo: null }, { name: 'Otieno Odhiambo', email: 'otieno@example.com', phone: '0722000000', role: 'secretary', member_id: 'm2', joined_at: '2026-06-01T00:00:00Z', photo: null }]),
    submit_feedback: () => ok({ ok: true }),
    verify_invitation: () => ok(M.invitation || { ok: false, code: 'invalid' }),
    invitation_account: () => M.invitationAccount ? ok(M.invitationAccount) : err('Could not find the function public.invitation_account'),
    sign_loan_terms: a => ok({ ok: true }),
    request_loan_signature: a => ok({ ok: true }),
    username_available: a => ok(/^taken/.test(a.p_username || '') ? { available: false, reason: 'taken' } : { available: true }),
    username_suggestions: a => ok(String(a.p_full_name || '').trim() ? ['faith.mwangi', 'faithmwangi', 'fmwangi'] : []),
    accept_invitation: () => ok({ ok: true, chama_id: 'umoja' }),
    decline_invitation: () => ok({ ok: true }),
    revoke_invitation: () => ok(true),
    remove_member: () => ok(true),
    leave_chama: () => ok(true),
    transfer_ownership: () => ok(true),
    confirm_joined_member: () => ok({ ok: true }),
    chat_seen: () => ok(M.seen || []),
    react_chama_message: a => { db.responses = db.responses.filter(r => !(r.message_id === a.p_id && r.user_id === 'u1')).concat(a.p_emoji ? [{ message_id: a.p_id, user_id: 'u1', choice: 'r:' + a.p_emoji, name: 'Wanjiku' }] : []); return ok({ ok: true }); },
    set_chat_theme: a => ok({ ok: true, theme: a.p_theme }),
    send_chat_once: a => RPC.send_chama_message(a),
    open_chat_once: a => (db.openedOnce = db.openedOnce || {})[a.p_id] ? err('You already opened this') : ((db.openedOnce[a.p_id] = 1), ok({ data: 'R0lGODlhAQABAAAAACw=', mime: 'image/gif' })),
    set_phone_sharing: a => { db.profile.phone_shared = !!a.p_on; return ok({ ok: true }); },
    member_phones: () => ok(M.phones || [{ user_id: '11111111-1111-4111-8111-111111111111', member_id: 'm2', name: 'Otieno Odhiambo', phone: '0722000111' }]),
  };
  /* @@AGENT-SERVER-MOCK@@ (0.20.0, migration 030) — serials, self-recorded payments with evidence, checks, verify,
     emergency removal, details_at / dob_source. M.serverOld = true makes these RPCs "missing" (NOTREADY paths).
     Server-side rows live in window.__DB.payRows / __DB.serials so tests can inspect them. */
  (function () {
    const ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    db.payRows = M.payRows || [];
    db.serials = M.serials || {};
    db.details = M.details || { full_name: db.profile.full_name, phone: db.profile.phone, birth_date: null, gender: null, details_at: null, dob_source: null };
    const uid = () => (db.session && db.session.user && db.session.user.id) || 'u1';
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]);
    const isOfficer = r => r && ['treasurer', 'secretary', 'chair', 'chairperson'].includes(r.role);
    const memberOf = (cid, mid) => { const c = db.chamas[cid]; return c && (c.data.members || []).find(m => m.id === mid); };
    const shortName = n => { const p = String(n || '').trim().split(/\s+/); return p.length > 1 ? p[0] + ' ' + p[p.length - 1][0].toUpperCase() + '.' : p[0] || ''; };
    const tag4 = cid => { const w = db.workspaces.find(x => x.chama_id === cid) || {}; const c = db.chamas[cid]; return (String(w.display_tag || (c && c.data.chama && c.data.chama.name) || cid).toUpperCase().replace(/[^A-Z0-9]/g, '') + 'XXXX').slice(0, 4); };
    /* check chars: s = serial body without dashes; c1 = sum((i+1)*code) mod 31, c2 = sum((2i+3)*code) mod 31 (same as the SQL) */
    const check = body => { const s = body.replace(/-/g, ''); let a = 0, b = 0; for (let i = 0; i < s.length; i++) { a += (i + 1) * s.charCodeAt(i); b += (2 * i + 3) * s.charCodeAt(i); } return ALPHA[a % 31] + ALPHA[b % 31]; };
    const sha = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return (h.toString(16) + '0'.repeat(64)).slice(0, 64); };
    function issue(cid, kind, ref, mid, amount, date, code) {
      const ex = Object.values(db.serials).find(s => s.chama_id === cid && s.kind === kind && s.ref_id === String(ref));
      if (ex) return { serial: ex.serial, hash: ex.hash, issued_at: ex.issued_at };
      const d = date || new Date().toISOString().slice(0, 10);
      let serial; do { let x = ''; for (let i = 0; i < 4; i++) x += ALPHA[Math.floor(Math.random() * 31)]; const body = 'MC-' + tag4(cid) + '-' + d.slice(2, 4) + d.slice(5, 7) + '-' + x; serial = body + '-' + check(body); } while (db.serials[serial]);
      const row = { serial, chama_id: cid, kind, ref_id: String(ref), member_id: mid || null, amount: amount == null ? null : Number(amount), date: d, mpesa_code: code ? String(code).toUpperCase() : null, issued_at: new Date().toISOString(), issued_by: uid() };
      row.hash = sha([serial, cid, kind, row.ref_id, row.member_id, row.amount, row.date, row.mpesa_code].join('|'));
      db.serials[serial] = row;
      return { serial, hash: row.hash, issued_at: row.issued_at };
    }
    const flagsFor = (cid, amount, date) => {
      const c = db.chamas[cid], monthly = Number(c && c.data.chama && c.data.chama.monthly) || 0, f = [];
      if (amount > 50000 || (monthly > 0 && amount > 3 * monthly)) f.push('large');
      if (date && (Date.now() - new Date(date + 'T00:00:00Z').getTime()) > 31 * 864e5) f.push('backdated');
      return f;
    };
    function checkEvidence(cid, a) {
      const e = a.p_evidence;
      if (!e || !e.kind) return 'needs_evidence';
      if (e.kind === 'sms') {
        const text = String(e.text || '').toUpperCase(), code = String(e.code || a.p_code || '').toUpperCase();
        if (!code || !text.includes(code) || (a.p_code && code !== String(a.p_code).toUpperCase())) return 'evidence_mismatch';
        const m = text.match(/(?:KSH|KES)\s?([0-9,]+(?:\.[0-9]{1,2})?)/);
        if (m && Number(m[1].replace(/,/g, '')) !== Number(a.p_amount)) return 'evidence_mismatch';
        return null;
      }
      if (e.kind === 'image') return new RegExp('^' + cid + '/' + uid() + '/[^/]+\\.(jpe?g|png|webp|heic|pdf)$', 'i').test(String(e.path || '')) ? null : 'evidence_mismatch';
      return 'needs_evidence';
    }
    const S = {
      record_payment_v2: a => {
        if (db.failSave) return err('Failed to fetch');
        const r = db.roles[a.p_cid];
        if (!r || r.role !== 'treasurer') return ok({ ok: false, error: 'Only the treasurer can record payments' });
        if (!memberOf(a.p_cid, a.p_member)) return ok({ ok: false, error: 'Member not found' });
        if (!(Number(a.p_amount) > 0)) return ok({ ok: false, error: 'Amount must be more than 0' });
        const idem = db.payRows.find(p => p.chama_id === a.p_cid && a.p_idem && p.idem === a.p_idem);
        if (idem) return ok({ ok: true, status: 'duplicate_request', id: idem.id, serial: idem.serial, self_recorded: idem.self_recorded, flags: idem.flags });
        const code = a.p_code ? String(a.p_code).trim().toUpperCase() : '';
        const dup = code && db.payRows.find(p => p.chama_id === a.p_cid && p.mpesa_code === code);
        if (dup) return ok({ ok: false, status: 'duplicate_code', id: dup.id, error: 'That M-Pesa code is already recorded' });
        const self = !!r.member_id && a.p_member === r.member_id;
        if (self) { const bad = checkEvidence(a.p_cid, a); if (bad) return ok({ ok: false, status: bad, self_recorded: true, error: bad === 'needs_evidence' ? 'Add the M-Pesa message or a photo' : 'The message does not match this payment' }); }
        const date = a.p_date || new Date().toISOString().slice(0, 10), flags = flagsFor(a.p_cid, Number(a.p_amount), date), id = uuid();
        const sr = issue(a.p_cid, 'payment', id, a.p_member, a.p_amount, date, code);
        const row = { id, chama_id: a.p_cid, member_id: a.p_member, month: a.p_month, amount: Number(a.p_amount), mpesa_code: code || null, date, idem: a.p_idem, evidence: self ? a.p_evidence : null, self_recorded: self, flags, serial: sr.serial, recorded_by: uid(), recorded_by_name: db.profile.full_name, checked_by: null, checked_at: null, checked_by_name: null };
        db.payRows.push(row);
        return ok({ ok: true, status: 'created', id, serial: sr.serial, self_recorded: self, flags });
      },
      confirm_payment: a => {
        const r = db.roles[a.p_cid], p = db.payRows.find(x => x.id === a.p_payment && x.chama_id === a.p_cid);
        if (!isOfficer(r)) return ok({ ok: false, error: 'Only an officer can confirm' });
        if (!p) return ok({ ok: false, error: 'Payment not found' });
        if (p.recorded_by === uid()) return ok({ ok: false, error: 'Someone else must check a payment you recorded' });
        if (p.checked_at) return ok({ ok: true, already: true });
        p.checked_by = uid(); p.checked_at = new Date().toISOString(); p.checked_by_name = db.profile.full_name;
        const c = db.chamas[a.p_cid], jp = c && (c.data.payments || []).find(x => x.sid === p.id);
        if (jp) { jp.chk = true; jp.chkBy = db.profile.full_name; jp.chkAt = p.checked_at; c.version++; }
        return ok({ ok: true });
      },
      payment_checks: a => db.roles[a.p_cid] ? ok(db.payRows.filter(p => p.chama_id === a.p_cid).map(p => ({ id: p.id, member_id: p.member_id, month: p.month, amount: p.amount, mpesa_code: p.mpesa_code, date: p.date, evidence: isOfficer(db.roles[a.p_cid]) ? clone(p.evidence) : null, self_recorded: p.self_recorded, checked_at: p.checked_at, checked_by_name: p.checked_by_name, flags: p.flags, serial: p.serial, recorded_by_name: p.recorded_by_name }))) : err('You are not a member of this Chama'),
      issue_serial: a => {
        const r = db.roles[a.p_cid], kinds = ['payment', 'payout', 'loan', 'fine', 'expense', 'document', 'receipt'];
        if (!r) return err('You are not a member of this Chama');
        if (!kinds.includes(a.p_kind)) return err('Unknown kind');
        if (!isOfficer(r) && !(a.p_kind === 'document' && a.p_member && a.p_member === r.member_id)) return err('Not allowed');
        return ok(issue(a.p_cid, a.p_kind, a.p_ref, a.p_member, a.p_amount, a.p_date, a.p_code));
      },
      verify_serial: a => {
        db.verifyHits = (db.verifyHits || 0) + 1;
        if (db.verifyHits > (M.verifyLimit || 30)) return ok({ found: false, status: 'slow_down', error: 'Too many checks. Wait a minute.' });
        const s = String(a.p_serial || '').trim().toUpperCase().replace(/\s+/g, '');
        if (!/^MC-[A-Z0-9]{4}-\d{4}-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{2}$/.test(s)) return ok({ found: false, genuine: false, error: 'That is not a My Chama serial' });
        if (check(s.slice(0, -3)) !== s.slice(-2)) return ok({ found: false, genuine: false, error: 'That serial has a typing mistake' });
        const row = db.serials[s];
        if (!row) return ok({ found: false, genuine: false });
        const c = db.chamas[row.chama_id], mem = memberOf(row.chama_id, row.member_id), full = mem ? mem.name : '';
        const norm = x => String(x || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean);
        const nameOk = () => { const g = norm(a.p_name), f = norm(full); return g.length > 0 && f.length > 0 && g.every(t => f.some(w => w === t || (t.length === 1 && w[0] === t))); };
        return ok({ found: true, genuine: true, kind: row.kind, chama: c && c.data.chama ? c.data.chama.name : null, date: row.date, amount: row.amount, member: shortName(full) || null,
          match: { name: a.p_name ? nameOk() : null, date: a.p_date ? a.p_date === row.date : null, amount: a.p_amount != null && a.p_amount !== '' ? Number(a.p_amount) === row.amount : null, code: a.p_code ? String(a.p_code).trim().toUpperCase() === row.mpesa_code : null } });
      },
      emergency_remove_member: a => {
        const r = db.roles[a.p_cid], c = db.chamas[a.p_cid];
        if (!r || r.role !== 'treasurer') return ok({ ok: false, error: 'Only the treasurer can do this' });
        if (String(a.p_reason || '').trim().length < 5) return ok({ ok: false, error: 'Give a reason (at least 5 letters)' });
        if (a.p_password !== 'correct-horse') return ok({ ok: false, error: 'That password is not right' });
        if (a.p_member === r.member_id) return ok({ ok: false, error: 'You cannot remove yourself' });
        if (!c || !memberOf(a.p_cid, a.p_member)) return ok({ ok: false, error: 'Member not found' });
        const name = memberOf(a.p_cid, a.p_member).name;
        c.data.members = c.data.members.filter(m => m.id !== a.p_member); c.version++;
        db.access = db.access.filter(x => x.member_id !== a.p_member);
        db.messages.push({ id: uuid(), chama_id: a.p_cid, sender: uid(), sender_name: db.profile.full_name, sender_role: 'treasurer', recipient: null, kind: 'announcement', body: name + ' was removed from the Chama. Reason: ' + String(a.p_reason).trim(), meta: { system: 'emergency_removal', member_id: a.p_member }, pinned: true, created_at: new Date().toISOString() });
        return ok({ ok: true });
      },
      get_my_details: () => ok(clone(db.details)),
      set_my_details: a => { db.details = { ...db.details, full_name: a.p_full_name || db.details.full_name, phone: a.p_phone || db.details.phone, birth_date: a.p_birth_date || db.details.birth_date, gender: a.p_gender || db.details.gender, details_at: new Date().toISOString() }; return ok({ ok: true }); },
      set_dob_source: a => ['self', 'id_scan'].includes(a.p_source) ? ((db.details.dob_source = a.p_source), ok({ ok: true })) : err('Source must be self or id_scan'),
    };
    if (!M.serverOld) Object.assign(RPC, S);
    /* old record_payment refuses the treasurer's own payment once 030 is live */
    const oldRecord = RPC.record_payment;
    if (!M.serverOld) RPC.record_payment = a => { const r = db.roles[a.p_cid || a.cid]; const mid = a.p_member || a.p_member_id || a.member_id; return r && r.member_id && mid === r.member_id ? ok({ ok: false, status: 'needs_evidence', error: 'Add the M-Pesa message or a photo' }) : oldRecord(a); };
  })();

  function query(table) {
    const st = { table, filters: {}, op: 'select', patch: null };
    const run = () => {
      calls.push({ kind: 'from', table, op: st.op, filters: clone(st.filters), patch: st.op === 'update' ? '[doc]' : undefined });
      if (table === 'chama_messages') return ok(clone(db.messages).reverse());
      if (table === 'chama_message_responses') return ok(clone(db.responses));
      if (table === 'chama_notifications') return ok(clone(db.notifications));
      /* most scenarios have already been through the "know your Chama" walkthrough; M.unaware shows it */
      if (table === 'chama_awareness') return ok(M.unaware ? [] : [{ version: 'v1' }]);
      if (table === 'chama_join_requests') return ok(clone(M.declinedRequests || []));
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
      select() { return q; }, eq(k, v) { st.filters[k] = v; return q; }, order() { return q; }, limit() { return q; },
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
          getUser: () => db.sessionDead ? Promise.resolve({ data: { user: null }, error: { message: 'Session from session_id claim in JWT does not exist', status: 403 } }) : ok({ user: db.session && db.session.user }),
          refreshSession: () => db.sessionDead ? Promise.resolve({ data: { session: null }, error: { message: 'Invalid Refresh Token' } }) : ok({ session: db.session }),
          onAuthStateChange(cb) { listeners.push(cb); setTimeout(() => cb('INITIAL_SESSION', db.session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
          signInWithOtp: a => { calls.push({ kind: 'otp', email: a.email }); return later({ data: {}, error: null }, 50); },
          verifyOtp: a => {
            calls.push({ kind: 'verify', token: a.token });
            if (a.token !== db.otpOk) return later({ data: null, error: { message: 'Token has expired or is invalid' } }, 100);
            db.session = { access_token: 'x', refresh_token: 'y', user: { id: 'u-new', email: a.email, identities: M.otpIdentities || [], app_metadata: M.otpIdentities ? { provider: 'email', providers: ['email', 'google'] } : {}, user_metadata: {} } };
            setTimeout(() => fire('SIGNED_IN', db.session), 0);
            return later({ data: { session: db.session }, error: null }, 100);
          },
          setSession: () => ok({}),
          signOut: () => { db.sessionDead = false; db.session = null; sessionStorage.removeItem('mock-session'); setTimeout(() => fire('SIGNED_OUT', null), 0); return ok({}); },
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
        /* realtime: postgres changes are ignored; broadcast and presence handlers are kept so a test can play
           another member typing (window.__live('typing', {...})) and see what this phone sends (window.__SENT) */
        channel(name) {
          const hs = [], c = {
            on(type, filt, fn) { hs.push({ type, ev: filt && filt.event, fn }); return c; },
            subscribe(cb) { if (cb) setTimeout(() => cb('SUBSCRIBED'), 0); return c; },
            send(m) { (window.__SENT = window.__SENT || []).push({ channel: name, ...clone(m) }); return Promise.resolve('ok'); },
            track() { return Promise.resolve('ok'); }, presenceState() { return M.presence || {}; }, unsubscribe() {}
          };
          if (/^live-/.test(name)) window.__live = (ev, payload) => hs.filter(h => h.type === 'broadcast' && h.ev === ev).forEach(h => h.fn({ payload }));
          return c;
        },
        storage: { from(bucket) { return {
          upload(path, blob, o) { calls.push({ kind: 'upload', bucket, path, type: o && o.contentType, size: blob && blob.size }); return M.noStorage ? err('Bucket not found') : later({ data: { path }, error: null }, 30); },
          createSignedUrl(path) { calls.push({ kind: 'sign', bucket, path }); return ok({ signedUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }); }
        }; } },
      };
    },
  };
})();
