/* Browser tests for My Chama App. Run: node tests/run.js [--shots DIR] [--only name]
   Serves the repo on a local port, swaps supabase-js for tests/mock-supabase.js, and walks every role through its main flows.
   Fails on any uncaught page error or console error. */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { scenarios } = require('./fixtures');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain' };

const PROD_HEADERS = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')).headers[0].headers.filter(h => h.key !== 'Strict-Transport-Security').map(h => [h.key, h.key === 'Content-Security-Policy' ? h.value.replace('; upgrade-insecure-requests', '') : h.value]));
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  if (p === '/vendor/supabase-2.45.4.js') p = '/tests/mock-supabase.js';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  /* the same security headers as production (vercel.json), so a CSP violation fails the tests */
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', ...PROD_HEADERS });
  fs.createReadStream(f).pipe(res);
});

let failures = 0, passes = 0;
const ok = (cond, name) => { if (cond) { passes++; console.log('  ✓', name); } else { failures++; console.log('  ✗', name); } };

async function open(browser, key, opt = {}) {
  const sc = scenarios[key];
  const ctx = await browser.newContext({ viewport: opt.viewport || { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: opt.dark ? 'dark' : 'light', serviceWorkers: 'block' });
  ctx.setDefaultTimeout(8000);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('console', m => { if (/Content Security Policy|Refused to/i.test(m.text())) errors.push('CSP: ' + m.text()); });
  await page.addInitScript(([mock, onboard, a11y, personal]) => {
    window.__MOCK = mock;
    try { sessionStorage.setItem('mca-splash', '1'); } catch (e) {}
    if (!personal && !localStorage.getItem('mca-personal-v1')) localStorage.setItem('mca-personal-v1', 'test');
    if (onboard && !localStorage.getItem('mca-onboard')) localStorage.setItem('mca-onboard', JSON.stringify(onboard));
    if (a11y) localStorage.setItem('chama:a11y', JSON.stringify(a11y));
  }, [opt.mock || sc.mock, sc.onboard, opt.a11y || null, !!opt.personal]);
  await page.goto(`http://127.0.0.1:${server.address().port}${sc.url || '/'}`);
  await page.waitForTimeout(opt.wait || 500);
  return { page, ctx, errors };
}
async function shot(page, name) { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: !!process.env.FULL }); } }
const text = page => page.evaluate(() => document.getElementById('view').innerText);
const calls = page => page.evaluate(() => window.__CALLS);

