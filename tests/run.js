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
  await page.addInitScript(([mock, onboard, a11y]) => {
    window.__MOCK = mock;
    try { sessionStorage.setItem('mca-splash', '1'); } catch (e) {}
    if (onboard && !localStorage.getItem('mca-onboard')) localStorage.setItem('mca-onboard', JSON.stringify(onboard));
    if (a11y) localStorage.setItem('chama:a11y', JSON.stringify(a11y));
  }, [opt.mock || sc.mock, sc.onboard, opt.a11y || null]);
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
    await shot(page, '03-privacy');
    ok(await page.isDisabled('[data-ob="accept"]'), 'continue is disabled until both boxes are ticked');
    ok((await page.locator('a[href="legal/privacy.html"]').count()) > 0 && (await page.locator('a[href="legal/terms.html"]').count()) > 0, 'privacy and terms links present');
    await page.click('label.check .box >> nth=0'); await page.click('label.check .box >> nth=1');
    await page.click('[data-ob="accept"]'); await page.waitForTimeout(300);
    await shot(page, '04-start');
    ok(await page.isVisible('[data-act="gateGoogle"]'), 'start screen shows Continue with Google');
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('mca-onboard')));
    ok(st.policy === '2026-11-18-v3' && !!st.agreedAt, 'consent stored with policy version');
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
    await page.fill('#setName', 'Fresh Person'); await page.fill('#setUser', 'fresh'); await page.fill('#gatePw', 'Strong#1'); await page.fill('#gatePw2', 'Strong#1');
    ok((await page.locator('#pwRules li.ok').count()) === 5, 'password rules all tick');
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
    ok((await page.locator('#view .card, #view .list, #view .hero, #view .stats').count()) <= 6, 'home is compact (6 blocks or fewer)');
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
    await page.click('#nav a[data-k="loans"]'); await page.waitForTimeout(400);
    await shot(page, '14-loans');
    await page.click('[data-act="loanMenu"] >> nth=0'); await page.waitForTimeout(400);
    await shot(page, '15-loan-sheet');
    await page.click('#modalRoot [data-act="repay"]'); await page.waitForTimeout(400);
    await page.click('#modalRoot .btn.pri'); await page.waitForTimeout(400);
    ok(/Repayment saved/.test(await page.textContent('#toast')), 'loan repayment recorded');
    await page.click('#nav a[data-k="members"]'); await page.waitForTimeout(400);
    await shot(page, '16-members');
    ok(/Joined by invite code/i.test(await text(page)), 'treasurer sees joined-by-code card');
    await page.click('[data-act="memberMenu"] >> nth=1'); await page.waitForTimeout(400);
    await shot(page, '17-member-sheet');
    await page.click('#modalRoot [data-act="moveMember"]'); await page.waitForTimeout(300);
    const order = await page.evaluate(() => [...document.querySelectorAll('[data-act="memberMenu"] .li-main b')].slice(0, 2).map(x => x.textContent));
    ok(/Otieno/.test(order[0]), 'move up changes payout order');
    await page.click('#nav a[data-k="profile"]'); await page.waitForTimeout(400);
    await shot(page, '18-profile');
    await page.fill('#mePhone', '12345'); await page.click('[data-act="saveMe"]'); await page.waitForTimeout(300);
    ok(await page.isVisible('#popRoot .pop'), 'bad phone number is refused');
    await page.click('#popRoot .pop-btn'); await page.waitForTimeout(250);
    await page.goto(page.url().split('#')[0] + '#/settings'); await page.waitForTimeout(500);
    await shot(page, '19-settings');
    await page.goto(page.url().split('#')[0] + '#/settings/actions'); await page.waitForTimeout(500);
    await shot(page, '20-access');
    ok(/People and access/.test(await text(page)) && /grace@example.com/.test(await text(page)), 'people and access lists invitations');
    await page.fill('#invEmail', 'baraka@example.com'); await page.click('[data-act="invite"]'); await page.waitForTimeout(500);
    ok((await calls(page)).some(x => x.kind === 'fn' && x.name === 'send-invitation' && x.body.email === 'baraka@example.com'), 'invitation sent through send-invitation');
    await page.click('[data-act="codeCreate"]'); await page.waitForTimeout(400);
    ok(/ABCD-EFGH-JK/.test(await text(page)), 'invite code shown once');
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
    await page.fill('#joinLink', 'abcd-efgh-jk'); await page.click('[data-act="wsJoin"]'); await page.waitForTimeout(500);
    ok(/Join this Chama/.test(await page.textContent('body')), 'a valid code shows the confirmation');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
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
    await page.click('[data-act="addMember"] >> nth=0'); await page.waitForTimeout(300);
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
