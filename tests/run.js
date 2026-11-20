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
  /* HOME: the treasurer's full-screen "set up your Chama" prompt counts as already seen today, unless a test asks for it */
  if (!opt.setupGuide) await page.addInitScript(() => { ['umoja', 'blank', 'tumaini'].forEach(c => { try { if (!localStorage.getItem('mca-urgent-setup:' + c)) localStorage.setItem('mca-urgent-setup:' + c, String(Date.now() + 365 * 864e5)); } catch (e) {} }); });
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
    ok(c.some(x => x.kind === 'rpc' && /^record_payment(_v2)?$/.test(x.name) && /^[0-9a-f-]{36}$/.test(x.args.p_idem)), 'payment goes to record_payment with a request key (was broken: savePayments undefined)');
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
    await page.click('[data-act="memberMenu"][data-id="m2"]'); await page.waitForTimeout(400);
    await shot(page, '17-member-sheet');
    await page.click('#modalRoot [data-act="moveMember"]'); await page.waitForTimeout(400);
    ok(await page.locator('#modalRoot .mv-row').count() >= 2, 'payout turn picker lists every turn with its month');
    await page.click('#modalRoot .mv-row:not([disabled]) >> nth=0'); await page.waitForTimeout(300);   /* 0.20.0: places are listed soonest first (one payout order) */
    await page.click('#popRoot .pop-btn.pri'); await page.waitForTimeout(400);
    const order = await page.evaluate(() => [...document.querySelectorAll('[data-act="memberMenu"] .li-main b')].slice(0, 2).map(x => x.textContent));
    ok(/Otieno/.test(order[0]), 'choosing the soonest turn moves them to the front of the payout order');
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
    await page.fill('#lk1', '2580'); await page.fill('#lk2', '2580'); await page.click('[data-act="lockSave"]');
    /* wait for the saved PIN instead of a fixed pause: hashing can take longer than 400 ms on a busy machine */
    await page.waitForFunction(() => { try { return !!(JSON.parse(localStorage.getItem('mca-lock') || 'null') || {}).hash; } catch (e) { return false; } }, null, { timeout: 5000 }).catch(() => {});
    ok(await page.evaluate(() => !!JSON.parse(localStorage.getItem('mca-lock') || 'null')), 'app lock is set with a hashed PIN');
    await page.evaluate(() => __M_src_features_smart_js.Lock.show()); await page.waitForSelector('#lockRoot .lock [data-lk="2"]', { timeout: 5000 }).catch(() => {});
    await shot(page, '72-lock');
    for (const k of '2580') { await page.click(`[data-lk="${k}"]`); }
    await page.waitForTimeout(400);
    ok(!(await page.locator('#lockRoot .lock').count()), 'the right PIN unlocks');
    await page.click('[data-act="feedback"]'); await page.waitForTimeout(300);
    await page.click('[data-act="fbStar"][data-v="5"]'); await page.click('[data-act="fbSend"]'); await page.waitForTimeout(400);
    ok((await calls(page)).some(x => x.kind === 'rpc' && x.name === 'submit_feedback' && x.args.p_rating === 5), 'feedback is sent');
    await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(300);
    await page.click('[data-act="addLoan"]'); await page.waitForTimeout(400);
    await page.click('#modalRoot .mpk-card'); await page.click('.mpk-row[data-id="m2"]'); await page.click('#mpkOk'); await page.waitForTimeout(250); await page.fill('#modalRoot input[name="principal"]', '50000'); await page.waitForTimeout(200);
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
  async v020AuthSessions(b) {
    /* AUTH 0.20: a password change signs the other phones out; coming back to the app asks the server; offline never signs out */
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1600 });
    const vis = () => page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.goto(page.url().split('#')[0] + '#/profile'); await page.waitForTimeout(400);
    await page.click('[data-act="meEdit"][data-f="password"]'); await page.waitForTimeout(400);
    await page.fill('#pwCur', 'Right#123'); await page.fill('#pwNew', 'Better#456');
    await page.click('[data-act="changePassword"]'); await page.waitForTimeout(900);
    const c = await calls(page);
    ok(c.some(x => x.kind === 'updateUser' && x.password) && c.some(x => x.kind === 'signOut' && x.scope === 'others'), 'changing the password signs out every other device (scope others)');
    ok(!c.some(x => x.kind === 'signOut' && x.scope !== 'others') && !(await page.isVisible('#gatePw')), 'this phone stays signed in after changing the password');
    await page.evaluate(() => window.__setOffline(true)); await vis(); await page.waitForTimeout(600);
    ok(!(await page.isVisible('#gatePw')) && await page.evaluate(() => __M_src_core_session_js.Session.status === 'ready'), 'no internet when coming back to the app never signs out');
    await page.evaluate(() => window.__setOffline(false));
    const n0 = await page.evaluate(() => window.__getUserN || 0);
    await page.evaluate(() => window.__revokeSession()); await vis(); await page.waitForTimeout(900);
    ok((await page.evaluate(() => window.__getUserN || 0)) > n0, 'coming back to the app asks the server (getUser), not only this phone');
    await shot(page, 'v020-auth-revoked');
    ok(/password was changed on another device/i.test(await text(page)) && await page.isVisible('#gatePw'), 'a session ended on another phone shows the reason and the sign-in screen');
    ok((await calls(page)).some(x => x.kind === 'signOut' && x.scope === 'local'), 'the dead session is cleared on this phone only');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async v020AuthEyeToast(b) {
    for (const dark of [false, true]) {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, dark });
      await page.evaluate(() => __M_src_ui_modal_js.Modal.open({ title: 'Check', fields: [{ name: 'pw', label: 'Your password', type: 'password' }], onSubmit: () => {} }));
      await page.waitForTimeout(400);
      ok(await page.isVisible('#modalRoot .pw-eye[aria-label="Show password"]'), 'a password box in a sheet gets an eye button' + (dark ? ' (dark)' : ''));
      await page.fill('#modalRoot input[name="pw"]', 'Secret#1');
      await page.click('#modalRoot .pw-eye'); await page.waitForTimeout(100);
      ok(await page.evaluate(() => { const i = document.querySelector('#modalRoot input[name="pw"]'), btn = document.querySelector('#modalRoot .pw-eye'); return i.type === 'text' && btn.getAttribute('aria-pressed') === 'true' && btn.getAttribute('aria-label') === 'Hide password'; }), 'the eye shows the password');
      await page.click('#modalRoot .pw-eye'); await page.waitForTimeout(100);
      ok(await page.evaluate(() => document.querySelector('#modalRoot input[name="pw"]').type === 'password' && !!document.querySelector('#modalRoot .sheet')), 'tapping again hides it, and the sheet stays open');
      ok(await page.evaluate(() => { const r = document.querySelector('#modalRoot .pw-eye').getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }), 'the eye is a big tap target');
      await page.evaluate(() => __M_src_ui_toast_js.toast('Saved', 'ok')); await page.waitForTimeout(500);
      await shot(page, 'v020-auth-toast-sheet' + (dark ? '-dark' : ''));
      ok(await page.evaluate(() => { const t = document.getElementById('toast').getBoundingClientRect(), s = document.querySelector('#modalRoot .sheet').getBoundingClientRect(); return document.getElementById('toast').classList.contains('t-top') && t.bottom <= s.top + 1; }), 'a toast never covers an open sheet');
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    const { page, ctx, errors } = await open(b, 'signedOut');
    await page.click('[data-gm="in"]').catch(() => {}); await page.waitForTimeout(200);
    ok(await page.isVisible('#gatePw') && (await page.locator('#gatePw ~ .eye, #gatePw ~ .pw-eye').count()) === 1, 'the sign-in password has exactly one show/hide button');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async v020AuthLinks(b) {
    /* a code link for another email, opened while someone is signed in on this phone */
    const sc = scenarios.treasurer;
    let { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, mock: { ...sc.mock, otpOk: '12345678' } });
    await page.evaluate(() => localStorage.setItem('mca-otp-req', JSON.stringify({ 'brilliance@example.com': Date.now() })));
    const link = page.url().split('#')[0] + '#otp=12345678&e=' + encodeURIComponent('brilliance@example.com');
    await page.goto(link); await page.reload(); await page.waitForTimeout(2200);
    await shot(page, 'v020-auth-link-clash');
    const pop = (await page.textContent('#popRoot').catch(() => '')) || '';
    ok(/This code is for another account/.test(pop) && /b•••@example\.com/.test(pop) && /wanjiku@example\.com/.test(pop), 'it says who the code is for and who is signed in');
    ok(!(await calls(page)).some(x => x.kind === 'verify'), 'the code is not used while the other account is signed in');
    await page.click('#popRoot .pop-btn:not(.pri)'); await page.waitForTimeout(500);
    ok(await page.evaluate(() => __M_src_core_session_js.Session.status === 'ready' && __M_src_core_session_js.Session.email === 'wanjiku@example.com'), 'Stay keeps the current account');
    await page.goto(link); await page.reload(); await page.waitForTimeout(2200);
    await page.click('#popRoot .pop-btn.pri'); await page.waitForTimeout(4500);
    const c = await calls(page);
    ok(c.some(x => x.kind === 'signOut' && x.scope === 'local') && c.some(x => x.kind === 'verify' && x.token === '12345678'), 'Switch account signs out here, then fills in the code for that email');
    ok(/new password/i.test(await text(page)), 'a code sign-in lands on "Choose a new password"');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* the same account is signed in and its forgot-password link opens: the reset screen, not Home */
    ({ page, ctx, errors } = await open(b, 'treasurer', { wait: 1400 }));
    await page.evaluate(() => { localStorage.setItem('mca-otp-req', JSON.stringify({ 'wanjiku@example.com': Date.now() })); localStorage.setItem('mca-reset', JSON.stringify({ e: 'wanjiku@example.com', t: Date.now() })); });
    await page.goto(page.url().split('#')[0] + '#otp=12345678&e=' + encodeURIComponent('wanjiku@example.com')); await page.reload(); await page.waitForTimeout(2600);
    ok(/new password/i.test(await text(page)), 'a forgot-password link for the signed-in account opens "Choose a new password"');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* Google linked, the forgot-password code finished in another tab: this tab hears a plain sign-in and must still offer the reset */
    ({ page, ctx, errors } = await open(b, 'signedOut', { mock: { ...scenarios.signedOut.mock, otpOk: '12345678', otpIdentities: [{ provider: 'email' }, { provider: 'google' }] } }));
    await page.evaluate(() => localStorage.setItem('mca-reset', JSON.stringify({ e: 'wanjiku@example.com', t: Date.now() })));
    await page.evaluate(() => __M_src_core_backend_js.Backend.sb.auth.verifyOtp({ email: 'wanjiku@example.com', token: '12345678', type: 'email' }));
    await page.waitForTimeout(2500);
    ok(/new password/i.test(await text(page)), 'a forgot-password code finished in another tab still lands on the reset screen (Google linked)');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  async v020AuthSigning(b) {
    const { page, ctx, errors } = await open(b, 'treasurer', { wait: 100 });
    const html = await page.evaluate(() => __M_src_features_auth_gate_js.Gate.signingIn('Signing you in…'));
    ok(/class="sgn"/.test(html) && /Signing you in/.test(html) && /data-act="gateCancel"/.test(html), 'the Signing you in screen has the brand mark and a Cancel');
    await page.evaluate(h => { const v = document.getElementById('view'); v.innerHTML = h; }, html); await page.waitForTimeout(300);
    await shot(page, 'v020-auth-signing');
    ok(await page.evaluate(() => { const bg = getComputedStyle(document.querySelector('.sgn')).backgroundImage; return /gradient/.test(bg); }), 'it paints with theme colours (no white flash)');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
  },
  /* PEOPLE 0.20.0: scroll softening only where a page scrolls, low-end mode, live count, one payout order, rules, removal */
  async v020People(b) {
    const clk = async (page, sel) => { try { await page.click(sel, { timeout: 3000 }); } catch (er) { console.log('    (DOM click: ' + sel + ')'); await page.evaluate(x => { const el = document.querySelector(x); if (!el) throw new Error('missing ' + x); el.click(); }, sel); } };
    const go = async (page, h, w = 700) => { await page.evaluate(x => { location.hash = x; }, h); await page.waitForTimeout(w); };
    const settle = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => { window.__rvFrame && window.__rvFrame(); r(); }))));
    const rvs = page => page.evaluate(() => [...document.querySelectorAll('#view [data-rv]')].map(e => ({ v: Number(e.style.getPropertyValue('--rv') || 1), c: e.className })));
    let { page, ctx, errors } = await open(b, 'treasurer', { wait: 1600 });
    /* 1. a page too short to scroll: nothing is softened */
    await page.setViewportSize({ width: 390, height: 1400 }); await go(page, '#/reports'); await settle(page);
    const short = await page.evaluate(() => (document.scrollingElement.scrollHeight - innerHeight) <= 40);
    let list = await rvs(page);
    ok(short && list.length > 0 && list.every(x => x.v === 1), 'a page that does not scroll: every item shows fully (--rv 1)');
    /* 2. a long page: summary tiles and the payout card are never softened; the last items reach 1 at the bottom */
    await page.setViewportSize({ width: 390, height: 844 }); await go(page, '#/home', 1000); await settle(page);
    ok(await page.evaluate(() => !document.querySelector('.stats[data-rv], .stats [data-rv], .mtile[data-rv], .hero[data-rv], .po-card[data-rv], .cg-hero[data-rv], [data-rv] .stats, [data-rv] .po-card, [data-rv] .hero')), 'tiles, hero and payout card are never blurred');
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight)); await page.waitForTimeout(200); await settle(page);
    const bottom = await page.evaluate(() => { const els = [...document.querySelectorAll('#view [data-rv]')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > innerHeight - 140 && r.top < innerHeight; }); return els.map(e => Number(e.style.getPropertyValue('--rv') || 1)); });
    ok(bottom.length > 0 && bottom.every(v => v === 1), 'at the bottom of a long page the last grids show fully (' + bottom.join(',') + ')');
    ok(await page.evaluate(() => { const e = document.querySelector('#view [data-rv]'); if (!e) return true; const op = parseFloat(getComputedStyle(e).opacity); return op >= .6; }), 'softened items never go below 60% opacity');
    await shot(page, 'v020-people-home-bottom');
    /* 3. live count: replays when coming back to Home, not on a quiet repaint */
    await go(page, '#/members', 500); await go(page, '#/home', 120);
    const mid = await page.evaluate(() => { const e = document.querySelector('#view .hero-v[data-to]'); return e ? { t: e.textContent, to: Number(e.dataset.to) } : null; });
    await page.waitForTimeout(1100);
    const end = await page.evaluate(() => { const e = document.querySelector('#view .hero-v[data-to]'); return e ? e.textContent : ''; });
    ok(mid && mid.to > 0 && Number(mid.t.replace(/\D/g, '')) < mid.to && Number(end.replace(/\D/g, '')) === mid.to, 'the Home figure counts up again when coming back to Home');
    ok(await page.evaluate(() => __M_src_ui_countup_js.CountUp.run(document.getElementById('view'), false) === 0), 'a quiet repaint with the same numbers does not count again');
    ok(await page.evaluate(() => document.querySelectorAll('#view .stats b, #view .po-amt').length > 0 && __M_src_ui_countup_js.CountUp.parse('KES 12,500').n === 12500 && !__M_src_ui_countup_js.CountUp.parse('3/8')), 'stats tiles and the payout amount are counted; fractions are left alone');
    ok(await page.evaluate(() => { document.documentElement.classList.add('a-rm'); const n = __M_src_ui_countup_js.CountUp.run(document.getElementById('view'), true); document.documentElement.classList.remove('a-rm'); return n === 0; }), 'reduced motion shows the final numbers');
    /* 4. one payout order: change a turn, then Home, rail, Members, report and summary agree */
    await go(page, '#/members', 500);
    await page.click('[data-act="memberMenu"][data-id="m4"]'); await page.waitForTimeout(400);
    await page.click('#modalRoot [data-act="moveMember"]'); await page.waitForTimeout(400);
    await page.click('#modalRoot .mv-row:not([disabled]) >> nth=1'); await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('#popRoot .pop-btn.pri').click()); await page.waitForTimeout(600);
    const truth = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(); return __M_src_core_domain_js.Domain.payoutOrder(s).map(t => t.member.name.split(' ')[0]); });
    const memOrder = await page.evaluate(() => [...document.querySelectorAll('#view .sec .list')][0] ? [...document.querySelectorAll('[data-act="memberMenu"] .li-main b')].map(x => x.childNodes[0].textContent.trim().split(' ')[0]) : []);
    ok(truth.includes('Achieng') && memOrder.slice(0, truth.length).join() === truth.join(), 'Members are listed in the one payout order (' + truth.slice(0, 4).join(', ') + ')');
    await go(page, '#/home', 900);
    const rail = await page.evaluate(() => [...document.querySelectorAll('#view .po-rail li')].map(li => (li.querySelector('small') || li).textContent.trim()));
    const head = await page.evaluate(() => { const b = document.querySelector('#view .po-card .po-main b, #view .po-card b'); return b ? b.textContent : ''; });
    ok(rail.length >= 2 && rail.every((n, i) => n === 'You' || n === truth[i]) && head.includes(truth[0]), 'Home payout card and rail follow the same order (' + rail.join(', ') + ')');
    const rep = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(), L = __M_src_lib_reports_js; return { sum: L.Reports.summary(s), doc: L.Doc.chamaReport(s) }; });
    const sumNames = ((/Payout order: (.*)/.exec(rep.sum) || [])[1] || '').split(', ').map(x => x.split(' ')[0]);
    ok(sumNames.length >= 2 && sumNames.every((n, i) => n === truth[i]), 'the WhatsApp summary lists the same order');
    const docOrder = await page.evaluate(h => { const d = new DOMParser().parseFromString(h, 'text/html'); const h2 = [...d.querySelectorAll('h2')].find(x => /Payout order/.test(x.textContent)); const t = h2 && h2.nextElementSibling; return t ? [...t.querySelectorAll('tbody tr')].map(r => r.cells[2].textContent.split(' ')[0]) : []; }, rep.doc);
    ok(docOrder.join() === truth.join(), 'the Chama report lists the same order');
    /* 5. Group rules: full page, treasurer edit + remind; in chat a pinned entry and a gentle line */
    await page.evaluate(() => __M_src_core_store_js.Store.commit(s => { s.chama.rules = '1. Contributions are due by the 10th of every month without fail, sent to the Till.\n2. A late payment is fined KES 100.\n3. Loans are repaid within three months, with interest of 10% a month.\n4. Members attend the monthly meeting or send an apology to the secretary before it starts.'; }));
    await go(page, '#/settings/rules', 600);
    let t = await text(page);
    ok(/send an apology to the secretary before it starts/.test(t) && /Be kind and respectful/.test(t) && await page.locator('#view .rl-list li').count() >= 10, 'the rules page shows every rule in full, plus chat etiquette');
    ok(await page.isVisible('[data-act="chamaEdit"][data-f="chatRules"]') && await page.isVisible('[data-act="rulesRemind"]'), 'the treasurer can edit chat etiquette and remind everyone');
    await shot(page, 'v020-people-rules');
    await page.click('[data-act="rulesRemind"]'); await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector('#popRoot .pop-btn.pri').click()); await page.waitForTimeout(1200);   /* DOM click: a long toast can push the popup off-screen (AUTH area) */
    ok(await page.evaluate(() => (window.__DB.messages || []).some(m => m.kind === 'announcement' && m.meta && m.meta.rules && /follow our group rules/.test(m.body))), 'Remind everyone posts an announcement card in the Chama chat');
    ok(/chat\/group/.test(page.url()) && await page.locator('.cc-ann .cc-rules').count() > 0, 'the card links to the full rules');
    ok(await page.isVisible('.pin-card.rules-pin') && await page.isVisible('.cp-rules'), 'the group chat has a pinned Group rules entry and a gentle reminder by the message box');
    await shot(page, 'v020-people-chat-rules');
    await page.click('[data-act="rulesSeen"]'); await page.waitForTimeout(300);
    ok(!(await page.isVisible('.cp-rules')), 'Got it hides the reminder for a week');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* member: reads the rules in full, cannot edit */
    ({ page, ctx, errors } = await open(b, 'member', { wait: 1600, dark: true }));
    await go(page, '#/settings/chama', 500);
    ok(await page.locator('[data-rules-link]').count() === 1, 'members find "Read all the group rules" in Chama settings');
    await go(page, '#/settings/rules', 500);
    t = await text(page);
    ok(/Be kind and respectful/.test(t) && !(await page.locator('[data-act="rulesRemind"], [data-act="chamaEdit"]').count()), 'members see the full rules page without edit buttons');
    await shot(page, 'v020-people-rules-member-dark');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* 6. removal: someone who signs in goes through notice; emergency removal needs the password and a reason */
    ({ page, ctx, errors } = await open(b, 'treasurer', { wait: 1600 }));
    await go(page, '#/members', 500);
    await clk(page, '[data-act="memberMenu"][data-id="m3"]'); await page.waitForTimeout(400);
    await clk(page, '#modalRoot [data-act="editMember"]'); await page.waitForTimeout(500);
    console.log('DBG', await page.evaluate(() => { try { __M_src_features_index_js.Actions.editMember.run({ id: 'm3' }); return 'ran ' + document.getElementById('modalRoot').innerText.slice(0, 80); } catch (e) { return 'ERR ' + e.stack.slice(0, 400); } }));
    await clk(page, '#modalRoot [data-act="delMember"]'); await page.waitForTimeout(600);
    ok(/Give notice first/.test((await page.textContent('#popRoot').catch(() => '')) || ''), 'removing a member who signs in asks for notice, not at once');
    await page.evaluate(() => document.querySelector('#popRoot .pop-btn.pri').click()); await page.waitForTimeout(600);
    const why = await page.evaluate(() => [...document.querySelectorAll('#modalRoot select[name="cat"] option')].map(o => o.value));
    ok(why.includes('stopped_contributing') && !why.includes('security') && !why.includes('duplicate'), 'the normal removal only offers reasons that give notice');
    await page.evaluate(() => __M_src_ui_modal_js.Modal.close()); await page.waitForTimeout(400);
    await clk(page, '[data-act="memberMenu"][data-id="m4"]'); await page.waitForTimeout(400);
    await clk(page, '#modalRoot [data-act="editMember"]'); await page.waitForTimeout(500);
    await clk(page, '#modalRoot [data-act="emergencyRemove"]'); await page.waitForTimeout(700);
    ok(await page.locator('#emPw[type="password"]').count() === 1 && /no notice/i.test(await page.textContent('.sheet')), 'Emergency removal: clear warning, a reason and the password');
    await shot(page, 'v020-people-emergency');
    await page.fill('#emWhy', 'Phone stolen on Monday'); await page.fill('#emPw', 'wrong'); await clk(page, '#emGo'); await page.waitForTimeout(600);
    ok(/not right/i.test(await page.textContent('#emErr')) && await page.isVisible('#emGo'), 'a wrong password keeps the sheet open and changes nothing');
    await page.fill('#emPw', 'correct-horse'); await clk(page, '#emGo'); await page.waitForTimeout(1500);
    const c = await calls(page);
    ok(c.some(x => x.kind === 'rpc' && x.name === 'emergency_remove_member' && x.args && x.args.p_member === 'm4' && x.args.p_password === 'correct-horse') || await page.evaluate(() => (window.__DB.messages || []).some(m => m.meta && m.meta.system === 'emergency_removal')), 'emergency_remove_member is called with the member, reason and password');
    ok(await page.evaluate(() => !(__M_src_core_store_js.Store.get().members || []).some(m => m.id === 'm4' && !m.left)), 'the member is removed at once');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* old server: NOTREADY, nothing changed */
    ({ page, ctx, errors } = await open(b, 'treasurer', { wait: 1600, mock: { ...scenarios.treasurer.mock, serverOld: true } }));
    await page.evaluate(() => __M_src_features_index_js.Actions.emergencyRemove.run({ id: 'm4' })); await page.waitForTimeout(700);
    await page.fill('#emWhy', 'Phone stolen on Monday'); await page.fill('#emPw', 'correct-horse'); await clk(page, '#emGo'); await page.waitForTimeout(800);
    ok(/Nothing was changed/.test((await page.textContent('#popRoot').catch(() => '')) || '') && await page.evaluate(() => (__M_src_core_store_js.Store.get().members || []).some(m => m.id === 'm4')), 'without the server update: "Nothing was changed", the member stays');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* low-end phone and Simple view: no blur at all */
    ({ page, ctx, errors } = await open(b, 'treasurer', { wait: 300, a11y: { simple: 1 } }));
    await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 }); });
    await page.reload(); await page.waitForTimeout(1600); await go(page, '#/members', 600); await settle(page);
    ok(await page.evaluate(() => document.documentElement.classList.contains('lowend') && [...document.querySelectorAll('[data-rv]')].every(e => getComputedStyle(e).filter === 'none') && getComputedStyle(document.querySelector('nav#nav')).backdropFilter === 'none'), 'low-end phones: no blur on items and no frosted bars');
    await shot(page, 'v020-people-simple-lowend');
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
  /* CHATDOCS: numbered PDFs into the chat, the real file picker for every role, denser reports with a footer serial */
  async v020ChatDocs(b) {
    for (const dark of [false, true]) {
      const sfx = dark ? '-dark' : '';
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, dark });
      await page.goto(page.url().split('#')[0] + '#/chat/group'); await page.waitForTimeout(800);
      await page.click('[data-act="chatAttach"]'); await page.waitForTimeout(400);
      ok(await page.isVisible('.att-d[data-act="docToChat"][data-v="chama"]') && await page.isVisible('.att-d[data-act="docToChat"][data-v="mine"]'), 'treasurer attach menu offers Chama report and My statement PDFs' + sfx);
      const acc = await page.getAttribute('#attFile', 'accept');
      ok(/application\/pdf/.test(acc) && /image\/\*/.test(acc) && /\.docx/.test(acc) && /\.xlsx/.test(acc) && /\.csv/.test(acc), 'file input accepts PDFs, photos and office files (iOS does not grey them out)' + sfx);
      ok(!(await page.getAttribute('#attFile', 'hidden') !== null), 'file input is not display:none (old iOS ignores labels for hidden inputs)' + sfx);
      const fc = await Promise.all([page.waitForEvent('filechooser', { timeout: 2500 }), page.click('label.att-b:has(#attFile)')]).then(r => r[0]).catch(() => null);
      ok(!!fc, 'tapping File opens the phone file picker straight away (treasurer)' + sfx);
      await shot(page, 'cd1-attach' + sfx);
      await page.click('.att-d[data-v="chama"]'); await page.waitForTimeout(400);
      ok(/everyone/i.test(await page.textContent('#popRoot')), 'sending the report to the group asks first' + sfx);
      await page.click('#popRoot .pop-btn.pri'); await page.waitForTimeout(1800);
      const cs = await calls(page);
      ok(cs.some(x => x.name === 'issue_serial' && x.args.p_kind === 'document' && x.args.p_member === null), 'the report gets a document serial' + sfx);
      ok(cs.some(x => x.kind === 'upload' && x.bucket === 'chat-media' && /^umoja\/u1\/.+\.pdf$/.test(x.path) && x.type === 'application/pdf' && x.size > 2000), 'the PDF uploads to chat-media like any file' + sfx);
      ok(cs.some(x => x.name === 'send_chama_message' && x.args.p_kind === 'file' && /\.pdf$/.test(x.args.p_meta.name) && /^MC-/.test(x.args.p_meta.serial) && x.args.p_meta.doc === 'report'), 'a file message is posted with the serial' + sfx);
      ok(await page.isVisible('.bub-file .bf-sn'), 'the file bubble shows the PDF and its serial' + sfx);
      await shot(page, 'cd2-thread' + sfx);
      if (!dark) {
        const r = await page.evaluate(async () => { const R = __M_src_lib_reports_js, s = __M_src_core_store_js.Store.get(); const d = await R.Doc.make('chama', s); const st = await R.Doc.make('mine', s, s.members[0]); const blob = R.Pdf.make(d.html), t = await blob.text(); const t2 = await R.Pdf.make(st.html).text();
          const bytes = new Uint8Array(await blob.arrayBuffer()); let bin = ''; bytes.forEach(c => { bin += String.fromCharCode(c); });
          return { html: d.html, st: st.html, serial: d.serial, head: t.slice(0, 8), pages: (t.match(/\/Type \/Page\b/g) || []).length, foot: (t.match(new RegExp('Serial ' + d.serial, 'g')) || []).length, eof: /%%EOF\s*$/.test(t), t2: t2.slice(0, 5), b64: btoa(bin) }; });
        ok(/<table class="grid">/.test(r.html) && /Wanjiku Kamau<\/td>(<td class="n c-[a-z]+">[^<]*<\/td>){2,}/.test(r.html), 'report HTML has the member × month grid' + sfx);
        ok(new RegExp('class="sn doc-serial">Serial ' + r.serial).test(r.html) && new RegExp('@bottom-left \\{ content: "Serial ' + r.serial).test(r.html), 'report HTML carries the footer serial on every printed page');
        ok(/Cash flow/.test(r.html) && /Next due/.test(r.html) && /Owed /.test(r.html) && /Category/.test(r.html), 'report has cash flow, loan next due, fines owed/paid and expenses by category');
        ok(/Contribution account/.test(r.st) && /owes |ahead |>0</.test(r.st), 'statement has a running-balance contribution account');
        ok(r.head.startsWith('%PDF-1.4') && r.eof && r.pages >= 2 && r.foot === r.pages + 1 && r.t2 === '%PDF-', 'a real multi-page PDF with the serial in every page footer (' + r.pages + ' pages)');
        if (SHOTS) fs.writeFileSync(path.join(SHOTS, 'cd-report.pdf'), Buffer.from(r.b64, 'base64'));
        await page.goto(page.url().split('#')[0] + '#/reports'); await page.waitForTimeout(500);
        ok(await page.isVisible('[data-act="docSendSheet"][data-v="chama"]') && await page.isVisible('[data-act="docSendSheet"][data-v="mine"]'), 'Reports offers Send to chat for both PDFs');
        await shot(page, 'cd3-reports');
        await page.click('[data-act="docSendSheet"][data-v="mine"]'); await page.waitForTimeout(600);
        ok(await page.isVisible('#modalRoot [data-act="docToChat"][data-th="group"]'), 'Send to chat lets you pick the group or a person');
        await shot(page, 'cd4-dest');
      }
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* a member: statement only, real file picker, sends privately without a question */
    const { page, ctx, errors } = await open(b, 'member', { wait: 1400 });
    await page.goto(page.url().split('#')[0] + '#/chat/group'); await page.waitForTimeout(800);
    await page.click('[data-act="chatAttach"]'); await page.waitForTimeout(400);
    ok(await page.isVisible('.att-d[data-v="mine"]') && !(await page.locator('.att-d[data-v="chama"]').count()), 'member attach menu offers only My statement');
    const fc = await Promise.all([page.waitForEvent('filechooser', { timeout: 2500 }), page.click('label.att-b:has(#attFile)')]).then(r => r[0]).catch(() => null);
    ok(!!fc, 'tapping File opens the phone file picker for a member too');
    await shot(page, 'cd5-member-attach');
    await page.click('.att-d[data-v="mine"]'); await page.waitForTimeout(400);
    await page.click('#popRoot .pop-btn.pri'); await page.waitForTimeout(1800);
    const cs = await calls(page);
    ok(cs.some(x => x.name === 'issue_serial' && x.args.p_kind === 'document' && x.args.p_member === 'm3') && cs.some(x => x.name === 'send_chama_message' && x.args.p_kind === 'file' && x.args.p_meta.doc === 'statement'), 'a member sends their numbered statement as a file');
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await ctx.close();
    /* an old server: nothing is made, the NOTREADY message shows */
    const o = await open(b, 'treasurer', { wait: 1400, mock: { ...scenarios.treasurer.mock, serverOld: true } });
    await o.page.goto(o.page.url().split('#')[0] + '#/reports'); await o.page.waitForTimeout(500);
    await o.page.click('[data-act="pdfChama"]'); await o.page.waitForTimeout(600);
    ok(/server update/i.test(await o.page.textContent('#popRoot')), 'without issue_serial on the server the report is not made (needs the server update)');
    ok(!o.errors.length, 'no page errors ' + o.errors.join(' | '));
    await o.ctx.close();
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
      /* a pretend microphone, so the voice-note tour can reach the review step */
      await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { const ac = new AudioContext(), o = ac.createOscillator(), d = ac.createMediaStreamDestination(); o.connect(d); o.start(); return d.stream; }; });
      if (await page.isVisible('.urgent [data-u="later"]')) { await page.click('.urgent [data-u="later"]'); await page.waitForTimeout(400); }
      const tasks = await page.evaluate(() => __M_src_features_guide_js.Guide.tasks().filter(t => t.tour).map(t => ({ id: t.id, act: t.act || '', tour: t.tour.map(s => ({ go: s.go || '', sel: s.sel, click: !!s.click })) })));
      const bad = [];
      for (const t of tasks) {
        await page.evaluate(() => { try { __M_src_features_guide_js.Tour.end(false); } catch (e) {} document.getElementById('modalRoot').innerHTML = ''; document.body.style.overflow = ''; const d = document.querySelector('[data-act="vrDiscard"]'); if (d) d.click(); });
        await page.keyboard.press('Escape').catch(() => {});
        await page.evaluate(id => __M_src_features_guide_js.Tour.start(id), t.id);
        /* drive the real tour: wait for it to ring each step, check what it rings, tap it like a person would */
        for (let i = 0; i < t.tour.length; i++) {
          const st = t.tour[i], tag = `${role}/${t.id}#${i + 1} ${st.sel}`;
          let info = null;
          for (let k = 0; k < 40 && !info; k++) {
            info = await page.evaluate(i => { const T = __M_src_features_guide_js.Tour; if (T.i !== i || !T.el || !document.querySelector('#tourRoot .tr-card')) return null; const el = T.el;
              const r = el.getBoundingClientRect(), cs = getComputedStyle(el), a = el.closest('[data-act]');
              el.setAttribute('data-tour-hit', '1'); return { vis: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0, act: a ? a.dataset.act : '', id: el.dataset.id || '', txt: (el.innerText || el.placeholder || el.name || '').slice(0, 60) }; }, i);
            if (!info) await page.waitForTimeout(150);
          }
          if (!info) { bad.push(tag + ' missing'); break; }
          if (!info.vis) bad.push(tag + ' hidden');
          const named = [...st.sel.matchAll(/\[data-act="([^"]+)"\]/g)].map(x => x[1]), plain = st.sel.split(' || ').some(x => !/data-act=/.test(x));
          if (named.length && !(named.includes(info.act) || plain)) bad.push(tag + ' hits ' + info.act);
          if (BAD.test(info.act) && OK_EDIT[t.id] !== info.act) bad.push(tag + ' is an edit/delete action: ' + info.act);
          if (t.id === 'goal' && i === 0 && (info.id || !/goal/i.test(info.txt))) bad.push(tag + ' does not point at Add goal: ' + info.txt);
          if (i < t.tour.length - 1) {
            if (st.click) { try { await page.click('[data-tour-hit="1"]', { timeout: 3000 }); } catch (e) { bad.push(tag + ' cannot be tapped, covered by ' + await page.evaluate(() => { const el = document.querySelector('[data-tour-hit]'), r = el.getBoundingClientRect(), o = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return o ? o.tagName + '.' + o.className : 'nothing'; })); break; } }
            else await page.click('#tourRoot [data-tr="next"]');
            await page.waitForTimeout(info.act === 'recStart' ? 1800 : 300);
          }
          await page.evaluate(() => document.querySelectorAll('[data-tour-hit]').forEach(x => x.removeAttribute('data-tour-hit')));
        }
      }
      await page.evaluate(() => __M_src_features_guide_js.Tour.end(false));
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
  /* HOME: the payout card stands apart from the live card, the Guide card is big with quick questions, and the
     treasurer's setup guide (full-screen welcome, daily reminder, turn off, a tour per step); members never see it. */
  async v020Home(b) {
    const gap = (page, a, z) => page.evaluate(([a, z]) => { const x = document.querySelector(a), y = document.querySelector(z); if (!x || !y) return -1; return Math.round(y.getBoundingClientRect().top - x.getBoundingClientRect().bottom); }, [a, z]);
    for (const dark of [false, true]) {
      const sfx = dark ? ' (dark)' : '';
      const t = await open(b, 'treasurer', { wait: 1400, dark });
      ok(await t.page.isVisible('.home-top .su2'), 'treasurer with setup left sees the setup card under the live card' + sfx);
      ok(await gap(t.page, '#view .hero', '#view .su2') >= 12 && await gap(t.page, '#view .su2', '#view .po-card') >= 12, 'cards under the live card have a clear gap (≥12px)' + sfx);
      ok(!(await t.page.isVisible('.urgent.u-setup')), 'the setup welcome stays away once seen today' + sfx);
      const h = await t.page.evaluate(() => { const c = document.querySelector('#view .hm-help'); return c ? { h: c.getBoundingClientRect().height, mark: !!c.querySelector('.hh-mark svg .gh'), chips: c.querySelectorAll('.hh-chip[data-act="guide"][data-q]').length, go: !!c.querySelector('.hh-go[data-act="guide"]') } : null; });
      ok(h && h.h >= 120 && h.mark && h.chips >= 2 && h.go, 'the Guide card is big, shows the Guide mark, quick questions and Ask the Guide' + sfx);
      ok(await t.page.evaluate(() => [...document.querySelectorAll('#view .po-rail .po-stop')].every(x => x.getBoundingClientRect().height >= 44)) && await t.page.isVisible('.po-rail li.now .po-st') && await t.page.isVisible('.po-rail li.next .po-st'), 'payout rail shows Now and Next with big tap targets' + sfx);
      await shot(t.page, 'h01-home-treasurer' + (dark ? '-dark' : ''));
      await t.page.evaluate(() => document.querySelector('#view .po-card').scrollIntoView({ block: 'center' })); await t.page.waitForTimeout(300);
      await shot(t.page, 'h02-payout' + (dark ? '-dark' : ''));
      await t.page.click('.hh-chip >> nth=0'); await t.page.waitForTimeout(400);
      ok(await t.page.isVisible('.gd-veil') && (await t.page.inputValue('#gdQ')) === 'Record a payment', 'a quick question opens the Guide with that question' + sfx);
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(200);
      /* a sent and signed payout: the signature sits in a small fixed box, Undo is a real button */
      await t.page.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 100; const x = c.getContext('2d'); x.lineWidth = 3; x.beginPath(); x.moveTo(10, 70); x.bezierCurveTo(60, 0, 120, 120, 180, 40); x.lineTo(290, 60); x.stroke();
        const S = __M_src_core_state_js.S(), D = __M_src_core_domain_js.Domain, cur = D.now(), r = D.recipient(S, cur);
        __M_src_core_store_js.Store.commit(s => { s.payouts.push({ id: 'poH', memberId: r.id, month: cur, amount: 4000, date: cur + '-20', sig: c.toDataURL('image/png') }); }); });
      await t.page.waitForTimeout(600);
      const sg = await t.page.evaluate(() => { const b = document.querySelector('#view .po-sigbox'), u = document.querySelector('#view .po-undo'), p = document.querySelector('#view .po-pill.ok'); return b && u && p ? { h: b.getBoundingClientRect().height, img: !!b.querySelector('img.po-sig'), uh: u.getBoundingClientRect().height, pill: p.textContent } : null; });
      ok(sg && sg.h <= 60 && sg.img && sg.uh >= 40 && /Sent \d+ \w+/.test(sg.pill), 'a signed payout: fixed small signature box, Sent pill with a short date, Undo button' + sfx);
      await t.page.evaluate(() => document.querySelector('#view .po-card').scrollIntoView({ block: 'center' })); await t.page.waitForTimeout(300);
      await shot(t.page, 'h02b-payout-signed' + (dark ? '-dark' : ''));
      ok(!t.errors.length, 'no page errors ' + t.errors.join(' | '));
      await t.ctx.close();
      const m = await open(b, 'member', { wait: 1400, dark, setupGuide: true });
      ok(await gap(m.page, '#view .hero', '#view .po-card') >= 12, 'member: the payout card has a clear gap from the live card' + sfx);
      ok(!(await m.page.isVisible('.su2')) && !(await m.page.isVisible('.urgent.u-setup')), 'a member never sees the setup guide' + sfx);
      ok(!/Who has not paid/.test(await m.page.textContent('.hm-help')), 'member quick questions fit a member' + sfx);
      await shot(m.page, 'h03-home-member' + (dark ? '-dark' : ''));
      ok(!m.errors.length, 'no page errors ' + m.errors.join(' | '));
      await m.ctx.close();
    }
    /* the setup welcome: once, later hides it for a day, back after 24h, turned off stays off */
    const w = await open(b, 'treasurer', { wait: 1600, setupGuide: true });
    const { page, errors } = w;
    ok(await page.isVisible('.urgent.on.u-setup') && /Let’s set up Umoja Savings/.test(await page.textContent('.urgent')), 'a treasurer with setup left gets the full-screen welcome');
    await shot(page, 'h04-setup-welcome');
    await page.click('.urgent [data-u="later"]'); await page.waitForTimeout(400);
    ok(!(await page.isVisible('.urgent')), 'Remind me later closes it');
    const until = await page.evaluate(() => Number(localStorage.getItem('mca-urgent-setup:umoja')) - Date.now());
    ok(until > 23 * 3600e3 && until <= 24 * 3600e3 + 5e3, 'it is put off for a day');
    await page.reload(); await page.waitForTimeout(1600);
    ok(!(await page.isVisible('.urgent.u-setup')), 'not shown again on the same day');
    await page.evaluate(() => localStorage.setItem('mca-urgent-setup:umoja', String(Date.now() - 1000))); await page.reload(); await page.waitForTimeout(1600);
    ok(await page.isVisible('.urgent.on.u-setup') && /Setup guide/.test(await page.textContent('.urgent small')) && /set up/.test(await page.textContent('#urgT')), 'after 24 hours it comes back as a reminder');
    await page.click('.urgent [data-u="off"]'); await page.waitForTimeout(400);
    await page.evaluate(() => localStorage.setItem('mca-urgent-setup:umoja', String(Date.now() - 1000))); await page.reload(); await page.waitForTimeout(1600);
    ok(!(await page.isVisible('.urgent.u-setup')) && await page.isVisible('.su2'), 'turned off: no more full-screen reminders, the Home card stays');
    ok(/Turn on reminders/.test(await page.textContent('.su2-foot')), 'reminders can be turned back on from the card');
    /* the next step: a live tour where the Guide has one, the right screen otherwise; done returns Home with the next step lit */
    ok((await page.getAttribute('.su2-next', 'data-k')) === 'rules', 'the next step is the first one not done');
    await page.click('.su2-next'); await page.waitForTimeout(1500);
    ok(await page.isVisible('.tr-card') && /settings\/chama/.test(page.url()), 'tapping the next step starts its live tour');
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    await page.evaluate(() => { __M_src_core_store_js.Store.commit(s => { s.chama.rules = 'Pay by the 10th.'; }); }); await page.waitForTimeout(1500);
    ok(/#\/home/.test(page.url()) && await page.isVisible('.su2-next.flash') && (await page.getAttribute('.su2-next', 'data-k')) === 'meeting', 'once the step is done Home shows the next one, highlighted');
    ok(/Next: Call your first meeting/.test(await page.textContent('#toast')), 'a short note names the next step');
    await shot(page, 'h05-setup-next');
    await page.click('.su2-next'); await page.waitForTimeout(700);
    ok(await page.evaluate(() => !!document.querySelector('.sx-veil.on, .modal-veil, #modalRoot .sx, #modalRoot form')), 'a step without a tour opens its screen');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    ok(!errors.length, 'no page errors ' + errors.join(' | '));
    await w.ctx.close();
    /* Simple view */
    const sv = await open(b, 'treasurer', { wait: 1400, a11y: { simple: 1 } });
    ok(await gap(sv.page, '#view .hero', '#view .su2') >= 12 && await sv.page.isVisible('.hm-help .hh-mark'), 'Simple view: cards apart, Guide card with its mark');
    await shot(sv.page, 'h06-home-simple');
    ok(!sv.errors.length, 'no page errors ' + sv.errors.join(' | '));
    await sv.ctx.close();
  },
  /* FINES: the fine chooser leaves out members who are paid up (toggle shows everyone), the picker searches, and a loan
     signed on the borrower's phone reaches the treasurer's loan view, its PDF, and survives a reload (M3, M5). */
  async v020Fines(b) {
    const SHOT = process.env.FINES_SHOTS === '1';
    for (const v of [{ sfx: '' }, { sfx: '-dark', dark: true }, { sfx: '-simple', a11y: { simple: 1 } }]) {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, dark: v.dark, a11y: v.a11y });
      await page.evaluate(() => { location.hash = '#/fines'; }); await page.waitForTimeout(600);
      await page.click('[data-act="addFine"]'); await page.waitForTimeout(500);
      const card = await page.textContent('#modalRoot .mpk-card');
      ok(/Otieno|Hassan|Baraka/.test(card) && /Late \d+ days? · owes KES/.test(card), 'Add fine starts on a member who owes, with a status chip' + v.sfx);
      if (SHOT || !v.sfx) await shot(page, 'v020-fine-form' + v.sfx);
      await page.click('#modalRoot .mpk-card'); await page.waitForTimeout(400);
      const ids = () => page.evaluate(() => [...document.querySelectorAll('.mpk-row')].map(r => r.dataset.id).sort().join(','));
      ok(await ids() === 'm2,m5,m8', 'only members who still owe are listed: ' + await ids() + v.sfx);
      ok(!(await page.evaluate(() => /Paid up/.test(document.getElementById('mpkList').textContent))), 'no paid-up member is offered for a late fine' + v.sfx);
      if (SHOT || !v.sfx) await shot(page, 'v020-fine-picker' + v.sfx);
      await page.click('.mpk-tog'); await page.waitForTimeout(200);
      ok((await ids()).split(',').length === 8 && /Paid up/.test(await page.textContent('#mpkList')), 'Show everyone lists all eight, paid up marked' + v.sfx);
      await page.click('.mpk-tog'); await page.waitForTimeout(150);
      await page.fill('#mpkQ', 'gra'); await page.waitForTimeout(150);
      ok(await ids() === '' && /1 more/.test(await page.textContent('#mpkList')), 'search for a paid-up name offers to show them' + v.sfx);
      await page.click('.mpk-list [data-mpk="all"]'); await page.waitForTimeout(150);
      ok(await ids() === 'm7', 'search finds Grace once everyone is shown' + v.sfx);
      await page.click('.mpk-row[data-id="m7"]'); await page.waitForTimeout(150);
      ok(await page.evaluate(() => document.querySelector('.mpk-row[data-id="m7"]').getAttribute('aria-selected') === 'true') && /Fine Grace/.test(await page.textContent('#mpkOk')), 'the chosen row is ticked and the confirm button names her' + v.sfx);
      if (SHOT || !v.sfx) await shot(page, 'v020-fine-picker-search' + v.sfx);
      await page.click('#mpkOk'); await page.waitForTimeout(350);
      ok(await page.inputValue('#modalRoot input[name="memberId"]') === 'm7' && /Grace/.test(await page.textContent('#modalRoot .mpk-card')), 'confirm puts her in the form');
      const before = await page.evaluate(() => __M_src_core_store_js.Store.get().fines.length);
      await page.click('#modalRoot form .actions .btn.pri'); await page.waitForTimeout(300);
      ok(await page.evaluate(() => __M_src_core_store_js.Store.get().fines.length) === before, 'a late fine for someone who is paid up is refused' + v.sfx);
      ok(/paid up/.test(await page.textContent('#popRoot')), 'and the treasurer is told why' + v.sfx);
      if (SHOT || !v.sfx) await shot(page, 'v020-fine-refused' + v.sfx);
      await page.click('#popRoot .pop-btn'); await page.waitForTimeout(250);
      await page.click('#modalRoot [data-fr="Missed meeting"]'); await page.click('#modalRoot form .actions .btn.pri'); await page.waitForTimeout(400);
      ok(await page.evaluate(() => { const f = __M_src_core_store_js.Store.get().fines; const x = f[f.length - 1]; return x.memberId === 'm7' && x.reason === 'Missed meeting'; }), 'a missed-meeting fine for a paid-up member is allowed' + v.sfx);
      /* the same picker chooses the borrower */
      await page.evaluate(() => { location.hash = '#/loans'; }); await page.waitForTimeout(500);
      await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.classList.remove('on'); }); await page.waitForTimeout(300);
      await page.click('#view [data-act="addLoan"]'); await page.waitForTimeout(600);
      await page.click('#modalRoot .mpk-card'); await page.waitForTimeout(300);
      ok((await ids()).split(',').length === 8, 'New loan lists every member');
      await page.fill('#mpkQ', 'otie'); await page.waitForTimeout(150);
      ok(await ids() === 'm2' && /Loan balance/.test(await page.textContent('#mpkList')), 'loan picker search works and shows the loan balance');
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      ok(!(await page.locator('.mpk-layer').count()) && await page.isVisible('#modalRoot form'), 'Escape steps back to the form, not out of it');
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* M5: the borrower signs on their own phone */
    const sc = require('./fixtures').scenarios, L9 = { id: 'L9', memberId: 'm3', principal: 5000, rate: 10, months: 2, date: '2026-11-01', repayments: [] };
    const mch = JSON.parse(JSON.stringify(sc.member.mock.chamas)); mch.umoja.data.loans.push(L9);
    const m = await open(b, 'member', { wait: 1600, mock: { ...sc.member.mock, chamas: mch } });
    if (await m.page.isVisible('.urgent [data-u="go"]')) await m.page.click('.urgent [data-u="go"]'); else await m.page.evaluate(() => __M_src_features_index_js.Actions.signLoanMine({ id: 'L9' }));
    await m.page.waitForTimeout(600);
    await m.page.check('#modalRoot input[name="agree"]'); await m.page.click('#modalRoot form .actions .btn.pri'); await m.page.waitForTimeout(500);
    const box = await m.page.locator('#sigPad').boundingBox();
    await m.page.mouse.move(box.x + 30, box.y + 80); await m.page.mouse.down(); await m.page.mouse.move(box.x + 120, box.y + 40, { steps: 6 }); await m.page.mouse.move(box.x + 220, box.y + 110, { steps: 6 }); await m.page.mouse.up();
    await m.page.click('#modalRoot form .actions .btn.pri'); await m.page.waitForTimeout(1000);
    const signed = await m.page.evaluate(() => { const l = window.__DB.chamas.umoja.data.loans.find(x => x.id === 'L9'); return l && l.agreement; });
    ok((await calls(m.page)).some(x => x.name === 'sign_loan_terms' && /^data:image\/png/.test(x.args.p_sig) && x.args.p_total === 6000), 'the borrower signs on their phone and the terms go to the server');
    ok(signed && signed.on === 'borrower phone' && signed.total === 6000 && signed.lastDue, 'the signed terms are kept with the loan in the Chama record');
    ok(/Signed/.test(await m.page.textContent('#popRoot')), 'the borrower is told it was sent');
    ok(!m.errors.length, 'no page errors ' + m.errors.join(' | '));
    await m.ctx.close();
    /* the treasurer is told, and sees the signed terms without reloading */
    const tch = JSON.parse(JSON.stringify(sc.treasurer.mock.chamas)); tch.umoja.data.loans.push(L9);
    const t = await open(b, 'treasurer', { wait: 1600, mock: { ...sc.treasurer.mock, chamas: tch } });
    await t.page.evaluate(() => { location.hash = '#/loans'; }); await t.page.waitForTimeout(600);
    ok(/Faith Mwende has not signed yet/.test(await text(t.page)), 'before: the treasurer sees the loan waiting for a signature');
    await t.page.evaluate(sig => window.__DB.simBorrowerSigns('umoja', 'L9', sig, 'Faith Mwende'), signed.sig);
    await t.page.evaluate(() => __M_src_features_notifications_notify_js.Notify.loadServer()); await t.page.waitForTimeout(1200);
    ok(/Faith Mwende signed the loan terms/.test(await t.page.textContent('#toast')), 'the treasurer gets a notification when the borrower signs');
    ok(!/Faith Mwende has not signed yet/.test(await text(t.page)) && /Terms signed/.test(await text(t.page)), 'the loans list shows it signed, without a reload');
    await t.page.evaluate(() => { const x = document.getElementById('toast'); if (x) x.classList.remove('on'); }); await t.page.waitForTimeout(300);
    await t.page.click('[data-act="loanMenu"][data-id="L9"]'); await t.page.waitForTimeout(700);
    const lv = await t.page.textContent('#modalRoot');
    ok(/Terms signed/.test(lv) && /on their own phone/.test(lv) && /KES 6,000/.test(lv) && await t.page.isVisible('#modalRoot .lsig img'), 'the loan view shows the signed time, where, the amounts and the signature');
    await shot(t.page, 'v020-loan-signed');
    const pdf = await t.page.evaluate(() => { const s = __M_src_core_store_js.Store.get(); let h = ''; const P = __M_src_lib_reports_js.Doc.print; __M_src_lib_reports_js.Doc.print = x => { h = x; }; __M_src_features_index_js.Actions.loanPdf({ id: 'L9' }); __M_src_lib_reports_js.Doc.print = P; return h; });
    ok(/Loan agreement/.test(pdf) && /<img src="data:image\/png/.test(pdf) && /own phone/.test(pdf) && /KES 6,000/.test(pdf), 'the loan agreement PDF carries the signature, time and amounts');
    ok(!t.errors.length, 'no page errors ' + t.errors.join(' | '));
    await t.ctx.close();
    /* after a reload the record from the server still has it */
    const rch = JSON.parse(JSON.stringify(tch)); rch.umoja.data.loans.find(x => x.id === 'L9').agreement = signed;
    const r = await open(b, 'treasurer', { wait: 1600, dark: true, mock: { ...sc.treasurer.mock, chamas: rch } });
    await r.page.evaluate(() => { location.hash = '#/loans'; }); await r.page.waitForTimeout(600);
    await r.page.click('[data-act="loanMenu"][data-id="L9"]'); await r.page.waitForTimeout(500);
    ok(/on their own phone/.test(await r.page.textContent('#modalRoot')), 'the signed terms are still there after a reload');
    await shot(r.page, 'v020-loan-signed-dark');
    ok(!r.errors.length, 'no page errors ' + r.errors.join(' | '));
    await r.ctx.close();
  },
  /* PROFILE (F-U2, F-X6): About you is answered once (the server decides, so a new phone never repeats it), only a missing
     phone-sharing agreement is asked again, the answers are seen and changed on My profile (age changes the app at once),
     the date of birth can be read from a Kenyan ID on the phone, and the username edit uses the live setup checks. */
  async v020Profile(b) {
    const done = { full_name: 'Faith Wanjiru', phone: '0711222333', birth_date: '1955-04-02', gender: 'female', details_at: '2026-10-01T08:00:00Z', dob_source: 'self', phone_shared_at: '2026-10-01T08:00:00Z' };
    /* 1. details complete, nothing on this phone (a new phone): no questions at all, and the app is set up for the age */
    let r = await open(b, 'member', { about: true, wait: 2600, mock: { ...scenarios.member.mock, details: done } });
    ok(!(await r.page.locator('#awRoot .ab').count()), 'a person who already answered never sees the questions again, even on a new phone');
    ok(await r.page.evaluate(() => localStorage.getItem('mca-about-v3:u3') === 'done' && JSON.parse(localStorage.getItem('mca-about:data:u3')).birth_date === '1955-04-02'), 'the server answer is kept on this phone');
    ok(await r.page.evaluate(() => document.documentElement.classList.contains('a-simple')), 'and the app matches their age here too (Simple view at 71)');
    await r.page.evaluate(() => __M_src_features_guide_js.About.check()); await r.page.waitForTimeout(600);
    ok(!(await r.page.locator('#awRoot .ab').count()) && (await calls(r.page)).filter(x => x.name === 'set_my_details').length === 0, 'checking again does nothing and saves nothing (no loop)');
    ok(!r.errors.length, 'no page errors ' + r.errors.join(' | ')); await r.ctx.close();
    /* 2. only the phone-sharing agreement is missing: only that one step */
    r = await open(b, 'member', { about: true, wait: 2600, mock: { ...scenarios.member.mock, details: { ...done, phone_shared_at: null } } });
    const only = await r.page.evaluate(() => { const a = document.querySelector('#awRoot .ab'); return a ? { only: a.classList.contains('ab-only'), dots: !!a.querySelector('.ab-dots'), txt: a.innerText } : null; });
    ok(only && only.only && !only.dots && /share your phone number/i.test(only.txt) && !/has been updated/i.test(only.txt), 'when only the agreement is missing, only that step shows');
    await shot(r.page, 'v020-profile-consent-only');
    await r.page.click('[data-ab="share"]'); await r.page.click('[data-ab="save"]'); await r.page.waitForTimeout(800);
    const c2 = await calls(r.page);
    ok(c2.some(x => x.name === 'set_phone_sharing' && x.args.p_on === true) && !c2.some(x => x.name === 'set_my_details'), 'agreeing turns sharing on and saves nothing else');
    ok(!(await r.page.locator('#awRoot .ab').count()) && await r.page.evaluate(() => localStorage.getItem('mca-about-v3:u3') === 'done'), 'then it is finished for good');
    ok(!r.errors.length, 'no page errors ' + r.errors.join(' | ')); await r.ctx.close();
    /* 3. My profile lists About you; changing the date of birth changes the app at once */
    const young = { ...done, birth_date: '1990-06-15' };
    r = await open(b, 'member', { wait: 1400, mock: { ...scenarios.member.mock, details: young } });
    let page = r.page;
    await page.evaluate(() => { location.hash = '#/profile'; }); await page.waitForTimeout(900);
    const sec = await page.evaluate(() => (document.getElementById('aboutYou') || {}).innerText || '');
    ok(/About you/i.test(sec) && /15 June 1990/.test(sec) && /\b3[56] years/.test(sec) && /Female/.test(sec) && /Shared with my Chama/.test(sec) && /Self-declared/.test(sec), 'My profile lists name, phone, date of birth with age, gender, sharing and where the date came from');
    ok(!(await page.evaluate(() => document.documentElement.classList.contains('a-simple'))), 'at 36 the app is standard');
    await page.evaluate(() => document.getElementById('aboutYou').scrollIntoView()); await page.waitForTimeout(200);
    await shot(page, 'v020-profile-about');
    await page.click('[data-act="aboutDob"]'); await page.waitForTimeout(400);
    await shot(page, 'v020-profile-dob');
    await page.selectOption('#ayY', '1950'); await page.waitForTimeout(100);
    ok(/7[56] years/.test(await page.textContent('#ayAge')), 'the age updates while choosing');
    await page.click('[data-act="aboutDobSave"]'); await page.waitForTimeout(800);
    const c3 = await calls(page);
    ok(c3.some(x => x.name === 'set_my_details' && x.args.p_birth_date === '1950-06-15') && c3.some(x => x.name === 'set_dob_source' && x.args.p_source === 'self'), 'saving sends the new date to the server');
    const h = await page.evaluate(() => ({ simple: document.documentElement.classList.contains('a-simple'), size: document.documentElement.dataset.size }));
    ok(h.simple && h.size === 'x', 'the app changes at once: Simple view with the largest text at 76');
    ok(/15 June 1950/.test(await page.textContent('#aboutYou')), 'and My profile shows the new date');
    /* back to a younger age: what the age switched on is switched off again */
    await page.click('[data-act="aboutDob"]'); await page.waitForTimeout(300); await page.selectOption('#ayY', '1990'); await page.click('[data-act="aboutDobSave"]'); await page.waitForTimeout(700);
    ok(!(await page.evaluate(() => document.documentElement.classList.contains('a-simple'))), 'a corrected younger date makes the app standard again');
    /* the person's own choice still wins */
    await page.evaluate(() => { const A = __M_src_core_a11y_js.A11y; A.d.ageMode = 'custom'; A.d.size = 'n'; A.save(); });
    await page.click('[data-act="aboutDob"]'); await page.waitForTimeout(300); await page.selectOption('#ayY', '1945'); await page.click('[data-act="aboutDobSave"]'); await page.waitForTimeout(700);
    ok(!(await page.evaluate(() => document.documentElement.classList.contains('a-simple'))), 'someone who chose their own display settings keeps them');
    /* gender in place */
    await page.click('[data-act="aboutGender"]'); await page.waitForTimeout(300); await page.click('[data-act="aboutGenderSet"][data-v="prefer_not"]'); await page.waitForTimeout(600);
    ok((await calls(page)).some(x => x.name === 'set_my_details' && x.args.p_gender === 'prefer_not') && /Prefer not to say/.test(await page.textContent('#aboutYou')), 'gender is changed in place');
    /* 4. the date of birth read from an ID (Tesseract stubbed, noisy text) */
    await page.evaluate(() => { window.__ocrText = 'REPUBLIC OF KENYA\nSERIAL NUMBER 234567891\nFULL NAMES FAITH WANJIRU\nDATE 0F B1RTH\n12.O3.l958\nSEX FEMALE\nDATE OF ISSUE 05.06.2010';
      window.Tesseract = { createWorker: async () => ({ setParameters: async () => {}, recognize: async c => { window.__ocrCanvas = c; return { data: { text: window.__ocrText } }; } }) }; });
    await page.click('[data-act="aboutDob"]'); await page.waitForTimeout(300);
    await page.click('[data-act="aboutIdScan"]'); await page.waitForTimeout(300);
    ok(/never uploaded or kept/i.test(await page.textContent('#modalRoot')), 'Scan my ID says first that the photo stays on the phone');
    await shot(page, 'v020-profile-idscan');
    const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 320; c.height = 200; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 320, 200); x.fillStyle = '#000'; x.font = '20px sans-serif'; x.fillText('DATE OF BIRTH 12.03.1958', 10, 100); return c.toDataURL('image/png').split(',')[1]; });
    await page.setInputFiles('#idScanPick', { name: 'id.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
    await page.waitForTimeout(1200);
    const f = await page.evaluate(() => ({ y: (document.getElementById('ayY') || {}).value, m: (document.getElementById('ayM') || {}).value, d: (document.getElementById('ayD') || {}).value, found: (document.querySelector('.ay-found') || {}).innerText || '', imgs: document.querySelectorAll('#modalRoot img').length, wiped: !!window.__ocrCanvas && window.__ocrCanvas.width === 0 }));
    ok(f.y === '1958' && f.m === '3' && f.d === '12' && /12 March 1958/.test(f.found), 'the date of birth is found despite reading noise, filled in and shown to confirm');
    ok(f.imgs === 0 && f.wiped, 'the photo is not shown or kept, and the canvas is wiped');
    await shot(page, 'v020-profile-idfound');
    await page.click('[data-act="aboutDobSave"]'); await page.waitForTimeout(800);
    const c4 = await calls(page);
    ok(c4.some(x => x.name === 'set_my_details' && x.args.p_birth_date === '1958-03-12') && c4.filter(x => x.name === 'set_dob_source').pop().args.p_source === 'id_scan', 'saving stores the date and marks it as read from the ID');
    ok(/Self-declared · ID scanned/.test(await page.textContent('#aboutYou')), 'My profile shows "Self-declared · ID scanned"');
    /* nothing readable: a clear message, and the date can still be chosen by hand */
    await page.evaluate(() => { window.__ocrText = 'blurry'; });
    await page.click('[data-act="aboutDob"]'); await page.waitForTimeout(300); await page.click('[data-act="aboutIdScan"]'); await page.waitForTimeout(300);
    await page.setInputFiles('#idScanCam', { name: 'id.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') }); await page.waitForTimeout(1000);
    ok(/could not find the date of birth/i.test(await page.textContent('#modalRoot')) && await page.isVisible('[data-act="aboutIdBack"]'), 'an unreadable photo says so and offers to choose the date by hand');
    await page.evaluate(() => __M_src_features_requests_js.Sheet.close()); await page.waitForTimeout(300);
    /* 5. username: the same live checks as setup */
    await page.click('[data-act="meEdit"][data-f="user"]'); await page.waitForTimeout(500);
    ok(await page.isDisabled('[data-uc-save]'), 'Save is off before a new username is chosen');
    ok((await page.locator('#userSugg .u-chip').count()) >= 1, 'suggestions made from the name show');
    await page.fill('#setUser', 'taken.name'); await page.waitForTimeout(800);
    ok(/already has/i.test(await page.textContent('#userSt')) && await page.evaluate(() => document.getElementById('userSt').classList.contains('bad')) && await page.isDisabled('[data-uc-save]'), 'a taken username says why, and Save stays off');
    await shot(page, 'v020-profile-username');
    await page.click('#userSugg .u-chip'); await page.waitForTimeout(600);
    ok(await page.evaluate(() => document.getElementById('userSt').classList.contains('ok')) && !(await page.isDisabled('[data-uc-save]')), 'a free one gets the tick and Save turns on');
    await page.click('[data-uc-save]'); await page.waitForTimeout(700);
    ok((await calls(page)).some(x => x.name === 'username_available') && !(await page.locator('#modalRoot .sx').count()), 'the username is checked on the server and saved');
    ok(!r.errors.length, 'no page errors ' + r.errors.join(' | ')); await r.ctx.close();
    /* 6. the Settings entry opens My profile, it never runs the questions again */
    r = await open(b, 'member', { wait: 1400, mock: { ...scenarios.member.mock, details: done } }); page = r.page;
    await page.evaluate(() => __M_src_features_index_js.Actions.aboutEdit && __M_src_features_index_js.Actions.aboutEdit()); await page.waitForTimeout(900);
    ok(/#\/profile/.test(page.url()) && !(await page.locator('#awRoot .ab').count()), 'Settings, About you opens My profile instead of the questions');
    ok(!r.errors.length, 'no page errors ' + r.errors.join(' | ')); await r.ctx.close();
    /* 7. look: About you in dark and in Simple view at 390px */
    for (const [tag, o] of [['dark', { dark: true }], ['simple', { a11y: { simple: 1, size: 'l', ageMode: 'custom' } }]]) {
      r = await open(b, 'member', { wait: 1400, ...o, mock: { ...scenarios.member.mock, details: { ...done, dob_source: 'id_scan' } } });
      await r.page.evaluate(() => { location.hash = '#/profile'; }); await r.page.waitForTimeout(900);
      await r.page.evaluate(() => document.getElementById('aboutYou').scrollIntoView()); await r.page.waitForTimeout(200);
      ok(await r.page.evaluate(() => document.documentElement.scrollWidth <= 390), `About you fits 390px (${tag})`);
      await shot(r.page, 'v020-profile-about-' + tag);
      await r.page.click('[data-act="aboutDob"]'); await r.page.waitForTimeout(400); await shot(r.page, 'v020-profile-dob-' + tag);
      await r.page.click('[data-act="aboutIdScan"]'); await r.page.waitForTimeout(300); await shot(r.page, 'v020-profile-idscan-' + tag);
      ok(!r.errors.length, 'no page errors ' + r.errors.join(' | ')); await r.ctx.close();
    }
  },
  /* 0.20.0 MONEY: M-Pesa import (paste first, live screenshot reading, fall back to paste), treasurer's own payment needs
     proof (record_payment_v2), Awaiting check, the secretary confirms */
  async v020Money(b) {
    const stubOcr = page => page.evaluate(() => { window.Tesseract = { createWorker: async (l, o, opt) => ({ setParameters: async () => {}, recognize: async () => { if (opt && opt.logger) opt.logger({ status: 'recognizing text', progress: 0.4 }); await new Promise(r => setTimeout(r, 700)); return { data: { text: 'a photo of a cat' } }; } }) }; });
    const PNG = { name: 'shot.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64') };
    const OWN = 'TKA1B2C3D4 Confirmed. Ksh2,000.00 sent to UMOJA SAVINGS for account 123 on 3/11/26 at 9:00 AM. New M-PESA balance is Ksh5,000.00.';
    for (const v of [{ sfx: '' }, { sfx: '-dark', dark: true }, { sfx: '-simple', a11y: { simple: 1 } }]) {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1300, dark: v.dark, a11y: v.a11y });
      await stubOcr(page);
      await page.goto(page.url().split('#')[0] + '#/grid'); await page.waitForTimeout(500); await stubOcr(page);
      await page.click('[data-act="importPay"]'); await page.waitForTimeout(500);
      const tabs = await page.$$eval('.im-tab', els => els.map(e => e.dataset.v + ':' + e.innerText.replace(/\s+/g, ' ').trim()));
      ok(tabs.length === 2 && /^paste:Recommended Paste the M-Pesa SMS/i.test(tabs[0]) && /May miss some/i.test(tabs[1]) && await page.isVisible('.im-tab.on[data-v="paste"]') && await page.isVisible('#imText'), 'paste is the first tab and recommended; screenshot says it may miss some' + v.sfx);
      await shot(page, 'm01-import-paste' + v.sfx);
      await page.click('.im-tab[data-v="shot"]'); await page.waitForTimeout(300);
      await page.setInputFiles('#imFiles', PNG); await page.waitForTimeout(250);
      ok(await page.isVisible('.im-shot img') && /Reading|Getting ready/.test(await page.textContent('.im-shot figcaption')) && await page.isVisible('.im-shot .im-spin'), 'a chosen screenshot shows at once with a Reading state' + v.sfx);
      await shot(page, 'm02-import-reading' + v.sfx);
      await page.waitForTimeout(2000);
      ok(await page.isVisible('.im-tab.on[data-v="paste"]') && /We could not read that picture\. Copy the M-Pesa message and paste it here\./.test(await page.textContent('.im-note')) && await page.evaluate(() => document.activeElement && document.activeElement.id === 'imText'), 'nothing read: moves to Paste with a clear message and the box ready' + v.sfx);
      await shot(page, 'm03-import-fallback' + v.sfx);
      await page.fill('#imText', 'SKB7H2LQ4P Confirmed. You have received Ksh2,O00.00 from BARAKA MUTUA 0717***765 on 5/11/26 at 10:00 AM New M-PESA balance is Ksh9,000.00'); await page.waitForTimeout(200);
      ok(/1 payment found/.test(await page.textContent('#imLive')), 'pasted message is read live (OCR-style O for 0 is tolerated)' + v.sfx);
      await page.click('[data-im="go"]'); await page.waitForTimeout(700);
      ok(/1 payment found/.test(await page.textContent('#modalRoot')) && /KES\s?2,000/.test(await page.textContent('#modalRoot')), 'review opens with the payment' + v.sfx);
      await page.click('#modalRoot [data-act="closeModal"] >> nth=-1'); await page.waitForTimeout(400);
      /* the treasurer (member m1) records their own payment */
      await page.click('[data-act="pay"][data-m="m1"]'); await page.waitForTimeout(500);
      ok(await page.isVisible('#evBox') && /needs proof/.test(await page.textContent('#evBox')), 'own payment asks for proof' + v.sfx);
      await page.fill('#modalRoot input[name="amount"]', '2000');
      await page.click('#modalRoot .actions .btn.pri'); await page.waitForTimeout(400);
      ok(/needs proof/.test((await page.textContent('#popRoot').catch(() => '')) + (await page.textContent('#toast').catch(() => ''))) && await page.isVisible('#evBox') && !(await calls(page)).some(x => x.name === 'record_payment_v2'), 'own payment without proof is blocked before anything is sent' + v.sfx);
      if (await page.isVisible('#popRoot .pop-btn')) { await page.click('#popRoot .pop-btn'); await page.waitForTimeout(300); }
      await page.fill('#modalRoot textarea[name="evsms"]', OWN); await page.waitForTimeout(200);
      ok(/matches/.test(await page.textContent('#evLive')) && (await page.inputValue('#modalRoot input[name="code"]')) === 'TKA1B2C3D4', 'pasted SMS fills the code and shows it matches' + v.sfx);
      await shot(page, 'm04-own-proof' + v.sfx);
      await page.click('#modalRoot .actions .btn.pri'); await page.waitForTimeout(900);
      const c = (await calls(page)).find(x => x.name === 'record_payment_v2' && x.args.p_member === 'm1');
      ok(c && c.args.p_evidence && c.args.p_evidence.kind === 'sms' && c.args.p_code === 'TKA1B2C3D4' && /UMOJA/.test(c.args.p_evidence.text), 'own payment goes to record_payment_v2 with the SMS as proof' + v.sfx);
      ok(/Awaiting check/.test(await page.textContent('#popRoot')), 'the treasurer is told it awaits a check' + v.sfx);
      await page.click('#popRoot .pop-btn'); await page.waitForTimeout(500);
      const jp = await page.evaluate(() => (window.__DB.chamas.umoja.data.payments || []).find(p => p.code === 'TKA1B2C3D4'));
      ok(jp && jp.sid && jp.serial && jp.selfRec === true && jp.ev && jp.ev.kind === 'sms' && /UMOJA/.test(jp.sms || ''), 'saved payment keeps sid, serial, selfRec, proof and the message' + v.sfx);
      ok(/Awaiting check/.test(await text(page)), 'the payment shows Awaiting check' + v.sfx);
      await shot(page, 'm05-awaiting' + v.sfx);
      await page.click('.cg-pay:has-text("TKA1B2C3D4")'); await page.waitForTimeout(400);
      ok(/Awaiting check by the secretary/.test(await page.textContent('#modalRoot')) && await page.isVisible('#modalRoot details.pay-sms'), 'payment detail shows the check state and the M-Pesa message' + v.sfx);
      await shot(page, 'm06-pay-detail' + v.sfx);
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* the server is not updated yet: the treasurer's own payment is never sent the old way */
    {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1300, mock: { ...scenarios.treasurer.mock, serverOld: true } });
      await page.goto(page.url().split('#')[0] + '#/grid'); await page.waitForTimeout(500);
      await page.click('[data-act="pay"][data-m="m1"]'); await page.waitForTimeout(500);
      await page.fill('#modalRoot input[name="amount"]', '2000'); await page.fill('#modalRoot textarea[name="evsms"]', OWN);
      await page.click('#modalRoot .actions .btn.pri'); await page.waitForTimeout(900);
      const cs = await calls(page);
      ok(/server update/.test(await page.textContent('#toast')) && !cs.some(x => x.name === 'record_payment') && !(await page.evaluate(() => window.__DB.chamas.umoja.data.payments.some(p => p.code === 'TKA1B2C3D4'))), 'without the server update the own payment is not saved (NOTREADY), no fallback');
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* the secretary sees the payment to check, with the proof, and confirms it */
    const sid = '9b2f7c1e-1111-4222-8333-444455556666';
    const ch = JSON.parse(JSON.stringify(scenarios.secretary.mock.chamas));
    ch.umoja.data.payments.push({ id: 'pz', sid, serial: 'MC-UMOJ-2611-7K3Q-9X', memberId: 'm1', month: ch.umoja.data.payments[0].month, amount: 2000, code: 'TKA1B2C3D4', date: new Date().toISOString().slice(0, 10), selfRec: true, flags: ['large'], ev: { kind: 'sms', code: 'TKA1B2C3D4' }, sms: OWN });
    const payRows = [{ id: sid, chama_id: 'umoja', member_id: 'm1', month: ch.umoja.data.payments[0].month, amount: 2000, mpesa_code: 'TKA1B2C3D4', date: new Date().toISOString().slice(0, 10), evidence: { kind: 'sms', text: OWN, code: 'TKA1B2C3D4' }, self_recorded: true, flags: ['large'], serial: 'MC-UMOJ-2611-7K3Q-9X', recorded_by: 'u1', recorded_by_name: 'Wanjiku Kamau', checked_at: null, checked_by_name: null }];
    for (const v of [{ sfx: '' }, { sfx: '-dark', dark: true }]) {
      const { page, ctx, errors } = await open(b, 'secretary', { wait: 1600, dark: v.dark, mock: { ...scenarios.secretary.mock, chamas: JSON.parse(JSON.stringify(ch)), payRows: JSON.parse(JSON.stringify(payRows)) } });
      if (await page.isVisible('.urgent.on [data-u="later"]')) { await page.click('.urgent.on [data-u="later"]'); await page.waitForTimeout(500); }
      ok(await page.isVisible('.pc-card') && /1 payment to check/.test(await page.textContent('.pc-card')), 'the secretary gets a card: payments to check' + v.sfx);
      await shot(page, 'm07-sec-card' + v.sfx);
      await page.click('.pc-card'); await page.waitForTimeout(500);
      const sh = await page.textContent('#modalRoot');
      ok(/TKA1B2C3D4/.test(sh) && /Large amount/.test(sh) && /Wanjiku Kamau/.test(sh), 'the check list shows code, warning chip and who recorded it' + v.sfx);
      ok(/sent to UMOJA SAVINGS/.test(sh), 'the check list shows the SMS proof' + v.sfx);
      await shot(page, 'm08-sec-check' + v.sfx);
      await page.click('[data-act="pcConfirm"]'); await page.waitForTimeout(800);
      ok((await calls(page)).some(x => x.name === 'confirm_payment' && x.args.p_payment === sid) && /All checked/.test(await page.textContent('#modalRoot')), 'Confirm calls confirm_payment and clears the list' + v.sfx);
      ok(await page.evaluate(sid => { const p = window.__DB.chamas.umoja.data.payments.find(x => x.sid === sid); return p && p.chk === true; }, sid), 'the payment is marked checked on the server copy' + v.sfx);
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
  },
  /* DOCS 0.20: serials on detail views, receipts with a QR that decodes and fixed-size signatures, Verify */
  async v020Docs(b) {
    const SR = /^MC-[A-Z0-9]{4}-\d{4}-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{2}$/;
    const ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    const cc = body => { const t = body.replace(/-/g, ''); let a = 0, c = 0; for (let i = 0; i < t.length; i++) { a += (i + 1) * t.charCodeAt(i); c += (2 * i + 3) * t.charCodeAt(i); } return ALPHA[a % 31] + ALPHA[c % 31]; };
    /* read a QR matrix back: format bits, finder/timing patterns, unmask, codewords, Reed-Solomon syndromes, byte-mode text */
    const decodeQR = q => {
      const n = q.size, g = q.rows, EXP = [], LOG = [];
      for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
      const mul = (a, c) => a && c ? EXP[LOG[a] + LOG[c]] : 0;
      const finderOk = (cx, cy) => { for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)); if (g[cy + dy][cx + dx] !== (d !== 2 ? 1 : 0)) return false; } return true; };
      if (!finderOk(3, 3) || !finderOk(n - 4, 3) || !finderOk(3, n - 4)) return { err: 'finder' };
      for (let i = 8; i < n - 8; i++) if (g[6][i] !== (i % 2 ? 0 : 1) || g[i][6] !== (i % 2 ? 0 : 1)) return { err: 'timing' };
      if (g[n - 8][8] !== 1) return { err: 'dark module' };
      let f = 0; for (let i = 0; i <= 5; i++) f |= g[i][8] << i; f |= g[7][8] << 6; f |= g[8][8] << 7; f |= g[8][7] << 8; for (let i = 9; i < 15; i++) f |= g[8][14 - i] << i;
      f ^= 0x5412; const ec = f >> 13, mask = (f >> 10) & 7;
      let r = f >> 10; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); if (((f >> 10) << 10 | r) !== f) return { err: 'format bch' };
      const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0, (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
      const fn = (x, y) => (x < 9 && y < 9) || (x >= n - 8 && y < 9) || (x < 9 && y >= n - 8) || x === 6 || y === 6 || (q.ver > 1 && Math.abs(x - (n - 7)) <= 2 && Math.abs(y - (n - 7)) <= 2);
      const bits = []; for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let v = 0; v < n; v++) for (let j = 0; j < 2; j++) { const x = right - j, y = ((right + 1) & 2) === 0 ? n - 1 - v : v; if (!fn(x, y)) bits.push(g[y][x] ^ (MASKS[mask](x, y) ? 1 : 0)); } }
      const SPEC = { 1: [16, 1, 10], 2: [28, 1, 16], 3: [44, 1, 26], 4: [32, 2, 18] }[q.ver], [dc, nb, ecn] = SPEC, total = (dc + ecn) * nb;
      const cw = []; for (let i = 0; i < total; i++) cw.push(bits.slice(i * 8, i * 8 + 8).reduce((a, c) => a * 2 + c, 0));
      const blocks = Array.from({ length: nb }, (_, k) => [...Array.from({ length: dc }, (_, i) => cw[i * nb + k]), ...Array.from({ length: ecn }, (_, i) => cw[dc * nb + i * nb + k])]);
      for (const bl of blocks) for (let j = 0; j < ecn; j++) { let s = 0; for (const c of bl) s = mul(s, EXP[j]) ^ c; if (s) return { err: 'rs syndrome' }; }
      const data = blocks.flatMap(bl => bl.slice(0, dc)), db = data.flatMap(c => Array.from({ length: 8 }, (_, i) => (c >> (7 - i)) & 1)), rd = (o, l) => db.slice(o, o + l).reduce((a, c) => a * 2 + c, 0);
      if (rd(0, 4) !== 4) return { err: 'mode' };
      const len = rd(4, 8); return { ec, mask, text: Buffer.from(Array.from({ length: len }, (_, i) => rd(12 + i * 8, 8))).toString('utf8') };
    };
    for (const dark of [false, true]) {
      const sfx = dark ? '-dark' : '';
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400, dark });
      await page.goto(page.url().split('#')[0] + '#/grid'); await page.waitForTimeout(700);
      await page.click('.cg-pay[data-act="payMenu"] >> nth=0'); await page.waitForTimeout(700);
      const serial = (await page.textContent('#modalRoot .sr-val .sr-code').catch(() => '')).trim();
      ok(SR.test(serial) && await page.isVisible('#modalRoot .sr-copy'), 'payment detail shows a server serial with a copy button' + sfx);
      ok((await calls(page)).some(x => x.name === 'issue_serial' && x.args.p_kind === 'payment'), 'an older payment gets its serial when the treasurer opens it' + sfx);
      ok(await page.evaluate(() => getComputedStyle(document.querySelector('#modalRoot .sr-code')).fontFamily.includes('monospace')), 'the serial is monospace' + sfx);
      await page.click('#modalRoot [data-act="receiptOpen"]'); await page.waitForTimeout(700);
      ok(await page.isVisible('.rc-card') && await page.isVisible('.rc-card .rc-qr svg.qr'), 'the receipt opens with a QR code' + sfx);
      ok(/Umoja Savings/.test(await page.textContent('.rc-card')) && (await page.textContent('.rc-card')).includes(serial), 'the receipt shows the Chama and the serial' + sfx);
      const boxes = await page.$$eval('.rc-card .sig-box', els => els.map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
      ok(boxes.length === 2 && boxes.every(([w, h]) => w === 160 && h === 56), 'treasurer and member signatures sit in fixed 160×56 boxes ' + JSON.stringify(boxes) + sfx);
      await shot(page, 'd1-receipt' + sfx);
      const q = await page.evaluate(sr => { const D = __M_src_features_docs_js; const t = D.qrText(sr); const e = D.QR.encode(t); return { t, size: e.size, ver: e.ver, rows: e.rows }; }, serial);
      const dq = decodeQR(q);
      ok(!dq.err && dq.ec === 0 && dq.text === q.t && dq.text.includes(serial), 'the QR decodes back to the serial (finders, timing, format M, RS) ' + (dq.err || '') + sfx);
      const q2 = decodeQR(await page.evaluate(() => { const e = __M_src_features_docs_js.QR.encode('MC-UMOJ-2611-7K3Q-9X'); return { size: e.size, ver: e.ver, rows: e.rows }; }));
      ok(q2.text === 'MC-UMOJ-2611-7K3Q-9X', 'a bare serial encodes as a version 2 code that reads back');
      if (!dark) {
        /* the treasurer adds a signature: it is cropped to the ink and shown in the same box */
        await page.click('[data-act="rcSignT"]'); await page.waitForTimeout(500);
        const pad = await page.$('#sigPad'), r = await pad.boundingBox();
        await page.mouse.move(r.x + r.width * .4, r.y + r.height * .5); await page.mouse.down();
        for (let i = 1; i <= 12; i++) await page.mouse.move(r.x + r.width * (.4 + i * .02), r.y + r.height * (.5 + (i % 2 ? -.08 : .08)));
        await page.mouse.up(); await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(900);
        const dims = await page.evaluate(() => new Promise(res => { const v = __M_src_core_store_js.Store.get().chama.rcSig; if (!v) return res(null); const i = new Image(); i.onload = () => res([i.width, i.height]); i.src = v.sig; }));
        ok(dims && dims[0] <= 480 && dims[1] <= 168 && dims[0] > dims[1], 'a new signature is stored trimmed to its ink ' + JSON.stringify(dims));
        ok(await page.isVisible('.rc-card .sig-box img'), 'the treasurer signature shows on the receipt');
        const dl = page.waitForEvent('download', { timeout: 6000 }).catch(() => null);
        await page.click('[data-act="rcPng"]'); const file = await dl;
        ok(file && /\.png$/.test(file.suggestedFilename()), 'the receipt saves as a PNG picture');
        if (file && SHOTS) await file.saveAs(path.join(SHOTS, 'd7-receipt-image.png'));
      }
      /* Verify from the Guide: genuine with the right amount, "details don't match" with a wrong one */
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      await page.goto(page.url().split('#')[0] + '#/home'); await page.waitForTimeout(500);
      await page.keyboard.press('/'); await page.waitForTimeout(300);
      ok(await page.isVisible('.gd-vf'), 'the Guide has a Verify button' + sfx);
      await page.click('.gd-vf'); await page.waitForTimeout(500);
      ok(await page.isVisible('#vfSerial'), 'Verify opens as a sheet' + sfx);
      await page.fill('#vfSerial', serial.replace(/-/g, '').toLowerCase()); await page.waitForTimeout(100);
      ok(await page.inputValue('#vfSerial') === serial, 'a pasted serial is put in capitals with dashes' + sfx);
      await page.click('[data-act="verifyMore"]'); await page.waitForTimeout(200);
      await page.fill('#vfAmount', '2000'); await shot(page, 'd2-verify-form' + sfx);
      await page.click('[data-act="verifyCheck"]'); await page.waitForTimeout(500);
      ok(await page.isVisible('.vf-card.is-checking .vf-sweep'), 'checking shows the sweep over the card' + sfx);
      await shot(page, 'd3-verify-checking' + sfx);
      await page.waitForSelector('.vf-seal', { timeout: 6000 });
      ok(await page.isVisible('.vf-seal.ok') && /Genuine/.test(await page.textContent('.vf-seal')) && await page.$$eval('.vf-row.ok', e => e.length) === 2, 'a real serial with the right amount is Genuine, with a tick per detail' + sfx);
      await shot(page, 'd4-verify-genuine' + sfx);
      await page.click('[data-act="verifyAgain"]'); await page.waitForTimeout(300);
      await page.fill('#vfSerial', serial); await page.click('[data-act="verifyMore"]'); await page.fill('#vfAmount', '2500');
      await page.click('[data-act="verifyCheck"]'); await page.waitForSelector('.vf-seal', { timeout: 6000 });
      ok(await page.isVisible('.vf-seal.warn') && /Details don.t match/.test(await page.textContent('.vf-seal')) && /amount/i.test(await page.textContent('.vf-why')), 'a wrong amount says the details do not match, and which' + sfx);
      await shot(page, 'd5-verify-mismatch' + sfx);
      await page.click('[data-act="verifyAgain"]'); await page.waitForTimeout(300);
      const fake = 'MC-UMOJ-2611-ABCD'; await page.fill('#vfSerial', fake + '-' + cc(fake)); await page.click('[data-act="verifyCheck"]'); await page.waitForSelector('.vf-seal', { timeout: 6000 });
      ok(await page.isVisible('.vf-seal.bad') && /Not found/.test(await page.textContent('.vf-seal')), 'an unknown serial says Not found' + sfx);
      await page.click('[data-act="verifyAgain"]'); await page.waitForTimeout(300);
      await page.fill('#vfSerial', fake + '-22'); await page.click('[data-act="verifyCheck"]'); await page.waitForTimeout(300);
      ok(/typing mistake/.test(await page.textContent('#modalRoot .ferr')), 'a serial with wrong check letters is caught on the phone' + sfx);
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'no sideways scroll at 390px' + sfx);
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* #/verify/<serial> (what a phone camera opens from the QR) checks straight away */
    {
      const { page, ctx, errors } = await open(b, 'treasurer', { wait: 1400 });
      const serial = await page.evaluate(async () => { const s = __M_src_core_store_js.Store.get(); return await __M_src_features_docs_js.Serial.ensure('loan', s.loans[0]); });
      ok(SR.test(serial), 'a loan gets a serial');
      await page.goto(page.url().split('#')[0] + '#/verify/' + serial); await page.waitForSelector('.vf-seal', { timeout: 8000 });
      ok(/Genuine/.test(await page.textContent('.vf-seal')) && /loan/i.test(await page.textContent('.vf-card')), 'the verify link opens Verify and shows Genuine for the loan');
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
    /* a member opens their own payment and its receipt */
    {
      const { page, ctx, errors } = await open(b, 'member', { wait: 1500 });
      await page.goto(page.url().split('#')[0] + '#/grid'); await page.waitForTimeout(700);
      ok(await page.isVisible('.cg-pay[data-act="payView"]'), 'a member can open their payments');
      await page.click('.cg-pay[data-act="payView"] >> nth=0'); await page.waitForTimeout(600);
      ok(await page.isVisible('#modalRoot .sr-kv'), 'the member payment view has a serial row');
      await page.click('#modalRoot [data-act="receiptOpen"]'); await page.waitForTimeout(700);
      ok(await page.isVisible('.rc-card') && await page.$$eval('.rc-card .sig-box', e => e.length) === 2 && await page.isVisible('[data-act="rcSignMe"]'), 'the member receipt opens, with a way to add their signature');
      await shot(page, 'd6-member-receipt');
      ok(!errors.length, 'no page errors ' + errors.join(' | '));
      await ctx.close();
    }
  },
  /* GUIDE: questions about me answered from the records (English and Kiswahili, with typos), memory of recent
     questions, and the verify intent */
  async v020GuideAnswers(b) {
    const Q = [['how much have I paid', 'paid'], ['nimelipa ngapi', 'paid'], ['how much have i payed this year', 'paid'], ['when is my payout', 'mypayout'], ['zamu yangu ni lini', 'mypayout'],
      ['my loan limit', 'limit'], ['how much can I borrow', 'limit'], ['recent actions', 'recent'], ['what is my name', 'name'], ['jina langu', 'name'], ['when did I join', 'joined'], ['nilijiunga lini', 'joined'],
      ['what do I owe', 'owe'], ['my arrears', 'owe'], ['my loan', 'loan'], ['mkopo wangu', 'loan'], ['my fines', 'fines'], ['faini zangu', 'fines'], ['how much is the fine', 'chamafine'], ['my streak', 'streak'],
      ['my rank', 'rank'], ['how many members', 'members'], ['cash on hand', 'cash'], ['advice', 'advice'], ['ushauri', 'advice'], ['when do we pay each month', 'contribution'], ['verify', 'verify'], ['thibitisha', 'verify'], ['check receipt', 'verify']];
    for (const [role, opt] of [['member', {}], ['treasurer', {}], ['secretary', {}], ['member', { dark: true }], ['treasurer', { a11y: { simple: 1 } }]]) {
      const sfx = '-' + role + (opt.dark ? '-dark' : '') + (opt.a11y ? '-simple' : '');
      const { page, ctx, errors } = await open(b, role, { wait: 1400, ...opt });
      if (await page.isVisible('.urgent [data-u="later"]')) { await page.click('.urgent [data-u="later"]'); await page.waitForTimeout(400); }
      await page.evaluate(() => __M_src_features_guide_js.Guide.show()); await page.waitForTimeout(250);
      ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'gdQ'), 'the Guide opens with the keyboard ready' + sfx);
      ok(await page.isVisible('.gd-chip-q.vf[data-gd="verify"]'), 'a Verify chip shows when the Guide opens' + sfx);
      await shot(page, 'g20-open' + sfx);
      if (!opt.dark && !opt.a11y) {
        const wrong = [];
        for (const [q, id] of Q) { await page.fill('#gdQ', q); await page.waitForTimeout(120); const got = await page.evaluate(() => { const a = document.querySelector('.gd-ans'); return a ? a.dataset.ans : ''; }); if (got !== id) wrong.push(q + ' → ' + (got || 'nothing')); }
        ok(!wrong.length, 'questions about me find the right answer' + sfx + ' ' + wrong.join(' | '));
      }
      /* the numbers come from the records */
      await page.fill('#gdQ', 'how much have I paid'); await page.waitForTimeout(150);
      const saved = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(), id = s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId; return __M_src_core_utils_js.kes(__M_src_core_domain_js.Domain.memberSaved(s, id)); });
      ok((await page.textContent('.gd-ans .gd-big')).trim() === saved && await page.isVisible('.gd-ans .gd-go'), 'how much have I paid shows the saved total and one button (' + saved + ')' + sfx);
      await shot(page, 'g21-paid' + sfx);
      await page.fill('#gdQ', 'nimelipa ngapi'); await page.waitForTimeout(150);
      ok((await page.textContent('.gd-ans .gd-big')).trim() === saved, 'nimelipa ngapi gives the same total' + sfx);
      await page.fill('#gdQ', 'when is my payout'); await page.waitForTimeout(150);
      const po = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(), id = s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId, t = __M_src_features_smart_js.Smart.nextTurn(s, id); if (!t) return ''; const [y, m] = t.mk.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }); });
      ok(!!po && (await page.textContent('.gd-ans')).includes(po) && /Place in line/.test(await page.textContent('.gd-ans')), 'when is my payout gives the month (' + po + ') and place in line' + sfx);
      await shot(page, 'g22-payout' + sfx);
      await page.fill('#gdQ', 'my loan limit'); await page.waitForTimeout(150);
      const lim = await page.evaluate(() => { const s = __M_src_core_store_js.Store.get(), id = s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId; return __M_src_core_utils_js.kes(__M_src_features_smart_js.Smart.loanLimit(s, id)); });
      ok((await page.textContent('.gd-ans .gd-big')).trim() === lim, 'my loan limit uses the loan limit rule (' + lim + ')' + sfx);
      await page.fill('#gdQ', 'recent actions'); await page.waitForTimeout(1700);
      ok(await page.evaluate(() => { const n = document.querySelectorAll('.gd-ans .gd-list li').length; return n >= 1 && n <= 5; }), 'recent actions lists up to 5 things about me' + sfx);
      await shot(page, 'g23-recent' + sfx);
      /* memory: the question comes back as a chip next time */
      await page.fill('#gdQ', 'my loan limit'); await page.waitForTimeout(120);
      await page.keyboard.press('Escape'); await page.waitForTimeout(200);
      await page.evaluate(() => __M_src_features_guide_js.Guide.show()); await page.waitForTimeout(250);
      ok(await page.evaluate(() => [...document.querySelectorAll('.gd-mem .gd-chip-q')].map(x => x.dataset.q).slice(0, 2).join('|') === 'my loan limit|recent actions'), 'recent questions show, newest first, after reopening' + sfx);
      await shot(page, 'g24-memory' + sfx);
      await page.click('.gd-mem .gd-chip-q >> nth=1'); await page.waitForTimeout(200);
      ok(await page.isVisible('.gd-ans[data-ans="recent"]'), 'tapping a recent question asks it again' + sfx);
      /* verify */
      await page.fill('#gdQ', 'verify'); await page.waitForTimeout(150);
      await page.click('.gd-ans [data-gd="verify"]'); await page.waitForTimeout(600);
      ok(await page.evaluate(() => !document.querySelector('.gd-veil') && __M_src_features_requests_js.Sheet.isOpen('verify')), 'verify opens the Verify sheet' + sfx);
      await page.evaluate(() => __M_src_features_requests_js.Sheet.close()); await page.waitForTimeout(300);
      await page.evaluate(() => __M_src_features_guide_js.Guide.show()); await page.waitForTimeout(200);
      await page.fill('#gdQ', 'MC-UMOJ-2611-7K3Q-9X'); await page.waitForTimeout(600);
      ok(await page.evaluate(() => __M_src_features_requests_js.Sheet.isOpen('verify') && /MC-UMOJ-2611-7K3Q-9X/.test(document.querySelector('#modalRoot').innerHTML)), 'typing a serial opens Verify with it filled in' + sfx);
      await page.evaluate(() => __M_src_features_requests_js.Sheet.close());
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no sideways scroll at 390px' + sfx);
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