const TESTS = {
  async firstRun(b) {
    const { page, ctx, errors } = await open(b, 'firstRun');
    await shot(page, '01-language');
    ok(await page.isVisible('.lg-opt'), 'language screen shows options');
    await page.click('[data-ob="lg-open"]'); await page.waitForTimeout(400);
    await page.fill('#lgSearch', 'swa'); await page.waitForTimeout(100);
    ok((await page.locator('#lgAll .lg-opt').count()) >= 1, 'language search filters (was broken: OB not in scope)');
    await page.click('.lg-sheet [data-ob="lg-close"]'); await page.waitForTimeout(300);
    await page.click('[data-ob="lg-next"]'); await page.waitForTimeout(200);
    await shot(page, '02-tour');
    ok((await page.locator('.ob-slide').count()) === 3, 'tour has three slides');
    await page.click('[data-ob="next"]'); await page.click('[data-ob="next"]'); await page.click('[data-ob="next"]'); await page.waitForTimeout(200);
    await shot(page, '04-start');
    ok(await page.isVisible('[data-act="gateGoogle"]'), 'after the tour the start screen opens directly (no checkbox page)');
    ok(await page.isVisible('.legal-mini a[href="legal/terms.html"]') && await page.isVisible('.legal-mini a[href="legal/privacy.html"]'), 'by-continuing line links the Terms and the Policy');
    let st = await page.evaluate(() => JSON.parse(localStorage.getItem('mca-onboard')));
    ok(!st.agreedAt, 'nothing is recorded before the person continues');
    await page.click('[data-gm="in"]'); await page.waitForTimeout(200);
    st = await page.evaluate(() => JSON.parse(localStorage.getItem('mca-onboard')));
    ok(st.policy === '2026-11-19-v4' && !!st.agreedAt && st.method === 'continue:sign-in' && 'tz' in st, 'continuing records version, time, method and time zone');
    ok(await page.evaluate(() => localStorage.getItem('mca-sfx') !== 'on' && !__M_src_ui_toast_js.Sfx.enabled), 'sounds are off by default');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async signIn(b) {
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { loginUser: { id: 'u1', email: 'wanjiku@example.com', identities: [], app_metadata: {}, user_metadata: {} }, workspaces: [{ chama_id: 'umoja', chama_name: 'Umoja Savings', role: 'treasurer' }], chamas: { umoja: { data: require('./fixtures').chama(), version: 1 } }, roles: { umoja: { role: 'treasurer', member_id: 'm1' } } } });
    await page.click('[data-gm="in"]'); await page.waitForTimeout(150);
    await shot(page, '05-signin');
    await page.fill('#gateId', 'wanjiku'); await page.fill('#gatePw', 'Wrong#1');
    await page.press('#gatePw', 'Enter'); await page.waitForTimeout(400);
    ok(/not right/i.test(await page.textContent('#signErr')), 'Enter on password submits and shows the wrong-password message (was broken)');
    await page.fill('#gatePw', 'Right#123'); await page.click('[data-act="gateSignIn"]');
    await page.waitForTimeout(1500);
    ok(/Cash on hand/i.test(await text(page)), 'password sign-in opens the Chama');
    ok((await calls(page)).some(c => c.kind === 'fn' && c.name === 'auth-login'), 'sign-in goes through the throttled auth-login function');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async signUpOtp(b) {
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { otpOk: '12345678', account: { has_profile: false, has_password: false, needs_username: true }, workspaces: [] } });
    await page.click('[data-gm="up"]'); await page.waitForTimeout(150);
    await shot(page, '06-signup');
    await page.click('[data-act="gateSend"]'); await page.waitForTimeout(100);
    ok(/Enter your email/i.test(await page.textContent('#upErr')), 'empty email shows inline error');
    await page.fill('#gateEmail', 'fresh@example.com'); await page.click('[data-act="gateSend"]');
    await page.waitForTimeout(1300);
    await shot(page, '07-code');
    ok((await page.locator('.otp-cell').count()) === 8, 'eight code cells');
    await page.locator('#otpIn').pressSequentially('11112222', { delay: 20 }); await page.waitForTimeout(1500);
    ok(/not right/i.test(await page.textContent('#otpMsg')), 'wrong code explains and clears');
    ok((await page.inputValue('#otpIn')) === '', 'wrong code empties the boxes');
    await page.locator('#otpIn').pressSequentially('12345678', { delay: 20 }); await page.waitForTimeout(600);
    await shot(page, '08-code-ok');
    await page.waitForTimeout(1600);
    ok(await page.isVisible('#setName'), 'correct code leads to finish-your-account');
    await shot(page, '09-setup');
    await page.fill('#setName', 'Fresh Person'); await page.fill('#setUser', 'fresh'); await page.fill('#gatePw', 'Strong#1');
    ok((await page.locator('#pwRules li.ok').count()) === 4 && !(await page.locator('#gatePw2').count()), 'one password box, all rules tick');
    await page.click('[data-act="gateSetup"]'); await page.waitForTimeout(1200);
    ok(/Welcome/i.test(await text(page)), 'new account without a Chama sees the welcome hub');
    await shot(page, '10-welcome-hub');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async treasurer(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1200 });
    const t = await text(page);
    await shot(page, '11-home-treasurer');
    ok(/Cash on hand/i.test(t) && /This month/i.test(t), 'home shows hero and this month');
    ok((await page.locator('#view > .list, #view > .hero, #view > .stats, #view > section').count()) <= 12, 'home stays focused');
    ok(!(await page.locator('.otp, .welcome').count()), 'no leftover overlay');
    await page.click('#nav a[data-k="grid"]'); await page.waitForTimeout(500);
    await shot(page, '12-contributions');
    const due = page.locator('button.st.due, button.st.late').first();
    await due.click(); await page.waitForTimeout(500);
    await shot(page, '13-record-payment');
    await page.fill('#modalRoot input[name="code"]', 'QWE123RTY9');
    await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(900);
    const c = await calls(page);
    ok(c.some(x => x.kind === 'rpc' && x.name === 'record_payment' && /^[0-9a-f-]{36}$/.test(x.args.p_idem)), 'payment goes to record_payment with a request key (was broken: savePayments undefined)');
    ok(c.some(x => x.kind === 'from' && x.op === 'update'), 'Chama document saved with version check');
    ok(/QWE123RTY9/.test(await text(page)), 'recorded payment appears in the list');
    // duplicate code is refused locally
    await page.locator('button.st.due, button.st.late, button.st.partial').first().click(); await page.waitForTimeout(400);
    await page.fill('#modalRoot input[name="code"]', 'qwe123rty9'); await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(400);
    ok(await page.isVisible('#popRoot .pop'), 'a repeated M-Pesa code is refused');
    await page.click('#popRoot .pop-btn'); await page.waitForTimeout(300); await page.click('#modalRoot [data-act="closeModal"] >> nth=-1'); await page.waitForTimeout(200);
    await page.goto(page.url().split('#')[0] + '#/loans'); await page.waitForTimeout(400);
    await shot(page, '14-loans');
    await page.click('[data-act="loanMenu"] >> nth=0'); await page.waitForTimeout(400);
    await shot(page, '15-loan-sheet');
    await page.click('#modalRoot [data-act="repay"]'); await page.waitForTimeout(400);
    await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(400);
    ok(/Repayment saved/.test(await page.textContent('#toast')), 'loan repayment recorded');
    await page.goto(page.url().split('#')[0] + '#/members'); await page.waitForTimeout(400);
    await shot(page, '16-members');
    ok(/Not on the member list/i.test(await text(page)), 'treasurer sees people who are not on the member list');
    await page.click('[data-act="memberMenu"] >> nth=1'); await page.waitForTimeout(400);
    await shot(page, '17-member-sheet');
    await page.click('#modalRoot [data-act="moveMember"]'); await page.waitForTimeout(400);
    ok(await page.locator('#modalRoot .mv-row').count() >= 2, 'payout turn picker lists every turn with its month');
    await page.click('#modalRoot [data-act="movePick"][data-to="0"]'); await page.waitForTimeout(300);
    await page.click('#popRoot .pop-btn.pri'); await page.waitForTimeout(400);
    const order = await page.evaluate(() => [...document.querySelectorAll('[data-act="memberMenu"] .li-main b')].slice(0, 2).map(x => x.textContent));
    ok(/Otieno/.test(order[0]), 'choosing turn 1 moves them to the front of the payout order');
    await page.click('#nav a[data-k="profile"]'); await page.waitForTimeout(400);
    await shot(page, '18-profile');
    await page.click('[data-act="meEdit"][data-f="phone"]'); await page.waitForTimeout(350);
    await page.fill('#edV', '12345'); await page.click('[data-act="meSave"]'); await page.waitForTimeout(300);
    ok(await page.isVisible('#popRoot .pop'), 'bad phone number is refused');
    await page.click('#popRoot .pop-btn'); await page.waitForTimeout(250);
    await page.fill('#edV', '0712 345 678'); await page.click('[data-act="meSave"]'); await page.waitForTimeout(400);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'save_my_details' && x.args.p_phone === '0712345678'), 'one field edits in a sheet and saves');
    await page.goto(page.url().split('#')[0] + '#/settings'); await page.waitForTimeout(500);
    await shot(page, '19-settings');
    await page.goto(page.url().split('#')[0] + '#/settings/actions'); await page.waitForTimeout(500);
    await shot(page, '20-access');
    ok(/People and access/.test(await text(page)) && /grace@example.com/.test(await text(page)), 'people and access lists invitations');
    await page.click('[data-act="inviteSheet"][data-v="email"]'); await page.waitForTimeout(400);
    await shot(page, '20b-invite-email');
    await page.click('.rp[data-v="secretary"]'); await page.waitForTimeout(100);
    await page.fill('#invEmail2', 'baraka@example.com'); await page.click('[data-act="invGo"]'); await page.waitForTimeout(500);
    ok((await calls(page)).some(x => x.kind === 'fn' && x.name === 'send-invitation' && x.body.email === 'baraka@example.com' && x.body.role === 'secretary' && x.body.member_id === 'new'), 'email invite sent with role and a new member-list entry');
    ok(/Invitation sent/.test(await page.textContent('#modalRoot')), 'email invite shows a clear result');
    await page.click('[data-act="invAgain"]'); await page.click('[data-act="invTab"][data-v="code"]'); await page.waitForTimeout(150);
    await page.click('[data-act="invUses"][data-v="1"]'); await page.click('[data-act="invGo"]'); await page.waitForTimeout(500);
    await shot(page, '20c-invite-code');
    ok(/ABCD-EFGH-JK/.test(await page.textContent('#modalRoot')), 'invite code shown on a ticket');
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'create_invite_code' && x.args.p_max_uses === 2), 'code created with the chosen uses');
    await page.click('#modalRoot [data-act="sheetClose"] >> nth=0'); await page.waitForTimeout(300);
    await page.click('[data-act="personOpen"] >> nth=1'); await page.waitForTimeout(350);
    await shot(page, '20d-person');
    ok(await page.isVisible('#modalRoot .rolepick'), 'tapping a person opens their role and member-list sheet');
    await page.click('#modalRoot [data-act="sheetClose"]'); await page.waitForTimeout(300);
    for (const r of ['fines', 'expenses', 'history', 'reports', 'notifications', 'settings/app', 'settings/chama', 'settings/privacy', 'settings/about', 'settings/help', 'notifications/settings', 'legal/terms', 'legal/privacy']) {
      await page.goto(page.url().split('#')[0] + '#/' + r); await page.waitForTimeout(r.startsWith('legal') ? 900 : 350);
      const v = await text(page);
      ok(v.length > 40 && !/could not open/i.test(v), 'page renders: ' + r);
      await shot(page, '21-' + r.replace(/\//g, '-'));
    }
    ok(/Who we are|Data controller/i.test(await text(page)), 'in-app privacy policy loads from legal/privacy.html');
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(300);
    await page.click('#menuBtn'); await page.waitForTimeout(600);
    await shot(page, '22-menu');
    ok(await page.isVisible('.mn-row'), 'menu opens');
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async member(b) {
    const { page, ctx, errors } = await open(b, 'member', { wait: 1200 });
    const t = await text(page);
    await shot(page, '30-home-member');
    ok(/Your /i.test(t) && !/Cash on hand/i.test(t), 'member hero is about their own month');
    ok(!(await page.locator('[data-act="quickPay"]').count()), 'member has no treasurer quick actions');
    ok(!/Otieno|Achieng/.test(t), 'member home shows no other member’s money');
    await page.click('#nav a[data-k="grid"]'); await page.waitForTimeout(400);
    await shot(page, '31-contrib-member');
    ok((await page.locator('#view [data-act="pay"]').count()) === 0, 'member cannot record payments');
    await page.click('#nav a[data-k="members"]'); await page.waitForTimeout(400);
    const mt = await text(page);
    ok(!/Saved KES/.test(mt.replace(/You · saved KES[\d,]+/, '')), 'member list hides others’ savings');
    await page.goto(page.url().split('#')[0] + '#/history'); await page.waitForTimeout(300);
    ok(/Kept by the treasurer/.test(await text(page)), 'history is treasurer-only');
    await page.goto(page.url().split('#')[0] + '#/settings/actions'); await page.waitForTimeout(300);
    ok(/My access/.test(await text(page)) && !(await page.locator('#invEmail').count()), 'member sees own access, no invite form');
    // admin-only action is refused even if called directly
    await page.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'addLoan'; document.body.appendChild(b); b.click(); });
    await page.waitForTimeout(300);
    ok(await page.isVisible('#popRoot .pop'), 'treasurer-only action refused for a member');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async chooser(b) {
    const { page, ctx, errors } = await open(b, 'multi', { wait: 1200 });
    await shot(page, '40-chooser');
    ok((await page.locator('.pk-choice').count()) === 2, 'chooser lists both Chamas');
    await page.click('.pk-choice >> nth=1'); await page.waitForTimeout(100);
    ok(/Tumaini/.test(await page.textContent('[data-act="pkOpen"]')), 'open button names the chosen Chama');
    await page.click('[data-act="wsSub"][data-s="join"]'); await page.waitForTimeout(300);
    await shot(page, '41-join');
    await page.locator('#joinLink').pressSequentially('abcdefghjk', { delay: 10 });
    ok((await page.inputValue('#joinLink')) === 'ABCD-EFGH-JK', 'the code formats itself as it is typed');
    await page.click('[data-act="wsJoin"]'); await page.waitForTimeout(500);
    await shot(page, '41b-join-preview');
    const pv = await page.textContent('#view');
    ok(/Umoja Savings/.test(pv) && /Ask to join/.test(pv) && /Secretary/.test(pv) && /Wanjiku Kamau/.test(pv), 'a valid code replaces the form with the Chama preview (name, role, treasurer)');
    ok(!(await page.locator('#jmRoot *').count()) && !(await page.locator('#joinLink').count()), 'nothing covers the preview');
    await page.click('[data-act="jnRequest"]'); await page.waitForTimeout(500);
    await shot(page, '41c-join-sent');
    ok(/Request sent/.test(await page.textContent('#view')), 'asking to join shows the request-sent screen');
    await page.click('[data-act="jnFinish"]'); await page.waitForTimeout(400);
    ok(/Waiting for approval/.test(await page.textContent('#view')), 'the pending request is listed on the hub');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async approvals(b) {
    const rq = [{ id: 'r1', email: 'baraka@example.com', name: 'Baraka Mutua', username: 'baraka', phone: '0711000000', photo: null, role: 'member', requested_member_id: null, requested_at: new Date(Date.now() - 600000).toISOString() }];
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1600, mock: { ...scenarios.treasurer.mock, requests: rq } });
    await shot(page, '60-approval');
    ok(await page.isVisible('#modalRoot .veil.locked'), 'a join request opens a sheet the treasurer must answer');
    await page.keyboard.press('Escape'); await page.mouse.click(5, 5); await page.waitForTimeout(300);
    ok(await page.isVisible('#modalRoot .veil.locked'), 'Escape and the backdrop do not dismiss it');
    await page.click('#modalRoot .rp[data-v="secretary"]'); await page.waitForTimeout(150);
    await page.click('#modalRoot [data-act="rqApprove"]'); await page.waitForTimeout(500);
    const c = (await calls(page)).find(x => x.kind === 'rpc' && x.name === 'decide_join_request');
    ok(c && c.args.p_approve === true && c.args.p_role === 'secretary' && c.args.p_record === 'new' && c.args.p_name === 'Baraka Mutua', 'approval sends role, a new member-list entry and the name');
    ok(!(await page.locator('#modalRoot .veil').count()), 'the sheet closes when nothing is left');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async chat(b) {
    const msgs = [
      { id: '33333333-3333-4333-8333-333333333331', chama_id: 'umoja', sender: '11111111-1111-4111-8111-111111111111', sender_name: 'Otieno Odhiambo', sender_role: 'secretary', recipient: null, kind: 'meeting', body: '', meta: { title: 'Monthly meeting', when: new Date(Date.now() + 3 * 864e5).toISOString(), place: 'Community hall', agenda: 'Contributions\nLoans' }, pinned: false, created_at: new Date(Date.now() - 3600e3).toISOString() },
      { id: '33333333-3333-4333-8333-333333333332', chama_id: 'umoja', sender: '11111111-1111-4111-8111-111111111111', sender_name: 'Otieno Odhiambo', sender_role: 'secretary', recipient: null, kind: 'poll', body: 'Raise the contribution to 2,500?', meta: { options: ['Yes', 'No'] }, pinned: false, created_at: new Date(Date.now() - 1800e3).toISOString() },
      { id: '33333333-3333-4333-8333-333333333333', chama_id: 'umoja', sender: '22222222-2222-4222-8222-222222222222', sender_name: 'Faith Mwende', sender_role: 'member', recipient: null, kind: 'text', body: 'Good morning everyone', meta: {}, pinned: false, created_at: new Date(Date.now() - 600e3).toISOString() }];
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, mock: { ...scenarios.treasurer.mock, messages: msgs } });
    ok(await page.isVisible('#nav a[data-k="chat"]'), 'Chat is in the tab bar');
    await page.waitForTimeout(400);
    ok(/Next meeting/i.test(await text(page)), 'Home shows the next meeting');
    await page.click('#nav a[data-k="chat"]'); await page.waitForTimeout(500);
    await shot(page, '61-chat-inbox');
    ok(/Good morning everyone/.test(await text(page)), 'inbox shows the group conversation with its last message');
    await page.click('a.ch-row[href="#/chat/group"]'); await page.waitForTimeout(600);
    await shot(page, '62-chat-group');
    ok(await page.isVisible('.cc-meet') && await page.isVisible('.cc-poll'), 'meeting and vote cards render in the conversation');
    await page.click('.cc-poll .po >> nth=0'); await page.waitForTimeout(300);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'respond_chama_message' && x.args.p_choice === '0'), 'voting sends the choice');
    await page.fill('#chatIn', 'Hello from the treasurer'); await page.click('.cp-send'); await page.waitForTimeout(500);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'send_chama_message' && x.args.p_kind === 'text' && x.args.p_recipient === null), 'a group message is sent');
    ok(/Hello from the treasurer/.test(await text(page)), 'the sent message appears');
    await page.click('.cp-tools'); await page.waitForTimeout(350);
    await shot(page, '63-chat-tools');
    const tools = await page.locator('#modalRoot .tool').count();
    ok(tools >= 4, 'treasurer sees role tools (' + tools + ')');
    await page.click('#modalRoot .tool[data-k="payment_request"]'); await page.waitForTimeout(350);
    await shot(page, '64-chat-payreq');
    await page.click('#modalRoot [data-act="chatSubmit"]'); await page.waitForTimeout(500);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'send_chama_message' && x.args.p_kind === 'payment_request' && x.args.p_meta.amount > 0), 'a payment request is sent');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    const m = await open(b, 'member', { wait: 1400, mock: { ...scenarios.member.mock, messages: msgs } });
    await m.page.goto(m.page.url().split('#')[0] + '#/chat/group'); await m.page.waitForTimeout(600);
    ok(!(await m.page.locator('.cp-tools').count()), 'a member has no officer tools');
    ok(!m.errors.length, 'no page errors ' + m.errors.join(' | '));
    await m.ctx.close();
  },
  async smart(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400 });
    const t = await text(page);
    ok(/Needs you today/i.test(t) && /behind for/i.test(t), 'Home lists what needs the treasurer today');
    ok(/Insights/.test(t), 'Home links to insights');
    await page.goto(page.url().split('#')[0] + '#/insights'); await page.waitForTimeout(500);
    await shot(page, '70-insights');
    const it = await text(page);
    ok(/Cash forecast/i.test(it) && /Suggested loan limits/i.test(it), 'insights shows forecast and loan limits');
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(300);
    await page.keyboard.press('/'); await page.waitForTimeout(250);
    ok(await page.isVisible('.gd'), 'slash opens the Guide');
    await page.fill('#gdQ', 'who has not paid'); await page.waitForTimeout(200);
    ok(/owe|paid up/i.test(await page.textContent('.gd-body')) && await page.isVisible('.gd-ans'), 'the Guide answers who has not paid from the records');
    await page.fill('#gdQ', 'how do I record a payment'); await page.waitForTimeout(200);
    ok(await page.isVisible('[data-gd="tour"][data-id="pay"]'), 'how-to questions offer a step-by-step tour');
    await page.click('[data-gd="tour"][data-id="pay"]'); await page.waitForTimeout(1200);
    ok(await page.isVisible('#tourRoot .tr-hole') && /status button/i.test(await page.textContent('#tourRoot .tr-card')), 'the tour spotlights the real button on the payments page');
    await page.click('[data-act="pay"] >> nth=0', { force: true }); await page.waitForTimeout(1200);
    ok(/how much they paid/i.test(await page.textContent('#tourRoot .tr-card')), 'tapping the highlighted button moves the tour to the next step');
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    ok(!(await page.locator('#tourRoot .tr-card').count()), 'Escape ends the tour');
    await page.click('#modalRoot [data-act="closeModal"] >> nth=0').catch(() => {}); await page.waitForTimeout(300);
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(300);
    await page.keyboard.press('/'); await page.waitForTimeout(250);
    await page.keyboard.type('SJK100'); await page.waitForTimeout(200);
    ok((await page.locator('.gd-item').count()) > 0 && /SJK100/.test(await page.textContent('.gd-body')), 'the Guide finds payments by M-Pesa code');
    await page.fill('#gdQ', 'Otieno'); await page.waitForTimeout(200);
    ok(/Otieno/.test(await page.textContent('.gd-body')), 'the Guide finds a member by name');
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    await shot(page, '71-home-smart');
    await page.click('[data-act="moneyToggle"] >> nth=0'); await page.waitForTimeout(200);
    ok(await page.evaluate(() => document.documentElement.classList.contains('hide-money')), 'amounts can be hidden');
    await page.click('[data-act="moneyToggle"] >> nth=0'); await page.waitForTimeout(200);
    await page.goto(page.url().split('#')[0] + '#/register'); await page.waitForTimeout(500);
    ok(/Otieno Odhiambo/.test(await text(page)) && /0722000000/.test(await text(page)), 'officers see the member register with contacts');
    await page.goto(page.url().split('#')[0] + '#/settings'); await page.waitForTimeout(300);
    await page.click('[data-act="lockSetup"]'); await page.waitForTimeout(300);
    await page.fill('#lk1', '2580'); await page.fill('#lk2', '2580'); await page.click('[data-act="lockSave"]'); await page.waitForTimeout(400);
    ok(await page.evaluate(() => !!JSON.parse(localStorage.getItem('mca-lock') || 'null')), 'app lock is set with a hashed PIN');
    await page.evaluate(() => __M_src_features_smart_js.Lock.show()); await page.waitForTimeout(200);
    await shot(page, '72-lock');
    for (const k of '2580') { await page.click(`[data-lk="${k}"]`); }
    await page.waitForTimeout(400);
    ok(!(await page.locator('#lockRoot .lock').count()), 'the right PIN unlocks');
    await page.click('[data-act="feedback"]'); await page.waitForTimeout(300);
    await page.click('[data-act="fbStar"][data-v="5"]'); await page.click('[data-act="fbSend"]'); await page.waitForTimeout(400);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'submit_feedback' && x.args.p_rating === 5), 'feedback is sent');
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(300);
    await page.click('[data-act="addLoan"]'); await page.waitForTimeout(400);
    await page.selectOption('#modalRoot select[name="memberId"]', 'm2'); await page.fill('#modalRoot input[name="principal"]', '50000'); await page.waitForTimeout(200);
    ok(/Suggested limit/.test(await page.textContent('#loanAdvice')) && /above the suggested limit/.test(await page.textContent('#loanAdvice')), 'the loan form advises a limit');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async inviteRouting(b) {
    /* the invitation goes straight to sign-in when the invited email has an account */
    let o = await open(b, 'invite', { mock: { ...require('./fixtures').scenarios.invite.mock, invitationAccount: { ok: true, email: 'faith@example.com', has_account: true } } });
    await o.page.click('[data-act="inviteContinue"]'); await o.page.waitForTimeout(500);
    ok(await o.page.isVisible('#gatePw') && (await o.page.inputValue('#gateId')) === 'faith@example.com', 'invitation with an account goes straight to sign-in with the email filled in');
    ok(!o.errors.length, 'no page errors ' + o.errors.join(' | ')); await o.ctx.close();
    /* and straight to the code when there is no account yet */
    o = await open(b, 'invite', { mock: { ...require('./fixtures').scenarios.invite.mock, invitationAccount: { ok: true, email: 'new@example.com', has_account: false } } });
    await o.page.click('[data-act="inviteContinue"]'); await o.page.waitForTimeout(1500);
    ok((await calls(o.page)).some(x => x.kind === 'otp' && x.email === 'new@example.com'), 'invitation without an account sends the code to the invited email at once');
    ok(!o.errors.length, 'no page errors ' + o.errors.join(' | ')); await o.ctx.close();
  },
  async usernameCheck(b) {
    const { page, ctx, errors } = await open(b, 'setup');
    if (!(await page.locator('#setUser').count())) { ok(false, 'setup screen shows the username box'); await ctx.close(); return; }
    await page.fill('#setName', 'Faith Mwangi'); await page.waitForTimeout(900);
    ok((await page.locator('.u-chip').count()) >= 2, 'usernames are suggested from the name');
    await page.fill('#setUser', 'taken1'); await page.waitForTimeout(700);
    ok(/already has/i.test(await page.textContent('#userSt')), 'a taken username is flagged as you type');
    await page.click('.u-chip >> nth=0'); await page.waitForTimeout(600);
    ok(await page.locator('#userSt.ok').count() === 1, 'picking a suggestion shows the green tick');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async awareness(b) {
    const { page, ctx, errors } = await open(b, 'member', { mock: { ...require('./fixtures').scenarios.member.mock, unaware: true }, wait: 1800 });
    ok(await page.isVisible('#awRoot .aw'), 'a member who has not been through it sees the Know your Chama walkthrough');
    ok(!(await page.locator('#awRoot [data-aw="skip"]').count()), 'the walkthrough cannot be skipped');
    for (let i = 0; i < 6; i++) { await page.click('#awRoot [data-aw="next"]'); await page.waitForTimeout(120); }
    await shot(page, '90-aware-agree');
    ok(await page.isDisabled('#awRoot [data-aw="agree"]'), 'entering needs the agreement ticked');
    await page.check('#awAgree'); await page.click('#awRoot [data-aw="agree"]'); await page.waitForTimeout(400);
    ok(!(await page.locator('#awRoot .aw').count()) && (await calls(page)).some(x => x.kind === 'rpc' && x.name === 'record_awareness'), 'agreeing lets them in and is recorded on the server');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async makeItYours(b) {
    const { page, ctx, errors } = await open(b, 'none', { personal: true, wait: 900 });
    ok(await page.evaluate(() => document.documentElement.dataset.mode) === 'dark', 'the app is dark by default');
    ok(await page.isVisible('.pz'), 'a new person without a Chama is asked to make the app theirs first');
    await page.click('[data-pz="theme"][data-v="light"]'); await page.click('[data-pz="accent"][data-v="purple"]'); await page.waitForTimeout(150);
    ok(await page.evaluate(() => document.documentElement.dataset.mode === 'light' && document.documentElement.dataset.accent === 'purple'), 'choices apply at once');
    await shot(page, '91-make-it-yours');
    await page.click('[data-pz="done"]'); await page.waitForTimeout(300);
    ok(!(await page.locator('.pz').count()), 'Continue goes on to create or join a Chama');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async leftAndLive(b) {
    const data = require('./fixtures').chama(); data.members[7].left = data.members[0].joined;   // Baraka left in the first month
    const notes = [{ id: 'n-old', kind: 'join_approved', title: 'Welcome to Umoja Savings', body: '', link: '#/home', priority: 'important', created_at: new Date().toISOString(), read_at: null, data: {} }];
    const photo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1600, mock: { ...scenarios.treasurer.mock, chamas: { umoja: { data, version: 7 } }, notifications: notes, memberProfiles: [{ member_id: 'm2', name: 'Otieno Odhiambo', photo }] } });
    await page.waitForTimeout(3200);
    ok(await page.evaluate(() => performance.getEntriesByType('navigation').length === 1 && !sessionStorage.getItem('reloaded')), 'an old unread approval does not reload the page');
    ok(await page.isVisible('#nav'), 'still in the Chama after the old notification');
    await page.goto(page.url().split('#')[0] + '#/members'); await page.waitForTimeout(500);
    const t = await text(page);
    ok(/Left the Chama/i.test(t) && /Baraka Mutua/.test(t), 'members who left are listed apart');
    await page.goto(page.url().split('#')[0] + '#/grid'); await page.waitForTimeout(400);
    ok(!(await page.locator('button.st[data-m="m8"], button.st[aria-label^="Baraka"]').count()), 'a member who left is not asked to pay new months');
    await page.goto(page.url().split('#')[0] + '#/members'); await page.waitForTimeout(400);
    const img = page.locator('#view img.av').first();
    if (await img.count()) { await img.click(); await page.waitForTimeout(400); ok(await page.isVisible('#photoRoot .pv img'), 'tapping a photo opens it large'); await page.keyboard.press('Escape'); }
    else ok(false, 'a member photo is shown');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async deadSession(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, mock: { ...scenarios.treasurer.mock, sessionDead: true } });
    await shot(page, '65-dead-session');
    ok(/session ended/i.test(await page.textContent('#view')) && await page.isVisible('#gatePw'), 'a session the server ended goes to sign-in with a reason, not a broken app');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async create(b) {
    const { page, ctx, errors } = await open(b, 'none', { wait: 1200 });
    await shot(page, '42-no-chama');
    await page.click('[data-act="wsSub"][data-s="create"]'); await page.waitForTimeout(200);
    await shot(page, '43-create');
    await page.click('#createBtn'); await page.waitForTimeout(150);
    ok(await page.isVisible('#newChamaErr'), 'empty name shows inline error');
    await page.fill('#newChamaName', '  Jamii   Bora  '); await page.click('#createBtn'); await page.waitForTimeout(400);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'create_chama_global' && x.args.cname === 'Jamii Bora'), 'name is trimmed and the Chama is created');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async emptyChama(b) {
    const { page, ctx, errors } = await open(b, 'emptyChama', { wait: 1200 });
    await shot(page, '44-empty-home');
    ok(/Add your first members/.test(await text(page)), 'empty Chama guides the treasurer');
    await page.click('[data-act="addMember"]'); await page.waitForTimeout(400);
    await page.fill('#modalRoot input[name="name"]', 'Mama Mboga'); await page.fill('#modalRoot input[name="phone"]', '0712 345 678');
    await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(400);
    ok(/Cash on hand/i.test(await text(page)), 'after adding a member Home fills in');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async invite(b) {
    const { page, ctx, errors } = await open(b, 'invite', { wait: 900 });
    await shot(page, '45-invite');
    ok(/You’re invited/.test(await text(page)) && /Umoja Savings/.test(await text(page)), 'invitation link shows who invited and the role');
    ok(!/#invite=/.test(page.url()), 'invite token removed from the address bar');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async darkLarge(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1200, dark: true, a11y: { theme: 'auto', size: 'x', tg: 1 } });
    await shot(page, '50-home-dark-xl');
    ok(await page.evaluate(() => document.documentElement.dataset.mode === 'dark' && document.documentElement.dataset.size === 'x'), 'dark mode follows the phone; extra-large text applies');
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok(!over, 'no sideways scrolling at the largest text size');
    await page.click('#nav a[data-k="grid"]'); await page.waitForTimeout(400);
    await shot(page, '51-contrib-dark-xl');
    ok(!(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)), 'contributions fits at the largest text size');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async smallPhone(b) {
    for (const key of ['treasurer', 'signedOut']) {
      const { page, ctx, errors } = await open(b, key, { wait: 1200, viewport: { width: 320, height: 640 } });
      ok(!(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)), 'no sideways scroll at 320px: ' + key);
      await shot(page, '52-small-' + key);
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
  },
  async offline(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1200, mock: { ...scenarios.treasurer.mock, failSave: true } });
    await page.click('#nav a[data-k="members"]'); await page.waitForTimeout(300);
    await page.click('[data-act="addChooser"]'); await page.waitForTimeout(300);
    ok(/They will use the app/.test(await page.textContent('#modalRoot')) && /Only add their name/.test(await page.textContent('#modalRoot')), 'adding a member explains the two ways');
    await page.click('[data-act="addNameOnly"]'); await page.waitForTimeout(600);
    await page.fill('#modalRoot input[name="name"]', 'Offline Person'); await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(700);
    ok(await page.isVisible('#syncBar'), 'a failed save shows the offline bar (no false success)');
    ok(await page.evaluate(() => !!localStorage.getItem('chama:umoja:dirty')), 'unsent change is kept on the phone');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
};

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch();
  for (const [name, fn] of Object.entries(TESTS)) {
    if (ONLY && name !== ONLY) continue;
    console.log(name);
    try { await fn(browser); } catch (e) { failures++; console.log('  ✗ threw:', e.message.split('\n')[0]); }
  }
  await browser.close(); server.close();
  console.log(`\n${passes} passed, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})();
