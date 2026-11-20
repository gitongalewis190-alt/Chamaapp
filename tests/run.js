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
  await page.addInitScript(([mock, onboard, a11y, personal, about]) => {
    window.__MOCK = mock;
    try { sessionStorage.setItem('mca-splash', '1'); } catch (e) {}
    if (!personal && !localStorage.getItem('mca-personal-v1')) localStorage.setItem('mca-personal-v1', 'test');
    if (!about) ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u-new'].forEach(id => { if (!localStorage.getItem('mca-about-v3:' + id)) localStorage.setItem('mca-about-v3:' + id, 'done'); });
    if (onboard && !localStorage.getItem('mca-onboard')) localStorage.setItem('mca-onboard', JSON.stringify(onboard));
    if (a11y) localStorage.setItem('chama:a11y', JSON.stringify(a11y));
  }, [opt.mock || sc.mock, sc.onboard, opt.a11y || null, !!opt.personal, !!opt.about]);
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
    ok(!/Good morning everyone/.test(await text(page)) && await page.isVisible('a.ci-group'), 'inbox shows the group card without previewing message text');
    await page.click('a.ci-group[href="#/chat/group"]'); await page.waitForTimeout(600);
    await shot(page, '62-chat-group');
    ok(await page.isVisible('.cc-meet') && await page.isVisible('.cc-poll'), 'meeting and vote cards render in the conversation');
    await page.click('.cc-poll .po >> nth=0'); await page.waitForTimeout(300);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'respond_chama_message' && x.args.p_choice === '0'), 'voting sends the choice');
    await page.fill('#chatIn', 'Hello from the treasurer'); await page.click('#cpSend'); await page.waitForTimeout(500);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'send_chama_message' && x.args.p_kind === 'text' && x.args.p_recipient === null), 'a group message is sent');
    ok(/Hello from the treasurer/.test(await text(page)), 'the sent message appears');
    await page.click('[data-act="chatTools"]'); await page.waitForTimeout(350);
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
    ok(!(await m.page.locator('[data-act="chatTools"]').count()), 'a member has no officer tools');
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
    ok(await page.evaluate(() => document.documentElement.dataset.mode) === 'light', 'the app follows the phone until the person chooses (light phone here)');
    ok(await page.isVisible('.pz'), 'a new person without a Chama is asked to make the app theirs first');
    await page.click('[data-pz="theme"][data-v="light"]'); await page.click('[data-pz="accent"][data-v="purple"]'); await page.waitForTimeout(150);
    ok(await page.evaluate(() => document.documentElement.dataset.mode === 'light' && document.documentElement.dataset.accent === 'purple'), 'choices apply at once');
    await shot(page, '91-make-it-yours');
    await page.click('[data-pz="done"]'); await page.waitForTimeout(300);
    ok(!(await page.locator('.pz').count()), 'Continue goes on to create or join a Chama');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async pdfReports(b) {
    const { page, ctx, errors } = await open(b, 'treasurer');
    const r = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(), D = __M_src_lib_reports_js.Doc; return { c: D.chamaReport(s), m: D.memberStatement(s, s.members[1]) }; });
    ok(/Collections by month/.test(r.c) && /Otieno Odhiambo/.test(r.c) && /Cash on hand/.test(r.c), 'the Chama PDF report has collections, members and cash');
    ok(/Statement for Otieno Odhiambo/.test(r.m) && /Month by month/.test(r.m) && /Loans/.test(r.m), 'the member PDF statement has months, payments and loans');
    await page.goto(page.url().split('#')[0] + '#/reports'); await page.waitForTimeout(300);
    ok(await page.isVisible('[data-act="pdfChama"]'), 'Reports offers the PDF report');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async resetTyped(b) {
    /* Forgot password, then the code typed by hand on the same phone */
    const sc = require('./fixtures').scenarios.signedOut;
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { ...sc.mock, otpOk: '12345678' } });
    await page.click('[data-gm="in"]'); await page.waitForTimeout(150);
    await page.click('[data-gm="forgot"]'); await page.waitForTimeout(150);
    await page.fill('#gateEmail', 'wanjiku@example.com'); await page.click('[data-act="gateSend"]'); await page.waitForTimeout(1500);
    await page.fill('#otpIn', '12345678'); await page.waitForTimeout(3500);
    ok(/new password/i.test(await text(page)), 'forgot password, code typed: the reset screen opens, not the Chama');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async resetGoogleLinked(b) {
    /* the account also has Google linked (it signed in with Google before): a forgot-password code still opens the reset screen */
    const sc = require('./fixtures').scenarios.signedOut;
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { ...sc.mock, otpOk: '12345678', otpIdentities: [{ provider: 'email' }, { provider: 'google' }] } });
    await page.click('[data-gm="in"]'); await page.waitForTimeout(150);
    await page.click('[data-gm="forgot"]'); await page.waitForTimeout(150);
    await page.fill('#gateEmail', 'wanjiku@example.com'); await page.click('[data-act="gateSend"]'); await page.waitForTimeout(1500);
    await page.fill('#otpIn', '12345678'); await page.waitForTimeout(3500);
    ok(/new password/i.test(await text(page)), 'an account with Google linked still gets the reset screen after a forgot-password code');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async foreignLink(b) {
    /* someone else's code link, opened on a phone that never asked for it: it must not sign anyone in */
    const sc = require('./fixtures').scenarios.signedOut;
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { ...sc.mock, otpOk: '12345678' }, wait: 1200 });
    await page.goto(page.url().split('#')[0] + '#otp=12345678&e=' + encodeURIComponent('brilliance@example.com')); await page.reload(); await page.waitForTimeout(2500);
    ok(!(await calls(page)).some(x => x.kind === 'verify'), 'a code link asked for on another phone is never used to sign in');
    ok(/asked for on another phone/i.test(await text(page)) && /b•••@example\.com/.test(await text(page)), 'it says who the link is for and what to do');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async resetFromLink(b) {
    /* the email's "Fill it in for me" link opens in a fresh tab: no forgot-password flag in that tab */
    const sc = require('./fixtures').scenarios.signedOut;
    const { page, ctx, errors } = await open(b, 'signedOut', { mock: { ...sc.mock, otpOk: '12345678' }, wait: 2600 });
    await page.evaluate(() => localStorage.setItem('mca-otp-req', JSON.stringify({ 'wanjiku@example.com': Date.now() })));
    await page.goto(page.url().split('#')[0] + '#otp=12345678&e=' + encodeURIComponent('wanjiku@example.com')); await page.reload(); await page.waitForTimeout(3500);
    const t = await text(page);
    ok(/new password/i.test(t) && await page.isVisible('[data-act="gateKeepPw"]'), 'a code sign-in on an account with a password opens the reset screen, even in a new tab');
    await page.click('[data-act="gateKeepPw"]'); await page.waitForTimeout(800);
    ok(!/Choose a new password/i.test(await text(page)), 'keeping the current password goes on into the app');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async heroTiers(b) {
    const { page, ctx, errors } = await open(b, 'treasurer');
    const t = await page.evaluate(() => {
      const D = __M_src_core_domain_js.Domain, U = __M_src_core_utils_js, cur = D.now(), m = k => U.addMonths(cur, k);
      const pays = (id, from, to, amt = 1000) => { const out = []; for (let k = from; k <= to; k++) out.push({ id: id + k, memberId: id, month: m(k), amount: amt }); return out; };
      const chama = (o = {}) => ({ chama: { monthly: 1000, dueDay: 10, startMonth: m(-5), mode: 'rotation', ...o }, members: [{ id: 'a', name: 'A', joined: m(-5) }, { id: 'b', name: 'B', joined: m(-2) }, { id: 'c', name: 'C', joined: m(-5) }], payments: [], loans: [], fines: [], payouts: [], expenses: [] });
      const st = (o, id, p) => { const s = chama(o); s.payments = p; return D.tone(s, id); };
      const overdue = new Date().getDate() > 10;
      return {
        late: overdue ? st({}, 'a', []) : 'late',
        part: st({}, 'a', [...pays('a', -5, -1), { id: 'p', memberId: 'a', month: cur, amount: 500 }]),
        due: st({ dueDay: 28 }, 'b', pays('b', -2, -1)),
        paid: st({}, 'b', pays('b', -2, 0)),
        ahead: st({}, 'b', pays('b', -2, 1)),
        goldPayout: st({}, 'c', pays('c', -5, 0)),
        goldStreak: st({}, 'a', pays('a', -5, 0)),
        idle: (() => { const s = chama(); s.members[0].left = m(-1); return D.tone(s, 'a'); })()
      };
    });
    ok(t.late === 'late', 'late (red): due day passed, nothing paid');
    ok(t.part === 'part', 'part paid (amber): some paid, balance left');
    ok(t.due === 'due', 'due soon (silver): month open, due day not passed');
    ok(t.paid === 'paid', 'paid up (green)');
    ok(t.ahead === 'ahead', 'paid ahead (purple): extra covers coming months');
    ok(t.goldPayout === 'gold', 'gold: paid and it is their payout month');
    ok(t.goldStreak === 'gold', 'gold: six months on time in a row');
    ok(t.idle === 'idle', 'graphite: nothing due after leaving');
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(400);
    ok(await page.locator('#view .hero[class*="tn-"] .hero-live').count() === 1, 'the card shows its tier and a live marker');
    const first = await page.textContent('#view .hero-tick'); await page.waitForTimeout(4800);
    ok((await page.textContent('#view .hero-tick')) !== first, 'the live line moves on to the next fact by itself');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async aboutYou(b) {
    const { page, ctx, errors } = await open(b, 'member', { about: true, wait: 2400 });
    ok(/has been updated/i.test(await page.textContent('#awRoot')), 'existing members first see what has changed');
    ok(!(await page.locator('[data-ab="later"], [data-ab="skip"]').count()), 'the update cannot be put off');
    await page.click('[data-ab="next"]'); await page.waitForTimeout(150);
    ok(/your name/i.test(await page.textContent('.ab-q')), 'then the questions, one at a time, starting with the name');
    await page.click('[data-ab="next"]'); await page.waitForTimeout(150);
    await page.fill('#abPhone', '0712345678'); await page.click('[data-ab="next"]'); await page.waitForTimeout(150);
    await page.click('[data-ab="why"]'); await page.waitForTimeout(100);
    ok(/from 60/i.test(await page.textContent('.ab-whytext')), 'Why we ask explains how the age is used');
    ok(await page.isDisabled('[data-ab="next"]'), 'the birth year is needed to go on');
    await page.click('[data-ab="decade"][data-v="1950"]'); await page.click('[data-ab="year"][data-v="1952"]'); await page.click('[data-ab="notsure"]'); await page.waitForTimeout(100);
    ok(/gender/i.test(await page.textContent('.ab-q')), 'the exact month and day may be left out');
    await shot(page, '92-about-gender');
    ok(await page.isDisabled('[data-ab="next"]'), 'an answer is needed for gender ("Prefer not to say" counts)');
    await page.click('[data-ab="gender"][data-v="prefer_not"]'); await page.click('[data-ab="next"]'); await page.waitForTimeout(300);
    ok(await page.isDisabled('[data-ab="save"]') && /share your phone number/i.test(await page.textContent('.ab')), 'the last step asks to agree to share the phone number with the group');
    await page.click('[data-ab="share"]'); await page.click('[data-ab="save"]'); await page.waitForTimeout(900);
    ok((await calls(page)).some(x => x.name === 'set_phone_sharing' && x.args.p_on === true), 'agreeing turns phone sharing on');
    const h = await page.evaluate(() => ({ simple: document.documentElement.classList.contains('a-simple'), size: document.documentElement.dataset.size }));
    ok(h.simple && h.size === 'l', 'someone in their 70s gets Simple view and larger text automatically');
    ok(/We set up the app for you/.test(await page.textContent('#popRoot')), 'they are told why, with the choice to use the standard app');
    await page.click('#popRoot .pop-btn:not(.pri)'); await page.waitForTimeout(300);
    ok(await page.evaluate(() => !document.documentElement.classList.contains('a-simple') && JSON.parse(localStorage.getItem('chama:a11y')).ageMode === 'off'), '"Use the standard app" turns it off and remembers the choice');
    ok((await calls(page)).some(x => x.kind === 'rpc' && (x.name === 'set_my_details' || x.name === 'set_my_profile')), 'the answers are saved');
    ok(!errors.length, 'no page errors ' + errors.join(' | ')); await ctx.close();
  },
  async ageBands(b) {
    const { page, ctx, errors } = await open(b, 'treasurer');
    const r = await page.evaluate(() => { const A = __M_src_features_guide_js.Adapt; return [30, 44, 45, 59, 60, 74, 75, 90].map(a => A.band(a)).join(','); });
    ok(r === 'std,std,reading,reading,senior,senior,senior2,senior2', 'age bands: under 45 standard, 45+ larger text, 60+ Simple view, 75+ largest text');
    const x = await page.evaluate(() => { const A = __M_src_features_guide_js.Adapt, Y = __M_src_core_a11y_js.A11y; Y.d.ageMode = 'custom'; return A.apply(80); });
    ok(x === null, 'a person who chose their own settings is never overridden');
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
  async v019(b) {
    const msgs = [{ id: '33333333-3333-4333-8333-333333333333', chama_id: 'umoja', sender: '22222222-2222-4222-8222-222222222222', sender_name: 'Faith Mwende', sender_role: 'member', recipient: null, kind: 'text', body: 'Good morning everyone', meta: {}, pinned: false, created_at: new Date(Date.now() - 3600e3).toISOString() },
      { id: '33333333-3333-4333-8333-333333333334', chama_id: 'umoja', sender: '22222222-2222-4222-8222-222222222222', sender_name: 'Faith Mwende', sender_role: 'member', recipient: null, kind: 'image', body: '', meta: { once: true, opened_by: [], mime: 'image/gif' }, pinned: false, created_at: new Date(Date.now() - 1800e3).toISOString() },
      { id: '33333333-3333-4333-8333-333333333335', chama_id: 'umoja', sender: '22222222-2222-4222-8222-222222222222', sender_name: 'Faith Mwende', sender_role: 'member', recipient: null, kind: 'voice', body: '', meta: { path: 'umoja/22222222-2222-4222-8222-222222222222/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.wav', dur: 7, wave: [0.2, 0.8, 0.5, 1, 0.3] }, pinned: false, created_at: new Date(Date.now() - 900e3).toISOString() }];
    for (const dark of [false, true]) {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, dark, mock: { ...scenarios.treasurer.mock, messages: msgs } });
      const sfx = dark ? '-dark' : '';
      ok(await page.evaluate(() => { const h = document.querySelector('#view .hero'); return !!h && !h.previousElementSibling?.matches('.sign-card, .decl-card, .card.warn') && !document.querySelector('#view .sign-card'); }), 'nothing sits above the Home card' + sfx);
      ok(await page.isVisible('.po-rail'), 'payout order shows as a rail' + sfx);
      await shot(page, '90-home' + sfx);
      await page.click('#nav a[data-k="grid"]'); await page.waitForTimeout(600);
      ok(await page.isVisible('.cg-hero') && await page.isVisible('.cg-gauge'), 'contributions has the live group card with a gauge' + sfx);
      await shot(page, '91-contrib' + sfx);
      await page.click('#nav a[data-k="chat"]'); await page.waitForTimeout(500);
      await shot(page, '92-chat-inbox' + sfx);
      await page.evaluate(() => window.__live('typing', { th: 'group', from: '22222222-2222-4222-8222-222222222222', name: 'Faith Mwende', act: 'type' })); await page.waitForTimeout(900);
      ok(/Faith is typing/.test(await page.textContent('.ci-group')), 'the inbox shows who is typing live' + sfx);
      await page.click('#nav a[data-k="home"]'); await page.waitForTimeout(400);
      await page.evaluate(() => window.__live('typing', { th: 'group', from: '22222222-2222-4222-8222-222222222222', name: 'Faith Mwende', act: 'rec' })); await page.waitForTimeout(900);
      ok(await page.isVisible('#tyBanner.on') && /recording a voice note/.test(await page.textContent('#tyBanner')), 'a banner anywhere in the app shows someone recording' + sfx);
      await shot(page, '93-banner' + sfx);
      await page.goto(page.url().split('#')[0] + '#/chat/group'); await page.waitForTimeout(700);
      ok(await page.isVisible('#cpMic') && !(await page.isVisible('#cpSend')), 'empty composer shows the microphone' + sfx);
      ok(await page.isVisible('.vn[data-vn]') && await page.isVisible('.once-g'), 'voice note and view-once bubbles render' + sfx);
      await page.evaluate(() => window.__live('typing', { th: 'group', from: '22222222-2222-4222-8222-222222222222', name: 'Faith Mwende', act: 'type' })); await page.waitForTimeout(800);
      ok(await page.isVisible('#chTyping .ty-row'), 'typing bubble shows in the conversation' + sfx);
      await shot(page, '94-thread' + sfx);
      await page.click('.once-g[data-act="onceOpen"]'); await page.waitForTimeout(500);
      ok(await page.isVisible('.once-view'), 'view once opens full screen' + sfx);
      await page.click('.once-view .ov-x'); await page.waitForTimeout(400);
      ok(await page.isVisible('.once-g.done'), 'after closing, view once shows as opened' + sfx);
      await page.click('#m-33333333-3333-4333-8333-333333333333 .bub'); await page.waitForTimeout(400);
      await page.click('.rx-row button >> nth=1'); await page.waitForTimeout(400);
      ok((await calls(page)).some(x => x.name === 'react_chama_message' && x.args.p_emoji === '❤️') && await page.isVisible('.bub-rx'), 'reacting sends and shows the reaction' + sfx);
      await page.click('#m-33333333-3333-4333-8333-333333333333 .bub'); await page.waitForTimeout(400);
      await page.click('[data-act="msgReply"]'); await page.waitForTimeout(400);
      ok(await page.isVisible('.cp-reply'), 'reply bar appears' + sfx);
      await page.fill('#chatIn', 'Morning!'); await page.click('#cpSend'); await page.waitForTimeout(500);
      ok((await calls(page)).some(x => x.name === 'send_chama_message' && x.args.p_meta && x.args.p_meta.reply && x.args.p_meta.reply.id === '33333333-3333-4333-8333-333333333333'), 'the reply is sent with the quoted message' + sfx);
      await page.click('[data-act="chatAttach"]'); await page.waitForTimeout(400);
      await page.setInputFiles('#attPhoto', { name: 'p.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64') }); await page.waitForTimeout(800);
      ok(await page.isVisible('.ph-prev img'), 'a picked photo shows a preview with view once' + sfx);
      await page.click('[data-act="photoSend"]'); await page.waitForTimeout(900);
      const cs = await calls(page);
      ok(cs.some(x => x.kind === 'upload' && /^umoja\/u1\/.+\.jpg$/.test(x.path)) && cs.some(x => x.name === 'send_chama_message' && x.args.p_kind === 'image' && /\.jpg$/.test(x.args.p_meta.path)), 'the photo uploads to the Chama folder and posts' + sfx);
      await page.click('[data-act="chatTheme"]'); await page.waitForTimeout(400);
      await page.click('[data-act="chatThemeSet"][data-v="ocean"]'); await page.waitForTimeout(500);
      ok(await page.evaluate(() => document.querySelector('.ch-thread').dataset.ct === 'ocean') && (await calls(page)).some(x => x.name === 'set_chat_theme'), 'the group chat theme changes for everyone' + sfx);
      await shot(page, '95-thread-ocean' + sfx);
      await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(500);
      await page.keyboard.press('/'); await page.waitForTimeout(250);
      ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'gdQ'), 'the Guide opens with the keyboard ready' + sfx);
      await page.fill('#gdQ', 'monthly x 12'); await page.waitForTimeout(250);
      ok(/KES\s?[\d,]+/.test(await page.textContent('.gd-ans.calc')), 'the Guide works out sums with record values' + sfx);
      await page.fill('#gdQ', '10000 at 10% for 3 months'); await page.waitForTimeout(250);
      ok(/Pay back/.test(await page.textContent('.gd-ans')), 'the Guide works out a loan' + sfx);
      await page.fill('#gdQ', 'recrod a paymnet'); await page.waitForTimeout(250);
      ok(await page.isVisible('[data-gd="tour"][data-id="pay"]'), 'misspelt questions still find the live guide' + sfx);
      await shot(page, '96-guide' + sfx);
      await page.click('[data-gd="tour"][data-id="pay"]'); await page.waitForTimeout(1300);
      ok(await page.evaluate(() => { const c = document.querySelector('.tr-card'), h = document.querySelector('.tr-hole'); if (!c || !h) return false; const a = c.getBoundingClientRect(), r = h.getBoundingClientRect(); return a.bottom <= r.top || a.top >= r.bottom; }), 'the tour card never covers the button it points at' + sfx);
      await shot(page, '97-tour' + sfx);
      await page.keyboard.press('Escape');
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* a member with loan terms to sign gets a full-screen prompt, and the members list offers calls */
    const ch = JSON.parse(JSON.stringify(scenarios.member.mock.chamas)); ch.umoja.data.loans = [{ id: 'L9', memberId: 'm3', principal: 5000, rate: 10, months: 2, date: '2026-11-01', repayments: [] }];
    const m = await open(b, 'member', { wait: 1600, mock: { ...scenarios.member.mock, chamas: ch, phones: [{ user_id: 'x', member_id: 'm1', name: 'Wanjiku', phone: '0712345678' }] } });
    ok(await m.page.isVisible('.urgent.on') && /Sign your loan terms/.test(await m.page.textContent('.urgent')), 'loan terms to sign open full screen');
    await shot(m.page, '98-urgent');
    await m.page.click('.urgent [data-u="go"]'); await m.page.waitForTimeout(600);
    ok(/Your loan terms/.test(await m.page.textContent('#modalRoot')), 'the prompt opens the terms to sign');
    await m.page.keyboard.press('Escape'); await m.page.waitForTimeout(300);
    await m.page.goto(m.page.url().split('#')[0] + '#/members'); await m.page.waitForTimeout(800);
    ok(await m.page.isVisible('[data-act="callMember"]'), 'members who share their number can be called');
    await m.page.click('[data-act="callMember"]'); await m.page.waitForTimeout(400);
    ok(await m.page.isVisible('a.c-call[href^="tel:"]') && await m.page.isVisible('a.c-wa[href^="https://wa.me/254"]'), 'call and WhatsApp links');
    await shot(m.page, '99-call');
    ok(!m.errors.length, 'no page errors ' + m.errors.join(' | '));
    await m.ctx.close();
  },
  /* GUIDE: every live tour, for every role it is offered to, lands on the real button it talks about, and never on an
     edit / delete / remove button (a tour once opened an existing goal and replaced it). */
  async v020GuideTours(b) {
    const BAD = /edit|delete|del[A-Z]|remove|clear|revoke/i, OK_EDIT = { rules: 'chamaEdit' };
    for (const role of ['treasurer', 'secretary', 'member']) {
      const mock = JSON.parse(JSON.stringify(scenarios[role].mock)); mock.chamas.umoja.data.chama.goals = [{ id: 'gA', title: 'Land', amount: 90000, by: '' }];
      const { page, ctx, errors } = await open(b, role, { wait: 1400, mock });
      const tasks = await page.evaluate(() => __M_src_features_guide_js.Guide.tasks().filter(t => t.tour).map(t => ({ id: t.id, act: t.act || '', tour: t.tour.map(s => ({ go: s.go || '', sel: s.sel, click: !!s.click })) })));
      const bad = [];
      for (const t of tasks) {
        await page.evaluate(() => { try { __M_src_features_guide_js.Tour.end(false); } catch (e) {} document.getElementById('modalRoot').innerHTML = ''; document.body.style.overflow = ''; });
        await page.keyboard.press('Escape').catch(() => {});
        for (let i = 0; i < t.tour.length; i++) {
          const st = t.tour[i];
          if (st.go) { await page.evaluate(g => { if (location.hash !== g) location.hash = g; }, st.go); await page.waitForTimeout(700); }
          let info = null;
          for (let k = 0; k < 20 && !info; k++) {
            info = await page.evaluate(sel => { const el = [...document.querySelectorAll(sel)].find(x => x.offsetParent !== null || x.getClientRects().length); if (!el) return null;
              const r = el.getBoundingClientRect(), cs = getComputedStyle(el), a = el.closest('[data-act]');
              el.setAttribute('data-tour-hit', '1'); return { vis: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0, act: a ? a.dataset.act : '', id: el.dataset.id || '', txt: (el.innerText || el.placeholder || el.name || '').slice(0, 60) }; }, st.sel);
            if (!info) await page.waitForTimeout(150);
          }
          const tag = `${role}/${t.id}#${i + 1} ${st.sel}`;
          if (!info) { bad.push(tag + ' missing'); break; }
          if (!info.vis) bad.push(tag + ' hidden');
          const named = /\[data-act="([^"]+)"\]/.exec(st.sel);
          if (named && info.act !== named[1]) bad.push(tag + ' hits ' + info.act);
          if (BAD.test(info.act) && OK_EDIT[t.id] !== info.act) bad.push(tag + ' is an edit/delete action: ' + info.act);
          if (t.id === 'goal' && (info.id || !/goal/i.test(info.txt))) bad.push(tag + ' does not point at Add goal: ' + info.txt);
          if (st.click && i < t.tour.length - 1) { try { await page.click('[data-tour-hit="1"]', { timeout: 3000 }); } catch (e) { bad.push(tag + ' cannot be tapped'); } await page.waitForTimeout(700); }
          await page.evaluate(() => document.querySelectorAll('[data-tour-hit]').forEach(x => x.removeAttribute('data-tour-hit')));
        }
      }
      ok(tasks.length > 5 && !bad.length, `every ${role} tour (${tasks.length}) lands on its real button ` + bad.join(' | '));
      /* the real Tour finds the goal button and it is "Add another goal", not the existing goal */
      if (role === 'treasurer') {
        await page.evaluate(() => { document.getElementById('modalRoot').innerHTML = ''; location.hash = '#/settings'; }); await page.waitForTimeout(400);
        await page.evaluate(() => __M_src_features_guide_js.Tour.start('goal')); await page.waitForTimeout(1500);
        ok(await page.evaluate(() => { const T = __M_src_features_guide_js.Tour; return !!T.el && /Add another goal/.test(T.el.textContent) && !T.el.dataset.id; }), 'the goal tour points at Add another goal');
        await page.evaluate(() => __M_src_features_guide_js.Tour.end(false));
      }
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
