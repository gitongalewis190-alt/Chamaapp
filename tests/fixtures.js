/* Realistic test data: one merry-go-round Chama with eight members over six months. No real people. */
function monthKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
function addMonths(k, n) { const [y, m] = k.split('-').map(Number); return monthKey(new Date(y, m - 1 + n, 1)); }

function chama() {
  const cur = monthKey(new Date()), start = addMonths(cur, -5);
  const names = ['Wanjiku Kamau', 'Otieno Odhiambo', 'Faith Mwende', 'Achieng Atieno', 'Hassan Ali', 'Kiprop Cheruiyot', 'Grace Njeri', 'Baraka Mutua'];
  const members = names.map((name, i) => ({ id: 'm' + (i + 1), name, phone: '07' + String(10000000 + i * 1111111).slice(0, 8), shares: i === 2 ? 2 : 1, joined: start, role: i === 0 ? 'Chair' : '' }));
  const payments = [];
  let n = 0;
  for (let k = 0; k < 6; k++) {
    const mk = addMonths(start, k);
    members.forEach((m, i) => {
      if (k === 5 && i % 3 === 1) return;          // some members behind this month
      if (k === 5 && i === 4) { payments.push({ id: 'p' + (++n), memberId: m.id, month: mk, amount: 1000, code: '', date: mk + '-08' }); return; }
      payments.push({ id: 'p' + (++n), memberId: m.id, month: mk, amount: 2000 * m.shares, code: 'SJK' + String(100000 + n) + 'X', date: mk + '-0' + (1 + (i % 9)) });
    });
  }
  return {
    chama: { name: 'Umoja Savings', monthly: 2000, dueDay: 10, finePerLate: 100, loanRate: 10, startMonth: start, payTo: 'Till 123456', mode: 'rotation' },
    members, payments,
    loans: [{ id: 'l1', memberId: 'm2', principal: 5000, rate: 10, months: 3, date: addMonths(cur, -2) + '-12', repayments: [{ amount: 2000, date: addMonths(cur, -1) + '-12' }] },
            { id: 'l2', memberId: 'm5', principal: 3000, rate: 5, months: 2, date: addMonths(cur, -4) + '-03', repayments: [{ amount: 3300, date: addMonths(cur, -2) + '-03' }] }],
    fines: [{ id: 'f1', memberId: 'm2', amount: 100, reason: 'Late contribution', date: addMonths(cur, -1) + '-15', paid: false }, { id: 'f2', memberId: 'm4', amount: 200, reason: 'Missed meeting', date: addMonths(cur, -2) + '-20', paid: true }],
    payouts: [0, 1, 2, 3, 4].map(k => ({ id: 'po' + k, memberId: members[k].id, month: addMonths(start, k), amount: 18000, date: addMonths(start, k) + '-28' })),
    expenses: [{ id: 'e1', title: 'Meeting venue', category: 'Meeting', amount: 1500, date: addMonths(cur, -1) + '-05' }],
    log: [{ id: 'g1', ts: Date.now() - 86400000, by: 'Treasurer', kind: 'add', text: 'Added payment: Wanjiku Kamau KES 2,000' }],
    notes: [{ id: 'n1', key: 'k', type: 'payment_confirmed', to: 'm3', title: 'Payment recorded', body: 'KES 4,000 has been recorded.', dest: '#/grid', destLabel: 'contributions', facts: [['Amount', 'KES 4,000']], ts: Date.now() - 3600000 }],
  };
}

const user = (id, email, extra) => ({ id, email, identities: [], app_metadata: {}, user_metadata: {}, ...(extra || {}) });
const ONBOARDED = { lang: 'en', chosen: 'en', tipsDone: true, policy: '2026-11-19-v4', agreedAt: '2026-11-18T10:00:00Z', serverSynced: '2026-11-19-v4' };

const scenarios = {
  signedOut: { onboard: ONBOARDED, mock: {} },
  firstRun: { onboard: null, mock: {} },
  treasurer: { onboard: ONBOARDED, url: '/?c=umoja', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u1', 'wanjiku@example.com') },
    workspaces: [{ chama_id: 'umoja', chama_name: 'Umoja Savings', role: 'treasurer', display_tag: 'UMOJ' }],
    chamas: { umoja: { data: chama(), version: 7 } }, roles: { umoja: { role: 'treasurer', member_id: 'm1' } },
    access: [{ email: 'wanjiku@example.com', role: 'treasurer', status: 'active', member_id: 'm1' }, { email: 'faith@example.com', role: 'member', status: 'active', member_id: 'm3' }, { email: 'newbie@example.com', role: 'member', status: 'active', member_id: null }],
    invites: [{ id: 'i1', invited_email: 'grace@example.com', intended_role: 'member', status: 'pending', expires_at: new Date(Date.now() + 5 * 864e5).toISOString(), member_id: 'm7' }],
  } },
  member: { onboard: ONBOARDED, url: '/?c=umoja', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u3', 'faith@example.com') },
    account: { has_profile: true, has_password: true, needs_username: false, full_name: 'Faith Mwende', username: 'faith' },
    profile: { full_name: 'Faith Mwende', username: 'faith', phone: '0722000000', contact_email: '', photo: null },
    workspaces: [{ chama_id: 'umoja', chama_name: 'Umoja Savings', role: 'member' }],
    chamas: { umoja: { data: chama(), version: 7 } }, roles: { umoja: { role: 'member', member_id: 'm3' } },
  } },
  multi: { onboard: ONBOARDED, url: '/', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u1', 'wanjiku@example.com') },
    workspaces: [{ chama_id: 'umoja', chama_name: 'Umoja Savings', role: 'treasurer', display_tag: 'UMOJ' }, { chama_id: 'tumaini', chama_name: 'Tumaini Women Group', role: 'member' }],
    chamas: { umoja: { data: chama(), version: 7 }, tumaini: { data: chama(), version: 2 } }, roles: { umoja: { role: 'treasurer', member_id: 'm1' }, tumaini: { role: 'member', member_id: 'm4' } },
  } },
  none: { onboard: ONBOARDED, url: '/', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u9', 'new@example.com') },
    account: { has_profile: true, has_password: true, needs_username: false, full_name: 'Juma Hamisi', username: 'juma' }, workspaces: [],
  } },
  setup: { onboard: ONBOARDED, url: '/', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u8', 'fresh@example.com') },
    account: { has_profile: false, has_password: false, needs_username: true }, workspaces: [],
  } },
  emptyChama: { onboard: ONBOARDED, url: '/?c=blank', mock: {
    session: { access_token: 'a', refresh_token: 'r', user: user('u1', 'wanjiku@example.com') },
    workspaces: [{ chama_id: 'blank', chama_name: 'New Group', role: 'treasurer' }],
    chamas: { blank: { data: { chama: { name: 'New Group', monthly: 1000, dueDay: 5, finePerLate: 50, loanRate: 10, startMonth: monthKey(new Date()), payTo: '', mode: 'rotation' }, members: [], payments: [], loans: [], fines: [], payouts: [], expenses: [], log: [] }, version: 1 } },
    roles: { blank: { role: 'treasurer', member_id: null } },
  } },
  invite: { onboard: ONBOARDED, url: '/?c=umoja#invite=' + 'a'.repeat(64), mock: {
    invitation: { ok: true, chama_name: 'Umoja Savings', role: 'member', inviter_name: 'Wanjiku Kamau', email_hint: 'f***@example.com', expires_at: new Date(Date.now() + 6 * 864e5).toISOString() },
  } },
};

module.exports = { scenarios, chama };
