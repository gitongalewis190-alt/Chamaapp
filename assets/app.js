/* =====================================================================
   My Chama App 0.15.0
   Shared visual vocabulary: one monoline icon family (24px grid, 1.7px stroke),
   monoline illustrations for empty states and onboarding, and the app mark.
   ===================================================================== */
const ICONS = {
  home: '<path d="M3.5 10.6 12 4l8.5 6.6V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.6H9.2v5.6H5A1.5 1.5 0 0 1 3.5 19z"/>',
  grid: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 9.8h17M8.5 3v4M15.5 3v4"/><path d="M8 14.3l2 2 4.2-4.2"/>',
  loans: '<rect x="2.8" y="6.5" width="18.4" height="11" rx="2.6"/><circle cx="12" cy="12" r="2.6"/><path d="M6.3 9.6v4.8M17.7 9.6v4.8"/>',
  members: '<circle cx="9" cy="8.6" r="3.3"/><path d="M3 19.5c.6-3.3 3-5.1 6-5.1s5.4 1.8 6 5.1"/><path d="M15.6 5.6a3.2 3.2 0 0 1 0 6.1M17.6 14.6c1.7.6 2.9 2.2 3.4 4.6"/>',
  profile: '<circle cx="12" cy="8.2" r="3.8"/><path d="M4.5 20.2c.9-3.8 3.8-5.9 7.5-5.9s6.6 2.1 7.5 5.9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  userPlus: '<circle cx="10" cy="8.2" r="3.6"/><path d="M3.5 19.8c.8-3.6 3.4-5.6 6.5-5.6 1.5 0 2.9.4 4 1.3"/><path d="M18.5 13.5v6M15.5 16.5h6"/>',
  wallet: '<path d="M4 7.5h14.5A2 2 0 0 1 20.5 9.5v8.5a2 2 0 0 1-2 2H5.5A2 2 0 0 1 3.5 18V6.8A2.3 2.3 0 0 1 5.8 4.5H16"/><path d="M16 14.2h1.5"/>',
  receipt: '<path d="M6 3.5h12v17l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5L6 19z"/><path d="M9 8.5h6M9 12h6M9 15.5h3.5"/>',
  alert: '<path d="M12 4.2 2.9 19.5h18.2z"/><path d="M12 10v4.2M12 17v.1"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  doc: '<path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5M9.8 12.5h5.5M9.8 16h5.5"/>',
  shield: '<path d="M12 3.5 19 6.3v5.6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6.3z"/><path d="M9 12.2l2 2 4-4"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.8 7.2 12 13l8.2-5.8"/>',
  phone: '<path d="M7.8 3.5h2.4l1.5 4-2 1.3a10.5 10.5 0 0 0 5.5 5.5l1.3-2 4 1.5v2.4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.8 5.7a2 2 0 0 1 2-2.2z"/>',
  chev: '<path d="M9.5 6l6 6-6 6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  pencil: '<path d="M4 20h4L19.2 8.8a2.3 2.3 0 0 0-3.3-3.3L4.8 16.7z"/><path d="M14.3 7.2l3.3 3.3"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7"/>',
  undo: '<path d="M9 14 4.5 9.5 9 5"/><path d="M4.8 9.5H14a5.5 5.5 0 0 1 0 11h-3"/>',
  out: '<path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"/>',
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8M12 3.4c2.4 2.5 3.6 5.4 3.6 8.6s-1.2 6.1-3.6 8.6c-2.4-2.5-3.6-5.4-3.6-8.6S9.6 5.9 12 3.4z"/>',
  bell: '<path d="M6 9.5a6 6 0 0 1 12 0c0 5.6 2.2 7.3 2.2 7.3H3.8S6 15.1 6 9.5Z"/><path d="M10.2 20.2a2 2 0 0 0 3.6 0"/>',
  search: '<circle cx="11" cy="11" r="6.8"/><path d="M20 20l-4.2-4.2"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  download: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"/>',
  share: '<path d="M12 14.5V3.5M8 7.2l4-3.7 4 3.7"/><path d="M8 10.5H6.5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H16"/>',
  chat: '<path d="M20 11.6a7.6 7.6 0 0 1-11.3 6.6L4 19.5l1.4-4.4A7.6 7.6 0 1 1 20 11.6z"/>',
  camera: '<path d="M4 8.5A2 2 0 0 1 6 6.5h1.8L9.5 4h5l1.7 2.5H18a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.8" r="3.4"/>',
  key: '<circle cx="8" cy="15" r="4.2"/><path d="M11 12l8.5-8.5M16.5 6.5l2.5 2.5M14.5 8.5l2 2"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  help: '<circle cx="12" cy="12" r="8.6"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7M12 16.5v.1"/>',
  info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2M12 7.8v.1"/>',
  sun: '<circle cx="12" cy="12" r="3.8"/><path d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5"/>',
  text: '<path d="M4 18.5 8.5 6h1l4.5 12.5M5.6 14h6.8"/><path d="M15.5 12.3a2.6 2.6 0 0 1 4.8 1.2v5M20.3 15.6c-2.6-.4-4.8.2-4.8 1.6 0 1 .8 1.5 1.8 1.5 1.6 0 3-1.1 3-2.6"/>',
  eye: '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="3"/>',
  hand: '<path d="M8 13V5.8a1.6 1.6 0 0 1 3.2 0V12M11.2 11V4.6a1.6 1.6 0 0 1 3.2 0V11M14.4 11V6a1.6 1.6 0 0 1 3.2 0v8.3c0 3.6-2.6 6.2-6 6.2-2.3 0-3.7-.9-5-2.6L4 14.6a1.6 1.6 0 0 1 2.4-2z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M7.5 15.5l3.5-4 3 2.5 5-6.5"/>',
  coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.5"/><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5S14.5 12.4 14.5 11V7"/><path d="M3.5 11v4c0 1.4 2.5 2.5 5.5 2.5 1 0 1.9-.1 2.7-.3"/><ellipse cx="16" cy="14.5" rx="4.5" ry="2"/><path d="M11.5 14.5v3.2c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3.2"/>',
  import: '<path d="M12 3.5v10M8 9.5l4 4 4-4"/><rect x="3.5" y="15" width="17" height="5.5" rx="2"/>',
  scale: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
  swap: '<path d="M7 4.5 3.5 8 7 11.5M3.8 8h13.7"/><path d="M17 12.5l3.5 3.5-3.5 3.5M20.2 16H6.5"/>',
  copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
  sign: '<path d="M3.5 18c2.5 0 3.5-6 5.5-6s1 4 3 4 2-3 3.5-3 1.5 2 5 2"/><path d="M3.5 21h17"/>',
  tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.3 6.3a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.4"/>',
  sparkle: '<path d="M12 20.5v-7.5"/><path d="M12 13c0-4.2 3-6.8 7.2-6.8 0 4.2-3 6.8-7.2 6.8z"/><path d="M12 15.8c0-3.1-2.3-5.3-5.7-5.3 0 3.1 2.3 5.3 5.7 5.3z"/>',
  guide: '<path d="M6 4.5h12a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5h-5.2L8.5 21v-3.5H6A2.5 2.5 0 0 1 3.5 15V7A2.5 2.5 0 0 1 6 4.5z"/><path d="M14.6 8.4l-1.5 4.1-4.1 1.5 1.5-4.1z"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  more: '<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
  speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
};
const icon = (name, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* The mark: a shield holding three rising bars and a growth line. Monoline, drawn on the same 48px grid as the splash. */
const MARK = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4.5 39.5 10.2V23c0 9.4-6.4 16.6-15.5 20.5C14.9 39.6 8.5 32.4 8.5 23V10.2Z"/><path d="M17.5 33v-5.5M23 33v-8.5M28.5 33V21.5"/><polyline class="acc" points="14.5 23.5 20.5 18 24.5 21 32.5 13"/><polyline class="acc" points="27.8 13 32.5 13 32.5 17.7"/></svg>';
const markTile = (cls) => `<span class="mark${cls ? ' ' + cls : ''}">${MARK}</span>`;

/* Monoline illustrations, 160 x 120. One stroke weight, round joins, the accent line in gold. */
const ARTS = {
  mail: '<path d="M30 46h100v56a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6z"/><path d="M30 48l50 34 50-34"/><path d="M44 46V22a4 4 0 0 1 4-4h64a4 4 0 0 1 4 4v24"/><path class="acc" d="M58 32h44M58 40h30"/><path class="soft" d="M14 64h8M10 76h12M138 64h8M138 76h12"/>',
  coins: '<ellipse cx="62" cy="88" rx="30" ry="9"/><path d="M32 88v10c0 5 13.4 9 30 9s30-4 30-9V88"/><path d="M32 76c0-5 13.4-9 30-9s30 4 30 9-13.4 9-30 9-30-4-30-9z"/><path d="M32 76v12M92 76v12"/><ellipse cx="62" cy="62" rx="30" ry="9"/><path d="M32 62v14M92 62v14"/><path class="acc" d="M100 70l14-16 10 8 18-24"/><path class="acc" d="M132 38h10v10"/><path class="soft" d="M18 40h10M23 35v10"/>',
  group: '<circle cx="80" cy="44" r="13"/><path d="M58 92c2-16 10-25 22-25s20 9 22 25"/><circle cx="40" cy="56" r="10"/><path d="M22 96c1.5-12 8-19 18-19 5 0 9 1.8 12 5"/><circle cx="120" cy="56" r="10"/><path d="M138 96c-1.5-12-8-19-18-19-5 0-9 1.8-12 5"/><path class="acc" d="M50 104c20 8 40 8 60 0"/><path class="soft" d="M76 18l4-6 4 6"/>',
  ledger: '<path d="M80 30c-12-8-30-10-50-8v70c20-2 38 0 50 8 12-8 30-10 50-8V22c-20-2-38 0-50 8z"/><path d="M80 30v70"/><path d="M42 42h24M42 54h24M42 66h18"/><path class="acc" d="M94 50l7 7 14-15"/><path d="M94 74h24M94 84h16"/>',
  shield: '<path d="M80 14l40 14v26c0 25-17 43-40 52-23-9-40-27-40-52V28z"/><path class="acc" d="M64 60l11 11 22-24"/><path class="soft" d="M22 50h10M128 50h10M26 34l6 4M134 34l-6 4"/>',
  receipt: '<path d="M50 14h60v92l-10-6-10 6-10-6-10 6-10-6-10 6z"/><path d="M62 34h36M62 48h36M62 62h22"/><path class="acc" d="M62 80h16M90 80h8"/><path class="soft" d="M28 40h10M122 40h10M33 35v10"/>',
  loan: '<path d="M22 86h18l14 6h22a6 6 0 0 0 0-12H62"/><path d="M40 82l18-8c6-2 10 0 14 2l26 12c5 2 9-2 7-6"/><path d="M22 78v18"/><circle class="acc" cx="104" cy="44" r="20"/><path class="acc" d="M104 34v20M98 39c0-3 3-5 6-5s6 2 6 5-3 4-6 5-6 2-6 5 3 5 6 5 6-2 6-5"/>',
  done: '<circle cx="80" cy="60" r="34"/><path class="acc" d="M64 60l11 11 21-23"/><path class="soft" d="M30 30l6 6M130 30l-6 6M24 84h10M126 84h10M80 12v8"/>',
  invite: '<path d="M26 44h84v54a5 5 0 0 1-5 5H31a5 5 0 0 1-5-5z"/><path d="M26 46l42 30 42-30"/><circle class="acc" cx="122" cy="40" r="12"/><path class="acc" d="M104 74c2-10 9-16 18-16s16 6 18 16"/><path class="soft" d="M14 30h8M18 26v8"/>',
  key: '<circle cx="56" cy="72" r="20"/><circle cx="56" cy="72" r="7"/><path d="M71 59l46-46M104 26l10 10M94 36l8 8"/><path class="acc" d="M96 82h36M96 94h24"/>',
  lost: '<path d="M44 88h68a20 20 0 0 0 2-40 28 28 0 0 0-54-4 22 22 0 0 0-16 44z"/><path class="acc" d="M66 64l20 20M86 64l-20 20"/><path class="soft" d="M24 102h112"/>',
  people: '<circle cx="62" cy="48" r="14"/><path d="M36 100c2-18 12-28 26-28s24 10 26 28"/><circle class="acc" cx="108" cy="58" r="10"/><path class="acc" d="M92 100c1.5-12 7.5-19 16-19s14.5 7 16 19"/>',
};
const art = name => `<svg viewBox="0 0 160 120" aria-hidden="true">${ARTS[name] || ''}</svg>`;
const emptyState = (name, title, text, btn) => `<div class="empty"><div class="art">${art(name)}</div><h3>${title}</h3>${text ? `<p>${text}</p>` : ''}${btn || ''}</div>`;

const GOOGLE_G = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C.9 16.3 0 20 0 24s.9 7.7 2.6 10.8l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.2-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';

/* Loading placeholder: only while the Chama is genuinely loading, never as a timed delay */
const Skel = {
  page() { return '<div aria-busy="true" aria-label="Loading"><div class="sk sk-hero"></div><div class="sk sk-row"></div><div class="sk sk-row"></div><div class="sk sk-row" style="width:72%"></div></div>'; }
};

/* The old typed welcome overlay is retired: the greeting now lives at the top of Home.
   The object keeps its method names, so every existing caller still works. */
const Welcome = {
  splashDone: false,
  bind() { const sp = document.getElementById('splash'); if (!sp || sp.classList.contains('gone')) this.splashDone = true; },
  onSplashDone() { this.splashDone = true; },
  start() {}, markReady() {}, tryReveal() {}, hide() {}
};
document.addEventListener('mca:splash-done', () => Welcome.onSplashDone());

/* Time-of-day greeting in the person's language (English and Kiswahili) */
function greeting(lang) {
  const h = new Date().getHours();
  if (lang === 'sw') return h < 12 ? 'Habari ya asubuhi' : h < 17 ? 'Habari ya mchana' : 'Habari ya jioni';
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/* ---- src/config.js ---- */
const __M_src_config_js = (function () {

/* =====================================================================
   0. CONFIG
   Cloud mode uses Supabase: set supabase to { url, anonKey } (the anon key is safe to publish;
   Row Level Security protects the data). Set supabase to null for local demo mode
   (data stays in this browser). Setup steps: SETUP_GUIDE.md. Multiple chamas: open the page with ?c=<id>
   ===================================================================== */
const CONFIG = {
  firebase: null /* { apiKey:'', authDomain:'', projectId:'', appId:'' } */,
  supabase: { url: 'https://sgfvjsxmchohawhqraii.supabase.co', anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZnZqc3htY2hvaGF3aHFyYWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODAxMjcsImV4cCI6MjEwODg1NjEyN30.VdnDy-LWejTZB76mljZ2vnSpjhIAOWRsOTjfOcmVsgc' },
  defaultPin: '1234'
};

return { get CONFIG() { return CONFIG; }, };
})();

/* ---- src/lib/dom.js ---- */
const __M_src_lib_dom_js = (function () {

/* =====================================================================
   1. UTILS
   ===================================================================== */
const $ = s => document.querySelector(s);

const restart = (el, c) => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); };

return { get $() { return $; }, get restart() { return restart; }, };
})();

/* ---- src/ui/toast.js ---- */
const __M_src_ui_toast_js = (function () {
const { $ } = __M_src_lib_dom_js;

let toastLong = false;
const setToastLong = v => { toastLong = !!v; };

const TOAST_KIND = msg => /fail|error|not right|not saved|not sent|not recorded|not allowed|not enough|please|cannot|can.t|already|enough|full|look right|should look|choose a|choose your|blocked|invalid|wrong|missing|must be|only the|type your|type the|give a|say what|too many|too large|more than|does not|did not|could not|is not/i.test(msg) ? 'bad'
  : /saved|done|added|removed|recorded|signed|undid|normal|restored|copied|exported|created|updated|sent/i.test(msg) ? 'ok' : 'info';

const esc_ = x => String(x == null ? '' : x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Sounds are synthesised in the browser (no audio files). Off unless the person turns them on (Settings, Display: 'mca-sfx' = 'on').
   Even when on, there is no click sound: only a soft chime when something important succeeds or fails. */
const Sfx = (() => {
  let ctx = null;
  const on = () => { try { return localStorage.getItem('mca-sfx') === 'on'; } catch (e) { return false; } };
  const ac = () => {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ctx = new C(); } catch (e) { return null; } }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  };
  const tone = (f, t0, dur, vol, type) => {
    const c = ac(); if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    } catch (e) {}
  };
  const bell = (f, t0, dur, vol) => { tone(f, t0, dur, vol); tone(f * 2.76, t0, dur * 0.5, vol * 0.22); tone(f * 5.4, t0, dur * 0.25, vol * 0.08); };
  return {
    get enabled() { return on(); },
    unlock() { if (on()) ac(); },
    tap() {},
    pop() {},
    /* approval: two rising bell strikes, short and bright */
    ok() { if (on()) { bell(1318.5, 0, 0.5, 0.15); bell(1975.5, 0.12, 0.95, 0.13); } },
    no() { if (on()) { tone(196, 0, 0.14, 0.11); tone(155.6, 0.14, 0.24, 0.11); } }
  };
})();

/* Centred popups on their own element (#popRoot). Alerts stay until the person taps Understood. */
const POP_WARN = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS.alert + '</svg>';
const POP_ASK = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS.help + '</svg>';
const POP_OK = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS.check + '</svg>';
const Pop = {
  q: [], cur: null, prev: null,
  alert(text, o = {}) {
    const t = String(text);
    if ((this.cur && this.cur.kind === 'alert' && this.cur.text === t) || this.q.some(x => x.kind === 'alert' && x.text === t)) return;
    this.push({ kind: 'alert', calm: !!o.calm, title: o.title || '', text: t, html: o.html || '', buttons: [{ label: o.label || 'OK', primary: true, yes: true }], onYes: o.onYes });
  },
  confirm(o) {
    const yes = { label: o.confirmLabel || 'Continue', primary: true, yes: true, danger: !!o.danger };
    this.push({ kind: 'confirm', title: o.title || 'Are you sure?', text: o.text || '', html: o.html || '', danger: !!o.danger,
      buttons: o.hideCancel ? [yes] : [{ label: o.cancelLabel || 'Cancel', no: true }, yes], onYes: o.onYes, onNo: o.onNo });
  },
  push(spec) { this.q.push(spec); if (!this.cur) this.next(); },
  next() {
    const s = this.q.shift(); if (!s) { this.cur = null; return; }
    this.cur = s; this.prev = document.activeElement;
    let root = document.getElementById('popRoot');
    if (!root) { root = document.createElement('div'); root.id = 'popRoot'; document.body.appendChild(root); }
    const body = s.html ? s.html : (s.text ? '<p>' + esc_(s.text) + '</p>' : '');
    root.innerHTML = '<div class="pop-veil"><div class="pop ' + s.kind + (s.danger ? ' danger' : '') + (s.calm ? ' calm' : '') + '" role="alertdialog" aria-modal="true"' + (s.title ? ' aria-labelledby="popT"' : '') + ' aria-describedby="popB">'
      + '<div class="pop-ic">' + (s.calm ? POP_OK : s.kind === 'confirm' && !s.danger ? POP_ASK : POP_WARN) + '</div>'
      + (s.title ? '<h3 class="pop-t" id="popT">' + esc_(s.title) + '</h3>' : '')
      + '<div class="pop-b" id="popB">' + body + '</div>'
      + '<div class="pop-act">' + s.buttons.map((b, i) => '<button type="button" class="pop-btn' + (b.primary ? ' pri' : '') + (b.danger ? ' bad' : '') + '" data-i="' + i + '">' + esc_(b.label) + '</button>').join('') + '</div></div></div>';
    root.onclick = e => { const b = e.target.closest && e.target.closest('.pop-btn'); if (b) this.done(s, s.buttons[+b.dataset.i]); };
    this._key = e => {
      if (e.key === 'Escape') { e.preventDefault(); this.done(s, s.buttons[0]); }
      else if (e.key === 'Tab') { const bs = [...root.querySelectorAll('.pop-btn')]; if (!bs.length) return; const i = bs.indexOf(document.activeElement); e.preventDefault(); bs[(i + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus(); }
    };
    document.addEventListener('keydown', this._key, true);
    const first = s.danger && s.buttons.length > 1 ? root.querySelector('.pop-btn') : (root.querySelector('.pop-btn.pri') || root.querySelector('.pop-btn'));
    if (first) first.focus();
  },
  done(s, b) {
    if (this.cur !== s) return;
    document.removeEventListener('keydown', this._key, true);
    const root = document.getElementById('popRoot'), veil = root && root.firstElementChild;
    if (veil) veil.classList.add('out');
    this.cur = null;
    setTimeout(() => {
      if (root && !this.cur) root.innerHTML = '';
      try { if (this.prev && this.prev.focus && document.contains(this.prev)) this.prev.focus(); } catch (e) {}
      try {
        if (b && b.yes && s.onYes) { const r = s.onYes(); if (r && r.catch) r.catch(err => toast(err.message)); }
        else if (b && b.no && s.onNo) s.onNo();
      } catch (err) { toast(err.message); }
      if (!this.cur) this.next();
    }, 170);
  }
};

/* Toasts are neutral (no colour) and stay until dismissed or 7 s. Warnings and errors open a centred alert instead. */
let toastTimer = 0, toastAct = null;
const hideToast = () => { clearTimeout(toastTimer); const t = $('#toast'); if (t) t.classList.remove('on'); };
const toast = (msg, kind, opt) => {
  const k = kind || TOAST_KIND(msg);
  if (k === 'bad') return Pop.alert(msg, { title: /connection|internet|reach|offline/i.test(msg) ? 'Connection problem' : 'Please check' });
  const t = $('#toast'); if (!t) return;
  const o = opt || {}; toastAct = o.run || null;
  const ms = toastLong ? 14000 : o.label ? 6500 : 4200;
  t.className = '';
  void t.offsetWidth;
  t.className = 'on k-' + k;
  t.innerHTML = '<span class="t-ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + (k === 'ok' ? '<path d="M5 12.5l4.5 4.5L19 7.5"/>' : ICONS.info) + '</svg></span><span class="tmsg">' + esc_(msg) + '</span>'
    + (o.label ? '<button type="button" class="tbtn" data-t="act">' + esc_(o.label) + '</button>' : '')
    + '<button type="button" class="tbtn tx" data-t="x" aria-label="Dismiss"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg></button><i class="t-bar" style="animation-duration:' + ms + 'ms" aria-hidden="true"></i>';
  clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, ms);
};
document.addEventListener('pointerenter', e => { if (e.target && e.target.id === 'toast') clearTimeout(toastTimer); }, true);
document.addEventListener('pointerleave', e => { if (e.target && e.target.id === 'toast' && e.target.classList.contains('on')) { clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 1800); } }, true);
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#toast .tbtn'); if (!b) return;
  const run = b.dataset.t === 'act' ? toastAct : null; hideToast(); if (run) run();
});

return { get toastLong() { return toastLong; }, get setToastLong() { return setToastLong; }, get TOAST_KIND() { return TOAST_KIND; }, get toast() { return toast; }, get Pop() { return Pop; }, get Sfx() { return Sfx; }, get hideToast() { return hideToast; }, };
})();

/* ---- src/core/a11y.js ---- */
const __M_src_core_a11y_js = (function () {
const { $ } = __M_src_lib_dom_js;
const { setToastLong, toast } = __M_src_ui_toast_js;

const A11y = {
  key: 'chama:a11y', def: { size: 'n', theme: 'auto', accent: 'green', simple: 0, hc: 0, cb: 0, ft: 0, sp: 0, ul: 0, tg: 0, rm: 0, long: 0, read: 0 }, d: {},
  load() {
    let o = {}; try { o = JSON.parse(localStorage.getItem(this.key) || '{}') || {}; } catch {}
    if (!o.size && localStorage.getItem('chama:textsize') === 'large') o.size = 'l';
    this.d = { ...this.def, ...o }; this.apply();
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch { toast('Storage full'); } this.apply(); },
  apply() {
    setToastLong(this.d.long);
    const h = document.documentElement, d = this.d, dark = d.theme === 'dark' || (d.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    h.dataset.size = d.size; h.dataset.mode = dark ? 'dark' : 'light'; h.classList.toggle('hc', !!d.hc);
    if (d.accent && d.accent !== 'green') h.dataset.accent = d.accent; else delete h.dataset.accent;
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#090c0b' : '#f3f4f1'));
    ['cb', 'ft', 'sp', 'ul', 'tg', 'rm', 'simple'].forEach(k => h.classList.toggle('a-' + k, !!d[k]));
    const ra = $('#ra'); if (ra) ra.hidden = !(d.read && 'speechSynthesis' in window);
  },
  refocus(sel) { const e = document.querySelector(sel); if (e) e.focus(); }
};

return { get A11y() { return A11y; }, };
})();

/* ---- src/core/policy.js ---- */
const __M_src_core_policy_js = (function () {

/* Write permission. session.js attaches the real check at start-up, so store.js never imports session.js. */
const Policy = { canWrite: () => false };

return { get Policy() { return Policy; }, };
})();

/* ---- src/core/backend.js ---- */
const __M_src_core_backend_js = (function () {

/* =====================================================================
   5. SIGN-IN AND ACCESS
   The chama record is readable only by its active members and writable only
   by its treasurer (enforced by Row Level Security in Supabase).
   The app decides what to show from the membership row, not from a local choice.
   ===================================================================== */
const Backend = { sb: null };

/* supabase-js is served from this site (vendor/), pinned to 2.45.4, so no third-party script runs with the session */
const loadLib = () => window.supabase && window.supabase.createClient ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'vendor/supabase-2.45.4.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });

return { get Backend() { return Backend; }, get loadLib() { return loadLib; }, };
})();

/* ---- src/core/rerender.js ---- */
const __M_src_core_rerender_js = (function () {

/* Lets any module ask for a redraw without importing the renderer (the renderer imports the features,
   and the features need to redraw, so a direct import would form a cycle). main.js binds the real one. */
let impl = () => {};
const bindRender = fn => { impl = fn; };
const render = () => impl();



return { get bindRender() { return bindRender; }, get render() { return render; }, };
})();

/* ---- src/core/utils.js ---- */
const __M_src_core_utils_js = (function () {

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const uid = () => Math.random().toString(36).slice(2, 10);

const kes = n => 'KES ' + Math.round(n || 0).toLocaleString('en-KE');

const monthKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

const addMonths = (k, n) => { const [y, m] = k.split('-').map(Number); return monthKey(new Date(y, m - 1 + n, 1)); };

const monthDiff = (a, b) => { const [ya, ma] = a.split('-').map(Number), [yb, mb] = b.split('-').map(Number); return (yb - ya) * 12 + (mb - ma); };

const monthLabel = k => { const [y, m] = k.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'short', year: '2-digit' }); };

const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);

const waLink = (phone, text) => {
  let p = String(phone || '').replace(/\D/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  else if (p.length === 9) p = '254' + p;
  return 'https://wa.me/' + p + '?text=' + encodeURIComponent(text);
};

return { get esc() { return esc; }, get uid() { return uid; }, get kes() { return kes; }, get monthKey() { return monthKey; }, get addMonths() { return addMonths; }, get monthDiff() { return monthDiff; }, get monthLabel() { return monthLabel; }, get todayISO() { return todayISO; }, get sum() { return sum; }, get waLink() { return waLink; }, };
})();

/* ---- src/core/domain.js ---- */
const __M_src_core_domain_js = (function () {
const { addMonths, monthDiff, monthKey, sum } = __M_src_core_utils_js;

/* =====================================================================
   3. DOMAIN  (pure functions, no DOM)
   ===================================================================== */
const Domain = {
  now: () => monthKey(new Date()),
  joinMonth: (s, mid) => { const m = s.members.find(x => x.id === mid); return (m && m.joined) || s.chama.startMonth; },
  /* a member who left is owed nothing for months after they left (their past stays in the books) */
  leftMonth: (s, mid) => ((s.members.find(m => m.id === mid) || {}).left) || null,
  active: s => (s.members || []).filter(m => !m.left),
  rate: (s, mid) => s.chama.monthly * ((s.members.find(m => m.id === mid) || {}).shares || 1),
  dueFor(s, mid, mk = Domain.now()) { const l = this.leftMonth(s, mid); return l && mk > l ? 0 : this.rate(s, mid); },
  paidIn: (s, mid, mk) => sum(s.payments.filter(p => p.memberId === mid && p.month === mk), p => p.amount),
  /* cumulative: everything owed from joining through month mk, and everything paid for months up to mk */
  dueThrough(s, mid, mk) { const j = this.joinMonth(s, mid), l = this.leftMonth(s, mid), end = l && l < mk ? l : mk; return end < j ? 0 : this.rate(s, mid) * (monthDiff(j, end) + 1); },
  paidThrough: (s, mid, mk) => sum(s.payments.filter(p => p.memberId === mid && p.month <= mk), p => p.amount),
  outstanding(s, mid, mk) { return Math.max(0, this.dueThrough(s, mid, mk) - this.paidThrough(s, mid, mk)); },
  isOverdue(s, mk) {
    const cur = this.now();
    return mk < cur || (mk === cur && new Date().getDate() > s.chama.dueDay);
  },
  status(s, mid, mk) {
    if (mk < this.joinMonth(s, mid)) return 'na';
    { const l = this.leftMonth(s, mid); if (l && mk > l) return 'na'; }
    if (this.paidThrough(s, mid, mk) >= this.dueThrough(s, mid, mk)) return 'paid';
    if (mk > this.now()) return 'future';
    const paid = this.paidIn(s, mid, mk);
    if (this.isOverdue(s, mk)) return paid > 0 ? 'partial' : 'late';
    return paid > 0 ? 'partial' : 'due';
  },
  lateMembers(s, mk = this.now()) {
    if (s.shared || !this.isOverdue(s, mk)) return [];   /* members never see who else is late (D3) */
    return s.members.filter(m => !(m.left && mk > m.left) && this.outstanding(s, m.id, mk) > 0);
  },
  memberSaved: (s, mid) => sum(s.payments.filter(p => p.memberId === mid), p => p.amount),
  /* money paid beyond everything owed up to month mk (an advance) */
  ahead(s, mid, mk = Domain.now()) { return Math.max(0, this.paidThrough(s, mid, '9999-12') - this.dueThrough(s, mid, mk)); },
  /* the first month from mk on that is not yet fully covered: extra money is recorded there and carries forward */
  firstUncovered(s, mid, mk = Domain.now()) {
    let k = mk; for (let i = 0; i < 60; i++, k = addMonths(k, 1)) if (this.paidThrough(s, mid, k) < this.dueThrough(s, mid, k)) return k;
    return k;
  },
  /* months in a row, counting back from the last closed month, that were fully paid by their due day */
  streak(s, mid) {
    let n = 0, mk = this.isOverdue(s, this.now()) ? this.now() : addMonths(this.now(), -1);
    for (let i = 0; i < 60; i++, mk = addMonths(mk, -1)) {
      if (mk < this.joinMonth(s, mid)) break;
      if (this.paidThrough(s, mid, mk) >= this.dueThrough(s, mid, mk)) n++; else break;
    }
    return n;
  },
  /* the member's tier, which colours their card on Home. Checked in this order:
     late   red       the due day has passed and money is still owed
     part   amber     something was paid this month, but not all of it
     due    silver    the month is open, nothing paid yet, the due day has not passed
     gold   gold      paid, and it is their payout month, or 6+ months on time in a row with no unpaid fines
     ahead  purple    paid, with extra that already covers coming months
     paid   green     this month is paid
     idle   graphite  nothing is due (not joined yet, or left) */
  tone(s, mid, mk = Domain.now()) {
    if (!mid) return 'idle';
    const st = this.status(s, mid, mk);
    if (st === 'na' || st === 'future') return 'idle';
    if (st === 'late') return 'late';
    if (st === 'partial') return this.isOverdue(s, mk) && this.paidIn(s, mid, mk) === 0 ? 'late' : 'part';
    if (st === 'due') return 'due';
    const r = this.recipient(s, mk);
    if (r && r.id === mid) return 'gold';
    if (this.ahead(s, mid, mk) > 0) return 'ahead';
    if (this.streak(s, mid) >= 6 && !this.memberFinesDue(s, mid)) return 'gold';
    return 'paid';
  },
  /* money is rounded to the cent, so 3,000 at 5% for 2 months is exactly 3,300 and a full repayment clears it */
  loan(l) {
    const r2 = x => Math.round((Number(x) || 0) * 100) / 100;
    const total = r2(l.principal * (1 + (l.rate / 100) * l.months));
    const paid = r2(sum(l.repayments || [], r => r.amount));
    return { total, paid, balance: Math.max(0, r2(total - paid)), installment: r2(total / (l.months || 1)) };
  },
  memberLoanBalance: (s, mid) => sum(s.loans.filter(l => l.memberId === mid), l => Domain.loan(l).balance),
  memberFinesDue: (s, mid) => sum(s.fines.filter(f => f.memberId === mid && !f.paid), f => f.amount),
  cashOnHand: s => s.shared ? s.shared.cashOnHand : sum(s.payments, p => p.amount) + sum(s.fines.filter(f => f.paid), f => f.amount)
    + sum(s.loans, l => sum(l.repayments, r => r.amount)) - sum(s.loans, l => l.principal) - sum(s.payouts, p => p.amount) - sum(s.expenses, e => e.amount),
  /* a recorded payout is the truth for its month; the rotation only fills months with no payout yet */
  recipient(s, mk = Domain.now()) {
    const p = s.payouts.find(x => x.month === mk);
    if (p) return s.members.find(m => m.id === p.memberId) || { id: p.memberId, name: 'Removed member' };
    const n = s.members.length; if (!n) return null;
    let i = ((monthDiff(s.chama.startMonth, mk) % n) + n) % n;
    for (let k = 0; k < n && s.members[i].left && mk > s.members[i].left; k++) i = (i + 1) % n;
    return s.members[i];
  },
  memberName: (s, id) => (s.members.find(m => m.id === id) || { name: 'Removed member' }).name,
  reliability(s, mid) {
    const cur = this.now(); let ok = 0, n = 0;
    for (let i = 5; i >= 0; i--) {
      const mk = addMonths(cur, -i);
      if (!this.isOverdue(s, mk) || mk < this.joinMonth(s, mid)) continue;
      n++; if (this.paidThrough(s, mid, mk) >= this.dueThrough(s, mid, mk)) ok++;
    }
    return n ? Math.round(ok / n * 100) : null;
  }
};

return { get Domain() { return Domain; }, };
})();

/* ---- src/core/hooks.js ---- */
const __M_src_core_hooks_js = (function () {

/* Late-bound hooks. Core modules call these functions; the feature that handles the call is attached once at start-up
   (main.js). This keeps core -> feature imports out of the dependency graph, so no import cycles form. */
let changeHandler = (a, b) => {};
const bindChangeHandler = fn => { changeHandler = fn; };
const notifyChange = (a, b) => changeHandler(a, b);

return { get bindChangeHandler() { return bindChangeHandler; }, get notifyChange() { return notifyChange; }, };
})();

/* ---- src/core/log.js ---- */
const __M_src_core_log_js = (function () {
const { Domain } = __M_src_core_domain_js;
const { kes, monthLabel, uid } = __M_src_core_utils_js;
const { notifyChange } = __M_src_core_hooks_js;

/* =====================================================================
   4. UI KIT  (modal + form builder)
   ===================================================================== */
const fmtVal = v => (v === '' || v == null) ? '(empty)' : typeof v === 'number' ? v.toLocaleString('en-KE') : String(v);


/* Audit trail: every commit is diffed automatically, so any new feature is logged for free */
const Log = {
  coll: { members: 'member', payments: 'payment', loans: 'loan', fines: 'fine', payouts: 'payout', expenses: 'expense' },
  label(c, it, s) {
    const who = it.memberId ? Domain.memberName(s, it.memberId) : (it.name || '');
    const amt = it.amount != null ? ' ' + kes(it.amount) : it.principal != null ? ' ' + kes(it.principal) : '';
    const extra = it.month ? ' for ' + monthLabel(it.month) : it.title ? ' ' + it.title : '';
    return `${this.coll[c]}: ${who}${amt}${extra}`.replace(': ,', ':');
  },
  record(a, b) {
    const out = [], fv = (k, v, st) => k === 'memberId' ? Domain.memberName(st, v) : k === 'sig' ? (v ? 'signed' : '(none)') : fmtVal(v), kn = k => k === 'memberId' ? 'member' : k;
    Object.keys(this.coll).forEach(c => {
      const A = new Map((a[c] || []).map(x => [x.id, x])), B = new Map((b[c] || []).map(x => [x.id, x]));
      B.forEach((x, id) => {
        if (!A.has(id)) out.push({ kind: 'add', text: 'Added ' + this.label(c, x, b) });
        else if (JSON.stringify(A.get(id)) !== JSON.stringify(x)) {
          const old = A.get(id), ch = Object.keys(x).filter(k => k !== 'id' && k !== 'aliases' && k !== 'phones' && JSON.stringify(old[k]) !== JSON.stringify(x[k]));
          if (ch.length) out.push({ kind: 'edit', text: 'Edited ' + this.label(c, x, b), diff: ch.map(k => `${kn(k)}: ${fv(k, old[k], a)} → ${fv(k, x[k], b)}`) });
        }
      });
      A.forEach((x, id) => { if (!B.has(id)) out.push({ kind: 'del', text: 'Removed ' + this.label(c, x, a) }); });
    });
    const ch = Object.keys(b.chama).filter(k => k !== 'pin' && JSON.stringify(a.chama[k]) !== JSON.stringify(b.chama[k]));
    if (ch.length) out.push({ kind: 'edit', text: 'Changed chama settings', diff: ch.map(k => `${k}: ${fmtVal(a.chama[k])} → ${fmtVal(b.chama[k])}`) });
    if (a.chama.pin !== b.chama.pin) out.push({ kind: 'edit', text: 'Changed the treasurer PIN' });
    const ts = Date.now();
    notifyChange(a, b);
    b.log = [...out.map(o => ({ id: uid(), ts, by: 'Treasurer', ...o })), ...(b.log || [])].slice(0, 300);
  }
};

return { get fmtVal() { return fmtVal; }, get Log() { return Log; }, };
})();

/* ---- src/core/store.js ---- */
const __M_src_core_store_js = (function () {
const { Backend } = __M_src_core_backend_js;
const { Domain } = __M_src_core_domain_js;
const { Log } = __M_src_core_log_js;
const { Policy } = __M_src_core_policy_js;
const { monthKey, uid } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { toast } = __M_src_ui_toast_js;

/* =====================================================================
   2. STORE  (one adapter, two backends: Firestore or localStorage)
   ===================================================================== */
const Store = (() => {
  const chamaId = (new URLSearchParams(location.search).get('c') || '').replace(/[^\w-]/g, '');   /* no default Chama (A7) */
  const subs = []; let state = null, ref = null;
  const blank = () => ({
    chama: { name: 'My Chama', monthly: 2000, dueDay: 10, finePerLate: 100, loanRate: 10, startMonth: monthKey(new Date()), payTo: '', mode: 'rotation' },
    members: [], payments: [], loans: [], fines: [], payouts: [], expenses: [], log: []
  });
  const emit = () => subs.forEach(f => f(state));
  const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const normalise = s => { const b = blank(); return { ...b, ...s, chama: { ...b.chama, ...(s.chama || {}) } }; };

  /* ---- Cloud backend (Supabase). A signed-in member reads the chama; only a treasurer writes it. RLS enforces this on the server. ---- */
  let pushing = false, remoteVersion = null, limited = false, conflictOpen = false, conflictHandler = null, lastViewVersion = null;
  const dirtyKey = 'chama:' + chamaId + ':dirty', localKey = 'chama:' + chamaId, verKey = 'chama:' + chamaId + ':ver';
  const setSync = v => {
    const bar = $('#syncBar'); if (!bar) return;
    bar.hidden = v === 'online';
    bar.textContent = Backend.sb ? 'Offline. Changes are kept on this phone and will send when you are back online.' : 'You are offline. Everything is saved on this phone.';
  };
  const saveLocal = () => { try { localStorage.setItem(localKey, JSON.stringify(state)); } catch { toast('Storage full'); } };
  const cleanCopy = s => { const c = JSON.parse(JSON.stringify(s)); if (c.chama) delete c.chama.pin; return c; };
  const getView = async () => { const r = await Backend.sb.rpc('get_chama_view', { cid: chamaId }); if (r.error) throw r.error; return r.data; };
  const noteVersion = v => { remoteVersion = v == null ? null : Number(v); try { if (remoteVersion !== null) localStorage.setItem(verKey, String(remoteVersion)); } catch (e) { /* storage full: the next save will ask again */ } };
  /* Two people saved over the same version. Nothing is overwritten until the treasurer chooses. */
  function askConflict(remote) {
    if (conflictOpen) return; conflictOpen = true;
    const done = () => { conflictOpen = false; };
    const info = {
      remote,
      useTheirs() { state = normalise(remote.data); noteVersion(remote.version); saveLocal(); localStorage.removeItem(dirtyKey); emit(); setSync('online'); done(); toast('Loaded the latest version. Your unsent changes were dropped.'); },
      keepMine() { noteVersion(remote.version); localStorage.setItem(dirtyKey, '1'); done(); pushSb(); }
    };
    if (conflictHandler) conflictHandler(info); else info.useTheirs();
  }
  async function pushSb() {
    if (pushing || conflictOpen || !Backend.sb) return;
    if (!Policy.canWrite()) { localStorage.removeItem(dirtyKey); return; }
    pushing = true;
    try {
      while (localStorage.getItem(dirtyKey)) {
        const snap = cleanCopy(state); localStorage.removeItem(dirtyKey);
        let q = Backend.sb.from('chamas').update({ data: snap, updated_at: new Date().toISOString() }).eq('id', chamaId);
        if (remoteVersion !== null) q = q.eq('version', remoteVersion);
        const { data, error } = await q.select(remoteVersion !== null ? 'id,version' : 'id');
        if (error) { localStorage.setItem(dirtyKey, '1'); throw error; }
        if (!data || !data.length) {
          localStorage.setItem(dirtyKey, '1');
          let remote = null; try { remote = await getView(); } catch (e) { /* offline: try again later */ }
          if (remote && remoteVersion !== null && Number(remote.version) !== remoteVersion) askConflict(remote);
          else if (remote) { localStorage.removeItem(dirtyKey); toast('Not saved. Check that you are still the treasurer.'); }
          break;
        }
        if (remoteVersion !== null && data[0].version != null) noteVersion(data[0].version);
      }
      setSync('online');
    } catch (e) { setSync('offline'); }
    pushing = false;
  }
  async function startSync() {
    let loaded = false, view = null;
    try { view = await getView(); } catch (e) { view = null; }
    if (view) {
      limited = !!view.limited;
      const localRaw = (() => { try { return localStorage.getItem(localKey); } catch (e) { return null; } })();
      const unsent = !limited && Policy.canWrite() && localStorage.getItem(dirtyKey) && localRaw;
      if (unsent) {
        /* this phone holds changes that never reached the cloud: keep them, and only overwrite if the treasurer says so */
        state = normalise(JSON.parse(localRaw)); loaded = true;
        const base = localStorage.getItem(verKey);
        if (base !== null && Number(base) === Number(view.version)) noteVersion(view.version);
        else { noteVersion(view.version); localStorage.removeItem(dirtyKey); localStorage.setItem(dirtyKey, '1'); setTimeout(() => askConflict(view), 0); }
      } else {
        state = normalise(view.data);
        if (limited) { state.shared = { ...(state.shared || {}), me: view.member_id || null }; lastViewVersion = view.version; }
        else noteVersion(view.version);
        saveLocal(); loaded = true;
      }
    } else if (Policy.canWrite()) {
      try { const { data, error } = await Backend.sb.from('chamas').select('data').eq('id', chamaId).maybeSingle(); if (!error && data) { state = normalise(data.data); saveLocal(); loaded = true; } } catch (e) { loaded = false; }
    }
    if (!loaded) { try { const l = localStorage.getItem(localKey); if (l) state = normalise(JSON.parse(l)); } catch {} }
    if (!state) state = blank();
    emit();
    setSync(loaded ? 'online' : 'offline');
    if (loaded && !conflictOpen && Policy.canWrite() && localStorage.getItem(dirtyKey)) pushSb();
    if (limited) {
      /* members cannot receive live row changes (they may not read the full row), so they refresh by themselves */
      const refresh = async () => {
        try {
          const v = await getView(); setSync('online');
          if (v && v.version !== lastViewVersion) {
            const next = normalise(v.data); next.shared = { ...(next.shared || {}), me: v.member_id || null };
            lastViewVersion = v.version;
            if (state && JSON.stringify(cleanCopy(state)) === JSON.stringify(cleanCopy(next))) return;
            state = next; saveLocal(); emit();
          }
        } catch (e) { setSync('offline'); }
      };
      setInterval(() => { if (!document.hidden) refresh(); }, 20000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
      addEventListener('online', refresh);
    } else {
      Backend.sb.channel('c-' + chamaId).on('postgres_changes', { event: '*', schema: 'public', table: 'chamas', filter: 'id=eq.' + chamaId }, p => {
        if (localStorage.getItem(dirtyKey) || pushing || conflictOpen || !p.new) return;
        const next = normalise(p.new.data);
        if (p.new.version != null) noteVersion(p.new.version);
        if (state && JSON.stringify(cleanCopy(state)) === JSON.stringify(cleanCopy(next))) return;
        state = next; saveLocal(); emit();
      }).subscribe();
      addEventListener('online', () => { if (Backend.sb) pushSb(); });
      setInterval(() => { if (localStorage.getItem(dirtyKey)) pushSb(); }, 15000);
    }
  }
  /* pull the latest copy now (after a server function changed the member list), unless this phone has unsent changes */
  async function reload() {
    if (!Backend.sb || localStorage.getItem(dirtyKey) || pushing || conflictOpen) return false;
    const v = await getView(); if (!v) return false;
    const next = normalise(v.data);
    if (v.limited) { next.shared = { ...(next.shared || {}), me: v.member_id || null }; lastViewVersion = v.version; } else noteVersion(v.version);
    state = next; saveLocal(); emit(); return true;
  }
  async function init() {   /* local-only: used when no cloud backend is configured */
    try { state = normalise(JSON.parse(localStorage.getItem(localKey) || '{}')); } catch { state = blank(); }
    emit();
  }
  /* removes every chama record on this phone (sign-out on a shared phone) */
  function wipeLocal() {
    Object.keys(localStorage).filter(k => k.startsWith('chama:') || k === 'mca-profile').forEach(k => localStorage.removeItem(k));
    state = null; undoStack.length = 0;
  }

  const undoStack = [];
  function commit(mutator, noLog) {
    const before = JSON.stringify(state);
    mutator(state);
    const cashBefore = Domain.cashOnHand(JSON.parse(before)), cashAfter = Domain.cashOnHand(state);
    if (cashAfter < 0 && cashAfter < cashBefore) {
      Object.keys(state).forEach(k => delete state[k]); Object.assign(state, JSON.parse(before));
      throw new Error('Not enough cash on hand for this change');
    }
    if (!noLog) { undoStack.push(before); if (undoStack.length > 25) undoStack.shift(); Log.record(JSON.parse(before), state); }
    saveLocal();
    if (ref) ref.set(state).catch(e => toast('Save failed: ' + e.message));
    else if (Backend.sb) { localStorage.setItem(dirtyKey, '1'); pushSb(); }
    emit();
  }
  function undo() {
    const prev = undoStack.pop(); if (!prev) return false;
    commit(s => { const p = normalise(JSON.parse(prev)); Object.keys(s).forEach(k => delete s[k]); Object.assign(s, p); s.log = [{ id: uid(), ts: Date.now(), by: 'Treasurer', kind: 'edit', text: 'Undid the last change' }, ...(s.log || [])]; }, true);
    return true;
  }
  const hasUnsent = () => Object.keys(localStorage).some(k => /^chama:.+:dirty$/.test(k));
  return { init, reload, commit, undo, setSync, startSync, wipeLocal, hasUnsent, isLimited: () => limited, setConflictHandler: f => { conflictHandler = f; }, subscribe: f => subs.push(f), get: () => state, blank, chamaId };
})();

return { get Store() { return Store; }, };
})();

/* ---- Copy for the Choose, Create and Join screens; one-time messages across reloads ---- */
const HUB_T = {
  en: {
    back: 'Back', yourChamas: 'Your Chamas', selectHint: 'Select a group to continue.',
    noChamas: 'You are not in a Chama yet. Create one, or join with an invitation.',
    manage: 'Manage your Chamas', createRow: 'Create a Chama', createRowSub: 'Set up a new savings group',
    joinRow: 'Join a Chama', joinRowSub: 'Accept an invitation', selected: 'Selected',
    members: n => n + (n === 1 ? ' member' : ' members'),
    createTitle: 'Let’s create your Chama.', createSub: 'Start a new savings group and bring your members together.', newGroup: 'New group', pickTitle: 'We have discovered you have more than one Chama.', pickSub: 'Choose the one you want to get into right now.', scanTitle: 'Scanning for your Chamas…', scanSub: 'This only takes a moment.', createdTitle: 'Chama created',
    groupDetails: 'Group details', groupDetailsSub: 'Enter the basic information for your new group.',
    nameLabel: 'Chama name', namePh: 'e.g. Umoja Savings Group', nameHelp: 'Choose a clear name your members will recognise.',
    nameNeeded: 'Type a name for your Chama. It needs at least 2 characters.',
    membership: 'Membership', existing: 'List me as a member', existingSub: 'Your own contributions and loans will be recorded under your name. Leave this off if you only keep the books.',
    createBtn: 'Create Chama', creatingBtn: 'Creating…', afterNote: 'You can invite other members after creation.',
    createFail: 'The Chama was not created. Check your connection and try again. Your name is still here.',
    joinTitle: 'Join a Chama', joinSub: 'Paste the invitation link from your email, or type the invite code your treasurer gave you.',
    joinLabel: 'Invitation link or code', joinPh: 'Link, or a code like ABCD-EFGH-JK', joinBtn: 'Continue',
    checking: 'Checking…', joinEmpty: 'Paste the invitation link or enter your Chama key.', joinFail: 'Could not join. Try again.',
    keysNotReady: 'Chama keys are not available on this server yet. Use the invitation link from your email.',
    close: 'Close', cancel: 'Cancel',
    switched: n => 'Switched to ' + n,
    welcomeNew: n => (n ? 'Welcome to your new Chama, ' + n + '.' : 'Welcome to your new Chama.') + ' You are the treasurer by default. Add members via the invitations.'
  },
  sw: {
    back: 'Rudi', yourChamas: 'Vyama vyako', selectHint: 'Chagua kikundi ili uendelee.',
    noChamas: 'Bado hujajiunga na Chama. Anzisha kipya, au jiunge kwa mwaliko.',
    manage: 'Simamia Vyama vyako', createRow: 'Anzisha Chama', createRowSub: 'Panga kikundi kipya cha akiba',
    joinRow: 'Jiunge na Chama', joinRowSub: 'Kubali mwaliko', selected: 'Imechaguliwa', newGroup: 'Kikundi kipya', pickTitle: 'Tumegundua kuwa uko kwenye Chama zaidi ya kimoja.', pickSub: 'Chagua unayotaka kuingia sasa hivi.', scanTitle: 'Inatafuta Chama zako…', scanSub: 'Itachukua muda kidogo tu.', createdTitle: 'Chama kimeundwa',
    members: n => n + (n === 1 ? ' mwanachama' : ' wanachama'),
    createTitle: 'Tuanzishe Chama chako.', createSub: 'Kikundi kipya huanza kwa jina na lengo la pamoja.',
    groupDetails: 'Maelezo ya kikundi', groupDetailsSub: 'Weka taarifa za msingi za kikundi chako kipya.',
    nameLabel: 'Jina la Chama', namePh: 'Weka jina la Chama chako', nameHelp: 'Jina hili litakitambulisha kikundi chako kwenye programu.',
    nameNeeded: 'Andika jina la Chama chako. Linahitaji herufi angalau 2.',
    membership: 'Uanachama', existing: 'Niorodheshe kama mwanachama', existingSub: 'Michango na mikopo yako itarekodiwa kwa jina lako. Iache ikiwa unatunza vitabu tu.',
    createBtn: 'Anzisha Chama', creatingBtn: 'Inaanzisha…', afterNote: 'Unaweza kuwaalika wanachama wengine baada ya kuanzisha.',
    createFail: 'Chama hakikuundwa. Angalia mtandao wako kisha ujaribu tena. Jina lako bado lipo.',
    joinTitle: 'Una kiungo cha mwaliko?', joinSub: 'Weka kiungo hapa chini au ufunguo wa Chama ili ujiunge na kikundi kilichopo.',
    joinLabel: 'Kiungo cha mwaliko au ufunguo wa Chama', joinPh: 'Bandika kiungo cha mwaliko au weka ufunguo wako', joinBtn: 'Jiunge na Chama',
    checking: 'Inakagua…', joinEmpty: 'Bandika kiungo cha mwaliko au weka ufunguo wa Chama.', joinFail: 'Imeshindikana kujiunga. Jaribu tena.',
    keysNotReady: 'Ufunguo wa Chama bado haupatikani kwenye seva hii. Tumia kiungo cha mwaliko kutoka barua pepe yako.',
    close: 'Funga', cancel: 'Ghairi',
    switched: n => 'Umehamia ' + n,
    welcomeNew: n => (n ? 'Karibu kwenye Chama chako kipya, ' + n + '.' : 'Karibu kwenye Chama chako kipya.') + ' Wewe ndiye mweka hazina kwa chaguo-msingi. Waalike wanachama kupitia mialiko.'
  }
};
const HL = () => HUB_T[__M_src_features_auth_gate_js.OB.lang()] || HUB_T.en;
/* A short message that must survive the reload used after switching or creating a Chama */
function flashNext(msg) { try { sessionStorage.setItem('mca-flash', String(msg || '')); } catch (e) { /* storage blocked: the message is simply not shown */ } }
function showFlash() {
  let m = '';
  try { m = sessionStorage.getItem('mca-flash') || ''; sessionStorage.removeItem('mca-flash'); } catch (e) { m = ''; }
  if (!m) return;
  if (m.indexOf('dialog:') === 0) { const t = HL(); setTimeout(() => dialogNotice(t.createdTitle, m.slice(7)), 350); return; }
  setTimeout(() => __M_src_ui_toast_js.toast(m, 'ok'), 700);
}
/* A centred notice with one Continue button; used where the person must acknowledge the outcome */
function dialogNotice(title, text) {
  __M_src_ui_toast_js.Pop.alert(String(text), { title, label: 'Continue', calm: true });
}
/* Turns a database error into a sentence the person can act on */
function rpcMessage(err) {
  const m = (err && err.message) || '';
  return /could not find the function|schema cache/i.test(m) ? HL().keysNotReady : (m || HL().joinFail);
}

/* ---- src/core/session.js ---- */
const __M_src_core_session_js = (function () {
const intentIs = v => { try { return sessionStorage.getItem('mca-intent') === v; } catch (e) { return false; } };
const clearIntent = () => { try { sessionStorage.removeItem('mca-intent'); } catch (e) {} };
/* A password reset must survive the email link opening in a new tab (sessionStorage is per tab).
   Kept 30 minutes, for one email only, and cleared once a new password is saved or kept. */
const RESET_KEY = 'mca-reset';
const markReset = email => { try { localStorage.setItem(RESET_KEY, JSON.stringify({ e: String(email || '').trim().toLowerCase(), t: Date.now() })); } catch (e) {} };
const resetPending = email => { try { const v = JSON.parse(localStorage.getItem(RESET_KEY) || 'null'); return !!(v && v.e && v.e === String(email || '').trim().toLowerCase() && Date.now() - v.t < 30 * 60000); } catch (e) { return false; } };
const clearReset = () => { try { localStorage.removeItem(RESET_KEY); } catch (e) {} };
/* a code link only signs in on the phone that asked for a code for that email, within 30 minutes.
   A link forwarded to (or opened by) anyone else never signs them in as that person. */
const OTP_REQ = 'mca-otp-req';
const markCodeAsked = email => { try { const v = JSON.parse(localStorage.getItem(OTP_REQ) || '{}') || {}; v[String(email || '').trim().toLowerCase()] = Date.now(); Object.keys(v).forEach(k => { if (Date.now() - v[k] > 30 * 60000) delete v[k]; }); localStorage.setItem(OTP_REQ, JSON.stringify(v)); } catch (e) {} };
const codeAskedHere = email => { try { const v = JSON.parse(localStorage.getItem(OTP_REQ) || '{}') || {}, t = v[String(email || '').trim().toLowerCase()]; return !!t && Date.now() - t < 30 * 60000; } catch (e) { return false; } };
const { esc } = __M_src_core_utils_js;
const { Policy } = __M_src_core_policy_js;
const { CONFIG } = __M_src_config_js;
const { Backend, loadLib } = __M_src_core_backend_js;
const { render } = __M_src_core_rerender_js;
const { Store } = __M_src_core_store_js;
const { toast } = __M_src_ui_toast_js;

const Perm = {
  /* mirror of ws/permissions/permissions.js and public.role_permissions (migration 002). The server is the authority; this only decides what to SHOW. */
  map: {
    treasurer: ['chama.view_shared', 'finance.view_own', 'finance.view_all', 'finance.record', 'members.view_list', 'members.invite', 'members.remove', 'roles.assign', 'chama.settings', 'audit.view'],
    secretary: ['chama.view_shared', 'finance.view_own', 'members.view_list'],
    member: ['chama.view_shared', 'finance.view_own']
  },
  can(role, perm) { return !!role && Object.prototype.hasOwnProperty.call(this.map, role) && this.map[role].indexOf(perm) >= 0; },
  label(role) { return role === 'treasurer' ? 'Treasurer' : role === 'secretary' ? 'Secretary' : 'Member'; }
};

/* Invitation link: <app>/#invite=<64 hex>. The token is read once, kept for this tab only, and removed from the address bar.
   Opening the link never joins anyone: it only asks the server to describe the invitation (verify_invitation changes nothing). */
const Invite = {
  token: null, info: null, checked: false, signin: false, msg: '', busy: false,
  MSG: {
    invalid: 'This invitation link is not valid. Ask the treasurer to send a new one.',
    expired: 'This invitation has expired. Ask the treasurer to resend it.',
    revoked: 'The treasurer cancelled this invitation.',
    accepted: 'This invitation was already used.',
    declined: 'This invitation was declined.'
  },
  init() {
    let t = null;
    try {
      const m = /^#invite=([0-9a-f]{64})$/.exec(location.hash || '');
      if (m) { t = m[1]; sessionStorage.setItem('mca-invite', t); history.replaceState(null, '', location.pathname + location.search); }
      else t = sessionStorage.getItem('mca-invite');
    } catch (e) { /* storage blocked: the link still works for this page view */ }
    this.token = t && /^[0-9a-f]{64}$/.test(t) ? t : null;
  },
  clear() { this.token = null; this.info = null; this.msg = ''; this.signin = false; try { sessionStorage.removeItem('mca-invite'); } catch (e) {} },
  async verify() {
    if (!this.token || !Backend.sb) return;
    try { const { data, error } = await Backend.sb.rpc('verify_invitation', { p_token: this.token }); this.info = error ? null : data; }
    catch (e) { this.info = null; }
    this.checked = true;
  },
  async accept() {
    if (this.busy) return; this.busy = true; this.msg = '';
    try {
      const { data, error } = await Backend.sb.rpc('accept_invitation', { p_token: this.token });
      if (error) { this.msg = error.message || 'Could not accept the invitation. Try again.'; return; }
      if (data && data.ok) {
        const cid = data.chama_id; this.clear(); toast(data.code === 'already_member' ? 'You are already in this Chama' : 'Welcome. You have joined the Chama');
        if (cid === Store.chamaId) { Session.status = 'loading'; await Session.after(Session.user); }
        else location.href = location.pathname + '?c=' + encodeURIComponent(cid);
        return;
      }
      const code = data && data.code;
      this.msg = code === 'wrong_email' ? 'You are signed in as ' + Session.email + ', but this invitation was sent to ' + ((this.info && this.info.email_hint) || 'a different email') + '. Sign out and sign in with that email.' : (this.MSG[code] || this.MSG.invalid);
    } catch (e) { this.msg = 'Could not reach the server. Check your internet and try again.'; }
    finally { this.busy = false; render(); }
  },
  async decline() {
    if (this.busy) return; this.busy = true;
    try { await Backend.sb.rpc('decline_invitation', { p_token: this.token }); } catch (e) { /* declining is best effort */ }
    this.busy = false; this.clear(); Session.status = 'loading'; await Session.after(Session.user);
  }
};
Invite.init();

/* "Fill it in for me" in the code email: <app>/#otp=<code>&e=<email>. Read once, removed from the address bar,
   then the code screen fills itself and checks the code (the same check as typing it). */
const OtpLink = {
  take() {
    try {
      const m = /^#otp=(\d{4,10})&e=([^&]+)$/.exec(location.hash || '');
      if (m) { sessionStorage.setItem('mca-otp-link', JSON.stringify({ code: m[1], email: decodeURIComponent(m[2]).trim().toLowerCase() })); history.replaceState(null, '', location.pathname + location.search); }
      const v = JSON.parse(sessionStorage.getItem('mca-otp-link') || 'null');
      return v && /^\d{4,10}$/.test(v.code) && /@/.test(v.email) ? v : null;
    } catch (e) { return null; }
  },
  clear() { try { sessionStorage.removeItem('mca-otp-link'); } catch (e) {} }
};

/* One tab refreshes the session at a time (Web Locks). Without this, two open tabs could spend the same refresh token,
   and Supabase then ends the session everywhere: the app looked signed in while the server had signed it out.
   If a lock is not granted in time (seen on some iPhones), carry on without it rather than hang. */
const authLock = async (name, acquireTimeout, fn) => {
  if (!(navigator.locks && navigator.locks.request)) return await fn();
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const t = ctl ? setTimeout(() => ctl.abort(), Math.max(4000, acquireTimeout > 0 ? acquireTimeout : 6000)) : 0;
  try { return await navigator.locks.request(name, ctl ? { mode: 'exclusive', signal: ctl.signal } : { mode: 'exclusive' }, async () => { clearTimeout(t); return await fn(); }); }
  catch (e) { clearTimeout(t); if (e && e.name === 'AbortError') return await fn(); throw e; }
};

const Session = {
  status: 'loading', user: null, role: null, memberId: null, email: '', error: '', busy: false, verifying: false, viaCode: false, resetOffered: false, hydrating: false, access: [], invites: null, account: null, workspaces: [], setupMode: 'new', chooserOpen: false, groupName: null, memberPics: {},
  ready() { return this.status === 'ready' || this.status === 'demo'; },
  markReset(email) { markReset(email); },
  /* each Chama's own photo, for the chooser (needs migration 026; without it the initials show) */
  async loadFaces() {
    if (!Backend.sb || !this.user) return;
    try {
      const { data, error } = await Backend.sb.rpc('my_chama_faces'); if (error || !data) return;
      const map = {}; data.forEach(r => { if (/^data:image\/jpeg;base64,/.test(r.photo || '')) map[r.chama_id] = r.photo; });
      let changed = false; (this.workspaces || []).forEach(w => { if (map[w.chama_id] && w.photo !== map[w.chama_id]) { w.photo = map[w.chama_id]; changed = true; } });
      if (changed && !this.ready()) { try { __M_src_features_auth_gate_js.Gate.paint(); } catch (e) {} }
    } catch (e) { /* initials stay */ }
  },
  markCodeAsked(email) { markCodeAsked(email); },
  codeAskedHere(email) { return codeAskedHere(email); },
  /* the person signed in with an email code but wants to keep the password they already have */
  async keepPassword() { clearIntent(); clearReset(); this.resetOffered = false; this.viaCode = false; this.account = null; this.busy = false; await this.after(this.user); },
  canWrite() { return Perm.can(this.role, 'finance.record'); },
  /* Runs when the person comes back to the page: picks up a sign-in finished in another browser or app */
  async recheck() {
    if (!Backend.sb || this.status !== 'signed-out' || this.busy || this.verifying) return false;
    try {
      const { data } = await Backend.sb.auth.getSession();
      if (data && data.session) { await this.after(data.session.user); return true; }
    } catch (e) { /* stay on the sign-in screen */ }
    return false;
  },
  set(st) {
    this.status = st;
    /* watchdog: a sign-in check that never finishes becomes a visible error with a way out, never a silent hang */
    clearTimeout(this._wd);
    if (st === 'loading') this._wd = setTimeout(() => { if (this.status === 'loading') { this.error = 'This is taking longer than usual. Check your internet, then try again.'; this.set('error'); } }, 12000);
    if (st === 'ready' || st === 'demo') { Welcome.start(this.displayName()); Welcome.markReady(); }
    else if (st !== 'loading') Welcome.hide();
    try { render(); } catch (e) { console.error(e); if (this.status === 'ready') toast('This page could not be shown. Try again from the menu.'); }
  },
  /* the code length comes from the database (app_config), so it always matches the Supabase setting */
  otpLength: 6,
  async loadConfig() {
    try {
      const { data } = await Backend.sb.rpc('get_app_config');
      const n = Number(data && data.otp_length);
      if (n >= 4 && n <= 10) this.otpLength = n;
    } catch (e) { /* keep the default; the sign-in still works */ }
  },
  /* every time the app opens: the server copies Supabase's code length into app_config, and the boxes follow it */
  async syncOtp() {
    try {
      const { data, error } = await Backend.sb.functions.invoke('sync-config');
      if (!error && data && data.otp_length) {
        const was = this.otpLength; this.otpLength = data.otp_length;
        if (was !== this.otpLength && this.status === 'signed-out') __M_src_features_auth_gate_js.Gate.paint();
      }
    } catch (e) { /* keep the current length */ }
  },
  /* the first name in the email: john.kamau@... becomes John */
  nameFrom(email) {
    const first = String(email || '').split('@')[0].split(/[._+-]+/)[0].replace(/\d+/g, '');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
  },
  displayName() {
    if (this.account && this.account.full_name) return String(this.account.full_name).trim().split(/\s+/)[0];
    if (this.email) return this.nameFrom(this.email);
    try { const me = JSON.parse(localStorage.getItem('mca-profile') || '{}'); if (me.name) return String(me.name).trim().split(/\s+/)[0]; } catch (e) {}
    return '';
  },
  async boot() {
    if (!CONFIG.supabase) { this.status = 'demo'; this.role = 'treasurer'; await Store.init(); render(); return; }
    try { await loadLib(); Backend.sb = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, lock: authLock } }); }
    catch (e) { this.error = 'The sign-in service could not be reached. Check your internet and try again.'; return this.set('error'); }
    let settle = false;
    Backend.sb.auth.onAuthStateChange((ev, sess) => {
      if (!settle && ev === 'SIGNED_OUT') return;
      if (ev === 'SIGNED_OUT') {
        /* not asked for on this phone: the session ended on the server (expired, signed out elsewhere, password changed) */
        const unasked = !this.leaving && !!this.user;
        this.leaving = false;
        if (unasked) { try { const G = __M_src_features_auth_gate_js.Gate; G.notice = 'Your session ended, so you were signed out for safety. Sign in again to continue. Everything already saved to the cloud is safe.'; G.mode = 'in'; G.sent = false; } catch (e) {} try { __M_src_features_smart_js.Lock.unlock(); } catch (e) {} }
        Store.wipeLocal(); this.user = null; this.role = null; this.memberId = null; this.set('signed-out'); return;
      }
      if ((ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION') && sess && !this.verifying && (!this.user || this.user.id !== sess.user.id || this.status === 'signed-out')) this.after(sess.user);
      if (sess) { try { __M_src_features_auth_gate_js.OB.syncConsent(); } catch (e) {} }
    });
    try { await this.loadConfig(); await Promise.race([this.syncOtp(), new Promise(r => setTimeout(r, 1500))]); await Invite.verify(); } catch (e) { /* the account check still runs */ }
    const oauthMsg = this.takeOAuthError();
    let data = {};
    try { data = (await Backend.sb.auth.getSession()).data || {}; } catch (e) { data = {}; }
    if (!(data && data.session) && /[?&]code=/.test(location.search)) {
      await new Promise(r => setTimeout(r, 1200));
      try { data = (await Backend.sb.auth.getSession()).data || {}; } catch (e) { data = data || {}; }
    }
    settle = true;
    if (data && data.session && !(await this.sessionAlive())) {
      try { await Backend.sb.auth.signOut({ scope: 'local' }); } catch (e) { /* the local copy is cleared below */ }
      data = {};
      try { __M_src_features_auth_gate_js.Gate.notice = 'Your session ended on this device. Sign in again to continue.'; __M_src_features_auth_gate_js.Gate.mode = 'in'; } catch (e) {}
    }
    if (data && data.session) { OtpLink.clear(); try { if (/^#otp=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); } catch (e) {} if (!this.user) await this.after(data.session.user); }
    else {
      if (oauthMsg) { try { __M_src_features_auth_gate_js.Gate.notice = oauthMsg; } catch (e) {} }
      this.prepareGoogle();
      const link = OtpLink.take();
      if (link && !this.user && !codeAskedHere(link.email)) {
        OtpLink.clear();
        const G = __M_src_features_auth_gate_js.Gate;
        const hint = link.email.replace(/^(.)[^@]*(@.*)$/, '$1•••$2');
        G.mode = 'in'; G.sent = false; G.email = '';
        G.notice = 'This sign-in link is for ' + hint + ' and was asked for on another phone or browser, so it was not used. If it is yours, type the code in the app where you asked for it, or ask for a new code here.';
        this.set('signed-out');
        return;
      }
      if (link && !this.user) {
        OtpLink.clear();
        const G = __M_src_features_auth_gate_js.Gate, O = __M_src_features_auth_gate_js.Otp;
        G.email = link.email; G.sent = true; G.mode = 'in'; this.viaCode = true;
        try { __M_src_features_auth_gate_js.OB.agree('continue:email-code-link'); } catch (e) {}
        this.set('signed-out');
        setTimeout(() => { const inp = document.getElementById('otpIn'); if (!inp) return; O.len = link.code.length; inp.value = link.code; inp.dispatchEvent(new Event('input', { bubbles: true })); }, 400);
        return;
      }
      if (!this.user) this.set('signed-out');
    }
  },
  /* A saved session can outlive the server's copy (signed out elsewhere, refresh token reused, account changed).
     The database still accepts its token until it expires, so the app looked signed in while the invitation service
     (which checks the session strictly) said "Sign in first". Ask the server once; refresh if it is only stale. */
  async sessionAlive() {
    try {
      const { data, error } = await Backend.sb.auth.getUser();
      if (!error && data && data.user) return true;
      if (error && !/session|jwt|token|not found|expired|invalid|401|403/i.test((error.message || '') + ' ' + (error.status || ''))) return true;   /* offline or server busy: keep the session */
      const { data: r, error: e2 } = await Backend.sb.auth.refreshSession();
      return !e2 && !!(r && r.session);
    } catch (e) { return true; }
  },
  /* After any sign-in: (1) is the account finished? (2) is there an invitation to accept? (3) which Chama opens? */
  async after(user) {
    if (this.busy) return;
    if (this.status === 'ready' && this.user && this.user.id === user.id) return;
    this.busy = true;
    this.user = user; this.email = String(user.email || '').toLowerCase();
    this.set('loading');
    try {
      this.takeDevice(user.id);
      this.clearStaleLocal(user.id);
      let acct;
      try { const { data, error } = await Backend.sb.rpc('my_account_status'); if (error) throw error; acct = data || {}; }
      catch (e) { throw new Error('Your account could not be checked. Make sure the database steps are finished, then try again.'); }
      this.account = acct;
      const google = this.usesGoogle(user);
      const canEnter = !!(acct.has_password || google);
      /* signing in with an emailed code means the person asked to reset (or to create an account that already exists):
         always offer a new password, also when the account has Google linked. Google sign-in itself never asks. */
      const viaCode = this.viaCode; this.viaCode = false;
      const wantsReset = (viaCode || !google) && (intentIs('forgot') || resetPending(this.email) || (viaCode && (acct.has_password || google)));
      if (wantsReset) this.resetOffered = true;
      if (!acct.has_profile || !canEnter || acct.needs_username || wantsReset) { this.setupMode = acct.has_profile && canEnter && !acct.needs_username ? 'reset' : 'new'; this.busy = false; this.set('setup'); return; }
      if (Invite.token && Invite.info && Invite.info.ok) { this.role = null; this.memberId = null; this.busy = false; this.set('invite'); return; }
      await this.openWorkspace(user);
    } catch (e) {
      if (this.status === 'ready') { console.error(e); return; }   /* signed in already: never send the person back to sign-in */
      this.error = e.message || 'Could not reach the cloud.'; this.set('error');
    } finally { this.busy = false; }
  },
  /* Removes locally cached Chama data that does not belong to the current Chama (A21). */
  clearStaleLocal(uid) {
    try {
      const keep = 'chama:' + Store.chamaId;
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('mca-set-aside:')) localStorage.removeItem(k);
        else if (k === 'mca-profile') { try { if ((JSON.parse(localStorage.getItem(k) || 'null') || {}).uid !== uid) localStorage.removeItem(k); } catch (e) { localStorage.removeItem(k); } }
        else if (k.startsWith('chama:') && !k.startsWith(keep) && !k.startsWith('chama:me:')) localStorage.removeItem(k);
      });
    } catch (e) { /* storage blocked */ }
  },
  /* A phone may be shared. Another person's saved Chama data is set aside (kept, not shown), never mixed into this account. */
  takeDevice(uid) {
    try {
      const prev = localStorage.getItem('mca-owner');
      if (prev && prev !== uid) Object.keys(localStorage).filter(k => k.startsWith('chama:')).forEach(k => { try { localStorage.setItem('mca-set-aside:' + prev + ':' + k, localStorage.getItem(k)); localStorage.removeItem(k); } catch (e) {} });
      localStorage.setItem('mca-owner', uid);
    } catch (e) { /* storage blocked: nothing to protect */ }
  },
  async openWorkspace(user) {
    const { data: ws, error } = await Backend.sb.rpc('my_workspaces');
    if (error) throw error;
    this.workspaces = ws || [];
    this.loadFaces();
    await this.loadMyRequests();
    const here = this.workspaces.find(w => w.chama_id === Store.chamaId);
    this.groupName = here ? here.chama_name : null;
    if (here && !this.chooserOpen) return this.enter(user, here.role);
    if (!here && this.workspaces.length === 1 && !this.chooserOpen) return this.switchTo(this.workspaces[0].chama_id);
    this.chooserOpen = false; this.role = null; this.memberId = null; this.busy = false;
    this.set(this.workspaces.length ? 'choose' : 'welcome');
  },
  async enter(user, roleFromList) {
    /* the role comes from the same server answer that listed this Chama (my_workspaces); the member link is read next */
    let { data: m, error } = await Backend.sb.from('chama_members').select('role,member_id').eq('chama_id', Store.chamaId).eq('user_id', user.id).eq('status', 'active').maybeSingle();
    if (error) throw error;
    const role = (m && m.role) || roleFromList;
    if (!role) throw new Error('Your membership could not be loaded. Try again.');
    m = { role, member_id: m ? m.member_id : null };
    this.role = m.role; this.memberId = m.member_id || null;
    try { await this.loadProfile(user); } catch (e) { /* the profile is optional */ }
    this.hydrating = false;
    this.busy = false;
    this.set('ready');
    setTimeout(() => { try { __M_src_features_auth_gate_js.OB.ensureConsent(); } catch (e) {} }, 1200);
    try { __M_src_features_smart_js.Lock.show(); } catch (e) {}
    try { __M_src_features_notifications_notify_js.Notify.watch(); } catch (e) {}
    try { __M_src_features_chat_index_js.Chat.watch(); } catch (e) {}
    if (Perm.can(m.role, 'members.invite')) { this.loadAccess().catch(() => {}); this.loadInvites().catch(() => {}); }
    if (m.role !== 'member') this.loadRequests().then(r => { if (r.length) { render(); try { __M_src_features_requests_js.Requests.prompt(); } catch (e) {} } }).catch(() => {});
    try { __M_src_features_requests_js.Requests.watch(); } catch (e) {}
    setTimeout(() => { try { __M_src_features_requests_js.Roles.check(); } catch (e) {} }, 1500);
    setTimeout(() => { try { __M_src_features_guide_js.Aware.check(); } catch (e) {} }, 0);
    Store.startSync().catch(() => {}).then(() => this.loadMemberPics().catch(() => {}));
  },
  switchTo(id) {
    let left = false;
    const go = () => { if (left) return; left = true; location.replace(location.pathname + '?c=' + encodeURIComponent(id)); };
    const auth = Backend.sb && Backend.sb.auth;
    if (!auth || !auth.getSession) { go(); return; }
    auth.getSession().then(go).catch(go);
    setTimeout(go, 700);
  },
  /* join requests this person has sent that a treasurer has not decided yet */
  pending: [],
  async loadMyRequests() {
    try { const { data, error } = await Backend.sb.rpc('my_join_requests'); this.pending = error ? [] : (data || []); } catch (e) { this.pending = []; }
    /* names are remembered here because a declined person can no longer read the Chama itself */
    try { const names = JSON.parse(localStorage.getItem('mca-req-names') || '{}'); this.pending.forEach(r => { if (r.chama_id && r.chama_name) names[r.chama_id] = r.chama_name; }); localStorage.setItem('mca-req-names', JSON.stringify(names)); } catch (e) {}
    await this.loadDeclined();
    return this.pending;
  },
  /* the person's own declined requests (their own rows are readable to them), so a decline is never just a passing toast */
  declined: [],
  async loadDeclined() {
    if (!Backend.sb || !this.user) { this.declined = []; return []; }
    try {
      const since = new Date(Date.now() - 180 * 864e5).toISOString();
      const { data, error } = await Backend.sb.from('chama_join_requests').select('id,chama_id,role,status,decided_at,requested_at').eq('user_id', this.user.id).eq('status', 'declined').gte('requested_at', since).order('decided_at', { ascending: false }).limit(20);
      let names = {}; try { names = JSON.parse(localStorage.getItem('mca-req-names') || '{}'); } catch (e) {}
      this.declined = error ? [] : (data || []).map(r => ({ ...r, chama_name: names[r.chama_id] || null }));
    } catch (e) { this.declined = []; }
    return this.declined;
  },
  declinedFor(cid) { return (this.declined || []).find(r => r.chama_id === cid) || null; },
  async cancelRequest(cid) {
    const { error } = await Backend.sb.rpc('cancel_join_request', { p_cid: cid });
    if (error) throw new Error(rpcMessage(error));
    await this.loadMyRequests();
  },
  /* treasurer and secretary: people waiting to be let in */
  requests: [],
  async loadRequests() {
    if (!Backend.sb || !this.role || this.role === 'member') { this.requests = []; return []; }
    try { const { data, error } = await Backend.sb.rpc('list_join_requests', { p_cid: Store.chamaId }); this.requests = error ? [] : (data || []); }
    catch (e) { this.requests = []; }
    return this.requests;
  },
  async decideRequest(id, approve, o = {}) {
    const { data, error } = await Backend.sb.rpc('decide_join_request', { p_id: id, p_approve: !!approve, p_role: o.role || null, p_record: o.record || 'new', p_name: o.name || null });
    if (error) throw new Error(rpcMessage(error));
    await this.loadRequests();
    if (approve) { try { await Store.reload(); } catch (e) {} this.loadAccess().catch(() => {}); this.loadMemberPics().catch(() => {}); }
    return data;
  },
  /* role or access changed on the server: apply it in place, no reload */
  async refreshRole() {
    if (!Backend.sb || !this.user || !Store.chamaId) return;
    const { data: m, error } = await Backend.sb.from('chama_members').select('role,member_id,status').eq('chama_id', Store.chamaId).eq('user_id', this.user.id).eq('status', 'active').maybeSingle();
    if (error) return;
    if (!m) { toast('You no longer have access to this Chama', 'info'); this.chooserOpen = false; this.role = null; return this.openWorkspace(this.user); }
    const changed = m.role !== this.role || (m.member_id || null) !== this.memberId;
    this.role = m.role; this.memberId = m.member_id || null;
    if (!changed) return;
    try { await Store.reload(); } catch (e) {}
    this.loadRequests().catch(() => {}); if (Perm.can(this.role, 'members.invite')) { this.loadAccess().catch(() => {}); this.loadInvites().catch(() => {}); }
    toast('You are now ' + Perm.label(this.role) + '. The app has updated.', 'ok'); render();
  },
  async linkRecord(email, record, name) {
    const { error } = await Backend.sb.rpc('link_member_record', { p_cid: Store.chamaId, p_email: email, p_record: record || 'new', p_name: name || null });
    if (error) throw new Error(rpcMessage(error));
    try { await Store.reload(); } catch (e) {}
    await this.loadAccess();
  },
  async openChooser() {
    if (!Backend.sb || !this.user) return;
    this.chooserOpen = true;
    try { const { data } = await Backend.sb.rpc('my_workspaces'); this.workspaces = data || this.workspaces; this.loadFaces(); } catch (e) { /* show the list we already have */ }
    this.set('choose');
  },
  closeChooser() { this.chooserOpen = false; this.set(this.role ? 'ready' : 'welcome'); },
  usesGoogle(user) {
    const u = user || this.user;
    if (!u) return false;
    const ids = u.identities || [];
    if (ids.some(i => i.provider === 'google')) return true;
    const meta = u.app_metadata || {};
    return meta.provider === 'google' || (meta.providers || []).indexOf('google') !== -1;
  },
  googleName(user) {
    const m = ((user || this.user) && (user || this.user).user_metadata) || {};
    return String(m.full_name || m.name || '').trim();
  },
  takeOAuthError() {
    let q;
    try { q = new URLSearchParams(location.search); } catch (e) { return ''; }
    const raw = q.get('error_description') || '';
    const code = q.get('error') || '';
    if (!raw && !code) return '';
    q.delete('error'); q.delete('error_description'); q.delete('error_code');
    const search = q.toString();
    try { history.replaceState(null, '', location.pathname + (search ? '?' + search : '') + location.hash); } catch (e) {}
    let t = raw;
    try { t = decodeURIComponent(raw.replace(/\+/g, ' ')); } catch (e) {}
    if (/already registered|already been registered|already exists|identity is already/i.test(t)) return 'This email already has an account. Sign in with your password. Google can be used for that same email once linking is on.';
    if (/provider is not enabled|Unsupported provider|validation_failed/i.test(t + code)) return 'Google sign-in is not switched on in the cloud yet.';
    return 'Google sign-in did not finish. Try again, or use Sign in.';
  },
  googleLeft: false,
  googleUrl: '',
  googleVerifier() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const buf = new Uint8Array(56);
    crypto.getRandomValues(buf);
    let out = '';
    for (let i = 0; i < buf.length; i++) out += chars[buf[i] % chars.length];
    return out;
  },
  /* Written the way the sign-in library reads it back after Google returns. */
  storeVerifier(verifier) {
    localStorage.setItem('sb-sgfvjsxmchohawhqraii-auth-token-code-verifier', JSON.stringify(verifier));
  },
  googleAuthorize(verifier, method, challenge) {
    const base = CONFIG.supabase && CONFIG.supabase.url;
    if (!base) return '';
    const back = location.origin + location.pathname + location.search;
    const q = new URLSearchParams({
      provider: 'google',
      redirect_to: back,
      code_challenge: challenge || verifier,
      code_challenge_method: method,
      prompt: 'select_account',
    });
    return base.replace(/\/$/, '') + '/auth/v1/authorize?' + q.toString();
  },
  googleUrlPlain() {
    const verifier = this.googleVerifier();
    this.storeVerifier(verifier);
    return this.googleAuthorize(verifier, 'plain');
  },
  async prepareGoogle() {
    if (this.googleLeft || this.googleUrl) return;
    try {
      const verifier = this.googleVerifier();
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
      if (this.googleLeft) return;
      const challenge = btoa(String.fromCharCode.apply(null, new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      this.storeVerifier(verifier);
      this.googleUrl = this.googleAuthorize(verifier, 's256', challenge);
    } catch (e) { /* the tap can still build a plain link */ }
  },
  /* Open Google in this tap. Do not wait on the sign-in library: that wait is what left the button pressed. */
  googleSignIn() {
    if (!(CONFIG.supabase && CONFIG.supabase.url)) { __M_src_features_auth_gate_js.Gate.notice = 'Sign-in is not set up in this app yet'; __M_src_features_auth_gate_js.Gate.paint(); return; }
    this.googleLeft = true;
    let url = '';
    try { url = this.googleUrl || this.googleUrlPlain(); }
    catch (e) { url = ''; }
    if (!url) { this.googleLeft = false; __M_src_features_auth_gate_js.Gate.notice = 'Google sign-in did not start. Try again.'; __M_src_features_auth_gate_js.Gate.paint(); return; }
    window.location.assign(url);
  },
  /* email OR username + the one global password. The server function finds the email; the browser never sees it. */
  async passwordSignIn(identifier, password) {
    const WRONG = 'Email, username or password is not right';
    let r;
    try { r = await Backend.sb.functions.invoke('auth-login', { body: { identifier, password } }); } catch (e) { r = { error: e }; }
    if (!r.error && r.data && r.data.session) {
      const { error } = await Backend.sb.auth.setSession({ access_token: r.data.session.access_token, refresh_token: r.data.session.refresh_token });
      if (error) return { error: 'Could not start your session. Try again.' };
      clearIntent(); clearReset(); this.viaCode = false; return { ok: true };
    }
    const err = r.error;
    if (err && err.context && typeof err.context.json === 'function') {
      const st = err.context.status; let j = {}; try { j = await err.context.json(); } catch (e) {}
      if (st === 429) return { error: 'Too many tries. Wait 10 minutes, then try again.' };
      if (st !== 404) return { error: j.error || WRONG };
    }
    /* no direct password fallback: it would skip the server throttle (S5). Report the real state instead. */
    if (err && err.context && err.context.status === 404) return { error: 'Sign-in is not available yet. Please try again later.' };
    return { error: 'Could not reach sign-in. Check your connection and try again.' };
  },
  /* the step after the email code: name + username (new accounts) and the one global password */
  async finishSetup(fullName, username, password) {
    if (this.setupMode === 'new') {
      const { error } = await Backend.sb.rpc('set_my_profile', { p_full_name: fullName, p_username: username });
      if (error) throw new Error(error.message);
    }
    if (password) {
      const { error: e2 } = await Backend.sb.auth.updateUser({ password });
      if (e2 && /AAL2|MFA/i.test(e2.message)) {
        try { await Backend.sb.auth.signOut(); } catch (e) {}
        throw new Error('Your sign-in session was closed for safety. Press Start again and enter a new email code.');
      }
      if (e2) throw new Error(/same|different/i.test(e2.message) ? 'Choose a password you have not used before' : e2.message);
    }
    clearIntent(); clearReset(); this.resetOffered = false; this.viaCode = false; this.account = null; this.busy = false;
    await this.after(this.user);
  },
  async joinWithLink(text) {
    const raw = String(text || ''), compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/[0-9a-f]{64}/i.test(raw) && compact.length === 10) return this.joinWithCode(compact);
    if (!/[0-9a-f]{64}/i.test(raw)) return { error: compact.length && compact.length < 10 ? 'An invite code has 10 letters and numbers, like ABCD-EFGH-JK.' : 'That does not look like an invite code or an invitation link. Check it and try again.' };
    const m = /[0-9a-f]{64}/i.exec(String(text || ''));
    if (!m) return { error: 'That does not look like an invitation link. Copy the whole link from the email.' };
    Invite.token = m[0].toLowerCase(); Invite.checked = false; Invite.info = null; Invite.signin = true;
    try { sessionStorage.setItem('mca-invite', Invite.token); } catch (e) {}
    await Invite.verify();
    if (Invite.info && Invite.info.ok) { this.set('invite'); return { ok: true }; }
    const code = Invite.info && Invite.info.code; const msg = Invite.MSG[code] || (Invite.info ? Invite.MSG.invalid : 'Could not check the invitation. Check your internet and try again.');
    Invite.clear(); return { error: msg };
  },
  /* ---- one profile for every Chama: name, username, phone, contact email and photo live on the account (profiles) ---- */
  readProfile() { try { return JSON.parse(localStorage.getItem('mca-profile') || 'null') || {}; } catch (e) { return {}; } },
  writeProfile(v) { try { localStorage.setItem('mca-profile', JSON.stringify(v)); } catch (e) { toast('Storage full'); } },
  legacyProfile() { try { const k = Object.keys(localStorage).find(x => x.startsWith('chama:me:')); return k ? JSON.parse(localStorage.getItem(k)) || {} : {}; } catch (e) { return {}; } },
  /* the photo to show for a member: the account photo when the member is linked, else the copy in the Chama record */
  photoFor(m) {
    const pic = m && m.id && this.memberPics ? this.memberPics[m.id] : null;
    if (pic && pic.photo) return pic.photo;
    return (m && m.photo) || null;
  },
  async loadProfile(user) {
    if (!Backend.sb) return;
    const { data, error } = await Backend.sb.rpc('get_my_profile');
    if (error) return;   /* database steps not run yet: keep what this phone already has */
    const cur = this.readProfile(), legacy = this.legacyProfile();
    const base = { ...legacy, ...(cur.uid && cur.uid !== user.id ? {} : cur) };
    const p = { ...(data || {}) };
    let moved = !!base.moved;
    if (!moved) {   /* one-time: copy what this phone held before the profile moved to the account */
      let ok = true;
      if (base.photo && !p.photo) { const r = await Backend.sb.rpc('set_my_photo', { p_photo: base.photo }); if (r.error) ok = false; else p.photo = base.photo; }
      const nm = p.full_name || base.name || '';
      if (nm && ((base.phone && !p.phone) || (base.email && !p.contact_email))) {
        const ph = p.phone || base.phone || '', em = p.contact_email || base.email || '';
        const r = await Backend.sb.rpc('save_my_details', { p_full_name: nm, p_phone: ph, p_contact_email: em, p_username: null });
        if (r.error) ok = false; else { p.full_name = nm; p.phone = ph || null; p.contact_email = em || null; }
      }
      moved = ok;
    }
    this.writeProfile({ uid: user.id, moved, name: p.full_name || base.name || '', phone: p.phone || '', email: p.contact_email || '', username: p.username || '', photo: p.photo || null, signInEmail: p.sign_in_email || '' });
    if (moved) Object.keys(localStorage).filter(k => k.startsWith('chama:me:')).forEach(k => localStorage.removeItem(k));
  },
  /* the Chama's member photos and names for this person's account. Members see each other's photos here. */
  async loadMemberPics() {
    if (!Backend.sb || !this.user) return;
    const { data, error } = await Backend.sb.rpc('get_chama_member_profiles', { p_cid: Store.chamaId });
    if (error) return;   /* database steps not run yet: members keep the copy in the Chama record */
    const rows = data || [], pics = {};
    rows.forEach(r => { pics[r.member_id] = { name: r.name || '', photo: r.photo || null }; });
    this.memberPics = pics;
    /* Only the treasurer can write the Chama record, so only the treasurer makes the member list show each person's account name */
    const s = Store.get();
    if (this.role === 'treasurer' && s) {
      const fix = rows.filter(r => r.name && (s.members || []).some(m => m.id === r.member_id && m.name !== r.name));
      if (fix.length) Store.commit(st => { fix.forEach(r => { const m = st.members.find(x => x.id === r.member_id); if (m) m.name = r.name; }); }, true);
    }
    render();
  },
  /* name, username, phone and contact email for every Chama at once */
  async saveDetails(d) {
    if (!Backend.sb) throw new Error('Sign in to save your details');
    const { data, error } = await Backend.sb.rpc('save_my_details', { p_full_name: d.name, p_phone: d.phone || '', p_contact_email: d.email || '', p_username: d.username || null });
    if (error) throw new Error(error.message);
    const cur = this.readProfile(), username = (data && data.username) || cur.username || '';
    this.writeProfile({ ...cur, name: d.name, phone: d.phone || '', email: d.email || '', username });
    this.account = { ...(this.account || {}), username, full_name: d.name };
    const s = Store.get();
    if (this.role === 'treasurer' && this.memberId && s) Store.commit(st => { const m = st.members.find(x => x.id === this.memberId); if (m) m.name = d.name; }, true);
  },
  /* one photo for every Chama. null removes it. */
  async savePhoto(url) {
    if (!Backend.sb) throw new Error('Sign in to save your photo');
    const { error } = await Backend.sb.rpc('set_my_photo', { p_photo: url || '' });
    if (error) throw new Error(/does not exist|Could not find the function/i.test(error.message)
      ? 'Photos are not available on this server yet. Try again after the database update.'
      : error.message);
    this.writeProfile({ ...this.readProfile(), photo: url || null });
    if (this.memberId) this.memberPics = { ...this.memberPics, [this.memberId]: { ...((this.memberPics || {})[this.memberId] || {}), photo: url || null } };
  },
  /* the one global password. Checked through the same throttled sign-in as the sign-in screen, then changed. */
  async changePassword(current, next) {
    if (!Backend.sb) throw new Error('Sign in to change your password');
    if (!this.email) throw new Error('Sign in again to change your password');
    const r = await this.passwordSignIn(this.email, current);
    if (r.error) throw new Error(/password is not right/.test(r.error) ? 'Your current password is not right' : r.error);
    const { error } = await Backend.sb.auth.updateUser({ password: next });
    if (error) throw new Error(/same|different|previous/i.test(error.message) ? 'Choose a password you have not used before' : error.message);
  },
  async loadAccess() {
    if (this.role !== 'treasurer' || !Backend.sb) return;
    const { data, error } = await Backend.sb.rpc('list_access', { cid: Store.chamaId });
    if (error) toast(error.message);
    this.access = error ? [] : (data || []); await this.loadCodes(); render();
  },
  async loadInvites() {
    if (!Backend.sb || !Perm.can(this.role, 'members.invite')) return;
    const { data, error } = await Backend.sb.rpc('list_invitations', { cid: Store.chamaId });
    this.invites = error ? null : (data || []);   /* null = the invitation system is not installed on this database yet */
    render();
  },
  /* create / resend through the server function, which emails the link. { unavailable: true } = function not deployed yet. */
  async sendInvite(action, payload, retried) {
    const { data, error } = await Backend.sb.functions.invoke('send-invitation', { body: { action, chama_id: Store.chamaId, ...payload } });
    if (error && error.context && error.context.status === 401) {
      if (!retried) {
        const { data: r, error: e2 } = await Backend.sb.auth.refreshSession().catch(err => ({ error: err }));
        if (!e2 && r && r.session) return this.sendInvite(action, payload, true);
      }
      __M_src_ui_toast_js.Pop.alert('Your sign-in on this device has expired, so the email could not be sent. Sign in again, then send it once more.', {
        title: 'Sign in again', label: 'Sign in', onYes: () => __M_src_features_index_js.Actions.signOutApp() });
      throw Object.assign(new Error('signin_expired'), { quiet: true });
    }
    if (error) {
      /* the real reason is shown; nothing is hidden behind a fallback */
      if (error.context && typeof error.context.json === 'function') {
        const st = error.context.status; let j = {}; try { j = await error.context.json(); } catch (e) {}
        if (st === 404) throw new Error('The invitation service is not deployed yet (404). Deploy send-invitation in Supabase.');
        throw new Error('Invitation service (' + st + '): ' + (j.error || 'no details'));
      }
      throw new Error('Could not reach the invitation service: ' + (error.message || 'unknown error') + '. Check the internet, then try again.');
    }
    return data || {};
  },
  async revoke(email) {
    const { error } = await Backend.sb.rpc('remove_member', { cid: Store.chamaId, p_email: email });
    if (error) throw new Error(error.message);
    await this.loadAccess(); toast('Access removed. Their records are kept');
  },
  cid() { return Store.chamaId; },
  async createChama(name, listed = true) {
    const b = Store.blank(); delete b.chama.pin; b.chama.name = name;
    /* the creator is listed as member 1 unless they choose to be officer only; a listed creator gets a member link (member_id) */
    const who = ((this.account && this.account.full_name) || '').trim() || 'Treasurer';
    b.members = listed ? [{ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), name: who, shares: 1, joined: (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })() }] : [];
    const { data, error } = await Backend.sb.rpc('create_chama_global', { cname: name, cdata: b });
    if (error) throw new Error(error.message);
    flashNext('dialog:' + HL().welcomeNew(((this.account && this.account.full_name) || '').trim()));
    this.switchTo(data.chama_id);
  },
  async loadCodes() {
    if (this.role !== 'treasurer' || !Backend.sb) { this.codes = []; return; }
    const { data, error } = await Backend.sb.rpc('list_invite_codes', { p_cid: Store.chamaId });
    if (error) toast(error.message);
    this.codes = error ? [] : (data || []);
  },
  async createCode(o) {
    const { data, error } = await Backend.sb.rpc('create_invite_code', { p_cid: Store.chamaId, p_role: o.role, p_hours: o.hours, p_max_uses: o.maxUses, p_listed_member: o.memberId || null });
    if (error) throw new Error(error.message);
    const r = Array.isArray(data) ? data[0] : data;
    this.newCode = r ? { code: r.out_code, expires_at: r.out_expires_at } : null;
    await this.loadAccess();
  },
  async revokeCode(id) {
    const { error } = await Backend.sb.rpc('revoke_invite_code', { p_id: id });
    if (error) throw new Error(error.message);
    await this.loadAccess();
  },
  async saveTag(tag) {
    const { data, error } = await Backend.sb.rpc('set_display_tag', { p_cid: Store.chamaId, p_tag: tag });
    if (error) throw new Error(error.message);
    const w = (this.workspaces || []).find(x => x.chama_id === Store.chamaId); if (w) w.display_tag = data;
    await this.loadAccess();
    return data;
  },
  /* join by code: (1) preview shows the Chama in place of the code screen, (2) the person asks to join,
     (3) the treasurer or secretary approves. Nothing opens until they do. */
  async joinWithCode(code) {
    if (!Backend.sb) return { error: 'Sign-in is not set up in this app yet' };
    const { data, error } = await Backend.sb.rpc('preview_invite_code', { p_code: code });
    if (error) return { error: rpcMessage(error) };
    if (!data || !data.ok) return { error: (data && data.error) || 'That code did not work.' };
    return { ok: true, preview: { ...data, code } };
  },
  async requestJoin(code) {
    const { data, error } = await Backend.sb.rpc('redeem_invite_code', { p_code: code });
    if (error) throw new Error(rpcMessage(error));
    if (!data || !data.ok) throw new Error((data && data.error) || 'That code did not work.');
    if (data.already_member) { this.switchTo(data.chama_id); return data; }
    await this.loadMyRequests();
    return data;
  },
  async signOut() {
    this.leaving = true;
    try { await Backend.sb.auth.signOut(); } catch {}
    clearIntent(); this.account = null; this.workspaces = [];
    Store.wipeLocal(); this.user = null; this.role = null; this.memberId = null; this.set('signed-out');
  }
};

Policy.canWrite = () => Session.canWrite();

return { get Session() { return Session; }, get Perm() { return Perm; }, get Invite() { return Invite; }, };
})();

/* ---- src/core/auth.js ---- */
const __M_src_core_auth_js = (function () {
const { Session, Perm } = __M_src_core_session_js;

/* =====================================================================
   5. VIEWS  (state in, html out)
   ===================================================================== */
const Auth = {
  isAdmin: () => Perm.can(Session.role, 'chama.settings'),
  can: (perm) => Perm.can(Session.role, perm)
};

const adminBtn = (html) => Auth.isAdmin() ? html : '';

return { get Auth() { return Auth; }, get adminBtn() { return adminBtn; }, };
})();

/* ---- src/core/me.js ---- */
const __M_src_core_me_js = (function () {
const { Session } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { toast } = __M_src_ui_toast_js;

const Me = {
  key: () => 'mca-profile',
  get() { let o = {}; try { o = JSON.parse(localStorage.getItem(this.key()) || 'null') || {}; } catch {} return { ...o, memberId: Session.memberId || null }; },
  save(v) { const { memberId, ...rest } = v || {}; try { localStorage.setItem(this.key(), JSON.stringify(rest)); } catch { toast('Storage full'); } }
};

return { get Me() { return Me; }, };
})();

/* ---- src/core/history.js ---- */
const __M_src_core_history_js = (function () {

const Hist = {
  s: [],
  visit(r, prev) {
    const n = this.s.length;
    if (n && this.s[n - 1] === r) this.s.pop();
    else if (prev && prev !== r) this.s.push(prev);
    if (this.s.length > 30) this.s.shift();
  },
  back() { return this.s.length ? this.s[this.s.length - 1] : 'home'; }
};

return { get Hist() { return Hist; }, };
})();

/* ---- src/core/routes.js ---- */
const __M_src_core_routes_js = (function () {

/* =====================================================================
   7. ROUTER + RENDER
   ===================================================================== */
const ROUTES = [['home', 'Home'], ['grid', 'Contributions'], ['chat', 'Chat'], ['members', 'Members'], ['profile', 'Profile']];

const SUB = ['fines', 'expenses', 'history', 'reports', 'loans'];

const PAGES = ['settings', 'notifications', 'requests', 'insights', 'register'];

/* ---------- NAV: liquid tab bar, tap or drag ---------- */
const NAV_ICON = { profile: ICONS.profile, home: ICONS.home, grid: ICONS.grid, loans: ICONS.loans, chat: ICONS.chat, members: ICONS.members, more: ICONS.more };

const NAV_LABEL = { home: 'Home', grid: 'Payments', chat: 'Chat', loans: 'Loans', members: 'Members', profile: 'Me' };

const SETTINGS_NAME = { 'legal/privacy': 'Privacy Policy', 'legal/terms': 'Terms of Use', 'settings/account': 'My account', 'settings/chama': 'Chama settings', 'settings/app': 'Display', 'settings/app/appearance': 'Appearance', 'settings/app/text': 'Text size', 'settings/app/seeing': 'Seeing', 'settings/app/hands': 'Hands and movement', 'settings/app/reading': 'Reading and messages', 'settings/data': 'Data and storage', 'settings/help': 'Help and support', 'settings/privacy': 'Privacy and data', 'settings/actions': 'People and access', 'settings/about': 'About' };

const PAGE_NAME = { home: 'Home', grid: 'Contributions', chat: 'Chat', requests: 'Join requests', insights: 'Insights', register: 'Member register', loans: 'Loans', members: 'Members', more: 'More', fines: 'Fines', expenses: 'Expenses', history: 'History', reports: 'Reports and backup', profile: 'My profile', settings: 'Settings', notifications: 'Notifications', 'notifications/settings': 'Notification settings' };

const BACK = { notifications: 'home', 'notifications/settings': 'notifications', fines: 'home', expenses: 'home', history: 'home', reports: 'home', profile: 'home', settings: 'home' };

const route = () => { const r = location.hash.replace(/^#\/?/, ''); return ROUTES.some(x => x[0] === r) || SUB.includes(r) || PAGES.includes(r) || /^chat\/(group|records|[0-9a-f-]{36})$/.test(r) || r.startsWith('settings/') || r.startsWith('notifications/') || r === 'legal/privacy' || r === 'legal/terms' ? r : 'home'; };

return { get ROUTES() { return ROUTES; }, get SUB() { return SUB; }, get PAGES() { return PAGES; }, get NAV_ICON() { return NAV_ICON; }, get NAV_LABEL() { return NAV_LABEL; }, get SETTINGS_NAME() { return SETTINGS_NAME; }, get PAGE_NAME() { return PAGE_NAME; }, get BACK() { return BACK; }, get route() { return route; }, };
})();

/* ---- src/features/auth/gate.js ---- */
const __M_src_features_auth_gate_js = (function () {
const { Backend } = __M_src_core_backend_js;
const { toast } = __M_src_ui_toast_js;
const { Session, Perm, Invite } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { esc } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;

const Haptic = {
  pulse(pattern) { try { const ua = navigator.userActivation; if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(pattern); } catch (e) {} },   /* only after a real tap, or Chrome reports an error */
  sw() { const l = document.getElementById('hapticSw'); if (l) l.click(); },
  tap() { this.pulse(6); },
  ok() { this.pulse([16, 60, 24]); this.sw(); __M_src_ui_toast_js.Sfx.ok(); },
  no() { this.pulse([60, 40, 60]); __M_src_ui_toast_js.Sfx.no(); }
};

/* One-time code entry. The code length follows the Supabase setting (Session.otpLength).
   One hidden input takes typing, paste and the phone's code autofill; the cells only show it. */
const Otp = {
  len: 8, kind: 'email', hold: false, busy: false, until: 0, timer: null,
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
  html(o) {
    const n = this.len, half = Math.ceil(n / 2);
    let cells = '';
    for (let i = 0; i < n; i++) {
      if (i === half && n > 5) cells += '<span class="otp-gap" aria-hidden="true"></span>';
      cells += `<span class="otp-cell" style="--i:${i}"></span>`;
    }
    const resend = o.resend === false ? '' : `<p>Didn’t get it? <button type="button" id="otpResend" data-act="gateResend" disabled>Send again</button></p>`;
    const change = o.change ? `<p><button type="button" data-act="gateReset">Use a different email</button></p>` : '';
    return `<div class="otp" id="otpWrap">
      <div class="otp-stage" id="otpStage">
        <div class="otp-row" aria-hidden="true">${cells}</div>
        <input id="otpIn" class="otp-in" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="${n}" aria-label="${n}-digit code from your email" autofocus>
      </div>
      <div class="otp-done" aria-hidden="true"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="24"/><path d="M16 27.5l7.5 7.5L38.5 20"/></svg></div>
      <p class="otp-msg" id="otpMsg" role="status" aria-live="polite"></p>
      <div class="otp-foot">${resend}${change}</div>
    </div>`;
  },
  paint(v) {
    const cells = document.querySelectorAll('#otpStage .otp-cell');
    cells.forEach((el, i) => {
      const ch = v[i] || '';
      if (ch && el.textContent !== ch) { el.classList.remove('fill'); void el.offsetWidth; el.classList.add('fill'); }
      el.textContent = ch;
      el.classList.toggle('cur', i === v.length && v.length < this.len);
    });
  },
  msg(t) { const m = document.getElementById('otpMsg'); if (m) m.textContent = t; },
  fit() {},
  reset() {
    const wrap = document.getElementById('otpWrap'), inp = document.getElementById('otpIn');
    if (wrap) wrap.classList.remove('bad', 'ok', 'shake', 'verifying');
    if (inp) { inp.value = ''; inp.disabled = false; }
    this.busy = false; this.hold = false; Session.verifying = false;
    try { sessionStorage.removeItem('mca-otp'); } catch (e) {}
    this.paint('');
    this.msg('');
  },
  start() { this.until = Date.now() + 60000; clearInterval(this.timer); this.tick(); this.timer = setInterval(() => this.tick(), 500); },
  tick() {
    const b = document.getElementById('otpResend'); if (!b) return;
    const left = Math.max(0, Math.ceil((this.until - Date.now()) / 1000));
    b.disabled = left > 0; b.textContent = left > 0 ? `Send again in ${left}s` : 'Send again';
  },
  onInput(inp) {
    if (this.busy) return;
    const before = (inp._prev || '').length;
    const clean = inp.value.replace(/\D/g, '').slice(0, this.len);
    if (clean !== inp.value) inp.value = clean;
    inp._prev = clean;
    const wrap = document.getElementById('otpWrap'); if (wrap) wrap.classList.remove('bad', 'shake');
    this.msg(''); this.paint(clean);
    try { sessionStorage.setItem('mca-otp', clean); } catch (e) {}
    if (clean.length > before) Haptic.tap();
    if (clean.length === this.len) this.submit(clean);
  },
  async check(code) {
    try {
      const { error } = await Backend.sb.auth.verifyOtp({ email: Gate.email, token: code, type: 'email' });
      if (error) return { ok: false, msg: /expired/i.test(error.message) && !/invalid/i.test(error.message) ? 'That code has expired. Tap Send again for a fresh one.' : 'That code is not right. Check the newest email and try again.' };
      return { ok: true };
    } catch (e) { return { ok: false, msg: 'We could not check the code. Check your internet and try again.' }; }
  },
  async submit(code) {
    const wrap = document.getElementById('otpWrap'), inp = document.getElementById('otpIn');
    if (!wrap || !inp) return;
    this.busy = true; this.hold = true; Session.verifying = true;
    inp.disabled = true; inp.blur(); this.msg('Checking…');
    document.querySelectorAll('#otpStage .otp-cell').forEach(c => c.classList.remove('cur'));
    wrap.classList.add('verifying');
    const [res] = await Promise.all([this.check(code), this.sleep(700)]);
    wrap.classList.remove('verifying');
    if (res.ok) {
      wrap.classList.add('ok');
      try { sessionStorage.removeItem('mca-otp'); sessionStorage.removeItem('mca-gate'); } catch (e) {}
      this.msg('Confirmed');
      Haptic.ok();
      await this.sleep(950);
      return this.done();
    }
    wrap.classList.add('bad', 'shake'); this.msg(res.msg); Haptic.no();
    await this.sleep(650);
    this.busy = false; this.hold = false; Session.verifying = false;
    wrap.classList.remove('shake');
    inp.value = ''; inp._prev = ''; inp.disabled = false;
    try { sessionStorage.removeItem('mca-otp'); } catch (e) {}
    this.paint('');
    wrap.classList.remove('bad');
    this.msg(res.msg);
    inp.focus();
  },
  async done() {
    this.hold = false; this.busy = false; Session.verifying = false;
    if (this.kind === 'email') {
      try {
        const { data } = await Backend.sb.auth.getSession();
        if (data && data.session) { Session.viaCode = true; return await Session.after(data.session.user); }
      } catch (e) { /* handled below */ }
      Session.error = 'We could not finish signing in. Try again.';
      return Session.set('error');
    }
  }
};
document.addEventListener('input', e => { if (e.target && e.target.id === 'otpIn') Otp.onInput(e.target); });
document.addEventListener('error', e => {
  const img = e.target;
  if (!img || !img.closest || !img.closest('.pk-av')) return;
  const av = img.closest('.pk-av');
  av.textContent = Gate.pkInitials(img.getAttribute('data-name') || '');
}, true);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && OB.sheet) { e.preventDefault(); OB.sheet = false; OB.langQ = ''; Gate.paint(); return; }
  const opt = e.target && e.target.closest && e.target.closest('.lg-opt');
  if (opt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    const all = Array.prototype.slice.call(opt.parentElement.parentElement.querySelectorAll('.lg-opt'));
    const i = all.indexOf(opt);
    if (i >= 0) { e.preventDefault(); const n = all[(i + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length]; if (n) n.focus(); }
  }
});
document.addEventListener('keydown', e => {
  const btn = e.target && e.target.closest && e.target.closest('.pk-choice');
  if (!btn || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
  const all = Array.prototype.slice.call(document.querySelectorAll('.pk-choice'));
  const i = all.indexOf(btn); if (i < 0) return;
  e.preventDefault();
  const n = all[(i + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length];
  if (n) n.focus();
});

/* What the person typed survives a reload or a trip to the mail app (this tab only) */
const gateSaved = () => { try { return JSON.parse(sessionStorage.getItem('mca-gate')) || {}; } catch (e) { return {}; } };
/* ---- first run, before sign-in: language, a short tour, then the privacy policy and terms ----
   A new policy version asks everyone to read and accept again (Data Protection Act 2019, s. 32 consent). */
const OB_POLICY_VERSION = '2026-11-19-v4';
const OB_KEY = 'mca-onboard';
const LEGAL = { privacy: 'legal/privacy.html', terms: 'legal/terms.html' };
const OB_T = {
  en: { name: 'English', sub: 'Continue in English', chooseLang: 'Choose your language', langNote: 'You can change this later from the sign-in screen.',
    next: 'Next', skip: 'Skip', back: 'Back', start: 'Get started', cont: 'Agree and continue', tourTitle: 'A quick tour',
    privacyTitle: 'Your privacy', privacyLead: 'The short version. Read the full documents before you agree.',
    agree1: 'I have read and agree to the Terms of Use and the Privacy Policy.', agree2: 'I am 18 or older.',
    readPrivacy: 'Privacy Policy', readTerms: 'Terms of Use',
    sumWhatT: 'What we collect', sumWhatB: 'Your name, email and sign-in details. Phone and photo only if you add them. The records your chama keeps.',
    sumWhyT: 'Why', sumWhyB: 'To sign you in and keep your chama’s records. We never sell data and there are no adverts.',
    sumWhoT: 'Who sees it', sumWhoB: 'Members see their own money and the group totals. Only the treasurer sees everyone’s records and can change them.',
    sumRightsT: 'Your rights', sumRightsB: 'See, correct, download or delete your data, and complain to the Data Protection Commissioner.',
    email: 'Email address', lang: 'Language', change: 'Change',
    pwLabel: 'Password', pwNew: 'Create a password', pwConfirm: 'Confirm password', pwPh: 'Your password', pwRuleLen: 'At least 6 characters', pwRuleCap: 'A capital letter', pwRuleNum: 'A number', pwRuleSym: 'A symbol, such as ! or #', pwRuleSame: 'Both passwords match' },
  sw: { name: 'Kiswahili', sub: 'Endelea kwa Kiswahili', chooseLang: 'Chagua lugha yako', langNote: 'Unaweza kubadilisha baadaye kwenye skrini ya kuingia.',
    next: 'Endelea', skip: 'Ruka', back: 'Rudi', start: 'Anza', cont: 'Kubali na uendelee', tourTitle: 'Ziara fupi',
    privacyTitle: 'Faragha yako', privacyLead: 'Kwa ufupi. Soma nyaraka kamili kabla ya kukubali.',
    agree1: 'Nimesoma na nakubali Masharti ya Matumizi na Sera ya Faragha.', agree2: 'Nina miaka 18 au zaidi.',
    readPrivacy: 'Sera ya Faragha', readTerms: 'Masharti ya Matumizi',
    sumWhatT: 'Tunachokusanya', sumWhatB: 'Jina lako, barua pepe na maelezo ya kuingia. Simu na picha ukiziongeza tu. Rekodi ambazo chama chako kinaweka.',
    sumWhyT: 'Kwa nini', sumWhyB: 'Kukuingiza na kuweka rekodi za chama chako. Hatuuzi data na hakuna matangazo.',
    sumWhoT: 'Nani anaona', sumWhoB: 'Wanachama wanaona pesa zao na jumla ya kikundi. Mweka hazina pekee anaona rekodi za wote na kuzibadilisha.',
    sumRightsT: 'Haki zako', sumRightsB: 'Kuona, kurekebisha, kupakua au kufuta data yako, na kulalamika kwa Kamishna wa Ulinzi wa Data.',
    email: 'Barua pepe', lang: 'Lugha', change: 'Badilisha',
    pwLabel: 'Nenosiri', pwNew: 'Tengeneza nenosiri', pwConfirm: 'Thibitisha nenosiri', pwPh: 'Nenosiri lako', pwRuleLen: 'Herufi 6 au zaidi', pwRuleCap: 'Herufi kubwa moja', pwRuleNum: 'Namba moja', pwRuleSym: 'Alama moja, kama ! au #', pwRuleSame: 'Yanalingana' }
};
/* Three slides, not eight: what it is, how it works for a group, and that it is private */
const OB_TIPS = {
  en: [
    { art: 'coins', t: 'Every shilling, accounted for', b: 'Contributions, loans, fines and payouts in one clear record your whole chama can trust.' },
    { art: 'group', t: 'One group, one truth', b: 'The treasurer records. Members see their own money and the group totals, always up to date.' },
    { art: 'shield', t: 'Private by design', b: 'Nobody sees another member’s money unless they keep the books. You can download or delete your data at any time.' }
  ],
  sw: [
    { art: 'coins', t: 'Kila shilingi inahesabiwa', b: 'Michango, mikopo, faini na malipo kwenye rekodi moja ambayo chama chote kinaiamini.' },
    { art: 'group', t: 'Kikundi kimoja, ukweli mmoja', b: 'Mweka hazina anarekodi. Wanachama wanaona pesa zao na jumla ya kikundi, kila wakati.' },
    { art: 'shield', t: 'Faragha kwanza', b: 'Hakuna anayeona pesa za mwanachama mwingine isipokuwa mweka hazina. Unaweza kupakua au kufuta data yako wakati wowote.' }
  ]
};

const LG_REQUIRED = ['app_name','title','subtitle','choose_other','search','hint','none','next','continue_in','sheet_title','done'];
const LG_ALL = (window.CHAMA_LANGUAGES || []).filter(l => {
  const row = (window.CHAMA_STRINGS || {})[l.code];
  return row && LG_REQUIRED.every(k => row[k] && String(row[k]).trim());
});
function lgFlag(country) {
  return String(country || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2).split('').map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
}
function lgT(code, key, vars) {
  const all = window.CHAMA_STRINGS || {};
  const table = all[code] || all.en || {};
  let text = table[key];
  if (text == null) text = (all.en || {})[key] || key;
  text = String(text);
  if (vars) Object.keys(vars).forEach(k => { text = text.replace('{' + k + '}', vars[k]); });
  return text;
}
function lgMatches(lang, raw) {
  const q = String(raw || '').trim();
  if (!q) return true;
  const chars = Array.from(q);
  const cps = chars.map(c => c.codePointAt(0)).filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF);
  if (chars.length === 2 && cps.length === 2) {
    return lang.country === String.fromCharCode(cps[0] - 0x1F1E6 + 65, cps[1] - 0x1F1E6 + 65);
  }
  const needle = q.toLowerCase();
  return [lang.name, lang.native, lang.code, lang.country, lgFlag(lang.country)].some(v => String(v).toLowerCase().indexOf(needle) !== -1);
}

/* Shared frame for every screen before the app opens: optional back button, body, footer with language and legal links */
function shell(inner, o = {}) {
  const L = OB_T[OB.lang()] || OB_T.en;
  const back = o.back ? `<button type="button" class="auth-back" ${o.back} aria-label="${esc(L.back)}">${icon('back')}</button>` : '<span></span>';
  const foot = o.foot === false ? '' : `<footer class="auth-foot">
    ${o.lang === false ? '' : `<button type="button" class="langbtn" data-ob="change-lang">${icon('globe')}<span>${esc(OB_T[OB.lang()].name)}</span></button>`}
    <nav aria-label="Legal"><a href="${LEGAL.terms}" target="_blank" rel="noopener">${esc(L.readTerms)}</a><a href="${LEGAL.privacy}" target="_blank" rel="noopener">${esc(L.readPrivacy)}</a></nav>
  </footer>`;
  return `<section class="auth">
    <div class="auth-top">${back}${o.right || ''}</div>
    <div class="auth-body${o.top ? ' top' : ''}">${inner}</div>
    ${foot}
  </section>`;
}
const pwField = (id, label, ac, ph, eye) => `<label class="f" for="${id}">${esc(label)}
  <span class="field pw">${icon('lock')}<input id="${id}" name="${id}" type="password" autocomplete="${ac}" placeholder="${esc(ph || '')}" autocapitalize="none" spellcheck="false">${eye ? `<button type="button" class="eye" data-act="togglePw" data-for="${id}" aria-pressed="false">${esc(GL().show)}</button>` : ''}</span></label>`;

const OB = {
  pick: null, slide: 0, ag1: false, ag2: false, revisit: false, sheet: false, langPick: null, langQ: '',
  read() { try { return JSON.parse(localStorage.getItem(OB_KEY)) || {}; } catch (e) { return {}; } },
  /* Agreement is given by continuing (the line under the buttons says so). The moment is kept with what is needed to show it later:
     policy version, time on the phone, how they continued, language, time zone and the screen. The server adds its own time,
     the IP address and the browser it saw (record_consent_v2), and keeps the record even after the account is deleted. */
  agree(method) {
    const st = this.read();
    if (st.policy === OB_POLICY_VERSION && st.agreedAt) { if (Backend.sb) this.syncConsent(); return; }
    let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    this.write({ policy: OB_POLICY_VERSION, agreedAt: new Date().toISOString(), method: String(method || 'continue'), tz, locale: (navigator.language || '').slice(0, 20),
      screen: (screen && screen.width ? screen.width + 'x' + screen.height : ''), serverSynced: null });
    if (Backend.sb) this.syncConsent();
  },
  syncConsent() {
    const st = this.read(); if (st.policy !== OB_POLICY_VERSION || !st.agreedAt || st.serverSynced === OB_POLICY_VERSION || !Backend.sb) return;
    const app = __M_src_content_app_info_js.APP.version;
    Backend.sb.rpc('record_consent_v2', { p_policy_version: OB_POLICY_VERSION, p_app_version: app, p_method: st.method || 'continue', p_locale: st.locale || navigator.language || null,
      p_timezone: st.tz || null, p_client_time: st.agreedAt, p_context: { lang: this.lang(), screen: st.screen || '', terms: LEGAL.terms, privacy: LEGAL.privacy, standalone: !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches) } })
      .then(r => {
        if (!r.error && r.data && r.data.ok) return this.write({ serverSynced: OB_POLICY_VERSION, serverAt: r.data.accepted_at || null });
        if (r.error && /record_consent_v2|does not exist|Could not find/i.test(r.error.message || ''))   /* older database: the original recorder */
          return Backend.sb.rpc('record_consent', { p_policy_version: OB_POLICY_VERSION, p_app_version: app }).then(r2 => { if (!r2.error) this.write({ serverSynced: OB_POLICY_VERSION }); });
      }).catch(() => {});
  },
  /* someone already signed in who has not accepted this version yet: one calm sheet, Continue records it */
  ensureConsent() {
    const st = this.read();
    if (st.policy === OB_POLICY_VERSION && st.agreedAt) return this.syncConsent();
    if (this._asked) return; this._asked = true;
    __M_src_ui_toast_js.Pop.confirm({ title: 'We updated our terms',
      html: `<p>We added group chat, meetings and minutes, and approval for new members, and explained them in the Terms of Use and Privacy Policy. Nothing about who can see your money has changed.</p><p class="legal-mini">By continuing you agree to the <a href="${LEGAL.terms}" target="_blank" rel="noopener">Terms of Use</a> and the <a href="${LEGAL.privacy}" target="_blank" rel="noopener">Privacy Policy</a>.</p>`,
      confirmLabel: 'Continue', hideCancel: true, onYes: () => this.agree('continue:updated-terms') });
  },
  write(p) { try { localStorage.setItem(OB_KEY, JSON.stringify(Object.assign(this.read(), p))); } catch (e) { toast('Storage is full. Free some space and try again'); } },
  lang() { const l = this.read().lang; return OB_T[l] ? l : 'en'; },
  L() { return OB_T[this.lang()]; },
  complete() { const s = this.read(); return !!(OB_T[s.lang] && (s.tipsDone || s.agreedAt)); },
  needed() { return !this.complete() || this.revisit; },
  stepNow() { const s = this.read(); if (this.revisit || !OB_T[s.lang]) return 'lang'; return 'tips'; },

  chosen() {
    const ok = c => LG_ALL.some(l => l.code === c);
    try { const c = localStorage.getItem('chama.lang'); if (ok(c)) return c; } catch (e) {}
    const saved = this.read().chosen;
    if (ok(saved)) return saved;
    return this.lang();
  },
  applyChoice(code) {
    if (!LG_ALL.some(l => l.code === code)) return;
    try { localStorage.setItem('chama.lang', code); } catch (e) {}
    try { document.documentElement.lang = code; } catch (e) {}
    this.write({ lang: code === 'sw' ? 'sw' : 'en', chosen: code });
  },
  langOption(lang, mode, code) {
    const on = lang.code === code;
    const sub = mode === 'sheet' ? lang.name : lgT(code, 'continue_in', { name: lang.native });
    return `<li><button type="button" class="lg-opt" role="radio" data-ob="lg-pick" data-v="${esc(lang.code)}" aria-checked="${on ? 'true' : 'false'}" aria-label="${esc(lang.native + ' (' + lang.name + ')')}" tabindex="${on ? '0' : '-1'}"><span class="lg-flag" aria-hidden="true">${lgFlag(lang.country)}</span><span class="lg-labels"><span class="lg-name">${esc(lang.native)}</span><span class="lg-sub">${esc(sub)}</span></span><span class="lg-check" aria-hidden="true">${icon('check')}</span></button></li>`;
  },
  langScreen() {
    const code = this.langPick || this.chosen();
    const meta = LG_ALL.find(l => l.code === code) || LG_ALL[0];
    const dir = meta && meta.dir === 'rtl' ? 'rtl' : 'ltr';
    const primary = LG_ALL.filter(l => l.primary);
    if (meta && !meta.primary) primary.unshift(meta);
    const shown = LG_ALL.filter(l => lgMatches(l, this.langQ)).slice().sort((a, b) => a.name.localeCompare(b.name));
    const open = !!this.sheet;
    return `<div dir="${dir}">${shell(`${markTile()}
<h1 class="auth-t">${esc(lgT(code, 'title'))}</h1>
<p class="auth-s">${esc(lgT(code, 'subtitle'))}</p>
<ul class="lg-list" role="radiogroup" aria-label="${esc(lgT(code, 'title'))}">${primary.map(l => this.langOption(l, 'main', code)).join('')}</ul>
<button type="button" class="btn ghost lg-more" data-ob="lg-open" aria-haspopup="dialog">${esc(lgT(code, 'choose_other'))}</button>
<button type="button" class="btn pri block" style="margin-top:18px" data-ob="lg-next">${esc(lgT(code, 'next'))}</button>`, { foot: false })}
<div class="lg-back${open ? ' open' : ''}" data-ob="lg-close"></div>
<section class="lg-sheet${open ? ' open' : ''}" role="dialog" aria-modal="true" aria-hidden="${open ? 'false' : 'true'}" aria-label="${esc(lgT(code, 'sheet_title'))}">
<div class="lg-grab" aria-hidden="true"></div>
<div class="lg-sheet-h"><h2>${esc(lgT(code, 'sheet_title'))}</h2><button type="button" class="btn ghost" data-ob="lg-close">${esc(lgT(code, 'done'))}</button></div>
<div class="lg-search">${icon('search')}<input id="lgSearch" type="search" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="search" placeholder="${esc(lgT(code, 'search'))}" aria-label="${esc(lgT(code, 'search'))}" value="${esc(this.langQ || '')}"></div>
<p class="lg-hint">${esc(lgT(code, 'hint'))}</p>
<ul class="lg-all" id="lgAll" role="radiogroup" aria-label="${esc(lgT(code, 'sheet_title'))}">${shown.map(l => this.langOption(l, 'sheet', code)).join('')}</ul>
<p class="lg-empty" id="lgEmpty"${shown.length ? ' hidden' : ''}>${esc(lgT(code, 'none'))}</p>
</section></div>`;
  },
  html() {
    const step = this.stepNow(), L = this.L(), lang = this.lang();
    if (step === 'lang') return this.langScreen();
    if (step === 'tips') {
      const tips = OB_TIPS[lang], i = this.slide, last = i === tips.length - 1;
      const slides = tips.map((t, k) => `<div class="ob-slide" aria-hidden="${k !== i}"><div class="auth-art">${art(t.art)}</div><h2>${esc(t.t)}</h2><p>${esc(t.b)}</p></div>`).join('');
      const dots = tips.map((t, k) => `<button type="button" class="ob-dot" data-ob="slide" data-i="${k}" aria-label="${k + 1} / ${tips.length}" aria-current="${k === i}"></button>`).join('');
      return shell(`<div class="ob-vp" id="obVp" aria-roledescription="carousel" aria-label="${esc(L.tourTitle)}"><div class="ob-track" id="obTrack" style="transform:translateX(${-i * 100}%)">${slides}</div></div>
<div class="ob-dots">${dots}</div><span class="vh" id="obCount" aria-live="polite">${i + 1} / ${tips.length}</span>
<button type="button" class="btn pri block" style="margin-top:22px" data-ob="next">${esc(last ? L.start : L.next)}</button>`,
        { right: `<button type="button" class="btn ghost" data-ob="skip-tips">${esc(L.skip)}</button>`, back: `data-ob="prev" id="obPrev"${i === 0 ? ' style="visibility:hidden"' : ''}`, foot: false });
    }
    return '';
  },
  go(i) {
    const tips = OB_TIPS[this.lang()], n = tips.length;
    this.slide = Math.max(0, Math.min(n - 1, i));
    const tr = document.getElementById('obTrack');
    if (!tr) return Gate.paint();
    tr.style.transform = 'translateX(' + (-this.slide * 100) + '%)';
    document.querySelectorAll('.ob-dot').forEach((d, k) => d.setAttribute('aria-current', String(k === this.slide)));
    document.querySelectorAll('.ob-slide').forEach((d, k) => d.setAttribute('aria-hidden', String(k !== this.slide)));
    const c = document.getElementById('obCount'); if (c) c.textContent = (this.slide + 1) + ' / ' + n;
    const pv = document.getElementById('obPrev'); if (pv) pv.style.visibility = this.slide === 0 ? 'hidden' : '';
    const nx = document.querySelector('[data-ob="next"]'); if (nx) nx.textContent = this.slide === n - 1 ? this.L().start : this.L().next;
  },
  move(d) { if (document.getElementById('obTrack')) this.go(this.slide + d); },
  finishTips() { this.write({ tipsDone: true }); this.slide = 0; Gate.paint(); }
};

document.addEventListener('click', e => {
  const t = e.target.closest ? e.target.closest('[data-ob],[data-gm]') : null;
  if (!t) return;
  if (t.dataset.gm) {
    if (Gate.mode === 'start' && (t.dataset.gm === 'in' || t.dataset.gm === 'up')) OB.agree('continue:' + (t.dataset.gm === 'in' ? 'sign-in' : 'create-account'));
    const i = document.getElementById('gateEmail'); if (i) Gate.email = i.value;
    const idEl = document.getElementById('gateId'); if (idEl) Gate.id = idEl.value;
    const pwEl = document.getElementById('gatePw'); if (pwEl && Gate.mode === 'in') Gate.signPw = pwEl.value;
    Gate.mode = t.dataset.gm; Gate.notice = ''; Gate.sent = false; Gate.paint();
    const f = document.querySelector('#view input:not([type=checkbox])'); if (f && Gate.mode !== 'start') setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (err) {} }, 80);
    return;
  }
  switch (t.dataset.ob) {
    case 'change-lang': OB.revisit = true; OB.pick = null; OB.sheet = false; OB.langPick = null; OB.langQ = ''; return Gate.paint();
    case 'lg-open': OB.sheet = true; return Gate.paint();
    case 'lg-close': OB.sheet = false; OB.langQ = ''; return Gate.paint();
    case 'lg-pick': OB.langPick = t.dataset.v; OB.sheet = false; return Gate.paint();
    case 'lg-next': OB.applyChoice(OB.langPick || OB.chosen()); OB.revisit = false; OB.langPick = null; OB.sheet = false; OB.langQ = ''; return Gate.paint();
    case 'slide': return OB.go(Number(t.dataset.i));
    case 'prev': return OB.go(OB.slide - 1);
    case 'next': return OB.slide >= OB_TIPS[OB.lang()].length - 1 ? OB.finishTips() : OB.go(OB.slide + 1);
    case 'skip-tips': return OB.finishTips();
  }
});
let obSwipeX = null;
document.addEventListener('pointerdown', e => { obSwipeX = (e.target.closest && e.target.closest('#obVp')) ? e.clientX : null; }, true);
document.addEventListener('pointerup', e => {
  if (obSwipeX === null) return;
  const dx = e.clientX - obSwipeX; obSwipeX = null;
  if (Math.abs(dx) > 40) OB.move(dx < 0 ? 1 : -1);
}, true);
document.addEventListener('keydown', e => {
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (e.key === 'ArrowRight') OB.move(1);
  if (e.key === 'ArrowLeft') OB.move(-1);
});
document.addEventListener('input', e => { if (e.target && (e.target.id === 'gatePw' || e.target.id === 'gatePw2')) Gate.refreshRules(); });


const GT = {
  en: { inTitle: 'Welcome back', inSub: 'Sign in with your email or username and your password.', idLabel: 'Email or username', idPh: 'you@example.com', cta: 'Sign in', signing: 'Signing in…',
    forgot: 'Forgot password?', newHere: 'New here?', createAcct: 'Create an account', firstTime: 'Signed in before with an email code only? Use Forgot password once to set one.',
    upTitle: 'Create your account', upSub: 'Enter your email. We will send a code to confirm it is yours, then you choose a username and password.', sendCode: 'Send code', haveAcct: 'Already have an account?', signInLink: 'Sign in',
    fgTitle: 'Reset your password', fgSub: 'Enter the email on your account. We will send a code, then you choose a new password.',
    keepPw: 'Keep my current password',
    setupTitle: 'Finish your account', setupSub: 'Choose your name, a username and one password. You will use them for every Chama you join.', setupSubGoogle: 'Choose your name and a username. You can keep signing in with Google.', resetTitle: 'Choose a new password', resetSub: 'You will use this password to sign in.',
    fullName: 'Full name', username: 'Username', usernameHint: '3 to 20 letters, numbers, dot, dash or underscore', saveCont: 'Save and continue', show: 'Show', hide: 'Hide',
    welcome: n => 'Welcome' + (n ? ', ' + n : ''), welcomeSub: 'You are not in a Chama yet. Start one, or join the group that invited you.', createChama: 'Start a new Chama', joinChama: 'Join with an invitation',
    chamaName: 'Name of your Chama', chamaPh: 'e.g. Umoja Savings Group', create: 'Create Chama', creating: 'Creating…', joinSub: 'Paste the whole link from your invitation email. Or open that link on this phone.', joinPh: 'Paste the invitation link', joinBtn: 'Check invitation',
    chooseTitle: 'Choose your Chama', chooseSub: 'You belong to more than one Chama. Pick the one to open.', back: 'Back', signOut: 'Sign out', roleWord: r => ({ treasurer: 'Treasurer', secretary: 'Secretary', member: 'Member' }[r] || r), another: 'Start another Chama', notMember: 'You are not a member of that Chama. Choose one of yours.',
    google: 'Continue with Google', or: 'or', startTitle: 'Your chama, beautifully kept.', startSub: 'Contributions, loans and payouts in one clear record for every member.', agreeNote: 'By continuing you agree to the Terms of Use and Privacy Policy.',
    codeTitle: 'Check your email', codeSub: (n, e) => `Enter the ${n}-digit code we sent to <b>${e}</b>.`, sending: 'Sending your code…', signingIn: 'Signing you in…', cancel: 'Cancel' },
  sw: { inTitle: 'Karibu tena', inSub: 'Ingia kwa barua pepe au jina la mtumiaji na nenosiri lako.', idLabel: 'Barua pepe au jina la mtumiaji', idPh: 'wewe@mfano.com', cta: 'Ingia', signing: 'Inaingia…',
    forgot: 'Umesahau nenosiri?', newHere: 'Mgeni?', createAcct: 'Fungua akaunti', firstTime: 'Uliingia awali kwa msimbo tu? Tumia "Umesahau nenosiri?" mara moja.',
    upTitle: 'Fungua akaunti yako', upSub: 'Weka barua pepe yako. Tutatuma msimbo kuthibitisha, kisha uchague jina la mtumiaji na nenosiri.', sendCode: 'Tuma msimbo', haveAcct: 'Tayari una akaunti?', signInLink: 'Ingia',
    fgTitle: 'Weka nenosiri jipya', fgSub: 'Weka barua pepe ya akaunti yako. Tutatuma msimbo, kisha uchague nenosiri jipya.',
    keepPw: 'Baki na nenosiri langu la sasa',
    setupTitle: 'Kamilisha akaunti yako', setupSub: 'Chagua jina lako, jina la mtumiaji na nenosiri moja. Utavitumia kwa kila Chama.', setupSubGoogle: 'Chagua jina lako na jina la mtumiaji. Unaweza kuendelea kuingia na Google.', resetTitle: 'Chagua nenosiri jipya', resetSub: 'Utatumia nenosiri hili kuingia.',
    fullName: 'Jina kamili', username: 'Jina la mtumiaji', usernameHint: 'Herufi, nambari, nukta, kistari au mstari wa chini; 3 hadi 20', saveCont: 'Hifadhi na endelea', show: 'Onyesha', hide: 'Ficha',
    welcome: n => 'Karibu' + (n ? ', ' + n : ''), welcomeSub: 'Bado hujajiunga na Chama. Anzisha kimoja, au jiunge na kikundi kilichokualika.', createChama: 'Anzisha Chama kipya', joinChama: 'Jiunge kwa mwaliko',
    chamaName: 'Jina la Chama chako', chamaPh: 'mf. Umoja Savings Group', create: 'Anzisha Chama', creating: 'Inaanzisha…', joinSub: 'Bandika kiungo chote kutoka barua pepe ya mwaliko. Au fungua kiungo hicho kwenye simu hii.', joinPh: 'Bandika kiungo cha mwaliko', joinBtn: 'Angalia mwaliko',
    chooseTitle: 'Chagua Chama chako', chooseSub: 'Uko katika zaidi ya Chama kimoja. Chagua cha kufungua.', back: 'Rudi', signOut: 'Toka', roleWord: r => ({ treasurer: 'Mweka hazina', secretary: 'Katibu', member: 'Mwanachama' }[r] || r), another: 'Anzisha Chama kingine', notMember: 'Wewe si mwanachama wa Chama hicho. Chagua kimoja chako.',
    google: 'Endelea na Google', or: 'au', startTitle: 'Chama chako, kwa mpangilio.', startSub: 'Michango, mikopo na malipo kwenye rekodi moja wazi kwa kila mwanachama.', agreeNote: 'Ukiendelea unakubali Masharti ya Matumizi na Sera ya Faragha.',
    codeTitle: 'Angalia barua pepe yako', codeSub: (n, e) => `Weka msimbo wa tarakimu ${n} tuliotuma kwa <b>${e}</b>.`, sending: 'Inatuma msimbo…', signingIn: 'Inakuingiza…', cancel: 'Ghairi' }
};
const GL = () => GT[OB.lang()] || GT.en;
const AUTH_T = GT;

/* live username check: green tick when free, a clear reason when not, and suggestions made from the person's name */
const UserCheck = {
  t: null, seq: 0, server: true,
  local(name) {
    const p = String(name || '').toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(Boolean); if (!p.length) return [];
    const f = p[0].slice(0, 12), l = (p[p.length - 1] || '').slice(0, 12), n = String(10 + Math.floor(Math.random() * 89));
    return [...new Set([f + '.' + l, f + l, f[0] + l, f + n].filter(x => /^[a-z0-9._-]{3,20}$/.test(x) && x !== f + '.'))].slice(0, 4);
  },
  show(state, text) { const el = document.getElementById('userSt'); if (!el) return; el.className = 'u-st ' + state; el.innerHTML = (state === 'ok' ? icon('check', 's') : state === 'bad' ? icon('alert', 's') : state === 'wait' ? '<span class="spin sm" aria-hidden="true"></span>' : '') + '<span>' + esc(text) + '</span>'; const f = document.getElementById('setUser'); if (f) f.setAttribute('aria-invalid', state === 'bad' ? 'true' : 'false'); },
  async check(v) {
    const u = String(v || '').trim().toLowerCase(), me = ++this.seq;
    if (!u) return this.show('', GL().usernameHint);
    if (!/^[a-z0-9._-]{3,20}$/.test(u)) return this.show('bad', u.length < 3 ? 'At least 3 characters' : u.length > 20 ? '20 characters at most' : 'Only letters, numbers, dot, dash or underscore');
    if (!this.server || !Backend.sb) return this.show('', 'Looks fine. Checked again when you save.');
    this.show('wait', 'Checking…');
    try {
      const { data, error } = await Backend.sb.rpc('username_available', { p_username: u });
      if (me !== this.seq) return;
      if (error) { if (/Could not find the function|PGRST202|schema cache/i.test(error.message || '')) this.server = false; return this.show('', 'Looks fine. Checked again when you save.'); }
      if (data && data.available) return this.show('ok', '@' + u + ' is yours if you want it');
      const why = { taken: 'Someone already has this username', retired: 'This username was used before and cannot be reused', reserved: 'This username is reserved', format: 'Only letters, numbers, dot, dash or underscore' };
      this.show('bad', why[(data && data.reason) || 'taken'] || 'Not available');
    } catch (e) { if (me === this.seq) this.show('', 'Could not check now. Checked again when you save.'); }
  },
  async suggest() {
    const box = document.getElementById('userSugg'); if (!box) return;
    const name = ((document.getElementById('setName') || {}).value || '').trim(); if (name.length < 2) { box.innerHTML = ''; return; }
    let list = [];
    if (this.server && Backend.sb) { try { const { data, error } = await Backend.sb.rpc('username_suggestions', { p_full_name: name }); if (!error && Array.isArray(data)) list = data; else if (error && /Could not find the function|PGRST202|schema cache/i.test(error.message || '')) this.server = false; } catch (e) {} }
    if (!list.length) list = this.local(name);
    box.innerHTML = list.length ? `<span>Try:</span>${list.map(x => `<button type="button" class="u-chip" data-uname="${esc(x)}">${esc(x)}</button>`).join('')}` : '';
  },
  init() {
    const f = document.getElementById('setUser'); if (!f) return;
    if (f.value) this.check(f.value);
    this.suggest();
  }
};
document.addEventListener('input', e => {
  if (!e.target) return;
  if (e.target.id === 'setUser') { const v = e.target.value.toLowerCase().replace(/\s+/g, ''); if (v !== e.target.value) e.target.value = v; clearTimeout(UserCheck.t); UserCheck.t = setTimeout(() => UserCheck.check(v), 350); }
  if (e.target.id === 'setName') { clearTimeout(UserCheck.tn); UserCheck.tn = setTimeout(() => UserCheck.suggest(), 600); }
});
document.addEventListener('click', e => {
  const c = e.target.closest && e.target.closest('[data-uname]'); if (!c) return;
  const f = document.getElementById('setUser'); if (!f) return; f.value = c.dataset.uname; UserCheck.check(f.value); f.focus();
});

const Gate = {
  email: gateSaved().email || '', sent: !!gateSaved().sent, sending: false, signing: false, stage: 'entry', pw: null, id: '', signPw: '', coolUntil: 0, coolTimer: null, sub: null, joinMsg: '', notice: '', draft: { name: '', listed: true, link: '' }, nameErr: '', formErr: '', joinBusy: false, opening: false, mode: (function () { let m = gateSaved().mode; if (!m) { try { m = sessionStorage.getItem('mca-intent'); } catch (e) {} } return m === 'up' || m === 'forgot' || m === 'in' ? m : 'start'; })(),
  navRow(x) { return `<div class="btns">${x}</div>`; },
  agreeLine() {
    const sw = OB.lang() === 'sw', t = `<a href="${LEGAL.terms}" target="_blank" rel="noopener">${sw ? 'Masharti' : 'Terms'}</a>`, p = `<a href="${LEGAL.privacy}" target="_blank" rel="noopener">${sw ? 'Sera ya Faragha' : 'Privacy Policy'}</a>`;
    return `<p class="legal-mini">${sw ? `Ukiendelea, unakubali ${t} na ${p} yetu.` : `By continuing, you agree to our ${t} and ${p}.`}</p>`;
  },
  pwProblem(p) { return p.length < 6 ? 'Use at least 6 characters' : !/[A-Z]/.test(p) ? 'Add a capital letter' : !/[0-9]/.test(p) ? 'Add a number' : !/[^A-Za-z0-9]/.test(p) ? 'Add a symbol, such as ! or #' : p.length > 72 ? 'Use 72 characters or fewer' : ''; },
  refreshRules() {
    const p = (document.getElementById('gatePw') || {}).value || '', p2 = (document.getElementById('gatePw2') || {}).value || '';
    const set = (k, ok) => { const li = document.querySelector('#pwRules [data-r="' + k + '"]'); if (li) li.classList.toggle('ok', !!ok); };
    set('len', p.length >= 6); set('cap', /[A-Z]/.test(p)); set('num', /[0-9]/.test(p)); set('sym', /[^A-Za-z0-9]/.test(p)); set('same', p.length > 0 && p === p2);
  },
  pwFields(withConfirm) {
    const L = OB.L();
    return pwField('gatePw', L.pwNew, 'new-password', L.pwPh, true) +
      (withConfirm ? pwField('gatePw2', L.pwConfirm, 'new-password', L.pwConfirm, false) : '') +
      `<ul class="pwr" id="pwRules" aria-live="polite"><li data-r="len">${esc(L.pwRuleLen)}</li><li data-r="cap">${esc(L.pwRuleCap)}</li><li data-r="num">${esc(L.pwRuleNum)}</li><li data-r="sym">${esc(L.pwRuleSym)}</li>${withConfirm ? `<li data-r="same">${esc(L.pwRuleSame)}</li>` : ''}</ul>`;
  },
  eyeBtn() { const G = GL(); return `<button type="button" class="eye" data-act="togglePw" aria-pressed="false">${esc(G.show)}</button>`; },
  /* Resend countdown on the create-account button */
  armCool() {
    clearInterval(this.coolTimer);
    if ((this.coolUntil || 0) <= Date.now()) return;
    const tick = () => {
      const b = document.querySelector('[data-act="gateSend"]');
      if (!b) { clearInterval(this.coolTimer); return; }
      const left = Math.max(0, Math.ceil((this.coolUntil - Date.now()) / 1000));
      const label = b.querySelector('.btn-label');
      const sw = OB.lang() === 'sw';
      if (left > 0) { b.disabled = true; if (label) label.textContent = sw ? `Tuma tena baada ya ${left}s` : `Resend in ${left}s`; }
      else { b.disabled = false; b.removeAttribute('aria-busy'); if (label) label.textContent = GL().sendCode; clearInterval(this.coolTimer); }
    };
    tick();
    this.coolTimer = setInterval(tick, 500);
  },
  authCard() {
    const L = OB.L(), G = GL(), mode = this.mode;
    const note = this.notice ? `<p class="notice" role="alert">${icon('alert', 's')}<span>${esc(this.notice)}</span></p>` : '';
    if (mode === 'start') return shell(`${markTile('lg')}
<h1 class="auth-t">${esc(G.startTitle)}</h1>
<p class="auth-s">${esc(G.startSub)}</p>
${note}
<div class="auth-start">
<button type="button" class="btn pri block auth-main" data-gm="in">${icon('profile')}<span>${esc(G.cta)}</span></button>
<button type="button" class="btn tint block auth-main" data-gm="up">${icon('userPlus')}<span>${esc(G.createAcct)}</span></button>
<div class="auth-or">${esc(G.or)}</div>
<button type="button" class="btn google block" data-act="gateGoogle"${this.signing ? ' disabled aria-busy="true"' : ''}>${GOOGLE_G}<span>${esc(G.google)}</span></button>
</div>
${this.agreeLine()}`);
    if (mode === 'in') return shell(`<h1 class="auth-t" style="margin-top:0">${esc(G.inTitle)}</h1>
<p class="auth-s">${esc(G.inSub)}</p>
<form class="auth-form" id="signForm" novalidate>
<label class="f" for="gateId">${esc(G.idLabel)}<span class="field">${icon('profile')}<input id="gateId" name="identifier" type="text" inputmode="email" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="${esc(G.idPh)}" value="${esc(this.id)}"></span></label>
${pwField('gatePw', L.pwLabel, 'current-password', L.pwPh, true)}
<div style="display:flex;justify-content:flex-end"><button type="button" class="linkish" data-gm="forgot">${esc(G.forgot)}</button></div>
<p class="ferr" id="signErr" role="alert" aria-live="polite">${esc(this.notice || '')}</p>
<button type="button" class="btn pri block" data-act="gateSignIn"${this.signing ? ' disabled aria-busy="true"' : ''}><span class="btn-label">${esc(this.signing ? G.signing : G.cta)}</span></button>
</form>
<p class="auth-alt">${esc(G.newHere)} <button type="button" data-gm="up">${esc(G.createAcct)}</button></p>`, { back: 'data-gm="start"' });
    if (mode === 'up') {
      const sw = OB.lang() === 'sw';
      const left = Math.max(0, Math.ceil(((this.coolUntil || 0) - Date.now()) / 1000));
      const sendLabel = this.sending ? (sw ? 'Inatuma…' : 'Sending…') : left > 0 ? (sw ? `Tuma tena baada ya ${left}s` : `Resend in ${left}s`) : G.sendCode;
      const sendOff = this.sending || left > 0;
      return shell(`<h1 class="auth-t" style="margin-top:0">${esc(G.upTitle)}</h1>
<p class="auth-s">${esc(G.upSub)}</p>
<div class="auth-form">
<label class="f" for="gateEmail">${esc(L.email)}<span class="field">${icon('mail')}<input id="gateEmail" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="you@example.com" value="${esc(this.email)}"></span></label>
<p class="ferr" id="upErr" role="alert" aria-live="polite">${esc(this.notice || '')}</p>
<button type="button" class="btn pri block" data-act="gateSend"${sendOff ? ' disabled aria-busy="true"' : ''}><span class="btn-label">${esc(sendLabel)}</span></button>
${this.agreeLine()}
</div>
<p class="auth-alt">${esc(G.haveAcct)} <button type="button" data-gm="in">${esc(G.signInLink)}</button></p>`, { back: 'data-gm="start"' });
    }
    return shell(`<h1 class="auth-t" style="margin-top:0">${esc(G.fgTitle)}</h1><p class="auth-s">${esc(G.fgSub)}</p>${note}
<div class="auth-form">
<label class="f" for="gateEmail">${esc(L.email)}<span class="field">${icon('mail')}<input id="gateEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="you@example.com" value="${esc(this.email)}"></span></label>
<button type="button" class="btn pri block" data-act="gateSend"><span class="btn-label">${esc(G.sendCode)}</span></button>
</div>
<p class="auth-alt"><button type="button" data-gm="in">${esc(G.signInLink)}</button></p>`, { back: 'data-gm="in"' });
  },
  setupCard() {
    const G = GL(), isNew = Session.setupMode === 'new', acct = Session.account || {};
    const note = this.notice ? `<p class="notice" role="alert">${icon('alert', 's')}<span>${esc(this.notice)}</span></p>` : '';
    const googleNew = isNew && Session.usesGoogle();
    const nameNow = acct.full_name || (googleNew ? Session.googleName() : '');
    const fields = isNew ? `<label class="f" for="setName">${esc(G.fullName)}<span class="field">${icon('profile')}<input id="setName" autocomplete="name" autocapitalize="words" maxlength="120" value="${esc(nameNow)}" placeholder="e.g. Wanjiku Kamau"></span></label>
<label class="f" for="setUser">${esc(G.username)}<span class="field">${icon('tag')}<input id="setUser" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="20" value="${esc(/^user[0-9a-f]{8}$/.test(acct.username || '') ? '' : (acct.username || ''))}" placeholder="e.g. wanjiku.k"></span><small class="u-st" id="userSt" aria-live="polite">${esc(G.usernameHint)}</small></label><div class="u-sugg" id="userSugg" aria-label="Suggested usernames"></div>` : '';
    return shell(`<h1 class="auth-t" style="margin-top:0">${esc(isNew ? G.setupTitle : G.resetTitle)}</h1><p class="auth-s">${esc(isNew ? (googleNew ? G.setupSubGoogle : G.setupSub) : G.resetSub)}</p>
<p class="tag brand" style="margin-top:14px">${icon('mail', 's')}${esc(Session.email)}</p>${note}
<div class="auth-form">${fields}${googleNew ? '' : this.pwFields(false)}
<button type="button" class="btn pri block" data-act="gateSetup"${this.signing ? ' disabled aria-busy="true"' : ''}>${this.signing ? '<span class="spin" aria-hidden="true"></span>' : ''}<span>${esc(G.saveCont)}</span></button>
${isNew ? '' : `<button type="button" class="btn ghost block" style="margin-top:8px" data-act="gateKeepPw">${esc(G.keepPw)}</button>`}
<button type="button" class="btn ghost block" style="margin-top:8px" data-act="gateSignOut">${esc(G.signOut)}</button></div>`, { top: true, lang: false });
  },
  /* Choose a Chama, welcome (no Chama yet), Create a Chama and Join a Chama */
  hubPage(isWelcome) {
    if (this.sub === 'create') return this.createPage();
    if (this.sub === 'join') return this.joinPage();
    const H = HL(), G = GL(), list = Session.workspaces || [];
    if (!isWelcome || list.length) return this.pickerPage(H, G, list);
    return shell(`<div class="auth-art">${art('group')}</div>
<h1 class="auth-t" style="margin-top:6px">${esc(G.welcome(Session.displayName()))}</h1>
<p class="auth-s">${esc((Session.pending || []).length ? 'Your request is with the treasurer. You can also start your own Chama.' : G.welcomeSub)}</p>
${this.pendingHtml()}
<div class="list" style="margin-top:26px">
<button type="button" class="li has-ic" data-act="wsSub" data-s="create"><span class="li-ic">${icon('plus')}</span><span class="li-main"><b>${esc(H.createRow)}</b><small>${esc(H.createRowSub)}</small></span>${icon('chev', 'chev')}</button>
<button type="button" class="li has-ic" data-act="wsSub" data-s="join"><span class="li-ic t-gold">${icon('key')}</span><span class="li-main"><b>${esc(H.joinRow)}</b><small>${esc(H.joinRowSub)}</small></span>${icon('chev', 'chev')}</button>
</div>
<button type="button" class="btn ghost block" style="margin-top:18px" data-act="gateSignOut">${icon('out')}${esc(G.signOut)}</button>
${this.accountFoot()}`, { lang: false });
  },

  pickerPage(H, G, list) {
    const sw = OB.lang() === 'sw';
    const canLeave = !!(Session.role || (typeof Store !== 'undefined' && Store.chamaId));
    const lastId = (typeof Store !== 'undefined' && list.some(w => w.chama_id === Store.chamaId)) ? Store.chamaId : '';
    if (!this.picked || !list.some(w => w.chama_id === this.picked)) this.picked = lastId || (list.length === 1 ? list[0].chama_id : '');
    const picked = list.find(w => w.chama_id === this.picked);
    const n = list.length;
    const openLabel = picked ? (sw ? 'Fungua ' + picked.chama_name : 'Open ' + picked.chama_name) : (sw ? 'Chagua Chama' : 'Choose a Chama');
    const rows = list.map((w, i) => {
      const on = w.chama_id === this.picked;
      const photo = String(w.photo || w.chama_photo || w.logo_url || w.image_url || '');
      const safePhoto = /^(https:\/\/|data:image\/(png|jpeg|webp);base64,)[^"'<>\s]+$/.test(photo) ? photo : '';
      const alt = ['', ' alt-1', ' alt-2', ' alt-3'][i % 4];
      const av = safePhoto
        ? `<span class="pk-av${alt}"><img class="av" alt="Photo of ${esc(w.chama_name || 'the Chama')}" data-name="${esc(w.chama_name || '')}" src="${esc(safePhoto)}"></span>`
        : `<span class="pk-av${alt}">${esc(this.pkInitials(w.chama_name))}</span>`;
      const meta = [G.roleWord(w.role), w.display_tag, typeof w.member_count === 'number' ? H.members(w.member_count) : ''].filter(Boolean).map(esc).join(' · ');
      const last = w.chama_id === lastId ? `<span class="tag brand">${sw ? 'Iliyofunguliwa mwisho' : 'Open now'}</span>` : '';
      return `<li><button type="button" class="pk-choice" role="radio" data-act="pkPick" data-id="${esc(w.chama_id)}" aria-checked="${on ? 'true' : 'false'}" tabindex="${on || (!this.picked && i === 0) ? '0' : '-1'}">
${av}<span class="pk-info"><span class="pk-name">${esc(w.chama_name || 'Chama')}</span><span class="pk-meta">${meta}${last}</span></span>
<span class="pk-check" aria-hidden="true">${icon('check')}</span></button></li>`;
    }).join('');
    const lead = n > 1 ? (sw ? 'Uko kwenye zaidi ya kimoja. Chagua kimoja ufungue.' : 'You belong to ' + n + ' Chamas. Pick one to open.') : (sw ? 'Chagua Chama ufungue.' : 'Pick the Chama to open.');
    return shell(`<h1 class="auth-t" style="margin-top:0">${sw ? 'Chagua Chama' : 'Your Chamas'}</h1>
<p class="auth-s">${esc(lead)}</p>
<ul class="pk-list" role="radiogroup" aria-label="${sw ? 'Chama zako' : 'Your Chamas'}">${rows || `<li class="pk-empty">${esc(H.noChamas)}</li>`}</ul>
${this.pendingHtml()}
<button type="button" class="btn pri block" style="margin-top:18px" data-act="pkOpen"${picked && !this.opening ? '' : ' disabled'}>${this.opening ? '<span class="spin" aria-hidden="true"></span>' : ''}<span>${esc(openLabel)}</span></button>
<div class="sec-h" style="margin-top:30px"><h3>${esc(H.manage)}</h3></div>
<div class="list">
<button type="button" class="li has-ic" data-act="wsSub" data-s="create"><span class="li-ic">${icon('plus')}</span><span class="li-main"><b>${esc(H.createRow)}</b><small>${esc(H.createRowSub)}</small></span>${icon('chev', 'chev')}</button>
<button type="button" class="li has-ic" data-act="wsSub" data-s="join"><span class="li-ic t-gold">${icon('key')}</span><span class="li-main"><b>${esc(H.joinRow)}</b><small>${esc(H.joinRowSub)}</small></span>${icon('chev', 'chev')}</button>
</div>
<button type="button" class="btn ghost block" style="margin-top:14px" data-act="gateSignOut">${icon('out')}${esc(G.signOut)}</button>
${this.accountFoot()}`,
      { back: canLeave ? `data-act="wsBack"` : '', top: true, lang: false });
  },
  pkInitials(name) {
    const parts = String(name || '').replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return letters || '?';
  },
  /* One Chama row (kept for callers that still ask for it) */
  chamaRow(w) {
    const G = GL(), on = (this.picked || Store.chamaId) === w.chama_id;
    return `<button type="button" class="pk-choice" data-act="wsOpen" data-id="${esc(w.chama_id)}" aria-checked="${on}"><span class="pk-av">${esc(this.pkInitials(w.chama_name))}</span><span class="pk-info"><span class="pk-name">${esc(w.chama_name || 'Chama')}</span><span class="pk-meta">${esc(G.roleWord(w.role))}</span></span></button>`;
  },
  createPage() {
    const H = HL(), d = this.draft, busy = this.signing;
    const nameErr = this.nameErr ? `<p class="ferr" id="newChamaErr" role="alert">${esc(this.nameErr)}</p>` : '';
    const formErr = this.formErr ? `<p class="notice" role="alert">${icon('alert', 's')}<span>${esc(this.formErr)}</span></p>` : '';
    return shell(`<span class="tag brand">${icon('sparkle', 's')}${esc(H.newGroup)}</span>
<h1 class="auth-t" style="margin-top:14px">${esc(H.createTitle)}</h1>
<p class="auth-s">${esc(H.createSub)}</p>
<form id="createForm" class="auth-form" novalidate>
<label class="f" for="newChamaName">${esc(H.nameLabel)}
<input id="newChamaName" type="text" maxlength="80" autocomplete="off" autocapitalize="words" enterkeyhint="done" placeholder="${esc(H.namePh)}" value="${esc(d.name)}" aria-describedby="newChamaHelp${this.nameErr ? ' newChamaErr' : ''}" aria-invalid="${this.nameErr ? 'true' : 'false'}"${busy ? ' disabled' : ''}></label>
<p class="fhelp" id="newChamaHelp">${esc(H.nameHelp)}</p>
${nameErr}
<label class="check" style="margin-top:14px"><input type="checkbox" id="newChamaListed"${d.listed ? ' checked' : ''}${busy ? ' disabled' : ''}><span class="box">${icon('check')}</span><span><b>${esc(H.existing)}</b><br>${esc(H.existingSub)}</span></label>
${formErr}
<button type="submit" class="btn pri block" id="createBtn"${busy ? ' disabled aria-busy="true"' : ''}>${busy ? `<span class="spin" aria-hidden="true"></span><span>${esc(H.creatingBtn)}</span>` : `<span>${esc(H.createBtn)}</span>`}</button>
<p class="fhelp" style="text-align:center;margin-top:12px">${esc(H.afterNote)}</p>
</form>`, { back: 'data-act="wsSub" data-s=""', top: true, lang: false });
  },
  /* Join a Chama: one full screen in three steps. 1 enter the code, 2 see the Chama it opens, 3 request sent.
     The preview replaces the code field; nothing covers it. */
  joinPreview: null, joinDone: null,
  roleInfo(r) {
    return ({ treasurer: { t: 'Treasurer', d: 'Keeps the books: records money, approves members and runs the Chama.', ic: 'wallet' },
      secretary: { t: 'Secretary', d: 'Keeps the member register, calls meetings, takes minutes and runs polls.', ic: 'doc' },
      member: { t: 'Member', d: 'Sees your own money and the group totals, votes and chats with the group.', ic: 'profile' } })[r] || { t: 'Member', d: '', ic: 'profile' };
  },
  joinPage() {
    const H = HL(), busy = this.joinBusy, p = this.joinPreview, done = this.joinDone;
    const mono = n => esc(this.pkInitials(n));
    if (done) {
      const ri = this.roleInfo(done.role);
      return shell(`<div class="jn jn-done">
<div class="jn-orbit" aria-hidden="true"><span></span><span></span><div class="jn-ic">${icon('clock')}</div></div>
<h1 class="auth-t">Request sent</h1>
<p class="auth-s">${esc((p && p.treasurer_name) || 'The treasurer')} has been told. You get in as soon as your request is approved, and we will let you know.</p>
<div class="jn-mini"><span class="jn-tile">${mono(done.chama_name)}</span><span class="jn-mini-t"><b>${esc(done.chama_name || 'Chama')}</b><small>${esc(ri.t)} · waiting for approval</small></span></div>
<button type="button" class="btn pri block" style="margin-top:26px" data-act="jnFinish">Done</button>
<button type="button" class="btn ghost block" data-act="jnCancel" data-id="${esc(done.chama_id)}">Cancel my request</button>
</div>`, { top: true, lang: false });
    }
    if (p) {
      const ri = this.roleInfo(p.role), money = Number(p.contribution) > 0 ? (p.currency || 'KES') + ' ' + Number(p.contribution).toLocaleString('en-KE') : '—';
      const state = p.already_member ? `<button type="button" class="btn pri block" data-act="jnOpen" data-id="${esc(p.chama_id)}">${icon('chev')}<span>Open ${esc(p.chama_name || 'Chama')}</span></button><p class="fhelp jn-c">You are already in this Chama.</p>`
        : p.pending ? `<div class="jn-wait">${icon('clock', 's')}<span>Your request is waiting for approval.</span></div><button type="button" class="btn ghost block" data-act="jnCancel" data-id="${esc(p.chama_id)}">Cancel my request</button>`
        : `<button type="button" class="btn pri block" data-act="jnRequest"${busy ? ' disabled aria-busy="true"' : ''}>${busy ? '<span class="spin" aria-hidden="true"></span><span>Sending request…</span>' : `<span>Ask to join ${esc(p.chama_name || '')}</span>`}</button>
<p class="fhelp jn-c">${esc(p.treasurer_name || 'The treasurer')} approves every new person. Nothing changes until they do.</p>`;
      const before = !p.already_member && !p.pending && Session.declinedFor(p.chama_id);
      const err = (this.joinMsg ? `<p class="notice" role="alert">${icon('alert', 's')}<span>${esc(this.joinMsg)}</span></p>` : '')
        + (before ? `<div class="decl-card" role="note"><span class="decl-ic">${icon('alert')}</span><div class="decl-t"><b>You asked to join before and were declined</b><small>${esc(new Date(before.decided_at || before.requested_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }))}. You can ask again, but it helps to speak with the treasurer first.</small></div></div>` : '');
      return shell(`<div class="jn jn-pv">
<div class="jn-hero"><span class="jn-tile lg">${mono(p.chama_name)}</span>
<span class="jn-found">${icon('check', 's')}Code accepted</span>
<h1 class="auth-t">${esc(p.chama_name || 'Chama')}</h1>
${p.display_tag ? `<span class="tag">${icon('tag', 's')}${esc(p.display_tag)}</span>` : ''}</div>
<div class="jn-stats">
<div><small>People</small><b class="num">${esc(p.people || 0)}</b></div>
<div><small>On the list</small><b class="num">${esc(p.members_listed || 0)}</b></div>
<div><small>Monthly</small><b class="num">${esc(money)}</b></div></div>
<div class="jn-role"><span class="li-ic">${icon(ri.ic)}</span><span><small>You would join as</small><b>${esc(ri.t)}</b><span>${esc(ri.d)}</span></span></div>
${p.treasurer_name ? `<div class="jn-by">${icon('shield', 's')}<span>Treasurer: <b>${esc(p.treasurer_name)}</b></span></div>` : ''}
${err}<div class="jn-act">${state}
<button type="button" class="btn ghost block" data-act="jnAgain">Use a different code</button></div>
</div>`, { back: 'data-act="jnAgain"', top: true, lang: false });
    }
    return shell(`<div class="jn jn-in">
<div class="jn-key" aria-hidden="true">${art('key')}</div>
<h1 class="auth-t">${esc(H.joinTitle)}</h1>
<p class="auth-s">Enter the code your treasurer shared, or paste the link from your invitation email.</p>
<label class="jn-field${this.joinMsg ? ' bad' : ''}" for="joinLink"><span class="vh">${esc(H.joinLabel)}</span>
<input id="joinLink" type="text" autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="one-time-code" enterkeyhint="go" maxlength="300" placeholder="ABCD-EFGH-JK" value="${esc(this.draft.link)}"${this.joinMsg ? ' aria-describedby="joinErr" aria-invalid="true"' : ''}${busy ? ' disabled' : ''}>
<button type="button" class="jn-paste" data-act="jnPaste">${icon('copy', 's')}Paste</button></label>
<p class="ferr" id="joinErr" role="alert">${esc(this.joinMsg || '')}</p>
<button type="button" class="btn pri block" style="margin-top:14px" data-act="wsJoin"${busy ? ' disabled aria-busy="true"' : ''}>${busy ? `<span class="spin" aria-hidden="true"></span><span>${esc(H.checking)}</span>` : `<span>${esc(H.joinBtn)}</span>`}</button>
<ol class="jn-steps"><li><b>1</b>Enter the code</li><li><b>2</b>Check it is the right Chama</li><li><b>3</b>The treasurer lets you in</li></ol>
</div>`, { back: 'data-act="wsSub" data-s=""', top: true, lang: false });
  },
  /* outside any Chama: deleting (or restoring) the account must still be possible, because deletion requires leaving every Chama first */
  accountFoot() {
    const A = __M_src_features_account_deletion_js.Account;
    if (!this._acctAsked && Backend.sb) { this._acctAsked = true; Backend.sb.rpc('account_deletion_status').then(r => { if (!r.error && r.data && r.data.pending) { A.pending = { requestedAt: new Date(r.data.requested_at), purgeAt: new Date(r.data.purge_at) }; A.checked = true; this.paint(); } }, () => {}); }
    if (A.pending) return `<div class="card warn" style="margin-top:22px"><h2>Account deletion scheduled</h2><p class="plain">Your account will be erased on ${esc(A.pending.purgeAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))}. Restore it to keep it.</p><div class="btns"><button type="button" class="btn pri" data-act="gateRestore">Restore my account</button></div></div>`;
    return `<p class="legal-mini" style="margin-top:22px"><a href="${LEGAL.privacy}" target="_blank" rel="noopener">Privacy Policy</a> · <button type="button" class="linkish" data-act="deleteAccount">Delete my account</button></p>`;
  },
  /* a decline is shown once as a dialog, then stays as a card in the hub until the person taps Got it */
  announceDeclined(r) {
    if (!r) return; this._declShown = this._declShown || {}; if (this._declShown[r.id]) return; this._declShown[r.id] = true;
    __M_src_ui_toast_js.Pop.alert('Only the treasurer can explain why. If you think it is a mistake, talk to them before asking again.', { title: 'Your request to join ' + (r.chama_name || 'the Chama') + ' was declined', label: 'OK' });
  },
  declinedHtml() {
    let hidden = []; try { hidden = JSON.parse(localStorage.getItem('mca-declined-seen') || '[]'); } catch (e) {}
    const list = (Session.declined || []).filter(r => !hidden.includes(r.id)); if (!list.length) return '';
    const when = d => d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return list.slice(0, 3).map(r => `<div class="decl-card" role="alert"><span class="decl-ic">${icon('alert')}</span><div class="decl-t"><b>Your request to join ${esc(r.chama_name || 'a Chama')} was declined</b><small>${esc(when(r.decided_at))}. Only the treasurer can explain why. If you think it is a mistake, talk to them before asking again.</small></div><button type="button" class="btn sm ghost" data-act="declSeen" data-id="${esc(r.id)}">Got it</button></div>`).join('');
  },
  pendingHtml() {
    const list = Session.pending || []; if (!list.length) return this.declinedHtml();
    const ago = d => { const m = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000)); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
    return this.declinedHtml() + `<div class="sec-h" style="margin-top:26px"><h3>Waiting for approval</h3></div><div class="list pend">${list.map(r => `<div class="li has-ic"><span class="pk-av">${esc(this.pkInitials(r.chama_name))}</span><span class="li-main"><b>${esc(r.chama_name || 'Chama')}</b><small>${esc(this.roleInfo(r.role).t)} · asked ${esc(ago(r.requested_at))}${r.treasurer_name ? ' · ' + esc(r.treasurer_name) + ' decides' : ''}</small></span><span class="li-end"><span class="live-dot" aria-hidden="true"></span><button type="button" class="btn sm ghost" data-act="jnCancel" data-id="${esc(r.chama_id)}">Cancel</button></span></div>`).join('')}</div>`;
  },
  welcomeCard() { return this.hubPage(true); },
  chooseCard() { return this.hubPage(false); },
  /* Create: validates the name, then calls the existing creation service. Nothing is faked; the typed name is kept on failure. */
  async submitCreate() {
    if (this.signing) return;
    const H = HL(), el = document.getElementById('newChamaName'), cb = document.getElementById('newChamaListed');
    if (cb) this.draft.listed = cb.checked;
    const raw = el ? el.value : this.draft.name;
    this.draft.name = raw;
    const name = raw.trim().replace(/\s+/g, ' ');
    if (name.length < 2) { this.nameErr = H.nameNeeded; this.formErr = ''; this.paint(); const i = document.getElementById('newChamaName'); if (i) i.focus(); return; }
    if (name.length > 80) { this.nameErr = 'Keep the name to 80 characters or fewer.'; this.paint(); return; }
    this.nameErr = ''; this.formErr = ''; this.signing = true; this.paint();
    try { await Session.createChama(name, this.draft.listed); }
    catch (e) { this.signing = false; this.formErr = (e && e.message) || H.createFail; this.paint(); }
  },
  /* Join: uses the existing link or Chama-key path (Session.joinWithLink) and shows its real error */
  async submitJoin() {
    if (this.joinBusy) return;
    const H = HL(), el = document.getElementById('joinLink');
    const v = String(el ? el.value : (this.draft.link || ''));
    this.draft.link = v;
    if (!v.trim()) { this.joinMsg = H.joinEmpty; this.paint(); return; }
    this.joinBusy = true; this.joinMsg = ''; this.paint();
    let r;
    try { r = await Session.joinWithLink(v); } catch (e) { r = { error: (e && e.message) || H.joinFail }; }
    this.joinBusy = false;
    if (r && r.error) this.joinMsg = r.error;
    else if (r && r.preview) { this.joinPreview = r.preview; try { __M_src_features_auth_gate_js.Haptic.ok(); } catch (e) {} }
    this.paint();
    if (r && r.error) { const f = document.getElementById('joinLink'); if (f) { f.focus(); f.select(); } }
  },
  /* Opening a Chama reloads the app into it, so the confirmation is kept for the next load */
  openChama(id) {
    if (this.opening) return;
    this.opening = true;
    this.picked = id;
    this.paint();
    const w = (Session.workspaces || []).find(x => x.chama_id === id);
    flashNext(HL().switched(w && w.chama_name ? w.chama_name : 'Chama'));
    setTimeout(() => Session.switchTo(id), 250);
  },
  inviteCard() {
    const I = Invite.info, signedIn = Session.status === 'invite';
    if (Invite.token && !Invite.checked) return this.loading('Checking your invitation…');
    if (!I) return this.card('Invitation', '<p class="auth-s">We could not check this invitation. Check your internet and try again.</p><div class="btns col" style="margin-top:24px"><button class="btn pri block" data-act="inviteRetry">Try again</button><button class="btn ghost block" data-act="inviteDismiss">Skip</button></div>', 'lost');
    if (!I.ok) return this.card('Invitation', `<p class="auth-s">${esc(Invite.MSG[I.code] || Invite.MSG.invalid)}</p><div class="btns col" style="margin-top:24px"><button class="btn pri block" data-act="inviteDismiss">Continue</button></div>`, 'lost');
    const when = d => { try { return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
    const rows = `<div class="card inv"><div class="kv"><span>Chama</span><b>${esc(I.chama_name || 'A Chama')}</b></div>
<div class="kv"><span>Your role</span><b>${esc(Perm.label(I.role))}</b></div>
${I.inviter_name ? `<div class="kv"><span>Invited by</span><b>${esc(I.inviter_name)}</b></div>` : ''}
<div class="kv"><span>Sent to</span><b>${esc(I.email_hint || '')}</b></div>
<div class="kv"><span>Expires</span><b>${esc(when(I.expires_at))}</b></div></div>`;
    const note = '<p class="fhelp" style="margin-top:12px">Joining lets you see this Chama’s records for your role. You can leave later.</p>';
    if (!signedIn) return this.card('You’re invited', rows + note + `<div class="btns col" style="margin-top:22px"><button class="btn pri block" data-act="inviteContinue"${Invite.busy ? ' disabled aria-busy="true"' : ''}>Continue${I.email_hint ? ' as ' + esc(I.email_hint) : ''}</button><p class="fhelp" style="text-align:center">We check for your account, then take you to sign in, or set one up with a code.</p></div>`, 'invite');
    const msg = Invite.msg ? `<p class="notice" role="alert">${icon('alert', 's')}<span>${esc(Invite.msg)}</span></p>` : '';
    return this.card('You’re invited', `<p class="auth-s">Signed in as <b>${esc(Session.email)}</b></p>${rows}${note}${msg}<div class="btns col" style="margin-top:22px"><button class="btn pri block" data-act="inviteAccept"${Invite.busy ? ' disabled' : ''}>Accept invitation</button><button class="btn block" data-act="inviteDecline">Decline</button><button class="btn ghost block" data-act="gateSignOut">Use another email</button></div>`, 'invite');
  },
  card(t, body, artName) { return shell(`${artName ? `<div class="auth-art">${art(artName)}</div>` : ''}<h1 class="auth-t" style="margin-top:${artName ? 6 : 0}px">${esc(t)}</h1>${body}`, { top: !artName, lang: false }); },
  loading(text, cancel) {
    return shell(`<div class="loader"><span class="spin" aria-hidden="true"></span><p>${esc(text)}</p>${cancel ? `<button class="btn ghost" data-act="gateCancel">${esc(GL().cancel)}</button>` : ''}</div>`, { lang: false, foot: false });
  },
  paint() {
    if (Otp.hold) return;
    document.body.classList.add('no-tabs', 'gate-on');
    ['#menuBtn', '#backBtn', '#pageTitle', '#bell', '#guideBtn'].forEach(q => { const el = $(q); if (el) el.hidden = true; });
    $('#syncBar').hidden = true;
    { const jr = document.getElementById('jmRoot'); if (jr) jr.innerHTML = ''; }
    if (Session.status === 'signed-out' && OB.needed()) { $('#view').innerHTML = OB.html(); return; }
    const st = Session.status; let html; const G = GL();
    if (st === 'invite' || (st === 'signed-out' && Invite.token && !Invite.signin && !this.sent)) { $('#view').innerHTML = this.inviteCard(); return; }
    try { if (st === 'signed-out') sessionStorage.setItem('mca-gate', JSON.stringify({ email: this.email, sent: this.sent, mode: this.mode })); else sessionStorage.removeItem('mca-gate'); } catch (e) {}
    if (st === 'loading') html = this.loading(G.signingIn, true);
    else if (st === 'signed-out') {
      Otp.kind = 'email'; Otp.len = Session.otpLength;
      html = this.sending && this.mode !== 'up'
        ? this.loading(G.sending, true)
        : this.sent
        ? shell(`<div class="auth-art">${art('mail')}</div><h1 class="auth-t" style="margin-top:6px">${esc(G.codeTitle)}</h1><p class="auth-s">${G.codeSub(Otp.len, esc(this.email))}</p>${Otp.html({ change: true })}`, { back: 'data-act="gateReset"', lang: false })
        : this.authCard();
    }
    else if (st === 'setup') { html = this.setupCard(); setTimeout(() => UserCheck.init(), 0); }
    else if (st === 'welcome') html = (() => { try { const F = __M_src_features_guide_js; if (!F.About.done()) return shell(F.About.card(), { top: true, lang: false }); if (!F.Personal.done()) return shell(F.Personal.card(), { top: true, lang: false }); } catch (e) {} return this.welcomeCard(); })();
    else if (st === 'choose') html = this.chooseCard();
    else html = this.card('Something went wrong', `<p class="auth-s">${esc(Session.error || 'We could not reach the server.')}</p><div class="btns col" style="margin-top:24px"><button class="btn pri block" data-act="gateRetry">Try again</button>${Session.user ? '<button class="btn ghost block" data-act="gateSignOut">Sign out</button>' : ''}</div>`, 'lost');
    $('#view').innerHTML = html;
    if (st === 'signed-out' && this.mode === 'in') { const pw = document.getElementById('gatePw'); if (pw) pw.value = this.signPw || ''; }
    /* keep "Show" on across repaints, so a failed attempt does not silently hide what was typed */
    Object.keys(this.pwShown || {}).forEach(id => { if (!this.pwShown[id]) return; const i = document.getElementById(id), b = document.querySelector(`[data-act="togglePw"][data-for="${id}"]`); if (i) i.type = 'text'; if (b) { b.textContent = G.hide; b.setAttribute('aria-pressed', 'true'); } });
    if (st === 'signed-out' && this.mode === 'up' && !this.sent && !this.sending) this.armCool();
    if (OB.sheet) { const q = document.getElementById('lgSearch'); if (q) setTimeout(() => q.focus(), 280); }
    /* while a join request waits, look again every 20 seconds and open the Chama as soon as it is approved */
    clearInterval(this._pendTimer);
    if ((st === 'welcome' || st === 'choose') && (Session.pending || []).length && !this._pendChan && Backend.sb && Session.user) {
      try { this._pendChan = Backend.sb.channel('jr-' + Session.user.id).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chama_join_requests', filter: 'user_id=eq.' + Session.user.id }, p => {
        if (!p.new) return;
        if (p.new.status === 'approved') { flashNext('dialog:You were approved. Welcome to the Chama.'); Session.switchTo(p.new.chama_id); }
        else if (p.new.status === 'declined') { Session.loadMyRequests().then(() => { this.paint(); this.announceDeclined(Session.declinedFor(p.new.chama_id)); }); }
      }).subscribe(); } catch (e) { /* the timer below still checks */ }
    }
    if ((st === 'welcome' || st === 'choose') && (Session.pending || []).length) {
      this._pendTimer = setInterval(async () => {
        if (document.hidden || !['welcome', 'choose'].includes(Session.status)) return;
        const before = (Session.pending || []).map(x => x.chama_id);
        try {
          const { data } = await Backend.sb.rpc('my_workspaces');
          const hit = (data || []).find(w => before.includes(w.chama_id));
          if (hit) { clearInterval(this._pendTimer); flashNext('dialog:' + 'You were approved. Welcome to ' + (hit.chama_name || 'the Chama') + '.'); Session.switchTo(hit.chama_id); return; }
          await Session.loadMyRequests();
          if ((Session.pending || []).length !== before.length) {
            this.paint();
            before.filter(id => !(Session.pending || []).some(x => x.chama_id === id)).forEach(id => this.announceDeclined(Session.declinedFor(id)));
          }
        } catch (e) { /* offline: try again next time */ }
      }, 12000);
    }
    if (st === 'signed-out' && this.sent) {
      try { const d = sessionStorage.getItem('mca-otp') || ''; const inp = document.getElementById('otpIn'); if (inp && d) { inp.value = d; inp._prev = d; Otp.paint(d); } else Otp.paint(''); } catch (e) {}
      Otp.tick();
      const inp = document.getElementById('otpIn'); if (inp) setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 120);
    }
  }
};

/* Typed values live in Gate.draft, so a redraw after an error never clears them */
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'newChamaName') {
    Gate.draft.name = t.value;
    if (Gate.nameErr) { Gate.nameErr = ''; t.setAttribute('aria-invalid', 'false'); const x = document.getElementById('newChamaErr'); if (x) x.remove(); }
  } else if (t.id === 'joinLink') {
    /* codes are typed as ABCD-EFGH-JK; links are left as they are */
    const raw = t.value;
    if (!/[\/:.]/.test(raw) && raw.replace(/[^A-Za-z0-9]/g, '').length <= 10) {
      const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const f = [c.slice(0, 4), c.slice(4, 8), c.slice(8, 10)].filter(Boolean).join('-');
      if (f !== raw) { t.value = f; try { t.setSelectionRange(f.length, f.length); } catch (err) {} }
    }
    Gate.draft.link = t.value;
    if (Gate.joinMsg) { Gate.joinMsg = ''; const x = document.getElementById('joinErr'); if (x) x.textContent = ''; t.closest('.jn-field') && t.closest('.jn-field').classList.remove('bad'); }
  }
});
document.addEventListener('change', e => { if (e.target.id === 'newChamaListed') Gate.draft.listed = e.target.checked; });
document.addEventListener('submit', e => { if (e.target.id === 'createForm') { e.preventDefault(); Gate.submitCreate(); } });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && Gate.sub === 'join' && !Gate.joinPreview) { Gate.sub = null; Gate.joinMsg = ''; Gate.paint(); }
  if (e.key === 'Enter' && e.target.id === 'joinLink') { e.preventDefault(); Gate.submitJoin(); }
});

return { get Gate() { return Gate; }, get Haptic() { return Haptic; }, get Otp() { return Otp; }, get OB() { return OB; }, get GL() { return GL; }, get GT() { return GT; }, get AUTH_T() { return AUTH_T; }, get LG_ALL() { return LG_ALL; }, get lgMatches() { return lgMatches; }, get LEGAL() { return LEGAL; }, get OB_POLICY_VERSION() { return OB_POLICY_VERSION; }, };
})();

/* ---- src/core/state.js ---- */
const __M_src_core_state_js = (function () {
const { Store } = __M_src_core_store_js;

/* =====================================================================
   6. ACTIONS  (every mutation lives here; admin-only ones are flagged)
   ===================================================================== */
const S = () => Store.get();

return { get S() { return S; }, };
})();

/* ---- src/lib/validate.js ---- */
const __M_src_lib_validate_js = (function () {

const num = (v, label, { min = 0, allowZero = false } = {}) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || (!allowZero && n === 0)) throw new Error(label + ' must be a valid number');
  return n;
};

const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

return { get num() { return num; }, get validEmail() { return validEmail; }, };
})();

/* ---- src/ui/avatar.js ---- */
const __M_src_ui_avatar_js = (function () {
const { esc } = __M_src_core_utils_js;
const { Session } = __M_src_core_session_js;

const av = (m, n = 32) => {
  const nm = (m && m.name) || '', ini = nm.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const photo = Session.photoFor(m);
  /* only a plain base64 JPEG is ever put in src: a photo is data from another person's account */
  const tone = ['', ' c1', ' c2', ' c3'][(nm.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 4];
  return typeof photo === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo)
    ? `<img class="av" style="--n:${Number(n) || 32}px" src="${photo}" alt="Photo of ${esc(nm)}" data-name="${esc(nm)}">` : `<span class="av${tone}" style="--n:${Number(n) || 32}px" aria-hidden="true">${esc(ini)}</span>`;
};

const memberChip = (s, id, n = 28) => { const m = (s.members || []).find(x => x.id === id); return `<span class="who">${av(m || { name: 'Removed member' }, n)}<span>${esc(m ? m.name : 'Removed member')}</span></span>`; };

return { get av() { return av; }, get memberChip() { return memberChip; }, };
})();

/* ---- src/ui/modal.js ---- */
const __M_src_ui_modal_js = (function () {
const { esc } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { toast } = __M_src_ui_toast_js;

/* Payments go to the server first (table chama_payments, RPC record_payment). A repeated tap or retry reuses the same
   request key, so the server records it once. The local record is updated only after the server confirms. */
const newRequestKey = () => (crypto.randomUUID ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
const pendingPayKeys = new Map();
async function savePayments(list) {
  const Backend = __M_src_core_backend_js.Backend, Store = __M_src_core_store_js.Store, uid = __M_src_core_utils_js.uid, Matcher = __M_src_lib_matcher_js.Matcher;
  const saved = [];
  try {
    for (const p of list) {
      const sig = [p.memberId, p.month, p.amount, p.code || ''].join('|');
      if (!pendingPayKeys.has(sig)) pendingPayKeys.set(sig, newRequestKey());
      const { data, error } = await Backend.sb.rpc('record_payment', {
        p_cid: Store.chamaId, p_member: p.memberId, p_month: p.month, p_amount: p.amount,
        p_code: p.code || null, p_date: p.date, p_idem: pendingPayKeys.get(sig) });
      if (error) throw error;
      if (!data || !data.ok) { if (data && data.status === 'duplicate_code') pendingPayKeys.delete(sig); throw new Error((data && data.error) || 'Payment not recorded'); }
      pendingPayKeys.delete(sig);
      saved.push(p);
    }
  } catch (err) {
    toast(err && err.message && !/fetch|network|Failed/i.test(err.message) ? err.message : 'Payment not saved. Check your connection and try again.');
  }
  if (saved.length) {
    /* the payments and the names learned from them are saved together, so a confirmed sender is recognised next time */
    Store.commit(st => saved.forEach(p => {
      st.payments.push({ id: uid(), memberId: p.memberId, month: p.month, amount: p.amount, code: p.code || '', date: p.date, at: Date.now(),
        ...(p.from ? { from: String(p.from).slice(0, 80) } : {}), ...(p.phone ? { fromPhone: String(p.phone).slice(0, 16) } : {}), ...(p.sms ? { sms: String(p.sms).slice(0, 360), via: 'mpesa' } : {}) });
      if (p.learn) { const mm = st.members.find(x => x.id === p.memberId); if (mm) Matcher.learn(mm, p.learn.t); }
    }));
    toast(saved.length === 1 ? 'Payment recorded: ' + __M_src_core_utils_js.kes(saved[0].amount) + (saved[0].name ? ' from ' + saved[0].name : '') : saved.length + ' payments recorded', 'ok');
    try { __M_src_features_auth_gate_js.Haptic.ok(); } catch (e) {}
  }
}
/* shows cash on hand and what is left after the amount being typed, updating with every key */
const cashMeter = (cash, start) => `<div class="cash-live" id="cashLive" data-cash="${Number(cash) || 0}" aria-live="polite">${cashMeterInner(Number(cash) || 0, Number(start) || 0)}</div>`;
const cashMeterInner = (cash, amt) => {
  const kes = __M_src_core_utils_js.kes, left = cash - amt, pct = cash > 0 ? Math.max(0, Math.min(100, Math.round(amt / cash * 100))) : (amt > 0 ? 100 : 0);
  const st = amt > cash ? 'over' : pct >= 80 ? 'tight' : 'ok';
  return `<div class="cl-row"><span>Cash on hand</span><b class="num">${esc(kes(cash))}</b></div><div class="cl-bar ${st}"><i style="width:${pct}%"></i></div><div class="cl-row"><span>${st === 'over' ? 'Short by' : 'Left after this'}</span><b class="num cl-${st}">${esc(kes(Math.abs(left)))}</b></div>${st === 'over' ? '<p class="cl-msg">This is more than the Chama has. Lower the amount.</p>' : st === 'tight' ? '<p class="cl-msg">This uses most of the cash on hand.</p>' : ''}`;
};
document.addEventListener('input', e => {
  const box = document.getElementById('cashLive'), t = e.target;
  if (!box || !t || !/^(amount|principal)$/.test(t.name || '') || !box.closest('#modalRoot') || !t.closest('#modalRoot')) return;
  box.innerHTML = cashMeterInner(Number(box.dataset.cash) || 0, Number(t.value) || 0);
});
const Modal = {
  open({ title, fields = [], body = '', submitLabel = 'Save', onSubmit, danger, hideCancel }) {
    /* confirmations and notices without form fields are centred popups, not sheets */
    if (!fields.length && onSubmit && (danger || hideCancel) && typeof body === 'string' && body.length < 1200) {
      return __M_src_ui_toast_js.Pop.confirm({ title, html: body, confirmLabel: submitLabel, danger: !!danger, hideCancel: !!hideCancel, onYes: () => onSubmit({}) });
    }
    const f = fields.map(x => {
      const v = esc(x.value ?? '');
      let input;
      if (x.type === 'select') input = `<select name="${x.name}">${x.options.map(([val, lab]) => `<option value="${esc(val)}" ${val == x.value ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
      else if (x.type === 'checkbox') input = `<input name="${x.name}" type="checkbox" value="on"${x.checked ? ' checked' : ''}>`;   /* a ticked box sends "on" */
      else if (x.type === 'textarea') input = `<textarea name="${x.name}" rows="${x.rows || 3}" maxlength="${x.max || 600}" placeholder="${esc(x.placeholder || '')}" ${x.required ? 'required' : ''}>${v}</textarea>`;
      else input = `<input name="${x.name}" type="${x.type || 'text'}" value="${v}" ${x.required ? 'required' : ''} ${x.min != null ? `min="${x.min}"` : ''} ${x.type === 'number' ? 'step="any" inputmode="decimal"' : ''} placeholder="${esc(x.placeholder || '')}" autocomplete="off">`;
      return `<label>${esc(x.label)}${input}${x.help ? `<small class="fhelp">${esc(x.help)}</small>` : ''}</label>`;
    }).join('');
    $('#modalRoot').innerHTML = `<div class="veil" data-act="closeModal"><form class="sheet" role="dialog" aria-modal="true">
      <div class="mhead"><button type="button" class="xbtn" data-act="closeModal" aria-label="Close">&times;</button><h3>${esc(title)}</h3><span class="xsp" aria-hidden="true"></span></div>${body}${f}
      ${(hideCancel && !onSubmit) ? '' : `<div class="actions">${hideCancel ? '' : `<button type="button" class="btn" data-act="closeModal">${onSubmit ? 'Cancel' : 'Close'}</button>`}
      ${onSubmit ? `<button class="btn ${danger ? 'bad solid' : 'pri'}">${esc(submitLabel)}</button>` : ''}</div>`}</form></div>`;
    const form = $('#modalRoot form');
    form.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a || !form.contains(a)) e.stopPropagation(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form._busy) return;
      try { onSubmit && onSubmit(Object.fromEntries(new FormData(form))); } catch (err) { toast(err.message); return; }
      form._busy = true;
      Modal.close();
    });
    const first = form.querySelector('input:not([type=checkbox]):not([type=file]),select,textarea'); if (first) setTimeout(() => { try { first.focus({ preventScroll: true }); } catch (e) {} }, 320);
    document.body.style.overflow = 'hidden';
  },
  close: () => {
    const v = $('#modalRoot .veil'), calm = document.documentElement.classList.contains('a-rm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!v || calm) $('#modalRoot').innerHTML = '';
    else { v.classList.add('closing'); setTimeout(() => { if (v.isConnected) v.remove(); }, 240); }
    if (!document.body.classList.contains('menu-open')) document.body.style.overflow = '';
  }
};

function confirmBox(text, onYes) {
  __M_src_ui_toast_js.Pop.confirm({ title: 'Are you sure?', text, confirmLabel: 'Continue', danger: true, onYes });
}

return { get Modal() { return Modal; }, get confirmBox() { return confirmBox; }, get savePayments() { return savePayments; }, get cashMeter() { return cashMeter; }, };
})();

/* ---- src/ui/signature.js ---- */
const __M_src_ui_signature_js = (function () {
const { esc } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { Modal } = __M_src_ui_modal_js;

const sigImg = (v, alt) => /^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(v || '') ? `<img src="${v}" alt="${esc(alt)}" style="height:44px;margin-top:8px;display:block">` : '';


const Signature = {
  open(title, onSave) {
    Modal.open({ title, submitLabel: 'Save signature', body: '<canvas id="sigPad" width="600" height="240" aria-label="Signature pad" style="width:100%;height:170px;border:1.5px dashed var(--line-2);border-radius:16px;touch-action:none;background:#fff;margin-top:6px"></canvas><p class="mute small" style="margin-top:8px">Sign with a finger inside the box. <button type="button" class="linkish" data-act="sigClear">Clear</button></p>',
      onSubmit: () => { const c = $('#sigPad'); if (!c._ink) throw new Error('Please sign first'); const o = document.createElement('canvas'); o.width = 300; o.height = 120; o.getContext('2d').drawImage(c, 0, 0, 300, 120); onSave(o.toDataURL('image/png')); } });
    const c = $('#sigPad'), x = c.getContext('2d'); x.lineWidth = 3; x.lineCap = 'round'; x.strokeStyle = '#12231f'; let down = false, last = null;
    const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
    c.addEventListener('pointerdown', e => { down = true; c.setPointerCapture(e.pointerId); const p = pt(e); last = p; c._ink = true; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + .1, p[1] + .1); x.stroke(); });
    c.addEventListener('pointermove', e => { if (!down) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; evs.forEach(ev => { const q = pt(ev); x.beginPath(); x.moveTo(last[0], last[1]); x.lineTo(q[0], q[1]); x.stroke(); last = q; c._ink = true; }); });
    ['pointerup', 'pointercancel'].forEach(t => c.addEventListener(t, () => { down = false; }));
  }
};

return { get sigImg() { return sigImg; }, get Signature() { return Signature; }, };
})();

/* ---- src/features/home/index.js ---- */
const __M_src_features_home_index_js = (function () {
const { adminBtn, Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { addMonths, esc, kes, monthLabel, sum, todayISO, uid, waLink } = __M_src_core_utils_js;
const { num } = __M_src_lib_validate_js;
const { av } = __M_src_ui_avatar_js;
const { Modal, confirmBox } = __M_src_ui_modal_js;
const { Signature, sigImg } = __M_src_ui_signature_js;
const { toast } = __M_src_ui_toast_js;

/* the card's figure counts from what was shown before to the new value, only when it changes */
const heroLast = {};
function heroCount() {
  /* keep the breathing in phase with the clock, so a repaint continues it instead of restarting it */
  const card = document.querySelector('#view .hero'); if (card) { const t = (Date.now() / 1000) % 28; card.style.animationDelay = card.classList.contains('tn-late') ? `-${t}s, -${t % 3.2}s` : `-${t}s`; }
  const el = document.querySelector('#view .hero-v[data-to]'); if (!el) return;
  const to = Number(el.dataset.to) || 0, k = el.dataset.k, from = heroLast[k], pre = el.dataset.pre || '', post = el.dataset.post || '';
  heroLast[k] = to;
  if (from == null || from === to || document.documentElement.classList.contains('a-rm') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t0 = performance.now(), dur = 900;
  el.classList.add('counting');
  const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = Math.round(from + (to - from) * e); if (!el.isConnected) return; el.textContent = pre + v.toLocaleString('en-KE') + post; if (p < 1) requestAnimationFrame(step); else el.classList.remove('counting'); };
  requestAnimationFrame(step);
}
/* the live line on the card: one fact at a time, every few seconds, without repainting the page */
setInterval(() => {
  if (document.hidden) return;
  const box = document.querySelector('#view .hero-tick'); if (!box) return;
  let items = []; try { items = JSON.parse(box.dataset.items || '[]'); } catch (e) {}
  if (items.length < 2) return;
  const cur = box.querySelector('span:not(.out)'), i = ((Number(box.dataset.i) || 0) + 1) % items.length; box.dataset.i = i;
  const next = document.createElement('span'); next.textContent = items[i]; next.className = 'in';
  if (cur) { cur.className = 'out'; setTimeout(() => cur.remove(), 380); }
  box.appendChild(next);
}, 4200);

const longMonth = mk => { const [y, m] = mk.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'long' }); };
const firstName = n => String(n || '').trim().split(/\s+/)[0] || '';

const views = {
  home(s) {
    const Sess = __M_src_core_session_js.Session, admin = Auth.isAdmin();
    let lang = 'en'; try { lang = __M_src_features_auth_gate_js.OB.lang(); } catch (e) {}
    const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });
    const greet = `<div class="greet"><div><small>${esc(today)}</small><h1>${esc(greeting(lang))}${Sess.displayName() ? ', ' + esc(Sess.displayName()) : ''}</h1></div><div class="greet-act"><button type="button" class="hb" data-act="moneyToggle" aria-label="${document.documentElement.classList.contains('hide-money') ? 'Show amounts' : 'Hide amounts'}">${icon('eye')}</button></div></div>`;
    if (!s.members.length) {
      return greet + `<div class="card">${s.shared
        ? emptyState('people', 'Nothing to show yet', 'Your treasurer has not added the member list yet. Your records will appear here once they do.')
        : emptyState('people', 'Add your first members', 'Your chama starts with its people. Add each member, then record their contributions every month.', '<button class="btn pri" data-act="addMember">' + icon('userPlus') + 'Add a member</button>')}</div>`;
    }
    const cur = Domain.now(), exp = sum(s.members, m => Domain.dueFor(s, m.id));
    const got = s.shared ? ((s.shared.monthCollected || {})[cur] || 0) : sum(s.payments.filter(p => p.month === cur), p => p.amount);
    const pct = exp ? Math.min(100, Math.round(got / exp * 100)) : 0;
    const rec = Domain.recipient(s), late = Domain.lateMembers(s), po = s.payouts.find(p => p.month === cur), idx = rec ? s.members.indexOf(rec) : -1;
    const loansOut = s.shared ? s.shared.loansBalance : sum(s.loans, l => Domain.loan(l).balance);
    const finesDue = s.shared ? s.shared.finesDue : sum(s.fines.filter(f => !f.paid), f => f.amount);
    const meId = s.shared ? s.shared.me : Sess.memberId;
    const me = meId ? s.members.find(m => m.id === meId) : null;

    /* hero: the one number that matters most for this person. Its tier (colour) follows their own payment state,
       the main figure counts up when it changes, and a live line rotates through what is true right now. */
    const tone = me ? Domain.tone(s, me.id, cur) : 'idle', myBal = me ? Domain.outstanding(s, me.id, cur) : 0, myAhead = me ? Domain.ahead(s, me.id, cur) : 0;
    const dueD = Math.min(28, Number(s.chama.dueDay) || 10), dom = new Date().getDate(), daysTo = dueD - dom;
    const streak = me ? Domain.streak(s, me.id) : 0, payoutMine = !!(me && rec && rec.id === me.id), nextRec = Domain.recipient(s, addMonths(cur, 1));
    const TIER = { late: ['Late', 'alert'], part: ['Part paid', 'clock'], due: ['Due soon', 'clock'], paid: ['Paid up', 'check'], ahead: ['Paid ahead', 'up'], gold: [payoutMine ? 'Your payout month' : streak + '-month streak', 'sparkle'], idle: [me ? 'Nothing due' : 'Not linked', 'info'] };
    const lastMine = me ? [...s.payments].filter(p => p.memberId === me.id).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0] : null;
    const ago = d => { const n = Math.round((Date.now() - Date.parse(d)) / 864e5); return isNaN(n) ? '' : n <= 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago'; };
    const live = [];
    if (me) {
      if (tone === 'late') live.push((Domain.isOverdue(s, cur) && dom > dueD ? 'Late by ' + (dom - dueD) + (dom - dueD === 1 ? ' day' : ' days') : 'Behind from earlier months') + (s.chama.finePerLate ? ' · fine ' + kes(s.chama.finePerLate) : ''));
      else if (tone === 'due' || tone === 'part') live.push(daysTo > 1 ? 'Due in ' + daysTo + ' days · by day ' + dueD : daysTo === 1 ? 'Due tomorrow' : 'Due today');
      if (tone === 'ahead') { const until = addMonths(Domain.firstUncovered(s, me.id, cur), -1); live.push('Covered until ' + longMonth(until) + ' ' + until.slice(0, 4)); }
      if (payoutMine) live.push('You receive about ' + kes(po ? po.amount : exp) + (po ? ' · sent' : ' this month'));
      if (streak >= 2) live.push(streak + ' months on time in a row');
      if (lastMine) live.push('Last payment ' + kes(lastMine.amount) + (lastMine.date ? ' · ' + ago(lastMine.date) : ''));
      const fd = Domain.memberFinesDue(s, me.id), lb = Domain.memberLoanBalance(s, me.id);
      if (fd) live.push('Unpaid fines ' + kes(fd));
      if (lb) live.push('Loan balance ' + kes(lb));
    }
    live.push('Group: ' + pct + '% of ' + kes(exp) + ' collected');
    if (rec && s.chama.mode !== 'savings' && !payoutMine) live.push((po ? 'Pot sent to ' : 'This month’s pot: ') + rec.name.split(' ')[0] + (nextRec && nextRec.id !== rec.id ? ' · next ' + nextRec.name.split(' ')[0] : ''));
    if (!s.shared) { live.push((Domain.active(s).length - late.length) + ' of ' + Domain.active(s).length + ' paid up'); if (exp - got > 0) live.push(kes(exp - got) + ' still to collect'); }
    const tick = `<div class="hero-tick" aria-live="off" data-items="${esc(JSON.stringify(live))}"><span>${esc(live[0] || '')}</span></div>`;
    const top = (label, ic) => `<div class="hero-top"><span class="hero-tag">${icon(ic, 's')}${esc(label)}</span><span class="hero-live" title="Updates on its own"><i></i>Live</span></div>`;
    const bar = label => `<div class="hero-row"><div style="flex:1"><div class="hero-s">${esc(label)}</div><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Collected this month"><i style="width:${pct}%"></i></div></div><span class="hero-chip num">${pct}%</span></div>`;
    const big = (n, pre, post, key) => `<div class="hero-v" data-to="${Math.round(Number(n) || 0)}" data-pre="${esc(pre)}" data-post="${esc(post)}" data-k="${esc(key)}">${esc(pre + Math.round(Number(n) || 0).toLocaleString('en-KE') + post)}</div>`;
    let hero;
    if (s.shared) {
      const value = !me ? '<div class="hero-v">Not linked yet</div>' : tone === 'ahead' ? big(myAhead, 'KES ', ' ahead', 'ahead') : (tone === 'late' || tone === 'part' || tone === 'due') ? big(myBal, 'KES ', ' due', 'due') : `<div class="hero-v">${esc(tone === 'idle' ? 'Nothing due' : 'Paid up')}</div>`;
      const sub = !me ? 'Ask your treasurer to link your sign-in to your member record.' : { late: 'It was due by day ' + dueD + '. Pay to ' + (s.chama.payTo || 'the treasurer') + ' as soon as you can.', part: kes(myBal) + ' still to go for ' + longMonth(cur) + '.', due: 'Due by day ' + dueD + ' of ' + longMonth(cur) + (s.chama.payTo ? '. Pay to ' + s.chama.payTo : '') + '.', paid: 'Thank you. Your ' + longMonth(cur) + ' contribution is in.', ahead: 'Your ' + longMonth(cur) + ' is paid and the extra covers the coming months.', gold: payoutMine ? 'It is your turn to receive the pot this month.' : 'Paid on time ' + streak + ' months in a row. Thank you.', idle: 'Nothing is due from you this month.' }[tone];
      hero = `<section class="hero tn-${tone}" aria-label="Your month">${top(TIER[tone][0], TIER[tone][1])}<div class="hero-l">Your ${esc(longMonth(cur))}</div>${value}<div class="hero-s">${esc(sub)}</div>${tick}${bar('Group collected ' + kes(got) + ' of ' + kes(exp))}</section>`;
    } else {
      const mine = me ? ({ late: 'Your own ' + longMonth(cur) + ': ' + kes(myBal) + ' late', part: 'Your own ' + longMonth(cur) + ': ' + kes(myBal) + ' to go', due: 'Your own ' + longMonth(cur) + ': ' + kes(myBal) + ' due', ahead: 'Your own contribution: ' + kes(myAhead) + ' ahead', gold: payoutMine ? 'Your own payout month' : 'Your own streak: ' + streak + ' months', paid: 'Your own contribution is paid', idle: '' })[tone] : '';
      hero = `<section class="hero tn-${me ? tone : 'brand'}" aria-label="Cash on hand">${me ? top('You · ' + TIER[tone][0], TIER[tone][1]) : top('Treasurer', 'wallet')}<div class="hero-l">Cash on hand</div>${big(Domain.cashOnHand(s), 'KES ', '', 'cash')}<div class="hero-s">${esc(mine || 'After loans, payouts and expenses')}</div>${tick}${bar('Collected in ' + longMonth(cur) + ': ' + kes(got) + ' of ' + kes(exp))}</section>`;
    }
    setTimeout(heroCount, 0);

    const qa = admin ? `<div class="qa" role="group" aria-label="Quick actions">
      <button type="button" data-act="quickPay"><span class="qa-i">${icon('wallet')}</span>Record payment</button>
      <button type="button" data-act="addLoan"><span class="qa-i">${icon('loans')}</span>New loan</button>
      <button type="button" data-act="addMember"><span class="qa-i">${icon('userPlus')}</span>Add member</button>
      <button type="button" data-act="importPay"><span class="qa-i">${icon('import')}</span>Import M-Pesa</button>
    </div>` : '';

    const stats = s.shared
      ? `<div class="stats"><div><span>Saved</span><b>${esc(kes(me ? Domain.memberSaved(s, me.id) : 0))}</b></div><div><span>Your loan</span><b>${esc(kes(me ? Domain.memberLoanBalance(s, me.id) : 0))}</b></div><div><span>Group cash</span><b>${esc(kes(Domain.cashOnHand(s)))}</b></div></div>`
      : `<div class="stats"><div><span>Loans out</span><b>${esc(kes(loansOut))}</b></div><div><span>Unpaid fines</span><b>${esc(kes(finesDue))}</b></div><div><span>Paid up</span><b class="num">${Domain.active(s).length - late.length}/${Domain.active(s).length}</b></div></div>`;

    /* the payout comes first: who receives the pot this month, how much, and whether it was sent */
    let payout = '';
    if (s.chama.mode !== 'savings' && rec) {
      const amt = po ? po.amount : exp;
      const dueDate = new Date(Number(cur.slice(0, 4)), Number(cur.slice(5, 7)) - 1, Math.min(28, Number(s.chama.dueDay) || 10) + 1).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
      const status = po ? `<span class="tag ok">${icon('check', 's')}Sent ${esc(po.date)}</span>` : `<span class="tag warn">Not sent yet</span>`;
      const acts = admin ? (po
        ? `<div class="po-act">${po.sig ? sigImg(po.sig, 'Recipient signature').replace('<img', '<img class="po-sig"') : `<button class="btn sm" data-act="signPayout" data-id="${esc(po.id)}">${icon('sign', 's')}Get signature</button>`}<button class="btn sm ghost" data-act="undoPayout" data-id="${esc(po.id)}">Undo</button></div>`
        : `<div class="po-act"><button class="btn pri" data-act="markPayout" data-amt="${esc(exp)}">${icon('check')}Mark the payout sent</button></div>`) : '';
      payout = `<section class="po-card" aria-label="This month's payout"><div class="po-top">${av(rec, 48)}<div class="po-main"><small>Payout · ${esc(longMonth(cur))}</small><b>${esc(rec.name)}${me && rec.id === me.id ? ' (you)' : ''}</b></div><div class="po-amt num">${esc(kes(amt))}</div></div>
${(() => { const seen = new Set([rec.id]), line = []; for (let k = 1; k <= 12 && line.length < 3; k++) { const mk = addMonths(cur, k), x = Domain.recipient(s, mk); if (x && !seen.has(x.id)) { seen.add(x.id); line.push([mk, x]); } } return line.length ? `<div class="po-line" aria-label="Next turns"><span class="po-now">${av(rec, 26)}<b>${esc(longMonth(cur).slice(0, 3))}</b></span>${line.map(([mk, x]) => `<span class="${me && x.id === me.id ? 'me' : ''}">${av(x, 26)}<b>${esc(longMonth(mk).slice(0, 3))}</b><small>${esc(me && x.id === me.id ? 'You' : x.name.split(' ')[0])}</small></span>`).join('')}</div>` : ''; })()}
<div class="po-meta">${status}<span>Turn ${Math.max(1, idx + 1)} of ${s.members.length}</span>${po ? '' : `<span>${Domain.isOverdue(s, cur) ? 'Collections closed ' + esc(dueDate) : 'Collections close ' + esc(dueDate)}</span>`}</div>${acts}</section>`;
    }

    /* who is behind (treasurer only) */
    const rows = [];
    if (admin) {
      if (late.length) {
        late.slice(0, 4).forEach(m => {
          const bal = Domain.outstanding(s, m.id, cur);
          const msg = `Hi ${firstName(m.name)}, a friendly reminder from ${s.chama.name}: your ${monthLabel(cur)} contribution balance is ${kes(bal)}.${s.chama.payTo ? ' Pay to: ' + s.chama.payTo + '.' : ''} Thank you!`;
          rows.push(`<div class="li has-av">${av(m, 40)}<div class="li-main"><b>${esc(m.name)}</b><small class="num">${esc(kes(bal))} behind</small></div><div class="li-end">${m.phone ? `<a class="btn sm tint" target="_blank" rel="noopener noreferrer" href="${esc(waLink(m.phone, msg))}" aria-label="Remind ${esc(m.name)} on WhatsApp">${icon('chat')}Remind</a>` : `<button type="button" class="btn sm ghost" data-act="editMember" data-id="${esc(m.id)}">Add phone</button>`}</div></div>`);
        });
        if (late.length > 4) rows.push(`<a class="li" href="#/grid"><div class="li-main"><b>${late.length - 4} more behind</b></div>${icon('chev', 'chev')}</a>`);
      } else {
        rows.push(`<div class="li has-ic"><span class="li-ic">${icon('check')}</span><div class="li-main"><b>${Domain.isOverdue(s, cur) ? 'Everyone is paid up' : 'Nobody is late yet'}</b><small>${Domain.isOverdue(s, cur) ? 'Every member has paid for ' + esc(longMonth(cur)) + '.' : 'Contributions are due by day ' + esc(s.chama.dueDay) + '.'}</small></div></div>`);
      }
    }
    const month = rows.length ? `<section class="sec"><div class="sec-h"><h2>${late.length ? 'Behind this month' : 'This month'}</h2>${late.length ? '<button type="button" data-act="remindAll">Remind all</button>' : '<a href="#/grid">Contributions</a>'}</div><div class="list">${rows.join('')}</div></section>` : '';

    const recent = [...s.payments].sort((a, b) => (b.at || Date.parse(b.date) || 0) - (a.at || Date.parse(a.date) || 0)).slice(0, 3);
    const recentHtml = `<section class="sec"><div class="sec-h"><h2>${s.shared ? 'Your recent payments' : 'Recent payments'}</h2>${recent.length ? '<a href="#/grid">See all</a>' : ''}</div><div class="list">${recent.length
      ? recent.map(p => { const m = s.members.find(x => x.id === p.memberId); return s.shared
          ? `<div class="li has-ic"><span class="li-ic">${icon('check')}</span><div class="li-main"><b>${esc(longMonth(p.month))}</b><small>${esc(p.date)}${p.code ? ' · ' + esc(p.code) : ''}</small></div><div class="li-end"><span class="num">${esc(kes(p.amount))}</span></div></div>`
          : `<div class="li has-av">${av(m || { name: 'Removed member' }, 40)}<div class="li-main"><b>${esc(m ? m.name : 'Removed member')}</b><small>${esc(monthLabel(p.month))}${p.code ? ' · ' + esc(p.code) : ''} · ${esc(p.date)}</small></div><div class="li-end"><span class="num">${esc(kes(p.amount))}</span></div></div>`; }).join('')
      : `<div class="li empty">No payments recorded yet</div>`}</div></section>`;

    /* the group's next meeting and its pinned announcement, from Chat */
    const C = __M_src_features_chat_index_js.Chat, up = (C.msgs || []).filter(m => m.kind === 'meeting' && !m.deleted_at && m.meta && Date.parse(m.meta.when) > Date.now() - 3 * 3600e3).sort((a, b) => Date.parse(a.meta.when) - Date.parse(b.meta.when))[0];
    const pin = (C.msgs || []).filter(m => m.pinned && !m.recipient && !m.deleted_at).slice(-1)[0];
    let group = '';
    if (up) { const w = new Date(up.meta.when), my = C.mine(up.id); group += `<a class="next-meet" href="#/chat/group"><div class="mt-date"><b>${esc(w.toLocaleDateString('en-KE', { day: 'numeric' }))}</b><span>${esc(w.toLocaleDateString('en-KE', { month: 'short' }))}</span></div><div class="nm-main"><small>Next meeting</small><b>${esc(up.meta.title || 'Chama meeting')}</b><span>${esc(w.toLocaleDateString('en-KE', { weekday: 'short' }) + ' · ' + w.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }))}${up.meta.place ? ' · ' + esc(up.meta.place) : ''}</span></div><span class="nm-rsvp${my ? ' on' : ''}">${my === 'yes' ? 'Coming' : my === 'no' ? 'Not coming' : my === 'maybe' ? 'Maybe' : 'Reply'}</span></a>`; }
    if (pin) group += `<a class="pin-card" href="#/chat/group">${icon('bell', 's')}<span><b>${esc((pin.meta && pin.meta.title) || 'Announcement')}</b>${esc((pin.body || '').slice(0, 140))}</span></a>`;
    const sec = Sess.role === 'secretary' ? `<div class="qa" role="group" aria-label="Secretary tools">
      <button type="button" data-act="chatForm" data-k="meeting" data-th="group"><span class="qa-i">${icon('clock')}</span>Call a meeting</button>
      <button type="button" data-act="chatForm" data-k="minutes" data-th="group"><span class="qa-i">${icon('doc')}</span>Share minutes</button>
      <button type="button" data-act="chatForm" data-k="poll" data-th="group"><span class="qa-i">${icon('chart')}</span>Start a vote</button>
      <button type="button" data-act="chatForm" data-k="announcement" data-th="group"><span class="qa-i">${icon('bell')}</span>Announce</button>
    </div>` : '';
    const reqs = Sess.role !== 'member' ? __M_src_features_requests_js.Requests.listHtml(true) : '';
    const smart = __M_src_features_smart_js.homeBlocks(s);
    /* order: who you are this month, then the pot, then what to do, then what needs attention, then the record */
    /* the borrower signs loan terms on their own phone */
    const mineUnsigned = meId ? (s.loans || []).filter(l => l.memberId === meId && !l.agreement && Domain.loan(l).balance > 0) : [];
    const terms = mineUnsigned.map(l => `<button type="button" class="sign-card" data-act="signLoanMine" data-id="${esc(l.id)}"><span class="sign-ic">${icon('sign')}</span><span class="sign-t"><b>Loan terms to sign</b><small>${esc(kes(l.principal))} loan · read what you pay back, then sign</small></span>${icon('chev', 'chev')}</button>`).join('');
    const help = `<button type="button" class="simple-help only-simple" data-act="guide">${icon('guide')}<span><b>Need help?</b><small>Ask me, or let me show you how</small></span></button>`;
    return `${greet}${terms}<div class="home-top">${hero}${payout}</div>${help}${qa}${sec}${reqs}${month}<div class="hm-extra">${smart}</div>${group}<div class="hm-extra">${stats}</div>${recentHtml}`;
  }
};

const actions = {
  quickPay: { admin: true, run() { location.hash = '#/grid'; setTimeout(() => toast('Tap a member’s status to record their payment'), 350); } },
  markPayout: { admin: true, run(d) {
    const s = S(), rec = Domain.recipient(s), cur = Domain.now(); if (!rec) return;
    Modal.open({ title: `Payout to ${rec.name}`, submitLabel: 'Record payout', fields: [{ name: 'amount', label: 'Amount sent (KES)', type: 'number', value: d.amt ? Number(d.amt) : '', placeholder: d.amt ? 'e.g. ' + Number(d.amt).toLocaleString('en-KE') : '' }],
      body: `<p class="plain">Record the money you sent to <b>${esc(rec.name)}</b> for ${esc(monthLabel(cur))}. You can ask them to sign next.</p>`,
      onSubmit: v => { const amount = num(v.amount, 'Amount'); const id = uid(); Store.commit(st => st.payouts.push({ id, memberId: rec.id, month: cur, amount, date: todayISO() })); toast('Payout recorded');
        setTimeout(() => Signature.open(`Signature of ${rec.name}`, sig => Store.commit(st => { const p = st.payouts.find(x => x.id === id); if (p) p.sig = sig; })), 60); } });
  } },
  signPayout: { admin: true, run(d) {
    const s = S(), p = s.payouts.find(x => x.id === d.id); if (!p) return;
    Signature.open(`Signature of ${Domain.memberName(s, p.memberId)}`, sig => Store.commit(st => { const x = st.payouts.find(y => y.id === d.id); if (x) x.sig = sig; }));
  } },
  undoPayout: { admin: true, run: d => confirmBox('Undo this payout? It is removed from the records and the change is kept in History.', () => Store.commit(s => { s.payouts = s.payouts.filter(p => p.id !== d.id); })) },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/lib/matcher.js ---- */
const __M_src_lib_matcher_js = (function () {



/* Matches a payment to a member using masked phones, partial names and learned aliases */
const Matcher = {
  toks: s => String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean),
  key(s) { return this.toks(s).sort().join(' '); },
  loc: p => String(p || '').replace(/[\s+-]/g, '').replace(/^(254|0)/, ''),
  phone(mp, tp) {
    const a = this.loc(mp), b = this.loc(tp); if (a.length < 9 || b.length < 3) return 0;
    const mm = b.match(/^(\d*)([*xX]+)(\d*)$/);
    if (!mm) return /^\d+$/.test(b) ? (a === b ? 1 : -1) : 0;
    if (!a.startsWith(mm[1]) || !a.endsWith(mm[3])) return -1;
    const k = mm[1].length + mm[3].length; return k >= 6 ? 0.9 : k >= 3 ? 0.45 : 0;
  },
  name(m, tx) {
    const want = this.toks(tx.name), have = this.toks(m.name); if (!want.length) return 0; let tot = 0;
    want.forEach(w => { let best = 0; have.forEach(h => { if (w === h) best = 1; else if (w.length >= 3 && h.length >= 3 && (h.startsWith(w) || w.startsWith(h))) best = Math.max(best, 0.75); else if (w.length === 1 && h[0] === w) best = Math.max(best, 0.3); }); tot += best; });
    return tot / want.length * (want.length === 1 ? 0.6 : 1);
  },
  score(m, tx) {
    if (tx.name && (m.aliases || []).includes(this.key(tx.name))) return 1;
    const full = tx.phone && !/[*xX]/.test(tx.phone);
    if (full && (m.phones || []).includes(this.loc(tx.phone))) return 1;
    const ph = this.phone(m.phone, tx.phone); if (ph === 1) return 1;
    /* a different number lowers confidence but does not rule the member out: people often pay from a relative's phone */
    if (ph < 0) { const nm = this.name(m, tx); return nm >= 0.9 ? 0.6 : nm >= 0.6 ? 0.45 : 0; }
    return 1 - (1 - ph) * (1 - this.name(m, tx));
  },
  rank(s, tx) { return s.members.map(m => ({ m, sc: this.score(m, tx) })).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc); },
  learn(m, tx) {
    m.aliases = m.aliases || []; m.phones = m.phones || [];
    const k = this.key(tx.name); if (k && !m.aliases.includes(k)) m.aliases.push(k);
    if (tx.phone && !/[*xX]/.test(tx.phone)) { const l = this.loc(tx.phone); if (l && !m.phones.includes(l)) m.phones.push(l); }
  }
};

return { get Matcher() { return Matcher; }, };
})();

/* ---- src/lib/mpesa.js ---- */
const __M_src_lib_mpesa_js = (function () {

/* Reads M-Pesa confirmation text (typed, pasted, or read from a screenshot). Only money RECEIVED is taken.
   Handles personal ("You have received Ksh… from NAME 0712***678 on …") and till / paybill ("Ksh… received from NAME 2547******78 …")
   messages, masked phone numbers, and the small mistakes OCR makes (Ksh1.000,00, KSh, missing spaces). */
const Mpesa = {
  amount(raw) { let n = String(raw).replace(/\s/g, ''); if (/^\d{1,3}(\.\d{3})+,\d{2}$/.test(n)) n = n.replace(/\./g, '').replace(',', '.'); n = n.replace(/,/g, ''); const p = n.split('.'); if (p.length > 2) n = p.slice(0, -1).join('') + '.' + p[p.length - 1]; return parseFloat(n); },
  PHONE: /(?:\+?254|0)\s?[17][\d\s*xX•#.]{5,12}\d/,
  clean(raw) {
    return String(raw || '').replace(/[   ]/g, ' ').replace(/[“”]/g, '"').replace(/\bK\s?sh(?:s)?\b\.?/gi, 'Ksh').replace(/Ksh\s*\.?\s*/g, 'Ksh')
      .replace(/C[o0]nf[il1]rmed/gi, 'Confirmed').replace(/rece[il1]ved/gi, 'received').replace(/\s+/g, ' ');
  },
  parse(raw) {
    const t = this.clean(raw), re = /\b([A-Z0-9]{10})\s*[.,]?\s*Confirmed/gi, hits = [], seen = new Set(), out = [];
    let m; while ((m = re.exec(t))) hits.push({ code: m[1].toUpperCase(), at: m.index });
    hits.forEach((h, k) => {
      const seg = t.slice(h.at, k + 1 < hits.length ? hits[k + 1].at : undefined);
      if (!/received/i.test(seg) || /\b(sent to|paid to|withdraw|transferred to|bought)\b/i.test(seg.split(/received/i)[0]) || seen.has(h.code)) return;
      const a = seg.match(/Ksh\s?([\d][\d,.\s]*\d)/i); if (!a) return;
      const amount = this.amount(a[1]); if (!(amount > 0)) return;
      const f = seg.match(/from\s+(.+?)(?:\s+on\s+\d{1,2}\/\d{1,2}\/\d{2,4}|\s*\.?\s*New\s+M-?PESA|\s+at\s+\d|\.\s|$)/i), who = f ? f[1] : '';
      const ph = who.match(this.PHONE), phone = ph ? ph[0].replace(/[\s.]/g, '').replace(/[•#xX]/g, '*') : '';
      const name = who.replace(ph ? ph[0] : '', '').replace(/[-:,.]/g, ' ').replace(/\b(account|acc|a\/c)\b.*$/i, '').replace(/\s+/g, ' ').trim();
      const d = seg.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); let date = '';
      if (d) { const y = d[3].length === 2 ? '20' + d[3] : d[3]; date = `${y}-${d[2].padStart(2, '0')}-${d[1].padStart(2, '0')}`; if (isNaN(Date.parse(date))) date = ''; }
      seen.add(h.code); out.push({ code: h.code, amount, name, phone, date, masked: /\*/.test(phone), sms: seg.trim().slice(0, 360) });
    });
    return out;
  },
  /* "0712***678" -> "07•• ••• 678" style for display */
  showPhone(p) { return String(p || '').replace(/\*+/g, m => '•'.repeat(Math.min(m.length, 6))); }
};

return { get Mpesa() { return Mpesa; }, };
})();

/* ---- src/lib/importer.js ---- */
const __M_src_lib_importer_js = (function () {
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { addMonths, esc, kes, monthLabel, todayISO, uid } = __M_src_core_utils_js;
const { Matcher } = __M_src_lib_matcher_js;
const { Mpesa } = __M_src_lib_mpesa_js;
const { Modal, savePayments } = __M_src_ui_modal_js;
const { toast } = __M_src_ui_toast_js;

const Import = {
  lib: src => new Promise((ok, no) => { const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = no; document.head.appendChild(el); }),
  /* screenshots are scaled so text is ~30px high, turned grey, stretched in contrast and, for dark-mode screenshots, inverted */
  async prepare(file, mode) {
    const bmp = await createImageBitmap(file);
    const k = Math.min(2.2, Math.max(1, 1400 / bmp.width)) * Math.min(1, 2600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, c.width, c.height);
    const img = x.getImageData(0, 0, c.width, c.height), d = img.data; let lo = 255, hi = 0, total = 0;
    for (let i = 0; i < d.length; i += 4) { const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; d[i] = g; total += g; if (g < lo) lo = g; if (g > hi) hi = g; }
    const dark = total / (d.length / 4) < 128, span = Math.max(1, hi - lo);
    for (let i = 0; i < d.length; i += 4) { let g = (d[i] - lo) * 255 / span; if (dark) g = 255 - g; g = mode === 'bw' ? (g < 165 ? 0 : 255) : g < 150 ? Math.max(0, g - 40) : Math.min(255, g + 30); d[i] = d[i + 1] = d[i + 2] = g; }
    x.putImageData(img, 0, 0); return c;
  },
  async worker() {
    if (this._w) return this._w;
    if (!window.Tesseract) await this.lib('vendor/tesseract/tesseract.min.js');
    const base = new URL('vendor/tesseract/', location.href).href;
    this._w = await Tesseract.createWorker('eng', 1, { workerPath: base + 'worker.min.js', corePath: base + 'core', langPath: base + 'lang', gzip: true });
    await this._w.setParameters({ preserve_interword_spaces: '1', user_defined_dpi: '300' });
    return this._w;
  },
  async ocr(file, onStep, mode) {
    if (onStep && !this._w) onStep('getting the reader ready (first time only)…');
    const w = await this.worker();
    if (onStep) onStep('reading…');
    return (await w.recognize(await this.prepare(file, mode))).data.text;
  },
  ui: null,
  /* the start: two big choices; what was added shows as thumbnails right away */
  sheet() {
    const u = this.ui, R = __M_src_features_requests_js, n = u.files.length, t = u.text.trim();
    const shots = n ? `<div class="im-shots">${u.files.map((f, i) => `<figure class="im-shot${u.res && u.res[i] ? ' ' + u.res[i].k : ''}"><img src="${u.urls[i]}" alt="Screenshot ${i + 1}">${u.res && u.res[i] ? `<figcaption>${esc(u.res[i].t)}</figcaption>` : `<button type="button" class="im-x" data-im="rm" data-i="${i}" aria-label="Remove screenshot ${i + 1}">${icon('close', 's')}</button>`}</figure>`).join('')}${n < 10 && !u.busy ? `<label class="im-add" for="imFiles">${icon('plus')}<span>Add</span></label>` : ''}</div>` : '';
    const html = `<div class="sx-head"><span class="sx-badge">${icon('import')}</span><h3>Add M-Pesa payments</h3><p>Read on this phone. Nothing is uploaded.</p></div>
${n || u.paste ? '' : `<div class="im-pick"><label class="im-tile" for="imFiles">${icon('camera')}<b>Screenshots</b><small>of the M-Pesa messages</small></label><button type="button" class="im-tile" data-im="paste">${icon('chat')}<b>Paste</b><small>copied messages</small></button></div>`}
<input type="file" id="imFiles" accept="image/*" multiple hidden>
${shots}
${u.paste ? `<label class="fgrp" for="imText"><span class="flab">Paste the messages</span><textarea id="imText" rows="5" placeholder="SKB7H2LQ4P Confirmed. You have received Ksh2,000.00 from…">${esc(u.text)}</textarea></label>` : ''}
${u.busy ? `<div class="imp-prog" id="impProg"><span>${esc(u.busy)}</span><div class="cl-bar"><i style="width:${u.pct || 5}%"></i></div></div>` : ''}
${(n || u.paste) && !u.busy ? `<button type="button" class="btn pri block lg" data-im="go">${n ? `Read ${n} screenshot${n > 1 ? 's' : ''}` : 'Find payments'}${n && t ? ' and the messages' : ''}</button>` : ''}
${!u.paste && n && !u.busy ? `<button type="button" class="linkish im-more" data-im="paste">Also paste messages</button>` : ''}`;
    if (R.Sheet.isOpen('import')) R.Sheet.update(html); else R.Sheet.open(html, { key: 'import', label: 'Add M-Pesa payments' });
    const inp = document.getElementById('imFiles');
    if (inp) inp.onchange = () => { const add = [...inp.files].slice(0, 10 - u.files.length); add.forEach(f => { u.files.push(f); u.urls.push(URL.createObjectURL(f)); }); u.res = null; this.sheet(); };
  },
  async go() {
    const u = this.ui, files = u.files, R = __M_src_features_requests_js;
    u.res = files.map(() => null); let all = u.text || '', found = 0;
    for (let i = 0; i < files.length; i++) {
      u.busy = `Reading screenshot ${i + 1} of ${files.length}…`; u.pct = Math.round((i + .3) / files.length * 100); this.sheet();
      let txt = '';
      try { txt = await this.ocr(files[i], m => { u.busy = `Screenshot ${i + 1} of ${files.length}: ${m}`; this.sheet(); }); } catch (e) { console.warn('OCR failed', e); }
      let got = Mpesa.parse(txt);
      /* nothing found: read it again another way (sharper black and white) before giving up */
      if (!got.length) { try { const t2 = await this.ocr(files[i], null, 'bw'); const g2 = Mpesa.parse(t2); if (g2.length) { txt = t2; got = g2; } } catch (e) {} }
      all += '\n' + txt; found += got.length;
      u.res[i] = got.length ? { k: 'ok', t: got.length + (got.length > 1 ? ' payments' : ' payment') } : { k: 'no', t: 'Nothing found' };
      this.sheet();
    }
    u.busy = ''; u.pct = 0;
    const txs = Mpesa.parse(all);
    if (!txs.length) { this.sheet(); return __M_src_ui_toast_js.Pop.alert(files.length ? 'No money received was found in these. Make sure the whole message shows in the screenshot, or paste the message text instead.' : 'No money received was found. Only messages that say "received" are added.', { title: 'No payments found', label: 'OK' }); }
    R.Sheet.close(); u.urls.forEach(x => URL.revokeObjectURL(x));
    setTimeout(() => this.review(txs), 260);
  },
  progress(msg, i, n) {
    const el = document.getElementById('impProg'); if (!el) return;
    el.hidden = false; el.querySelector('span').textContent = msg; el.querySelector('i').style.width = Math.round((i / Math.max(1, n)) * 100) + '%';
  },
  async run(text, files) {
    try {
      let all = text || '', failed = 0;
      if (files.length) Modal.open({ title: 'Reading screenshots', body: `<div class="imp-prog" id="impProg"><span>Starting…</span><div class="cl-bar"><i style="width:4%"></i></div><p class="fhelp">Everything is read on this phone. Nothing is sent anywhere.</p></div>`, hideCancel: true });
      for (let i = 0; i < files.length; i++) {
        try { all += '\n' + await this.ocr(files[i], m => this.progress(`Screenshot ${i + 1} of ${files.length}: ${m}`, i + 0.5, files.length)); }
        catch (e) { failed++; console.warn('OCR failed', e); }
        this.progress(`Read ${i + 1} of ${files.length}`, i + 1, files.length);
      }
      if (files.length) Modal.close();
      const txs = Mpesa.parse(all);
      if (!txs.length) return __M_src_ui_toast_js.Pop.alert(failed ? 'The screenshot could not be read. Paste the message text instead: long-press the SMS, copy, and paste it here.' : 'No money received was found. Only messages that say "received" are imported. Payments you sent are ignored.', { title: 'No payments found', label: 'OK' });
      if (failed) toast(failed + ' screenshot' + (failed > 1 ? 's' : '') + ' could not be read', 'info');
      this.review(txs);
    } catch (e) { Modal.close(); toast(e.message); }
  },
  defaultMonth(s, mid) {
    const cur = Domain.now();
    for (let i = 5; i >= 0; i--) { const mk = addMonths(cur, -i); if ((mk === cur || s.payments.some(p => p.month === mk)) && Domain.outstanding(s, mid, mk) > 0 && mk >= Domain.joinMonth(s, mid)) return mk; }
    return cur;
  },
  /* why we think this payment belongs to this member, in plain words */
  why(m, t) {
    if (!m) return 'No member matches the name or number';
    const bits = [];
    if (t.name && (m.aliases || []).includes(Matcher.key(t.name))) bits.push('paid under this name before');
    const ph = Matcher.phone(m.phone, t.phone);
    if (ph === 1) bits.push('same phone number'); else if (ph < 0) bits.push('a different phone than the one saved'); else if (ph > 0) { const d = Matcher.loc(t.phone).replace(/\*+/g, ' ').trim().split(' '); bits.push('phone ' + (d[0] ? 'starts ' + d[0] : '') + (d[0] && d[1] ? ', ' : '') + (d[1] ? 'ends ' + d[1] : '')); }
    else if (t.phone && !m.phone) bits.push('no phone saved for ' + m.name.split(' ')[0]);
    const nm = Matcher.name(m, t); if (nm >= 0.9) bits.push('name matches'); else if (nm > 0.3) bits.push('name partly matches');
    return bits.join(' · ') || 'weak match';
  },
  review(txs) {
    const s = S(), cur = Domain.now(), months = Array.from({ length: 8 }, (_, i) => addMonths(cur, i - 6));
    let sure = 0, check = 0, dup = 0, none = 0;
    const rows = txs.map((t, i) => {
      const r = Matcher.rank(s, t), top = r[0], ok = top && top.sc >= 0.8 && !(r[1] && r[1].sc > top.sc - 0.15);
      t.memberId = top && top.sc >= 0.4 ? top.m.id : ''; t.dup = s.payments.some(p => p.code && p.code === t.code);
      const st = t.dup ? 'dup' : ok ? 'sure' : t.memberId ? 'check' : 'none';
      ({ dup: () => dup++, sure: () => sure++, check: () => check++, none: () => none++ })[st]();
      const mo = t.memberId ? Import.defaultMonth(s, t.memberId) : cur, m = t.memberId ? s.members.find(x => x.id === t.memberId) : null;
      const pctv = top ? Math.round(Math.min(1, top.sc) * 100) : 0;
      const ordered = [...r.map(x => x.m), ...s.members.filter(x => !r.some(y => y.m.id === x.id))];
      return `<div class="imp-card st-${st}">
<label class="imp-inc"><input type="checkbox" name="inc_${i}" aria-label="Include ${esc(t.code)}" ${t.dup ? 'disabled' : st === 'none' ? '' : 'checked'}></label>
<div class="imp-body"><div class="imp-top"><b class="num">${esc(kes(t.amount))}</b><span class="tag ${st === 'dup' ? 'bad' : st === 'sure' ? 'ok' : 'warn'}">${st === 'dup' ? 'Already recorded' : st === 'sure' ? 'Matched' : st === 'check' ? 'Please check' : 'No match'}</span></div>
<div class="imp-from">${esc(t.name || 'No name in message')}${t.phone ? ` · <span class="num">${esc(Mpesa.showPhone(t.phone))}</span>` : ''}</div>
<div class="imp-meta"><span class="num">${esc(t.code)}</span>${t.date ? `<span>${esc(t.date)}</span>` : ''}</div>
${t.dup ? '' : `<div class="imp-why"><span class="imp-conf"><i style="width:${pctv}%"></i></span>${esc(Import.why(m, t))}</div>
<div class="imp-pick"><select name="m_${i}" aria-label="Member for ${esc(t.code)}"><option value="">Choose member…</option>${ordered.map(x => `<option value="${esc(x.id)}" ${x.id === t.memberId ? 'selected' : ''}>${esc(x.name)}${x.phone ? ' · …' + esc(String(x.phone).slice(-3)) : ''}</option>`).join('')}</select>
<select name="mo_${i}" aria-label="Month for ${esc(t.code)}">${months.map(k => `<option value="${k}" ${k === mo ? 'selected' : ''}>${monthLabel(k)}</option>`).join('')}</select></div>`}</div></div>`;
    }).join('');
    const sumHtml = `<div class="imp-sum"><div><b>${sure}</b><span>Matched</span></div><div><b>${check}</b><span>To check</span></div><div><b>${none}</b><span>No match</span></div><div><b>${dup}</b><span>Already in</span></div></div>
<p class="fhelp">M-Pesa hides part of each phone number, so matches use the digits that show and the name. Check every “Please check”. Once you confirm a match, the app remembers that name for next time.</p>`;
    Modal.open({ title: `${txs.length} payment${txs.length > 1 ? 's' : ''} found`, submitLabel: 'Record ticked payments', body: sumHtml + `<div class="imp-list">${rows}</div>`, onSubmit: v => {
      const picks = txs.map((t, i) => ({ t, i })).filter(x => v['inc_' + x.i] != null);
      if (!picks.length) throw new Error('Nothing is ticked');
      picks.forEach(({ t, i }) => { if (!v['m_' + i]) throw new Error('Choose a member for ' + t.code); });
      savePayments(picks.map(({ t, i }) => { const m = S().members.find(x => x.id === v['m_' + i]); return { memberId: m.id, month: v['mo_' + i], amount: t.amount, code: t.code, date: t.date || todayISO(), name: m.name, from: t.name, phone: t.phone, sms: t.sms, learn: { m, t } }; }));
    } });
  }
};

document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-im]'); if (!b || !Import.ui) return;
  const u = Import.ui, k = b.dataset.im, ta = document.getElementById('imText'); if (ta) u.text = ta.value;
  if (k === 'rm') { const i = Number(b.dataset.i); URL.revokeObjectURL(u.urls[i]); u.files.splice(i, 1); u.urls.splice(i, 1); u.res = null; return Import.sheet(); }
  if (k === 'paste') { u.paste = true; Import.sheet(); setTimeout(() => { const t = document.getElementById('imText'); if (t) t.focus(); }, 80); return; }
  if (k === 'go') { if (!u.files.length && !u.text.trim()) return toast('Paste a message or add a screenshot'); return Import.go(); }
});
document.addEventListener('input', e => { if (e.target && e.target.id === 'imText' && Import.ui) Import.ui.text = e.target.value; });

return { get Import() { return Import; }, };
})();

/* ---- src/ui/forms.js ---- */
const __M_src_ui_forms_js = (function () {

const memberOptions = s => s.members.map(m => [m.id, m.name]);

return { get memberOptions() { return memberOptions; }, };
})();

/* ---- src/features/contributions/index.js ---- */
const __M_src_features_contributions_index_js = (function () {
const { Auth, adminBtn } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { addMonths, esc, kes, monthLabel, sum, todayISO, uid } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { Import } = __M_src_lib_importer_js;
const { num } = __M_src_lib_validate_js;
const { av, memberChip } = __M_src_ui_avatar_js;
const { memberOptions } = __M_src_ui_forms_js;
const { Modal, confirmBox, savePayments } = __M_src_ui_modal_js;
const { toast } = __M_src_ui_toast_js;
const { render } = __M_src_core_rerender_js;
let cgMonth = null;   // selected month, UI state only
const shortDay = d => { const t = Date.parse(d); return isNaN(t) ? String(d || '') : new Date(t).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }); };

const views = {
  grid(s) {
    const admin = Auth.isAdmin();
    const head = `<h1 class="lt">Contributions</h1><p class="lt-sub">${esc(kes(s.chama.monthly))} per share, due by day ${esc(s.chama.dueDay)} each month</p>`;
    if (!s.members.length) return head + `<div class="card">${emptyState('receipt', 'No members yet', admin ? 'Add your members first. Then their monthly contributions show up here.' : 'Your treasurer has not added members yet.', admin ? '<button class="btn pri" data-act="addMember">' + icon('userPlus') + 'Add a member</button>' : '')}</div>`;
    const cur = Domain.now(), months = Array.from({ length: 6 }, (_, i) => addMonths(cur, i - 5));
    if (!cgMonth || !months.includes(cgMonth)) cgMonth = cur;
    const mo = cgMonth, idx = months.indexOf(mo);
    const inMonth = m => !(m.left && mo > m.left);
    const people = s.shared ? s.members.filter(m => m.id === s.shared.me) : s.members.filter(inMonth);
    const total = s.shared ? ((s.shared.monthCollected || {})[mo] || 0) : sum(s.payments.filter(p => p.month === mo), p => p.amount);
    const expected = sum(s.members.filter(m => Domain.joinMonth(s, m.id) <= mo), m => Domain.dueFor(s, m.id, mo));
    const pct = expected ? Math.min(100, Math.round(total / expected * 100)) : 0;
    const label = { paid: 'Paid', late: 'Late', due: 'Record', future: 'Not due', na: 'Not due', partial: 'Part paid' };
    const memberLabel = { paid: 'Paid', late: 'Late', due: 'Due', future: 'Not due', na: 'Not due', partial: 'Part paid' };
    const paidCount = s.shared ? null : s.members.filter(inMonth).filter(m => Domain.status(s, m.id, mo) === 'paid').length;

    const rows = people.map(m => {
      const st = Domain.status(s, m.id, mo), paid = Domain.paidIn(s, m.id, mo), due = Domain.dueFor(s, m.id, mo);
      const can = admin && !['future', 'na'].includes(st);
      const sub = ['future', 'na'].includes(st) ? 'Not due this month' : `${kes(paid)} of ${kes(due)}`;
      const text = st === 'partial' ? kes(paid) : (admin ? label[st] : memberLabel[st]);
      return `<div class="li has-av">${av(m, 40)}<div class="li-main"><b>${esc(m.name)}${(m.shares || 1) > 1 ? ` <span class="tag">×${esc(m.shares)}</span>` : ''}</b><small class="num">${esc(sub)}</small></div>
        <div class="li-end"><button type="button" class="st ${st}" ${can ? `data-act="pay" data-m="${esc(m.id)}" data-mo="${esc(mo)}"` : 'disabled'} aria-label="${esc(m.name)}, ${esc(monthLabel(mo))}: ${esc(memberLabel[st])}${can ? '. Tap to record a payment' : ''}">${esc(text)}</button></div></div>`;
    }).join('');

    const pills = months.map(mk => `<button type="button" role="tab" aria-selected="${mk === mo}" data-act="cgMonth" data-mo="${mk}">${esc(monthLabel(mk))}</button>`).join('');
    const recent = [...s.payments].sort((a, b) => (b.at || Date.parse(b.date) || 0) - (a.at || Date.parse(a.date) || 0)).slice(0, 10);

    return `${head}
      ${admin ? `<div class="btns" style="margin-top:0"><button class="btn tint sm" data-act="importPay">${icon('import')}Import from M-Pesa</button></div>` : ''}
      <div class="months" role="tablist" aria-label="Month" style="--n:6;--i:${idx}"><span class="pill" aria-hidden="true"></span>${pills}</div>
      <div class="card" style="padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><span class="mute small">${s.shared ? 'Group total' : 'Collected'} · ${esc(monthLabel(mo))}</span>${paidCount != null ? `<span class="tag ${paidCount === people.length ? 'ok' : ''}">${paidCount} of ${people.length} paid</span>` : ''}</div>
        <div class="num" style="font:700 1.6em/1.2 var(--font-display);margin-top:4px">${esc(kes(total))}</div>
        <div class="bar" style="margin-top:10px" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Share of expected collected"><i style="width:${pct}%"></i></div>
        <p class="mute small" style="margin-top:8px">${pct}% of ${esc(kes(expected))} expected</p>
      </div>
      <section class="sec"><div class="sec-h"><h2>${s.shared ? 'Your contribution' : 'Members'}</h2></div>
        <div class="list">${rows || '<div class="li empty">Your sign-in is not linked to a member record yet</div>'}</div>
        <p class="foot-note">${admin ? 'Tap a status to record a payment. Every change is kept in History.' : 'You see your own contribution and the group total. Other members’ payments stay private.'}</p>
      </section>
      <section class="sec"><div class="sec-h"><h2>${s.shared ? 'Your payments' : 'Recent payments'}</h2></div>
        <div class="list">${recent.length ? recent.map(p => {
          const m = s.members.find(x => x.id === p.memberId);
          const inner = `${av(m || { name: 'Removed member' }, 40)}<span class="li-main"><b>${esc(m ? m.name : 'Removed member')}</b><small>${p.code ? esc(p.code) + ' · ' : ''}${esc(shortDay(p.date))}${String(p.date || '').slice(0, 7) !== p.month ? ' · for ' + esc(monthLabel(p.month)) : ''}${p.from && m && p.from.toLowerCase() !== m.name.toLowerCase() ? ' · from ' + esc(p.from) : ''}${p.via === 'mpesa' ? ' · ' + icon('chat', 's') : ''}</small></span><span class="li-end"><span class="num">${esc(kes(p.amount))}</span>${admin ? icon('chev', 'chev') : ''}</span>`;
          return admin ? `<button type="button" class="li has-av" data-act="payMenu" data-id="${esc(p.id)}">${inner}</button>` : `<div class="li has-av">${inner}</div>`;
        }).join('') : '<div class="li empty">No payments recorded yet</div>'}</div>
      </section>`;
  }
};

const actions = {
  pay: { admin: true, run(d) {
    const s = S(), m = s.members.find(x => x.id === d.m); if (!m) return;
    const due = Domain.dueFor(s, m.id), left = Math.max(0, due - Domain.paidIn(s, m.id, d.mo));
    const paidUp = !left, ahead = Domain.ahead(s, m.id);
    /* extra money goes to the first month after this one that is not yet covered, and carries forward from there */
    const nextMo = Domain.firstUncovered(s, m.id, addMonths(d.mo, 1));
    Modal.open({ title: `${m.name}`, submitLabel: paidUp ? 'Record extra' : 'Record payment', fields: [
      { name: 'kind', label: 'What is this money for?', type: 'select', value: paidUp ? 'ahead' : 'month', options: [['month', `${monthLabel(d.mo)} contribution${left ? ' (' + kes(left) + ' due)' : ''}`], ['ahead', `Extra: pays ahead from ${monthLabel(nextMo)}`]] },
      { name: 'amount', label: 'Amount (KES)', type: 'number', value: paidUp ? '' : (left || due), placeholder: 'e.g. ' + due.toLocaleString('en-KE') },
      { name: 'code', label: 'M-Pesa code (optional)', placeholder: 'e.g. SJK4L2P9QX' }],
      body: `<div class="pay-sum"><div><span>${esc(monthLabel(d.mo))}</span><b class="num">${paidUp ? 'Paid' : esc(kes(left)) + ' due'}</b></div><div><span>Paid ahead</span><b class="num">${esc(kes(ahead))}</b></div><div><span>Monthly</span><b class="num">${esc(kes(due))}</b></div></div>
<p class="fhelp">${paidUp ? 'This month is paid. Extra money is kept for the coming months, so they show as paid in turn.' : 'Paying more than is due? Choose Extra, or just enter the bigger amount: the rest carries forward.'}</p>`,
      onSubmit: v => {
        const amount = num(v.amount, 'Amount');
        if (amount > 10000000) throw new Error('That amount is too large. Check the number.');
        const code = (v.code || '').trim().toUpperCase().replace(/\s+/g, '');
        if (code && !/^[A-Z0-9]{6,15}$/.test(code)) throw new Error('An M-Pesa code has 6 to 15 letters and numbers');
        if (code && S().payments.some(p => p.code === code)) throw new Error('That M-Pesa code is already recorded');
        const month = v.kind === 'ahead' ? Domain.firstUncovered(S(), m.id, addMonths(d.mo, 1)) : d.mo;
        savePayments([{ memberId: m.id, month, amount, code, date: todayISO(), name: m.name }]);
      } });
  } },
  payMenu: { admin: true, run(d) {
    const s = S(), p = s.payments.find(x => x.id === d.id); if (!p) return;
    Modal.open({ title: 'Payment', body: `<div class="kv"><span>Member</span><b>${esc(Domain.memberName(s, p.memberId))}</b></div><div class="kv"><span>Amount</span><b class="num">${esc(kes(p.amount))}</b></div><div class="kv"><span>For month</span><b>${esc(monthLabel(p.month))}</b></div><div class="kv"><span>Date</span><b>${esc(p.date)}</b></div><div class="kv"><span>M-Pesa code</span><b>${esc(p.code || 'None')}</b></div>
      ${p.from || p.fromPhone ? `<div class="kv"><span>Sent by</span><b>${esc(p.from || '')}${p.fromPhone ? ' · ' + esc(String(p.fromPhone).replace(/\*+/g, m => '•'.repeat(Math.min(m.length, 6)))) : ''}</b></div>` : ''}
      ${p.sms ? `<div class="pay-sms"><small>${icon('chat', 's')}The M-Pesa message</small><p>${esc(p.sms)}</p></div>` : ''}
      <div class="btns"><button type="button" class="btn grow" data-act="editPay" data-id="${esc(p.id)}">${icon('pencil')}Edit</button><button type="button" class="btn bad grow" data-act="delPay" data-id="${esc(p.id)}">${icon('trash')}Remove</button></div>` });
  } },
  delPay: { admin: true, run: d => { Modal.close(); confirmBox('Remove this payment? It is taken off the records. The change is kept in History and can be undone from the menu.', () => Store.commit(s => { s.payments = s.payments.filter(p => p.id !== d.id); })); } },
  editPay: { admin: true, run(d) {
    const s = S(), p = s.payments.find(x => x.id === d.id); if (!p) return;
    Modal.open({ title: 'Edit payment', fields: [
      { name: 'memberId', label: 'Member', type: 'select', options: memberOptions(s), value: p.memberId },
      { name: 'month', label: 'For month', type: 'month', value: p.month, required: true },
      { name: 'amount', label: 'Amount (KES)', type: 'number', value: p.amount },
      { name: 'code', label: 'M-Pesa code', value: p.code }],
      onSubmit: v => { const amount = num(v.amount, 'Amount'); const code = (v.code || '').trim().toUpperCase().replace(/\s+/g, ''); if (code && !/^[A-Z0-9]{6,15}$/.test(code)) throw new Error('An M-Pesa code has 6 to 15 letters and numbers'); if (code && S().payments.some(x => x.code === code && x.id !== p.id)) throw new Error('That M-Pesa code is already recorded'); if (!/^\d{4}-\d{2}$/.test(v.month)) throw new Error('Pick a month'); if (!S().members.some(m => m.id === v.memberId)) throw new Error('Choose a member'); Store.commit(st => Object.assign(st.payments.find(x => x.id === p.id), { memberId: v.memberId, month: v.month, amount, code })); toast('Payment updated'); } });
  } },
  importPay: { admin: true, run() {
    if (!S().members.length) return toast('Add members first');
    Import.ui = { files: [], urls: [], text: '' };
    Import.sheet();
  } },
  cgMonth: { run(d) { cgMonth = d.mo; render(); } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/loans/index.js ---- */
const __M_src_features_loans_index_js = (function () {
const { Auth, adminBtn } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, todayISO, uid, sum } = __M_src_core_utils_js;
const { num } = __M_src_lib_validate_js;
const { av } = __M_src_ui_avatar_js;
const { memberOptions } = __M_src_ui_forms_js;
const { Modal } = __M_src_ui_modal_js;
const { Signature, sigImg } = __M_src_ui_signature_js;
const { toast } = __M_src_ui_toast_js;

/* one terms screen for both ways of signing. mode 'here': the treasurer hands over the phone; 'mine': the borrower signs. */
function loanTerms(s, id, mode) {
  const l = (s.loans || []).find(x => x.id === id); if (!l) return;
  const c = Domain.loan(l), who = Domain.memberName(s, l.memberId), start = new Date(l.date || Date.now());
  const due = Array.from({ length: l.months }, (_, i) => { const x = new Date(start); x.setMonth(x.getMonth() + i + 1); return x; });
  const fmt = x => x.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  const last = due[due.length - 1];
  const rows = due.slice(0, 12).map((x, i) => `<div class="lt-row"><span>${i + 1}</span><b>${esc(fmt(x))}</b><em class="num">${esc(kes(i === due.length - 1 ? Math.round((c.total - c.installment * (due.length - 1)) * 100) / 100 : c.installment))}</em></div>`).join('') + (due.length > 12 ? `<p class="fhelp">and ${due.length - 12} more monthly instalments.</p>` : '');
  Modal.open({ title: mode === 'mine' ? 'Your loan terms' : 'Loan terms for ' + who, submitLabel: 'I agree, sign now',
    body: `<div class="loan-terms">${mode === 'here' ? `<p class="lt-hand">${icon('hand', 's')}Hand the phone to <b>${esc(who)}</b></p>` : ''}
<div class="lt-big"><div><span>You borrow</span><b class="num">${esc(kes(l.principal))}</b></div><div class="lt-pay"><span>You pay back</span><b class="num">${esc(kes(c.total))}</b></div></div>
<p class="lt-line">${esc(String(l.rate))}% a month for ${esc(String(l.months))} ${l.months === 1 ? 'month' : 'months'} · last day <b>${esc(fmt(last))}</b></p>
<div class="lt-sched">${rows}</div>
<p class="fhelp">Late instalments may be fined under the Chama rules.</p></div>`,
    fields: [{ name: 'agree', label: 'I understand how much I pay back and by when, and I agree.', type: 'checkbox' }],
    onSubmit: v => {
      if (v.agree !== 'on') throw new Error('Tick the box to show you understand and agree');
      const terms = { total: c.total, installment: c.installment, lastDue: last.toISOString().slice(0, 10) };
      setTimeout(() => Signature.open(mode === 'mine' ? 'Your signature' : 'Signature of ' + who, async sig => {
        if (mode === 'mine') {
          const B = __M_src_core_backend_js.Backend;
          const { error } = await B.sb.rpc('sign_loan_terms', { p_cid: Store.chamaId, p_loan: l.id, p_sig: sig, p_total: terms.total, p_installment: terms.installment, p_last_due: terms.lastDue });
          if (error) return toast(/Could not find the function|PGRST202|schema cache/i.test(error.message || '') ? 'Signing on your phone needs the latest server update. Ask the treasurer to sign with you.' : error.message);
          try { await Store.reload(); } catch (e) {}
          return __M_src_ui_toast_js.Pop.alert('Your signed terms were sent to the treasurer and are kept with the loan.', { title: 'Signed', html: `<div class="sx-tick big-tick">${icon('check')}</div><p>You agreed to pay back ${esc(kes(terms.total))} by ${esc(fmt(last))}. Your signed terms were sent to the treasurer and are kept with the loan.</p>`, label: 'Done' });
        }
        Store.commit(st => { const x = st.loans.find(y => y.id === l.id); if (x) x.agreement = { at: new Date().toISOString(), sig, ...terms, on: 'treasurer phone' }; });
        __M_src_ui_toast_js.Pop.alert(who + ' agreed to pay back ' + kes(c.total) + ' by ' + fmt(last) + '. The signed terms are kept with the loan.', { title: 'Loan agreement signed', label: 'OK' });
      }), 80);
    } });
}
/* the borrower's own unsigned loans */
const unsignedMine = s => { const me = s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId; return me ? (s.loans || []).filter(l => l.memberId === me && !l.agreement && Domain.loan(l).balance > 0) : []; };

const views = {
  loans(s) {
    const admin = Auth.isAdmin();
    const head = `<h1 class="lt">Loans</h1><p class="lt-sub">${s.shared ? 'Your loans and repayments' : 'Money lent to members and paid back'}</p>`
      + unsignedMine(s).map(l => `<button type="button" class="sign-card" data-act="signLoanMine" data-id="${esc(l.id)}"><span class="sign-ic">${icon('sign')}</span><span class="sign-t"><b>Loan terms to sign</b><small>${esc(kes(l.principal))} loan · read what you pay back, then sign</small></span>${icon('chev', 'chev')}</button>`).join('')
      + (admin ? s.loans.filter(l => !l.agreement && Domain.loan(l).balance > 0).map(l => `<div class="sign-card wait"><span class="sign-ic">${icon('clock')}</span><span class="sign-t"><b>${esc(Domain.memberName(s, l.memberId))} has not signed yet</b><small>${esc(kes(l.principal))} loan</small></span><button type="button" class="btn sm tint" data-act="loanSend" data-id="${esc(l.id)}">Send again</button></div>`).join('') : '');
    const all = s.loans.map(l => ({ l, c: Domain.loan(l) }));
    const active = all.filter(x => x.c.balance > 0), done = all.filter(x => x.c.balance <= 0);
    const stats = `<div class="stats"><div><span>Outstanding</span><b>${esc(kes(sum(all, x => x.c.balance)))}</b></div><div><span>Active</span><b class="num">${active.length}</b></div><div><span>Repaid</span><b>${esc(kes(sum(all, x => x.c.paid)))}</b></div></div>`;
    const btn = admin ? `<div class="btns" style="margin-top:0"><button class="btn pri" data-act="addLoan">${icon('plus')}New loan</button></div>` : '';
    if (!all.length) return head + btn + `<div class="card" style="margin-top:14px">${emptyState('loan', 'No loans yet', admin ? 'When the chama lends to a member, record it here with the interest and repayment period.' : 'Loans you take from your chama will show here.')}</div>`;
    const row = ({ l, c }) => {
      const m = s.members.find(x => x.id === l.memberId), pct = c.total ? Math.min(100, Math.round(c.paid / c.total * 100)) : 100;
      return `<button type="button" class="li has-av" data-act="loanMenu" data-id="${esc(l.id)}">${av(m || { name: 'Removed member' }, 40)}<span class="li-main"><b>${esc(Domain.memberName(s, l.memberId))}</b><small class="num">${esc(kes(l.principal))} · ${esc(l.rate)}% × ${esc(l.months)} mo · ${esc(l.date)}</small><span class="bar ${c.balance ? '' : 'ok'}" style="margin-top:7px"><i style="width:${pct}%"></i></span></span><span class="li-end"><span><span class="num">${esc(kes(c.balance))}</span><small>${c.balance ? 'left' : 'cleared'}</small></span>${icon('chev', 'chev')}</span></button>`;
    };
    return `${head}${btn}${stats}
      ${active.length ? `<section class="sec"><div class="sec-h"><h2>Active</h2></div><div class="list">${active.map(row).join('')}</div></section>` : ''}
      ${done.length ? `<section class="sec"><div class="sec-h"><h2>Cleared</h2></div><div class="list">${done.map(row).join('')}</div></section>` : ''}
      <p class="foot-note">Interest is flat: the rate is charged on the amount borrowed, each month, for the agreed months.</p>`;
  },
};

const actions = {
  loanMenu(d) {
    const s = S(), l = s.loans.find(x => x.id === d.id); if (!l) return;
    const c = Domain.loan(l), admin = Auth.isAdmin();
    const reps = (l.repayments || []).slice().reverse();
    Modal.open({ title: Domain.memberName(s, l.memberId), body: `
      <div class="kv"><span>Borrowed</span><b class="num">${esc(kes(l.principal))}</b></div>
      <div class="kv"><span>Interest</span><b>${esc(l.rate)}% a month for ${esc(l.months)} months</b></div>
      <div class="kv"><span>Total to repay</span><b class="num">${esc(kes(c.total))}</b></div>
      <div class="kv"><span>Repaid</span><b class="num">${esc(kes(c.paid))}</b></div>
      <div class="kv"><span>Balance</span><b class="num">${esc(kes(c.balance))}</b></div>
      <div class="kv"><span>About each month</span><b class="num">${esc(kes(c.installment))}</b></div>
      <div class="kv"><span>Issued</span><b>${esc(l.date)}</b></div>
      ${l.agreement ? `<div class="kv"><span>Terms agreed</span><b>${esc(new Date(l.agreement.at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }))}${sigImg(l.agreement.sig, 'Borrower signature on the terms')}</b></div>` : admin ? `<div class="notice">${icon('alert', 's')}<span>The borrower has not signed the terms yet. <button type="button" class="linkish" data-act="loanAgree" data-id="${esc(l.id)}">Read and sign now</button></span></div>` : ''}
      ${l.sig ? `<div class="kv"><span>Signature</span><b>${sigImg(l.sig, 'Borrower signature')}</b></div>` : ''}
      ${reps.length ? `<h3 style="font-size:.9em;margin:18px 0 4px">Repayments</h3>${reps.map(r => `<div class="kv"><span>${esc(r.date)}</span><b class="num">${esc(kes(r.amount))}</b></div>`).join('')}` : ''}
      ${admin ? `<div class="btns">${c.balance ? `<button type="button" class="btn pri grow" data-act="repay" data-id="${esc(l.id)}">Record repayment</button>` : ''}<button type="button" class="btn grow" data-act="signLoan" data-id="${esc(l.id)}">${icon('sign')}${l.sig ? 'Sign again' : 'Get signature'}</button><button type="button" class="btn grow" data-act="editLoan" data-id="${esc(l.id)}">${icon('pencil')}Edit</button></div>` : ''}` });
  },
  editLoan: { admin: true, run(d) {
    const s = S(), l = s.loans.find(x => x.id === d.id); if (!l) return;
    Modal.open({ title: 'Edit loan', fields: [
      { name: 'memberId', label: 'Member', type: 'select', options: memberOptions(s), value: l.memberId },
      { name: 'principal', label: 'Amount (KES)', type: 'number', value: l.principal },
      { name: 'rate', label: 'Interest (% per month, flat)', type: 'number', value: l.rate },
      { name: 'months', label: 'Repay over (months)', type: 'number', value: l.months }],
      onSubmit: v => { const principal = num(v.principal, 'Amount'), rate = num(v.rate, 'Rate', { allowZero: true }), months = Math.round(num(v.months, 'Months')); if (rate > 100) throw new Error('Interest above 100% a month is not allowed'); if (months > 120) throw new Error('Repay over 120 months or fewer'); Store.commit(st => Object.assign(st.loans.find(x => x.id === l.id), { memberId: v.memberId, principal, rate, months })); toast('Loan updated'); } });
  } },
  signLoan: { admin: true, run(d) {
    const l = S().loans.find(x => x.id === d.id); if (!l) return;
    Signature.open(`Signature of ${Domain.memberName(S(), l.memberId)}`, sig => Store.commit(st => { st.loans.find(x => x.id === l.id).sig = sig; }));
  } },
  addLoan: { admin: true, run() {
    const s = S(); if (!s.members.length) return toast('Add members first');
    Modal.open({ title: 'New loan', submitLabel: 'Issue loan', fields: [
      { name: 'memberId', label: 'Member', type: 'select', options: memberOptions(s) },
      { name: 'principal', label: 'Amount (KES)', type: 'number' },
      { name: 'rate', label: 'Interest (% per month, flat)', type: 'number', value: s.chama.loanRate },
      { name: 'months', label: 'Repay over (months)', type: 'number', value: 3 }],
      body: `${__M_src_ui_modal_js.cashMeter(Domain.cashOnHand(s), 0)}<div id="loanAdvice" class="advice" aria-live="polite"></div>`,
      onSubmit: v => {
        const principal = num(v.principal, 'Amount'), rate = num(v.rate, 'Rate', { allowZero: true }), months = Math.round(num(v.months, 'Months'));
        if (rate > 100) throw new Error('Interest above 100% a month is not allowed');
        if (months < 1 || months > 120) throw new Error('Repay over 1 to 120 months');
        if (principal > Domain.cashOnHand(S())) throw new Error('Not enough cash on hand for this loan');
        const id = uid();
        Store.commit(st => st.loans.push({ id, memberId: v.memberId, principal, rate, months, date: todayISO(), repayments: [] })); toast('Loan issued. Now the borrower reads and signs the terms.', 'ok');
        setTimeout(() => {
          const who = Domain.memberName(S(), v.memberId);
          __M_src_ui_toast_js.Pop.confirm({ title: 'How will ' + who.split(' ')[0] + ' sign?', text: 'Best: they read and sign on their own phone, and you are told when they do. Or hand them this phone now.', confirmLabel: 'Send to their phone', cancelLabel: 'Sign on this phone', onYes: () => actions.loanSend.run({ id }), onNo: () => loanTerms(S(), id, 'here') });
        }, 80);
      } });
  } },
  /* the borrower reads what they must bring back and when, ticks that they understand, then signs. Kept with the loan. */
  /* the borrower reads what they must bring back and when, ticks that they understand, then signs. Kept with the loan.
     On the treasurer's phone (hand it over) or, better, on the borrower's own phone (signLoanMine). */
  loanAgree: { admin: true, run(d) { loanTerms(S(), d.id, 'here'); } },
  loanSend: { admin: true, async run(d) {
    const B = __M_src_core_backend_js.Backend, { data, error } = await B.sb.rpc('request_loan_signature', { p_cid: Store.chamaId, p_loan: d.id });
    if (error) return toast(/Could not find the function|PGRST202|schema cache/i.test(error.message || '') ? 'Sending to their phone needs the latest server update. Sign on this phone for now.' : error.message);
    if (data && data.reason === 'no_account') return __M_src_ui_toast_js.Pop.confirm({ title: 'They are not in the app yet', text: 'This member has no sign-in linked, so the terms cannot reach their phone. Sign on this phone instead?', confirmLabel: 'Sign here', onYes: () => loanTerms(S(), d.id, 'here') });
    __M_src_ui_toast_js.Pop.alert('They get a message to read the terms and sign on their own phone. You are told when they sign, and the signed terms are kept with the loan.', { title: 'Sent for signing', label: 'OK', calm: true });
  } },
  signLoanMine: d => loanTerms(S(), d.id, 'mine'),
  repay: { admin: true, run(d) {
    const l = S().loans.find(x => x.id === d.id); if (!l) return; const c = Domain.loan(l);
    Modal.open({ title: 'Record repayment', submitLabel: 'Save repayment', fields: [{ name: 'amount', label: `Amount (balance ${kes(c.balance)})`, type: 'number', value: Math.round(Math.min(c.installment, c.balance)), placeholder: 'e.g. ' + kes(Math.round(Math.min(c.installment, c.balance))) }],
      onSubmit: v => { const amount = num(v.amount, 'Amount'); if (amount > c.balance + 0.5) throw new Error('That is more than the balance of ' + kes(c.balance)); Store.commit(st => st.loans.find(x => x.id === l.id).repayments.push({ amount, date: todayISO() })); toast('Repayment saved'); } });
  } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/members/form.js ---- */
const __M_src_features_members_form_js = (function () {
const { Store } = __M_src_core_store_js;
const { monthKey, uid, esc } = __M_src_core_utils_js;
const { Modal } = __M_src_ui_modal_js;

/* a small square photo for the member list: it is stored in the Chama's shared record, so it is kept under ~25 KB */
const smallPhoto = file => new Promise((ok, no) => {
  const img = new Image(), u = URL.createObjectURL(file);
  img.onload = () => {
    URL.revokeObjectURL(u);
    const n = Math.min(img.width, img.height); if (!n) return no(new Error('That picture is empty'));
    const c = document.createElement('canvas'); c.width = c.height = 160;
    c.getContext('2d').drawImage(img, (img.width - n) / 2, (img.height - n) / 2, n, n, 0, 0, 160, 160);
    let q = 0.8, url = c.toDataURL('image/jpeg', q); while (url.length > 25000 && q > 0.4) { q -= 0.1; url = c.toDataURL('image/jpeg', q); }
    ok(url);
  };
  img.onerror = () => { URL.revokeObjectURL(u); no(new Error('That file is not a picture. Try a JPG or PNG.')); };
  img.src = u;
});
const okPhoto = v => typeof v === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v);

function memberForm(m) {
  const pic = m && okPhoto(m.photo) ? m.photo : '';
  const ini = n => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '+';
  Modal.open({ title: m ? 'Edit member' : 'Add member', submitLabel: m ? 'Save' : 'Add member', fields: [
    { name: 'name', label: 'Full name', value: m?.name, required: true, placeholder: 'e.g. Achieng Atieno' },
    { name: 'phone', label: 'Phone number', type: 'tel', value: m?.phone, placeholder: '0712 345 678', help: 'Used for WhatsApp and SMS reminders and to match M-Pesa payments.' },
    { name: 'role', label: 'Title in the group (optional)', value: m?.role, placeholder: 'Chair, Patron, Organiser' },
    { name: 'shares', label: 'Shares (2 pays double)', type: 'number', value: m?.shares || 1 }],
    body: `<div class="mf-photo"><span class="mf-av" id="mfAv">${pic ? `<img src="${pic}" alt="">` : `<b>${esc(ini(m && m.name))}</b>`}</span><div><b>Profile photo</b><small>Optional. Helps everyone recognise them.</small><div class="mf-btns"><label class="btn sm tint">${icon('camera', 's')}${pic ? 'Change' : 'Add photo'}<input type="file" accept="image/*" id="mfFile" hidden></label>${pic ? '<button type="button" class="btn sm ghost" id="mfDel">Remove</button>' : ''}</div></div><input type="hidden" name="photo" id="mfPhoto" value="${pic ? 'keep' : ''}"></div>`
      + (m ? `<p class="plain">Changes are kept in History.</p><div class="btns" style="margin-top:6px"><button type="button" class="btn bad sm" data-act="delMember" data-id="${esc(m.id)}">Remove this member</button></div>` : '<p class="plain">Members are the people whose money the chama records. To let someone sign in, invite them from People and access.</p>'),
    onSubmit: v => {
      const phone = String(v.phone || '').replace(/[\s-]/g, '');
      const d = { name: String(v.name || '').trim().replace(/\s+/g, ' '), phone, role: String(v.role || '').trim(), shares: Math.max(1, Math.round(Number(v.shares) || 1)) };
      if (!d.name) throw new Error('Type the member’s name');
      if (d.name.length > 80) throw new Error('Keep the name to 80 characters or fewer');
      if (phone && !/^(\+?254|0)[17]\d{8}$/.test(phone)) throw new Error('Phone number should look like 0712345678');
      if (d.shares > 20) throw new Error('Use 20 shares or fewer');
      const ph = v.photo === 'keep' ? pic : okPhoto(v.photo) ? v.photo : '';
      Store.commit(s => {
        if (m) { const x = s.members.find(y => y.id === m.id); Object.assign(x, d); if (ph) x.photo = ph; else delete x.photo; }
        else s.members.push({ id: uid(), ...d, ...(ph ? { photo: ph } : {}), joined: monthKey(new Date()) });
      });
    } });
  const f = document.getElementById('mfFile'), hid = document.getElementById('mfPhoto'), box = document.getElementById('mfAv');
  if (f) f.addEventListener('change', async () => { if (!f.files[0]) return; try { const url = await smallPhoto(f.files[0]); hid.value = url; box.innerHTML = `<img src="${url}" alt="">`; } catch (e) { __M_src_ui_toast_js.toast(e.message); } });
  const del = document.getElementById('mfDel'); if (del) del.addEventListener('click', () => { hid.value = ''; box.innerHTML = '<b>+</b>'; del.remove(); });
}

return { get memberForm() { return memberForm; }, };
})();

/* ---- src/lib/reports.js ---- */
const __M_src_lib_reports_js = (function () {
const { Domain } = __M_src_core_domain_js;
const { kes, monthLabel, sum } = __M_src_core_utils_js;

const Reports = {
  summary(s) {
    const late = Domain.lateMembers(s);
    return [`${s.chama.name}: ${monthLabel(Domain.now())} update`, `Cash on hand: ${kes(Domain.cashOnHand(s))}`, `Loans out: ${kes(s.shared ? s.shared.loansBalance : sum(s.loans, l => Domain.loan(l).balance))}`, s.shared ? '' : (late.length ? `Still to pay: ${late.map(m => m.name.split(' ')[0]).join(', ')}` : 'Everyone is paid up')].filter(Boolean).join('\n');
  },
  statement(s, m) {
    const rows = s.payments.filter(p => p.memberId === m.id).sort((a, b) => a.month.localeCompare(b.month));
    return [`${s.chama.name}: statement for ${m.name}`, `Total saved: ${kes(Domain.memberSaved(s, m.id))}`, `Loan balance: ${kes(Domain.memberLoanBalance(s, m.id))}`, `Unpaid fines: ${kes(Domain.memberFinesDue(s, m.id))}`, ...rows.slice(-6).map(p => `${monthLabel(p.month)}: ${kes(p.amount)}`)].join('\n');
  },
  /* spreadsheet cells that start with = + - @ are treated as text, so a name can never run as a formula */
  cell(v) { let t = String(v ?? ''); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return '"' + t.replace(/"/g, '""') + '"'; },
  download(name, text, type) {
    const safe = String(name).replace(/[^\w .()-]+/g, '-').slice(0, 80);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = safe;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
};

/* ---- PDF documents: a branded, readable page in the app's colours, saved with the phone's "Save as PDF" ---- */
const Doc = {
  e: v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  /* the accent the person chose, in its print-safe shade (the dark-mode shades are too light for paper) */
  brand() { const a = document.documentElement.dataset.accent || 'green'; return { c: ({ green: '#0b6b4d', blue: '#1f5fae', purple: '#5b34b8', gold: '#8f6213', rose: '#b0284f', teal: '#0b6f78' })[a] || '#0b6b4d' }; },
  table(head, rows, opts = {}) {
    if (!rows.length) return `<p class="none">${Doc.e(opts.empty || 'Nothing recorded.')}</p>`;
    return `<table><thead><tr>${head.map((h, i) => `<th${opts.num && opts.num.includes(i) ? ' class="n"' : ''}>${Doc.e(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${opts.num && opts.num.includes(i) ? ' class="n"' : ''}>${c && c.html ? c.html : Doc.e(c)}</td>`).join('')}</tr>`).join('')}</tbody>${opts.foot ? `<tfoot><tr>${opts.foot.map((c, i) => `<td${opts.num && opts.num.includes(i) ? ' class="n"' : ''}>${Doc.e(c)}</td>`).join('')}</tr></tfoot>` : ''}</table>`;
  },
  html(title, sub, chamaName, body, photo) {
    const { c } = this.brand(), when = new Date().toLocaleString('en-KE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${Doc.e(title)}</title><style>
@page { size: A4; margin: 16mm 14mm 18mm; }
* { box-sizing: border-box; } body { margin: 0; font: 10.5pt/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #12231f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid ${c}; padding-bottom: 10px; margin-bottom: 18px; }
.brand { display: flex; align-items: center; gap: 10px; } .mark { width: 34px; height: 34px; border-radius: 10px; background: ${c}; color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 13pt; }
.brand b { font-size: 13pt; } .brand small, .meta { color: #5c6a64; font-size: 8.5pt; display: block; } .meta { text-align: right; }
h1 { font-size: 19pt; margin: 0 0 2px; letter-spacing: -.01em; } .sub { color: #5c6a64; margin: 0 0 16px; }
h2 { font-size: 12pt; color: ${c}; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e3e7e4; break-after: avoid; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; } .card { border: 1px solid #e3e7e4; border-radius: 10px; padding: 9px 10px; break-inside: avoid; }
.card span { display: block; font-size: 8pt; color: #5c6a64; text-transform: uppercase; letter-spacing: .04em; } .card b { font-size: 13pt; }
.card.hl { background: ${c}; border-color: ${c}; color: #fff; } .card.hl span { color: rgba(255,255,255,.8); }
table { width: 100%; border-collapse: collapse; font-size: 9.5pt; } th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .04em; color: #5c6a64; border-bottom: 1.5px solid #cfd6d2; padding: 6px 6px; }
td { padding: 6px; border-bottom: 1px solid #edf0ee; vertical-align: top; } tr { break-inside: avoid; } .n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
tfoot td { font-weight: 700; border-top: 1.5px solid #cfd6d2; border-bottom: 0; } .none { color: #5c6a64; font-style: italic; }
.tag { display: inline-block; padding: 1px 7px; border-radius: 99px; font-size: 8pt; font-weight: 700; } .ok { background: #e1f3e8; color: #17824f; } .late { background: #fbe6e3; color: #b42318; } .part { background: #fbf0dc; color: #8f5a0b; } .ahead { background: #ece6fa; color: #5b34b8; } .gold { background: #fbf1d0; color: #7a5410; }
.note { margin-top: 22px; padding: 10px 12px; border-radius: 10px; background: #f3f5f4; color: #3b4a44; font-size: 9pt; }
.foot { margin-top: 26px; color: #8a958f; font-size: 8pt; border-top: 1px solid #e3e7e4; padding-top: 8px; display: flex; justify-content: space-between; }
</style></head><body><div class="top"><div class="brand"><span class="mark">${/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo || '') ? `<img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px">` : Doc.e(String(chamaName || 'C').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase())}</span><div><b>${Doc.e(chamaName)}</b><small>My Chama</small></div></div><div class="meta">Prepared ${Doc.e(when)}</div></div>
<h1>${Doc.e(title)}</h1><p class="sub">${Doc.e(sub)}</p>${body}
<div class="foot"><span>Figures come from the records in My Chama at the time shown above.</span><span>${Doc.e(chamaName)}</span></div></body></html>`;
  },
  /* print a document through a hidden frame: phones offer "Save as PDF", computers a PDF printer */
  print(html, name) {
    const f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(f);
    const d = f.contentDocument; d.open(); d.write(html); d.close();
    const go = () => { try { f.contentWindow.document.title = name || 'My Chama'; f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); w.print(); } } setTimeout(() => f.remove(), 60000); };
    setTimeout(go, 250);
  },
  memberStatement(s, m) {
    const cur = Domain.now(), U = __M_src_core_utils_js, pays = s.payments.filter(p => p.memberId === m.id).sort((a, b) => a.month.localeCompare(b.month) || String(a.date).localeCompare(String(b.date)));
    const loans = s.loans.filter(l => l.memberId === m.id), fines = s.fines.filter(f => f.memberId === m.id), outs = s.payouts.filter(p => p.memberId === m.id);
    const owe = Domain.outstanding(s, m.id, cur), ahead = Domain.ahead(s, m.id, cur), st = Domain.tone(s, m.id, cur);
    const stTag = { late: ['late', 'Late'], part: ['part', 'Part paid'], due: ['part', 'Due'], paid: ['ok', 'Paid up'], ahead: ['ahead', 'Paid ahead'], gold: ['gold', 'Gold standing'], idle: ['ok', 'Nothing due'] }[st] || ['ok', ''];
    const months = []; { let k = Domain.joinMonth(s, m.id); for (let i = 0; i < 36 && k <= cur; i++, k = U.addMonths(k, 1)) months.push(k); }
    const body = `<div class="cards"><div class="card hl"><span>Total saved</span><b>${Doc.e(kes(Domain.memberSaved(s, m.id)))}</b></div><div class="card"><span>${owe ? 'Owing now' : 'Paid ahead'}</span><b>${Doc.e(kes(owe || ahead))}</b></div><div class="card"><span>Loan balance</span><b>${Doc.e(kes(Domain.memberLoanBalance(s, m.id)))}</b></div><div class="card"><span>Unpaid fines</span><b>${Doc.e(kes(Domain.memberFinesDue(s, m.id)))}</b></div></div>
<h2>Month by month</h2>${Doc.table(['Month', 'Due', 'Paid', 'Status'], months.slice(-24).map(k => { const t = Domain.status(s, m.id, k), map = { paid: ['ok', 'Paid'], late: ['late', 'Not paid'], partial: ['part', 'Part paid'], due: ['part', 'Due'], na: ['ok', '—'], future: ['ok', '—'] }[t]; return [monthLabel(k), kes(Domain.dueFor(s, m.id, k)), kes(Domain.paidIn(s, m.id, k)), { html: `<span class="tag ${map[0]}">${map[1]}</span>` }]; }), { num: [1, 2] })}
<h2>Payments</h2>${Doc.table(['Date', 'For month', 'M-Pesa code', 'Amount'], pays.map(p => [p.date || '', monthLabel(p.month), p.code || '—', kes(p.amount)]), { num: [3], foot: pays.length ? ['', '', 'Total', kes(sum(pays, p => p.amount))] : null })}
<h2>Loans</h2>${Doc.table(['Issued', 'Borrowed', 'Interest', 'To repay', 'Repaid', 'Balance'], loans.map(l => { const c = Domain.loan(l); return [l.date || '', kes(l.principal), l.rate + '% × ' + l.months + ' mo', kes(c.total), kes(c.paid), kes(c.balance)]; }), { num: [1, 3, 4, 5], empty: 'No loans.' })}
<h2>Fines</h2>${Doc.table(['Date', 'Reason', 'Amount', 'Status'], fines.map(f => [f.date || '', f.reason || '', kes(f.amount), { html: `<span class="tag ${f.paid ? 'ok' : 'late'}">${f.paid ? 'Paid' : 'Unpaid'}</span>` }]), { num: [2], empty: 'No fines.' })}
${outs.length ? `<h2>Payouts received</h2>${Doc.table(['Month', 'Date', 'Amount'], outs.map(p => [monthLabel(p.month), p.date || '', kes(p.amount)]), { num: [2] })}` : ''}
<div class="note">Status for ${Doc.e(monthLabel(cur))}: <span class="tag ${stTag[0]}">${Doc.e(stTag[1])}</span>. Contributions are due by day ${Doc.e(s.chama.dueDay)} of each month${s.chama.payTo ? ', paid to ' + Doc.e(s.chama.payTo) : ''}. If anything here looks wrong, tell the treasurer: every change is kept in the Chama's history.</div>`;
    return this.html('Statement for ' + m.name, (m.shares || 1) > 1 ? m.shares + ' shares · joined ' + monthLabel(Domain.joinMonth(s, m.id)) : 'Joined ' + monthLabel(Domain.joinMonth(s, m.id)), s.chama.name, body, s.chama.photo);
  },
  chamaReport(s) {
    const cur = Domain.now(), U = __M_src_core_utils_js, active = s.members.filter(m => !m.left);
    const months = Array.from({ length: 12 }, (_, i) => U.addMonths(cur, i - 11)).filter(k => k >= (s.chama.startMonth || '0000'));
    const inn = sum(s.payments, p => p.amount), loansOut = sum(s.loans, l => Domain.loan(l).balance);
    const body = `<div class="cards"><div class="card hl"><span>Cash on hand</span><b>${Doc.e(kes(Domain.cashOnHand(s)))}</b></div><div class="card"><span>All contributions</span><b>${Doc.e(kes(inn))}</b></div><div class="card"><span>Loans out</span><b>${Doc.e(kes(loansOut))}</b></div><div class="card"><span>Members</span><b>${active.length}</b></div></div>
<h2>Collections by month</h2>${Doc.table(['Month', 'Expected', 'Collected', 'Share', 'Paid up'], months.map(k => { const exp = sum(s.members.filter(m => Domain.joinMonth(s, m.id) <= k), m => Domain.dueFor(s, m.id, k)), got = sum(s.payments.filter(p => p.month === k), p => p.amount), up = s.members.filter(m => !(m.left && k > m.left) && Domain.joinMonth(s, m.id) <= k && Domain.status(s, m.id, k) === 'paid').length; return [monthLabel(k), kes(exp), kes(got), exp ? Math.round(got / exp * 100) + '%' : '—', String(up)]; }), { num: [1, 2, 3, 4] })}
<h2>Members</h2>${Doc.table(['Member', 'Shares', 'Saved', 'Owing now', 'Loan balance', 'Status'], s.members.map(m => { const t = Domain.tone(s, m.id, cur), map = { late: ['late', 'Late'], part: ['part', 'Part paid'], due: ['part', 'Due'], paid: ['ok', 'Paid up'], ahead: ['ahead', 'Ahead'], gold: ['gold', 'Gold'], idle: ['ok', m.left ? 'Left' : '—'] }[t] || ['ok', '—']; return [m.name, String(m.shares || 1), kes(Domain.memberSaved(s, m.id)), kes(Domain.outstanding(s, m.id, cur)), kes(Domain.memberLoanBalance(s, m.id)), { html: `<span class="tag ${map[0]}">${map[1]}</span>` }]; }), { num: [1, 2, 3, 4], foot: ['Total', '', kes(inn), kes(sum(s.members, m => Domain.outstanding(s, m.id, cur))), kes(loansOut), ''] })}
<h2>Loans</h2>${Doc.table(['Member', 'Issued', 'Borrowed', 'To repay', 'Balance', 'Terms signed'], s.loans.map(l => { const c = Domain.loan(l); return [Domain.memberName(s, l.memberId), l.date || '', kes(l.principal), kes(c.total), kes(c.balance), l.agreement ? 'Yes' : 'No']; }), { num: [2, 3, 4], empty: 'No loans.' })}
<h2>Payouts</h2>${Doc.table(['Month', 'Member', 'Date', 'Amount', 'Signed'], s.payouts.slice().sort((a, b) => a.month.localeCompare(b.month)).map(p => [monthLabel(p.month), Domain.memberName(s, p.memberId), p.date || '', kes(p.amount), p.sig ? 'Yes' : 'No']), { num: [3], empty: 'No payouts yet.' })}
<h2>Expenses</h2>${Doc.table(['Date', 'For', 'Type', 'Amount'], s.expenses.map(x => [x.date || '', x.title || '', x.category || '', kes(x.amount)]), { num: [3], empty: 'No expenses.', foot: s.expenses.length ? ['', '', 'Total', kes(sum(s.expenses, x => x.amount))] : null })}
<h2>Fines</h2>${Doc.table(['Date', 'Member', 'Reason', 'Amount', 'Status'], s.fines.map(f => [f.date || '', Domain.memberName(s, f.memberId), f.reason || '', kes(f.amount), f.paid ? 'Paid' : 'Unpaid']), { num: [3], empty: 'No fines.' })}
<div class="note">Cash on hand = contributions + fines paid + loan repayments − loans given − payouts − expenses. This report contains members' personal data: share it only with the Chama's officials.</div>`;
    return this.html(s.chama.name + ' report', monthLabel(months[0] || cur) + ' to ' + monthLabel(cur) + ' · ' + (s.chama.mode === 'savings' ? 'Savings' : 'Merry-go-round') + ' · ' + kes(s.chama.monthly) + ' a share each month', s.chama.name, body, s.chama.photo);
  }
};

return { get Reports() { return Reports; }, get Doc() { return Doc; }, };
})();

/* ---- src/features/members/index.js ---- */
const __M_src_features_members_index_js = (function () {
const { adminBtn, Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, monthLabel, sum, waLink } = __M_src_core_utils_js;
const { memberForm } = __M_src_features_members_form_js;
const { Reports } = __M_src_lib_reports_js;
const { av } = __M_src_ui_avatar_js;
const { Modal, confirmBox } = __M_src_ui_modal_js;

/* Treasurer and secretary: join requests waiting, and people who can sign in but are not on the member list */
const joinedCard = s => {
  const Sess = __M_src_core_session_js.Session, RQ = __M_src_features_requests_js;
  if (s.shared && Sess.role === 'member') return '';
  let out = RQ.Requests.listHtml(true);
  if (Sess.role === 'treasurer') {
    const rows = (Sess.access || []).filter(a => a.status === 'active' && !a.member_id && a.role !== 'treasurer');
    if (rows.length) out += `<section class="sec"><div class="sec-h"><h2>Not on the member list</h2></div><div class="list">${rows.map(a => `<button type="button" class="li has-av" data-act="personOpen" data-e="${esc(a.email)}">${RQ.pav(a.email, null, 42)}<span class="li-main"><b>${esc(a.email)}</b><small>${esc(__M_src_core_session_js.Perm.label(a.role))} · can sign in, money not shown yet</small></span><span class="li-end"><span class="pill-act">Add</span></span></button>`).join('')}</div></section>`;
  }
  return out;
};
/* Phone masking stays off until the owner approves it (05, B2). false keeps the current full phone numbers. */
const CG_MASK_PHONES = false;
const maskPhone = p => (p ? '•••• ' + String(p).replace(/\D/g, '').slice(-3) : '');
const views = {
  members(s) {
    const admin = Auth.isAdmin(), meId = s.shared ? s.shared.me : null;
    const act = s.members.filter(m => !m.left), gone = s.members.filter(m => m.left);
    const head = `<h1 class="lt">Members</h1><p class="lt-sub">${act.length} ${act.length === 1 ? 'member' : 'members'}${s.chama.mode === 'savings' ? '' : ' · listed in payout order'}</p>`;
    const btn = admin ? `<button type="button" class="btn pri block lg" style="margin-top:0" data-act="addChooser">${icon('userPlus')}Add a member</button>` : '';
    if (!s.members.length) return head + btn + joinedCard(s) + `<div class="card" style="margin-top:14px">${s.shared ? emptyState('people', 'No member list yet', 'Your treasurer has not shared the member list yet.') : emptyState('people', 'No members yet', 'Add the people in your chama. Invite those with a phone to the app so they can see their own money.')}</div>`;
    const row = (m, i, left) => {
      const rel = s.shared ? null : Domain.reliability(s, m.id), mine = meId && m.id === meId;
      const sub = left ? 'Left in ' + monthLabel(m.left) + ' · saved ' + kes(Domain.memberSaved(s, m.id))
        : s.shared ? (mine ? 'You · saved ' + kes(Domain.memberSaved(s, m.id)) : s.chama.mode === 'savings' ? 'Member' : 'Turn ' + (i + 1))
        : `Saved ${kes(Domain.memberSaved(s, m.id))}${Domain.memberLoanBalance(s, m.id) ? ' · loan ' + kes(Domain.memberLoanBalance(s, m.id)) : ''}${rel != null ? ' · ' + rel + '% on time' : ''}`;
      const stk = s.shared || left ? 0 : __M_src_features_smart_js.Smart.streak(s, m.id);
      const tags = `${(m.shares || 1) > 1 ? ` <span class="tag">×${esc(m.shares)}</span>` : ''}${m.role && !s.shared ? ` <span class="tag brand">${esc(m.role)}</span>` : ''}${stk >= 3 ? ` <span class="streak sm" title="${stk} months paid on time in a row">${stk}</span>` : ''}`;
      const inner = `${av(m, 42)}<span class="li-main"><b>${esc(m.name)}${mine ? ' <span class="tag">You</span>' : ''}${tags}</b><small class="num">${esc(sub)}</small></span>`;
      return (admin || mine) ? `<button type="button" class="li has-av${left ? ' gone' : ''}" data-act="memberMenu" data-id="${esc(m.id)}">${inner}<span class="li-end">${icon('chev', 'chev')}</span></button>` : `<div class="li has-av${left ? ' gone' : ''}">${inner}</div>`;
    };
    return `${head}${btn}${joinedCard(s)}<section class="sec"><div class="sec-h"><h2>${s.chama.mode === 'savings' ? 'Everyone' : 'Payout order'}</h2></div><div class="list">${act.map((m, i) => row(m, i)).join('')}</div>
      <p class="foot-note">${s.shared ? 'You see other members’ names only. Their money stays private.' : 'Tap a member for their statement, phone and payout position.'}</p></section>
      ${gone.length ? `<section class="sec"><div class="sec-h"><h2>Left the Chama</h2></div><div class="list">${gone.map(m => row(m, 0, true)).join('')}</div><p class="foot-note">Their records stay in the books. They are not counted for new months. If they rejoin, they get the same entry back.</p></section>` : ''}`;
  }
};

const actions = {
  addChooser: { admin: true, run() {
    __M_src_features_requests_js.Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('userPlus')}</span><h3>Add a member</h3><p>Choose how this person will take part.</p></div>
<div class="choice-list">
<button type="button" class="choice" data-act="inviteSheet" data-v="code"><span class="ch-ic">${icon('key')}</span><span class="ch-t"><b>They will use the app</b><small>Recommended. Send them a code or an email link. They sign in, see their own savings and the group chat, and appear on the list once you let them in.</small></span>${icon('chev', 'chev')}</button>
<button type="button" class="choice" data-act="addNameOnly"><span class="ch-ic t-ink">${icon('profile')}</span><span class="ch-t"><b>Only add their name</b><small>For someone without a smartphone. You record their money for them. You can invite them to the app later and they keep the same entry.</small></span>${icon('chev', 'chev')}</button>
</div>`, { key: 'add', label: 'Add a member' });
  } },
  addNameOnly: { admin: true, run() { __M_src_features_requests_js.Sheet.close(); setTimeout(() => memberForm(), 260); } },
  addMember: { admin: true, run: () => memberForm() },
  editMember: { admin: true, run: d => memberForm(S().members.find(m => m.id === d.id)) },
  /* choose exactly where someone goes in the payout order; each place shows the month it pays out */
  moveMember: { admin: true, run(d) {
    const s = S(), from = s.members.findIndex(m => m.id === d.id); if (from < 0) return;
    const U = __M_src_core_utils_js, n = s.members.length, cur = Domain.now();
    const monthFor = i => { const off = ((U.monthDiff(s.chama.startMonth, cur) % n) + n) % n; let k = (i - off + n) % n; return U.addMonths(cur, k); };
    const who = s.members[from];
    const rows = s.members.map((m, i) => `<button type="button" class="mv-row${i === from ? ' on' : ''}" data-act="movePick" data-id="${esc(who.id)}" data-to="${i}" ${i === from ? 'disabled aria-current="true"' : ''}>
<span class="mv-n">${i + 1}</span><span class="mv-main"><b>${esc(U.monthLabel(monthFor(i)))}</b><small>${i === from ? 'Now: ' + esc(who.name) : 'Now: ' + esc(m.name) + (m.left ? ' · left' : '')}</small></span><span class="mv-go">${i === from ? 'Current' : 'Put here'}</span></button>`).join('');
    Modal.open({ title: 'Move ' + who.name.split(' ')[0] + ' in the payout order', body: `<p class="plain">Tap the turn ${esc(who.name.split(' ')[0])} should take. Everyone between moves one place. Recorded payouts never change.</p><div class="mv-list">${rows}</div>` });
  } },
  movePick: { admin: true, run(d) {
    const s = S(), from = s.members.findIndex(m => m.id === d.id), to = Number(d.to); if (from < 0 || isNaN(to) || to === from) return;
    const U = __M_src_core_utils_js, n = s.members.length, cur = Domain.now();
    const monthFor = i => { const off = ((U.monthDiff(s.chama.startMonth, cur) % n) + n) % n; return U.addMonths(cur, (i - off + n) % n); };
    const name = s.members[from].name, displaced = s.members[to].name;
    __M_src_ui_toast_js.Pop.confirm({ title: 'Move ' + name.split(' ')[0] + ' to turn ' + (to + 1) + '?', text: name + ' will receive in ' + U.monthLabel(monthFor(to)) + '. ' + displaced + ' moves ' + (to < from ? 'one place later' : 'one place earlier') + ', and so does everyone in between. Everyone sees the new order.', confirmLabel: 'Move',
      onYes: () => { Modal.close(); Store.commit(st => { const i = st.members.findIndex(m => m.id === d.id); if (i < 0) return; const [m] = st.members.splice(i, 1); st.members.splice(Math.min(to, st.members.length), 0, m); }); __M_src_ui_toast_js.toast(name.split(' ')[0] + ' now receives in ' + U.monthLabel(monthFor(to)), 'ok'); } });
  } },
  memberMenu(d) {
    const s = S(), m = s.members.find(x => x.id === d.id); if (!m) return;
    const admin = Auth.isAdmin(), i = s.members.indexOf(m);
    const rcv = sum(s.payouts.filter(p => p.memberId === m.id), p => p.amount), rel = s.shared ? null : Domain.reliability(s, m.id);
    const phone = m.phone ? (CG_MASK_PHONES ? maskPhone(m.phone) : m.phone) : '';
    Modal.open({ title: m.name, body: `
      <div style="display:flex;justify-content:center;margin:4px 0 14px">${av(m, 72)}</div>
      <div class="kv"><span>Saved</span><b class="num">${esc(kes(Domain.memberSaved(s, m.id)))}</b></div>
      <div class="kv"><span>Loan balance</span><b class="num">${esc(kes(Domain.memberLoanBalance(s, m.id)))}</b></div>
      <div class="kv"><span>Unpaid fines</span><b class="num">${esc(kes(Domain.memberFinesDue(s, m.id)))}</b></div>
      ${rcv ? `<div class="kv"><span>Received in payouts</span><b class="num">${esc(kes(rcv))}</b></div>` : ''}
      ${rel != null ? `<div class="kv"><span>On time (last 6 months)</span><b>${rel}%</b></div>` : ''}
      ${s.chama.mode === 'savings' ? '' : `<div class="kv"><span>Payout turn</span><b>${i + 1} of ${s.members.length}</b></div>`}
      ${m.joined ? `<div class="kv"><span>Joined</span><b>${esc(monthLabel(m.joined))}</b></div>` : ''}
      ${(() => { const SM = __M_src_features_smart_js.Smart; if (s.shared && !(s.shared.me === m.id)) return ''; const st = SM.streak(s, m.id), h = SM.heat(s, m.id), C = __M_src_features_chat_index_js.Chat, c = (C.contacts || []).find(x => x.member_id === m.id), uidm = c ? c.user_id : (m.id === __M_src_core_session_js.Session.memberId && __M_src_core_session_js.Session.user ? __M_src_core_session_js.Session.user.id : null), at = uidm ? SM.attendance(uidm) : null;
        return `<div class="heat" aria-label="Last 12 months">${h.map(x => `<i class="h-${x.st}" title="${esc(monthLabel(x.mk))}: ${x.st}"></i>`).join('')}</div><p class="heat-key"><span><i class="h-paid"></i>Paid</span><span><i class="h-partial"></i>Part</span><span><i class="h-late"></i>Late</span><span>${st} month streak</span></p>
        ${at ? `<div class="kv"><span>Meetings attended</span><b>${at.rate}% of ${at.n}</b></div>` : ''}${admin ? `<div class="kv"><span>Suggested loan limit</span><b class="num">${esc(kes(SM.loanLimit(s, m.id)))}</b></div>` : ''}`; })()}
      ${admin ? `<div class="kv"><span>Phone</span><b>${phone ? `<a href="tel:${esc(String(m.phone).replace(/[^\d+]/g, ''))}">${esc(phone)}</a>` : 'Not added'}</b></div>` : ''}
      <div class="btns">
        <button type="button" class="btn grow" data-act="statement" data-id="${esc(m.id)}">${icon('doc')}Statement</button>
        ${admin ? `${s.members.length > 1 && s.chama.mode !== 'savings' ? `<button type="button" class="btn grow" data-act="moveMember" data-id="${esc(m.id)}">${icon('swap')}Change payout turn</button>` : ''}<button type="button" class="btn grow" data-act="editMember" data-id="${esc(m.id)}">${icon('pencil')}Edit</button>` : ''}
      </div>` });
  },
  statement(d) {
    const s = S(), m = s.members.find(x => x.id === d.id); if (!m) return;
    const rows = s.payments.filter(p => p.memberId === m.id).sort((a, b) => b.month.localeCompare(a.month));
    Modal.open({ title: 'Statement', body: `<p class="plain" style="text-align:center;margin-bottom:6px"><b>${esc(m.name)}</b></p>
      <div class="stats" style="margin:8px 0 14px"><div><span>Saved</span><b>${esc(kes(Domain.memberSaved(s, m.id)))}</b></div><div><span>Loan</span><b>${esc(kes(Domain.memberLoanBalance(s, m.id)))}</b></div><div><span>Fines</span><b>${esc(kes(Domain.memberFinesDue(s, m.id)))}</b></div></div>
      ${rows.slice(0, 12).map(p => `<div class="kv"><span>${esc(monthLabel(p.month))}${p.code ? ' · ' + esc(p.code) : ''}</span><b class="num">${esc(kes(p.amount))}</b></div>`).join('') || '<p class="plain">No payments yet.</p>'}
      <div class="btns">${m.phone && !s.shared ? `<a class="btn pri grow" target="_blank" rel="noopener noreferrer" href="${esc(waLink(m.phone, Reports.statement(s, m)))}">${icon('chat')}WhatsApp</a>` : ''}<button type="button" class="btn grow" data-act="${s.shared ? 'pdfMine' : 'pdfMember'}" data-id="${esc(m.id)}">${icon('doc')}PDF</button></div>` });
  },
  delMember: { admin: true, run: d => { if (Domain.memberLoanBalance(S(), d.id) > 0 || Domain.memberFinesDue(S(), d.id) > 0) throw new Error('Settle their loan and fines before removing them'); Modal.close(); confirmBox('Remove this member? Their past payments stay in the records.', () => Store.commit(s => { s.members = s.members.filter(m => m.id !== d.id); })); } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/history/index.js ---- */
const __M_src_features_history_index_js = (function () {
const { esc } = __M_src_core_utils_js;

const views = {
  history(s) {
    const L = s.log || [], tag = k => k === 'del' ? ['bad', 'Removed'] : k === 'edit' ? ['warn', 'Edited'] : ['ok', 'Added'];
    const head = `<h1 class="lt">History</h1><p class="lt-sub">${s.shared ? 'A record of every change' : L.length + ' changes · visible to the treasurer'}</p>`;
    if (s.shared) return head + `<div class="card">${emptyState('ledger', 'Kept by the treasurer', 'The full history of changes is visible to the treasurer. Your own payments and notices are on your profile.')}</div>`;
    if (!L.length) return head + `<div class="card">${emptyState('ledger', 'No changes yet', 'Every payment, loan, fine and setting change will be listed here with what changed and when.')}</div>`;
    return head + `<div class="list">${L.map(e => `<div class="li" style="align-items:flex-start"><div class="li-main"><b style="white-space:normal">${esc(e.text)}</b>${(e.diff || []).map(x => `<small class="num">${esc(x)}</small>`).join('')}<small>${esc(new Date(e.ts).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }))} · ${esc(e.by)}</small></div><div class="li-end"><span class="tag ${tag(e.kind)[0]}">${tag(e.kind)[1]}</span></div></div>`).join('')}</div>`;
  },
};

return { get views() { return views; }, };
})();

/* ---- src/features/fines/index.js ---- */
const __M_src_features_fines_index_js = (function () {
const { adminBtn, Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, todayISO, uid, sum } = __M_src_core_utils_js;
const { num } = __M_src_lib_validate_js;
const { memberChip, av } = __M_src_ui_avatar_js;
const { memberOptions } = __M_src_ui_forms_js;
const { Modal, confirmBox } = __M_src_ui_modal_js;
const { toast } = __M_src_ui_toast_js;

const views = {
  fines(s) {
    const admin = Auth.isAdmin();
    const head = `<h1 class="lt">Fines</h1><p class="lt-sub">${s.shared ? 'Your fines' : 'Late fee ' + esc(kes(s.chama.finePerLate)) + ' · set in Chama settings'}</p>`;
    const btn = admin ? `<div class="btns" style="margin-top:0"><button class="btn pri grow" data-act="addFine">${icon('plus')}Add fine</button><button class="btn tint grow" data-act="autoFines">${icon('clock')}Fine late members</button></div>` : '';
    if (!s.fines.length) return head + btn + `<div class="card" style="margin-top:14px">${emptyState('done', 'No fines', s.shared ? 'You have no fines. Keep it up.' : 'Fines for late payments or missed meetings will be listed here.')}</div>`;
    const unpaid = s.fines.filter(f => !f.paid), paid = s.fines.filter(f => f.paid);
    const row = f => { const m = s.members.find(x => x.id === f.memberId); const inner = `${av(m || { name: 'Removed member' }, 40)}<span class="li-main"><b>${esc(m ? m.name : 'Removed member')}</b><small>${esc(f.reason)} · ${esc(f.date)}</small></span><span class="li-end"><span><span class="num">${esc(kes(f.amount))}</span><small>${f.paid ? 'paid' : 'unpaid'}</small></span>${admin ? icon('chev', 'chev') : ''}</span>`;
      return admin ? `<button type="button" class="li has-av" data-act="fineMenu" data-id="${esc(f.id)}">${inner}</button>` : `<div class="li has-av">${inner}</div>`; };
    return `${head}${btn}<div class="stats two"><div><span>Unpaid</span><b>${esc(kes(sum(unpaid, f => f.amount)))}</b></div><div><span>Collected</span><b>${esc(kes(sum(paid, f => f.amount)))}</b></div></div>
      ${unpaid.length ? `<section class="sec"><div class="sec-h"><h2>Unpaid</h2></div><div class="list">${[...unpaid].reverse().map(row).join('')}</div></section>` : ''}
      ${paid.length ? `<section class="sec"><div class="sec-h"><h2>Paid</h2></div><div class="list">${[...paid].reverse().map(row).join('')}</div></section>` : ''}`;
  },
};

const actions = {
  fineMenu: { admin: true, run(d) {
    const s = S(), f = s.fines.find(x => x.id === d.id); if (!f) return;
    Modal.open({ title: 'Fine', body: `<div class="kv"><span>Member</span><b>${esc(Domain.memberName(s, f.memberId))}</b></div><div class="kv"><span>Amount</span><b class="num">${esc(kes(f.amount))}</b></div><div class="kv"><span>Reason</span><b>${esc(f.reason)}</b></div><div class="kv"><span>Date</span><b>${esc(f.date)}</b></div><div class="kv"><span>Status</span><b>${f.paid ? 'Paid' : 'Unpaid'}</b></div>
      <div class="btns">${f.paid ? '' : `<button type="button" class="btn pri grow" data-act="payFine" data-id="${esc(f.id)}">${icon('check')}Mark paid</button>`}<button type="button" class="btn grow" data-act="editFine" data-id="${esc(f.id)}">${icon('pencil')}Edit</button><button type="button" class="btn bad grow" data-act="delFine" data-id="${esc(f.id)}">${icon('trash')}Remove</button></div>` });
  } },
  editFine: { admin: true, run(d) {
    const s = S(), f = s.fines.find(x => x.id === d.id); if (!f) return;
    Modal.open({ title: 'Edit fine', fields: [
      { name: 'memberId', label: 'Member', type: 'select', options: memberOptions(s), value: f.memberId },
      { name: 'amount', label: 'Amount (KES)', type: 'number', value: f.amount },
      { name: 'reason', label: 'Reason', value: f.reason, required: true }],
      onSubmit: v => { const amount = num(v.amount, 'Amount'); const reason = String(v.reason || '').trim(); if (!reason) throw new Error('Give a reason'); Store.commit(st => Object.assign(st.fines.find(x => x.id === f.id), { memberId: v.memberId, amount, reason })); toast('Fine updated'); } });
  } },
  addFine: { admin: true, run() {
    const s = S(); if (!s.members.length) return toast('Add members first');
    /* members who still owe come first, so the usual case is one tap */
    const cur = Domain.now(), owing = Domain.active(s).map(m => ({ m, bal: Domain.outstanding(s, m.id, cur) })).filter(x => x.bal > 0).sort((a, b) => b.bal - a.bal);
    const rest = s.members.filter(m => !owing.some(x => x.m.id === m.id));
    const opts = [...owing.map(x => [x.m.id, `${x.m.name} · ${kes(x.bal)} behind`]), ...rest.map(m => [m.id, m.name + (m.left ? ' · left' : ' · paid up')])];
    Modal.open({ title: 'Add fine', submitLabel: 'Add fine', body: owing.length ? `<p class="fhelp">${owing.length} ${owing.length === 1 ? 'member owes' : 'members owe'} for ${esc(__M_src_core_utils_js.monthLabel(cur))}. They are listed first.</p>` : `<p class="fhelp">Everyone is paid up for ${esc(__M_src_core_utils_js.monthLabel(cur))}.</p>`, fields: [
      { name: 'memberId', label: 'Member', type: 'select', options: opts, value: owing.length ? owing[0].m.id : (opts[0] || [])[0] },
      { name: 'amount', label: 'Amount (KES)', type: 'number', value: s.chama.finePerLate || '', placeholder: 'e.g. ' + kes(s.chama.finePerLate) },
      { name: 'reason', label: 'Reason', placeholder: 'e.g. Missed meeting', required: true }],
      onSubmit: v => { const reason = String(v.reason || '').trim(); if (!reason) throw new Error('Give a reason'); const amount = num(v.amount, 'Amount'); Store.commit(st => st.fines.push({ id: uid(), memberId: v.memberId, amount, reason, date: todayISO(), paid: false })); toast('Fine added'); } });
  } },
  autoFines: { admin: true, run() {
    const s = S(), cur = Domain.now(), reason = 'Late contribution ' + cur, late = Domain.lateMembers(s, cur).filter(m => !s.fines.some(f => f.memberId === m.id && (f.period === cur || (!f.period && f.reason === reason))));
    if (!s.chama.finePerLate) return toast('Set a late fine in Chama settings first');
    if (!late.length) return toast('No new late members to fine');
    confirmBox(`Fine ${late.length} late ${late.length === 1 ? 'member' : 'members'} ${kes(s.chama.finePerLate)} each? ${late.map(m => m.name).join(', ')}.`, () => Store.commit(st => late.forEach(m => st.fines.push({ id: uid(), memberId: m.id, amount: st.chama.finePerLate, reason, period: cur, date: todayISO(), paid: false }))));
  } },
  payFine: { admin: true, run: d => { Modal.close(); Store.commit(s => { const f = s.fines.find(x => x.id === d.id); if (f) f.paid = true; }); toast('Fine marked paid'); } },
  delFine: { admin: true, run: d => { Modal.close(); confirmBox('Remove this fine?', () => Store.commit(s => { s.fines = s.fines.filter(f => f.id !== d.id); })); } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/expenses/form.js ---- */
const __M_src_features_expenses_form_js = (function () {
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { todayISO, uid, esc } = __M_src_core_utils_js;
const { num } = __M_src_lib_validate_js;
const { Modal } = __M_src_ui_modal_js;

function expenseForm(e) {
  Modal.open({ title: e ? 'Edit expense' : 'Add expense', submitLabel: e ? 'Save' : 'Add expense', fields: [
    { name: 'title', label: 'What was it for?', value: e?.title, required: true, placeholder: 'e.g. Meeting venue' },
    { name: 'category', label: 'Type', type: 'select', value: e?.category || 'Meeting', options: ['Meeting', 'Welfare', 'Investment', 'Admin', 'Other'].map(x => [x, x]) },
    { name: 'amount', label: 'Amount (KES)', type: 'number', value: e?.amount }],
    body: __M_src_ui_modal_js.cashMeter(Domain.cashOnHand(S()) + (e ? Number(e.amount) || 0 : 0), e ? e.amount : 0) + (e ? `<div class="btns" style="margin-top:0"><button type="button" class="btn bad sm" data-act="delExpense" data-id="${esc(e.id)}">Remove this expense</button></div>` : ''),
    onSubmit: v => {
      const d = { title: String(v.title || '').trim(), category: v.category, amount: num(v.amount, 'Amount') };
      if (!d.title) throw new Error('Say what the money was for');
      if (d.amount > Domain.cashOnHand(S()) + (e ? Number(e.amount) || 0 : 0)) throw new Error('That is more than the cash on hand');
      Store.commit(s => e ? Object.assign(s.expenses.find(x => x.id === e.id), d) : s.expenses.push({ id: uid(), ...d, date: todayISO() }));
    } });
}

return { get expenseForm() { return expenseForm; }, };
})();

/* ---- src/features/expenses/index.js ---- */
const __M_src_features_expenses_index_js = (function () {
const { adminBtn, Auth } = __M_src_core_auth_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, sum } = __M_src_core_utils_js;
const { expenseForm } = __M_src_features_expenses_form_js;
const { confirmBox, Modal } = __M_src_ui_modal_js;

const views = {
  expenses(s) {
    const admin = Auth.isAdmin();
    const head = `<h1 class="lt">Expenses</h1><p class="lt-sub">Money the chama has spent</p>`;
    const btn = admin ? `<div class="btns" style="margin-top:0"><button class="btn pri" data-act="addExpense">${icon('plus')}Add expense</button></div>` : '';
    if (!s.expenses.length) return head + btn + `<div class="card" style="margin-top:14px">${emptyState('receipt', 'Nothing spent yet', 'Meeting costs, welfare and investments will be listed here.')}</div>`;
    const cats = {}; s.expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + (Number(e.amount) || 0); });
    return `${head}${btn}<div class="card" style="margin-top:4px"><span class="mute small">Total spent</span><div class="num" style="font:700 1.6em/1.2 var(--font-display);margin-top:2px">${esc(kes(sum(s.expenses, e => e.amount)))}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${Object.entries(cats).map(([k, v]) => `<span class="tag">${esc(k)} · ${esc(kes(v))}</span>`).join('')}</div></div>
      <section class="sec"><div class="list">${[...s.expenses].reverse().map(e => { const inner = `<span class="li-ic t-gold">${icon('receipt')}</span><span class="li-main"><b>${esc(e.title)}</b><small>${esc(e.category)} · ${esc(e.date)}</small></span><span class="li-end"><span class="num">${esc(kes(e.amount))}</span>${admin ? icon('chev', 'chev') : ''}</span>`;
        return admin ? `<button type="button" class="li has-ic" data-act="editExpense" data-id="${esc(e.id)}">${inner}</button>` : `<div class="li has-ic">${inner}</div>`; }).join('')}</div></section>`;
  },
};

const actions = {
  addExpense: { admin: true, run: () => expenseForm() },
  editExpense: { admin: true, run: d => expenseForm(S().expenses.find(e => e.id === d.id)) },
  delExpense: { admin: true, run: d => { Modal.close(); confirmBox('Remove this expense?', () => Store.commit(s => { s.expenses = s.expenses.filter(e => e.id !== d.id); })); } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/reports/index.js ---- */
const __M_src_features_reports_index_js = (function () {
const { adminBtn, Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { S } = __M_src_core_state_js;
const { Reports } = __M_src_lib_reports_js;
const { esc } = __M_src_core_utils_js;

const views = {
  reports(s) {
    const admin = Auth.isAdmin();
    return `<h1 class="lt">Reports and backup</h1><p class="lt-sub">Share a summary, or keep a copy of the records</p>
      <div class="list">
        <a class="li has-ic" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent(Reports.summary(s))}"><span class="li-ic">${icon('chat')}</span><span class="li-main"><b>Share a summary on WhatsApp</b><small>Cash, loans${s.shared ? '' : ' and who is behind'}, as one message for your group</small></span>${icon('chev', 'chev')}</a>
        ${admin ? `<button type="button" class="li has-ic" data-act="exportCsv"><span class="li-ic t-info">${icon('download')}</span><span class="li-main"><b>Payments spreadsheet</b><small>Every payment as a CSV file for Excel or Sheets</small></span>${icon('chev', 'chev')}</button>
        <button type="button" class="li has-ic" data-act="exportJson"><span class="li-ic t-gold">${icon('download')}</span><span class="li-main"><b>Full backup</b><small>Everything in this Chama, as one file. Keep it somewhere safe and private</small></span>${icon('chev', 'chev')}</button>` : ''}
        ${(s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId) ? `<button type="button" class="li has-ic" data-act="pdfMine"><span class="li-ic t-bad">${icon('doc')}</span><span class="li-main"><b>My statement (PDF)</b><small>Your contributions, loans and fines, ready to save or print</small></span>${icon('chev', 'chev')}</button>` : ''}
        ${admin ? `<button type="button" class="li has-ic" data-act="pdfChama"><span class="li-ic t-bad">${icon('doc')}</span><span class="li-main"><b>Chama report (PDF)</b><small>Collections, members, loans, payouts, expenses and fines, in the app’s colours</small></span>${icon('chev', 'chev')}</button>` : ''}
        <a class="li has-ic" href="#/members"><span class="li-ic t-ink">${icon('doc')}</span><span class="li-main"><b>Member statements</b><small>${admin ? 'Open a member for their statement' : 'Open your name in Members'}</small></span>${icon('chev', 'chev')}</a>
      </div>
      ${admin ? '<p class="foot-note">Backups contain members’ personal data. Store them securely and do not share them outside the chama’s officials.</p>' : ''}`;
  },
};

const actions = {
  pdfMine() {
    const s = S(), id = s.shared ? s.shared.me : __M_src_core_session_js.Session.memberId, m = id ? s.members.find(x => x.id === id) : null;
    if (!m) return __M_src_ui_toast_js.toast('Your sign-in is not linked to a member yet');
    __M_src_lib_reports_js.Doc.print(__M_src_lib_reports_js.Doc.memberStatement(s, m), 'Statement - ' + m.name);
    __M_src_ui_toast_js.toast('Choose “Save as PDF” to keep it', 'info');
  },
  pdfMember: { admin: true, run(d) { const s = S(), m = s.members.find(x => x.id === d.id); if (!m) return; __M_src_lib_reports_js.Doc.print(__M_src_lib_reports_js.Doc.memberStatement(s, m), 'Statement - ' + m.name); } },
  pdfChama: { admin: true, run() { const s = S(); __M_src_lib_reports_js.Doc.print(__M_src_lib_reports_js.Doc.chamaReport(s), s.chama.name + ' report'); __M_src_ui_toast_js.toast('Choose “Save as PDF” to keep it', 'info'); } },
  exportCsv: { admin: true, run() {
    const s = S(), q = Reports.cell;
    const rows = [['Date', 'Member', 'Month', 'Amount', 'M-Pesa code'], ...s.payments.map(p => [p.date, Domain.memberName(s, p.memberId), p.month, p.amount, p.code])];
    Reports.download(`${s.chama.name}-payments.csv`, '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  } },
  exportJson: { admin: true, run() {
    const s = JSON.parse(JSON.stringify(S())); if (s.chama) delete s.chama.pin;
    Reports.download(`${s.chama.name}-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(s, null, 1), 'application/json');
  } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/profile/index.js ---- */
const __M_src_features_profile_index_js = (function () {
const { Domain } = __M_src_core_domain_js;
const { Gate } = __M_src_features_auth_gate_js;
const { Me } = __M_src_core_me_js;
const { render } = __M_src_core_rerender_js;
const { Session } = __M_src_core_session_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, monthLabel, sum } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { av } = __M_src_ui_avatar_js;
const { toast } = __M_src_ui_toast_js;

const roleName = () => Session.role === 'treasurer' ? 'Treasurer' : Session.role === 'secretary' ? 'Secretary' : 'Member';
const views = {
  profile(s) {
    const me = Me.get(), m = me.memberId ? s.members.find(x => x.id === me.memberId) : null;
    const name = me.name || (m && m.name) || '';
    const st = m ? Domain.status(s, m.id, Domain.now()) : null;
    const msg = { paid: ['ok', 'Paid up this month'], partial: ['warn', 'Part paid this month'], late: ['bad', 'Late this month'], due: ['', 'Not paid yet this month'] }[st];
    const owed = m ? sum(s.loans.filter(l => l.memberId === m.id), l => Domain.loan(l).balance) : 0;
    const fines = m ? sum(s.fines.filter(f => f.memberId === m.id && !f.paid), f => f.amount) : 0;
    const shot = me.photo || (m && Session.photoFor(m)) || '';
    const google = Session.usesGoogle(), hasPw = !!(Session.account && Session.account.has_password);
    const tile = (k, v, ic, tone) => `<div class="mtile"><span class="mt-ic ${tone || ''}">${icon(ic, 's')}</span><small>${esc(k)}</small><b class="num">${esc(v)}</b></div>`;
    const money = m ? `<div class="mtiles">${tile('Monthly amount', kes(Domain.dueFor(s, m.id)), 'clock')}${tile('Saved so far', kes(Domain.memberSaved(s, m.id)), 'coins', 't-ok')}${tile('Loan I owe', kes(owed), 'loans', owed ? 't-warn' : '')}${tile('Unpaid fines', kes(fines), 'receipt', fines ? 't-bad' : '')}</div>`
      : Session.role === 'treasurer'
        ? `<div class="card soft-card"><div class="sc-ic">${icon('key')}</div><div><b>You keep the books as an officer</b><p>You are not on the member list, so nothing is recorded under your name. If you also save with the group, add yourself.</p><a class="btn sm tint" href="#/members">${icon('userPlus', 's')}Add myself in Members</a></div></div>`
        : `<div class="card soft-card"><div class="sc-ic">${icon('clock')}</div><div><b>Almost there</b><p>Your sign-in is not linked to a name on the member list yet, so your money cannot show. The treasurer can fix this in one tap.</p><button type="button" class="btn sm tint" data-act="askLink">${icon('chat', 's')}Ask the treasurer</button></div></div>`;
    const recent = m ? s.payments.filter(p => p.memberId === m.id).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 5) : [];
    const row = (f, ic, k, v, tone) => `<button type="button" class="li has-ic" data-act="meEdit" data-f="${f}"><span class="li-ic ${tone || ''}">${icon(ic)}</span><span class="li-main"><small>${esc(k)}</small><b>${v ? esc(v) : '<span class="mute">Add</span>'}</b></span>${icon('chev', 'chev')}</button>`;
    return `
    <section class="phero">
      <div class="phero-bg" aria-hidden="true"></div>
      <div class="pphoto">${av({ id: m && m.id, name, photo: shot }, 104)}<button type="button" class="cam" data-act="pickPhoto" aria-label="${shot ? 'Change photo' : 'Add a photo'}">${icon('camera')}</button></div>
      <h1 class="pname">${name ? esc(name) : 'Add your name'}</h1>
      <p class="prole"><span class="rtag r-${esc(Session.role || 'member')}">${esc(roleName())}</span> ${esc(Session.groupName || (s.chama && s.chama.name) || 'your Chama')}</p>
      ${msg ? `<span class="tag ${msg[0]}">${esc(msg[1])}</span>` : ''}
    </section>
    ${money}
    ${m ? `<section class="sec"><div class="sec-h"><h2>My recent payments</h2>${recent.length ? `<button type="button" data-act="statement" data-id="${esc(m.id)}">Statement</button>` : ''}</div><div class="list">${recent.length ? recent.map(p => `<div class="li has-ic"><span class="li-ic t-ok">${icon('check')}</span><div class="li-main"><b>${esc(monthLabel(p.month))}</b><small>${esc(p.date || '')}${p.code ? ' · ' + esc(p.code) : ''}</small></div><div class="li-end"><span class="num">${esc(kes(p.amount))}</span><button type="button" class="hb sm" data-act="shareReceipt" data-id="${esc(p.id)}" aria-label="Share a receipt">${icon('share', 's')}</button></div></div>`).join('') : '<div class="li empty">No payments recorded yet</div>'}</div></section>` : ''}
    <section class="sec"><div class="sec-h"><h2>My details</h2></div><div class="list">
      ${row('name', 'profile', 'Full name', name)}
      ${row('user', 'tag', 'Username', /^user[0-9a-f]{8}$/.test(me.username || '') ? '' : (me.username || ''), 't-ink')}
      ${row('phone', 'phone', 'Phone number', me.phone || (m && m.phone) || '', 't-info')}
      ${row('email', 'mail', 'Contact email', me.email || '', 't-gold')}
    </div><p class="foot-note">The same details are used in every Chama you belong to.</p></section>
    <section class="sec"><div class="sec-h"><h2>Sign-in and security</h2></div><div class="list">
      <div class="li has-ic"><span class="li-ic t-ink">${icon('mail')}</span><div class="li-main"><small>Sign-in email</small><b>${esc(Session.email || 'Not set')}</b></div></div>
      ${hasPw ? row('password', 'lock', 'Password', 'Change password', 't-ink') : `<div class="li has-ic"><span class="li-ic t-ink">${icon('lock')}</span><div class="li-main"><small>Signs in with</small><b>${google ? 'Google' : 'Email code'}</b></div></div>`}
      ${shot ? `<button type="button" class="li has-ic" data-act="removePhoto"><span class="li-ic">${icon('camera')}</span><span class="li-main"><b>Remove photo</b></span>${icon('chev', 'chev')}</button>` : ''}
      <a class="li has-ic" href="#/settings/privacy"><span class="li-ic t-ink">${icon('shield')}</span><span class="li-main"><b>Privacy and my data</b><small>Download, correct or delete your data</small></span>${icon('chev', 'chev')}</a>
    </div></section>`;
  },
};

/* one field at a time, in a sheet: fewer taps than a long form, and nothing else on the page moves */
const editSheet = f => {
  const me = Me.get(), s = S(), m = s && me.memberId ? s.members.find(x => x.id === me.memberId) : null;
  const Sheet = __M_src_features_requests_js.Sheet;
  const F = {
    name: ['Full name', 'profile', `<input id="edV" value="${esc(me.name || (m && m.name) || '')}" autocomplete="name" autocapitalize="words" maxlength="120" autofocus>`, 'As your Chama knows you.'],
    user: ['Username', 'tag', `<input id="edV" value="${esc(/^user[0-9a-f]{8}$/.test(me.username || '') ? '' : (me.username || ''))}" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="20" placeholder="e.g. john.kamau" autofocus>`, '3 to 20 letters, numbers, dot, dash or underscore. You can sign in with it.'],
    phone: ['Phone number', 'phone', `<input id="edV" type="tel" inputmode="tel" autocomplete="tel" value="${esc(me.phone || (m && m.phone) || '')}" placeholder="0712 345 678" autofocus>`, 'The treasurer uses it for M-Pesa matching and reminders.'],
    email: ['Contact email', 'mail', `<input id="edV" type="email" inputmode="email" autocomplete="email" value="${esc(me.email || '')}" placeholder="you@example.com" autofocus>`, 'Optional. Your sign-in email stays ' + (Session.email || 'the same') + '.'],
    password: ['Change password', 'lock', '', '']
  }[f];
  if (!F) return;
  if (f === 'password') return Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('lock')}</span><h3>Change password</h3><p>At least 6 characters, with a capital letter, a number and a symbol.</p></div>
<label class="fgrp" for="pwCur"><span class="flab">Current password</span><span class="field pw">${icon('lock')}<input id="pwCur" type="password" autocomplete="current-password" autofocus><button type="button" class="eye" data-act="togglePw" data-for="pwCur" aria-pressed="false">Show</button></span></label>
<label class="fgrp" for="pwNew"><span class="flab">New password</span><span class="field pw">${icon('lock')}<input id="pwNew" type="password" autocomplete="new-password"><button type="button" class="eye" data-act="togglePw" data-for="pwNew" aria-pressed="false">Show</button></span></label>
<button type="button" class="btn pri block lg" data-act="changePassword">Change password</button>`, { key: 'edit', label: 'Change password' });
  Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon(F[1])}</span><h3>${esc(F[0])}</h3><p>${esc(F[3])}</p></div>
<label class="fgrp" for="edV"><span class="field">${icon(F[1])}${F[2]}</span></label>
<button type="button" class="btn pri block lg" data-act="meSave" data-f="${f}">Save</button>`, { key: 'edit', label: F[0] });
};

const actions = {
  meEdit: d => editSheet(d.f),
  askLink: async () => {
    const C = __M_src_features_chat_index_js.Chat;
    try {
      if (!C.contacts.length) await C.load();
      const t = C.contacts.find(c => c.role === 'treasurer');
      if (!t) return toast('No treasurer found in this Chama');
      await C.send(t.user_id, 'text', 'Hi, could you add me to the member list so my contributions show on my profile? (People and access → tap my name → Add)', {});
      toast('Message sent to ' + t.name, 'ok'); location.hash = '#/chat/' + t.user_id;
    } catch (e) { toast(e.message); }
  },
  async meSave(d) {
    const me = Me.get(), s = S(), m = s && me.memberId ? s.members.find(x => x.id === me.memberId) : null;
    const v = String(($('#edV') || {}).value || '').trim();
    const cur = { name: me.name || (m && m.name) || '', phone: me.phone || (m && m.phone) || '', email: me.email || '', username: /^user[0-9a-f]{8}$/.test(me.username || '') ? '' : (me.username || '') };
    try {
      if (d.f === 'name') { cur.name = v.replace(/\s+/g, ' '); if (!cur.name) throw new Error('Please type your name'); if (cur.name.length > 120) throw new Error('Keep your name to 120 characters or fewer'); }
      if (d.f === 'user') { cur.username = v.toLowerCase(); if (cur.username && !/^[a-z0-9._-]{3,20}$/.test(cur.username)) throw new Error('Username must be 3 to 20 letters, numbers, dot, dash or underscore'); }
      if (d.f === 'phone') { cur.phone = v.replace(/[\s-]/g, ''); if (cur.phone && !/^(\+?254|0)[17]\d{8}$/.test(cur.phone)) throw new Error('Phone number should look like 0712345678'); }
      if (d.f === 'email') { cur.email = v.toLowerCase(); if (cur.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cur.email)) throw new Error('Email address does not look right'); }
      if (!cur.name) throw new Error('Add your full name first');
      await Session.saveDetails({ name: cur.name, phone: cur.phone, email: cur.email, username: cur.username || null });
      __M_src_features_requests_js.Sheet.close(); toast('Saved', 'ok'); render();
    } catch (e) { toast(e.message); }
  },
  pickPhoto() {
    const input = document.getElementById('mePhoto');
    if (!input) return;
    input.value = '';
    input.click();
  },
  async saveMe() {
    const btn = document.querySelector('[data-act="saveMe"]');
    try {
      const name = $('#meName').value.trim().replace(/\s+/g, ' '), phone = $('#mePhone').value.replace(/[\s-]/g, ''), email = $('#meEmail').value.trim().toLowerCase(), username = $('#meUser').value.trim().toLowerCase();
      if (!name) throw new Error('Please type your name');
      if (name.length > 120) throw new Error('Keep your name to 120 characters or fewer');
      if (username && !/^[a-z0-9._-]{3,20}$/.test(username)) throw new Error('Username must be 3 to 20 letters, numbers, dot, dash or underscore');
      if (phone && !/^(\+?254|0)[17]\d{8}$/.test(phone)) throw new Error('Phone number should look like 0712345678');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email address does not look right');
      if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
      await Session.saveDetails({ name, phone, email, username: username || null });
      toast('Your details are saved'); render();
    } catch (e) { toast(e.message); if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = 'Save my details'; } }
  },
  async removePhoto() {
    __M_src_ui_toast_js.Pop.confirm({ title: 'Remove your photo?', text: 'Your initials will show instead, in every Chama.', confirmLabel: 'Remove', danger: true,
      onYes: async () => { try { await Session.savePhoto(null); toast('Photo removed'); render(); } catch (e) { toast(e.message); } } });
  },
  async changePassword() {
    const btn = document.querySelector('[data-act="changePassword"]');
    try {
      const cur = $('#pwCur').value, next = $('#pwNew').value, again = next;
      if (!cur) throw new Error('Type your current password');
      const bad = Gate.pwProblem(next); if (bad) throw new Error(bad);
      if (next !== again) throw new Error('The new passwords do not match');
      if (next === cur) throw new Error('Choose a password you have not used before');
      if (btn) { btn.disabled = true; btn.textContent = 'Changing…'; }
      await Session.changePassword(cur, next);
      __M_src_features_requests_js.Sheet.close(); toast('Password changed', 'ok'); render();
    } catch (e) { toast(e.message); if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = 'Change password'; } }
  },
  exportMe(d) {
    if (!d || !d.fmt) return __M_src_features_requests_js.Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('download')}</span><h3>Download my data</h3><p>Choose how you want it.</p></div>
<div class="list sx-list"><button type="button" class="li has-ic" data-act="exportMe" data-fmt="pdf"><span class="li-ic t-bad">${icon('doc')}</span><span class="li-main"><b>PDF document</b><small>Easy to read and print, in the app’s colours</small></span>${icon('chev', 'chev')}</button>
<button type="button" class="li has-ic" data-act="exportMe" data-fmt="json"><span class="li-ic t-info">${icon('download')}</span><span class="li-main"><b>Data file (JSON)</b><small>Everything, for moving to another app</small></span>${icon('chev', 'chev')}</button></div>`, { key: 'export', label: 'Download my data' });
    __M_src_features_requests_js.Sheet.close();
    if (d.fmt === 'pdf') return __M_src_features_index_js.Actions.pdfMine();
    const s = S(), me = Me.get(), m = s ? s.members.find(x => x.id === me.memberId) : null;
    const prof = Session.readProfile ? Session.readProfile() : {};
    const { photo: _p, ...profile } = prof || {};
    const out = { exported: new Date().toISOString(), app: 'My Chama App', account: { sign_in_email: Session.email || '', name: profile.name || '', username: profile.username || '', phone: profile.phone || '', contact_email: profile.email || '', role_in_this_chama: Session.role || '' }, chama: s ? s.chama.name : '' };
    if (m) {
      const pick = a => (a || []).filter(x => x.memberId === m.id), { photo, aliases, phones, ...rest } = m;
      Object.assign(out, { member: rest, payments: pick(s.payments), loans: pick(s.loans), fines: pick(s.fines), payouts: pick(s.payouts) });
    }
    try { out.consent = JSON.parse(localStorage.getItem('mca-onboard') || '{}'); delete out.consent.serverSynced; } catch (e) {}
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-chama-data.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast('Your data was downloaded');
  },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/content/app-info.js ---- */
const __M_src_content_app_info_js = (function () {

/* ===== EDIT HERE: app and legal identity, shown in Settings > About, Privacy, and the legal pages =====
   Fill every empty value before public launch. Empty values show as "Not set yet". */
const APP = {
  name: 'My Chama App', version: '0.18.0', released: '2026-11-20',
  support: '',          // e.g. a phone number or email for help. Shows "Not set yet" while empty.
  privacyContact: '',   // who handles privacy requests (the Data Protection contact). Shows "Not set yet" while empty.
  controller: '',       // registered legal name of the data controller (person or company running the app)
  odpcNumber: '',       // Office of the Data Protection Commissioner registration number
  regulators: [{ name: 'Office of the Data Protection Commissioner (ODPC)', what: 'Complaints about how your personal information is handled', url: 'https://www.odpc.go.ke' }],
  notes: [
    ['0.18.0', 'The app matches your age: from 45 larger text, from 60 Simple view with bigger buttons and fewer words, from 75 the largest text. You can always choose the standard app in Settings, Display. Your phone number is the same in every Chama you join. Everyone checks their details once after this update.'],
    ['0.17.0', 'Forgot password now always opens the reset screen, and a code link only works on the phone that asked for it. About you, one question at a time, with Simple view for anyone who wants bigger, calmer screens. Loan terms are signed on the borrower’s own phone. Each Chama can have its own photo. M-Pesa import is simpler and keeps each message with its payment. The Guide has its own new mark.'],
    ['0.16.2', 'Home now leads with your card, with the payout attached right under it and a line showing this month and the next turns. The duplicate search button by the greeting is gone: the Guide lives next to the bell.'],
    ['0.16.1', 'Your card on Home now has tiers that follow your payments: red when late, amber when part paid, silver when due soon, green when paid, purple when paid ahead, and gold in your payout month or after six months on time in a row. It moves gently, counts up when your figure changes, and a live line shows what is true right now: days to the due date, your streak, the next payout and more.'],
    ['0.16.0', 'A smart Guide next to the bell answers questions and walks you through tasks. Home puts the payout first and your card changes colour with your payment state. M-Pesa screenshots are read reliably, hidden digits and all. Fair roles: offers you accept, reasons for stepping down and removals, notice before access ends. App lock with fingerprint or face. Several savings goals, edited announcements, member photos, signed loan terms, PDF statements and reports, and a walkthrough of each Chama for new members.'],
    ['0.15.1', 'Fixed a sign-in loop after being approved. Changes now arrive live, without reloading. Leaving and rejoining keeps your old entry, and people who left are no longer asked to pay. One clear "Add a member" button. One password box with a show button. Tap a photo to see it large.'],
    ['0.15.0', 'The app now notices things for you. Treasurers get "Needs you today", a cash forecast, members to watch, suggested loan limits and a check for unusual payments. Everyone gets streaks, a payout countdown, a savings projection and a group goal. Search everything with /, hide amounts in public, lock the app with a PIN, add due dates and meetings to your calendar, share receipts and send feedback. Secretaries get a member register. Code emails can fill themselves in.'],
    ['0.14.0', 'Chat for your Chama: group and private messages, announcements, meetings with replies and an attendance register, minutes, votes, payment requests and statements. Joining with a code now asks the treasurer to approve you, and the Chama is shown before you join. Invites, People and access, your profile and Chama settings were rebuilt so each change is one tap away. Sounds are off unless you turn them on.'],
    ['0.13.0', 'A full redesign. A calmer Home with the one number that matters most to you, quick actions for the treasurer, and a simpler month view. Tap any payment, loan, fine or member to see details and act on it. A new code screen, a new opening mark, and simple line drawings throughout. Dark mode follows your phone. Clear Terms of Use and Privacy Policy pages, which everyone is asked to accept once. Fixes: recording a payment, saving your consent, the language search, and Enter to sign in.'],
    ['0.12.7-dev.1', 'Home, Contributions, Members and Profile use the approved layout: raised cards, money tiles, and a sliding month pill. Reset all data is no longer on Home.'],
    ['0.12.5-dev.1', 'Continue with Google signs you in, or creates your account if you are new.'],
    ['0.12.2-dev.1', 'One profile for every Chama. Your photo, name, username, phone and contact email are kept once, on your account.'],
    ['0.12.1-dev.1', 'Payments are saved on the server first, with a request key, so a double tap or a retry cannot record the same payment twice.'],
    ['0.12.0-dev.4', 'Invite codes, Chama tags, switching between Chamas, and 7-day invitations.'],
    ['0.12.0-dev.2', 'One account and one password for every Chama. Members see their own payments, loans and fines plus group totals only.'],
  ],
};

/* Plain-language summary shown in Settings > Privacy and data. The full text is legal/privacy.html. */
const PRIVACY = [
  ['What we keep', 'Your name, sign-in email and username. Your phone number, contact email and photo only if you add them. The contributions, loans, repayments, fines, payouts and expenses your chama records, and signatures given on a loan or payout.'],
  ['Why', 'To sign you in, to keep your chama’s records accurate, and to show each person what they are allowed to see. We do not sell data, show adverts, or use your data to decide on credit.'],
  ['Who can see it', 'The treasurer sees and changes all of the chama’s records. Members and secretaries see their own money and the group totals only. Other members see your name and photo, never your money. Our hosting and email providers process data for us under contract.'],
  ['Where it is kept', 'In a secure cloud database (Supabase, in the European Union), and on your phone for offline use. Data is encrypted in transit.'],
  ['How long', 'While your chama uses the app. If you delete your account, your sign-in and profile are erased after 30 days. Financial records stay with the chama, because they belong to the group and may need to be kept by law.'],
  ['Your rights', 'Under the Data Protection Act, 2019 you may be told how your data is used, see it, correct it, download it, object to its use, and ask for it to be deleted. You can complain to the Office of the Data Protection Commissioner.'],
];

const HELP_ARTICLES = [
  { id: 'start', cat: 'Getting started', q: 'Where do I find things?', a: 'Home shows the month at a glance. Contributions shows who has paid each month. Loans shows money lent and paid back. Members shows the group and the payout order. Profile is about you. The menu button at the top left holds fines, expenses, history, reports and settings.' },
  { id: 'roles', cat: 'Getting started', q: 'What can each role do?', a: 'The treasurer records and changes everything and sees every member’s money. Members and secretaries see their own payments, loans and fines, plus the group totals. Other members’ money stays private.' },
  { id: 'pay', cat: 'Payments', q: 'How is a payment recorded?', a: 'Only the treasurer records payments. Open Contributions, choose the month, and tap the status next to the member. Type the amount and, if there is one, the M-Pesa code. The same M-Pesa code cannot be recorded twice.' },
  { id: 'import', cat: 'Payments', q: 'Can I import M-Pesa messages?', a: 'Yes. In Contributions, tap Import from M-Pesa. Paste the confirmation messages or add screenshots. The app suggests a member for each payment. Check each one before you record them. Screenshots are read on your phone and are not uploaded.' },
  { id: 'pay-wrong', cat: 'Payments', q: 'A payment is missing or wrong', a: 'The treasurer can tap the payment in Contributions to edit or remove it. Every change is kept in History with what changed and when. Undo last change, in the menu under Chama, reverses the most recent change.' },
  { id: 'fine', cat: 'Payments', q: 'How do fines work?', a: 'The late fee is set in Chama settings. The treasurer can add a fine by hand, or tap Fine late members to fine everyone who is behind for this month, once.' },
  { id: 'loan', cat: 'Members and loans', q: 'How do I give a loan?', a: 'Open Loans and tap New loan. Choose the member, the amount, the interest and the months. A loan cannot be larger than the cash on hand. Tap the loan to record repayments or to ask the borrower to sign.' },
  { id: 'member', cat: 'Members and loans', q: 'How do I add a member?', a: 'Open Members and tap Add member. To let that person sign in, open People and access in Settings and invite them by email, or create an invite code.' },
  { id: 'order', cat: 'Members and loans', q: 'How is the payout order set?', a: 'In a merry-go-round chama, the order of the member list is the payout order. The treasurer can tap a member and choose Move up.' },
  { id: 'signin', cat: 'Account and security', q: 'How do I sign in?', a: 'Use your email or username and your password, or Continue with Google. New accounts confirm their email with a code first. If you forget your password, choose Forgot password and we send a code to your email.' },
  { id: 'code', cat: 'Account and security', q: 'I did not get the code', a: 'Check your spam or promotions folder, and that you typed the email correctly. You can ask for a new code after one minute. Only the newest code works.' },
  { id: 'safe', cat: 'Account and security', q: 'Keeping your account safe', a: 'Never share your password or a sign-in code, even with someone who says they are from My Chama. We will never ask for them. If you see a change you did not make, tell your treasurer and change your password in Profile.' },
  { id: 'sync', cat: 'App and data', q: 'Changes are not saving to the cloud', a: 'The app saves on your phone first and sends changes when you are online. A yellow bar at the top means you are offline. Run the checks below to see what is happening on this phone.' },
  { id: 'easy', cat: 'App and data', q: 'Make the app easier to read', a: 'Open Settings, then Display and accessibility. You can make the text larger, use dark colours, stronger contrast, bigger buttons, less movement, and turn on a read-aloud button.' },
  { id: 'backup', cat: 'App and data', q: 'Save a backup', a: 'The treasurer can open Reports and backup in the menu. Full backup saves a file of everything. Payments spreadsheet is for Excel or Google Sheets.' },
  { id: 'privacy', cat: 'Privacy and data', q: 'How do I see, download or delete my information?', a: 'Open Settings, then Privacy and my data. Download my data gives you a copy. You can correct your details in Profile. To delete your account, leave every Chama first, then use Delete my account. You have 30 days to change your mind.' },
];

return { get APP() { return APP; }, get PRIVACY() { return PRIVACY; }, get HELP_ARTICLES() { return HELP_ARTICLES; }, };
})();

/* ---- src/lib/help.js ---- */
const __M_src_lib_help_js = (function () {
const { CONFIG } = __M_src_config_js;
const { APP, HELP_ARTICLES } = __M_src_content_app_info_js;
const { render } = __M_src_core_rerender_js;
const { Store } = __M_src_core_store_js;
const { esc, waLink } = __M_src_core_utils_js;
const { toast } = __M_src_ui_toast_js;

const Help = {
  cat: 'All', open: {}, diag: null,
  votes() { try { return JSON.parse(localStorage.getItem('chama:help:votes') || '{}') || {}; } catch { return {}; } },
  vote(id, v) {
    const all = this.votes(); all[id] = v;
    try { localStorage.setItem('chama:help:votes', JSON.stringify(all)); } catch { toast('Storage full'); }
    if (v === 'no') this.open[id] = true;
    render();
  },
  filter(q) {
    q = String(q || '').trim().toLowerCase(); let any = false;
    document.querySelectorAll('.hart').forEach(el => { const hit = !q || el.dataset.s.includes(q); el.hidden = !hit; any = any || hit; });
    const none = document.getElementById('helpNone'); if (none) none.hidden = any;
  },
  runChecks() {
    const s = Store.get(), out = [], probe = 'chama:help:probe';
    let dirty = false; try { dirty = !!localStorage.getItem('chama:' + Store.chamaId + ':dirty'); } catch (e) {}
    out.push({ st: navigator.onLine ? 'ok' : 'bad', t: 'Internet connection', m: navigator.onLine ? 'This phone is connected.' : 'This phone is offline. Changes are saved and will send later.' });
    let local = false;
    try { localStorage.setItem(probe, '1'); local = localStorage.getItem(probe) === '1'; localStorage.removeItem(probe); } catch {}
    out.push({ st: local ? 'ok' : 'bad', t: 'Saving on this phone', m: local ? 'Records can be saved on this phone.' : 'This phone is not letting the app save. Check that storage is not full and that private browsing is off.' });
    out.push({ st: !CONFIG.supabase ? 'warn' : dirty ? 'warn' : 'ok', t: 'Cloud', m: !CONFIG.supabase ? 'The cloud is not set up in this app.' : dirty ? 'Waiting to send. It will send when the phone is online.' : 'All changes have been sent.' });
    out.push({ st: s && s.members ? 'ok' : 'bad', t: 'Records', m: s && s.members ? `${s.members.length} members and ${s.payments.length} payments are on this phone.` : 'The records could not be read. Close the app and open it again.' });
    out.push({ st: 'ok', t: 'App version', m: `Version ${APP.version}, released ${APP.released}.` });
    this.diag = { at: Date.now(), out };
    render();
    toast(out.every(x => x.st === 'ok') ? 'All checks passed' : 'Some checks need attention', 'info');
  },
  reportText() {
    const d = this.diag ? this.diag.out : [];
    return [`${APP.name} ${APP.version} problem report`, `Chama: ${(Store.get() || {}).chama ? Store.get().chama.name : 'unknown'}`,
      `Time: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })} (Nairobi time)`,
      ...d.map(x => `${x.t}: ${x.st === 'ok' ? 'OK' : x.st === 'warn' ? 'Check' : 'Problem'}. ${x.m}`), 'What went wrong:'].join('\n');
  },
  copyReport() {
    if (!this.diag) return toast('Run the checks first');
    const text = this.reportText();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast('Report copied'), () => toast('Could not copy. Select the text and copy it.'));
    else toast('Copying is not supported on this phone');
  },
  shareReport() {
    if (!APP.support) return toast('Support contact is not set yet');
    if (!this.diag) return toast('Run the checks first');
    const text = this.reportText();
    const url = APP.support.includes('@') ? `mailto:${APP.support}?subject=${encodeURIComponent('Chama problem report')}&body=${encodeURIComponent(text)}` : waLink(APP.support, text);
    window.open(url, '_blank', 'noopener');
  },
  render() {
    const votes = this.votes(), cats = ['All', ...new Set(HELP_ARTICLES.map(a => a.cat))];
    const chips = `<div class="chips" role="group" aria-label="Topics">${cats.map(c => `<button class="chip" aria-pressed="${this.cat === c}" data-act="helpCat" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
    const arts = HELP_ARTICLES.filter(a => this.cat === 'All' || a.cat === this.cat).map(a => {
      const v = votes[a.id];
      const feedback = v ? `<p class="mute small" style="margin-top:10px">${v === 'yes' ? 'Thank you for telling us.' : 'Sorry it did not help. Run the checks below, or contact support.'}</p>`
        : `<div class="hv"><span class="mute small">Did this help?</span><button class="btn sm" data-act="helpVote" data-id="${a.id}" data-v="yes">Yes</button><button class="btn sm" data-act="helpVote" data-id="${a.id}" data-v="no">No</button></div>`;
      return `<details class="hart" data-id="${a.id}" data-s="${esc((a.q + ' ' + a.a + ' ' + a.cat).toLowerCase())}" ${this.open[a.id] ? 'open' : ''}><summary>${esc(a.q)}</summary><div class="hbody"><p>${esc(a.a)}</p>${feedback}</div></details>`;
    }).join('');
    const d = this.diag;
    const pill = st => st === 'ok' ? '<span class="tag ok">OK</span>' : st === 'warn' ? '<span class="tag warn">Check</span>' : '<span class="tag bad">Problem</span>';
    const checks = d ? d.out.map(x => `<div class="chk">${pill(x.st)}<div><b>${esc(x.t)}</b><span class="m">${esc(x.m)}</span></div></div>`).join('')
      + `<p class="mute small" style="margin-top:8px">Checked ${esc(new Date(d.at).toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' }))} Nairobi time.</p>`
      : '<p class="plain">Checks the connection, saving and the cloud on this phone.</p>';
    const actions = `<div class="btns"><button class="btn pri" data-act="helpCheck">Run checks</button>${d ? ' <button class="btn" data-act="helpCopy">Copy report</button>' : ''}${d && APP.support ? ' <button class="btn" data-act="helpShare">Send to support</button>' : ''}</div>`;
    const regs = APP.regulators.map(r => `<a class="li has-ic" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="li-ic t-ink">${icon('scale')}</span><span class="li-main"><b>${esc(r.name)}</b><small>${esc(r.what)}</small></span>${icon('chev', 'chev')}</a>`).join('');
    return `<h1 class="lt">Help</h1><p class="lt-sub">Answers in plain words</p>
      <div class="nsearch"><label><svg class="mag ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS.search}</svg><span class="vh">Search help</span><input id="helpQ" type="search" placeholder="Search, for example payment or code"></label></div>
      ${chips}<div style="margin-top:12px">${arts}</div>
      <p id="helpNone" class="mute" hidden>No guides match. Try another word, or contact support below.</p>
      <section class="sec"><div class="sec-h"><h2>Troubleshoot this phone</h2></div><div class="card">${checks}${actions}</div></section>
      <section class="sec"><div class="sec-h"><h2>Still stuck?</h2></div><div class="list">
        <div class="li has-ic"><span class="li-ic">${icon('members')}</span><span class="li-main"><b>Your treasurer</b><small>They record payments and manage access</small></span></div>
        <div class="li has-ic"><span class="li-ic t-info">${icon('help')}</span><span class="li-main"><b>App support</b><small>${esc(APP.support || 'Not set yet')}</small></span></div>
        ${regs}</div></section>`;
  }
};

return { get Help() { return Help; }, };
})();

/* ---- src/features/account/deletion.js ---- */
const __M_src_features_account_deletion_js = (function () {
const { esc } = __M_src_core_utils_js;
const { toast } = __M_src_ui_toast_js;
const { Modal } = __M_src_ui_modal_js;
const { Backend } = __M_src_core_backend_js;
const { Session } = __M_src_core_session_js;
const { render } = __M_src_core_rerender_js;

/* Deleting an ACCOUNT (not leaving a Chama, which is a different thing: D6).
   Rules, enforced by the server (migration 009): no active Chama, a sign-in in the last 10 minutes, then a 30-day hold.
   Restoring is possible at any time during the hold. The Chama and its records are never deleted by this. */
const DAYS = 30;
const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const daysLeft = d => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
const plural = n => `${n} ${n === 1 ? 'day' : 'days'}`;

const Account = {
  pending: null, checked: false, busy: false, uid: null,
  async load() {
    if (!Session.user || !Session.ready()) return;
    if (Session.user.id !== this.uid) { this.uid = Session.user.id; this.checked = false; this.pending = null; }
    if (this.checked || this.busy || !Backend.sb) return;
    this.busy = true;
    try {
      const { data, error } = await Backend.sb.rpc('account_deletion_status');
      if (!error) this.pending = data && data.pending ? { requestedAt: new Date(data.requested_at), purgeAt: new Date(data.purge_at) } : null;
    } catch (e) { this.pending = null; }
    this.busy = false; this.checked = true; render();
  },
  banner() {
    if (!this.pending) return '';
    const n = daysLeft(this.pending.purgeAt);
    return `<section class="card warn" role="status" style="margin-bottom:14px"><h2>Account deletion scheduled</h2>
      <p class="plain">Your account will be deleted in ${plural(n)}, on ${esc(fmtDate(this.pending.purgeAt))}. Restore it before then and nothing is lost.</p>
      <div class="btns"><button class="btn pri" data-act="restoreAccount">Restore my account</button></div></section>`;
  },
  card() {
    if (this.pending) {
      const n = daysLeft(this.pending.purgeAt);
      return `<div class="card danger"><h2>Delete my account</h2>
        <p class="plain">Deletion is scheduled for ${esc(fmtDate(this.pending.purgeAt))}: ${plural(n)} left. Restore it to keep your account.</p>
        <div class="btns"><button class="btn pri" data-act="restoreAccount">Restore my account</button></div></div>`;
    }
    return `<div class="card danger"><h2>Delete my account</h2>
      <p class="plain">Your account is kept for ${DAYS} days first, so you can change your mind. After that your sign-in and profile are erased. Your records in each Chama stay with that Chama.</p>
      <p class="plain">Leave every Chama first. Leaving a Chama is a separate step, in Chama settings.</p>
      <div class="btns"><button class="btn bad" data-act="deleteAccount">Delete my account</button></div></div>`;
  },
  openDelete(err = '') {
    Modal.open({
      title: 'Delete my account', submitLabel: 'Continue', danger: false,
      body: `<p class="plain"><b>Your account is not deleted straight away.</b> It is kept for ${DAYS} days. Sign in within those days to restore it. After that it is erased.</p>
        ${err ? `<p class="notice" role="alert">${esc(err)}</p>` : ''}`,
      fields: [{ name: 'reason', label: 'Reason (optional)', value: '', placeholder: 'Optional' }],
      onSubmit: v => { __M_src_ui_toast_js.Pop.confirm({ title: 'Delete your account?', text: 'You will be signed out now. Your account is kept for ' + DAYS + ' days, then erased. Sign in again within that time to restore it.', confirmLabel: 'Delete account', danger: true, onYes: () => Account.submitDelete(v) }); },
    });
  },
  async submitDelete(v) {
    if (!Backend.sb) return toast('Sign-in is not set up in this app yet');
    const { data, error } = await Backend.sb.rpc('request_account_deletion', { p_reason: String(v.reason || '').trim().slice(0, 500) || null });
    if (error) { toast(/Leave your/i.test(error.message) ? 'You still belong to a Chama. Leave it, or hand it over, then delete your account.' : /recent|sign in again|10 minutes/i.test(error.message) ? 'For your safety, sign out and sign in again, then delete your account within 10 minutes.' : error.message); if (/Leave your/i.test(error.message) && Session.ready()) location.hash = '#/settings/chama'; return; }
    this.checked = false; this.pending = null;
    try { await Backend.sb.auth.signOut({ scope: 'global' }); } catch (e) { /* the local sign-out below still runs */ }
    try { Object.keys(localStorage).filter(k => k.startsWith('chama:') && !/dirty/i.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) { /* storage unavailable */ }
    await Session.signOut();
    dialogNotice('Deletion scheduled', `Your account is scheduled for deletion. You have ${DAYS} days to restore it by signing in again.`);
  },
  async restore() {
    if (!Backend.sb) return toast('Sign-in is not set up in this app yet');
    const { error } = await Backend.sb.rpc('cancel_account_deletion');
    if (error) return toast(error.message);
    this.pending = null; this.checked = true;
    toast('Restored. Your account is kept.');
    render();
  },
  /* kept so older callers do not break; deletion notices about other members are no longer shown (privacy, D8) */
  noticesHTML() { return ''; },
  refreshNotices() {},
};

const actions = {
  deleteAccount: () => Account.openDelete(),
  restoreAccount: () => Account.restore(),
};

return { get Account() { return Account; }, get actions() { return actions; }, };
})();

/* ---- src/features/settings/index.js ---- */
const __M_src_features_settings_index_js = (function () {
const { Account } = __M_src_features_account_deletion_js;
const { CONFIG } = __M_src_config_js;
const { APP, PRIVACY } = __M_src_content_app_info_js;
const { A11y } = __M_src_core_a11y_js;
const { Auth } = __M_src_core_auth_js;
const { Backend } = __M_src_core_backend_js;
const { Me } = __M_src_core_me_js;
const { render } = __M_src_core_rerender_js;
const { Session, Perm } = __M_src_core_session_js;
const { S } = __M_src_core_state_js;
const { Store } = __M_src_core_store_js;
const { esc, kes } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { Help } = __M_src_lib_help_js;
const { num, validEmail } = __M_src_lib_validate_js;
const { Modal } = __M_src_ui_modal_js;
const { toast } = __M_src_ui_toast_js;

/* In-app reader for the legal documents. The same files are public pages (legal/*.html), so there is one source of truth. */
const Legal = {
  cache: {}, loading: {},
  file: k => (k === 'terms' ? 'legal/terms.html' : 'legal/privacy.html'),
  html(k) {
    if (this.cache[k]) return this.cache[k];
    if (!this.loading[k]) {
      this.loading[k] = true;
      fetch(this.file(k), { credentials: 'same-origin' }).then(r => r.ok ? r.text() : Promise.reject(new Error(String(r.status)))).then(t => {
        const doc = new DOMParser().parseFromString(t, 'text/html');
        const main = doc.querySelector('article.legal');
        if (!main) throw new Error('missing');
        main.querySelectorAll('script, iframe, object, embed, form, style').forEach(n => n.remove());
        main.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => { if (/^on/i.test(a.name) || (a.name === 'href' && /^\s*javascript:/i.test(a.value))) n.removeAttribute(a.name); }));
        main.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
        main.querySelectorAll('a[href="terms.html"]').forEach(a => a.setAttribute('href', '#/legal/terms'));
        main.querySelectorAll('a[href="privacy.html"]').forEach(a => a.setAttribute('href', '#/legal/privacy'));
        this.cache[k] = main.outerHTML;
      }).catch(() => { this.cache[k] = `<div class="card">${emptyState('lost', 'Could not open the document', 'Check your internet connection, then try again.', `<a class="btn pri" href="${this.file(k)}" target="_blank" rel="noopener">Open in the browser</a>`)}</div>`; })
        .finally(() => { this.loading[k] = false; render(); });
    }
    return Skel.page();
  }
};

const views = {
  settings(s, r = 'settings') {
    const d = A11y.d, admin = Auth.isAdmin(), me = Me.get();
    const li = (href, ic, tone, t, sub, extra) => `<a class="li has-ic" href="#/${href}"${extra || ''}><span class="li-ic ${tone || ''}">${icon(ic)}</span><span class="li-main"><b>${esc(t)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>${icon('chev', 'chev')}</a>`;
    const act = (a, ic, tone, t, sub, cls) => `<button type="button" class="li has-ic${cls ? ' ' + cls : ''}" data-act="${a}"><span class="li-ic ${tone || ''}">${icon(ic)}</span><span class="li-main"><b>${esc(t)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>${icon('chev', 'chev')}</button>`;
    const seg = (k, t, o) => `<div class="card" role="group" aria-label="${esc(t)}"><h2 style="font-size:.86em;color:var(--ink-2)">${esc(t)}</h2><div class="seg" style="margin-top:10px">${o.map(([v, l]) => `<button type="button" aria-pressed="${d[k] === v}" data-act="a11ySet" data-k="${k}" data-v="${v}">${esc(l)}</button>`).join('')}</div></div>`;
    const sw = (k, t, h) => `<div class="li"><span class="li-main"><b>${esc(t)}</b><small>${esc(h)}</small></span><button type="button" class="sw" role="switch" aria-checked="${!!d[k]}" aria-label="${esc(t)}" data-act="a11y" data-k="${k}"></button></div>`;
    const grp = (t, rows) => `<section class="sec"><div class="sec-h"><h2>${esc(t)}</h2></div><div class="list">${rows.join('')}</div></section>`;
    const back = h => '';
    if (r === 'settings') return `<h1 class="lt">Settings</h1><p class="lt-sub">${esc(Session.email || '')}</p>`
      + grp('You', [li('profile', 'profile', '', 'My profile', 'Name, photo, phone and password'), `<button type="button" class="li has-ic" data-act="openLang"><span class="li-ic t-info">${icon('globe')}</span><span class="li-main"><b>Language</b></span>${icon('chev', 'chev')}</button>`, li('notifications/settings', 'bell', 't-gold', 'Notifications', 'What you hear about')])
      + grp('Chama', [li('settings/chama', 'gear', 't-ink', 'Chama settings', admin ? 'Name, contribution, due day, fines, loans' : 'See the rules your chama uses'), li('settings/actions', 'members', '', admin ? 'People and access' : 'My access', admin ? 'Invite people, codes, roles and hand-over' : 'Your role and leaving'), li('reports', 'download', 't-info', 'Reports and backup', ''), act('wsSwitch', 'swap', 't-gold', 'Switch or add a Chama', '')])
      + grp('Display', [li('settings/app', 'text', 't-ink', 'Display and accessibility', 'Dark mode, text size, contrast, motion, sounds')])
      + grp('Security and tools', [act('lockSetup', 'lock', 't-ink', 'App lock', (() => { try { return (() => { const c = JSON.parse(localStorage.getItem('mca-lock') || 'null'); return c && c.hash; })() ? (JSON.parse(localStorage.getItem('mca-lock')).on === false ? 'Off · PIN kept for next time' : 'On · asks for your PIN') : 'Off · ask for a PIN on this phone'; } catch (e) { return ''; } })()), act('moneyToggle', 'eye', 't-info', 'Hide amounts', document.documentElement.classList.contains('hide-money') ? 'On · tap a number to peek' : 'Off · for using the app in public'), act('icsExport', 'clock', 't-gold', 'Add dates to my calendar', 'Due dates and meetings, with reminders'), act('palette', 'search', 't-ink', 'Search', 'People, payments and pages · press / on a keyboard'),
        ...(admin ? [li('insights', 'chart', '', 'Insights', 'Forecast, members to watch, loan limits')] : []), ...(Session.role && Session.role !== 'member' ? [li('register', 'doc', 't-info', 'Member register', 'Contacts for officers, with export')] : [])])
      + grp('Support and legal', [li('settings/help', 'help', 't-info', 'Help', 'Guides and troubleshooting'), act('feedback', 'chat', '', 'Send feedback', 'Rate the app, report a problem, suggest an idea'), li('settings/privacy', 'shield', '', 'Privacy and my data', 'Download or delete your data'), li('legal/terms', 'scale', 't-ink', 'Terms of Use', ''), li('legal/privacy', 'doc', 't-ink', 'Privacy Policy', ''), li('settings/about', 'info', 't-ink', 'About', 'Version ' + APP.version)])
      + `<section class="sec"><div class="list">${act('signOutAsk', 'out', 't-bad', 'Sign out', '', 'danger')}</div></section>`;
    if (r.startsWith('settings/app')) {
      const sub = r.slice('settings/app'.length).replace(/^\//, '');
      const show = k => !sub || sub === k;
      const G = __M_src_features_guide_js.Adapt, age = G.age(), band = G.band(age), mode = d.ageMode || '';
      const ageCard = !sub && age != null ? `<section class="age-card"><div><b>${mode === 'off' ? 'Standard app' : mode === 'custom' ? 'Your own settings' : band === 'std' ? 'Standard app' : 'Matched to your age'}</b><small>${mode === 'off' ? 'You chose the standard app.' : mode === 'custom' ? 'You changed the settings yourself.' : band === 'std' ? 'For your age the standard app fits best.' : 'You are ' + age + ', so the app uses ' + esc(G.LABEL[band]) + '.'}</small></div>${mode === 'auto' && band !== 'std' ? '<button type="button" class="btn sm" data-act="ageStandard">Use the standard app</button>' : band !== 'std' ? '<button type="button" class="btn sm tint" data-act="ageMatch">Match my age</button>' : ''}</section>` : '';
      return `<h1 class="lt">Display and accessibility</h1><p class="lt-sub">Saved on this phone only</p>${ageCard}`
        + (show('appearance') ? seg('theme', 'Appearance', [['auto', 'Follow phone'], ['light', 'Light'], ['dark', 'Dark']]) + `<div style="margin-top:12px">${seg('accent', 'Colour', [['green', 'Green'], ['blue', 'Blue'], ['purple', 'Purple'], ['gold', 'Gold'], ['rose', 'Rose'], ['teal', 'Teal']])}</div>` : '')
        + (show('text') ? `<div style="margin-top:12px">${seg('size', 'Text size', [['n', 'Default'], ['l', 'Large'], ['x', 'Largest']])}</div>` : '')
        + (show('seeing') ? grp('Seeing', [sw('hc', 'Stronger contrast', 'Black and white with thicker lines'), sw('cb', 'Symbols with colours', 'Adds ✓ and ✕ so colour is never the only clue'), sw('ft', 'Easy-read lettering', 'A plainer typeface for weak eyesight'), sw('sp', 'Extra spacing', 'More space between letters, words and lines'), sw('ul', 'Underline links', 'Makes every link easy to find')]) : '')
        + (!sub ? grp('Easier to use', [sw('simple', 'Simple view', 'Bigger letters and buttons, fewer things on each screen. Good for anyone who finds the app busy.')]) : '')
        + (show('hands') ? grp('Hands and movement', [sw('tg', 'Bigger buttons', 'Larger areas to tap'), sw('rm', 'Less movement', 'Turns off sliding and fading')]) : '')
        + (!sub ? grp('Sound', [`<div class="li"><span class="li-main"><b>Sounds</b><small>A soft chime when something important succeeds, such as a confirmed code. Never on every tap.</small></span><button type="button" class="sw" role="switch" aria-checked="${__M_src_ui_toast_js.Sfx.enabled}" aria-label="Sounds" data-act="sfxToggle"></button></div>`]) : '')
        + (show('reading') ? grp('Reading and messages', [sw('long', 'Keep messages longer', 'Small messages stay on screen for 14 seconds'), sw('read', 'Read-aloud button', 'Shows a button that reads the page out loud')]) : '')
        + `<div class="btns"><button class="btn" data-act="a11yReset">Reset to default</button></div>`;
    }
    if (r === 'settings/account') return `<h1 class="lt">My account</h1><div class="card"><div class="kv"><span>Name</span><b>${esc(me.name || 'Not added yet')}</b></div><div class="kv"><span>Phone</span><b>${esc(me.phone || 'Not added yet')}</b></div><div class="kv"><span>Contact email</span><b>${esc(me.email || 'Not added yet')}</b></div><div class="kv"><span>Sign-in email</span><b>${esc(Session.email || '')}</b></div></div>
      <div class="btns"><a class="btn pri" href="#/profile">Edit in my profile</a></div>`;
    if (r === 'settings/chama') {
      const c = s.chama, ws = (Session.workspaces || []).find(w => w.chama_id === Store.chamaId) || {};
      const row = (f, ic, tone, k, v) => admin
        ? `<button type="button" class="li has-ic" data-act="chamaEdit" data-f="${f}"><span class="li-ic ${tone}">${icon(ic)}</span><span class="li-main"><small>${esc(k)}</small><b>${esc(v)}</b></span>${icon('chev', 'chev')}</button>`
        : `<div class="li has-ic"><span class="li-ic ${tone}">${icon(ic)}</span><span class="li-main"><small>${esc(k)}</small><b>${esc(v)}</b></span></div>`;
      const face = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(c.photo || '') ? c.photo : '';
      return `<section class="chama-hero"><span class="jn-tile lg ch-face">${face ? `<img class="av" src="${face}" alt="Photo of ${esc(c.name)}" data-name="${esc(c.name)}">` : esc(String(c.name || 'C').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase())}${admin ? `<button type="button" class="ch-cam" data-act="chamaPhoto" aria-label="${face ? 'Change' : 'Add'} the Chama photo">${icon('camera', 's')}</button>` : ''}</span><div><h1>${esc(c.name)}</h1><p>${c.mode === 'savings' ? 'Savings or table banking' : 'Merry-go-round'}${ws.display_tag ? ' · ' + esc(ws.display_tag) : ''} · ${s.members.length} ${s.members.length === 1 ? 'member' : 'members'}</p></div></section>
      <p class="lt-sub" style="margin-top:12px">${admin ? 'Tap a rule to change it. Every change is kept in History, and you can undo the last one.' : 'Only the treasurer can change these.'}</p>
      <section class="sec" style="margin-top:0"><div class="sec-h"><h2>Basics</h2></div><div class="list">${row('name', 'pencil', 't-ink', 'Name', c.name)}${row('mode', 'swap', 't-gold', 'Type', c.mode === 'savings' ? 'Savings or table banking' : 'Merry-go-round')}${c.mode === 'savings' ? '' : row('startMonth', 'clock', 't-info', 'First payout month', c.startMonth ? monthLabelLong(c.startMonth) : 'Not set')}</div></section>
      <section class="sec"><div class="sec-h"><h2>Money rules</h2></div><div class="list">${row('monthly', 'coins', '', 'Monthly contribution per share', kes(c.monthly))}${row('dueDay', 'clock', 't-info', 'Due by', 'Day ' + c.dueDay + ' of the month')}${row('finePerLate', 'receipt', 't-bad', 'Late fine', kes(c.finePerLate))}${row('loanRate', 'loans', 't-gold', 'Loan interest', c.loanRate + '% a month, flat')}${row('payTo', 'wallet', 't-ink', 'Members pay to', c.payTo || 'Not set')}${row('rules', 'doc', 't-info', 'Group rules', c.rules ? String(c.rules).split('\n')[0].slice(0, 60) + (String(c.rules).length > 60 ? '…' : '') : 'Not written yet')}</div></section>
      ${admin ? `<section class="sec"><div class="list"><button type="button" class="li has-ic" data-act="undo"><span class="li-ic t-ink">${icon('undo')}</span><span class="li-main"><b>Undo last change</b></span>${icon('chev', 'chev')}</button></div></section>` : ''}
      <section class="sec"><div class="list">${Session.role === 'secretary' ? `<button type="button" class="li has-ic" data-act="stepDown"><span class="li-ic t-warn">${icon('undo')}</span><span class="li-main"><b>Step down as secretary</b><small>Stay in the Chama as a member. A reason is needed.</small></span>${icon('chev', 'chev')}</button>` : ''}<button type="button" class="li has-ic danger" data-act="leaveChama"><span class="li-ic t-bad">${icon('out')}</span><span class="li-main"><b>Leave this Chama</b><small>Your past records stay with the Chama</small></span>${icon('chev', 'chev')}</button></div></section>`;
    }
    if (r === 'settings/data') return `<h1 class="lt">Data and storage</h1><div class="card"><h2>Where records are kept</h2>
      <p class="plain">Every change is saved on this phone first, then sent to the chama’s secure cloud database when you are online. ${CONFIG.supabase ? '' : 'The cloud is not set up in this app.'}</p>
      <p class="plain">Signing out removes this Chama’s records from this phone. Changes that have not been sent yet are lost, so wait until you are online before you sign out.</p></div>
      <div class="btns"><a class="btn" href="#/reports">Reports and backup</a><a class="btn" href="#/settings/help">Run checks</a></div>`;
    if (r === 'settings/actions') return admin ? __M_src_features_requests_js.accessView(s) : this.access(s, admin);
    if (r === 'settings/about') return `<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 0 6px">${markTile('lg')}<h1 class="lt" style="margin-top:16px">${esc(APP.name)}</h1><p class="mute">Version ${esc(APP.version)} · ${esc(APP.released)}</p></div>
      <div class="card"><p class="plain">Record-keeping for chamas: contributions, loans, fines, payouts and expenses, shared clearly with every member. My Chama keeps records only. It does not hold, send or lend money.</p></div>
      <section class="sec"><div class="sec-h"><h2>What’s new</h2></div><div class="list">${APP.notes.slice(0, 3).map(([v, t]) => `<div class="li"><div class="li-main"><b>${esc(v)}</b><small style="white-space:normal">${esc(t)}</small></div></div>`).join('')}</div></section>
      <section class="sec"><div class="list">
        <div class="li"><div class="li-main"><small>Help contact</small><b>${esc(APP.support || 'Not set yet')}</b></div></div>
        ${li('legal/terms', 'scale', 't-ink', 'Terms of Use', '')}${li('legal/privacy', 'doc', 't-ink', 'Privacy Policy', '')}
        <a class="li has-ic" href="vendor/supabase-LICENSE" target="_blank" rel="noopener"><span class="li-ic t-ink">${icon('doc')}</span><span class="li-main"><b>Open-source licences</b><small>supabase-js (MIT)</small></span>${icon('chev', 'chev')}</a>
      </div></section>`;
    if (r === 'settings/help') return Help.render();
    if (r === 'settings/privacy') {
      let consent = {}; try { consent = JSON.parse(localStorage.getItem('mca-onboard') || '{}') || {}; } catch (e) {}
      /* what you can do first; the explanations are one plain line each, with the full wording a tap away */
      const SHORT = [['shield', 'We keep your name, email and your money records'], ['check', 'Only to run your Chama. Never sold, no adverts'], ['eye', 'The treasurer sees all; members see their own'], ['lock', 'Stored safely in the cloud and on this phone'], ['clock', 'Erased 30 days after you delete your account'], ['scale', 'You can see, correct, download or delete it']];
      return `<h1 class="lt">Privacy and my data</h1>
      <section class="sec" style="margin-top:6px"><div class="list">
        ${act('exportMe', 'download', '', 'Download my data', 'PDF or data file')}
        ${act('aboutEdit', 'profile', 't-info', 'About you', 'Name, phone, birthday, gender')}
        ${li('profile', 'pencil', 't-info', 'Correct my details', 'Name, username, contact')}
        ${act('aboutClear', 'trash', 't-bad', 'Remove birthday, gender and phone', 'Your name stays')}
      </div></section>
      <section class="sec"><div class="sec-h"><h2>How we treat your data</h2></div><div class="pv-facts">${PRIVACY.map((x, i) => `<details class="pv-fact"><summary><span class="li-ic">${icon((SHORT[i] || ['info'])[0], 's')}</span><span>${esc((SHORT[i] || [0, x[0]])[1])}</span>${icon('chev', 'chev')}</summary><p><b>${esc(x[0])}.</b> ${esc(x[1])}</p></details>`).join('')}</div>
      <div class="list" style="margin-top:10px">${li('legal/privacy', 'doc', 't-ink', 'Privacy Policy', '')}${li('legal/terms', 'scale', 't-ink', 'Terms of Use', '')}</div></section>
      <section class="sec"><div class="list">
        <div class="li"><div class="li-main"><small>Privacy contact</small><b>${esc(APP.privacyContact || 'Not set yet')}</b></div></div>
        <div class="li"><div class="li-main"><small>You accepted</small><b>${consent.agreedAt ? 'Version ' + esc(consent.policy || '') + ' on ' + esc(new Date(consent.agreedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) : 'Not recorded on this phone'}</b></div></div>
        ${consentRecords()}
      </div><p class="foot-note">To withdraw consent, delete your account below or write to the privacy contact.</p></section>
      <section class="sec">${Account.card()}</section>`;
    }
    if (r === 'legal/privacy' || r === 'legal/terms') return `<div class="card">${Legal.html(r.slice(6))}</div>`;
    return '';
  },
  access(s, admin) {
    const label = a => a.status === 'active' ? 'signed in' : a.status === 'removed' ? 'access removed' : 'waiting to sign in';
    if (!admin) return `<h1 class="lt">My access</h1>${__M_src_features_requests_js.Requests.listHtml()}<div class="card"><div class="kv"><span>Role</span><b>${esc(Perm.label(Session.role))}</b></div><div class="kv"><span>Signed in as</span><b>${esc(Session.email)}</b></div><div class="kv"><span>Member record</span><b>${Session.memberId ? 'Linked' : 'Not linked'}</b></div></div>
      <p class="foot-note">You see your own money and the group totals. Your treasurer controls who can sign in.</p>
      <section class="sec"><div class="list">${Session.role === 'secretary' ? `<button type="button" class="li has-ic" data-act="stepDown"><span class="li-ic t-warn">${icon('undo')}</span><span class="li-main"><b>Step down as secretary</b><small>Stay in the Chama as a member. A reason is needed.</small></span>${icon('chev', 'chev')}</button>` : ''}<button type="button" class="li has-ic danger" data-act="leaveChama"><span class="li-ic t-bad">${icon('out')}</span><span class="li-main"><b>Leave this Chama</b><small>Your past records stay with the Chama</small></span>${icon('chev', 'chev')}</button></div></section>`;
    return '';
  },
};
/* what the server holds about each acceptance: the person can see exactly what we can show later */
let consentCache = null, consentLoading = false;
const consentRecords = () => {
  if (consentCache === null && !consentLoading && Backend.sb) {
    consentLoading = true;
    Backend.sb.rpc('my_consents').then(r => { consentCache = r.error ? [] : (r.data || []); consentLoading = false; render(); }, () => { consentCache = []; consentLoading = false; });
  }
  if (!consentCache || !consentCache.length) return '';
  return consentCache.slice(0, 3).map(c => `<div class="li"><div class="li-main"><small>Recorded on our server · ${esc(c.policy_version)}</small><b>${esc(new Date(c.accepted_at).toLocaleString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' }))}</b><small>${esc([c.method === 'continue:google' ? 'Continued with Google' : c.method === 'continue:sign-in' ? 'Continued to sign in' : c.method === 'continue:create-account' ? 'Continued to create an account' : c.method ? 'Continued' : '', c.timezone, c.ip ? 'from ' + c.ip : '', c.user_agent ? (/iPhone|iPad/.test(c.user_agent) ? 'iPhone' : /Android/.test(c.user_agent) ? 'Android' : /Mac/.test(c.user_agent) ? 'Mac' : /Windows/.test(c.user_agent) ? 'Windows' : 'browser') : ''].filter(Boolean).join(' · '))}</small></div></div>`).join('');
};
const monthLabelLong = k => { const [y, m] = String(k).split('-').map(Number); return y && m ? new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }) : String(k); };
const CHAMA_FIELDS = {
  name: ['Chama name', 'pencil', 'text', 'Members see this everywhere.'],
  mode: ['Type of Chama', 'swap', 'select', 'Merry-go-round: the pot rotates. Savings: money stays in the pool for loans.'],
  startMonth: ['First payout month', 'clock', 'month', 'The month the first member receives the pot.'],
  monthly: ['Monthly contribution per share', 'coins', 'number', 'In KES. A member with two shares pays twice this.'],
  dueDay: ['Due by day of the month', 'clock', 'number', 'From 1 to 28. After this day a payment counts as late.'],
  finePerLate: ['Late fine', 'receipt', 'number', 'In KES. 0 means no fine.'],
  loanRate: ['Loan interest', 'loans', 'number', 'Percent a month, flat. New loans start with this rate.'],
  payTo: ['Members pay to', 'wallet', 'text', 'Till, paybill or phone number. It is shown in reminders and payment requests.'],
  rules: ['Group rules', 'doc', 'textarea', 'The rules everyone agreed to. New members read them before they enter.']
};
const chamaEditSheet = f => {
  const F = CHAMA_FIELDS[f], c = S().chama; if (!F) return;
  const v = c[f] == null ? '' : c[f];
  const input = F[2] === 'textarea' ? `<textarea id="chV" rows="8" maxlength="1500" placeholder="e.g. 1. Contributions are due by the 10th.\n2. A late payment is fined KES 100.\n3. Loans are repaid within 3 months.">${esc(v)}</textarea>` : F[2] === 'select' ? `<select id="chV"><option value="rotation"${v === 'rotation' ? ' selected' : ''}>Merry-go-round (the pot rotates)</option><option value="savings"${v === 'savings' ? ' selected' : ''}>Savings or table banking</option></select>`
    : `<input id="chV" type="${F[2]}" value="${esc(v)}"${F[2] === 'number' ? ' inputmode="decimal" step="any"' : ''} autofocus>`;
  __M_src_features_requests_js.Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon(F[1])}</span><h3>${esc(F[0])}</h3><p>${esc(F[3])}</p></div>
<label class="fgrp" for="chV"><span class="field">${icon(F[1])}${input}</span></label>
<button type="button" class="btn pri block lg" data-act="chamaSave" data-f="${f}">Save</button>`, { key: 'chama', label: F[0] });
};
/* keep `this` pointing at views when called as Views.settings */
views.settings = views.settings.bind(views);

const actions = {
  a11y: d => { A11y.d[d.k] = A11y.d[d.k] ? 0 : 1; if (['simple', 'tg', 'rm'].includes(d.k) && A11y.d.ageMode === 'auto') A11y.d.ageMode = 'custom'; A11y.save(); render(); A11y.refocus(`[data-act=a11y][data-k=${d.k}]`); },
  a11ySet: d => { A11y.d[d.k] = d.v; if (d.k === 'size' && A11y.d.ageMode === 'auto') A11y.d.ageMode = 'custom'; A11y.save(); render(); A11y.refocus(`[data-act=a11ySet][data-k=${d.k}][data-v=${d.v}]`); },
  sfxToggle() { try { localStorage.setItem('mca-sfx', __M_src_ui_toast_js.Sfx.enabled ? 'off' : 'on'); } catch (e) {} render(); if (__M_src_ui_toast_js.Sfx.enabled) { __M_src_ui_toast_js.Sfx.unlock(); __M_src_ui_toast_js.Sfx.ok(); } A11y.refocus('[data-act=sfxToggle]'); },
  ageStandard() { __M_src_features_guide_js.Adapt.standard(); render(); toast('Standard app', 'ok'); },
  ageMatch() { const b = __M_src_features_guide_js.Adapt.again(); render(); toast(b && b !== 'std' ? 'Matched to your age' : 'The standard app fits your age', 'ok'); },
  a11yReset() { A11y.d = { ...A11y.def }; A11y.save(); render(); toast('Back to default', 'info'); },
  openLang() { if (typeof window.openLanguagePicker === 'function') window.openLanguagePicker(); },
  skip() { $('#view').focus(); },
  readAloud() {
    const ss = window.speechSynthesis, b = $('#ra'); if (!ss) throw new Error('This phone cannot read aloud');
    if (ss.speaking) { ss.cancel(); b.textContent = 'Read this page aloud'; return; }
    const u = new SpeechSynthesisUtterance($('#view').innerText); u.lang = 'en-KE'; u.rate = 0.95;
    u.onend = u.onerror = () => { b.textContent = 'Read this page aloud'; }; b.textContent = 'Stop reading'; ss.speak(u);
  },
  codeRevoke: async d => { try { await Session.revokeCode(d.id); toast('Code cancelled', 'info'); } catch (e) { toast(e.message); } },
  tagSave: async () => {
    const t = ($('#codeTag').value || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(t)) return toast('A tag is exactly 4 letters or numbers');
    try { const tag = await Session.saveTag(t); __M_src_features_requests_js.Sheet.close(); toast('Chama tag saved: ' + tag, 'ok'); } catch (e) { toast(e.message); }
  },
  /* removing someone is a serious step: a reason they will read, a category, and by default a notice period they can answer */
  revoke: async d => {
    const R = __M_src_features_requests_js;
    Modal.open({ title: 'Remove access?', submitLabel: 'Continue', danger: true,
      body: `<div class="ho-warn">${icon('shield')}<div><b>Be fair</b><ul><li>They see your reason.</li><li>They get a few days to reply first.</li><li>Their money records stay.</li></ul></div></div>`,
      fields: [{ name: 'cat', label: 'Why', type: 'select', options: [['', 'Choose one…'], ...R.REMOVE_WHY], value: '' },
        { name: 'why', label: 'Explain in your own words', type: 'textarea', required: true, placeholder: 'e.g. No contribution since January and no reply to three reminders.' },
        { name: 'days', label: 'Notice before access ends', type: 'select', options: [['3', '3 days (suggested)'], ['7', '7 days'], ['14', '14 days']], value: '3', help: 'Ignored when they asked to leave, for a duplicate account or a security risk: those end at once.' }],
      onSubmit: v => {
        if (!v.cat) throw new Error('Choose why');
        const why = String(v.why || '').trim(); if (why.length < 15) throw new Error('Explain the reason in a sentence (at least 15 characters)');
        setTimeout(async () => {
          const { data, error } = await Backend.sb.rpc('remove_with_reason', { p_cid: Store.chamaId, p_email: d.e, p_category: v.cat, p_reason: why, p_notice_days: Number(v.days) || 3 });
          /* never fall back to removing at once: that is harsher than what was asked */
          if (error && /Could not find the function|PGRST202|schema cache/i.test(error.message || '')) return __M_src_ui_toast_js.Pop.alert('The server is still taking in its latest update. Nothing was changed. Wait a minute, then try again.', { title: 'Not removed yet', label: 'OK' });
          if (error) return toast(rpcMessage(error));
          await Session.loadAccess(); await R.Roles.load().catch(() => {}); render(); R.Sheet.close();
          if (data && data.removed) toast('Access removed. They were told why. Their records are kept.', 'ok');
          else __M_src_ui_toast_js.Pop.alert('They have been told the reason and can reply. Their access ends after the notice period: you will see a Finish button on People and access. You can withdraw the notice before then.', { title: 'Notice given', label: 'OK', calm: true });
        }, 0);
      } });
  },
  roleAnswer: d => __M_src_features_requests_js.Roles.answer(d.id, d.v === 'yes'),
  offerCancel: async d => { const { error } = await Backend.sb.rpc('cancel_role_offer', { p_id: d.id }); if (error) return toast(rpcMessage(error)); await __M_src_features_requests_js.Roles.load(); render(); toast('Offer withdrawn', 'info'); },
  noticeCancel: d => __M_src_ui_toast_js.Pop.confirm({ title: 'Withdraw the notice?', text: 'They keep their access and are told the notice was withdrawn.', confirmLabel: 'Withdraw', onYes: async () => { const { error } = await Backend.sb.rpc('cancel_removal_notice', { p_id: d.id }); if (error) return toast(rpcMessage(error)); await __M_src_features_requests_js.Roles.load(); render(); toast('Notice withdrawn. They were told.', 'ok'); } }),
  noticeFinish: d => __M_src_ui_toast_js.Pop.confirm({ title: 'End their access now?', text: 'The notice period is over. Their records stay in the books.', confirmLabel: 'End access', danger: true, onYes: async () => { const { error } = await Backend.sb.rpc('finish_removal', { p_id: d.id }); if (error) return toast(rpcMessage(error)); await Session.loadAccess(); await __M_src_features_requests_js.Roles.load(); render(); toast('Access ended. Their records are kept.', 'ok'); } }),
  noticeReply: d => Modal.open({ title: 'Reply to the treasurer', submitLabel: 'Send reply', fields: [{ name: 'r', label: 'Your reply', type: 'textarea', required: true, placeholder: 'e.g. I lost my job in March. I can pay the arrears by June.' }],
    onSubmit: v => { const r = String(v.r || '').trim(); if (r.length < 5) throw new Error('Write a short reply'); setTimeout(async () => { const { error } = await Backend.sb.rpc('reply_removal_notice', { p_id: d.id, p_reply: r }); if (error) return toast(rpcMessage(error)); await __M_src_features_requests_js.Roles.load(); render(); toast('Reply sent to the treasurer', 'ok'); }, 0); } }),
  loadAccess: () => Session.loadAccess(),
  resendInvite: async d => {
    try {
      const r = await Session.sendInvite('resend', { invitation_id: d.i });
      if (r.unavailable) return toast('Invitation not renewed. The invitation service did not answer.');
      toast(r.email_status === 'sent' ? 'Invitation sent again. The old link no longer works' : 'Invitation renewed, but the email was not sent (' + (r.email_error || r.email_status) + ')');
      await Session.loadInvites();
    } catch (e) { toast(e.message); }
  },
  revokeInvite: async d => {
    const { error } = await Backend.sb.rpc('revoke_invitation', { p_id: d.i });
    if (error) return toast(error.message);
    toast('Invitation cancelled', 'info'); await Session.loadInvites();
  },
  chamaEdit: { admin: true, run: d => chamaEditSheet(d.f) },
  rulesEdit: { admin: true, run: () => chamaEditSheet('rules') },
  /* the Chama's own photo: only the treasurer sets or removes it; members see it in the chooser, settings and documents */
  chamaPhoto: { admin: true, run() {
    const c = S().chama, has = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(c.photo || '');
    __M_src_features_requests_js.Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('camera')}</span><h3>Chama photo</h3><p>It shows when people choose a Chama, on the Chama page and on statements.</p></div>
<div class="ch-pick">${has ? `<img src="${c.photo}" alt="Current Chama photo">` : `<span>${esc(String(c.name || 'C').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase())}</span>`}</div>
<label class="btn pri block lg" for="chPhotoIn">${icon('camera')}${has ? 'Choose a new photo' : 'Choose a photo'}<input type="file" id="chPhotoIn" accept="image/*" hidden></label>
${has ? '<button type="button" class="btn ghost block" style="margin-top:8px" data-act="chamaPhotoRemove">Remove the photo</button>' : ''}`, { key: 'chamaPhoto', label: 'Chama photo' });
    const inp = document.getElementById('chPhotoIn');
    if (inp) inp.addEventListener('change', async () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      try {
        const url = await new Promise((ok, no) => { const img = new Image(), u = URL.createObjectURL(f); img.onload = () => { URL.revokeObjectURL(u); const n = Math.min(img.width, img.height); if (!n) return no(new Error('That picture is empty')); const cv = document.createElement('canvas'); cv.width = cv.height = 240; cv.getContext('2d').drawImage(img, (img.width - n) / 2, (img.height - n) / 2, n, n, 0, 0, 240, 240); let q = .82, d = cv.toDataURL('image/jpeg', q); while (d.length > 40000 && q > .4) { q -= .1; d = cv.toDataURL('image/jpeg', q); } ok(d); }; img.onerror = () => { URL.revokeObjectURL(u); no(new Error('That file is not a picture. Try a JPG or PNG.')); }; img.src = u; });
        Store.commit(st => { st.chama = { ...st.chama, photo: url }; });
        __M_src_features_requests_js.Sheet.close(); toast('Chama photo saved. Everyone sees it now.', 'ok');
      } catch (e) { toast(e.message); }
    });
  } },
  chamaPhotoRemove: { admin: true, run() { Store.commit(st => { const c = { ...st.chama }; delete c.photo; st.chama = c; }); __M_src_features_requests_js.Sheet.close(); toast('Chama photo removed', 'info'); } },
  aboutEdit: () => { try { localStorage.removeItem('mca-about-v2:' + ((Session.user && Session.user.id) || '')); } catch (e) {} __M_src_features_guide_js.About.check(); },
  aboutClear: () => __M_src_ui_toast_js.Pop.confirm({ title: 'Remove these details?', text: 'Your date of birth, gender and phone number are deleted. Simple view stays as it is.', confirmLabel: 'Remove', danger: true,
    onYes: async () => {
      const uid = (Session.user && Session.user.id) || '';
      try { localStorage.removeItem('mca-about:data:' + uid); } catch (e) {}
      const { error } = await Backend.sb.rpc('clear_my_details', { p_what: ['phone', 'birth_date', 'gender'] });
      if (error && !/Could not find the function|PGRST202|schema cache/i.test(error.message || '')) return toast(error.message);
      if (error) { const r = await Backend.sb.rpc('set_my_profile', { p_full_name: null, p_phone: '', p_username: null }); if (r.error) return toast('Removed from this phone. The server part needs the latest update.'); }
      toast('Removed', 'ok');
    } }),
  chamaSave: { admin: true, run(d) {
    const raw = String(($('#chV') || {}).value || '').trim(), f = d.f; let val;
    if (f === 'name') { val = raw.replace(/\s+/g, ' '); if (val.length < 2 || val.length > 80) throw new Error('Chama name must be 2 to 80 characters'); }
    else if (f === 'mode') val = raw === 'savings' ? 'savings' : 'rotation';
    else if (f === 'startMonth') { if (!/^\d{4}-\d{2}$/.test(raw)) throw new Error('Choose a month'); val = raw; }
    else if (f === 'payTo') val = raw.slice(0, 60);
    else if (f === 'rules') val = raw.slice(0, 1500);
    else if (f === 'dueDay') { val = Math.round(num(raw, 'Due day', { min: 1 })); if (val > 28) throw new Error('Due day must be 1 to 28'); }
    else if (f === 'loanRate') { val = num(raw, 'Rate', { allowZero: true }); if (val > 100) throw new Error('Interest above 100% a month is not allowed'); }
    else if (f === 'finePerLate') val = num(raw, 'Fine', { allowZero: true });
    else if (f === 'monthly') val = num(raw, 'Contribution');
    Store.commit(s => { s.chama = { ...s.chama, [f]: val }; });
    __M_src_features_requests_js.Sheet.close(); toast('Saved', 'ok');
  } },
  settings: { admin: true, run() {
    const c = S().chama;
    Modal.open({ title: 'Chama details', fields: [
      { name: 'name', label: 'Chama name', value: c.name, required: true },
      { name: 'monthly', label: 'Monthly contribution per share (KES)', type: 'number', value: c.monthly },
      { name: 'dueDay', label: 'Due by day of the month (1 to 28)', type: 'number', value: c.dueDay },
      { name: 'finePerLate', label: 'Late fine (KES)', type: 'number', value: c.finePerLate },
      { name: 'loanRate', label: 'Default loan interest (% a month, flat)', type: 'number', value: c.loanRate },
      { name: 'mode', label: 'Chama type', type: 'select', value: c.mode, options: [['rotation', 'Merry-go-round (the pot rotates)'], ['savings', 'Savings or table banking (no rotation)']] },
      { name: 'startMonth', label: 'First payout month', type: 'month', value: c.startMonth },
      { name: 'payTo', label: 'Pay to (till, paybill or number), shown in reminders', value: c.payTo }],
      onSubmit: v => {
        const name = String(v.name || '').trim().replace(/\s+/g, ' ');
        if (name.length < 2 || name.length > 80) throw new Error('Chama name must be 2 to 80 characters');
        const d = { name, mode: v.mode === 'savings' ? 'savings' : 'rotation', payTo: String(v.payTo || '').trim().slice(0, 60), startMonth: /^\d{4}-\d{2}$/.test(v.startMonth || '') ? v.startMonth : c.startMonth,
          monthly: num(v.monthly, 'Contribution'), dueDay: Math.round(num(v.dueDay, 'Due day', { min: 1 })), finePerLate: num(v.finePerLate, 'Fine', { allowZero: true }), loanRate: num(v.loanRate, 'Rate', { allowZero: true }) };
        if (d.dueDay > 28) throw new Error('Due day must be 1 to 28');
        if (d.loanRate > 100) throw new Error('Interest above 100% a month is not allowed');
        Store.commit(s => { s.chama = { ...s.chama, ...d }; });
        toast('Chama details saved');
      } });
  } },
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/notifications/notify.js ---- */
const __M_src_features_notifications_notify_js = (function () {
const { APP } = __M_src_content_app_info_js;
const { Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { Me } = __M_src_core_me_js;
const { render } = __M_src_core_rerender_js;
const { ROUTES } = __M_src_core_routes_js;
const { Store } = __M_src_core_store_js;
const { esc, kes, monthLabel, uid } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { toast } = __M_src_ui_toast_js;

/* =====================================================================
   5a. NOTIFICATIONS
   Events are written into state.notes inside the same commit as the change,
   so they sync with the chama. Reminders are worked out from the records.
   Read state is per phone and per viewer. An item becomes read only when its
   detail page is opened (or it is marked read from there or from the list).
   ===================================================================== */
const NOTE_TYPES = {
  payment_confirmed:     { cat: 'financial', icon: 'wallet', tone: 'financial', label: 'Payment recorded' },
  payment_reversed:      { cat: 'financial', icon: 'wallet', tone: 'warn', label: 'Payment reversed', high: true },
  contribution_due_soon: { cat: 'financial', icon: 'alert', tone: 'warn', label: 'Contribution due soon' },
  contribution_overdue:  { cat: 'financial', icon: 'alert', tone: 'danger', label: 'Contribution overdue', high: true },
  late_summary:          { cat: 'group', icon: 'users', tone: 'group', label: 'Late contributions', high: true },
  password_changed:      { cat: 'system', icon: 'shield', tone: 'danger', label: 'Security', mandatory: true, high: true },
  release_published:     { cat: 'system', icon: 'doc', tone: 'system', label: 'App update' },
  /* written by the server (table chama_notifications), one row per person */
  join_request:          { cat: 'group', icon: 'users', tone: 'warn', label: 'Join request', high: true, mandatory: true },
  join_approved:         { cat: 'group', icon: 'shield', tone: 'financial', label: 'Approved', high: true },
  join_declined:         { cat: 'group', icon: 'alert', tone: 'danger', label: 'Request declined', high: true },
  member_joined:         { cat: 'group', icon: 'users', tone: 'group', label: 'New member' },
  member_left:           { cat: 'group', icon: 'users', tone: 'warn', label: 'Member left', high: true },
  member_removed:        { cat: 'group', icon: 'users', tone: 'warn', label: 'Access removed', high: true },
  access_removed:        { cat: 'group', icon: 'alert', tone: 'danger', label: 'Access removed', high: true, mandatory: true },
  member_linked:         { cat: 'group', icon: 'users', tone: 'financial', label: 'Member list' },
  role_changed:          { cat: 'group', icon: 'shield', tone: 'group', label: 'Your role', high: true, mandatory: true },
  role_changed_all:      { cat: 'group', icon: 'users', tone: 'group', label: 'Roles' },
  ownership:             { cat: 'group', icon: 'shield', tone: 'warn', label: 'New treasurer', high: true },
  role_offer:            { cat: 'group', icon: 'key', tone: 'warn', label: 'Role offered to you', high: true, mandatory: true },
  role_offer_declined:   { cat: 'group', icon: 'users', tone: 'warn', label: 'Role declined', high: true },
  removal_notice:        { cat: 'group', icon: 'alert', tone: 'danger', label: 'Access notice', high: true, mandatory: true },
  removal_notice_officers: { cat: 'group', icon: 'users', tone: 'warn', label: 'Access notice' },
  removal_reply:         { cat: 'group', icon: 'chat', tone: 'warn', label: 'Reply to notice', high: true },
  removal_cancelled:     { cat: 'group', icon: 'shield', tone: 'financial', label: 'Notice withdrawn', high: true },
  access_removed_reason: { cat: 'group', icon: 'alert', tone: 'danger', label: 'Access removed', high: true, mandatory: true },
  member_left_reason:    { cat: 'group', icon: 'users', tone: 'warn', label: 'Reason for leaving' },
  payment_claimed:       { cat: 'financial', icon: 'wallet', tone: 'warn', label: 'Says they paid', high: true },
  message_announcement:  { cat: 'messages', icon: 'bell', tone: 'group', label: 'Announcement', high: true },
  message_meeting:       { cat: 'messages', icon: 'doc', tone: 'group', label: 'Meeting', high: true },
  message_minutes:       { cat: 'messages', icon: 'doc', tone: 'system', label: 'Minutes' },
  message_poll:          { cat: 'messages', icon: 'users', tone: 'group', label: 'Vote' },
  message_payment_request: { cat: 'financial', icon: 'wallet', tone: 'warn', label: 'Payment request', high: true },
  message_statement:     { cat: 'financial', icon: 'doc', tone: 'financial', label: 'Statement' }
};

const NOTE_CAT_LABEL = { financial: 'Money', group: 'People', messages: 'Messages', system: 'App' };

const NOTE_ICON = {
  wallet: '<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7l12-3v3"/><circle cx="16.5" cy="13.5" r="1"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c.7-3.3 3.1-5.2 6-5.2s5.3 1.9 6 5.2"/><path d="M16 4.6a3.3 3.3 0 0 1 0 6.4M18 14.8c1.7.6 2.7 2.2 3 4.6"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9.5 12l2 2 3.5-4"/>',
  doc: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 14.5 6 8z"/><path d="M10.2 20.2a2 2 0 0 0 3.6 0"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'
};

const NOTE_SYN = { money: ['kes', 'payment', 'contribution', 'financial'], pay: ['payment'], paid: ['payment'], late: ['overdue', 'late', 'owed', 'due'], due: ['due', 'owed'], owed: ['owed', 'due'], security: ['pin', 'security'], update: ['version', 'app', 'update'], version: ['version'], group: ['group', 'treasurer'] };

const NOTE_LIST_CATS = ['financial', 'group', 'messages', 'system'];

const svgIcon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NOTE_ICON[k] || ''}</svg>`;

const Notify = {
  filter: 'all', q: '', lastCount: null, server: [], _chan: null, _timer: 0,
  /* the server's notifications for this person in this Chama, live */
  async loadServer() {
    const Backend = __M_src_core_backend_js.Backend, Session = __M_src_core_session_js.Session;
    if (!Backend.sb || !Session.user || !Store.chamaId) return;
    const { data, error } = await Backend.sb.from('chama_notifications').select('id,kind,title,body,link,priority,created_at,read_at,data')
      .eq('chama_id', Store.chamaId).order('created_at', { ascending: false }).limit(150);
    if (error) return;
    const before = new Set(this.server.map(n => n.id)), first = !this._loaded;
    this.server = data || []; this._loaded = true;
    /* only what arrived while the app was open is acted on; old unread items never trigger anything (that caused a reload loop) */
    const fresh = first ? [] : this.server.filter(n => !before.has(n.id) && !n.read_at);
    if (fresh.length) {
      const top = fresh[0];
      toast(top.title, 'info', top.link && /^#\/[\w/-]*$/.test(top.link) ? { label: 'View', run: () => { location.hash = top.link; } } : null);
      if (fresh.some(n => n.kind === 'join_request')) { try { __M_src_features_requests_js.Requests.refresh(true); } catch (e) {} }
      if (fresh.some(n => /^(role_changed|access_removed|ownership)$/.test(n.kind))) { try { __M_src_core_session_js.Session.refreshRole(); } catch (e) {} }
      if (fresh.some(n => /^(role_offer|role_offer_declined|removal_|access_removed_reason)/.test(n.kind))) { try { __M_src_features_requests_js.Roles.check(); } catch (e) {} }
      /* someone changed the books, the people or the list: fetch the latest without a reload */
      try { Store.reload().catch(() => {}); } catch (e) {}
      try { __M_src_core_session_js.Session.loadAccess().catch(() => {}); __M_src_core_session_js.Session.loadMemberPics().catch(() => {}); } catch (e) {}
    }
    render();
  },
  watch() {
    const Backend = __M_src_core_backend_js.Backend, Session = __M_src_core_session_js.Session;
    if (!Backend.sb || !Session.user || this._chan) return;
    this.loadServer().catch(() => {});
    try {
      this._chan = Backend.sb.channel('n-' + Session.user.id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chama_notifications', filter: 'recipient=eq.' + Session.user.id },
        p => { if (p.new && p.new.chama_id === Store.chamaId) this.loadServer().catch(() => {}); }).subscribe();
    } catch (e) { /* the timer below still keeps the list fresh */ }
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (!document.hidden) this.loadServer().catch(() => {}); }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.loadServer().catch(() => {}); });
  },
  serverItems() {
    return this.server.map(n => ({ id: 'srv:' + n.id, sid: n.id, type: n.kind, to: 'all', title: n.title, body: n.body || '', dest: n.link || null,
      destLabel: /chat/.test(n.link || '') ? 'message' : /requests/.test(n.link || '') ? 'request' : /members/.test(n.link || '') ? 'members' : 'details',
      facts: [['When', this.when(Date.parse(n.created_at))]], ts: Date.parse(n.created_at), srvRead: !!n.read_at, action: n.priority === 'action' }));
  },
  viewer() { const me = Me.get(), admin = Auth.isAdmin(); return { admin, memberId: me.memberId || null, key: (admin ? 'treasurer' : 'member') + ':' + (me.memberId || 'none') }; },
  prefs() {
    let p = {}; try { p = JSON.parse(localStorage.getItem(this.prefKey()) || '{}') || {}; } catch {}
    return { cat: { financial: true, group: true, messages: true, system: true, ...(p.cat || {}) }, preview: p.preview !== false };
  },
  prefKey() { const u = __M_src_core_session_js.Session.user; return 'chama:notif:prefs:' + Store.chamaId + ':' + (u ? u.id : 'anon'); },
  savePrefs(p) { try { localStorage.setItem(this.prefKey(), JSON.stringify(p)); } catch { toast('Storage full'); } },
  readKey() { const u = __M_src_core_session_js.Session.user; return 'chama:notif:read:' + Store.chamaId + ':' + (u ? u.id : '') + ':' + this.viewer().key; },
  readSet() { try { return new Set(JSON.parse(localStorage.getItem(this.readKey()) || '[]')); } catch { return new Set(); } },
  writeSet(set) { try { localStorage.setItem(this.readKey(), JSON.stringify([...set].slice(-800))); } catch { toast('Storage full'); } },
  markRead(ids) {
    const set = this.readSet(); ids.forEach(id => set.add(id)); this.writeSet(set);
    const srv = ids.filter(id => String(id).indexOf('srv:') === 0).map(id => id.slice(4));
    const Backend = __M_src_core_backend_js.Backend;
    if (srv.length && Backend.sb) {
      this.server.forEach(n => { if (srv.includes(n.id) && !n.read_at) n.read_at = new Date().toISOString(); });
      Backend.sb.rpc('mark_notifications_read', { p_ids: srv }).then(() => {}, () => {});
    }
  },
  dayKey: ts => new Date(ts).toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }),
  when: ts => new Date(ts).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  ago(ts) {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + 'm ago';
    const h = Math.round(m / 60); if (h < 24) return h + 'h ago';
    const d = Math.round(h / 24); if (d < 7) return d + 'd ago';
    return new Date(ts).toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi', day: 'numeric', month: 'short' });
  },
  make(type, entity, to, title, body, dest, destLabel, ts, facts) {
    return { id: uid(), key: type + ':' + entity + ':' + to + ':' + ts, type, to, title, body, dest: dest || null, destLabel: destLabel || null, facts: facts || [], ts };
  },
  /* called from Log.record, so each note is written in the same commit as its change */
  fromChange(a, b) {
    const out = [], ts = Date.now();
    const A = new Map((a.payments || []).map(x => [x.id, x])), B = new Map((b.payments || []).map(x => [x.id, x]));
    const facts = x => [['Member', Domain.memberName(b, x.memberId)], ['Amount', kes(x.amount)], ['Month', monthLabel(x.month)]];
    B.forEach((x, id) => { if (!A.has(id)) out.push(this.make('payment_confirmed', id, x.memberId, 'Payment recorded', `${kes(x.amount)} for ${monthLabel(x.month)} has been recorded.`, '#/grid', 'contributions', ts, facts(x))); });
    A.forEach((x, id) => { if (!B.has(id)) out.push(this.make('payment_reversed', id, x.memberId, 'Payment reversed', `${kes(x.amount)} for ${monthLabel(x.month)} has been removed from the records.`, '#/grid', 'contributions', ts, facts(x))); });
    if (a.chama.pin !== b.chama.pin) out.push(this.make('password_changed', 'pin', 'treasurer', 'Treasurer PIN changed', 'The PIN that opens treasurer mode was changed. If this was not you, see Help.', '#/settings/actions', 'treasurer mode', ts, [['Changed', this.when(ts)]]));
    if (out.length) b.notes = [...out, ...(b.notes || [])].slice(0, 200);
  },
  derived(s, v) {
    const out = [], mk = Domain.now(), now = new Date(), [y, mo] = mk.split('-').map(Number), dueDay = Number(s.chama.dueDay) || 10, d = now.getDate();
    if (v.memberId && s.members.some(m => m.id === v.memberId) && Domain.status(s, v.memberId, mk) !== 'na') {
      const owed = Domain.outstanding(s, v.memberId, mk);
      if (owed > 0 && d >= dueDay - 3) {
        const late = d > dueDay, type = late ? 'contribution_overdue' : 'contribution_due_soon';
        out.push({ id: `derived:${type}:${v.memberId}:${mk}`, type, to: v.memberId,
          title: late ? 'Contribution overdue' : 'Contribution due soon',
          body: `${kes(owed)} is still owed. ${late ? 'It was due by day ' + dueDay + '.' : 'It is due by day ' + dueDay + ' of this month.'}`,
          dest: '#/grid', destLabel: 'contributions', facts: [['Still owed', kes(owed)], ['Due by', 'Day ' + dueDay], ['Month', monthLabel(mk)]],
          ts: Math.min(Date.now(), new Date(y, mo - 1, dueDay, 9).getTime()) });
      }
    }
    if (v.admin && Domain.isOverdue(s, mk)) {
      const late = Domain.lateMembers(s, mk);
      if (late.length) out.push({ id: `derived:late_summary:${mk}`, type: 'late_summary', to: 'treasurer',
        title: 'Late contributions', body: `${late.length} ${late.length === 1 ? 'member still owes' : 'members still owe'} for ${monthLabel(mk)}.`,
        dest: '#/grid', destLabel: 'contributions', facts: [['Members late', String(late.length)], ['Month', monthLabel(mk)]],
        ts: Math.min(Date.now(), new Date(y, mo - 1, dueDay + 1, 9).getTime()) });
    }
    return out;
  },
  releases() {
    const ts = Date.parse(APP.released) || 0;
    return APP.notes.slice(0, 1).map(([ver, text], i) => ({ id: 'release:' + ver, type: 'release_published', to: 'all', title: `Version ${ver} is out`, body: text, dest: null, facts: [['Version', ver], ['Released', APP.released]], ts: ts - i * 60000 }));
  },
  visible(n, v, p) {
    if (!n.mand && p.cat[n.cat] === false) return false;
    if (n.to === 'all') return true;
    if (n.to === 'treasurer') return v.admin;
    if (v.memberId && n.to === v.memberId) return true;
    return v.admin && n.cat === 'financial';
  },
  list(s) {
    const v = this.viewer(), p = this.prefs();
    const all = [...(s.notes || []), ...this.derived(s, v), ...this.releases(), ...this.serverItems()].map(n => {
      const t = NOTE_TYPES[n.type] || {};
      return { ...n, cat: t.cat || 'system', icon: t.icon || 'bell', tone: t.tone || 'system', label: t.label || 'Update', mand: !!t.mandatory, prio: t.high ? 'high' : 'normal' };
    });
    return all.filter(n => this.visible(n, v, p)).sort((x, y) => y.ts - x.ts);
  },
  isRead(n, r) { return n.srvRead || r.has(n.id); },
  unread(s) { const r = this.readSet(); return this.list(s).filter(n => !this.isRead(n, r)).length; },
  toggleRead(id) {
    const r = this.readSet(), n = this.server.find(x => 'srv:' + x.id === id);
    if (n && n.read_at) { n.read_at = null; r.delete(id); this.writeSet(r); return render(); }
    if (r.has(id)) r.delete(id); else return this.markRead([id]), render();
    this.writeSet(r); render();
  },
  markAll() { this.markRead(this.list(Store.get()).map(n => n.id)); render(); toast('All marked as read'); },
  setCat(k) {
    if (k === 'security') return toast('Security alerts cannot be turned off');
    const p = this.prefs(); p.cat[k] = !p.cat[k]; this.savePrefs(p); render(); toast('Saved');
  },
  togglePreview() { const p = this.prefs(); p.preview = !p.preview; this.savePrefs(p); render(); toast('Saved'); },
  resetPrefs() { this.savePrefs({ cat: { financial: true, group: true, messages: true, system: true }, preview: true }); render(); toast('Back to normal'); },
  chipPass(n, chip, rs) { return chip === 'all' || (chip === 'unread' ? !this.isRead(n, rs) : n.cat === chip); },
  tokenMatch(n, t, rs) {
    if (t === 'unread') return !this.isRead(n, rs);
    if (t === 'read') return this.isRead(n, rs);
    if (t === 'today') return this.dayKey(n.ts) === this.dayKey(Date.now());
    let hay = [n.title, n.body, NOTE_CAT_LABEL[n.cat], n.label, this.dayKey(n.ts), this.when(n.ts), ...(n.facts || []).map(f => f[1])].join(' ').toLowerCase();
    hay = hay + ' ' + hay.replace(/,/g, '');
    return hay.includes(t) || (NOTE_SYN[t] || []).some(x => hay.includes(x));
  },
  rowHTML(n, rs) {
    const unread = !this.isRead(n, rs), show = this.prefs().preview;
    return `<a class="ncard${unread ? ' unread' : ''}" href="#/notifications/${encodeURIComponent(n.id)}"${unread ? ' aria-label="Unread: ' + esc(n.title) + '"' : ''}><span class="nico ${esc(n.tone)}">${svgIcon(n.icon)}</span><span class="nmain"><span class="ntop"><b>${esc(n.title)}</b><time>${esc(this.ago(n.ts))}</time></span><span class="nbody">${show ? esc(n.body) : 'Open to read'}</span><span class="nmeta"><span class="ncat">${esc(NOTE_CAT_LABEL[n.cat])}</span>${n.prio === 'high' ? '<span class="pill">Important</span>' : ''}</span></span></a>`;
  },
  listHTML(s) {
    const rs = this.readSet(), q = this.q.trim().toLowerCase(), toks = q ? q.split(/\s+/) : [];
    const items = this.list(s).filter(n => this.chipPass(n, this.filter, rs)).filter(n => !toks.length || toks.every(t => this.tokenMatch(n, t, rs)));
    if (!items.length) return `<div class="card">${toks.length ? emptyState('lost', 'No matches', 'Nothing matches “' + esc(this.q.trim()) + '”. Try a shorter word, or clear the search.') : this.filter === 'unread' ? emptyState('done', 'All caught up', 'You have read everything.') : emptyState('done', 'Nothing here yet', 'Payments and app updates will show up here.')}</div>`;
    return '<div class="list">' + items.map(n => this.rowHTML(n, rs)).join('') + '</div>';
  },
  paintBell(s, r) {
    const bell = $('#bell'), badge = $('#nbCount'), n = this.unread(s);
    bell.hidden = !ROUTES.some(x => x[0] === r);
    { const gb = document.getElementById('guideBtn'); if (gb) gb.hidden = bell.hidden; }
    bell.setAttribute('aria-label', n ? `Notifications, ${n} unread` : 'Notifications');
    badge.hidden = !n; badge.textContent = n > 99 ? '99+' : String(n);
    if (this.lastCount !== null && n > this.lastCount && !bell.hidden) {
      bell.classList.remove('ring'); void bell.offsetWidth; bell.classList.add('ring');
      setTimeout(() => bell.classList.remove('ring'), 1000);
    }
    this.lastCount = n;
  }
};

return { get NOTE_TYPES() { return NOTE_TYPES; }, get NOTE_CAT_LABEL() { return NOTE_CAT_LABEL; }, get NOTE_ICON() { return NOTE_ICON; }, get NOTE_SYN() { return NOTE_SYN; }, get NOTE_LIST_CATS() { return NOTE_LIST_CATS; }, get svgIcon() { return svgIcon; }, get Notify() { return Notify; }, };
})();

/* ---- src/features/notifications/index.js ---- */
const __M_src_features_notifications_index_js = (function () {
const { Account } = __M_src_features_account_deletion_js;
const { render } = __M_src_core_rerender_js;
const { esc } = __M_src_core_utils_js;
const { NOTE_CAT_LABEL, NOTE_LIST_CATS, Notify, svgIcon } = __M_src_features_notifications_notify_js;

const views = {
  notifications(s) {
    const rs = Notify.readSet(), all = Notify.list(s);
    const count = k => all.filter(n => Notify.chipPass(n, k, rs)).length;
    const unreadN = count('unread');
    const chips = [['all', 'All'], ['unread', 'Unread'], ...NOTE_LIST_CATS.map(c => [c, NOTE_CAT_LABEL[c]])];
    const chipBar = `<div class="chips" role="group" aria-label="Filter notifications">${chips.map(([k, t]) => `<button class="chip" aria-pressed="${Notify.filter === k}" data-act="noteFilter" data-v="${k}">${esc(t)}${k === 'unread' && unreadN ? ` <span class="cnt">${unreadN > 99 ? '99+' : unreadN}</span>` : ''}</button>`).join('')}</div>`;
    return `<h1 class="lt">Notifications</h1>
      <div class="nsearch"><label><svg class="mag ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS.search}</svg><span class="vh">Search notifications</span><input id="notifQ" type="search" placeholder="Search, e.g. unread, KES, late" value="${esc(Notify.q)}" autocomplete="off"></label><a class="hb" href="#/notifications/settings" aria-label="Notification settings">${icon('sliders')}</a></div>`
      + chipBar
      + `<div class="nbar"><span class="mute">${unreadN ? unreadN + ' unread' : 'All caught up'}</span>${unreadN ? '<button class="btn ghost sm" data-act="noteAll">Mark all as read</button>' : ''}</div>`
      + Account.noticesHTML(s)
      + `<div id="notifList">${Notify.listHTML(s)}</div>`;
  },
  notificationDetail(s, r) {
    const id = decodeURIComponent(r.slice('notifications/'.length));
    const n = Notify.list(s).find(x => x.id === id);
    if (!n) return `<div class="card">${emptyState('lost', 'No longer available', 'This notification was removed or has expired.', '<a class="btn pri" href="#/notifications">Back to notifications</a>')}</div>`;
    const unread = !Notify.isRead(n, Notify.readSet());
    const facts = n.facts.map(([k, v]) => `<div class="kv"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
    return `<article class="ndetail">
      <div class="nhero"><span class="nico ${esc(n.tone)}">${svgIcon(n.icon)}</span><div><span class="ncat">${esc(NOTE_CAT_LABEL[n.cat])}</span>${n.prio === 'high' ? ' <span class="pill">Important</span>' : ''}</div></div>
      <h1 class="ntitle">${esc(n.title)}</h1>
      <p class="nwhen">${esc(Notify.when(n.ts))} · Nairobi time</p>
      <p class="nfull">${esc(n.body)}</p>
      ${facts ? `<div class="card facts">${facts}</div>` : ''}
      <div class="btns">${n.dest && /^#\/[\w/-]*$/.test(String(n.dest)) ? `<a class="btn pri grow" href="${esc(n.dest)}">View ${esc(n.destLabel || 'details')}</a>` : ''}<button class="btn grow" data-act="noteToggle" data-id="${esc(n.id)}">${unread ? 'Mark as read' : 'Mark as unread'}</button></div>
    </article>`;
  },
  'notifications/settings'(s) {
    const p = Notify.prefs();
    const row = (k, ic, tone, t, h, on, locked) => `<div class="li has-ic"><span class="nico ${tone}" style="width:32px;height:32px;border-radius:9px">${svgIcon(ic)}</span><span class="li-main"><b>${esc(t)}</b><small>${esc(h)}</small></span><button type="button" class="sw${locked ? ' lock' : ''}" role="switch" aria-checked="${on}" aria-label="${esc(t)}" ${locked ? 'aria-disabled="true"' : ''} data-act="notePref" data-k="${k}"></button></div>`;
    return `<h1 class="lt">Notification settings</h1><p class="lt-sub">In the app for now. Saved on this phone only.</p>`
      + `<div class="list">`
      + row('financial', 'wallet', 'financial', 'Money', 'Payments recorded or reversed, and due dates', p.cat.financial !== false, false)
      + row('group', 'users', 'group', 'People', 'Join requests, people joining or leaving, role changes', p.cat.group !== false, false)
      + row('messages', 'bell', 'group', 'Messages', 'Announcements, meetings, minutes and votes', p.cat.messages !== false, false)
      + row('system', 'doc', 'system', 'App updates', 'New versions of this app', p.cat.system !== false, false)
      + row('security', 'shield', 'danger', 'Security alerts', 'Always on', true, true)
      + `</div>`
      + `<section class="sec"><div class="list"><div class="li"><span class="li-main"><b>Show message text in the list</b><small>Off keeps messages hidden until you open them, for privacy on shared phones</small></span><button type="button" class="sw" role="switch" aria-checked="${p.preview}" aria-label="Show message text in the list" data-act="notePreview"></button></div></div></section>`
      + `<div class="btns"><button class="btn" data-act="notePrefReset">Reset to default</button></div>`;
  },
};

const actions = {
  noteToggle: d => Notify.toggleRead(d.id),
  noteAll: () => Notify.markAll(),
  noteFilter: d => { Notify.filter = d.v; render(); },
  notePref: d => Notify.setCat(d.k),
  notePreview: () => Notify.togglePreview(),
  notePrefReset: () => Notify.resetPrefs(),
};

return { get views() { return views; }, get actions() { return actions; }, };
})();

/* ---- src/features/help/index.js ---- */
const __M_src_features_help_index_js = (function () {
const { render } = __M_src_core_rerender_js;
const { Help } = __M_src_lib_help_js;

const actions = {
  helpCat: d => { Help.cat = d.v; render(); },
  helpVote: d => Help.vote(d.id, d.v),
  helpCheck: () => Help.runChecks(),
  helpCopy: () => Help.copyReport(),
  helpShare: () => Help.shareReport(),
};

return { get actions() { return actions; }, };
})();

/* ---- src/features/auth/index.js ---- */
const __M_src_features_auth_index_js = (function () {
const { Modal } = __M_src_ui_modal_js;
const { Backend } = __M_src_core_backend_js;
const { render } = __M_src_core_rerender_js;
const { Session, Invite, Perm } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { esc } = __M_src_core_utils_js;
const { Gate, Otp, OB, GL } = __M_src_features_auth_gate_js;
const { $ } = __M_src_lib_dom_js;
const { validEmail } = __M_src_lib_validate_js;
const { toast } = __M_src_ui_toast_js;

/* the email code confirms an email address: for a new account, and for a forgotten password. It never creates an account while resetting. */
const plainOtpError = (m) => {
  const t = String(m || '');
  const sw = OB.lang() === 'sw';
  if (/already registered|already exists|already been registered|user already/i.test(t)) return sw ? 'Barua pepe hii tayari ina akaunti. Ingia badala yake.' : 'This email already has an account. Sign in instead.';
  if (/rate|too many|once every|security purposes/i.test(t)) return sw ? 'Subiri kidogo, kisha ujaribu tena.' : 'Please wait a moment, then try again.';
  if (/^[_a-z0-9]+$/.test(t) || /error_code|validation_failed|status/i.test(t)) return sw ? 'Imeshindikana kutuma msimbo. Jaribu tena.' : 'Could not send the code. Try again.';
  return t || (sw ? 'Imeshindikana kutuma msimbo. Jaribu tena.' : 'Could not send the code. Try again.');
};
const gateSendCode = async (email, btn) => {
  const typed = Gate.mode === 'up' ? (Gate.email || email) : email;
  try { sessionStorage.setItem('mca-intent', Gate.mode); } catch (e) {}
  if (Gate.mode === 'forgot') Session.markReset(email);
  Session.markCodeAsked(email);
  Gate.email = typed; Gate.notice = ''; Gate.sending = true; if (btn) btn.disabled = true; Gate.paint();
  const t0 = Date.now();
  const { error } = await Backend.sb.auth.signInWithOtp({ email, options: { shouldCreateUser: Gate.mode === 'up' } });
  await new Promise(r => setTimeout(r, Math.max(0, 900 - (Date.now() - t0))));
  Gate.sending = false;
  /* while resetting, an unknown email must look the same as a known one: no error, the code simply never arrives */
  if (error && !(Gate.mode === 'forgot' && /signups? not allowed|not found/i.test(error.message))) {
    Gate.email = typed;
    const msg = plainOtpError(error.message);
    if (Gate.mode === 'up') { Gate.notice = msg; Gate.paint(); return; }
    Gate.paint(); return toast(msg);
  }
  Gate.email = email; Gate.coolUntil = Date.now() + 60000; Gate.sent = true; render();
  try { Otp.start(); } catch (e) { /* the code screen still works without the resend timer */ }
};
const armUpCool = () => Gate.armCool();
Store.setConflictHandler(info => {
  Store.setSync('offline');
  Modal.open({ title: 'Someone else saved changes', body: `<p class="plain">Another treasurer changed this Chama while you were working. Nothing has been overwritten yet. Choose which version to keep.</p>
<div class="btns col"><button type="button" class="btn pri" data-act="conflictTheirs">Load the latest (drop my unsent changes)</button>
<button type="button" class="btn bad" data-act="conflictMine">Keep my changes (replace theirs)</button></div>
<p class="fhelp">If you close this, nothing is saved until you choose.</p>` });
  Store._conflict = info;
});
const lowerNoSpace = v => String(v || '').trim().toLowerCase();

const actions = {
  conflictTheirs: () => { const c = Store._conflict; Modal.close(); if (c) c.useTheirs(); },
  conflictMine: () => { const c = Store._conflict; Modal.close(); if (c) c.keepMine(); },
  togglePw: d => { const id = (d && d.for) || 'gatePw', i = document.getElementById(id); if (!i) return; const show = i.type === 'password'; i.type = show ? 'text' : 'password'; const b = document.querySelector(`[data-act="togglePw"][data-for="${id}"]`) || document.querySelector('[data-act="togglePw"]'); if (b) { b.textContent = show ? GL().hide : GL().show; b.setAttribute('aria-pressed', show ? 'true' : 'false'); } Gate.pwShown = Object.assign({}, Gate.pwShown, { [id]: show }); },
  gateSignIn: async () => {
    if (Gate.signing) return;
    OB.agree('continue:sign-in');
    const idEl = document.getElementById('gateId'), pwEl = document.getElementById('gatePw');
    const rawId = (idEl && idEl.value) || '', pw = (pwEl && pwEl.value) || '';
    const id = rawId.trim();
    if (idEl) Gate.id = rawId;
    if (pwEl && Gate.mode === 'in') Gate.signPw = pw;
    const err = document.getElementById('signErr');
    const btn = document.querySelector('[data-act="gateSignIn"]');
    const label = btn && btn.querySelector('.btn-label');
    const sw = OB.lang() === 'sw';
    const showErr = (m, field) => { if (err) err.textContent = m || ''; Gate.notice = m || ''; if (field && field.focus) field.focus(); };
    if (!id) return showErr(sw ? 'Weka barua pepe au jina la mtumiaji.' : 'Enter your email or username.', idEl);
    if (!pw) return showErr(sw ? 'Weka nenosiri lako.' : 'Enter your password.', pwEl);
    if (!Backend.sb) return showErr('Sign-in is not set up in this app yet');
    if (err) err.textContent = '';
    Gate.notice = '';
    Gate.signing = true;
    if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
    if (label) label.textContent = GL().signing;
    try {
      const r = await Session.passwordSignIn(id, pw);
      if (r && r.error) showErr(r.error, pwEl);
    } catch (e) {
      showErr((e && e.message) || (sw ? 'Imeshindikana kuingia. Jaribu tena.' : 'Sign-in failed. Please try again.'), pwEl);
    } finally {
      Gate.signing = false;
      if (btn && btn.isConnected) { btn.disabled = false; btn.removeAttribute('aria-busy'); if (label) label.textContent = GL().cta; }
    }
  },
  gateSend: async () => {
    if (Gate.sending) return;
    if (Gate.mode === 'up') OB.agree('continue:create-account');
    const btn = document.querySelector('[data-act="gateSend"]');
    const raw = ($('#gateEmail') && $('#gateEmail').value) || '';
    const email = raw.trim().toLowerCase();
    const up = Gate.mode === 'up';
    if (up) Gate.email = raw;
    const showUp = (m) => { const el = document.getElementById('upErr'); if (el) el.textContent = m; Gate.notice = m; const f = document.getElementById('gateEmail'); if (f) f.focus(); };
    if (up && (Gate.coolUntil || 0) > Date.now()) return;
    if (!email) return up ? showUp(OB.lang() === 'sw' ? 'Weka barua pepe yako.' : 'Enter your email address.') : toast('Email address does not look right');
    if (!validEmail(email)) return up ? showUp(OB.lang() === 'sw' ? 'Barua pepe hiyo haionekani sawa. Iangalie kisha ujaribu tena.' : 'That email does not look right. Check it and try again.') : toast('Email address does not look right');
    if (!Backend.sb) return up ? showUp('Sign-in is not set up in this app yet') : toast('Sign-in is not set up in this app yet');
    try { const { data: cur } = await Backend.sb.auth.getSession(); const curEmail = String((cur && cur.session && cur.session.user && cur.session.user.email) || '').toLowerCase(); if (curEmail && curEmail !== email) await Backend.sb.auth.signOut(); } catch (e) { /* the code step checks the session again */ }
    return gateSendCode(email, btn);
  },
  gateKeepPw: async () => { if (Gate.signing) return; Gate.signing = true; try { await Session.keepPassword(); } finally { Gate.signing = false; } },
  gateSetup: async () => {
    const G = GL(), isNew = Session.setupMode === 'new';
    const name = (($('#setName') && $('#setName').value) || '').trim().replace(/\s+/g, ' '), user = lowerNoSpace($('#setUser') && $('#setUser').value);
    const pw = (($('#gatePw') && $('#gatePw').value) || '');
    /* the message appears above the button; the boxes keep what was typed */
    const fail = (m, field) => {
      Gate.signing = false; Gate.notice = '';
      let el = document.getElementById('setupErr');
      const btn = document.querySelector('[data-act="gateSetup"]');
      if (!el && btn) { el = document.createElement('p'); el.id = 'setupErr'; el.className = 'ferr'; el.setAttribute('role', 'alert'); btn.parentNode.insertBefore(el, btn); }
      if (el) el.textContent = m;
      if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); const sp = btn.querySelector('.spin'); if (sp) sp.remove(); }
      const f = field && document.getElementById(field); if (f) { f.focus(); f.setAttribute('aria-invalid', 'true'); }
    };
    if (isNew) {
      if (name.length < 2) return fail('Type your full name', 'setName');
      if (!/^[a-z0-9._-]{3,20}$/.test(user)) return fail(G.usernameHint, 'setUser');
    }
    const googleNew = isNew && Session.usesGoogle();
    if (!googleNew) {
      const why = Gate.pwProblem(pw); if (why) return fail(why, 'gatePw');
    }
    Gate.notice = ''; Gate.signing = true;
    { const btn = document.querySelector('[data-act="gateSetup"]'); if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); } const e0 = document.getElementById('setupErr'); if (e0) e0.textContent = ''; }
    try { await Session.finishSetup(name, user, googleNew ? '' : pw); Gate.signing = false; }
    catch (e) { fail(e.message, /username/i.test(e.message) ? 'setUser' : /password/i.test(e.message) ? 'gatePw' : null); }
  },
  wsSub: d => {
    Gate.sub = d.s || null; Gate.joinMsg = ''; Gate.joinPreview = null; Gate.joinDone = null; Gate.nameErr = ''; Gate.formErr = ''; Gate.paint();
    setTimeout(() => { const f = document.getElementById(Gate.sub === 'join' ? 'joinLink' : Gate.sub === 'create' ? 'newChamaName' : ''); if (f) f.focus(); }, 60);
  },
  wsCreate: () => Gate.submitCreate(),
  jnRequest: async () => {
    const p = Gate.joinPreview; if (!p || Gate.joinBusy) return;
    Gate.joinBusy = true; Gate.joinMsg = ''; Gate.paint();
    try {
      const r = await Session.requestJoin(p.code);
      Gate.joinBusy = false;
      if (r && r.already_member) return;
      Gate.joinDone = { ...r, chama_name: r.chama_name || p.chama_name };
      try { __M_src_features_auth_gate_js.Haptic.ok(); } catch (e) {}
    } catch (e) { Gate.joinBusy = false; Gate.joinMsg = e.message || 'Could not send your request. Try again.'; }
    Gate.paint();
  },
  jnAgain: () => { Gate.joinPreview = null; Gate.joinDone = null; Gate.joinMsg = ''; Gate.draft.link = ''; Gate.paint(); setTimeout(() => { const f = document.getElementById('joinLink'); if (f) f.focus(); }, 60); },
  jnFinish: async () => { Gate.sub = null; Gate.joinPreview = null; Gate.joinDone = null; Gate.draft.link = ''; await Session.loadMyRequests(); Gate.paint(); },
  jnOpen: d => Session.switchTo(d.id),
  jnCancel: d => __M_src_ui_toast_js.Pop.confirm({ title: 'Cancel your request?', text: 'The treasurer will no longer see it. You can ask again with a valid code.', confirmLabel: 'Cancel request', cancelLabel: 'Keep it', danger: true,
    onYes: async () => { try { await Session.cancelRequest(d.id); Gate.sub = null; Gate.joinDone = null; Gate.joinPreview = null; Gate.joinMsg = ''; Gate.draft.link = ''; Gate.paint(); __M_src_ui_toast_js.Pop.alert('The treasurer can no longer approve it. To join later, ask them for a new code.', { title: 'Request cancelled', label: 'OK', calm: true }); } catch (e) { toast(e.message); } } }),
  declSeen: d => { try { const k = 'mca-declined-seen', v = JSON.parse(localStorage.getItem(k) || '[]'); if (!v.includes(d.id)) v.push(d.id); localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} Gate.paint(); },
  jnPaste: async () => {
    try {
      const t = await navigator.clipboard.readText();
      const f = document.getElementById('joinLink'); if (!f || !t) return;
      f.value = t.trim(); f.dispatchEvent(new Event('input', { bubbles: true })); Gate.submitJoin();
    } catch (e) { const f = document.getElementById('joinLink'); if (f) f.focus(); toast('Long-press the box and choose Paste', 'info'); }
  },
  wsJoin: () => Gate.submitJoin(),
  wsOpen: d => Gate.openChama(d.id),
  wsSwitch: () => { Gate.sub = null; Gate.notice = ''; Session.openChooser(); },
  wsBack: () => {
    if (Session.role) return Session.closeChooser();
    const id = (typeof Store !== 'undefined' && Store.chamaId) || '';
    if (id) return Session.switchTo(id);
    return Session.closeChooser();
  },
  pkPick: (d) => { if (!d || !d.id) return; Gate.picked = d.id; Gate.paint(); },
  pkOpen: () => { if (Gate.picked) Gate.openChama(Gate.picked); },
  stepDown: () => {
    if (Session.role !== 'secretary') return toast(Session.role === 'treasurer' ? 'A treasurer hands the books to someone else instead' : 'You are a member');
    Modal.open({ title: 'Step down as secretary?', submitLabel: 'Step down', danger: true,
      body: '<p class="plain">You become a member and stay in the Chama. The treasurer and members are told, with your reason.</p>',
      fields: [{ name: 'why', label: 'Your reason', type: 'textarea', required: true, placeholder: 'e.g. I start a new job and will not have time for meetings.' }],
      onSubmit: v => { const why = String(v.why || '').trim(); if (why.length < 10) throw new Error('Write your reason (at least 10 characters)'); setTimeout(async () => {
        const { error } = await Backend.sb.rpc('step_down', { p_cid: Session.cid(), p_reason: why });
        if (error) return toast(/Could not find the function|PGRST202|schema cache/i.test(error.message || '') ? 'Stepping down needs a server update. Ask the treasurer to change your role meanwhile.' : error.message);
        await Session.refreshRole(); __M_src_ui_toast_js.Pop.alert('You are now a member. Thank you for serving.', { title: 'You stepped down', label: 'OK', calm: true });
      }, 0); } });
  },
  leaveChama: () => {
    if (Session.role === 'treasurer') { toast('You are the treasurer. Hand the Chama to someone else first, or stay as co-treasurer.'); location.hash = '#/settings/actions'; return; }
    Modal.open({ title: 'Leave this Chama?', submitLabel: 'Leave Chama', danger: true,
      body: '<p class="plain">You will stop seeing this Chama. Your past payments and loans stay in its records, because they belong to the group. A treasurer can invite you back.</p>',
      fields: [{ name: 'why', label: 'Why are you leaving?', type: 'textarea', required: true, placeholder: 'e.g. I am moving abroad and cannot keep contributing.', help: 'Shared with the treasurer and secretary only.' }],
      onSubmit: v => { const why = String(v.why || '').trim(); if (why.length < 10) throw new Error('Write your reason (at least 10 characters)'); setTimeout(async () => {
        const cid = Session.cid();
        let { error } = await Backend.sb.rpc('leave_chama_with_reason', { p_cid: cid, p_reason: why });
        if (error && /Could not find the function|PGRST202|schema cache/i.test(error.message || '')) return toast('The server is still taking in its latest update. Nothing was changed. Wait a minute, then try again.');
        if (error) return toast(error.message);
        toast('You left the Chama');
        const rest = (Session.workspaces || []).filter(w => w.chama_id !== cid);
        if (rest.length === 1) Session.switchTo(rest[0].chama_id);
        else { location.replace(location.pathname); }
      }, 0); } });
  },
  handover: d => {
    const R = __M_src_features_requests_js.Roles;
    const a = (Session.access || []).find(x => x.email === d.e) || { email: d.e }, s = Store.get() || { members: [] };
    const m = a.member_id ? s.members.find(x => x.id === a.member_id) : null, name = (m && m.name) || String(d.e).split('@')[0], first = name.split(' ')[0];
    Modal.open({ title: 'Make ' + first + ' the treasurer?', submitLabel: 'Send the offer', danger: true,
      body: `<div class="ho-warn">${icon('shield')}<div><b>This hands over the whole Chama</b><ul><li>When ${esc(first)} accepts, <b>you become a member</b>.</li><li>Everyone is told.</li><li>Nothing changes until they accept.</li></ul></div></div>`,
      fields: [{ name: 'who', label: 'Type ' + first + ' to confirm', placeholder: first, required: true }, { name: 'pw', label: 'Your password', type: 'password', required: true, help: 'Asked so that nobody holding your phone can give the Chama away.' }],
      onSubmit: v => {
        if (String(v.who || '').trim().toLowerCase() !== first.toLowerCase()) throw new Error('Type ' + first + ' exactly, to show you mean this person');
        if (!v.pw) throw new Error('Enter your password');
        setTimeout(async () => {
          try {
            await R.verifyTreasurer(v.pw);
            const r = await R.offer(d.e, 'treasurer', null);
            await Session.loadAccess().catch(() => {}); await R.load().catch(() => {}); render();
            if (r && r.legacy) toast(first + ' is now the treasurer. Everyone has been told.', 'ok');
            else __M_src_ui_toast_js.Pop.alert(first + ' has been asked to take over the books. You stay treasurer until they accept.', { title: 'Offer sent', label: 'OK', calm: true });
          } catch (e) { toast(e.message); }
        }, 0);
      } });
  },
  gateReset: () => { Gate.sent = false; Gate.sending = false; Otp.hold = false; Otp.busy = false; Session.verifying = false; render(); },
  gateCancel: () => {
    Gate.sent = false; Gate.sending = false; Otp.hold = false; Otp.busy = false; Session.verifying = false;
    if (Session.status === 'loading') return Session.signOut();
    Session.set('signed-out');
  },
  gateResend: async () => {
    if (!Gate.email || !Backend.sb) return toast('Use a different email and start again');
    const b = document.getElementById('otpResend'); if (b) b.disabled = true;
    Session.markCodeAsked(Gate.email);
    const { error } = await Backend.sb.auth.signInWithOtp({ email: Gate.email, options: { shouldCreateUser: Gate.mode === 'up' } });
    if (error && !(Gate.mode === 'forgot' && /signups? not allowed|not found/i.test(error.message))) { if (b) b.disabled = false; return Otp.msg(/seconds|wait|rate/i.test(error.message) ? 'Please wait a minute before asking for another code.' : plainOtpError(error.message)); }
    Otp.reset(); Otp.start(); Otp.msg('A new code is on its way.');
  },
  gateRecheck: async () => { const ok = await Session.recheck(); if (!ok) toast('Not signed in yet. Open the link on this phone, or type the code instead'); },
  gateCode: async () => {
    const token = ($('#gateCode').value || '').replace(/\D/g, '');
    const email = Gate.email;
    const len = Session.otpLength || 8;
    if (token.length !== len) return toast(`Type the ${len}-digit code from the email`);
    if (!email || !Backend.sb) return toast('Press Start again and send a new link');
    try {
      const { error } = await Backend.sb.auth.verifyOtp({ email, token, type: 'email' });
      if (error) return toast(/expired/i.test(error.message || '') || error.code === 'otp_expired' ? 'This code has expired. Press Start again to get a new one.' : 'That code did not work. Check it, or press Start again for a new one');
      /* the sign-in listener continues; this is a fallback in case it has not yet */
      setTimeout(() => Session.recheck(), 400);
    } catch (e) { toast('Could not check the code. Try again'); }
  },
  gateSignOut: () => actions.signOutAsk(),
  gateGoogle: () => { OB.agree('continue:google'); Session.googleSignIn(); },
  signOutAsk: () => {
    __M_src_ui_toast_js.Pop.confirm({
      title: 'Sign out?',
      html: (() => { try { return '<p>This removes the Chama’s records from this phone. You can sign in again at any time.</p>' + (Store.hasUnsent() ? '<p class="notice" role="alert">Some changes on this phone have not reached the cloud yet. Signing out now will lose them. Wait until you are online.</p>' : ''); } catch (e) { return ''; } })(),
      confirmLabel: 'Sign out', danger: true,
      onYes: () => { setTimeout(() => actions.signOutApp(), 0); },
    });
  },
  signOutApp: async () => {
    try { await Session.signOut(); } catch (e) { /* carry on: the reload clears the session view */ }
    try { sessionStorage.removeItem('mca-splash'); sessionStorage.removeItem('mca-gate'); sessionStorage.removeItem('mca-intent'); } catch (e) {}
    location.reload();
  },
  gateRestore: async () => { const A = __M_src_features_account_deletion_js.Account; await A.restore(); Gate.paint(); },
  gateRetry: () => (Session.user ? Session.after(Session.user) : Session.boot()),
  /* straight to the right screen: sign in if the invited email has an account, otherwise create it and send the code */
  inviteContinue: async () => {
    if (Invite.busy) return; Invite.busy = true;
    const b = document.querySelector('[data-act="inviteContinue"]'); if (b) { b.disabled = true; b.setAttribute('aria-busy', 'true'); }
    let r = null;
    try { const { data, error } = await Backend.sb.rpc('invitation_account', { p_token: Invite.token }); if (!error) r = data; } catch (e) { r = null; }
    Invite.busy = false; Invite.signin = true; Gate.sent = false;
    if (r && r.ok && r.email) {
      if (r.has_account) { Gate.mode = 'in'; Gate.id = r.email; Gate.notice = ''; Gate.paint(); setTimeout(() => { const p = document.getElementById('gatePw'); if (p) p.focus(); }, 120); return; }
      Gate.mode = 'up'; Gate.email = r.email; Gate.notice = ''; OB.agree('continue:create-account');
      return gateSendCode(r.email, null);
    }
    const hint = (Invite.info && Invite.info.email_hint) || '';
    Gate.mode = 'in'; Gate.notice = 'Sign in with the email this invitation was sent to' + (hint ? ' (' + hint + ')' : '') + '. New here? Tap Create an account below.'; Gate.paint();
  },
  inviteAccept: () => Invite.accept(),
  inviteDecline: () => Invite.decline(),
  inviteDismiss: () => { Invite.clear(); if (Session.user) { Session.status = 'loading'; Session.after(Session.user); } else Gate.paint(); },
  inviteRetry: async () => { Invite.checked = false; Gate.paint(); await Invite.verify(); Gate.paint(); },
};

return { get actions() { return actions; }, };
})();

/* ---- src/features/shell/index.js ---- */
const __M_src_features_shell_index_js = (function () {
const { Store } = __M_src_core_store_js;
const { $ } = __M_src_lib_dom_js;
const { Modal } = __M_src_ui_modal_js;
const { toast } = __M_src_ui_toast_js;

const actions = {
  closeModal: () => Modal.close(),
  sigClear() { const c = $('#sigPad'); if (c) { c.getContext('2d').clearRect(0, 0, c.width, c.height); c._ink = false; } },
  undo: { admin: true, run() { toast(Store.undo() ? 'Last change undone' : 'Nothing to undo'); } },
};

return { get actions() { return actions; }, };
})();

/* ---- src/ui/sheet.js + src/features/requests/index.js ----
   One bottom sheet for rich content (invite, approve, person), the invite flow, join approvals,
   and the People and access page. */
const __M_src_features_requests_js = (function () {
const { Backend } = __M_src_core_backend_js;
const { render } = __M_src_core_rerender_js;
const { Session, Perm } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { esc } = __M_src_core_utils_js;
const { $ } = __M_src_lib_dom_js;
const { Modal } = __M_src_ui_modal_js;
const { toast, Pop } = __M_src_ui_toast_js;
const { validEmail } = __M_src_lib_validate_js;

/* A sheet with free content. lock = the person must answer (no close button, the backdrop does nothing). */
const Sheet = {
  locked: false, key: '',
  open(html, o = {}) {
    this.locked = !!o.lock; this.key = o.key || '';
    $('#modalRoot').innerHTML = `<div class="veil${this.locked ? ' locked' : ''}"><div class="sheet sx${o.cls ? ' ' + o.cls : ''}" role="dialog" aria-modal="true" aria-label="${esc(o.label || '')}">
${this.locked ? '' : `<button type="button" class="sx-x" data-act="sheetClose" aria-label="Close">${icon('close')}</button>`}<div class="sx-body">${html}</div></div></div>`;
    document.body.style.overflow = 'hidden';
    const f = document.querySelector('#modalRoot .sx [autofocus]'); if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) {} }, 300);
  },
  isOpen(key) { return !!document.querySelector('#modalRoot .sx') && (!key || this.key === key); },
  update(html, back) { const b = document.querySelector('#modalRoot .sx-body'); if (!b) return; const same = b.firstElementChild && b.firstElementChild.className === (b.dataset.k || ''); b.innerHTML = html; if (this._step !== html.slice(0, 120)) { b.classList.remove('sx-in', 'sx-in-back'); void b.offsetWidth; b.classList.add(back ? 'sx-in-back' : 'sx-in'); } this._step = html.slice(0, 120); void same; },
  close() { this.locked = false; this.key = ''; Modal.close(); }
};
const ROLE = {
  member: { t: 'Member', d: 'Own money and group totals', ic: 'profile' },
  secretary: { t: 'Secretary', d: 'Register, meetings, minutes, polls', ic: 'doc' },
  treasurer: { t: 'Treasurer', d: 'Keeps the books, full control', ic: 'wallet' }
};
const roleCards = (cur, act, allowTreasurer = true) => `<div class="rolepick" role="radiogroup" aria-label="Role">${Object.keys(ROLE).filter(r => allowTreasurer || r !== 'treasurer').map(r => `<button type="button" class="rp${cur === r ? ' on' : ''}" role="radio" aria-checked="${cur === r}" data-act="${act}" data-v="${r}"><span class="rp-ic">${icon(ROLE[r].ic)}</span><b>${ROLE[r].t}</b><small>${ROLE[r].d}</small></button>`).join('')}</div>`;
const initials = n => String(n || '?').split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
const pav = (name, photo, n = 44) => typeof photo === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo)
  ? `<img class="av" style="--n:${n}px" src="${photo}" alt="Photo of ${esc(name)}" data-name="${esc(name)}">` : `<span class="av c${(String(name || '').length % 3) + 1}" style="--n:${n}px" aria-hidden="true">${esc(initials(name))}</span>`;
const ago = d => { const m = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000)); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
const appUrl = () => location.origin + location.pathname.replace(/index\.html$/, '');
const unlinkedMembers = s => { const used = new Set((Session.access || []).filter(a => a.status === 'active' && a.member_id).map(a => a.member_id)); return (s.members || []).filter(m => !used.has(m.id)); };

/* ---------------- Invite: one sheet, two ways ---------------- */
const Inv = {
  tab: 'code', role: 'member', hours: 168, uses: 1, email: '', record: 'new', result: null, busy: false, err: '',
  reset(tab) { Object.assign(this, { tab: tab || 'code', role: 'member', hours: 168, uses: 1, email: '', record: 'new', result: null, busy: false, err: '' }); },
  html() {
    const s = Store.get() || { members: [], chama: {} }, name = (s.chama && s.chama.name) || 'your Chama';
    if (this.result) return this.resultHtml(name);
    const tabs = `<div class="seg2" role="tablist"><button type="button" role="tab" aria-selected="${this.tab === 'code'}" data-act="invTab" data-v="code">${icon('key', 's')}Share a code</button><button type="button" role="tab" aria-selected="${this.tab === 'email'}" data-act="invTab" data-v="email">${icon('mail', 's')}Send an email</button></div>`;
    const lead = this.tab === 'code'
      ? '<b>Code:</b> share it on WhatsApp or SMS. Anyone who has it can <b>ask</b> to join, and you approve each person before they get in.'
      : '<b>Email:</b> we send a private link to one address. Only that person can use it, so they are <b>in as soon as they accept</b>, with no approval step.';
    let body = '';
    if (this.tab === 'code') {
      body = `<div class="fgrp"><span class="flab">Valid for</span><div class="chips2">${[[24, '1 day'], [168, '7 days'], [720, '30 days']].map(([h, t]) => `<button type="button" class="chip2${this.hours === h ? ' on' : ''}" data-act="invHours" data-v="${h}">${t}</button>`).join('')}</div></div>
<div class="fgrp"><span class="flab">How many people can use it</span><div class="stepper"><button type="button" data-act="invUses" data-v="-1" aria-label="Fewer"${this.uses <= 1 ? ' disabled' : ''}>−</button><b class="num" aria-live="polite">${this.uses}</b><button type="button" data-act="invUses" data-v="1" aria-label="More"${this.uses >= 100 ? ' disabled' : ''}>+</button><small>${this.uses === 1 ? 'One person' : this.uses + ' people'}</small></div></div>`;
    } else {
      const opts = unlinkedMembers(s).map(m => `<option value="${esc(m.id)}"${this.record === m.id ? ' selected' : ''}>${esc(m.name)}</option>`).join('');
      body = `<label class="fgrp" for="invEmail2"><span class="flab">Their email address</span><span class="field">${icon('mail')}<input id="invEmail2" type="email" inputmode="email" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="name@example.com" value="${esc(this.email)}" autofocus></span></label>
${this.role !== 'treasurer' || true ? `<label class="fgrp" for="invRecord"><span class="flab">On the member list</span><span class="field">${icon('members')}<select id="invRecord"><option value="new"${this.record === 'new' ? ' selected' : ''}>Add them as a new member</option>${opts ? `<optgroup label="They are already on the list as">${opts}</optgroup>` : ''}<option value=""${this.record === '' ? ' selected' : ''}>Officer only, not a member</option></select></span></label>` : ''}`;
    }
    return `<div class="sx-head"><span class="sx-badge">${icon('userPlus')}</span><h3>Invite to ${esc(name)}</h3><p>Two ways to bring someone into the app. Pick one.</p></div>${tabs}<p class="sx-note">${icon('info', 's')}<span>${lead}</span></p>
<div class="fgrp"><span class="flab">Their role</span>${roleCards(this.role, 'invRole', Session.role === 'treasurer')}</div>${body}
<p class="ferr" role="alert">${esc(this.err)}</p>
<button type="button" class="btn pri block lg" data-act="invGo"${this.busy ? ' disabled aria-busy="true"' : ''}>${this.busy ? '<span class="spin" aria-hidden="true"></span>' : icon(this.tab === 'code' ? 'key' : 'mail')}<span>${this.busy ? (this.tab === 'code' ? 'Creating…' : 'Sending…') : this.tab === 'code' ? 'Create code' : 'Send invitation'}</span></button>`;
  },
  resultHtml(name) {
    const r = this.result;
    if (r.kind === 'code') {
      const until = new Date(r.expires_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
      return `<div class="ticket"><div class="tk-top"><span class="tk-lab">Invite code · ${esc(ROLE[r.role].t)}</span><b class="tk-code num" id="tkCode">${esc(r.code)}</b><span class="tk-sub">${esc(name)} · works until ${esc(until)} · ${r.uses === 1 ? '1 person' : r.uses + ' people'}</span></div>
<div class="tk-cut" aria-hidden="true"></div><div class="tk-act">
<button type="button" class="tk-b" data-act="invCopy">${icon('copy')}<span>Copy</span></button>
<button type="button" class="tk-b" data-act="invShare">${icon('share')}<span>Share</span></button>
<a class="tk-b" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent(this.shareText(name))}">${icon('chat')}<span>WhatsApp</span></a></div></div>
<p class="sx-note">${icon('shield', 's')}<span>This code is shown once. When someone uses it, you will be asked to approve them.</span></p>
<div class="btns col"><button type="button" class="btn pri block" data-act="sheetClose">Done</button><button type="button" class="btn ghost block" data-act="invAgain">Create another</button></div>`;
    }
    const ok = r.status === 'sent';
    return `<div class="sx-result ${ok ? 'ok' : 'warn'}"><div class="sx-tick">${icon(ok ? 'check' : 'alert')}</div><h3>${ok ? 'Invitation sent' : 'Invitation saved'}</h3>
<p>${ok ? `We emailed <b>${esc(r.email)}</b>. The link works for 7 days and only for that address.` : `The invitation for <b>${esc(r.email)}</b> exists, but the email did not go out (${esc(r.error || 'email is not set up')}). Try Resend from People and access.`}</p></div>
<div class="btns col"><button type="button" class="btn pri block" data-act="sheetClose">Done</button><button type="button" class="btn ghost block" data-act="invAgain">Invite someone else</button></div>`;
  },
  shareText(name) { const r = this.result; return `Join ${name} on My Chama.\n1. Open ${appUrl()}\n2. Sign in, then tap "Join a Chama"\n3. Enter this code: ${r.code}\nThe treasurer approves you once you ask to join.`; },
  open(tab) { this.reset(tab); Sheet.open(this.html(), { key: 'invite', label: 'Invite someone' }); },
  paint() { const e = document.getElementById('invEmail2'); if (e) this.email = e.value; const r = document.getElementById('invRecord'); if (r) this.record = r.value; Sheet.update(this.html()); },
  async go() {
    if (this.busy) return;
    this.err = '';
    if (this.tab === 'code') {
      this.busy = true; this.paint();
      try { await Session.createCode({ role: this.role, hours: this.hours, maxUses: this.uses, memberId: null }); this.result = { kind: 'code', role: this.role, uses: this.uses, ...Session.newCode }; Session.newCode = null; }
      catch (e) { this.err = e.message; }
      this.busy = false; return this.paint();
    }
    const e = document.getElementById('invEmail2'); this.email = e ? e.value.trim().toLowerCase() : this.email;
    const rec = document.getElementById('invRecord'); this.record = rec ? rec.value : this.record;
    if (!validEmail(this.email)) { this.err = 'That email address does not look right.'; return this.paint(); }
    if (this.email === String(Session.email || '').toLowerCase()) { this.err = 'That is your own email.'; return this.paint(); }
    this.busy = true; this.paint();
    try {
      const r = await Session.sendInvite('create', { email: this.email, role: this.role, member_id: this.record || null });
      this.result = { kind: 'email', email: this.email, status: r.email_status, error: r.email_error };
      Session.loadInvites().catch(() => {});
    } catch (err) { if (!err.quiet) this.err = err.message; else { this.busy = false; return Sheet.close(); } }
    this.busy = false; this.paint();
  }
};

/* ---------------- Join requests: the treasurer must answer ---------------- */
const Requests = {
  i: 0, pick: {}, busy: false, timer: null,
  /* compares before and after: a request that disappeared without this phone deciding it was cancelled (or decided elsewhere) */
  async refresh(prompt) {
    const before = (Session.requests || []).slice();
    await Session.loadRequests();
    const now = Session.requests || [];
    const gone = before.filter(r => !now.some(x => x.id === r.id) && !this.decided[r.id]);
    const added = now.filter(r => !before.some(x => x.id === r.id));
    if (gone.length) this.gone(gone);
    render();
    if (prompt || added.length) this.prompt();
    else if (Sheet.isOpen('requests')) this.prompt();
  },
  decided: {},
  gone(list) {
    const wasOpen = Sheet.isOpen('requests');
    list.forEach(r => delete this.pick[r.id]);
    if (this.i >= (Session.requests || []).length) this.i = 0;
    const names = list.map(r => r.name || r.email).join(', ');
    if (wasOpen && !(Session.requests || []).length) Sheet.close();
    __M_src_ui_toast_js.Pop.alert(list.length === 1 ? 'They cancelled the request themselves, or another officer already answered it. Nothing was changed.' : 'These requests were cancelled, or answered by another officer. Nothing was changed.', { title: (list.length === 1 ? names + ' withdrew their request' : list.length + ' requests were withdrawn'), label: 'OK', calm: true });
  },
  /* officers: keep the list fresh even if a live event is missed, and when coming back to the app */
  watch() {
    clearInterval(this.timer);
    if (!Session.role || Session.role === 'member') return;
    this.timer = setInterval(() => { if (!document.hidden && Session.ready() && Session.role && Session.role !== 'member') this.refresh(false).catch(() => {}); }, 20000);
    if (!this._vis) { this._vis = true; document.addEventListener('visibilitychange', () => { if (!document.hidden && Session.ready() && Session.role && Session.role !== 'member') this.refresh(false).catch(() => {}); }); }
  },
  prompt() {
    const list = Session.requests || [];
    if (!list.length) { if (Sheet.isOpen('requests')) Sheet.close(); return; }
    if (Sheet.isOpen() && !Sheet.isOpen('requests')) return setTimeout(() => this.prompt(), 4000);
    if (this.i >= list.length) this.i = 0;
    const html = this.html();
    if (Sheet.isOpen('requests')) Sheet.update(html); else Sheet.open(html, { key: 'requests', lock: true, label: 'Join request', cls: 'req' });
  },
  state(r) {
    if (!this.pick[r.id]) this.pick[r.id] = { role: r.role, record: r.requested_member_id || 'new', name: r.name || '' };
    return this.pick[r.id];
  },
  html() {
    const list = Session.requests || [], r = list[this.i]; if (!r) return '';
    const st = this.state(r), s = Store.get() || { members: [] }, n = list.length;
    const opts = unlinkedMembers(s).map(m => `<option value="${esc(m.id)}"${st.record === m.id ? ' selected' : ''}>${esc(m.name)}</option>`).join('');
    const canTreasurer = Session.role === 'treasurer';
    return `<div class="rq-top"><span class="rq-live"><span class="live-dot"></span>Needs your answer</span>${n > 1 ? `<span class="rq-count">${this.i + 1} of ${n}</span>` : ''}</div>
<div class="rq-who">${pav(r.name, r.photo, 64)}<div><h3>${esc(r.name)}</h3><p>${esc(r.email)}${r.phone ? ' · ' + esc(r.phone) : ''}</p><p class="mute">Asked to join as ${esc(ROLE[r.role].t)} · ${esc(ago(r.requested_at))}</p></div></div>
<div class="fgrp"><span class="flab">Let them in as</span>${roleCards(st.role, 'rqRole', canTreasurer)}</div>
<label class="fgrp" for="rqRecord"><span class="flab">On the member list</span><span class="field">${icon('members')}<select id="rqRecord" data-id="${esc(r.id)}"><option value="new"${st.record === 'new' ? ' selected' : ''}>Add as a new member</option>${opts ? `<optgroup label="Already listed as">${opts}</optgroup>` : ''}<option value="none"${st.record === 'none' ? ' selected' : ''}>Officer only, not a member</option></select></span></label>
${st.record === 'new' ? `<label class="fgrp" for="rqName"><span class="flab">Name on the member list</span><span class="field">${icon('profile')}<input id="rqName" data-id="${esc(r.id)}" maxlength="120" value="${esc(st.name)}"></span></label>` : ''}
<p class="sx-note">${icon('shield', 's')}<span>Members see their own money and the group totals. Only a treasurer sees everyone’s records.</span></p>
<div class="rq-act"><button type="button" class="btn bad-soft" data-act="rqDecline" data-id="${esc(r.id)}"${this.busy ? ' disabled' : ''}>Decline</button><button type="button" class="btn pri grow" data-act="rqApprove" data-id="${esc(r.id)}"${this.busy ? ' disabled aria-busy="true"' : ''}>${this.busy ? '<span class="spin" aria-hidden="true"></span>' : icon('check')}<span>Approve ${esc(String(r.name).split(/\s+/)[0])}</span></button></div>
${n > 1 ? `<button type="button" class="btn ghost block sm" data-act="rqNext">Look at the next request first</button>` : ''}`;
  },
  async decide(id, approve) {
    const r = (Session.requests || []).find(x => x.id === id); if (!r || this.busy) return;
    const st = this.state(r);
    const nm = document.getElementById('rqName'); if (nm) st.name = nm.value.trim();
    this.busy = true; Sheet.update(this.html());
    try {
      this.decided[id] = true;
      await Session.decideRequest(id, approve, { role: st.role, record: st.record, name: st.name });
      toast(approve ? (r.name || 'They') + ' is in' : 'Request declined. They will see it clearly when they next open the app.', approve ? 'ok' : 'info');
      try { if (approve) __M_src_features_auth_gate_js.Haptic.ok(); } catch (e) {}
    } catch (e) {
      if (/already handled/i.test(e.message || '')) {
        await Session.loadRequests();
        __M_src_ui_toast_js.Pop.alert('They cancelled it, or another officer answered it first. Nothing was changed.', { title: (r.name || 'This person') + '’s request is no longer open', label: 'OK', calm: true });
      } else { delete this.decided[id]; toast(e.message); }
    }
    this.busy = false; delete this.pick[id];
    this.prompt(); render();
  },
  /* the inline list (People and access, Members, #/requests) */
  listHtml(compact) {
    const list = Session.requests || []; if (!list.length) return '';
    return `<section class="sec rq-sec"><div class="sec-h"><h2>Waiting for you <span class="cnt-b">${list.length}</span></h2></div><div class="list">${list.map((r, i) => `<button type="button" class="li has-av rq-row" data-act="rqOpen" data-i="${i}">${pav(r.name, r.photo, 42)}<span class="li-main"><b>${esc(r.name)}</b><small>Wants to join as ${esc(ROLE[r.role].t)} · ${esc(ago(r.requested_at))}</small></span><span class="li-end"><span class="pill-act">Review</span></span></button>`).join('')}</div>${compact ? '' : '<p class="foot-note">Nobody gets in until you approve them. They are told either way.</p>'}</section>`;
  }
};

/* ---------------- One person: role, member list, hand-over, remove ---------------- */
const Person = {
  open(email) {
    const a = (Session.access || []).find(x => String(x.email).toLowerCase() === String(email).toLowerCase()); if (!a) return;
    const s = Store.get() || { members: [] }, m = a.member_id ? s.members.find(x => x.id === a.member_id) : null;
    const self = String(a.email).toLowerCase() === String(Session.email || '').toLowerCase();
    const name = (m && m.name) || a.email.split('@')[0];
    const opts = unlinkedMembers(s).map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
    const rows = [];
    if (!self && a.status === 'active') rows.push(`<div class="fgrp"><span class="flab">Role</span>${roleCards(a.role, 'personRole', true).replace(/data-act="personRole"/g, `data-act="personRole" data-e="${esc(a.email)}"`)}</div>`);
    if (a.status === 'active') rows.push(m
      ? `<div class="kv"><span>Member list</span><b>Listed as ${esc(m.name)}</b></div>`
      : `<div class="fgrp"><span class="flab">Member list</span><div class="inline-pick"><span class="field">${icon('members')}<select id="personRec"><option value="new">Add as a new member</option>${opts ? `<optgroup label="Link to">${opts}</optgroup>` : ''}</select></span><button type="button" class="btn pri" data-act="personLink" data-e="${esc(a.email)}">Add</button></div><small class="fhelp">Not on the member list, so their profile shows no money yet.</small></div>`);
    const tail = self || a.status !== 'active' ? '' : `<div class="list sx-list">
${a.role !== 'treasurer' ? `<button type="button" class="li has-ic" data-act="handover" data-e="${esc(a.email)}"><span class="li-ic t-gold">${icon('key')}</span><span class="li-main"><b>Hand the books to ${esc(name.split(' ')[0])}</b><small>Make them treasurer</small></span>${icon('chev', 'chev')}</button>` : ''}
<button type="button" class="li has-ic danger" data-act="revoke" data-e="${esc(a.email)}"><span class="li-ic t-bad">${icon('out')}</span><span class="li-main"><b>Remove access</b><small>Their records stay in the books</small></span>${icon('chev', 'chev')}</button></div>`;
    Sheet.open(`<div class="rq-who">${m ? __M_src_ui_avatar_js.av(m, 60) : pav(name, null, 60)}<div><h3>${esc(name)}${self ? ' <span class="tag">You</span>' : ''}</h3><p>${esc(a.email)}</p><p class="mute">${esc(Perm.label(a.role))} · ${a.status === 'active' ? 'can sign in' : 'access removed'}</p></div></div>${rows.join('')}${tail}`, { key: 'person', label: name });
  }
};

/* ---------------- Fair roles: offers, reasons, notices (server: migration 023; older servers fall back) ---------------- */
const missingFn = e => /Could not find the function|does not exist|PGRST202|schema cache/i.test((e && (e.message || e.code)) || '');
const REMOVE_WHY = [['stopped_contributing', 'Stopped contributing for a long time'], ['broke_rules', 'Broke the Chama rules after warnings'], ['asked_to_leave', 'They asked to leave (removes now)'], ['duplicate', 'A duplicate or wrong account (removes now)'], ['security', 'A security risk, such as a lost phone (removes now)'], ['other', 'Something else']];
const Roles = {
  offers: [], notices: [], myNotice: null, myOffers: [],
  /* the treasurer re-types their password before handing over the books: the strongest check the app can do */
  async verifyTreasurer(pw) {
    const r = await Session.passwordSignIn(Session.email, pw);
    if (r && r.error) throw new Error(/password is not right/i.test(r.error) ? 'Your password is not right' : r.error);
  },
  async offer(email, role, note) {
    const { data, error } = await Backend.sb.rpc('offer_role', { p_cid: Store.chamaId, p_email: email, p_role: role, p_note: note || null });
    /* no silent fallback to an immediate change: the person must be asked */
    if (error && missingFn(error)) throw new Error('The server is still taking in its latest update. Nothing was changed. Wait a minute, then try again.');
    if (error) throw new Error(rpcMessage(error));
    return data || {};
  },
  /* servers without 023: apply directly, and still keep one secretary / one treasurer */
  async legacy(email, role) {
    if (role === 'treasurer') {
      const { error } = await Backend.sb.rpc('transfer_ownership', { cid: Store.chamaId, p_email: email, p_stay_as_treasurer: false });
      if (error) throw new Error(rpcMessage(error));
      Session.role = 'member'; return { applied: true, legacy: true };
    }
    if (role === 'secretary') for (const a of (Session.access || []).filter(x => x.status === 'active' && x.role === 'secretary' && x.email !== email)) {
      await Backend.sb.rpc('set_member_role', { cid: Store.chamaId, p_email: a.email, p_role: 'member' });
    }
    const { error } = await Backend.sb.rpc('set_member_role', { cid: Store.chamaId, p_email: email, p_role: role });
    if (error) throw new Error(rpcMessage(error));
    return { applied: true, legacy: true };
  },
  async load() {
    if (!Backend.sb || !Store.chamaId) return;
    if (Session.role === 'treasurer') {
      const [o, n] = await Promise.all([Backend.sb.rpc('list_role_offers', { p_cid: Store.chamaId }), Backend.sb.rpc('list_removal_notices', { p_cid: Store.chamaId })]);
      this.offers = o.error ? [] : (o.data || []); this.notices = n.error ? [] : (n.data || []);
    } else if (Session.role === 'secretary') {
      const n = await Backend.sb.rpc('list_removal_notices', { p_cid: Store.chamaId }); this.notices = n.error ? [] : (n.data || []);
    }
    const [mo, mn] = await Promise.all([Backend.sb.rpc('my_role_offers', { p_cid: Store.chamaId }), Backend.sb.rpc('my_removal_notice', { p_cid: Store.chamaId })]);
    this.myOffers = mo.error ? [] : (mo.data || []);
    this.myNotice = mn.error ? null : ((mn.data || [])[0] || null);
  },
  /* the person offered a role must answer before carrying on */
  async check() {
    try { await this.load(); } catch (e) { return; }
    render();
    const o = this.myOffers[0]; if (!o) return;
    if (Sheet.isOpen() && !Sheet.isOpen('roleOffer')) return setTimeout(() => this.check(), 5000);
    const t = o.to_role === 'treasurer';
    Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('key')}</span><h3>Become ${esc(ROLE[o.to_role].t)}?</h3><p>${esc(o.offered_by_name || 'The treasurer')} asked you.</p></div>
<div class="role-offer"><p><b>What changes if you accept</b></p><ul>${t ? '<li>You keep the books: you record money, approve people and run the Chama.</li><li>' + esc(o.offered_by_name || 'The current treasurer') + ' becomes a member. There is one treasurer at a time.</li><li>Everyone in the Chama is told.</li>' : '<li>You keep the member register, call meetings, take minutes and run polls.</li><li>You do not see other members’ money.</li><li>Any current secretary becomes a member. There is one secretary at a time.</li>'}</ul>${o.note ? `<p class="role-note">“${esc(o.note)}”</p>` : ''}</div>
<label class="fgrp" for="roAns"><span class="flab">A note back (optional)</span><span class="field"><input id="roAns" maxlength="300" placeholder="e.g. Happy to help"></span></label>
<div class="rq-act"><button type="button" class="btn bad-soft" data-act="roleAnswer" data-id="${esc(o.id)}" data-v="no">Decline</button><button type="button" class="btn pri grow" data-act="roleAnswer" data-id="${esc(o.id)}" data-v="yes">Accept</button></div>`, { key: 'roleOffer', lock: true, label: 'Role offer' });
  },
  async answer(id, yes) {
    const ans = (document.getElementById('roAns') || {}).value || '';
    const { data, error } = await Backend.sb.rpc('respond_role_offer', { p_id: id, p_accept: yes, p_answer: ans || null });
    Sheet.close();
    if (error) { toast(rpcMessage(error)); return this.check(); }
    if (yes) { Pop.alert(data && data.role === 'treasurer' ? 'You now keep the books. Everyone in the Chama has been told.' : 'You are now the secretary. Your new tools are in the menu.', { title: 'Role accepted', label: 'OK' }); await Session.refreshRole(); }
    else toast('You declined. The treasurer has been told.', 'info');
    this.check();
  },
  banner() {
    const n = this.myNotice; if (!n) return '';
    const d = new Date(n.effective_at).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' });
    return `<div class="decl-card" role="alert"><span class="decl-ic">${icon('alert')}</span><div class="decl-t"><b>Your access ends on ${esc(d)}</b><small>Reason from the treasurer: ${esc(n.reason)}${n.reply ? '<br>Your reply was sent.' : ''}</small></div>${n.reply ? '' : `<button type="button" class="btn sm" data-act="noticeReply" data-id="${esc(n.id)}">Reply</button>`}</div>`;
  },
  officerHtml() {
    const rows = [
      ...this.offers.map(o => `<div class="li has-ic"><span class="li-ic t-gold">${icon('key')}</span><span class="li-main"><b>${esc(o.name)}</b><small>Offered ${esc(ROLE[o.to_role].t)} · waiting for their answer</small></span><span class="li-end"><button type="button" class="btn sm ghost" data-act="offerCancel" data-id="${esc(o.id)}">Withdraw</button></span></div>`),
      ...this.notices.map(n => { const due = new Date(n.effective_at) <= new Date(); return `<div class="li has-ic"><span class="li-ic t-bad">${icon('alert')}</span><span class="li-main"><b>${esc(n.name)}</b><small>${due ? 'Notice ended' : 'Access ends ' + esc(new Date(n.effective_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }))} · ${esc(n.reason)}${n.reply ? ' · They replied: “' + esc(n.reply) + '”' : ''}</small></span>${Session.role === 'treasurer' ? `<span class="li-end">${due ? `<button type="button" class="btn sm bad-soft" data-act="noticeFinish" data-id="${esc(n.id)}">Finish</button>` : ''}<button type="button" class="btn sm ghost" data-act="noticeCancel" data-id="${esc(n.id)}">Withdraw</button></span>` : ''}</div>`; })
    ];
    const act = (Session.access || []).filter(a => a.status === 'active');
    const two = ['treasurer', 'secretary'].filter(r => act.filter(a => a.role === r).length > 1);
    const warn = two.length ? `<div class="decl-card"><span class="decl-ic">${icon('alert')}</span><div class="decl-t"><b>This Chama has more than one ${esc(two.map(r => ROLE[r].t.toLowerCase()).join(' and '))}</b><small>There should be one of each. Open a person below and choose Member for the extra one.</small></div></div>` : '';
    return warn + (rows.length ? `<section class="sec"><div class="sec-h"><h2>Waiting</h2></div><div class="list">${rows.join('')}</div></section>` : '');
  }
};

/* ---------------- People and access (treasurer) ---------------- */
const accessView = s => {
  const me = String(Session.email || '').toLowerCase();
  const active = (Session.access || []).filter(a => a.status === 'active');
  const nameOf = a => { const m = a.member_id ? (s.members || []).find(x => x.id === a.member_id) : null; return (m && m.name) || a.email.split('@')[0]; };
  const roleOrder = { treasurer: 0, secretary: 1, member: 2 };
  const people = active.slice().sort((a, b) => roleOrder[a.role] - roleOrder[b.role] || nameOf(a).localeCompare(nameOf(b))).map(a => {
    const m = a.member_id ? (s.members || []).find(x => x.id === a.member_id) : null, self = String(a.email).toLowerCase() === me;
    return `<button type="button" class="li has-av" data-act="personOpen" data-e="${esc(a.email)}">${m ? __M_src_ui_avatar_js.av(m, 42) : pav(nameOf(a), null, 42)}<span class="li-main"><b>${esc(nameOf(a))}${self ? ' <span class="tag">You</span>' : ''}</b><small>${esc(a.email)}</small></span><span class="li-end"><span class="rtag r-${esc(a.role)}">${esc(Perm.label(a.role))}</span>${a.member_id || a.role === 'treasurer' ? '' : '<span class="dot-warn" title="Not on the member list"></span>'}${icon('chev', 'chev')}</span></button>`;
  }).join('');
  const now = new Date();
  const codes = (Session.codes || []).filter(c => !c.revoked_at && new Date(c.expires_at) > now && c.uses < c.max_uses);
  const invs = (Session.invites || []).filter(i => i.status === 'pending' || i.status === 'expired');
  const until = d => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  const open = [
    ...codes.map(c => `<div class="li has-ic"><span class="li-ic t-gold">${icon('key')}</span><span class="li-main"><b class="num">${esc(c.prefix)}-••••-••</b><small>${esc(Perm.label(c.role))} code · ${esc(c.uses)} of ${esc(c.max_uses)} used · until ${esc(until(c.expires_at))}</small></span><span class="li-end"><button type="button" class="btn sm ghost" data-act="codeRevoke" data-id="${esc(c.id)}">Cancel</button></span></div>`),
    ...invs.map(i => `<div class="li has-ic"><span class="li-ic t-info">${icon('mail')}</span><span class="li-main"><b style="overflow-wrap:anywhere">${esc(i.invited_email)}</b><small>${esc(Perm.label(i.intended_role))} · ${i.status === 'pending' ? 'until ' + esc(until(i.expires_at)) : 'expired'}</small></span><span class="li-end"><button type="button" class="btn sm" data-act="resendInvite" data-i="${esc(i.id)}">Resend</button>${i.status === 'pending' ? `<button type="button" class="btn sm ghost" data-act="revokeInvite" data-i="${esc(i.id)}" aria-label="Cancel invitation">${icon('close', 's')}</button>` : ''}</span></div>`)
  ].join('');
  const ws = (Session.workspaces || []).find(w => w.chama_id === Store.chamaId) || {};
  return `<h1 class="lt">People and access</h1><p class="lt-sub">${active.length} ${active.length === 1 ? 'person' : 'people'} can open ${esc(s.chama.name)}</p>
<div class="invite-hero"><div><b>Bring someone in</b><span>A code for WhatsApp or SMS, or an email link.</span></div>
<div class="ih-btns"><button type="button" class="ih-b" data-act="inviteSheet" data-v="code">${icon('key')}<span>Share a code</span></button><button type="button" class="ih-b" data-act="inviteSheet" data-v="email">${icon('mail')}<span>Send an email</span></button></div></div>
${Requests.listHtml()}
${Roles.officerHtml()}
<section class="sec"><div class="sec-h"><h2>People</h2><button type="button" data-act="loadAccess">Refresh</button></div><div class="list">${people || '<div class="li empty">Only you so far</div>'}</div>
${active.some(a => !a.member_id && a.role !== 'treasurer') ? '<p class="foot-note"><span class="dot-warn"></span> Not on the member list yet. Tap them to add them.</p>' : ''}</section>
${open ? `<section class="sec"><div class="sec-h"><h2>Open invitations</h2></div><div class="list">${open}</div></section>` : ''}
<section class="sec"><div class="list"><button type="button" class="li has-ic" data-act="tagEdit"><span class="li-ic t-ink">${icon('tag')}</span><span class="li-main"><b>Chama tag</b><small>Shown to people joining, so they know it is the right group</small></span><span class="li-end"><b class="num">${esc(ws.display_tag || '—')}</b>${icon('chev', 'chev')}</span></button></div></section>`;
};

const views = {
  requests(s) {
    if (!Session.role || Session.role === 'member') return `<div class="card">${emptyState('people', 'Nothing to approve', 'Only the treasurer and secretary approve new people.')}</div>`;
    const list = Requests.listHtml(true);
    if (Date.now() - (Requests.lastView || 0) > 15000) { Requests.lastView = Date.now(); setTimeout(() => Requests.refresh(false).catch(() => {}), 0); }
    return `<h1 class="lt">Join requests</h1><p class="lt-sub">People who used an invite code</p>${list || `<div class="card">${emptyState('done', 'All caught up', 'Nobody is waiting to join.')}</div>`}`;
  }
};

const actions = {
  sheetClose: () => Sheet.close(),
  inviteSheet: d => Inv.open(d.v || 'code'),
  invTab: d => { Inv.tab = d.v; Inv.err = ''; Inv.paint(); },
  invRole: d => { Inv.role = d.v; if (d.v === 'treasurer' && Inv.record === 'new') Inv.record = ''; Inv.paint(); },
  invHours: d => { Inv.hours = Number(d.v); Inv.paint(); },
  invUses: d => { Inv.uses = Math.max(1, Math.min(100, Inv.uses + Number(d.v))); Inv.paint(); },
  invGo: () => Inv.go(),
  invAgain: () => { const t = Inv.tab; Inv.reset(t); Inv.paint(); },
  invCopy: () => {
    const c = Inv.result && Inv.result.code; if (!c) return;
    const done = () => { const el = document.getElementById('tkCode'); if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } toast('Code copied', 'ok'); };
    if (navigator.clipboard) navigator.clipboard.writeText(c).then(done, () => toast('Press and hold the code to copy it', 'info')); else toast('Press and hold the code to copy it', 'info');
  },
  invShare: async () => {
    const s = Store.get(), text = Inv.shareText((s && s.chama.name) || 'our Chama');
    if (navigator.share) { try { await navigator.share({ text }); } catch (e) { /* closed */ } }
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('Invitation text copied', 'ok'), () => {});
  },
  rqOpen: d => { Requests.i = Number(d.i) || 0; Requests.prompt(); },
  rqNext: () => { Requests.i = (Requests.i + 1) % Math.max(1, (Session.requests || []).length); Requests.prompt(); },
  rqRole: d => { const r = (Session.requests || [])[Requests.i]; if (!r) return; const st = Requests.state(r); st.role = d.v; if (d.v === 'treasurer' && st.record === 'new') st.record = 'none'; Requests.prompt(); },
  rqApprove: d => Requests.decide(d.id, true),
  rqDecline: d => Pop.confirm({ title: 'Decline this request?', text: 'They will be told their request was declined. They can ask again with a new code.', confirmLabel: 'Decline', danger: true, onYes: () => Requests.decide(d.id, false) }),
  personOpen: d => Person.open(d.e),
  personRole: d => {
    const a = (Session.access || []).find(x => x.email === d.e); if (!a || a.role === d.v) return;
    const s = Store.get() || { members: [] }, m = a.member_id ? s.members.find(x => x.id === a.member_id) : null, name = (m && m.name) || a.email.split('@')[0];
    const done = async (r, msg) => { await Session.loadAccess(); await Roles.load().catch(() => {}); render(); if (r && r.applied) toast(msg || 'Role changed. They have been told.', 'ok'); else Pop.alert(name + ' has been asked. Nothing changes until they accept. You will be told their answer.', { title: 'Offer sent', label: 'OK', calm: true }); Person.open(d.e); };
    if (d.v === 'member') return Modal.open({ title: 'Make ' + name.split(' ')[0] + ' a member?', submitLabel: 'Change role', danger: true,
      body: `<p class="plain">They stop being ${esc(ROLE[a.role].t)} at once. Tell them why: they will see exactly what you write.</p>`,
      fields: [{ name: 'why', label: 'Reason', type: 'textarea', placeholder: 'e.g. We agreed at the March meeting to rotate the secretary role.', required: true }],
      onSubmit: v => { const why = String(v.why || '').trim(); if (why.length < 10) throw new Error('Write a short reason (at least 10 characters)'); setTimeout(async () => { try { done(await Roles.offer(d.e, 'member', why)); } catch (e) { toast(e.message); } }, 0); } });
    if (d.v === 'secretary') {
      const cur = (Session.access || []).filter(x => x.status === 'active' && x.role === 'secretary' && x.email !== d.e);
      return Pop.confirm({ title: 'Offer the secretary role?', text: name + ' will be asked to accept. ' + (cur.length ? 'When they accept, the current secretary becomes a member: there is one secretary at a time.' : 'They keep the register, call meetings and take minutes, without seeing other members’ money.'), confirmLabel: 'Send the offer',
        onYes: async () => { try { done(await Roles.offer(d.e, 'secretary')); } catch (e) { toast(e.message); } } });
    }
    return __M_src_features_index_js.Actions.handover({ e: d.e });
  },
  personLink: async d => {
    const sel = document.getElementById('personRec');
    try { await Session.linkRecord(d.e, sel ? sel.value : 'new'); toast('Added to the member list', 'ok'); Person.open(d.e); } catch (e) { toast(e.message); }
  },
  tagEdit: () => {
    const ws = (Session.workspaces || []).find(w => w.chama_id === Store.chamaId) || {};
    Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('tag')}</span><h3>Chama tag</h3><p>Four letters or numbers. People joining see it next to the name, so they know they have the right group.</p></div>
<label class="fgrp" for="codeTag"><span class="field tagfield"><input id="codeTag" maxlength="4" autocapitalize="characters" autocorrect="off" spellcheck="false" value="${esc(ws.display_tag || '')}" autofocus></span></label>
<button type="button" class="btn pri block lg" data-act="tagSave">Save tag</button>`, { key: 'tag', label: 'Chama tag' });
  }
};

return { get views() { return views; }, get actions() { return actions; }, get Sheet() { return Sheet; }, get Requests() { return Requests; }, get Roles() { return Roles; }, get REMOVE_WHY() { return REMOVE_WHY; }, get Inv() { return Inv; }, get accessView() { return accessView; }, get pav() { return pav; }, get ROLE() { return ROLE; } };
})();

document.addEventListener('change', e => {
  const t = e.target; if (!t) return;
  const R = __M_src_features_requests_js;
  if (t.id === 'rqRecord') { const r = (__M_src_core_session_js.Session.requests || [])[R.Requests.i]; if (r) { R.Requests.state(r).record = t.value; R.Requests.prompt(); } }
  if (t.id === 'invRecord') R.Inv.record = t.value;
});
document.addEventListener('input', e => {
  const t = e.target; if (!t) return;
  const R = __M_src_features_requests_js;
  if (t.id === 'rqName') { const r = (__M_src_core_session_js.Session.requests || [])[R.Requests.i]; if (r) R.Requests.state(r).name = t.value; }
  if (t.id === 'invEmail2') { R.Inv.email = t.value; if (R.Inv.err) { R.Inv.err = ''; const x = document.querySelector('.sx .ferr'); if (x) x.textContent = ''; } }
  if (t.id === 'codeTag') { const v = t.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); if (v !== t.value) t.value = v; }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.id === 'invEmail2') { e.preventDefault(); __M_src_features_requests_js.Inv.go(); } });


/* ---- src/features/chat/index.js ----
   Messages inside a Chama: one group conversation and private conversations.
   What each role can send is decided by the server (send_chama_message); this only shows the right tools.
     member     text in the group, private messages to the treasurer or secretary, vote, reply to meetings, "I have paid"
     secretary  + announcements, meeting notices with an attendance register, minutes and resolutions, polls, pinning
     treasurer  + payment requests and personal statements, private messages to anyone */
const __M_src_features_chat_index_js = (function () {
const { Backend } = __M_src_core_backend_js;
const { render } = __M_src_core_rerender_js;
const { Session, Perm } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { Domain } = __M_src_core_domain_js;
const { esc, kes, monthLabel } = __M_src_core_utils_js;
const { toast, Pop } = __M_src_ui_toast_js;
const R = () => __M_src_features_requests_js;

const TOOLS = {
  announcement: { t: 'Announcement', d: 'Pinned at the top for everyone', ic: 'bell', roles: ['treasurer', 'secretary'], group: true },
  meeting: { t: 'Call a meeting', d: 'Date, place and agenda. People reply if they are coming', ic: 'clock', roles: ['treasurer', 'secretary'], group: true },
  minutes: { t: 'Share minutes', d: 'What was discussed and what was decided', ic: 'doc', roles: ['treasurer', 'secretary'], group: true },
  poll: { t: 'Start a vote', d: 'Ask the group to choose', ic: 'chart', roles: ['treasurer', 'secretary'], group: true },
  payment_request: { t: 'Request a payment', d: 'Ask one member or everyone to pay', ic: 'wallet', roles: ['treasurer'] },
  statement: { t: 'Send a statement', d: 'Their savings, loan and fines, privately', ic: 'receipt', roles: ['treasurer'], direct: true }
};
const ROLE_T = r => Perm.label(r);
const dayKey = d => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
const dayLabel = d => { const k = dayKey(d), t = dayKey(Date.now()), y = dayKey(Date.now() - 864e5); return k === t ? 'Today' : k === y ? 'Yesterday' : new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' }); };
const hm = d => new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
const short = d => { const k = dayKey(d); return k === dayKey(Date.now()) ? hm(d) : new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }); };
const linkify = t => esc(t).replace(/\n/g, '<br>');

const Chat = {
  msgs: [], resp: [], contacts: [], unread: {}, loaded: false, busy: false, _chan: null, _timer: 0, draft: {}, form: null,
  me() { return Session.user && Session.user.id; },
  thread(m) { return !m.recipient ? 'group' : m.sender === this.me() ? m.recipient : m.sender; },
  contact(id) { return this.contacts.find(c => c.user_id === id); },
  can(kind) { const t = TOOLS[kind]; return !!t && t.roles.includes(Session.role); },
  tools(thread) { return Object.keys(TOOLS).filter(k => this.can(k) && (thread === 'group' ? !TOOLS[k].direct : !TOOLS[k].group)); },
  totalUnread() { return Object.values(this.unread).reduce((a, b) => a + (b || 0), 0); },
  async load() {
    if (!Backend.sb || !Session.user || !Store.chamaId) return;
    const cid = Store.chamaId;
    const [m, r, c, u] = await Promise.all([
      Backend.sb.from('chama_messages').select('*').eq('chama_id', cid).order('created_at', { ascending: false }).limit(300),
      Backend.sb.from('chama_message_responses').select('message_id,user_id,choice,name,created_at').eq('chama_id', cid),
      this.contacts.length ? Promise.resolve({ data: this.contacts }) : Backend.sb.rpc('chat_contacts', { p_cid: cid }),
      Backend.sb.rpc('chat_unread', { p_cid: cid })
    ]);
    if (!m.error) this.msgs = (m.data || []).slice().reverse();
    if (!r.error) this.resp = r.data || [];
    if (!c.error) this.contacts = c.data || [];
    if (!u.error) { this.unread = {}; (u.data || []).forEach(x => { this.unread[x.thread] = x.unread; }); }
    this.loaded = true;
    this.paintBadge(); render();
  },
  watch() {
    if (!Backend.sb || !Session.user || this._chan) return;
    this.load().catch(() => {});
    try {
      this._chan = Backend.sb.channel('chat-' + Store.chamaId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chama_messages', filter: 'chama_id=eq.' + Store.chamaId }, p => this.onRow(p))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chama_message_responses', filter: 'chama_id=eq.' + Store.chamaId }, () => this.loadResponses())
        .subscribe();
    } catch (e) { /* the timer keeps it fresh */ }
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (!document.hidden) this.load().catch(() => {}); }, /^#\/chat/.test(location.hash) ? 20000 : 60000);
  },
  async loadResponses() { const { data, error } = await Backend.sb.from('chama_message_responses').select('message_id,user_id,choice,name,created_at').eq('chama_id', Store.chamaId); if (!error) { this.resp = data || []; render(); } },
  onRow(p) {
    const row = p.new; if (!row || !row.id) return;
    const i = this.msgs.findIndex(x => x.id === row.id);
    if (i >= 0) this.msgs[i] = row; else this.msgs.push(row);
    const th = this.thread(row), open = location.hash === '#/chat/' + th;
    if (i < 0 && row.sender !== this.me()) {
      if (open && !document.hidden) this.markRead(th);
      else { this.unread[th] = (this.unread[th] || 0) + 1; if (!/^#\/chat/.test(location.hash)) toast((row.sender_name || 'Someone') + ': ' + (row.body || TOOLS[row.kind] && TOOLS[row.kind].t || 'New message').slice(0, 80), 'info', { label: 'Open', run: () => { location.hash = '#/chat/' + th; } }); }
    }
    this.paintBadge(); render();
  },
  markRead(th) {
    if (!this.unread[th]) return;
    this.unread[th] = 0; this.paintBadge();
    Backend.sb.rpc('mark_thread_read', { p_cid: Store.chamaId, p_thread: th }).then(() => {}, () => {});
  },
  paintBadge() {
    const n = this.totalUnread(), a = document.querySelector('#nav a[data-k="chat"]'); if (!a) return;
    let b = a.querySelector('.nav-badge'); if (!b) { b = document.createElement('span'); b.className = 'nav-badge'; a.appendChild(b); }
    b.hidden = !n; b.textContent = n > 99 ? '99+' : String(n);
  },
  scrollEnd(smooth) { setTimeout(() => { const el = document.getElementById('chatEnd'); if (el) el.scrollIntoView({ block: 'end', behavior: smooth ? 'smooth' : 'auto' }); }, 30); },
  responses(id) { return this.resp.filter(r => r.message_id === id); },
  mine(id) { const r = this.resp.find(x => x.message_id === id && x.user_id === this.me()); return r ? r.choice : null; },

  /* ---------------- views ---------------- */
  inbox(s) {
    if (!this.loaded) { this.load().catch(() => {}); return `<h1 class="lt">Chat</h1>${Skel.page()}`; }
    const threads = {};
    this.msgs.forEach(m => { threads[this.thread(m)] = m; });
    const row = (th, title, sub, avatar, last) => `<a class="li has-av ch-row${this.unread[th] ? ' unread' : ''}" href="#/chat/${esc(th)}">${avatar}<span class="li-main"><span class="ch-top"><b>${esc(title)}</b>${last ? `<time>${esc(short(last.created_at))}</time>` : ''}</span><span class="ch-sub"><small>${sub}</small>${this.unread[th] ? `<span class="ch-n">${this.unread[th]}</span>` : ''}</span></span></a>`;
    const preview = m => !m ? 'Say hello to the group' : m.deleted_at ? 'Message removed' : esc((m.sender === this.me() ? 'You: ' : (m.sender_name || '').split(' ')[0] + ': ') + (m.kind === 'text' ? m.body : (TOOLS[m.kind] ? TOOLS[m.kind].t : '') + (m.body ? ' · ' + m.body : ''))).slice(0, 140);
    const name = (s.chama && s.chama.name) || 'Chama';
    const group = row('group', name, preview(threads.group), `<span class="av grp" style="--n:46px">${icon('members')}</span>`, threads.group);
    const dms = Object.keys(threads).filter(t => t !== 'group').sort((a, b) => threads[b].created_at.localeCompare(threads[a].created_at)).map(t => {
      const c = this.contact(t) || { name: threads[t].sender === this.me() ? 'Former member' : threads[t].sender_name, role: threads[t].sender_role };
      return row(t, c.name, `<span class="rtag r-${esc(c.role)}">${esc(ROLE_T(c.role))}</span> ${preview(threads[t])}`, R().pav(c.name, c.photo, 46), threads[t]);
    }).join('');
    const pinned = this.msgs.filter(m => m.pinned && !m.recipient && !m.deleted_at).slice(-1)[0];
    const records = this.msgs.filter(m => ['meeting', 'minutes', 'poll'].includes(m.kind) && !m.deleted_at).length;
    return `<div class="ch-head"><h1 class="lt">Chat</h1><button type="button" class="btn pri sm" data-act="chatNew">${icon('pencil', 's')}New message</button></div>
${pinned ? `<a class="pin-card" href="#/chat/group">${icon('bell', 's')}<span><b>Pinned</b>${esc((pinned.body || '').slice(0, 120))}</span></a>` : ''}
<div class="list ch-list">${group}${dms}</div>
${records ? `<section class="sec"><div class="list"><a class="li has-ic" href="#/chat/records"><span class="li-ic t-info">${icon('doc')}</span><span class="li-main"><b>Meetings, minutes and votes</b><small>${records} on record</small></span>${icon('chev', 'chev')}</a></div></section>` : ''}
${Session.role === 'member' ? '<p class="foot-note">The group sees group messages. Private messages go only to the treasurer or secretary you write to.</p>' : '<p class="foot-note">Tap <b>+</b> in a conversation for your role’s tools.</p>'}`;
  },
  records(s) {
    const items = this.msgs.filter(m => ['meeting', 'minutes', 'poll', 'announcement'].includes(m.kind) && !m.deleted_at && !m.recipient).slice().reverse();
    return `<h1 class="lt">Meetings, minutes and votes</h1><p class="lt-sub">The group’s record, newest first</p>${items.length ? `<div class="rec-list">${items.map(m => this.card(m, s, true)).join('')}</div>` : `<div class="card">${emptyState('ledger', 'Nothing on record yet', 'Meetings, minutes and votes appear here once the secretary or treasurer shares them.')}</div>`}`;
  },
  threadView(s, th) {
    if (!this.loaded) { this.load().catch(() => {}); return Skel.page(); }
    if (th === 'records') return this.records(s);
    const c = th === 'group' ? null : this.contact(th);
    if (th !== 'group' && !c && !this.msgs.some(m => this.thread(m) === th)) return `<div class="card">${emptyState('lost', 'Conversation not found', 'This person may have left the Chama.', '<a class="btn pri" href="#/chat">Back to chat</a>')}</div>`;
    const list = this.msgs.filter(m => this.thread(m) === th);
    setTimeout(() => this.markRead(th), 300);
    let lastDay = '', lastSender = '';
    const body = list.map(m => {
      let out = '';
      const dk = dayKey(m.created_at); if (dk !== lastDay) { out += `<div class="ch-day"><span>${esc(dayLabel(m.created_at))}</span></div>`; lastDay = dk; lastSender = ''; }
      const mine = m.sender === this.me(), cont = lastSender === m.sender && m.kind === 'text'; lastSender = m.kind === 'text' ? m.sender : '';
      if (m.kind !== 'text' && !m.deleted_at) return out + `<div class="ch-card-wrap${mine ? ' mine' : ''}">${this.card(m, s)}</div>`;
      const who = th === 'group' && !mine && !cont ? `<span class="ch-who">${esc(m.sender_name)}${m.sender_role !== 'member' ? ` <span class="rtag r-${esc(m.sender_role)}">${esc(ROLE_T(m.sender_role))}</span>` : ''}</span>` : '';
      const txt = m.deleted_at ? `<i class="mute">${icon('close', 's')}Message removed</i>` : linkify(m.body);
      return out + `<div class="bub-row${mine ? ' mine' : ''}${cont ? ' cont' : ''}">${who}<div class="bub" ${!m.deleted_at && (mine || Session.role !== 'member') ? `data-act="msgMenu" data-id="${esc(m.id)}" tabindex="0"` : ''}>${txt}<span class="bub-t">${m.edited_at && !m.deleted_at ? 'edited · ' : ''}${esc(hm(m.created_at))}${m.pinned ? ' · ' + icon('bell', 's') : ''}</span></div></div>`;
    }).join('');
    const title = th === 'group' ? ((s.chama && s.chama.name) || 'Group') : c ? c.name : 'Conversation';
    const sub = th === 'group' ? (this.contacts.length + 1) + ' people' : c ? ROLE_T(c.role) : '';
    const tools = this.tools(th);
    const canWrite = th === 'group' || (c && c.can_message);
    const pinned = th === 'group' ? this.msgs.filter(m => m.pinned && !m.recipient && !m.deleted_at).slice(-1)[0] : null;
    /* follow the conversation only when it is opened or grows, never while someone reads older messages */
    const seen = (this._seen = this._seen || {}), key = th + ':' + list.length;
    if (seen.th !== th || seen.key !== key) { const first = seen.th !== th; seen.th = th; seen.key = key; this.scrollEnd(!first); }
    return `<div class="ch-thread"><div class="ch-bar">${th === 'group' ? `<span class="av grp" style="--n:40px">${icon('members')}</span>` : R().pav(title, c && c.photo, 40)}<div><b>${esc(title)}</b><small>${esc(sub)}</small></div></div>
${pinned ? `<button type="button" class="pin-card" data-act="chatJump" data-id="${esc(pinned.id)}">${icon('bell', 's')}<span><b>Pinned</b>${esc((pinned.body || '').slice(0, 120))}</span></button>` : ''}
<div class="ch-msgs" id="chMsgs">${body || `<div class="ch-empty">${art('group')}<p>${th === 'group' ? 'Nothing here yet. Say hello to everyone.' : 'Start a private conversation.'}</p></div>`}<span id="chatEnd"></span></div>
${canWrite ? `<form class="composer" id="chatForm" data-th="${esc(th)}" autocomplete="off">${tools.length ? `<button type="button" class="cp-tools" data-act="chatTools" data-th="${esc(th)}" aria-label="Tools">${icon('plus')}</button>` : ''}
<textarea id="chatIn" rows="1" maxlength="4000" placeholder="${th === 'group' ? 'Message everyone' : 'Message ' + esc((c && c.name || '').split(' ')[0])}" aria-label="Message">${esc(this.draft[th] || '')}</textarea>
<button type="submit" class="cp-send" aria-label="Send"${this.busy ? ' disabled' : ''}>${icon('up')}</button></form>` : `<p class="foot-note">You can message the treasurer or the secretary privately.</p>`}</div>`;
  },

  /* ---------------- special messages ---------------- */
  card(m, s, full) {
    const meta = m.meta || {}, officer = Session.role !== 'member', mine = m.sender === this.me();
    const by = `<span class="cc-by">${esc(m.sender_name)} · ${esc(ROLE_T(m.sender_role))} · ${esc(short(m.created_at))}</span>`;
    const menu = (mine || Session.role === 'treasurer' || (officer && !m.recipient)) ? `<button type="button" class="cc-more" data-act="msgMenu" data-id="${esc(m.id)}" aria-label="Options">${icon('more')}</button>` : '';
    const rs = this.responses(m.id), my = this.mine(m.id);
    if (m.kind === 'announcement') return `<article class="cc cc-ann" id="m-${esc(m.id)}"><header>${icon('bell')}<span>Announcement${m.pinned ? ' · pinned' : ''}</span>${menu}</header>${meta.title ? `<h4>${esc(meta.title)}</h4>` : ''}<p>${linkify(m.body)}</p>${by}</article>`;
    if (m.kind === 'meeting') {
      const w = new Date(meta.when), ok = !isNaN(w), cnt = k => rs.filter(r => r.choice === k).length, past = ok && w < Date.now();
      const att = meta.attendance || null, present = att ? Object.values(att).filter(v => v === 'present').length : 0;
      const agenda = String(meta.agenda || '').split('\n').map(x => x.trim()).filter(Boolean);
      return `<article class="cc cc-meet" id="m-${esc(m.id)}"><header>${icon('clock')}<span>Meeting${past ? ' · held' : ''}</span>${menu}</header>
<div class="mt-row"><div class="mt-date"><b>${ok ? w.toLocaleDateString('en-KE', { day: 'numeric' }) : '—'}</b><span>${ok ? w.toLocaleDateString('en-KE', { month: 'short' }) : ''}</span></div><div><h4>${esc(meta.title || 'Chama meeting')}</h4><p class="mute">${ok ? esc(w.toLocaleDateString('en-KE', { weekday: 'long' }) + ' · ' + hm(w)) : ''}${meta.place ? ' · ' + esc(meta.place) : ''}</p></div></div>
${agenda.length ? `<ol class="mt-ag">${agenda.map(a => `<li>${esc(a)}</li>`).join('')}</ol>` : ''}${m.body ? `<p>${linkify(m.body)}</p>` : ''}
${past ? '' : `<div class="rsvp">${[['yes', 'Coming'], ['maybe', 'Maybe'], ['no', 'Not coming']].map(([k, t]) => `<button type="button" class="${my === k ? 'on' : ''}" data-act="msgRespond" data-id="${esc(m.id)}" data-v="${k}">${t}<span class="num">${cnt(k)}</span></button>`).join('')}</div>`}
${att ? `<p class="mt-reg">${icon('check', 's')}Register: ${present} present · kept by ${esc(meta.register_by || '')}</p>` : ''}
<div class="cc-btns">${past ? '' : `<button type="button" class="btn sm" data-act="icsExport">${icon('clock', 's')}Add to calendar</button>`}${officer ? `<button type="button" class="btn sm tint" data-act="meetRegister" data-id="${esc(m.id)}">${icon('members', 's')}${att ? 'Update register' : 'Take attendance'}</button>` : ''}</div>${by}</article>`;
    }
    if (m.kind === 'minutes') {
      const res = String(meta.resolutions || '').split('\n').map(x => x.trim()).filter(Boolean);
      return `<article class="cc cc-min" id="m-${esc(m.id)}"><header>${icon('doc')}<span>Minutes${meta.date ? ' · ' + esc(new Date(meta.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })) : ''}</span>${menu}</header><h4>${esc(meta.title || 'Meeting minutes')}</h4>
${meta.present ? `<p class="mute">Present: ${esc(meta.present)}</p>` : ''}${m.body ? `<div class="min-body${full ? '' : ' clamp'}">${linkify(m.body)}</div>` : ''}
${res.length ? `<div class="min-res"><b>Resolved</b><ol>${res.map(r => `<li>${esc(r)}</li>`).join('')}</ol></div>` : ''}${by}</article>`;
    }
    if (m.kind === 'poll') {
      const opts = meta.options || [], total = rs.length, closed = !!meta.closed;
      return `<article class="cc cc-poll" id="m-${esc(m.id)}"><header>${icon('chart')}<span>Vote${closed ? ' · closed' : ''}</span>${menu}</header><h4>${esc(m.body)}</h4>
<div class="poll">${opts.map((o, i) => { const n = rs.filter(r => r.choice === String(i)).length, pc = total ? Math.round(n / total * 100) : 0; return `<button type="button" class="po${my === String(i) ? ' on' : ''}" data-act="msgRespond" data-id="${esc(m.id)}" data-v="${i}"${closed ? ' disabled' : ''} style="--p:${pc}%"><span class="po-t">${my === String(i) ? icon('check', 's') : ''}${esc(o)}</span><span class="po-n num">${pc}%</span></button>`; }).join('')}</div>
<p class="mute small">${total} ${total === 1 ? 'vote' : 'votes'}${my != null ? ' · you voted' : ''}${officer && !closed ? ` · <button type="button" class="linkish" data-act="pollClose" data-id="${esc(m.id)}">Close the vote</button>` : ''}</p>${by}</article>`;
    }
    if (m.kind === 'payment_request') {
      const paid = rs.filter(r => r.choice === 'paid');
      return `<article class="cc cc-pay" id="m-${esc(m.id)}"><header>${icon('wallet')}<span>Payment request${m.recipient ? '' : ' · everyone'}</span>${menu}</header>
<div class="pay-amt num">${esc(kes(meta.amount))}</div><p>${esc(meta.reason || 'Contribution')}${meta.due ? ' · due ' + esc(new Date(meta.due).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })) : ''}</p>
${s.chama && s.chama.payTo ? `<p class="mute">Pay to ${esc(s.chama.payTo)}</p>` : ''}${m.body ? `<p>${linkify(m.body)}</p>` : ''}
${!mine ? `<div class="rsvp two"><button type="button" class="${my === 'paid' ? 'on' : ''}" data-act="msgRespond" data-id="${esc(m.id)}" data-v="paid">${icon('check', 's')}I have paid</button><button type="button" class="${my === 'later' ? 'on' : ''}" data-act="msgRespond" data-id="${esc(m.id)}" data-v="later">I’ll pay later</button></div>`
        : `<p class="mt-reg">${paid.length ? icon('check', 's') + esc(paid.map(r => r.name).join(', ')) + ' say they paid' : 'No answers yet'}</p>`}${by}</article>`;
    }
    if (m.kind === 'statement') {
      const rows = [['Saved so far', kes(meta.saved)], ['This month', meta.owed > 0 ? kes(meta.owed) + ' still owed' : 'Paid up'], ['Loan balance', kes(meta.loan)], ['Unpaid fines', kes(meta.fines)]];
      return `<article class="cc cc-st" id="m-${esc(m.id)}"><header>${icon('receipt')}<span>Statement · ${esc(meta.month ? monthLabel(meta.month) : '')}</span>${menu}</header><h4>${esc(meta.name || '')}</h4>
<div class="st-grid">${rows.map(([k, v]) => `<div><small>${esc(k)}</small><b class="num">${esc(v)}</b></div>`).join('')}</div>${m.body ? `<p>${linkify(m.body)}</p>` : ''}${by}</article>`;
    }
    return '';
  },

  /* ---------------- composing ---------------- */
  async send(th, kind, body, meta) {
    if (this.busy) return false;
    this.busy = true;
    try {
      const { data, error } = await Backend.sb.rpc('send_chama_message', { p_cid: Store.chamaId, p_kind: kind, p_body: body || '', p_meta: meta || {}, p_recipient: th === 'group' ? null : th });
      if (error) throw new Error(rpcMessage(error));
      if (data && data.id && !this.msgs.some(x => x.id === data.id)) this.msgs.push(data);
      this.draft[th] = ''; this.busy = false; render(); this.scrollEnd(true);
      return true;
    } catch (e) { this.busy = false; toast(e.message); return false; }
  },
  toolSheet(th) {
    const list = this.tools(th);
    R().Sheet.open(`<div class="sx-head"><h3>${Session.role === 'secretary' ? 'Secretary tools' : 'Treasurer tools'}</h3><p>${th === 'group' ? 'These go to the whole group.' : 'This goes only to this person.'}</p></div>
<div class="tool-grid">${list.map(k => `<button type="button" class="tool" data-act="chatForm" data-k="${k}" data-th="${esc(th)}"><span class="tool-ic">${icon(TOOLS[k].ic)}</span><b>${esc(TOOLS[k].t)}</b><small>${esc(TOOLS[k].d)}</small></button>`).join('')}</div>`, { key: 'tools', label: 'Tools' });
  },
  formSheet(kind, th) {
    const s = Store.get() || { members: [], chama: {} }, f = (id, lab, inner) => `<label class="fgrp" for="${id}"><span class="flab">${lab}</span>${inner}</label>`;
    const fld = (id, ph, v, type, extra) => `<span class="field"><input id="${id}" type="${type || 'text'}" placeholder="${esc(ph || '')}" value="${esc(v || '')}"${extra || ''}></span>`;
    const area = (id, ph, rows) => `<span class="field area"><textarea id="${id}" rows="${rows || 3}" placeholder="${esc(ph || '')}"></textarea></span>`;
    let inner = '';
    const soon = new Date(Date.now() + 3 * 864e5); soon.setHours(14, 0, 0, 0);
    const local = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    if (kind === 'announcement') inner = f('fTitle', 'Heading (optional)', fld('fTitle', 'e.g. Change of meeting venue')) + f('fBody', 'Announcement', area('fBody', 'What everyone should know', 4)) + `<label class="check"><input type="checkbox" id="fPin" checked><span class="box">${icon('check')}</span><span>Pin it at the top of the chat</span></label>`;
    if (kind === 'meeting') inner = f('fTitle', 'Meeting', fld('fTitle', 'e.g. Monthly meeting', 'Monthly meeting')) + f('fWhen', 'Date and time', fld('fWhen', '', local(soon), 'datetime-local')) + f('fPlace', 'Where', fld('fPlace', 'e.g. Wanjiku’s home, or a Google Meet link')) + f('fAgenda', 'Agenda, one item per line', area('fAgenda', 'Contributions\nLoan requests\nAny other business', 4));
    if (kind === 'minutes') {
      const meets = this.msgs.filter(m => m.kind === 'meeting' && !m.deleted_at).slice(-6).reverse();
      inner = (meets.length ? f('fMeet', 'For the meeting', `<span class="field"><select id="fMeet"><option value="">Not linked to a meeting</option>${meets.map(m => `<option value="${esc(m.id)}">${esc((m.meta && m.meta.title) || 'Meeting')} · ${esc(new Date(m.meta.when).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }))}</option>`).join('')}</select></span>`) : '')
        + f('fTitle', 'Title', fld('fTitle', 'e.g. Minutes of the November meeting', 'Minutes of the ' + new Date().toLocaleDateString('en-KE', { month: 'long' }) + ' meeting'))
        + f('fDate', 'Meeting date', fld('fDate', '', new Date().toISOString().slice(0, 10), 'date'))
        + f('fBody', 'What was discussed', area('fBody', 'Short notes, in order', 5)) + f('fRes', 'What was decided, one per line', area('fRes', 'Loan for Achieng approved at 10%\nNext meeting on 14 December', 3));
    }
    if (kind === 'poll') inner = f('fBody', 'Question', fld('fBody', 'e.g. Should we raise the contribution to 2,500?')) + `<div class="fgrp"><span class="flab">Choices</span><div id="pollOpts">${['Yes', 'No'].map((v, i) => `<span class="field"><input class="pollOpt" placeholder="Choice ${i + 1}" value="${v}"></span>`).join('')}</div><button type="button" class="btn sm ghost" data-act="pollAdd">${icon('plus', 's')}Add a choice</button></div>`;
    if (kind === 'payment_request' || kind === 'statement') {
      const people = this.contacts.filter(c => c.member_id);
      const to = th === 'group' ? '' : th;
      const sel = `<span class="field"><select id="fTo">${kind === 'payment_request' ? '<option value="group">Everyone</option>' : ''}${people.map(c => `<option value="${esc(c.user_id)}"${c.user_id === to ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></span>`;
      if (kind === 'payment_request') {
        const c = this.contact(to), owed = c && c.member_id ? Domain.outstanding(s, c.member_id, Domain.now()) : 0;
        inner = f('fTo', 'Who should pay', sel) + f('fAmt', 'Amount (KES)', fld('fAmt', '', String(owed || s.chama.monthly || ''), 'number', ' inputmode="numeric" min="1"')) + f('fReason', 'For', fld('fReason', '', 'Contribution for ' + monthLabel(Domain.now()))) + f('fDue', 'Pay by', fld('fDue', '', (() => { const d = new Date(); d.setDate(Number(s.chama.dueDay) || 10); if (d < new Date()) d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10); })(), 'date')) + f('fBody', 'Note (optional)', area('fBody', 'Anything else they should know', 2));
      } else {
        if (!people.length) inner = '<p class="plain">Nobody on the member list has an account yet.</p>';
        else inner = f('fTo', 'Statement for', sel) + f('fBody', 'Note (optional)', area('fBody', 'e.g. Thank you for paying on time', 2)) + '<p class="sx-note">' + icon('shield', 's') + '<span>Only this person sees it.</span></p>';
      }
    }
    R().Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon(TOOLS[kind].ic)}</span><h3>${esc(TOOLS[kind].t)}</h3><p>${esc(TOOLS[kind].d)}</p></div>${inner}
<button type="button" class="btn pri block lg" data-act="chatSubmit" data-k="${kind}" data-th="${esc(th)}">${icon('up')}<span>Send</span></button>`, { key: 'form', label: TOOLS[kind].t });
  },
  async submitForm(kind, th) {
    const v = id => { const e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; };
    const s = Store.get();
    let body = v('fBody'), meta = {}, to = th;
    if (kind === 'announcement') { meta = { title: v('fTitle'), pin: !!(document.getElementById('fPin') || {}).checked }; if (!body) return toast('Write the announcement'); to = 'group'; }
    if (kind === 'meeting') { const w = v('fWhen'); if (!w) return toast('Choose the date and time'); meta = { title: v('fTitle') || 'Chama meeting', when: new Date(w).toISOString(), place: v('fPlace'), agenda: v('fAgenda') }; body = ''; to = 'group'; }
    if (kind === 'minutes') {
      const mid = v('fMeet'), mt = mid ? this.msgs.find(m => m.id === mid) : null, att = mt && mt.meta && mt.meta.attendance;
      const present = att ? Object.entries(att).filter(([, x]) => x === 'present').map(([u]) => (this.contact(u) || {}).name || (u === this.me() ? Session.displayName() : '')).filter(Boolean).join(', ') : '';
      meta = { title: v('fTitle'), date: v('fDate'), resolutions: v('fRes'), meeting: mid || null, present };
      if (!body && !meta.resolutions) return toast('Add the notes or what was decided'); to = 'group';
    }
    if (kind === 'poll') { const opts = [...document.querySelectorAll('.pollOpt')].map(i => i.value.trim()).filter(Boolean); if (!body) return toast('Write the question'); if (opts.length < 2) return toast('Add at least two choices'); meta = { options: opts.slice(0, 8) }; to = 'group'; }
    if (kind === 'payment_request') { const amt = Number(v('fAmt')); if (!(amt > 0)) return toast('Enter the amount'); meta = { amount: amt, reason: v('fReason'), due: v('fDue') }; to = v('fTo') || 'group'; }
    if (kind === 'statement') {
      to = v('fTo'); const c = this.contact(to); if (!c || !c.member_id) return toast('Choose a member');
      const mk = Domain.now();
      meta = { name: c.name, month: mk, saved: Domain.memberSaved(s, c.member_id), owed: Domain.outstanding(s, c.member_id, mk), loan: Domain.memberLoanBalance(s, c.member_id), fines: Domain.memberFinesDue(s, c.member_id) };
    }
    const ok = await this.send(to, kind, body, meta);
    if (ok) { R().Sheet.close(); toast(TOOLS[kind].t + ' sent', 'ok'); if (location.hash !== '#/chat/' + to) location.hash = '#/chat/' + to; }
  },
  register(id) {
    const m = this.msgs.find(x => x.id === id); if (!m) return;
    const att = (m.meta && m.meta.attendance) || {}, rs = this.responses(id);
    const people = [{ user_id: this.me(), name: Session.displayName() + ' (you)', role: Session.role }, ...this.contacts];
    R().Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('members')}</span><h3>Attendance register</h3><p>${esc((m.meta && m.meta.title) || 'Meeting')}. Tap to mark each person.</p></div>
<div class="reg">${people.map(p => { const st = att[p.user_id] || (rs.find(r => r.user_id === p.user_id && r.choice === 'no') ? 'apology' : ''); return `<div class="reg-row" data-u="${esc(p.user_id)}"><span class="reg-n"><b>${esc(p.name)}</b><small>${esc(ROLE_T(p.role))}</small></span><span class="reg-seg">${[['present', 'Present'], ['apology', 'Apology'], ['absent', 'Absent']].map(([k, t]) => `<button type="button" class="${st === k ? 'on ' + k : ''}" data-act="regMark" data-u="${esc(p.user_id)}" data-v="${k}">${t}</button>`).join('')}</span></div>`; }).join('')}</div>
<button type="button" class="btn pri block lg" data-act="regSave" data-id="${esc(id)}">Save register</button>`, { key: 'reg', label: 'Attendance register' });
  },
  newMessage() {
    const people = this.contacts.filter(c => c.can_message);
    R().Sheet.open(`<div class="sx-head"><h3>New message</h3><p>${Session.role === 'member' ? 'Write privately to the treasurer or secretary, or to the whole group.' : 'Write to the group or to one person.'}</p></div>
<div class="list sx-list"><a class="li has-av" href="#/chat/group" data-act="sheetClose"><span class="av grp" style="--n:42px">${icon('members')}</span><span class="li-main"><b>Everyone</b><small>The group conversation</small></span>${icon('chev', 'chev')}</a>
${people.map(c => `<a class="li has-av" href="#/chat/${esc(c.user_id)}" data-act="sheetClose">${R().pav(c.name, c.photo, 42)}<span class="li-main"><b>${esc(c.name)}</b><small>${esc(ROLE_T(c.role))}</small></span>${icon('chev', 'chev')}</a>`).join('')}</div>`, { key: 'new', label: 'New message' });
  },
  msgMenu(id) {
    const m = this.msgs.find(x => x.id === id); if (!m) return;
    const mine = m.sender === this.me(), officer = Session.role !== 'member';
    const rows = [];
    if (m.body && navigator.clipboard) rows.push(`<button type="button" class="li has-ic" data-act="msgCopy" data-id="${esc(id)}"><span class="li-ic">${icon('copy')}</span><span class="li-main"><b>Copy text</b></span></button>`);
    /* the same rule as the server: your own words, or an officer keeping the group's notice board */
    const canEdit = !m.deleted_at && ['text', 'announcement', 'minutes'].includes(m.kind) && (mine || (officer && !m.recipient && (m.kind === 'announcement' || m.pinned)));
    if (canEdit) rows.push(`<button type="button" class="li has-ic" data-act="msgEdit" data-id="${esc(id)}"><span class="li-ic">${icon('pencil')}</span><span class="li-main"><b>Edit</b><small>${m.kind === 'announcement' || m.pinned ? 'Everyone sees it was edited' : 'Shows as edited'}</small></span></button>`);
    if (officer && !m.recipient) rows.push(`<button type="button" class="li has-ic" data-act="msgPin" data-id="${esc(id)}" data-v="${m.pinned ? '0' : '1'}"><span class="li-ic t-gold">${icon('bell')}</span><span class="li-main"><b>${m.pinned ? 'Unpin' : 'Pin to the top'}</b></span></button>`);
    if (mine || Session.role === 'treasurer') rows.push(`<button type="button" class="li has-ic danger" data-act="msgRemove" data-id="${esc(id)}"><span class="li-ic t-bad">${icon('trash')}</span><span class="li-main"><b>Remove for everyone</b></span></button>`);
    if (!rows.length) return;
    R().Sheet.open(`<div class="list sx-list">${rows.join('')}</div>`, { key: 'msg', label: 'Message options' });
  }
};

const views = {
  chat(s) { return Chat.inbox(s); }
};

const actions = {
  chatNew: () => Chat.newMessage(),
  chatTools: d => Chat.toolSheet(d.th),
  chatForm: d => Chat.formSheet(d.k, d.th),
  chatSubmit: d => Chat.submitForm(d.k, d.th),
  chatJump: d => { const el = document.getElementById('m-' + d.id) || [...document.querySelectorAll('[data-id="' + d.id + '"]')][0]; if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('hl'); setTimeout(() => el.classList.remove('hl'), 1600); } },
  pollAdd: () => { const box = document.getElementById('pollOpts'); if (!box) return; const n = box.querySelectorAll('.pollOpt').length; if (n >= 8) return toast('Up to 8 choices'); box.insertAdjacentHTML('beforeend', `<span class="field"><input class="pollOpt" placeholder="Choice ${n + 1}"></span>`); box.lastElementChild.querySelector('input').focus(); },
  msgRespond: async d => {
    const prev = Chat.mine(d.id);
    Chat.resp = Chat.resp.filter(r => !(r.message_id === d.id && r.user_id === Chat.me())).concat([{ message_id: d.id, user_id: Chat.me(), choice: String(d.v), name: Session.displayName() }]); render();
    const { error } = await Backend.sb.rpc('respond_chama_message', { p_id: d.id, p_choice: String(d.v) });
    if (error) { Chat.resp = Chat.resp.filter(r => !(r.message_id === d.id && r.user_id === Chat.me())); if (prev) Chat.resp.push({ message_id: d.id, user_id: Chat.me(), choice: prev }); render(); return toast(rpcMessage(error)); }
    if (d.v === 'paid') { try { __M_src_features_auth_gate_js.Haptic.ok(); } catch (e) {} Pop.alert('paid:' + d.id, { title: 'You marked this as paid', html: `<div class="sx-tick big-tick">${icon('check')}</div><p>The treasurer has been alerted. Your payment shows as paid once they confirm the money arrived. Keep your M-Pesa message until then.</p>`, label: 'Done' }); }
  },
  pollClose: d => Pop.confirm({ title: 'Close this vote?', text: 'Nobody can vote or change their vote after this.', confirmLabel: 'Close vote', onYes: async () => { const { error } = await Backend.sb.rpc('close_poll', { p_id: d.id }); if (error) return toast(rpcMessage(error)); await Chat.load(); } }),
  meetRegister: d => Chat.register(d.id),
  regMark: d => { const row = document.querySelector(`.reg-row[data-u="${d.u}"]`); if (!row) return; row.querySelectorAll('button').forEach(b => { b.className = b.dataset.v === d.v ? 'on ' + d.v : ''; }); },
  regSave: async d => {
    const att = {}; document.querySelectorAll('.reg-row').forEach(r => { const on = r.querySelector('button.on'); if (on) att[r.dataset.u] = on.dataset.v; });
    const { error } = await Backend.sb.rpc('record_attendance', { p_id: d.id, p_attendance: att });
    if (error) return toast(rpcMessage(error));
    R().Sheet.close(); toast('Register saved', 'ok'); await Chat.load();
  },
  msgMenu: d => Chat.msgMenu(d.id),
  msgEdit: d => {
    const m = Chat.msgs.find(x => x.id === d.id); if (!m) return;
    const titled = m.kind === 'announcement' || m.kind === 'minutes', meta = m.meta || {};
    R().Sheet.open(`<div class="sx-head"><span class="sx-badge">${icon('pencil')}</span><h3>Edit ${m.kind === 'text' ? 'message' : m.kind}</h3><p>The earlier wording is kept, and people see that it was edited.</p></div>
${titled ? `<label class="fgrp" for="meTitle"><span class="flab">Title</span><span class="field"><input id="meTitle" maxlength="120" value="${esc(meta.title || '')}"></span></label>` : ''}
<label class="fgrp" for="meBody"><span class="flab">Text</span><textarea id="meBody" class="ta" rows="6" maxlength="4000">${esc(m.body || '')}</textarea></label>
<button type="button" class="btn pri block lg" data-act="msgEditSave" data-id="${esc(m.id)}">Save changes</button>`, { key: 'msgEdit', label: 'Edit message' });
  },
  msgEditSave: async d => {
    const body = ((document.getElementById('meBody') || {}).value || '').trim(), t = document.getElementById('meTitle');
    if (!body) return toast('The message cannot be empty');
    const { error } = await Backend.sb.rpc('edit_chama_message', { p_id: d.id, p_body: body, p_title: t ? t.value.trim() : null });
    if (error) return toast(/Could not find the function|PGRST202|schema cache/i.test(error.message || '') ? 'Editing needs the latest server update. Ask the app owner to apply it.' : rpcMessage(error));
    R().Sheet.close(); toast('Saved. People see it was edited.', 'ok'); await Chat.load();
  },
  msgCopy: d => { const m = Chat.msgs.find(x => x.id === d.id); R().Sheet.close(); if (m) navigator.clipboard.writeText(m.body).then(() => toast('Copied', 'ok'), () => {}); },
  msgPin: async d => { R().Sheet.close(); const { error } = await Backend.sb.rpc('pin_chama_message', { p_id: d.id, p_pin: d.v === '1' }); if (error) return toast(rpcMessage(error)); await Chat.load(); },
  msgRemove: d => { R().Sheet.close(); Pop.confirm({ title: 'Remove this message?', text: 'It is removed for everyone. People will see that a message was removed.', confirmLabel: 'Remove', danger: true, onYes: async () => { const { error } = await Backend.sb.rpc('retract_chama_message', { p_id: d.id }); if (error) return toast(rpcMessage(error)); await Chat.load(); } }); }
};

return { get views() { return views; }, get actions() { return actions; }, get Chat() { return Chat; }, get TOOLS() { return TOOLS; } };
})();

/* the composer: Enter sends on a computer, the button on a phone; the box grows with the text */
document.addEventListener('submit', e => {
  if (!e.target || e.target.id !== 'chatForm') return;
  e.preventDefault();
  const C = __M_src_features_chat_index_js.Chat, th = e.target.dataset.th, inp = document.getElementById('chatIn');
  const t = inp ? inp.value.trim() : ''; if (!t) return;
  C.draft[th] = ''; if (inp) inp.value = '';
  C.send(th, 'text', t, {}).then(ok => { if (!ok) { C.draft[th] = t; const i = document.getElementById('chatIn'); if (i) i.value = t; } else { const i = document.getElementById('chatIn'); if (i) i.focus(); } });
});
document.addEventListener('input', e => {
  if (!e.target || e.target.id !== 'chatIn') return;
  const f = document.getElementById('chatForm'); if (f) __M_src_features_chat_index_js.Chat.draft[f.dataset.th] = e.target.value;
  e.target.style.height = 'auto'; e.target.style.height = Math.min(140, e.target.scrollHeight) + 'px';
});
document.addEventListener('keydown', e => {
  if (!e.target || e.target.id !== 'chatIn' || e.key !== 'Enter' || e.shiftKey || matchMedia('(pointer: coarse)').matches) return;
  e.preventDefault(); const f = document.getElementById('chatForm'); if (f) f.requestSubmit();
});


/* ---- src/features/smart/index.js ----
   The app noticing things for people. Pure reads of the Chama document unless stated.
   Algorithms: risk radar, cash forecast, loan limits, anomaly checks, streaks, projections, attendance.
   Tools: search (/ or Ctrl+K), keyboard shortcuts, privacy mode, app lock, calendar export, bulk reminders,
   receipts, member register, feedback, setup checklist, savings goal, pull to refresh. */
const __M_src_features_smart_js = (function () {
const { Backend } = __M_src_core_backend_js;
const { render } = __M_src_core_rerender_js;
const { Session, Perm } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { Domain } = __M_src_core_domain_js;
const { Auth } = __M_src_core_auth_js;
const { esc, kes, monthLabel, addMonths, sum, waLink, uid } = __M_src_core_utils_js;
const { Reports } = __M_src_lib_reports_js;
const { av } = __M_src_ui_avatar_js;
const { toast, Pop } = __M_src_ui_toast_js;
const R = () => __M_src_features_requests_js, C = () => __M_src_features_chat_index_js.Chat;
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const longMonth = mk => { const [y, m] = mk.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }); };

/* ================= algorithms ================= */
const Smart = {
  /* consecutive months, newest first, in which the member was fully paid up */
  streak(s, mid) {
    let mk = Domain.now(); if (Domain.status(s, mid, mk) !== 'paid') mk = addMonths(mk, -1);
    let n = 0;
    while (mk >= Domain.joinMonth(s, mid) && n < 60 && Domain.paidThrough(s, mid, mk) >= Domain.dueThrough(s, mid, mk) && Domain.paidIn(s, mid, mk) > 0) { n++; mk = addMonths(mk, -1); }
    return n;
  },
  /* 0..1: how likely this member is to fall behind. Late history, the recent trend, debt against savings, unpaid fines. */
  risk(s, mid) {
    const cur = Domain.now(); let late = 0, n = 0, recent = 0;
    for (let i = 5; i >= 0; i--) {
      const mk = addMonths(cur, -i); if (!Domain.isOverdue(s, mk) || mk < Domain.joinMonth(s, mid)) continue;
      n++; const bad = Domain.paidIn(s, mid, mk) < Domain.dueFor(s, mid) && Domain.paidThrough(s, mid, mk) < Domain.dueThrough(s, mid, mk);
      if (bad) { late++; if (i <= 1) recent++; }
    }
    const saved = Domain.memberSaved(s, mid), loan = Domain.memberLoanBalance(s, mid), fines = Domain.memberFinesDue(s, mid);
    const score = (n ? 0.45 * late / n : 0) + 0.25 * Math.min(1, recent / 2) + 0.2 * Math.min(1, loan / (saved + 1)) + (fines > 0 ? 0.1 : 0);
    const why = [n && late ? late + ' of ' + n + ' months late' : '', recent ? 'late recently' : '', loan > saved ? 'loan above savings' : '', fines ? kes(fines) + ' unpaid fines' : ''].filter(Boolean);
    return { score: Math.round(score * 100) / 100, level: score >= 0.5 ? 'high' : score >= 0.25 ? 'watch' : 'low', why };
  },
  /* the share of what was expected that actually came in, over the last three closed months */
  collectionRate(s) {
    const cur = Domain.now(); let exp = 0, got = 0;
    for (let i = 1; i <= 3; i++) { const mk = addMonths(cur, -i); s.members.forEach(m => { if (mk >= Domain.joinMonth(s, m.id)) { exp += Domain.dueFor(s, m.id); got += Math.min(Domain.paidIn(s, m.id, mk), Domain.dueFor(s, m.id)); } }); }
    return exp ? Math.min(1, got / exp) : 1;
  },
  /* cash on hand for the next three months: expected contributions at the usual rate, loan instalments due,
     minus the pot (merry-go-round) and the usual spending */
  forecast(s) {
    const rate = this.collectionRate(s), monthly = sum(s.members, m => Domain.dueFor(s, m.id));
    const cur = Domain.now();
    const spend = sum(s.expenses.filter(e => String(e.date || '').slice(0, 7) >= addMonths(cur, -3)), e => e.amount) / 3;
    const loans = s.loans.map(l => ({ l, d: Domain.loan(l) })).filter(x => x.d.balance > 0);
    let cash = Domain.cashOnHand(s); const out = [];
    for (let i = 1; i <= 3; i++) {
      const inflow = monthly * rate, repay = sum(loans, x => Math.min(x.d.installment, Math.max(0, x.d.balance - x.d.installment * (i - 1))));
      const pot = s.chama.mode === 'savings' ? 0 : monthly * rate;
      cash = cash + inflow + repay - pot - spend;
      out.push({ mk: addMonths(cur, i), cash: Math.round(cash), inflow: Math.round(inflow + repay), outflow: Math.round(pot + spend) });
    }
    return { rate, out };
  },
  /* a suggested ceiling for a new loan: three times savings, scaled by reliability, minus what they owe, never more than half the cash */
  loanLimit(s, mid) {
    const rel = Domain.reliability(s, mid), saved = Domain.memberSaved(s, mid);
    const base = saved * 3 * (rel == null ? 0.6 : Math.max(0.2, rel / 100)) - Domain.memberLoanBalance(s, mid);
    return Math.max(0, Math.round(Math.min(base, Domain.cashOnHand(s) * 0.5) / 100) * 100);
  },
  /* payments that look out of pattern: far above or below the member's usual, the same payment twice, or a far-future month */
  anomalies(s) {
    const out = [], cur = Domain.now(), cutoff = addMonths(cur, -2);
    s.members.forEach(m => {
      const ps = s.payments.filter(p => p.memberId === m.id), amts = ps.map(p => p.amount).sort((a, b) => a - b), med = amts.length ? amts[Math.floor(amts.length / 2)] : 0;
      ps.filter(p => p.month >= cutoff).forEach(p => {
        if (med && amts.length >= 3 && (p.amount > med * 3 || p.amount < med * 0.3)) out.push({ p, m, why: `${kes(p.amount)} is unusual for ${m.name.split(' ')[0]} (usually ${kes(med)})` });
        if (p.month > addMonths(cur, 2)) out.push({ p, m, why: `Recorded for ${monthLabel(p.month)}, more than two months ahead` });
      });
      const seen = {};
      ps.forEach(p => { const k = p.date + '|' + p.amount + '|' + p.month; if (seen[k] && !p.code) out.push({ p, m, why: `Same amount, month and date as another payment by ${m.name.split(' ')[0]}` }); seen[k] = 1; });
    });
    return out.slice(0, 8);
  },
  overdueLoans(s) {
    const today = new Date();
    return s.loans.map(l => ({ l, d: Domain.loan(l) })).filter(x => x.d.balance > 0 && x.l.date).map(x => {
      const due = new Date(x.l.date); due.setMonth(due.getMonth() + Number(x.l.months || 1));
      return { ...x, due, overdue: due < today, soon: due >= today && (due - today) < 14 * 864e5 };
    }).filter(x => x.overdue || x.soon);
  },
  heat(s, mid) {
    const cur = Domain.now(); const cells = [];
    for (let i = 11; i >= 0; i--) { const mk = addMonths(cur, -i); cells.push({ mk, st: Domain.status(s, mid, mk) }); }
    return cells;
  },
  /* meetings with a register: how often this person was there */
  attendance(userId) {
    const meets = (C().msgs || []).filter(m => m.kind === 'meeting' && m.meta && m.meta.attendance);
    const seen = meets.filter(m => userId in m.meta.attendance), present = seen.filter(m => m.meta.attendance[userId] === 'present').length;
    return seen.length ? { rate: Math.round(present / seen.length * 100), n: seen.length } : null;
  },
  nextTurn(s, mid) {
    if (s.chama.mode === 'savings' || !mid) return null;
    const cur = Domain.now();
    for (let i = 0; i < 48; i++) { const mk = addMonths(cur, i), r = Domain.recipient(s, mk); if (r && r.id === mid && !s.payouts.some(p => p.month === mk && p.memberId === mid && i === 0)) return { mk, months: i }; }
    return null;
  },
  projection(s, mid) {
    const cur = Domain.now(); let paid = 0, n = 0;
    for (let i = 1; i <= 6; i++) { const mk = addMonths(cur, -i); if (mk < Domain.joinMonth(s, mid)) continue; n++; paid += Domain.paidIn(s, mid, mk); }
    const avg = n ? paid / n : Domain.dueFor(s, mid), left = 12 - new Date().getMonth();
    return { avg: Math.round(avg), byDec: Math.round(Domain.memberSaved(s, mid) + avg * (left - (Domain.status(s, mid, cur) === 'paid' ? 1 : 0))) };
  },
  recap(s) {
    const d = new Date(); if (d.getDate() > 7 || s.shared) return null;
    const mk = addMonths(Domain.now(), -1), prev = addMonths(mk, -1);
    const col = k => sum(s.payments.filter(p => p.month === k), p => p.amount), exp = sum(s.members, m => mk >= Domain.joinMonth(s, m.id) ? Domain.dueFor(s, m.id) : 0);
    const onTime = s.members.filter(m => mk >= Domain.joinMonth(s, m.id) && Domain.paidThrough(s, m.id, mk) >= Domain.dueThrough(s, m.id, mk)).length, total = s.members.filter(m => mk >= Domain.joinMonth(s, m.id)).length;
    const top = s.members.map(m => ({ m, n: this.streak(s, m.id) })).sort((a, b) => b.n - a.n)[0];
    return { mk, got: col(mk), exp, change: col(prev) ? Math.round((col(mk) - col(prev)) / col(prev) * 100) : null, onTime, total, top };
  }
};

/* ================= what needs you today ================= */
const tasks = s => {
  const out = [], role = Session.role, cur = Domain.now();
  if (role === 'treasurer' && !s.shared) {
    const rq = (Session.requests || []).length; if (rq) out.push(['key', 't-warn', rq + (rq === 1 ? ' person wants' : ' people want') + ' to join', 'Approve or decline', 'rqOpen', '']);
    const late = Domain.lateMembers(s); if (late.length) out.push(['chat', 't-bad', late.length + ' behind for ' + monthLabel(cur), 'Remind them in one go', 'remindAll', '']);
    const finedNow = new Set(s.fines.filter(f => String(f.date || '').slice(0, 7) === cur && /late/i.test(f.reason || '')).map(f => f.memberId));
    const unfined = late.filter(m => !finedNow.has(m.id)); if (unfined.length && Number(s.chama.finePerLate) > 0) out.push(['receipt', 't-gold', unfined.length + ' late, no fine yet', kes(s.chama.finePerLate) + ' each, by your rules', 'autoFines', '']);
    const rec = Domain.recipient(s); if (s.chama.mode !== 'savings' && rec && !s.payouts.some(p => p.month === cur) && new Date().getDate() >= Number(s.chama.dueDay)) out.push(['coins', '', 'Send the pot to ' + rec.name.split(' ')[0], 'This month’s payout is not marked', 'go', '#/home']);
    const unsigned = s.payouts.filter(p => !p.sig).length; if (unsigned) out.push(['sign', 't-info', unsigned + ' payout' + (unsigned === 1 ? '' : 's') + ' not signed for', 'Ask for a signature', 'go', '#/history']);
    Smart.overdueLoans(s).slice(0, 2).forEach(x => out.push(['loans', x.overdue ? 't-bad' : 't-warn', Domain.memberName(s, x.l.memberId) + (x.overdue ? '’s loan is overdue' : '’s loan is due soon'), kes(x.d.balance) + ' left · due ' + x.due.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }), 'go', '#/loans']));
    const unl = (Session.access || []).filter(a => a.status === 'active' && !a.member_id && a.role !== 'treasurer').length; if (unl) out.push(['members', 't-warn', unl + ' not on the member list', 'Their money cannot show', 'go', '#/settings/actions']);
  }
  if (role === 'secretary') {
    const rq = (Session.requests || []).length; if (rq) out.push(['key', 't-warn', rq + ' waiting to join', 'Approve or decline', 'rqOpen', '']);
    const held = (C().msgs || []).filter(m => m.kind === 'meeting' && m.meta && Date.parse(m.meta.when) < Date.now() && !m.deleted_at);
    const last = held[held.length - 1];
    if (last && !last.meta.attendance) out.push(['members', 't-info', 'Take the register', (last.meta.title || 'Meeting') + ' was held', 'meetRegister', last.id]);
    if (last && !(C().msgs || []).some(m => m.kind === 'minutes' && Date.parse(m.created_at) > Date.parse(last.meta.when))) out.push(['doc', 't-gold', 'Share the minutes', 'For ' + (last.meta.title || 'the last meeting'), 'chatForm', 'minutes']);
  }
  const me = Session.user && Session.user.id;
  (C().msgs || []).filter(m => !m.deleted_at && m.sender !== me).forEach(m => {
    const mine = C().mine(m.id);
    if (m.kind === 'payment_request' && (!m.recipient || m.recipient === me) && !mine) out.push(['wallet', 't-warn', 'Payment request: ' + kes(m.meta.amount), m.meta.reason || 'From the treasurer', 'go', '#/chat/' + (m.recipient ? m.sender : 'group')]);
    if (m.kind === 'meeting' && !mine && Date.parse(m.meta.when) > Date.now()) out.push(['clock', 't-info', 'Are you coming?', (m.meta.title || 'Meeting') + ' · ' + new Date(m.meta.when).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' }), 'go', '#/chat/group']);
    if (m.kind === 'poll' && !mine && !(m.meta && m.meta.closed)) out.push(['chart', '', 'Vote: ' + String(m.body).slice(0, 50), 'Your voice counts', 'go', '#/chat/group']);
  });
  return out.slice(0, 6);
};
const taskHtml = s => {
  const t = tasks(s); if (!t.length) return '';
  return `<section class="sec"><div class="sec-h"><h2>Needs you today</h2><span class="cnt-b">${t.length}</span></div><div class="list">${t.map(([ic, tone, title, sub, act, arg]) =>
    act === 'go' ? `<a class="li has-ic" href="${esc(arg)}"><span class="li-ic ${tone}">${icon(ic)}</span><span class="li-main"><b>${esc(title)}</b><small>${esc(sub)}</small></span>${icon('chev', 'chev')}</a>`
      : `<button type="button" class="li has-ic" data-act="${act}" ${act === 'meetRegister' ? `data-id="${esc(arg)}"` : act === 'chatForm' ? `data-k="${esc(arg)}" data-th="group"` : ''}><span class="li-ic ${tone}">${icon(ic)}</span><span class="li-main"><b>${esc(title)}</b><small>${esc(sub)}</small></span>${icon('chev', 'chev')}</button>`).join('')}</div></section>`;
};

/* ================= home blocks ================= */
const homeBlocks = s => {
  let out = '';
  const rc = Smart.recap(s);
  if (rc && rc.exp) out += `<section class="recap"><div class="rc-top"><small>${esc(longMonth(rc.mk))} in review</small><button type="button" class="linkish" data-act="recapHide" data-v="${esc(rc.mk)}" aria-label="Hide">${icon('close', 's')}</button></div>
<div class="rc-grid"><div><b class="num">${esc(kes(rc.got))}</b><span>collected of ${esc(kes(rc.exp))}</span></div><div><b class="num">${rc.onTime}/${rc.total}</b><span>paid on time</span></div><div><b class="num">${rc.change == null ? '—' : (rc.change >= 0 ? '+' : '') + rc.change + '%'}</b><span>vs the month before</span></div></div>
${rc.top && rc.top.n >= 3 ? `<p class="rc-star">${icon('sparkle', 's')}${esc(rc.top.m.name)} is on a ${rc.top.n}-month streak</p>` : ''}</section>`;
  if (ls.get('mca-recap-hide', '') === (rc && rc.mk)) out = '';
  out += taskHtml(s);
  if (Session.role === 'treasurer' && !s.shared && !ls.get('mca-setup-done:' + Store.chamaId, false)) {
    const ws = (Session.workspaces || []).find(w => w.chama_id === Store.chamaId) || {};
    const steps = [['Add your members', s.members.length >= 2, 'addMember', ''], ['Set where members pay', !!s.chama.payTo, 'chamaEdit', 'payTo'], ['Write the group rules', !!String(s.chama.rules || '').trim(), 'chamaEdit', 'rules'], ['Invite people to the app', (Session.access || []).filter(a => a.status === 'active').length > 1, 'inviteSheet', 'code'], ['Record the first payment', s.payments.length > 0, 'go', '#/grid'], ['Call your first meeting', (C().msgs || []).some(m => m.kind === 'meeting'), 'chatForm', 'meeting'], ['Give the Chama a tag', !!ws.display_tag, 'tagEdit', '']];
    const done = steps.filter(x => x[1]).length;
    if (done < steps.length) out += `<section class="setup"><div class="su-top"><div><b>Set up ${esc(s.chama.name)}</b><small>${done} of ${steps.length} done</small></div><div class="ring" style="--p:${Math.round(done / steps.length * 100)}"><span class="num">${Math.round(done / steps.length * 100)}%</span></div></div>
<div class="su-list">${steps.map(([t, ok, act, arg]) => ok ? `<div class="su-i ok">${icon('check', 's')}<span>${esc(t)}</span></div>` : act === 'go' ? `<a class="su-i" href="${esc(arg)}"><i></i><span>${esc(t)}</span>${icon('chev', 's')}</a>` : `<button type="button" class="su-i" data-act="${act}" ${act === 'chamaEdit' ? `data-f="${arg}"` : act === 'chatForm' ? `data-k="${arg}" data-th="group"` : act === 'inviteSheet' ? `data-v="${arg}"` : ''}><i></i><span>${esc(t)}</span>${icon('chev', 's')}</button>`).join('')}</div>
<button type="button" class="linkish su-x" data-act="setupHide">Hide this</button></section>`;
  }
  /* savings goals: several at once; each counts what was collected from the month it was set (older goals count everything) */
  const goals = goalsOf(s);
  goals.forEach(g => {
    const have = goalHave(s, g), pc = Math.min(100, Math.round(have / g.amount * 100));
    const left = g.by ? Math.max(0, Math.ceil((new Date(g.by) - new Date()) / (30.4 * 864e5))) : null;
    const need = left ? Math.max(0, Math.round((g.amount - have) / left)) : 0;
    out += `<section class="goal${pc >= 100 ? ' done' : ''}"${Auth.isAdmin() ? ` data-act="goalEdit" data-id="${esc(g.id)}" role="button" tabindex="0"` : ''}><div class="gl-top"><span>${icon('sparkle', 's')}${pc >= 100 ? 'Goal reached' : 'Goal'}${g.since ? ' · since ' + esc(__M_src_core_utils_js.monthLabel(g.since)) : ''}</span><b class="num">${pc}%</b></div><h3>${esc(g.title || 'Our goal')}</h3>
<div class="bar"><i style="width:${pc}%"></i></div><p class="mute small">${esc(kes(have))} of ${esc(kes(g.amount))}${left != null ? ` · ${left} months left${need ? ' · about ' + esc(kes(need)) + ' a month' : ''}` : ''}</p></section>`;
  });
  if (Auth.isAdmin() && s.members.length && goals.length < 6) out += `<button type="button" class="goal-add" data-act="goalEdit">${icon('plus', 's')}${goals.length ? 'Add another goal' : 'Set a savings goal for the group'}</button>`;
  const meId = s.shared ? s.shared.me : Session.memberId, me = meId ? s.members.find(m => m.id === meId) : null;
  if (me) {
    const nt = Smart.nextTurn(s, me.id), pj = Smart.projection(s, me.id), st = Smart.streak(s, me.id);
    out += `<div class="me-strip">${nt ? `<div><small>Your turn for the pot</small><b>${nt.months === 0 ? 'This month' : esc(longMonth(nt.mk))}</b><span>${nt.months ? 'in ' + nt.months + (nt.months === 1 ? ' month' : ' months') : 'it’s you'}</span></div>` : ''}
<div><small>By December</small><b class="num">${esc(kes(pj.byDec))}</b><span>at ${esc(kes(pj.avg))} a month</span></div>
<div><small>Streak</small><b class="num">${st} ${st === 1 ? 'month' : 'months'}</b><span>${st >= 6 ? 'outstanding' : st >= 3 ? 'keep it going' : 'paid on time'}</span></div></div>`;
  }
  if (s.shared && s.chama.payTo) out += `<button type="button" class="payto" data-act="copyPayTo">${icon('wallet', 's')}<span>Pay to <b>${esc(s.chama.payTo)}</b></span><em>Copy</em></button>`;
  if (Session.role === 'treasurer' && !s.shared && s.members.length >= 2) {
    const risky = s.members.filter(m => Smart.risk(s, m.id).level !== 'low').length, f = Smart.forecast(s).out[2];
    out += `<a class="insight-card" href="#/insights"><span class="ic-ic">${icon('chart')}</span><span><b>Insights</b><small>${risky ? risky + ' to watch · ' : ''}cash in 3 months ≈ ${esc(kes(f.cash))}</small></span>${icon('chev', 'chev')}</a>`;
  }
  return out;
};

/* ================= insights page (treasurer) ================= */
const insights = s => {
  if (s.shared) return `<div class="card">${emptyState('chart', 'For the treasurer', 'Insights use everyone’s records, so only the treasurer sees them.')}</div>`;
  const fc = Smart.forecast(s), max = Math.max(1, ...fc.out.map(x => Math.abs(x.cash)), Domain.cashOnHand(s));
  const risks = s.members.map(m => ({ m, r: Smart.risk(s, m.id) })).filter(x => x.r.level !== 'low').sort((a, b) => b.r.score - a.r.score);
  const an = Smart.anomalies(s);
  const streaks = s.members.map(m => ({ m, n: Smart.streak(s, m.id) })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5);
  const limits = s.members.map(m => ({ m, v: Smart.loanLimit(s, m.id) })).sort((a, b) => b.v - a.v).slice(0, 5);
  const bar = (label, v, now) => `<div class="fc-col"><div class="fc-bar${v < 0 ? ' neg' : ''}${now ? ' now' : ''}" style="--h:${Math.max(4, Math.round(Math.abs(v) / max * 100))}%"><span class="num">${esc(kes(v).replace('KES ', ''))}</span></div><small>${esc(label)}</small></div>`;
  return `<h1 class="lt">Insights</h1><p class="lt-sub">What the records say, worked out on this phone</p>
<section class="card"><h2>Cash forecast</h2><p class="plain">At this Chama’s usual collection rate of <b>${Math.round(fc.rate * 100)}%</b>, with loan instalments coming in${s.chama.mode === 'savings' ? '' : ' and the pot going out'}.</p>
<div class="fc">${bar('Now', Domain.cashOnHand(s), true)}${fc.out.map(x => bar(monthLabel(x.mk), x.cash)).join('')}</div>
${fc.out.some(x => x.cash < 0) ? `<p class="notice warn" style="margin-top:12px">${icon('alert', 's')}<span>Cash may run short by ${esc(monthLabel(fc.out.find(x => x.cash < 0).mk))}. Hold back new loans or follow up late payments.</span></p>` : ''}</section>
<section class="sec"><div class="sec-h"><h2>Members to watch</h2></div>${risks.length ? `<div class="list">${risks.map(({ m, r }) => `<button type="button" class="li has-av" data-act="memberMenu" data-id="${esc(m.id)}">${av(m, 40)}<span class="li-main"><b>${esc(m.name)}</b><small>${esc(r.why.join(' · ') || 'Pattern changing')}</small></span><span class="li-end"><span class="risk r-${r.level}">${r.level === 'high' ? 'High' : 'Watch'}</span></span></button>`).join('')}</div>` : `<div class="card">${emptyState('done', 'Nobody at risk', 'Everyone has a steady record. Nice work.')}</div>`}
<p class="foot-note">Scored from the last six months: late months (45%), the last two months (25%), loan against savings (20%) and unpaid fines (10%).</p></section>
${an.length ? `<section class="sec"><div class="sec-h"><h2>Worth a second look</h2></div><div class="list">${an.map(a => `<div class="li has-ic"><span class="li-ic t-warn">${icon('alert')}</span><span class="li-main"><b>${esc(a.why)}</b><small>${esc(a.p.date || '')} · ${esc(monthLabel(a.p.month))}${a.p.code ? ' · ' + esc(a.p.code) : ''}</small></span></div>`).join('')}</div></section>` : ''}
<section class="sec"><div class="sec-h"><h2>Suggested loan limits</h2></div><div class="list">${limits.map(x => `<div class="li has-av">${av(x.m, 36)}<span class="li-main"><b>${esc(x.m.name)}</b><small>Saved ${esc(kes(Domain.memberSaved(s, x.m.id)))} · ${Domain.reliability(s, x.m.id) ?? '—'}% on time</small></span><span class="li-end"><b class="num">${esc(kes(x.v))}</b></span></div>`).join('')}</div>
<p class="foot-note">Three times savings, scaled by how reliably they pay, minus what they owe, and never more than half the cash on hand. A guide, not a rule.</p></section>
${streaks.length ? `<section class="sec"><div class="sec-h"><h2>Longest streaks</h2></div><div class="list">${streaks.map((x, i) => `<div class="li has-av">${av(x.m, 36)}<span class="li-main"><b>${esc(x.m.name)}</b><small>Paid on time ${x.n} months running</small></span><span class="li-end"><span class="streak">${i === 0 ? icon('sparkle', 's') : ''}${x.n}</span></span></div>`).join('')}</div></section>` : ''}`;
};

/* ================= member register (treasurer, secretary) ================= */
let regRows = null, regQ = '';
const register = s => {
  if (!Session.role || Session.role === 'member') return `<div class="card">${emptyState('people', 'For officers', 'The treasurer and the secretary keep the register.')}</div>`;
  if (regRows === null) { regRows = []; Backend.sb && Backend.sb.rpc('member_register', { p_cid: Store.chamaId }).then(r => { regRows = r.error ? [] : (r.data || []); render(); }, () => {}); return `<h1 class="lt">Member register</h1>${Skel.page()}`; }
  const q = regQ.trim().toLowerCase(), rows = regRows.filter(r => !q || [r.name, r.email, r.phone, r.role].join(' ').toLowerCase().includes(q));
  const tel = p => String(p || '').replace(/[^\d+]/g, '');
  return `<h1 class="lt">Member register</h1><p class="lt-sub">${regRows.length} people with access · contact details are private to officers</p>
<div class="nsearch"><label><svg class="mag ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS.search}</svg><span class="vh">Search the register</span><input id="regQ" type="search" placeholder="Name, phone or email" value="${esc(regQ)}" autocomplete="off"></label><button type="button" class="hb" data-act="regExport" aria-label="Download the register">${icon('download')}</button></div>
<div class="list" style="margin-top:12px">${rows.map(r => `<div class="li has-av reg-li">${R().pav(r.name, r.photo, 42)}<span class="li-main"><b>${esc(r.name)} <span class="rtag r-${esc(r.role)}">${esc(Perm.label(r.role))}</span></b><small>${esc(r.email || '')}${r.phone ? ' · ' + esc(r.phone) : ''}</small><small>Since ${esc(new Date(r.joined_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }))}${r.member_id ? '' : ' · not on the member list'}</small></span>
<span class="li-end reg-act">${r.phone ? `<a class="hb sm" href="tel:${esc(tel(r.phone))}" aria-label="Call ${esc(r.name)}">${icon('phone', 's')}</a><a class="hb sm" target="_blank" rel="noopener noreferrer" href="${esc(waLink(r.phone, 'Hello ' + r.name.split(' ')[0] + ','))}" aria-label="WhatsApp ${esc(r.name)}">${icon('chat', 's')}</a>` : ''}${r.email ? `<a class="hb sm" href="mailto:${esc(r.email)}" aria-label="Email ${esc(r.name)}">${icon('mail', 's')}</a>` : ''}</span></div>`).join('') || '<div class="li empty">No matches</div>'}</div>`;
};

/* ================= search ================= */
const Palette = {
  open: false, q: '', i: 0,
  items() {
    const s = Store.get() || { members: [], payments: [] }, admin = Auth.isAdmin(), off = Session.role && Session.role !== 'member';
    const pages = [['Home', '#/home', 'home'], ['Payments', '#/grid', 'grid'], ['Chat', '#/chat', 'chat'], ['Members', '#/members', 'members'], ['My profile', '#/profile', 'profile'], ['Loans', '#/loans', 'loans'], ['Fines', '#/fines', 'receipt'], ['Expenses', '#/expenses', 'wallet'], ['Notifications', '#/notifications', 'bell'], ['Meetings, minutes and votes', '#/chat/records', 'doc'], ['Settings', '#/settings', 'gear'], ['Display and accessibility', '#/settings/app', 'text'], ['Privacy and my data', '#/settings/privacy', 'shield'], ['Help', '#/settings/help', 'help'],
      ...(admin ? [['Insights', '#/insights', 'chart'], ['People and access', '#/settings/actions', 'members'], ['Chama settings', '#/settings/chama', 'gear'], ['History', '#/history', 'clock'], ['Reports and backup', '#/reports', 'download']] : []), ...(off ? [['Member register', '#/register', 'doc'], ['Join requests', '#/requests', 'key']] : [])]
      .map(([t, h, ic]) => ({ t, sub: 'Page', ic, href: h }));
    const acts = [...(admin ? [['Record a payment', 'quickPay', 'wallet'], ['New loan', 'addLoan', 'loans'], ['Add a member', 'addMember', 'userPlus'], ['Invite someone', 'inviteSheet', 'key'], ['Remind everyone who is late', 'remindAll', 'chat'], ['Set a savings goal', 'goalEdit', 'sparkle']] : []), ['New message', 'chatNew', 'pencil'], ['Add due dates to my calendar', 'icsExport', 'clock'], ['Send feedback', 'feedback', 'chat'], ['Hide or show amounts', 'moneyToggle', 'eye']]
      .map(([t, a, ic]) => ({ t, sub: 'Action', ic, act: a }));
    const mem = (s.members || []).map(m => ({ t: m.name, sub: 'Member' + (m.phone && admin ? ' · ' + m.phone : ''), ic: 'profile', act: 'memberMenu', id: m.id }));
    const pay = admin ? (s.payments || []).slice(-400).map(p => ({ t: (p.code || 'No code') + ' · ' + kes(p.amount), sub: Domain.memberName(s, p.memberId) + ' · ' + monthLabel(p.month) + ' · ' + (p.date || ''), ic: 'receipt', act: 'memberMenu', id: p.memberId })) : [];
    return [...acts, ...pages, ...mem, ...pay];
  },
  results() {
    const q = this.q.trim().toLowerCase(); const all = this.items();
    if (!q) return all.slice(0, 9);
    const words = q.split(/\s+/);
    return all.map(x => { const hay = (x.t + ' ' + x.sub).toLowerCase(); const ok = words.every(w => hay.includes(w)); return ok ? { x, sc: (x.t.toLowerCase().startsWith(q) ? 3 : 0) + (x.sub === 'Action' ? 1 : 0) } : null; }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 12).map(r => r.x);
  },
  html() {
    const r = this.results(); if (this.i >= r.length) this.i = 0;
    return `<div class="pal-veil" data-pal="x"><div class="pal" role="dialog" aria-modal="true" aria-label="Search"><label class="pal-in">${icon('search')}<input id="palQ" type="search" placeholder="Search people, payments, pages, actions" value="${esc(this.q)}" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></label>
<div class="pal-list" role="listbox">${r.map((x, i) => `<button type="button" class="pal-i${i === this.i ? ' on' : ''}" role="option" aria-selected="${i === this.i}" data-pal="${i}"><span class="li-ic ${x.sub === 'Action' ? '' : 't-ink'}">${icon(x.ic)}</span><span class="li-main"><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></span></button>`).join('') || '<p class="pal-empty">Nothing found. Try a name, an M-Pesa code or an amount.</p>'}</div>
<p class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>/</kbd> search anywhere</span></p></div></div>`;
  },
  show() { if (!Session.ready()) return; this.open = true; this.q = ''; this.i = 0; document.getElementById('jmRoot').innerHTML = this.html(); setTimeout(() => { const i = document.getElementById('palQ'); if (i) i.focus(); }, 30); },
  paint() { const root = document.getElementById('jmRoot'), list = root && root.querySelector('.pal-list'); if (!list) return; const tmp = document.createElement('div'); tmp.innerHTML = this.html(); list.replaceWith(tmp.querySelector('.pal-list')); },
  hide() { this.open = false; const r = document.getElementById('jmRoot'); if (r) r.innerHTML = ''; },
  go(i) {
    const x = this.results()[i]; if (!x) return; this.hide();
    if (x.href) { location.hash = x.href; return; }
    const a = __M_src_features_index_js.Actions[x.act]; if (!a) return;
    const fn = typeof a === 'function' ? a : a.run;
    if (typeof a === 'object' && a.admin && !Auth.isAdmin()) return toast('Only the treasurer can do that');
    try { fn.call(a, { id: x.id, v: x.act === 'inviteSheet' ? 'code' : '' }); } catch (e) { toast(e.message); }
  }
};

/* ================= app lock ================= */
/* App lock. The PIN (hashed, salted with the account id) and the optional biometric key live on this phone only.
   Turning the lock off keeps the PIN, so turning it on again does not ask for a new one. The screen is built once;
   key presses only change the dots, so nothing behind it can flash through. */
const b64u = buf => btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = str => { const t = String(str || '').replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(t + '==='.slice((t.length + 3) % 4)); return Uint8Array.from(bin, c => c.charCodeAt(0)); };
const Lock = {
  cfg() { const c = ls.get('mca-lock', null); return c && c.hash ? c : null; },
  active() { const c = this.cfg(); return !!(c && c.on !== false); },
  save(patch) { const c = Object.assign({ after: 1, on: true }, this.cfg() || {}, patch); ls.set('mca-lock', c); return c; },
  async hash(pin) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mca|' + ((Session.user && Session.user.id) || '') + '|' + pin)); return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, '0')).join(''); },
  entry: '', tries: 0, locked: false, checking: false, hiddenAt: 0, lastActive: Date.now(),
  bioAvailable() { return !!(window.PublicKeyCredential && navigator.credentials && window.isSecureContext); },
  async bioSupported() {
    if (!this.bioAvailable()) return false;
    try { return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); } catch (e) { return false; }
  },
  /* registers a key held by this phone's fingerprint / face unlock; nothing leaves the phone */
  async bioEnroll() {
    const uidBytes = new TextEncoder().encode(String((Session.user && Session.user.id) || 'me').slice(0, 64));
    const cred = await navigator.credentials.create({ publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: 'My Chama' },
      user: { id: uidBytes, name: Session.email || 'me', displayName: (Session.account && Session.account.full_name) || 'My Chama' },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
      timeout: 60000, attestation: 'none' } });
    if (!cred) throw new Error('Fingerprint or face unlock was not set up');
    this.save({ bio: b64u(cred.rawId) });
  },
  async bioUnlock() {
    const c = this.cfg(); if (!c || !c.bio || this.checking) return;
    this.checking = true;
    try {
      const got = await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: unb64u(c.bio), transports: ['internal'] }], userVerification: 'required', timeout: 60000 } });
      if (got) return this.unlock();
    } catch (e) { this.message('Fingerprint or face did not work. Use your PIN.', true); }
    finally { this.checking = false; }
  },
  show() {
    if (!this.active() || this.locked) return; this.locked = true; this.entry = ''; this.tries = 0;
    let root = document.getElementById('lockRoot'); if (!root) { root = document.createElement('div'); root.id = 'lockRoot'; document.body.appendChild(root); }
    this.build();
    const c = this.cfg(); if (c && c.bio) setTimeout(() => this.bioUnlock(), 350);
  },
  build() {
    const root = document.getElementById('lockRoot'); if (!root) return;
    const c = this.cfg() || {};
    root.innerHTML = `<div class="lock" role="dialog" aria-modal="true" aria-labelledby="lkTitle"><div class="lk-in">${markTile('lg')}<h2 id="lkTitle">Enter your app PIN</h2><p id="lkMsg" aria-live="polite">My Chama is locked on this phone</p>
<div class="lk-dots" id="lkDots">${[0, 1, 2, 3].map(() => '<i></i>').join('')}</div>
<div class="lk-pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, c.bio ? 'bio' : '', 0, '⌫'].map(k => k === '' ? '<span></span>' : k === 'bio' ? `<button type="button" data-lk="bio" class="lk-bio" aria-label="Unlock with fingerprint or face">${icon('hand')}</button>` : `<button type="button" data-lk="${k}" aria-label="${k === '⌫' ? 'Delete' : k}">${k}</button>`).join('')}</div>
<button type="button" class="linkish" data-lk="forgot">Forgot the PIN? Sign out</button></div></div>`;
  },
  dots(bad) { const d = document.getElementById('lkDots'); if (!d) return; d.querySelectorAll('i').forEach((el, i) => el.classList.toggle('on', i < this.entry.length)); d.classList.remove('bad'); if (bad) { void d.offsetWidth; d.classList.add('bad'); } },
  message(t, bad) { const m = document.getElementById('lkMsg'); if (m) m.textContent = t; this.dots(bad); },
  unlock() { this.locked = false; this.tries = 0; this.entry = ''; this.lastActive = Date.now(); const r = document.getElementById('lockRoot'); if (r) r.innerHTML = ''; },
  async key(k) {
    if (k === 'forgot') return Pop.confirm({ title: 'Sign out to reset the PIN?', text: 'You can sign in again with your password and set a new PIN.', confirmLabel: 'Sign out', danger: true, onYes: () => { try { localStorage.removeItem('mca-lock'); } catch (e) {} __M_src_features_index_js.Actions.signOutApp(); } });
    if (k === 'bio') return this.bioUnlock();
    if (this.checking) return;
    if (k === '⌫') { this.entry = this.entry.slice(0, -1); return this.dots(); }
    if (this.entry.length >= 4) return;
    this.entry += k; this.dots();
    if (this.entry.length < 4) return;
    this.checking = true;
    const ok = (await this.hash(this.entry)) === (this.cfg() || {}).hash;
    this.checking = false;
    if (ok) return this.unlock();
    this.tries++; this.entry = '';
    if (this.tries >= 5) { try { localStorage.removeItem('mca-lock'); } catch (e) {} return __M_src_features_index_js.Actions.signOutApp(); }
    this.message('Wrong PIN. ' + (5 - this.tries) + (5 - this.tries === 1 ? ' try' : ' tries') + ' left before you are signed out.', true);
  }
};
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-lk]'); if (b) Lock.key(b.dataset.lk); });
document.addEventListener('keydown', e => { if (!Lock.locked) return; if (/^\d$/.test(e.key)) { e.preventDefault(); Lock.key(e.key); } else if (e.key === 'Backspace') { e.preventDefault(); Lock.key('⌫'); } });
/* the window counts both time away from the app and time without a touch inside it */
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, () => { if (!Lock.locked) Lock.lastActive = Date.now(); }, { passive: true, capture: true }));
setInterval(() => { const c = Lock.cfg(); if (!Lock.active() || Lock.locked || document.hidden || !Session.ready()) return; if (Date.now() - Lock.lastActive > (c.after || 1) * 60000) Lock.show(); }, 15000);
document.addEventListener('visibilitychange', () => {
  if (!Lock.active()) return;
  const c = Lock.cfg();
  if (document.hidden) Lock.hiddenAt = Date.now();
  else if (Lock.hiddenAt && Date.now() - Lock.hiddenAt > (c.after || 1) * 60000 && Session.ready()) Lock.show();
});

/* goals: the list, with the older single goal read as the first one */
const goalsOf = s => { const c = (s && s.chama) || {}; const list = Array.isArray(c.goals) && c.goals.length ? c.goals : (c.goal && c.goal.amount > 0 ? [{ id: 'g0', ...c.goal }] : []); return list.filter(g => g && g.amount > 0).map((g, i) => g.id ? g : { ...g, id: 'g' + i }); };
const goalHave = (s, g) => {
  if (s.shared) { const mc = s.shared.monthCollected || {}; return g.since ? Object.keys(mc).filter(k => k >= g.since).reduce((t, k) => t + Number(mc[k] || 0), 0) || 0 : Number(s.shared.collected || 0); }
  return sum(s.payments.filter(p => !g.since || p.month >= g.since), p => p.amount);
};
/* ================= views and actions ================= */
const views = { insights, register };
const sheet = () => R().Sheet;
const actions = {
  palette: () => __M_src_features_guide_js.Guide.show(),
  recapHide: d => { ls.set('mca-recap-hide', d.v); render(); },
  setupHide: () => { ls.set('mca-setup-done:' + Store.chamaId, true); render(); },
  copyPayTo: () => { const s = Store.get(); if (!s || !s.chama.payTo) return; (navigator.clipboard ? navigator.clipboard.writeText(s.chama.payTo) : Promise.reject()).then(() => toast('Copied: ' + s.chama.payTo, 'ok'), () => toast(s.chama.payTo, 'info')); },
  moneyToggle: () => { const on = !document.documentElement.classList.contains('hide-money'); document.documentElement.classList.toggle('hide-money', on); ls.set('mca-hide-money', on); toast(on ? 'Amounts hidden. Tap the eye to show them.' : 'Amounts shown', 'info'); render(); },
  remindAll: { admin: true, run() {
    const s = Store.get(), cur = Domain.now(), late = Domain.lateMembers(s);
    if (!late.length) return toast('Nobody is behind', 'ok');
    const msg = m => `Hi ${m.name.split(' ')[0]}, a friendly reminder from ${s.chama.name}: your ${monthLabel(cur)} balance is ${kes(Domain.outstanding(s, m.id, cur))}.${s.chama.payTo ? ' Pay to ' + s.chama.payTo + '.' : ''} Thank you!`;
    const group = `${s.chama.name}: ${monthLabel(cur)} contributions were due by day ${s.chama.dueDay}. ${late.length} of us are still to pay. ${s.chama.payTo ? 'Pay to ' + s.chama.payTo + '. ' : ''}Thank you all!`;
    sheet().open(`<div class="sx-head"><span class="sx-badge">${icon('chat')}</span><h3>Remind ${late.length} ${late.length === 1 ? 'member' : 'members'}</h3><p>Each opens WhatsApp with a friendly message you can edit. Phones are needed.</p></div>
<div class="list sx-list">${late.map(m => `<div class="li has-av">${av(m, 38)}<span class="li-main"><b>${esc(m.name)}</b><small class="num">${esc(kes(Domain.outstanding(s, m.id, cur)))} behind</small></span><span class="li-end">${m.phone ? `<a class="btn sm tint" target="_blank" rel="noopener noreferrer" href="${esc(waLink(m.phone, msg(m)))}" data-act="remindDone" data-id="${esc(m.id)}">${icon('chat', 's')}Send</a>` : '<span class="mute small">No phone</span>'}</span></div>`).join('')}</div>
<button type="button" class="btn block lg" data-act="remindGroup" data-t="${esc(group)}">${icon('copy')}Copy one message for the group</button>
<button type="button" class="btn pri block" style="margin-top:10px" data-act="remindChat" data-t="${esc(group)}">${icon('chat')}Post it in the Chama chat</button>`, { key: 'remind', label: 'Remind' });
  } },
  remindDone: d => {
    /* WhatsApp opened in a new tab: mark this person as reminded so the treasurer can work down the list */
    const b = document.querySelector(`[data-act="remindDone"][data-id="${CSS.escape(d.id || '')}"]`);
    if (b) setTimeout(() => { b.classList.remove('tint'); b.classList.add('ghost'); b.innerHTML = `${icon('check', 's')}Sent`; }, 300);
    try { const k = 'mca-reminded:' + Store.chamaId + ':' + Domain.now(), seen = ls.get(k, []); if (d.id && !seen.includes(d.id)) ls.set(k, seen.concat(d.id)); } catch (e) {}
  },
  remindGroup: d => { (navigator.clipboard ? navigator.clipboard.writeText(d.t) : Promise.reject()).then(() => toast('Copied. Paste it in your WhatsApp group.', 'ok'), () => toast(d.t, 'info')); },
  remindChat: async d => { const ok = await C().send('group', 'announcement', d.t, { title: 'Contribution reminder', pin: false }); if (ok) { sheet().close(); toast('Posted in the chat', 'ok'); } },
  shareReceipt: async d => {
    const s = Store.get(), p = s && s.payments.find(x => x.id === d.id); if (!p) return;
    const text = `${s.chama.name}: payment receipt\n${Domain.memberName(s, p.memberId)}\n${kes(p.amount)} for ${monthLabel(p.month)}\nPaid ${p.date || ''}${p.code ? '\nM-Pesa ' + p.code : ''}\nTotal saved: ${kes(Domain.memberSaved(s, p.memberId))}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch (e) { return; } }
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  },
  icsExport: () => {
    const s = Store.get(); if (!s) return;
    const pad = n => String(n).padStart(2, '0'), stamp = d => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    const now = new Date(), first = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > s.chama.dueDay ? 1 : 0), Number(s.chama.dueDay) || 10);
    const day = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    const clean = t => String(t || '').replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
    const ev = [`BEGIN:VEVENT\r\nUID:due-${Store.chamaId}@mychama\r\nDTSTAMP:${stamp(now)}\r\nDTSTART;VALUE=DATE:${day(first)}\r\nRRULE:FREQ=MONTHLY;COUNT=12\r\nSUMMARY:${clean(s.chama.name + ' contribution due')}\r\nDESCRIPTION:${clean(kes(s.chama.monthly) + ' per share' + (s.chama.payTo ? '. Pay to ' + s.chama.payTo : ''))}\r\nBEGIN:VALARM\r\nTRIGGER:-P2D\r\nACTION:DISPLAY\r\nDESCRIPTION:Contribution due in 2 days\r\nEND:VALARM\r\nEND:VEVENT`];
    (C().msgs || []).filter(m => m.kind === 'meeting' && !m.deleted_at && m.meta && Date.parse(m.meta.when) > Date.now()).forEach(m => {
      const st = new Date(m.meta.when), en = new Date(st.getTime() + 2 * 3600e3);
      ev.push(`BEGIN:VEVENT\r\nUID:${m.id}@mychama\r\nDTSTAMP:${stamp(now)}\r\nDTSTART:${stamp(st)}\r\nDTEND:${stamp(en)}\r\nSUMMARY:${clean(s.chama.name + ': ' + (m.meta.title || 'Meeting'))}\r\nLOCATION:${clean(m.meta.place || '')}\r\nDESCRIPTION:${clean(m.meta.agenda || '')}\r\nBEGIN:VALARM\r\nTRIGGER:-PT2H\r\nACTION:DISPLAY\r\nDESCRIPTION:Meeting in 2 hours\r\nEND:VALARM\r\nEND:VEVENT`);
    });
    Reports.download(s.chama.name + '-calendar.ics', `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//My Chama//EN\r\nCALSCALE:GREGORIAN\r\n${ev.join('\r\n')}\r\nEND:VCALENDAR\r\n`, 'text/calendar');
    toast('Calendar file ready. Open it to add the dates.', 'ok');
  },
  regExport: () => {
    const q = Reports.cell, rows = [['Name', 'Role', 'Email', 'Phone', 'Since', 'On member list'], ...(regRows || []).map(r => [r.name, Perm.label(r.role), r.email, r.phone || '', String(r.joined_at || '').slice(0, 10), r.member_id ? 'Yes' : 'No'])];
    Reports.download((Store.get().chama.name || 'chama') + '-register.csv', '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  },
  goalEdit: { admin: true, run(d) {
    const g = (d && d.id && goalsOf(Store.get()).find(x => x.id === d.id)) || {};
    sheet().open(`<div class="sx-head"><span class="sx-badge">${icon('sparkle')}</span><h3>${g.id ? 'Edit goal' : 'New savings goal'}</h3><p>Give the group something to aim for. Everyone sees the progress on Home${g.id ? '' : '. A new goal counts what is collected from this month on'}.</p></div>
<label class="fgrp" for="gTitle"><span class="flab">What for</span><span class="field">${icon('tag')}<input id="gTitle" maxlength="60" placeholder="e.g. Land in Kitengela" value="${esc(g.title || '')}" autofocus></span></label>
<label class="fgrp" for="gAmt"><span class="flab">Amount (KES)</span><span class="field">${icon('coins')}<input id="gAmt" type="number" inputmode="numeric" value="${esc(g.amount || '')}"></span></label>
<label class="fgrp" for="gBy"><span class="flab">By</span><span class="field">${icon('clock')}<input id="gBy" type="month" value="${esc(g.by || '')}"></span></label>
<button type="button" class="btn pri block lg" data-act="goalSave" data-id="${esc(g.id || '')}">Save goal</button>${g.id ? `<button type="button" class="btn ghost block" data-act="goalClear" data-id="${esc(g.id)}">Remove this goal</button>` : ''}`, { key: 'goal', label: 'Savings goal' });
  } },
  goalSave: { admin: true, run(d) {
    const t = (document.getElementById('gTitle').value || '').trim().slice(0, 60), a = Number(document.getElementById('gAmt').value), by = document.getElementById('gBy').value;
    if (!(a > 0)) throw new Error('Enter the amount');
    const fields = { title: t || 'Our goal', amount: Math.round(a), by: /^\d{4}-\d{2}$/.test(by) ? by : '' };
    Store.commit(s => {
      const list = goalsOf(s).map(x => ({ ...x }));
      const i = d && d.id ? list.findIndex(x => x.id === d.id) : -1;
      if (i >= 0) list[i] = { ...list[i], ...fields }; else list.push({ id: 'g' + Date.now().toString(36), since: Domain.now(), ...fields });
      s.chama.goals = list; s.chama.goal = list[0] || undefined; if (!s.chama.goal) delete s.chama.goal;
    }); sheet().close(); toast('Goal saved', 'ok');
  } },
  goalClear: { admin: true, run(d) { Store.commit(s => { const list = goalsOf(s).filter(x => x.id !== (d && d.id)); s.chama.goals = list; if (list[0]) s.chama.goal = list[0]; else delete s.chama.goal; }); sheet().close(); toast('Goal removed', 'info'); } },
  feedback: () => {
    sheet().open(`<div class="sx-head"><span class="sx-badge">${icon('chat')}</span><h3>How is My Chama for you?</h3><p>Goes straight to the people who build the app. We read every one.</p></div>
<div class="stars" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" data-act="fbStar" data-v="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('')}</div>
<div class="fgrp"><span class="flab">About</span><div class="chips2">${[['idea', 'An idea'], ['problem', 'A problem'], ['praise', 'Something I like'], ['other', 'Other']].map(([k, t], i) => `<button type="button" class="chip2${i === 0 ? ' on' : ''}" data-act="fbCat" data-v="${k}">${t}</button>`).join('')}</div></div>
<label class="fgrp" for="fbMsg"><span class="field area"><textarea id="fbMsg" rows="4" maxlength="2000" placeholder="Tell us more (optional)"></textarea></span></label>
<button type="button" class="btn pri block lg" data-act="fbSend">Send feedback</button><p class="fhelp" style="text-align:center">Sent with your role and app version, not your Chama’s records.</p>`, { key: 'fb', label: 'Feedback' });
  },
  fbStar: d => { document.querySelectorAll('.stars button').forEach(b => { const on = Number(b.dataset.v) <= Number(d.v); b.classList.toggle('on', on); b.setAttribute('aria-checked', String(b.dataset.v === d.v)); }); document.querySelector('.stars').dataset.v = d.v; },
  fbCat: d => { document.querySelectorAll('[data-act="fbCat"]').forEach(b => b.classList.toggle('on', b.dataset.v === d.v)); },
  fbSend: async () => {
    const rating = Number((document.querySelector('.stars') || {}).dataset ? document.querySelector('.stars').dataset.v || 0 : 0), cat = (document.querySelector('[data-act="fbCat"].on') || {}).dataset, msg = (document.getElementById('fbMsg') || {}).value || '';
    if (!rating && !msg.trim()) return toast('Pick a rating or write a few words');
    const { error } = await Backend.sb.rpc('submit_feedback', { p_rating: rating, p_category: cat ? cat.v : 'other', p_message: msg, p_cid: Store.chamaId || null, p_app_version: __M_src_content_app_info_js.APP.version, p_context: { route: location.hash.slice(0, 40), w: innerWidth, standalone: matchMedia('(display-mode: standalone)').matches } });
    if (error) return toast(rpcMessage(error));
    sheet().close(); toast('Thank you. Your feedback was sent.', 'ok');
  },
  lockSetup: async (d) => {
    const c = Lock.cfg(), changing = !!(d && d.change) || !c, bioOk = await Lock.bioSupported();
    const after = (c && c.after) || 1;
    const chips = `<div class="fgrp"><span class="flab">Lock after this long without use</span><div class="chips2">${[[1, '1 min'], [5, '5 min'], [15, '15 min'], [30, '30 min']].map(([v, t]) => `<button type="button" class="chip2${v === after ? ' on' : ''}" data-act="lkAfter" data-v="${v}">${t}</button>`).join('')}</div></div>`;
    const pinFields = `<label class="fgrp" for="lk1"><span class="flab">${c ? 'New PIN' : 'Choose a 4-digit PIN'}</span><span class="field">${icon('lock')}<input id="lk1" type="password" inputmode="numeric" maxlength="4" pattern="\\d{4}" autocomplete="off" autofocus></span></label>
<label class="fgrp" for="lk2"><span class="flab">Type it again</span><span class="field">${icon('lock')}<input id="lk2" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></span></label>`;
    const body = changing
      ? `${pinFields}${c ? '' : chips}<button type="button" class="btn pri block lg" data-act="lockSave">${c ? 'Save the new PIN' : 'Turn on the lock'}</button>${c ? '<button type="button" class="btn ghost block" style="margin-top:8px" data-act="lockSetup">Back</button>' : ''}`
      : `<div class="lk-row"><span><b>App lock</b><small>${c.on !== false ? 'On · asks for your PIN' : 'Off · your PIN is kept for next time'}</small></span><button type="button" class="sw-toggle${c.on !== false ? ' on' : ''}" role="switch" aria-checked="${c.on !== false}" aria-label="App lock" data-act="lockToggle"><i></i></button></div>
${bioOk ? `<div class="lk-row"><span><b>Fingerprint or face</b><small>${c.bio ? 'On · tap the hand on the lock screen any time' : 'Unlock with this phone’s own fingerprint or face check'}</small></span><button type="button" class="sw-toggle${c.bio ? ' on' : ''}" role="switch" aria-checked="${!!c.bio}" aria-label="Fingerprint or face unlock" data-act="lockBio"><i></i></button></div>` : `<p class="fhelp">Fingerprint or face unlock appears here on phones that support it (installed app or a secure browser).</p>`}
${chips}
<button type="button" class="btn block" data-act="lockSetup" data-change="1">${icon('key')}Change PIN</button>
<button type="button" class="btn ghost block" style="margin-top:8px" data-act="lockNow">${icon('lock')}Lock now</button>`;
    sheet().open(`<div class="sx-head"><span class="sx-badge">${icon('lock')}</span><h3>App lock</h3><p>Asks for a PIN when My Chama has not been used for a while. The PIN stays on this phone only.</p></div>${body}`, { key: 'lock', label: 'App lock' });
  },
  lkAfter: d => {
    document.querySelectorAll('[data-act="lkAfter"]').forEach(b => b.classList.toggle('on', b.dataset.v === d.v));
    if (Lock.cfg()) { Lock.save({ after: Number(d.v) }); toast('Locks after ' + d.v + (d.v === '1' ? ' minute' : ' minutes') + ' without use', 'ok'); }
  },
  lockToggle: () => {
    const c = Lock.cfg(); if (!c) return actions.lockSetup();
    if (c.on !== false) return Pop.confirm({ title: 'Turn off the app lock?', text: 'Anyone holding this phone could open My Chama. Your PIN is kept, so you can turn it back on with one tap.', confirmLabel: 'Turn off', danger: true, onYes: () => { Lock.save({ on: false }); actions.lockSetup(); render(); toast('App lock off. Your PIN is kept.', 'info'); } });
    Lock.save({ on: true }); Lock.lastActive = Date.now(); actions.lockSetup(); render(); toast('App lock on, with your saved PIN', 'ok');
  },
  lockBio: async () => {
    const c = Lock.cfg(); if (!c) return;
    if (c.bio) { Lock.save({ bio: null }); toast('Fingerprint or face unlock off', 'info'); return actions.lockSetup(); }
    try { await Lock.bioEnroll(); toast('Fingerprint or face unlock on', 'ok'); }
    catch (e) { toast(e && e.name === 'NotAllowedError' ? 'Fingerprint or face setup was cancelled' : 'This phone could not set up fingerprint or face unlock'); }
    actions.lockSetup();
  },
  lockNow: () => { if (!Lock.active()) return toast('Turn the app lock on first'); sheet().close(); setTimeout(() => Lock.show(), 250); },
  lockSave: async () => {
    const a = document.getElementById('lk1').value, b = document.getElementById('lk2').value;
    const chip = document.querySelector('[data-act="lkAfter"].on'), after = chip ? Number(chip.dataset.v) : ((Lock.cfg() || {}).after || 1);
    if (!/^\d{4}$/.test(a)) return toast('Use exactly 4 numbers');
    if (a !== b) return toast('The two PINs do not match');
    if (/^(\d)\1{3}$|^(0123|1234|2345|3456|4567|5678|6789|9876|4321)$/.test(a)) return toast('Choose a PIN that is harder to guess');
    const had = !!Lock.cfg();
    Lock.save({ hash: await Lock.hash(a), after, on: true }); Lock.lastActive = Date.now();
    render(); toast(had ? 'PIN changed' : 'App lock on', 'ok');
    if (had) actions.lockSetup(); else sheet().close();
  }
};

return { get views() { return views; }, get actions() { return actions; }, get Smart() { return Smart; }, get homeBlocks() { return homeBlocks; }, get Palette() { return Palette; }, get Lock() { return Lock; }, get regReset() { return () => { regRows = null; }; }, get setRegQ() { return v => { regQ = v; render(); }; } };
})();

/* search: open with /, Ctrl+K or Cmd+K; arrows move; Enter opens */
document.addEventListener('keydown', e => {
  const P = __M_src_features_smart_js.Palette, t = e.target, typing = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !P.open)) { e.preventDefault(); const G = __M_src_features_guide_js.Guide; if (P.open) P.hide(); return G.open ? G.hide() : G.show(); }
  if (!P.open) {
    /* g then a letter jumps between tabs on a computer */
    if (typing || e.metaKey || e.ctrlKey || e.altKey || !__M_src_core_session_js.Session.ready() || document.querySelector('#modalRoot .veil')) return;
    if (e.key === 'g') { P._g = Date.now(); return; }
    if (P._g && Date.now() - P._g < 1200) { const to = { h: '#/home', p: '#/grid', c: '#/chat', m: '#/members', s: '#/settings', n: '#/notifications', l: '#/loans', i: '#/insights' }[e.key]; P._g = 0; if (to) { e.preventDefault(); location.hash = to; } }
    return;
  }
  const n = P.results().length;
  if (e.key === 'Escape') { e.preventDefault(); P.hide(); }
  else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); P.i = (P.i + (e.key === 'ArrowDown' ? 1 : -1) + n) % Math.max(1, n); P.paint(); }
  else if (e.key === 'Enter') { e.preventDefault(); P.go(P.i); }
});
document.addEventListener('input', e => {
  if (e.target && e.target.id === 'palQ') { const P = __M_src_features_smart_js.Palette; P.q = e.target.value; P.i = 0; P.paint(); }
  if (e.target && e.target.id === 'regQ') __M_src_features_smart_js.setRegQ(e.target.value);   /* the redraw keeps the focused box */
});
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-pal]'); if (!b) return;
  const P = __M_src_features_smart_js.Palette;
  if (b.dataset.pal === 'x') { if (e.target === b) P.hide(); return; }
  P.go(Number(b.dataset.pal));
});
/* pull down at the top of a page to fetch the latest records, messages and notifications */
(() => {
  let y0 = null, pulled = 0;
  const bar = () => { let b = document.getElementById('ptr'); if (!b) { b = document.createElement('div'); b.id = 'ptr'; b.innerHTML = '<span class="spin" aria-hidden="true"></span>'; document.body.appendChild(b); } return b; };
  addEventListener('touchstart', e => { y0 = window.scrollY <= 0 && __M_src_core_session_js.Session.ready() && !document.querySelector('#modalRoot .veil, .pal-veil, #lockRoot .lock') ? e.touches[0].clientY : null; pulled = 0; }, { passive: true });
  addEventListener('touchmove', e => { if (y0 == null) return; pulled = Math.max(0, e.touches[0].clientY - y0); const b = bar(); b.style.setProperty('--y', Math.min(90, pulled * 0.5) + 'px'); b.classList.toggle('ready', pulled > 110); b.classList.add('show'); }, { passive: true });
  addEventListener('touchend', async () => {
    if (y0 == null) return; y0 = null; const b = bar();
    if (pulled > 110) {
      b.classList.add('busy');
      try { await Promise.all([__M_src_core_store_js.Store.reload(), __M_src_features_chat_index_js.Chat.load(), __M_src_features_notifications_notify_js.Notify.loadServer(), __M_src_core_session_js.Session.loadRequests()]); __M_src_ui_toast_js.toast('Up to date', 'ok'); } catch (e) { __M_src_ui_toast_js.toast('Could not refresh. Check your connection.'); }
      __M_src_features_smart_js.regReset(); __M_src_core_rerender_js.render();
    }
    b.classList.remove('show', 'ready', 'busy'); b.style.removeProperty('--y');
  });
})();
try { if (localStorage.getItem('mca-hide-money') === 'true') document.documentElement.classList.add('hide-money'); } catch (e) {}


/* ---- src/features/guide/index.js ----
   The Guide: one box that answers questions, searches people, payments and pages, and walks people through a task
   with live cards ("Tap here"), waiting for each tap before the next step. Opened from the sparkle next to the bell,
   from Home, from the menu search, or with "/". Answers about money are worked out from the real records. */
const __M_src_features_guide_js = (function () {
const { Store } = __M_src_core_store_js;
const { Session } = __M_src_core_session_js;
const { Auth } = __M_src_core_auth_js;
const { Domain } = __M_src_core_domain_js;
const { esc, kes, monthLabel } = __M_src_core_utils_js;
const { toast } = __M_src_ui_toast_js;

/* words people use -> the words the app uses (English and Kiswahili) */
const SYN = { pay: 'payment', paid: 'payment', paying: 'payment', contribution: 'payment', contribute: 'payment', money: 'payment', deposit: 'payment', lipa: 'payment', mchango: 'payment', michango: 'payment',
  borrow: 'loan', lend: 'loan', mkopo: 'loan', loans: 'loan', penalty: 'fine', faini: 'fine', fines: 'fine', spend: 'expense', spent: 'expense', expenses: 'expense', matumizi: 'expense',
  add: 'add', new: 'add', create: 'add', ongeza: 'add', person: 'member', people: 'member', mwanachama: 'member', wanachama: 'member', members: 'member',
  invite: 'invite', join: 'invite', code: 'invite', karibisha: 'invite', remind: 'remind', reminder: 'remind', kumbusha: 'remind', late: 'late', behind: 'late', owe: 'owe', owes: 'owe', deni: 'owe', debt: 'owe',
  message: 'chat', text: 'chat', ujumbe: 'chat', whatsapp: 'remind', lock: 'lock', pin: 'lock', fingerprint: 'lock', face: 'lock', password: 'password', nenosiri: 'password',
  leave: 'leave', quit: 'leave', exit: 'leave', ondoka: 'leave', goal: 'goal', target: 'goal', lengo: 'goal', mpesa: 'mpesa', 'm-pesa': 'mpesa', import: 'mpesa', screenshot: 'mpesa', sms: 'mpesa',
  photo: 'photo', picture: 'photo', picha: 'photo', payout: 'payout', pot: 'payout', turn: 'payout', zamu: 'payout', receive: 'payout', cash: 'cash', balance: 'cash', bank: 'cash', treasurer: 'treasurer', handover: 'treasurer', role: 'role', secretary: 'role', remove: 'remove', kick: 'remove', report: 'report', export: 'report', pdf: 'report', backup: 'report' };
const words = q => String(q || '').toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 1).map(w => SYN[w] || w);

/* tasks: what people ask to do. Each can be done now (act), or shown step by step (tour). */
const TASKS = [
  { id: 'pay', t: 'Record a payment', k: 'add record payment', admin: true, act: 'quickPay', tour: [
    { go: '#/grid', sel: '[data-act="pay"]', text: 'Tap a member’s status button to record their payment.', click: true },
    { sel: '#modalRoot input[name="amount"]', text: 'Type how much they paid. Choose “Extra” above if they are paying ahead.' },
    { sel: '#modalRoot input[name="code"]', text: 'Add the M-Pesa code. The same code can never be recorded twice.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Record payment. Done.', click: true }] },
  { id: 'import', t: 'Import M-Pesa messages or screenshots', k: 'mpesa import payment', admin: true, act: 'importPay', tour: [
    { go: '#/grid', sel: '[data-act="importPay"]', text: 'Tap Import from M-Pesa.', click: true },
    { sel: '#modalRoot textarea[name="text"]', text: 'Paste the messages here, or add screenshots below. Hidden digits are fine.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Find payments, then check each match before recording.', click: true }] },
  { id: 'member', t: 'Add a member', k: 'add member', admin: true, act: 'addMember', tour: [
    { go: '#/home', sel: '[data-act="addMember"]', text: 'Tap Add member.', click: true },
    { sel: '#modalRoot input[name="name"]', text: 'Type their full name.' },
    { sel: '#modalRoot input[name="phone"]', text: 'Add their phone for reminders and M-Pesa matching.' },
    { sel: '#mfAv', text: 'Optional: add a photo so everyone recognises them.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Add member.', click: true }] },
  { id: 'invite', t: 'Invite someone to the app', k: 'invite member add', admin: true, act: 'inviteSheet', tour: [
    { go: '#/settings/actions', sel: '[data-act="inviteSheet"][data-v="code"]', text: 'Tap Share a code. They type it in the app to ask to join.', click: true },
    { sel: '#modalRoot .sx', text: 'Choose their role, then share the code by WhatsApp or SMS. You approve them when they ask.' }] },
  { id: 'loan', t: 'Give a loan', k: 'add loan', admin: true, act: 'addLoan', tour: [
    { go: '#/home', sel: '[data-act="addLoan"]', text: 'Tap New loan.', click: true },
    { sel: '#modalRoot select[name="memberId"]', text: 'Choose who is borrowing. A suggested limit appears.' },
    { sel: '#modalRoot input[name="principal"]', text: 'Type the amount. The bar shows what is left in the cash box.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Issue loan. The borrower then reads and signs the terms.', click: true }] },
  { id: 'fine', t: 'Add a fine', k: 'add fine', admin: true, act: 'addFine', tour: [
    { go: '#/fines', sel: '[data-act="addFine"]', text: 'Tap Add fine.', click: true },
    { sel: '#modalRoot select[name="memberId"]', text: 'People who still owe are listed first.' },
    { sel: '#modalRoot input[name="reason"]', text: 'Say why, for example “Late for March”.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Add fine.', click: true }] },
  { id: 'expense', t: 'Record an expense', k: 'add expense', admin: true, act: 'addExpense', tour: [
    { go: '#/expenses', sel: '[data-act="addExpense"]', text: 'Tap Add expense.', click: true },
    { sel: '#modalRoot input[name="amount"]', text: 'Type the amount. You see at once what is left in cash.' },
    { sel: '#modalRoot form .actions .btn.pri', text: 'Tap Add expense.', click: true }] },
  { id: 'remind', t: 'Remind people who are late', k: 'remind late payment owe', admin: true, act: 'remindAll', tour: [
    { go: '#/home', sel: '[data-act="remindAll"]', text: 'Tap Remind all.', click: true },
    { sel: '#modalRoot .sx-list', text: 'Tap Send next to each person. WhatsApp opens with their amount filled in.' }] },
  { id: 'payout', t: 'Mark this month’s payout as sent', k: 'payout', admin: true, act: 'markPayout', tour: [
    { go: '#/home', sel: '.po-card', text: 'This month’s payout is always at the top of Home.' },
    { sel: '[data-act="markPayout"]', text: 'After sending the money, tap here and ask them to sign.', click: true }] },
  { id: 'turn', t: 'Change someone’s payout turn', k: 'payout member', admin: true, tour: [
    { go: '#/members', sel: '[data-act="memberMenu"]', text: 'Tap the person.', click: true },
    { sel: '#modalRoot [data-act="moveMember"]', text: 'Tap Change payout turn, then choose their new turn.', click: true }] },
  { id: 'goal', t: 'Set a savings goal', k: 'add goal', admin: true, act: 'goalEdit', tour: [
    { go: '#/home', sel: '[data-act="goalEdit"]', text: 'Tap here to set a goal. You can have several.', click: true }] },
  { id: 'chat', t: 'Send a message', k: 'chat', act: 'chatNew', tour: [
    { go: '#/chat', sel: '[data-act="chatNew"]', text: 'Tap New message.', click: true },
    { sel: '#modalRoot .sx-list', text: 'Choose the group, or the person you want to write to.' }] },
  { id: 'lock', t: 'Lock the app with a PIN or fingerprint', k: 'lock', act: 'lockSetup', tour: [
    { go: '#/settings', sel: '[data-act="lockSetup"]', text: 'Tap App lock.', click: true },
    { sel: '#modalRoot .sx', text: 'Set a 4-digit PIN. You can also turn on fingerprint or face, and choose how long before it locks.' }] },
  { id: 'photo', t: 'Change my photo', k: 'photo', tour: [
    { go: '#/profile', sel: '[data-act="pickPhoto"]', text: 'Tap the camera to choose a photo.', click: true }] },
  { id: 'leave', t: 'Leave the Chama', k: 'leave', tour: [
    { go: '#/settings/chama', sel: '[data-act="leaveChama"]', text: 'Leaving is here. You will be asked for your reason. Your past records stay with the group.' }] },
  { id: 'rules', t: 'Write the Chama rules', k: 'rule rules write chama', admin: true, act: 'rulesEdit', tour: [
    { go: '#/settings/chama', sel: '[data-act="chamaEdit"][data-f="rules"]', text: 'Tap Group rules. New members read them before they enter.', click: true },
    { sel: '#chV', text: 'Write one rule per line, for example how late fines and loans work.' }] },
  { id: 'aware', t: 'How this Chama works (rules, money, people)', k: 'rule member how works chama payment payout', act: 'awareShow' },
  { id: 'report', t: 'Download a report', k: 'report', tour: [
    { go: '#/reports', sel: '#view .card, #view .sec', text: 'Choose a report or a full backup here.' }] }
];

/* questions answered from the records themselves */
const ANSWERS = [
  { re: /\b(who|nani)\b.*\b(late|owe|behind|hasn'?t paid|not paid|haja)|\blate members\b/, admin: true, run(s) {
    const cur = Domain.now(), late = s.members.filter(m => !m.left && Domain.outstanding(s, m.id, cur) > 0);
    return late.length ? { title: late.length + ' ' + (late.length === 1 ? 'person owes' : 'people owe') + ' for ' + monthLabel(cur), text: late.slice(0, 8).map(m => m.name + ': ' + kes(Domain.outstanding(s, m.id, cur))).join('\n'), task: 'remind' } : { title: 'Everyone is paid up for ' + monthLabel(cur), text: 'Nobody owes anything this month.' };
  } },
  { re: /\b(how much|what)\b.*\b(i|me)\b.*\b(owe|pay|due)|\bmy balance\b|\bnadaiwa\b/, run(s) {
    const id = s.shared ? s.shared.me : Session.memberId, cur = Domain.now(); if (!id) return { title: 'Your sign-in is not linked to a member yet', text: 'Ask the treasurer to link you to the member list.' };
    const o = Domain.outstanding(s, id, cur), a = Domain.ahead(s, id, cur);
    return { title: o ? 'You owe ' + kes(o) : a ? 'You are ' + kes(a) + ' ahead' : 'You are paid up', text: o ? 'Due by day ' + s.chama.dueDay + ' of ' + monthLabel(cur) + (s.chama.payTo ? '. Pay to ' + s.chama.payTo + '.' : '.') : 'Nothing is due for ' + monthLabel(cur) + '.' };
  } },
  { re: /\b(next|this month'?s?|who)\b.*\b(payout|pot|receive|turn)|\bwhen\b.*\bmy turn\b|\bzamu\b/, run(s) {
    const cur = Domain.now(), r = Domain.recipient(s, cur), id = s.shared ? s.shared.me : Session.memberId; if (!r) return null;
    let mine = ''; if (id) for (let i = 0; i < 36; i++) { const mk = __M_src_core_utils_js.addMonths(cur, i), x = Domain.recipient(s, mk); if (x && x.id === id) { mine = i === 0 ? ' It is your turn this month.' : ' Your turn: ' + monthLabel(mk) + '.'; break; } }
    return { title: r.name + ' receives the ' + monthLabel(cur) + ' payout', text: 'About ' + kes(__M_src_core_utils_js.sum(s.members.filter(m => !m.left), m => Domain.dueFor(s, m.id, cur))) + '.' + mine };
  } },
  { re: /\b(cash|money|balance|pesa)\b.*\b(hand|have|left|box|group)|\bhow much (do we|does the group)\b/, run(s) { return { title: 'Cash on hand: ' + kes(Domain.cashOnHand(s)), text: 'Money in minus loans out, payouts and expenses.' }; } },
  { re: /\bmy loan\b|\bloan balance\b|\bmkopo wangu\b/, run(s) { const id = s.shared ? s.shared.me : Session.memberId; if (!id) return null; const b = Domain.memberLoanBalance(s, id); return { title: b ? 'Your loan balance is ' + kes(b) : 'You have no loan', text: b ? 'See Loans for the dates of each instalment.' : 'Ask the treasurer if you need one.' }; } }
];

const Guide = {
  q: '', open: false,
  articles() { try { return (__M_src_content_app_info_js.HELP_ARTICLES || []); } catch (e) { return []; } },
  tasks() { const admin = Auth.isAdmin(); return TASKS.filter(t => !t.admin || admin); },
  score(text, ws) { const hay = words(text); let sc = 0; ws.forEach(w => { if (hay.includes(w)) sc += 2; else if (hay.some(h => h.startsWith(w) && w.length > 2)) sc += 1; }); return sc; },
  results() {
    const q = this.q.trim(), s = Store.get() || { members: [], payments: [], chama: {} };
    if (!q) return { tasks: this.tasks().slice(0, 6), items: [], arts: [], ans: null };
    const ws = words(q), lower = q.toLowerCase();
    let ans = null; for (const a of ANSWERS) if ((!a.admin || Auth.isAdmin()) && a.re.test(lower)) { try { ans = a.run(s); } catch (e) { ans = null; } if (ans) break; }
    const howTo = /\b(how|show|where|teach|help|jinsi|wapi|nisaidie|nionyeshe)\b/.test(lower);
    const tasks = this.tasks().map(t => ({ t, sc: this.score(t.t + ' ' + t.k, ws) + (howTo ? 1 : 0) })).filter(x => x.sc >= 2).sort((a, b) => b.sc - a.sc).map(x => x.t).slice(0, 4);
    const arts = this.articles().map(a => ({ a, sc: this.score(a.q + ' ' + a.a, ws) })).filter(x => x.sc >= 2).sort((a, b) => b.sc - a.sc).map(x => x.a).slice(0, 3);
    let items = []; try { const P = __M_src_features_smart_js.Palette; P.q = q; items = P.results().filter(x => x.sub !== 'Action').slice(0, 6); } catch (e) {}
    this._items = items;
    return { tasks, items, arts, ans };
  },
  html() {
    const r = this.results(), sugg = Auth.isAdmin() ? ['Who has not paid?', 'How do I record a payment?', 'Cash on hand', 'How do I import M-Pesa?'] : ['What do I owe?', 'When is my turn?', 'How do I message the treasurer?', 'How do I lock the app?'];
    const task = t => `<div class="gd-task"><span class="li-ic">${icon('guide')}</span><b>${esc(t.t)}</b><span class="gd-btns">${t.tour ? `<button type="button" class="btn sm tint" data-gd="tour" data-id="${t.id}">Show me</button>` : ''}${t.act ? `<button type="button" class="btn sm" data-gd="do" data-id="${t.id}">Do it</button>` : ''}</span></div>`;
    const ans = r.ans ? `<div class="gd-ans"><small>${icon('guide', 's')}Answer from your records</small><b>${esc(r.ans.title)}</b>${r.ans.text ? `<p>${esc(r.ans.text).replace(/\n/g, '<br>')}</p>` : ''}${r.ans.task ? `<button type="button" class="btn sm tint" data-gd="tour" data-id="${r.ans.task}">Show me what to do</button>` : ''}</div>` : '';
    const empty = this.q && !r.ans && !r.tasks.length && !r.items.length && !r.arts.length;
    return `<div class="gd-veil" data-gd="x"><div class="gd" role="dialog" aria-modal="true" aria-label="Guide">
<div class="gd-head"><span class="gd-mark">${icon('guide')}</span><div><b>Guide</b><small>Ask anything, find anything, or learn how</small></div><button type="button" class="gd-x" data-gd="x" aria-label="Close">${icon('close')}</button></div>
<label class="pal-in gd-in">${icon('search')}<input id="gdQ" type="search" placeholder="e.g. How do I give a loan?" value="${esc(this.q)}" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
<div class="gd-body" id="gdBody">${this.q ? '' : `<div class="gd-sugg">${sugg.map(x => `<button type="button" data-gd="ask" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>`}
${ans}
${r.tasks.length ? `<div class="gd-sec"><h4>${this.q ? 'Do it, or let the Guide show you' : 'Things you can do'}</h4>${r.tasks.map(task).join('')}</div>` : ''}
${r.items.length ? `<div class="gd-sec"><h4>Found</h4>${r.items.map((x, i) => `<button type="button" class="gd-item" data-gd="item" data-i="${i}"><span class="li-ic t-ink">${icon(x.ic)}</span><span><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></span></button>`).join('')}</div>` : ''}
${r.arts.length ? `<div class="gd-sec"><h4>Answers</h4>${r.arts.map(a => `<details class="gd-art"><summary>${esc(a.q)}</summary><p>${esc(a.a)}</p></details>`).join('')}</div>` : ''}
${empty ? `<div class="gd-none"><b>No answer yet for “${esc(this.q)}”.</b><p>Try other words, such as “loan”, “payment” or “invite”. Or ask the treasurer in Chat.</p><a class="btn sm tint" href="#/chat">Open Chat</a></div>` : ''}</div></div></div>`;
  },
  show(q) {
    if (!Session.ready()) return;
    this.open = true; this.q = q || ''; this._items = null;
    document.getElementById('jmRoot').innerHTML = this.html();
    setTimeout(() => { const i = document.getElementById('gdQ'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 40);
  },
  paint() { const b = document.getElementById('gdBody'); if (!b) return; const tmp = document.createElement('div'); tmp.innerHTML = this.html(); b.replaceWith(tmp.querySelector('#gdBody')); },
  hide() { this.open = false; const r = document.getElementById('jmRoot'); if (r) r.innerHTML = ''; },
  run(id) { const t = TASKS.find(x => x.id === id); if (!t || !t.act) return; this.hide(); const A = __M_src_features_index_js.Actions[t.act]; if (!A) return; if (typeof A === 'object' && A.admin && !Auth.isAdmin()) return toast('Only the treasurer can do that'); try { (typeof A === 'function' ? A : A.run).call(A, { v: t.act === 'inviteSheet' ? 'code' : '' }); } catch (e) { toast(e.message); } }
};

/* ---- live tour: a spotlight on the real button, a card that says what to do, and it waits for the tap ---- */
const Tour = {
  steps: [], i: 0, el: null, timer: null, name: '',
  start(id) {
    const t = TASKS.find(x => x.id === id); if (!t || !t.tour) return;
    Guide.hide(); this.steps = t.tour; this.i = 0; this.name = t.t;
    let root = document.getElementById('tourRoot'); if (!root) { root = document.createElement('div'); root.id = 'tourRoot'; document.body.appendChild(root); }
    this.step();
  },
  step() {
    const st = this.steps[this.i]; if (!st) return this.end(true);
    if (st.go && location.hash !== st.go) location.hash = st.go;
    let tries = 0; clearInterval(this.timer);
    this.timer = setInterval(() => {
      const el = [...document.querySelectorAll(st.sel)].find(x => x.offsetParent !== null || x.getClientRects().length);
      if (el) { clearInterval(this.timer); this.el = el; try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} setTimeout(() => this.paint(), 260); return; }
      if (++tries > 30) { clearInterval(this.timer); this.paint(true); }
    }, 120);
  },
  paint(missing) {
    const root = document.getElementById('tourRoot'); if (!root) return;
    const st = this.steps[this.i], n = this.steps.length, r = !missing && this.el ? this.el.getBoundingClientRect() : null;
    const hole = r ? `<div class="tr-hole" style="top:${r.top - 6}px;left:${r.left - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>` : '<div class="tr-dim"></div>';
    const below = !r || r.top < innerHeight * 0.55, top = r ? (below ? Math.min(innerHeight - 190, r.bottom + 14) : Math.max(12, r.top - 176)) : innerHeight / 2 - 90;
    root.innerHTML = `${hole}<div class="tr-card" role="dialog" aria-live="polite" style="top:${top}px"><small>${esc(this.name)} · step ${this.i + 1} of ${n}</small><p>${esc(missing ? 'This step is not on the screen right now. You may not have permission, or the page looks different. You can skip it.' : st.text)}</p>
<div class="tr-act"><button type="button" class="btn sm ghost" data-tr="end">End guide</button>${st.click && !missing ? `<span class="tr-hint">${icon('hand', 's')}Tap the highlighted button</span>` : `<button type="button" class="btn sm pri" data-tr="next">${this.i === n - 1 ? 'Finish' : 'Next'}</button>`}</div></div>`;
  },
  next() { this.i++; this.el = null; if (this.i >= this.steps.length) return this.end(true); setTimeout(() => this.step(), 350); },
  end(done) { clearInterval(this.timer); this.steps = []; this.el = null; const r = document.getElementById('tourRoot'); if (r) r.innerHTML = ''; if (done) toast('Guide finished: ' + this.name, 'ok'); }
};
document.addEventListener('click', e => {
  const tr = e.target.closest && e.target.closest('[data-tr]'); if (tr) { e.preventDefault(); e.stopPropagation(); return tr.dataset.tr === 'next' ? Tour.next() : Tour.end(false); }
  /* tapping the highlighted button moves the tour on; the button still does its job */
  if (Tour.steps.length && Tour.el && Tour.steps[Tour.i] && Tour.steps[Tour.i].click && Tour.el.contains(e.target)) { const r = document.getElementById('tourRoot'); if (r) r.innerHTML = ''; Tour.next(); }
}, true);
addEventListener('resize', () => { if (Tour.steps.length && Tour.el) Tour.paint(); });
addEventListener('scroll', () => { if (Tour.steps.length && Tour.el) { clearTimeout(Tour._s); Tour._s = setTimeout(() => Tour.paint(), 80); } }, { passive: true, capture: true });
document.addEventListener('click', e => {
  const g = e.target.closest && e.target.closest('[data-gd]'); if (!g) return;
  const k = g.dataset.gd;
  if (k === 'x') { if (e.target === g || g.classList.contains('gd-x') || g.closest('.gd-x')) Guide.hide(); return; }
  if (k === 'ask') { Guide.q = g.dataset.q; const i = document.getElementById('gdQ'); if (i) i.value = Guide.q; return Guide.paint(); }
  if (k === 'tour') return Tour.start(g.dataset.id);
  if (k === 'do') return Guide.run(g.dataset.id);
  if (k === 'item') {
    const x = (Guide._items || [])[Number(g.dataset.i)]; Guide.hide(); if (!x) return;
    if (x.href) { location.hash = x.href; return; }
    const A = __M_src_features_index_js.Actions[x.act]; if (!A) return;
    try { (typeof A === 'function' ? A : A.run).call(A, { id: x.id }); } catch (err) { toast(err.message); }
  }
});
document.addEventListener('input', e => { if (e.target && e.target.id === 'gdQ') { Guide.q = e.target.value; Guide.paint(); } });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && Tour.steps.length) { Tour.end(false); return; }
  if (e.key === 'Escape' && Guide.open) { Guide.hide(); return; }
  if (e.key === 'Enter' && e.target && e.target.id === 'gdQ') { const r = Guide.results(); if (!r.ans && r.tasks[0] && r.tasks[0].tour && /\b(how|show|jinsi)\b/i.test(Guide.q)) Tour.start(r.tasks[0].id); }
});

/* ---- Age-matched app. Near reading starts to fade in the mid-40s (presbyopia); from about 60 many people find small text,
   small targets, motion and busy screens hard. So the date of birth sets up the app, and the person can always choose the
   standard app in Settings. Once they choose, the app never overrides them.
     under 45   standard
     45 to 59   larger text
     60 to 74   Simple view: larger text, bigger buttons, calmer motion, fewer words and panels
     75 and up  Simple view with the largest text                                                                     ---- */
const Adapt = {
  band(age) { if (age == null || isNaN(age)) return 'std'; if (age >= 75) return 'senior2'; if (age >= 60) return 'senior'; if (age >= 45) return 'reading'; return 'std'; },
  LABEL: { std: 'the standard app', reading: 'larger text', senior: 'Simple view, larger text and bigger buttons', senior2: 'Simple view with the largest text and bigger buttons' },
  age() {
    let v = {}; try { v = JSON.parse(localStorage.getItem('mca-about:data:' + ((Session.user && Session.user.id) || '')) || '{}') || {}; } catch (e) {}
    const b = String(v.birth_date || '').split('-'), y = Number(b[0]); if (!y) return null;
    const now = new Date(); let a = now.getFullYear() - y; const m = Number(b[1]) || 1, d = Number(b[2]) || 1;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--; return a;
  },
  /* set the app up for this age, unless the person has chosen their own settings */
  apply(age) {
    const A = __M_src_core_a11y_js.A11y, d = A.d, band = this.band(age);
    if (d.ageMode === 'off' || d.ageMode === 'custom') return null;
    d.ageMode = 'auto'; d.ageBand = band;
    if (band === 'reading') { d.size = d.size === 'x' ? 'x' : 'l'; d.simple = 0; }
    else if (band === 'senior') { d.simple = 1; d.size = d.size === 'x' ? 'x' : 'l'; d.tg = 1; d.rm = 1; }
    else if (band === 'senior2') { d.simple = 1; d.size = 'x'; d.tg = 1; d.rm = 1; }
    A.save(); return band;
  },
  standard() { const A = __M_src_core_a11y_js.A11y; Object.assign(A.d, { ageMode: 'off', simple: 0, size: 'n', tg: 0, rm: 0 }); A.save(); },
  again() { const A = __M_src_core_a11y_js.A11y; A.d.ageMode = 'auto'; A.save(); return this.apply(this.age()); },
  explain(band, age) {
    if (!band || band === 'std') return;
    __M_src_ui_toast_js.Pop.confirm({ title: 'We set up the app for you', html: `<p>Because you are ${esc(String(age))}, My Chama now uses <b>${esc(this.LABEL[band])}</b>, so it is easier to read and use.</p><p class="fhelp keep">You can change this any time in Settings, Display.</p>`,
      confirmLabel: 'Keep it', cancelLabel: 'Use the standard app', onNo: () => { this.standard(); toast('Standard app. You can match it to your age again in Settings, Display.', 'info'); } });
  }
};

/* ---- "About you": name, phone, date of birth, gender, one question at a time, with a plain "why".
   Everyone answers once (existing members after this update too): name, phone and birth year are needed;
   the exact day and gender may be left out. All of it can be changed or removed later. ---- */
const ABOUT_V = 'mca-about-v2';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const UPDATE_NOTES = ['Your card on Home changes colour with your payments', 'Ask the Guide anything, next to the bell', 'Sign loan terms on your own phone', 'Read M-Pesa screenshots on your phone', 'The app can match your age: bigger and simpler if you like'];
const About = {
  st: null, why: false, overlay: false,
  uid() { return (Session.user && Session.user.id) || ''; },
  key() { return ABOUT_V + ':' + this.uid(); },
  done() { try { return localStorage.getItem(this.key()) === 'done'; } catch (e) { return true; } },
  local() { try { return JSON.parse(localStorage.getItem('mca-about:data:' + this.uid()) || '{}') || {}; } catch (e) { return {}; } },
  start(srv, intro) {
    const acct = Session.account || {}, prof = (Session.readProfile && Session.readProfile()) || {}, loc = this.local(), v = srv || {};
    const b = String(v.birth_date || loc.birth_date || '').split('-');
    this.st = { step: intro ? -1 : 0, sub: 'decade', name: v.full_name || acct.full_name || prof.name || '', phone: v.phone || prof.phone || loc.phone || '',
      y: Number(b[0]) || null, m: Number(b[1]) || null, d: Number(b[2]) || null, decade: b[0] ? Math.floor(Number(b[0]) / 10) * 10 : null, gender: v.gender || loc.gender || '', exactSkipped: false };
    this.why = false;
  },
  age() { const s = this.st; if (!s || !s.y) return null; const now = new Date(); let a = now.getFullYear() - s.y; if (s.m && (now.getMonth() + 1 < s.m || (now.getMonth() + 1 === s.m && s.d && now.getDate() < s.d))) a--; return a; },
  phoneOk(p) { return /^(\+?254|0)[17]\d{8}$/.test(String(p || '').replace(/[\s-]/g, '')); },
  WHY: {
    name: 'Your name shows to the people in your Chama, on receipts and on statements, so they know the money is yours.',
    phone: 'One number for every Chama you are in. The treasurer uses it to remind you on WhatsApp and SMS, and it matches your M-Pesa payments to you. Only the treasurer and secretary see it. If you change it here, your Chamas get the new number.',
    dob: 'Your age lets the app suit you: from 45 the text gets larger, and from 60 the app becomes simpler with bigger buttons. You can always choose the standard app in Settings. Nobody in your Chama sees your date of birth, and you can remove it in Privacy and my data.',
    gender: 'It helps women’s and youth Chamas, and helps us improve the app. It is never shown to other members. “Prefer not to say” is a full answer.'
  },
  html() {
    const s = this.st, steps = ['name', 'phone', 'dob', 'gender'], yr = new Date().getFullYear();
    if (s.step === -1) return `<div class="ab"><span class="aw-ic">${icon('sparkle')}</span><h2 class="ab-q">My Chama has been updated</h2>
<ul class="aw-list ab-news">${UPDATE_NOTES.map(x => `<li>${icon('check', 's')}${esc(x)}</li>`).join('')}</ul>
<p class="ab-hint">To keep going, check four details about you. It takes a minute.</p>
<div class="ab-nav"><span></span><button type="button" class="btn pri lg" data-ab="next">Continue</button></div></div>`;
    const k = steps[s.step];
    const dots = `<div class="ab-dots" aria-hidden="true">${steps.map((_, i) => `<i class="${i < s.step ? 'done' : i === s.step ? 'on' : ''}"></i>`).join('')}</div>`;
    const why = `<button type="button" class="ab-why" data-ab="why" aria-expanded="${this.why}">${icon('help', 's')}Why we ask</button>${this.why ? `<p class="ab-whytext">${esc(this.WHY[k])}</p>` : ''}`;
    let q = '', body = '', ok = true;
    if (k === 'name') { q = 'What is your name?'; body = `<input id="abName" class="ab-input" autocomplete="name" autocapitalize="words" maxlength="80" value="${esc(s.name)}" placeholder="e.g. Grace Wanjiru">`; ok = s.name.trim().length >= 2; }
    if (k === 'phone') { q = 'What is your phone number?'; body = `<input id="abPhone" class="ab-input" type="tel" inputmode="tel" autocomplete="tel" maxlength="16" value="${esc(s.phone)}" placeholder="0712 345 678"><p class="ab-hint">The number you use for M-Pesa. Every Chama you join uses it.</p>`; ok = this.phoneOk(s.phone); }
    if (k === 'dob') {
      q = 'When were you born?';
      const sum = s.y ? `<div class="ab-sum"><b>${s.d ? s.d + ' ' : ''}${s.m ? MONTHS[s.m - 1] + ' ' : ''}${s.y}</b>${this.age() != null ? `<span>${this.age()} years</span>` : ''}</div>` : '';
      if (s.sub === 'decade') body = `<p class="ab-hint">First, the years you were born in.</p><div class="ab-grid g3">${[1940, 1950, 1960, 1970, 1980, 1990, 2000].filter(x => x <= yr - 13).map(x => `<button type="button" class="ab-opt${s.decade === x ? ' on' : ''}" data-ab="decade" data-v="${x}">${x}s</button>`).join('')}<button type="button" class="ab-opt" data-ab="decade" data-v="1930">Before 1940</button></div>`;
      else if (s.sub === 'year') body = `<p class="ab-hint">Now the year.</p><div class="ab-grid g5">${Array.from({ length: 10 }, (_, i) => s.decade + i).filter(x => x <= yr - 13).map(x => `<button type="button" class="ab-opt${s.y === x ? ' on' : ''}" data-ab="year" data-v="${x}">${x}</button>`).join('')}</div><button type="button" class="ab-back" data-ab="sub" data-v="decade">Other years</button>`;
      else if (s.sub === 'month') body = `<p class="ab-hint">The month.</p><div class="ab-grid g3">${MONTHS.map((x, i) => `<button type="button" class="ab-opt${s.m === i + 1 ? ' on' : ''}" data-ab="month" data-v="${i + 1}">${x.slice(0, 3)}</button>`).join('')}</div><div class="ab-row"><button type="button" class="ab-back" data-ab="sub" data-v="year">Change the year</button><button type="button" class="ab-back" data-ab="notsure">Not sure</button></div>`;
      else body = `<p class="ab-hint">And the day.</p><div class="ab-grid g7">${Array.from({ length: new Date(s.y, s.m, 0).getDate() }, (_, i) => `<button type="button" class="ab-opt sm${s.d === i + 1 ? ' on' : ''}" data-ab="day" data-v="${i + 1}">${i + 1}</button>`).join('')}</div><div class="ab-row"><button type="button" class="ab-back" data-ab="sub" data-v="month">Change the month</button><button type="button" class="ab-back" data-ab="notsure">Not sure</button></div>`;
      body = sum + body; ok = !!s.y;
    }
    if (k === 'gender') { q = 'What is your gender?'; body = `<div class="ab-grid g1">${[['female', 'Female'], ['male', 'Male'], ['other', 'Other'], ['prefer_not', 'Prefer not to say']].map(([v, t]) => `<button type="button" class="ab-opt wide${s.gender === v ? ' on' : ''}" data-ab="gender" data-v="${v}">${t}</button>`).join('')}</div>`; ok = !!s.gender; }
    const last = s.step === steps.length - 1;
    return `<div class="ab"><div class="ab-top">${dots}<small>${s.step + 1} of 4</small></div><h2 class="ab-q">${esc(q)}</h2>${why}<div class="ab-body">${body}</div>
<div class="ab-nav">${s.step > 0 ? '<button type="button" class="btn ghost" data-ab="prev">Back</button>' : '<span></span>'}<button type="button" class="btn pri lg" data-ab="${last ? 'save' : 'next'}"${ok ? '' : ' disabled'}>${last ? 'Finish' : 'Next'}</button></div></div>`;
  },
  card() { if (!this.st) this.start(null, false); return `<div class="pz-page">${this.html()}</div>`; },
  /* existing members: the update notice, then the questions (prefilled; skipped if all are already known) */
  /* a new phone: bring the date of birth from the server so the app matches the person's age here too */
  async syncAge() {
    if (this.local().birth_date) return;
    try {
      const r = await __M_src_core_backend_js.Backend.sb.rpc('get_my_details'); if (r.error || !r.data || !r.data.birth_date) return;
      localStorage.setItem('mca-about:data:' + this.uid(), JSON.stringify({ birth_date: r.data.birth_date, gender: r.data.gender, phone: r.data.phone }));
      if (Adapt.apply(Adapt.age())) { try { render(); } catch (e) {} }
    } catch (e) { /* stays as it is */ }
  },
  async check() {
    if (this.done() || !Session.ready()) { if (this.done()) this.syncAge(); return Personal.check(); }
    let srv = null; try { const r = await __M_src_core_backend_js.Backend.sb.rpc('get_my_details'); if (!r.error) srv = r.data; } catch (e) {}
    this.start(srv, true);
    const s = this.st;
    if (srv && srv.full_name && this.phoneOk(srv.phone) && srv.birth_date && srv.gender) {
      try { localStorage.setItem('mca-about:data:' + this.uid(), JSON.stringify({ birth_date: srv.birth_date, gender: srv.gender, phone: srv.phone })); } catch (e) {}
      s.complete = true;
    }
    let root = document.getElementById('awRoot'); if (!root) { root = document.createElement('div'); root.id = 'awRoot'; document.body.appendChild(root); }
    root.innerHTML = `<div class="aw" role="dialog" aria-modal="true" aria-label="About you"><div class="aw-in"><div class="aw-card ab-card">${this.html()}</div></div></div>`;
    document.body.classList.add('aw-on'); this.overlay = true;
  },
  repaint() {
    if (this.overlay) { const c = document.querySelector('#awRoot .ab-card'); if (c) c.innerHTML = this.html(); }
    else { try { __M_src_features_auth_gate_js.Gate.paint(); } catch (e) {} }
    const f = document.querySelector('#abName, #abPhone'); if (f && document.activeElement !== f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) {} }, 60);
  },
  close() {
    try { localStorage.setItem(this.key(), 'done'); } catch (e) {}
    const band = Adapt.apply(this.age()), age = this.age();
    if (this.overlay) { this.overlay = false; const r = document.getElementById('awRoot'); if (r) r.innerHTML = ''; document.body.classList.remove('aw-on'); }
    else { try { __M_src_features_auth_gate_js.Gate.paint(); } catch (e) {} }
    setTimeout(() => { if (band && band !== 'std') Adapt.explain(band, age); setTimeout(() => Personal.check(), 400); }, 300);
  },
  async save() {
    const s = this.st, B = __M_src_core_backend_js.Backend, uid = this.uid();
    const dob = s.y ? `${s.y}-${String(s.m || 1).padStart(2, '0')}-${String(s.d || 1).padStart(2, '0')}` : null;
    const phone = s.phone.replace(/[\s-]/g, '') || null;
    let saved = false;
    try {
      const { error } = await B.sb.rpc('set_my_details', { p_full_name: s.name.trim() || null, p_phone: phone, p_birth_date: dob, p_gender: s.gender || null });
      if (!error) saved = true;
      else if (/Could not find the function|PGRST202|schema cache/i.test(error.message || '')) {
        const r = await B.sb.rpc('set_my_profile', { p_full_name: s.name.trim() || null, p_phone: phone, p_username: null });
        saved = !r.error;
      } else return toast(rpcMessage(error));
    } catch (e) { return toast('Could not save. Check your internet and try again.'); }
    try { localStorage.setItem('mca-about:data:' + uid, JSON.stringify({ birth_date: dob, gender: s.gender || null, phone, exact: !!(s.m && s.d) })); } catch (e) {}
    try { const p = Session.readProfile ? Session.readProfile() : null; if (p && Session.writeProfile) Session.writeProfile({ ...p, name: s.name.trim() || p.name, phone: phone || p.phone }); } catch (e) {}
    if (saved) toast('Saved. Thank you.', 'ok');
    this.close();
  }
};
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-ab]'); if (!b || !About.st) return;
  const s = About.st, k = b.dataset.ab, v = b.dataset.v;
  const n1 = document.getElementById('abName'); if (n1) s.name = n1.value;
  const p1 = document.getElementById('abPhone'); if (p1) s.phone = p1.value;
  if (k === 'why') { About.why = !About.why; return About.repaint(); }
  if (k === 'next') {
    if (s.step === -1 && s.complete) return About.close();
    s.step = Math.min(3, s.step + 1); About.why = false; if (s.step === 2) s.sub = s.y ? (s.m ? 'day' : 'month') : 'decade'; return About.repaint();
  }
  if (k === 'prev') { s.step = Math.max(0, s.step - 1); About.why = false; return About.repaint(); }
  if (k === 'decade') { s.decade = Number(v); s.sub = 'year'; return About.repaint(); }
  if (k === 'year') { s.y = Number(v); s.sub = 'month'; return About.repaint(); }
  if (k === 'month') { s.m = Number(v); if (s.d && s.d > new Date(s.y, s.m, 0).getDate()) s.d = null; s.sub = 'day'; return About.repaint(); }
  if (k === 'day') { s.d = Number(v); return About.repaint(); }
  if (k === 'notsure') { if (s.sub === 'month') s.m = null; s.d = null; s.step = 3; About.why = false; return About.repaint(); }
  if (k === 'sub') { s.sub = v; return About.repaint(); }
  if (k === 'gender') { s.gender = v; return About.repaint(); }
  if (k === 'save') return About.save();
});
document.addEventListener('input', e => {
  if (!About.st || !e.target) return;
  if (e.target.id === 'abName') { About.st.name = e.target.value; const b = document.querySelector('[data-ab="next"]'); if (b) b.disabled = e.target.value.trim().length < 2; }
  if (e.target.id === 'abPhone') { About.st.phone = e.target.value; const b = document.querySelector('[data-ab="next"]'); if (b) b.disabled = !About.phoneOk(e.target.value); }
});

/* ---- "Make it yours": before a new person creates or joins a Chama, and once for everyone after this update ---- */
const PERSONAL_V = 'mca-personal-v1';
const WHATS_NEW = ['Ask the Guide anything (next to the bell)', 'Your card changes colour with your payments', 'Sign loan terms on your own phone', 'M-Pesa screenshots read on your phone', 'Fingerprint or face to unlock'];
const Personal = {
  done() { try { return !!localStorage.getItem(PERSONAL_V); } catch (e) { return true; } },
  html(existing) {
    const A = __M_src_core_a11y_js.A11y, d = A.d, money = (() => { try { return localStorage.getItem('mca-hide-money') === 'true'; } catch (e) { return false; } })();
    const tile = (v, t, sub) => `<button type="button" class="pz-mode${d.theme === v ? ' on' : ''}" data-pz="theme" data-v="${v}" aria-pressed="${d.theme === v}"><span class="pz-prev pz-${v}"><i></i><i></i><i></i></span><b>${t}</b><small>${sub}</small></button>`;
    const sw = (k, v, t) => `<button type="button" class="pz-sw${(d.accent || 'green') === k ? ' on' : ''}" data-pz="accent" data-v="${k}" aria-label="${t}" aria-pressed="${(d.accent || 'green') === k}" style="--c:${v}"></button>`;
    return `<div class="pz"><div class="pz-head"><span class="aw-ic">${icon('sparkle')}</span><h2>${existing ? 'Your app has been updated' : 'Make it yours'}</h2><p>${existing ? 'Take a moment to set it up the way you like. You can change these any time in Settings.' : 'Set up how My Chama looks before you start. You can change these any time in Settings.'}</p></div>
${existing ? `<div class="pz-sec"><h4>What’s new</h4><ul class="aw-list">${WHATS_NEW.map(x => `<li>${icon('check', 's')}${esc(x)}</li>`).join('')}</ul></div>` : ''}
<div class="pz-sec"><h4>Appearance</h4><div class="pz-modes">${tile('auto', 'Follow phone', 'Changes with your phone')}${tile('light', 'Light', 'Bright and clear')}${tile('dark', 'Dark', 'Easy on the eyes')}</div></div>
<div class="pz-sec"><h4>Colour</h4><div class="pz-sws">${sw('green', '#0b6b4d', 'Green')}${sw('blue', '#1f5fae', 'Blue')}${sw('purple', '#5b34b8', 'Purple')}${sw('gold', '#8f6213', 'Gold')}${sw('rose', '#b0284f', 'Rose')}${sw('teal', '#0b6f78', 'Teal')}</div></div>
<div class="pz-sec"><h4>Text size</h4><div class="pz-seg">${[['n', 'Default'], ['l', 'Large'], ['x', 'Largest']].map(([v, t]) => `<button type="button" class="${d.size === v ? 'on' : ''}" data-pz="size" data-v="${v}" aria-pressed="${d.size === v}">${t}</button>`).join('')}</div></div>
<div class="pz-sec"><h4>Privacy and sound</h4>
<div class="lk-row"><span><b>Hide amounts when I open the app</b><small>Tap the eye to show them</small></span><button type="button" class="sw-toggle${money ? ' on' : ''}" role="switch" aria-checked="${money}" data-pz="money"><i></i></button></div>
<div class="lk-row"><span><b>Sounds</b><small>A soft chime when something important succeeds</small></span><button type="button" class="sw-toggle${__M_src_ui_toast_js.Sfx.enabled ? ' on' : ''}" role="switch" aria-checked="${__M_src_ui_toast_js.Sfx.enabled}" data-pz="sfx"><i></i></button></div></div>
<button type="button" class="btn pri block lg" data-pz="done">${existing ? 'Done' : 'Continue'}</button></div>`;
  },
  card() { return `<div class="pz-page">${this.html(false)}</div>`; },
  check() {
    if (this.done() || !Session.ready()) return;
    let root = document.getElementById('awRoot'); if (!root) { root = document.createElement('div'); root.id = 'awRoot'; document.body.appendChild(root); }
    root.innerHTML = `<div class="aw" role="dialog" aria-modal="true" aria-label="Make it yours"><div class="aw-in"><div class="aw-card">${this.html(true)}</div></div></div>`;
    document.body.classList.add('aw-on'); this.overlay = true;
  },
  repaint() {
    if (this.overlay) { const c = document.querySelector('#awRoot .aw-card'); if (c) c.innerHTML = this.html(true); return; }
    try { __M_src_features_auth_gate_js.Gate.paint(); } catch (e) {}
  },
  finish() {
    try { localStorage.setItem(PERSONAL_V, new Date().toISOString()); } catch (e) {}
    if (this.overlay) { this.overlay = false; const r = document.getElementById('awRoot'); if (r) r.innerHTML = ''; document.body.classList.remove('aw-on'); toast('All set', 'ok'); return; }
    try { __M_src_features_auth_gate_js.Gate.paint(); } catch (e) {}
  }
};
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-pz]'); if (!b) return;
  const A = __M_src_core_a11y_js.A11y, k = b.dataset.pz;
  if (k === 'theme' || k === 'accent' || k === 'size') { A.d[k] = b.dataset.v; A.save(); return Personal.repaint(); }
  if (k === 'money') { const on = !(localStorage.getItem('mca-hide-money') === 'true'); try { localStorage.setItem('mca-hide-money', on ? 'true' : 'false'); } catch (err) {} document.documentElement.classList.toggle('hide-money', on); return Personal.repaint(); }
  if (k === 'sfx') { try { localStorage.setItem('mca-sfx', __M_src_ui_toast_js.Sfx.enabled ? 'off' : 'on'); } catch (err) {} return Personal.repaint(); }
  if (k === 'done') Personal.finish();
});

/* ---- "Know your Chama": a walkthrough every member completes once per Chama, before Home. It cannot be skipped. ---- */
const AWARE_V = 'v1';
const Aware = {
  i: 0, agree: false,
  key() { return 'mca-aware:' + Store.chamaId + ':' + ((Session.user && Session.user.id) || '') + ':' + AWARE_V; },
  done() { try { return !!localStorage.getItem(this.key()); } catch (e) { return false; } },
  async check() {
    if (!Session.ready() || !Store.chamaId || !Session.user || Session.role === 'treasurer' || this.done()) return About.check();
    const s = Store.get(); if (!s || !s.chama) return About.check();
    /* cover Home at once, so it does not show for a moment and then jump; the server may then say it was already done */
    this.i = 0; this.agree = false; this.show();
    try {
      const { data, error } = await __M_src_core_backend_js.Backend.sb.from('chama_awareness').select('version').eq('chama_id', Store.chamaId).eq('user_id', Session.user.id).eq('version', AWARE_V).limit(1);
      if (!error && data && data.length) {
        try { localStorage.setItem(this.key(), 'server'); } catch (e) {}
        const r = document.getElementById('awRoot'); if (r) r.innerHTML = ''; document.body.classList.remove('aw-on');
        return About.check();
      }
    } catch (e) { /* table not there yet: the walkthrough still runs and is kept on this phone */ }
  },
  slides(s) {
    const c = s.chama || {}, U = __M_src_core_utils_js, cur = Domain.now(), meId = s.shared ? s.shared.me : Session.memberId, me = meId ? (s.members || []).find(m => m.id === meId) : null;
    const mine = me ? Domain.rate(s, me.id) : c.monthly, active = (s.members || []).filter(m => !m.left);
    let turn = ''; if (me && c.mode !== 'savings') for (let i = 0; i < 48; i++) { const mk = U.addMonths(cur, i), r = Domain.recipient(s, mk); if (r && r.id === me.id) { turn = U.monthLabel(mk); break; } }
    const role = Session.role === 'secretary' ? 'Secretary' : 'Member';
    const rules = String(c.rules || '').trim();
    const people = active.slice(0, 15).map(m => `<span class="aw-p">${__M_src_ui_avatar_js.av(m, 44)}<small>${esc(m.name.split(' ')[0])}${m.role ? '<em>' + esc(m.role) + '</em>' : ''}</small></span>`).join('');
    return [
      { ic: 'group', t: 'Welcome to ' + (c.name || 'the Chama'), b: `${/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(c.photo || '') ? `<img class="av aw-face" src="${c.photo}" alt="Photo of ${esc(c.name || 'the Chama')}" data-name="${esc(c.name || '')}">` : ''}<p>Before you start, take a minute to know how this Chama works. You can come back to this any time from the Guide.</p><div class="aw-facts"><div><b>${esc(role)}</b><span>Your role</span></div><div><b>${active.length}</b><span>Members</span></div><div><b>${esc(c.mode === 'savings' ? 'Savings' : 'Merry-go-round')}</b><span>Type</span></div></div>` },
      { ic: 'coins', t: 'Your money', b: `<div class="aw-money"><div class="aw-big num">${esc(kes(mine))}</div><p>is your contribution every month${me && (me.shares || 1) > 1 ? ' (' + me.shares + ' shares)' : ''}.</p></div><ul class="aw-list"><li>${icon('clock', 's')}Due by <b>day ${esc(c.dueDay)}</b> of each month</li>${c.payTo ? `<li>${icon('wallet', 's')}Pay to <b>${esc(c.payTo)}</b></li>` : ''}${Number(c.finePerLate) > 0 ? `<li>${icon('receipt', 's')}Paying late costs a fine of <b>${esc(kes(c.finePerLate))}</b></li>` : ''}<li>${icon('loans', 's')}Loans cost <b>${esc(c.loanRate)}%</b> a month, and you sign the terms</li></ul>` },
      { ic: 'swap', t: c.mode === 'savings' ? 'How the pool grows' : 'Your turn for the pot', b: c.mode === 'savings' ? '<p>Money stays in the pool. It is lent to members, and what you saved stays yours. Your savings show on Home and in your statement.</p>' : `<div class="aw-money"><div class="aw-big">${esc(turn || 'Not set yet')}</div><p>${turn ? 'is when you receive the pot, if the order does not change. Any change is shown to everyone.' : 'The treasurer will place you in the payout order.'}</p></div><p class="aw-note">Each month one member receives what everyone paid. If someone has not paid, the pot is smaller, so paying on time keeps it fair.</p>` },
      { ic: 'people', t: 'The people', b: `<p>These are the members. The treasurer keeps the books and the secretary keeps the register and meetings.</p><div class="aw-people">${people}</div>${active.length > 15 ? `<p class="aw-note">and ${active.length - 15} more.</p>` : ''}` },
      { ic: 'doc', t: 'The rules', b: rules ? `<div class="aw-rules">${esc(rules).replace(/\n/g, '<br>')}</div>` : `<ul class="aw-list"><li>${icon('check', 's')}Pay your contribution on time, every month</li><li>${icon('check', 's')}Repay loans as agreed in what you signed</li><li>${icon('check', 's')}Attend meetings, or say if you cannot</li><li>${icon('check', 's')}Respect every member in the chat</li><li>${icon('check', 's')}Leaving needs a reason, and your past records stay with the group</li></ul><p class="aw-note">The treasurer has not written special rules yet. These are the usual ones.</p>` },
      { ic: 'shield', t: 'Your privacy', b: `<ul class="aw-list"><li>${icon('eye', 's')}You see your own money and the group totals</li><li>${icon('lock', 's')}Other members do not see your payments or loans</li><li>${icon('shield', 's')}The treasurer sees everyone’s records, and every change is kept in History</li><li>${icon('out', 's')}You can leave, or ask for your data, at any time</li></ul>` },
      { ic: 'check', t: 'Ready?', last: true, b: `<p>Tick to confirm you have read how ${esc(c.name || 'this Chama')} works.</p><label class="aw-agree"><input type="checkbox" id="awAgree"${this.agree ? ' checked' : ''}><span>I understand the contributions, the payout order, the rules and what I am responsible for, and I agree to them.</span></label>` }
    ];
  },
  show() {
    const s = Store.get(); if (!s) return;
    let root = document.getElementById('awRoot'); if (!root) { root = document.createElement('div'); root.id = 'awRoot'; document.body.appendChild(root); }
    const sl = this.slides(s), x = sl[this.i], n = sl.length;
    /* the backdrop is built once; each step only swaps the card, so nothing behind it flashes through */
    const inner = `<div class="aw-dots" aria-hidden="true">${sl.map((_, k) => `<i class="${k < this.i ? 'done' : k === this.i ? 'on' : ''}"></i>`).join('')}</div>
<div class="aw-card ${this.dir === 'back' ? 'from-left' : ''}"><span class="aw-ic">${icon(x.ic)}</span><small>${this.i + 1} of ${n}</small><h2 id="awT">${esc(x.t)}</h2><div class="aw-b">${x.b}</div></div>
<div class="aw-nav">${this.i > 0 ? '<button type="button" class="btn ghost" data-aw="back">Back</button>' : '<span></span>'}<button type="button" class="btn pri" data-aw="${x.last ? 'agree' : 'next'}"${x.last && !this.agree ? ' disabled' : ''}>${x.last ? 'I agree, take me in' : 'Next'}</button></div>`;
    const box = root.querySelector('.aw .aw-in');
    if (box) { box.innerHTML = inner; const a = root.querySelector('.aw'); if (a) a.scrollTop = 0; }
    else root.innerHTML = `<div class="aw" role="dialog" aria-modal="true" aria-labelledby="awT"><div class="aw-in">${inner}</div></div>`;
    document.body.classList.add('aw-on');
    const f = root.querySelector('[data-aw="next"],[data-aw="agree"]'); if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) {} }, 60);
  },
  async finish() {
    try { localStorage.setItem(this.key(), new Date().toISOString()); } catch (e) {}
    try { await __M_src_core_backend_js.Backend.sb.rpc('record_awareness', { p_cid: Store.chamaId, p_version: AWARE_V }); } catch (e) { /* kept on this phone */ }
    const r = document.getElementById('awRoot'); if (r) r.innerHTML = ''; document.body.classList.remove('aw-on');
    toast('Welcome. Ask the Guide (the sparkle at the top) whenever you need help.', 'ok');
    setTimeout(() => About.check(), 600);
  }
};
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-aw]'); if (!b) return;
  const k = b.dataset.aw, n = Aware.slides(Store.get() || { chama: {}, members: [] }).length;
  if (k === 'next') { Aware.dir = 'next'; Aware.i = Math.min(n - 1, Aware.i + 1); Aware.show(); }
  else if (k === 'back') { Aware.dir = 'back'; Aware.i = Math.max(0, Aware.i - 1); Aware.show(); }
  else if (k === 'agree' && Aware.agree) Aware.finish();
});
document.addEventListener('change', e => { if (e.target && e.target.id === 'awAgree') { Aware.agree = e.target.checked; const b = document.querySelector('[data-aw="agree"]'); if (b) b.disabled = !Aware.agree; } });

const actions = {
  guide: d => Guide.show((d && d.q) || ''),
  awareShow: () => { Aware.i = 0; Aware.agree = false; Aware.show(); },
  guideTour: d => Tour.start(d.id)
};

return { get Guide() { return Guide; }, get Tour() { return Tour; }, get Aware() { return Aware; }, get Personal() { return Personal; }, get About() { return About; }, get Adapt() { return Adapt; }, get actions() { return actions; }, get TASKS() { return TASKS; } };
})();

/* ---- src/features/index.js ---- */
const __M_src_features_index_js = (function () {
const homeFeature = __M_src_features_home_index_js;
const contributionsFeature = __M_src_features_contributions_index_js;
const loansFeature = __M_src_features_loans_index_js;
const membersFeature = __M_src_features_members_index_js;
const historyFeature = __M_src_features_history_index_js;
const finesFeature = __M_src_features_fines_index_js;
const expensesFeature = __M_src_features_expenses_index_js;
const reportsFeature = __M_src_features_reports_index_js;
const profileFeature = __M_src_features_profile_index_js;
const settingsFeature = __M_src_features_settings_index_js;
const notificationsFeature = __M_src_features_notifications_index_js;
const helpFeature = __M_src_features_help_index_js;
const authFeature = __M_src_features_auth_index_js;
const accountFeature = __M_src_features_account_deletion_js;
const shellFeature = __M_src_features_shell_index_js;
const requestsFeature = __M_src_features_requests_js;
const chatFeature = __M_src_features_chat_index_js;
const smartFeature = __M_src_features_smart_js;
const guideFeature = __M_src_features_guide_js;
/* Feature registry. Each feature folder exports `views` (pages it draws) and/or `actions` (things that change data).
   This file merges them into one table, and stops at start-up if two features claim the same name.
   To add a feature: create its folder, then add one import line and one entry in FEATURE_LIST below. */

const FEATURE_LIST = [guideFeature, homeFeature, contributionsFeature, loansFeature, membersFeature, historyFeature, finesFeature, expensesFeature, reportsFeature, profileFeature, settingsFeature, notificationsFeature, helpFeature, authFeature, accountFeature, shellFeature, requestsFeature, chatFeature, smartFeature];

function merge(kind) {
  const out = Object.create(null);
  FEATURE_LIST.forEach(f => Object.entries(f[kind] || {}).forEach(([k, v]) => {
    if (k in out) throw new Error(`Duplicate ${kind === 'views' ? 'page' : 'action'} "${k}"`);
    out[k] = v;
  }));
  return out;
}
const Views = merge('views');
const Actions = merge('actions');

return { get Views() { return Views; }, get Actions() { return Actions; }, };
})();

/* ---- src/ui/menu.js ---- */
const __M_src_ui_menu_js = (function () {
const { $ } = __M_src_lib_dom_js;

const P = { loans: ICONS.loans, chat: ICONS.chat, key: ICONS.key, alert: ICONS.alert, wallet: ICONS.wallet, clock: ICONS.clock, doc: ICONS.doc, users: ICONS.members, undo: ICONS.undo, pencil: ICONS.pencil, exit: ICONS.out, user: ICONS.profile, gear: ICONS.gear, back: ICONS.back, chev: ICONS.chev, close: ICONS.close, out: ICONS.out, globe: ICONS.globe, receipt: ICONS.receipt, shield: ICONS.shield, help: ICONS.help, scale: ICONS.scale, swap: ICONS.swap, mail: ICONS.mail, text: ICONS.text, bell: ICONS.bell, download: ICONS.download };
const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
const toast = (t) => { try { __M_src_ui_toast_js.toast(t); } catch (e) {} };
const drawer = () => document.getElementById('drawer');

function userNow() {
  const Me = __M_src_core_me_js.Me, Store = __M_src_core_store_js.Store;
  const me = Me.get() || {}, data = Store.get() || {}, member = me.memberId && data.members ? data.members.find(x => x.id === me.memberId) : null;
  const name = me.name || (member && member.name) || 'Member';
  const photo = (__M_src_core_session_js.Session.photoFor(member) || me.photo || '');
  return { first: (String(name).trim()[0] || 'M').toUpperCase(), name, welcome: 'Welcome back', photo: /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo) ? photo : '' };
}
function chamaNow() {
  const Store = __M_src_core_store_js.Store, Session = __M_src_core_session_js.Session;
  const data = Store.get() || {};
  let role = '';
  try { role = __M_src_features_auth_gate_js.GL().roleWord(Session.role) || ''; } catch (e) {}
  return { id: Store.chamaId || '', name: (data.chama && data.chama.name) || 'Chama', role };
}
function langNow() {
  let code = 'en';
  try { code = localStorage.getItem('chama.lang') || __M_src_features_auth_gate_js.OB.lang(); } catch (e) {}
  const list = window.CHAMA_LANGUAGES || [];
  const hit = list.find(l => l.code === code);
  return { code, native: hit ? hit.native : (code === 'sw' ? 'Kiswahili' : 'English') };
}
function fineCount() {
  try {
    const data = __M_src_core_store_js.Store.get() || {};
    return (data.fines || []).filter(f => !f.paid).length;
  } catch (e) { return 0; }
}

function go(hash) {
  try { Menu.close(); } catch (e) {}
  if (location.hash !== hash) location.hash = hash;
}
function openProfile() { go('#/profile'); }
function openChamaPicker() {
  Menu.close();
  try { __M_src_core_session_js.Session.openChooser(); } catch (e) { toast('Could not open your Chamas'); }
}
function openLanguagePicker() {
  Menu.close();
  const OB = __M_src_features_auth_gate_js.OB;
  const Session = __M_src_core_session_js.Session;
  OB.sheet = false; OB.langPick = null; OB.langQ = '';
  const view = document.getElementById('view');
  if (!view || !OB.langScreen) return;
  const paintLang = () => { view.innerHTML = OB.langScreen(); };
  paintLang();
  const trap = (e) => {
    const t = e.target.closest && e.target.closest('[data-ob]');
    if (!t || !view.contains(t)) return;
    if (Session.status !== 'ready' && Session.status !== 'demo') return;
    const act = t.dataset.ob;
    if (act !== 'lg-pick' && act !== 'lg-open' && act !== 'lg-close' && act !== 'lg-next') return;
    e.preventDefault();
    e.stopPropagation();
    if (act === 'lg-pick') { OB.langPick = t.dataset.v; OB.sheet = false; paintLang(); }
    else if (act === 'lg-open') { OB.sheet = true; paintLang(); }
    else if (act === 'lg-close') { OB.sheet = false; OB.langQ = ''; paintLang(); }
    else {
      OB.applyChoice(OB.langPick || OB.chosen());
      OB.revisit = false; OB.langPick = null; OB.sheet = false; OB.langQ = '';
      document.removeEventListener('click', trap, true);
      try { __M_src_core_rerender_js.render(); } catch (err) {}
      Menu.refresh();
    }
  };
  document.addEventListener('click', trap, true);
}
function openSection(id) {
  if (id === 'edit') {
    if (!__M_src_core_auth_js.Auth.isAdmin()) { toast('Only the treasurer can edit these'); return; }
    go('#/settings/chama');
    return;
  }
  if (id === 'reports') { go('#/reports'); return; }
  if (id === 'leave') {
    Menu.close();
    const fn = __M_src_features_index_js.Actions.leaveChama;
    if (typeof fn === 'function') fn();
  }
}
function undoLastChange() {
  if (!__M_src_core_auth_js.Auth.isAdmin()) { toast('Only the treasurer can undo'); return; }
  toast(__M_src_core_store_js.Store.undo() ? 'Last change undone' : 'Nothing to undo');
}
function signOut() {
  Menu.close();
  const fn = __M_src_features_index_js.Actions.signOutApp;
  if (typeof fn === 'function') fn();
}

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function row(opts) {
  const r = el(opts.toggle != null ? 'div' : 'button', 'mn-row' + (opts.danger ? ' danger' : ''));
  if (r.tagName === 'BUTTON') r.type = 'button';
  if (opts.icon) {
    const ic = el('span', 'mn-ico', svg(opts.icon));
    ic.style.background = opts.tone || '#0d8a64';
    r.appendChild(ic);
  }
  const lbl = el('span', 'mn-lbl');
  lbl.textContent = opts.label;
  r.appendChild(lbl);
  if (opts.badgeKey) {
    const b = el('span', 'mn-badge');
    b.dataset.key = opts.badgeKey;
    b.hidden = true;
    r.appendChild(b);
  }
  if (opts.valueKey || opts.value) {
    const v = el('span', 'mn-val');
    if (opts.valueKey) v.dataset.key = opts.valueKey;
    v.textContent = opts.value || '';
    r.appendChild(v);
  }
  if (opts.toggle != null) {
    const sw = el('button', 'mn-switch');
    sw.type = 'button';
    sw.setAttribute('role', 'switch');
    sw.setAttribute('aria-label', opts.label);
    sw.setAttribute('aria-checked', opts.toggle ? 'true' : 'false');
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      if (opts.onToggle) opts.onToggle(on);
    });
    r.appendChild(sw);
    return r;
  }
  if (opts.chevron !== false) r.appendChild(el('span', 'mn-chev', svg('chev')));
  if (opts.onTap) {
    r.addEventListener('pointerdown', () => r.classList.add('pressed'));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => r.addEventListener(ev, () => r.classList.remove('pressed')));
    r.addEventListener('click', () => setTimeout(opts.onTap, 110));
  }
  return r;
}
function group(rows, label, foot) {
  const wrap = document.createDocumentFragment();
  if (label) wrap.appendChild(el('div', 'mn-label', label));
  const card = el('div', 'mn-group');
  rows.forEach(r => card.appendChild(r));
  wrap.appendChild(card);
  if (foot) wrap.appendChild(el('p', 'mn-foot', foot));
  return wrap;
}

const stack = [];
function makeScreen(def, origin) {
  const dr = drawer();
  const s = el('section', 'mn-screen' + (def.root ? ' root' : ''));
  s.setAttribute('aria-label', def.title || 'Menu');
  let nav = null;
  if (!def.root) {
    nav = el('div', 'mn-nav');
    const back = el('button', 'mn-back', svg('back') + '<span></span>');
    back.type = 'button';
    back.querySelector('span').textContent = stack.length ? stack[stack.length - 1].def.title : 'Menu';
    back.addEventListener('click', () => Menu.back());
    const title = el('span', 'mn-navtitle');
    title.textContent = def.title;
    nav.append(back, title);
    s.appendChild(nav);
  }
  const scroll = el('div', 'mn-scroll');
  s.appendChild(scroll);
  if (!def.root) {
    const h = el('h1', 'mn-large');
    h.textContent = def.title;
    scroll.appendChild(h);
  }
  def.build(scroll, s);
  scroll.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scroll.scrollTop > 16);
  });
  if (origin && origin.isConnected && dr) {
    const d = dr.getBoundingClientRect(), r = origin.getBoundingClientRect();
    s.style.setProperty('--sx', String(Math.max(0.2, r.width / d.width)));
    s.style.setProperty('--sy', String(Math.max(0.08, r.height / d.height)));
    s.style.transformOrigin = (r.left - d.left + r.width / 2) + 'px ' + (r.top - d.top + r.height / 2) + 'px';
    s.origin = true;
  }
  s.def = def;
  return s;
}
function push(def, origin) {
  const dr = drawer(); if (!dr) return;
  const prev = stack[stack.length - 1];
  const s = makeScreen(def, origin);
  dr.appendChild(s);
  s.classList.add(s.origin ? 'from-origin' : 'enter');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    s.classList.remove('from-origin', 'enter');
    if (prev) prev.classList.add('behind');
  }));
  stack.push(s);
  setTimeout(() => { const b = s.querySelector('button'); if (b) b.focus({ preventScroll: true }); }, 480);
}
function pop() {
  if (stack.length <= 1) { Menu.close(); return; }
  const top = stack.pop();
  const prev = stack[stack.length - 1];
  top.classList.add(top.origin ? 'to-origin' : 'leave');
  if (prev) prev.classList.remove('behind');
  setTimeout(() => top.remove(), 520);
}

const Menu = {
  y: 0, timer: null,
  open() {
    const dr = drawer(); if (!dr || dr.classList.contains('open')) return;
    clearTimeout(this.timer);
    this.y = window.scrollY || 0;
    Object.assign(document.body.style, { position: 'fixed', top: -this.y + 'px', left: '0', right: '0', width: '100%', overflow: 'hidden' });
    document.body.classList.add('menu-open');
    dr.hidden = false;
    const shade = $('#shade'); if (shade) { shade.hidden = false; shade.classList.add('open'); }
    $('#menuBtn').setAttribute('aria-expanded', 'true');
    while (stack.length) stack.pop();
    this.build();
    void dr.offsetWidth;
    requestAnimationFrame(() => dr.classList.add('open'));
    setTimeout(() => { const b = dr.querySelector('.mn-x'); if (b) b.focus({ preventScroll: true }); }, 400);
  },
  close() {
    const dr = drawer(); if (!dr) return;
    const was = dr.classList.contains('open');
    while (stack.length > 1) { const top = stack.pop(); top.remove(); }
    if (stack[0]) stack[0].classList.remove('behind');
    document.body.classList.remove('menu-open');
    dr.classList.remove('open');
    const shade = $('#shade'); if (shade) shade.classList.remove('open');
    $('#menuBtn').setAttribute('aria-expanded', 'false');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { dr.hidden = true; if (shade) shade.hidden = true; }, 420);
    if (was) {
      Object.assign(document.body.style, { position: '', top: '', left: '', right: '', width: '', overflow: '' });
      window.scrollTo(0, this.y || 0);
      const btn = $('#menuBtn'); if (btn) btn.focus();
    }
  },
  back() {
    const dr = drawer();
    if (!dr || !dr.classList.contains('open')) return;
    pop();
  },
  refresh() {
    const user = userNow(), chama = chamaNow(), lang = langNow(), fines = fineCount();
    document.querySelectorAll('#drawer [data-key="chama"]').forEach(n => { n.textContent = chama.name; });
    document.querySelectorAll('#drawer [data-key="lang"]').forEach(n => { n.textContent = lang.native; });
    document.querySelectorAll('#drawer [data-key="user"]').forEach(n => { n.textContent = user.name; });
    document.querySelectorAll('#drawer [data-key="fines"]').forEach(n => { n.hidden = fines < 1; n.textContent = String(fines); });
    { const rq = (__M_src_core_session_js.Session.requests || []).length; document.querySelectorAll('#drawer [data-key="requests"]').forEach(n => { n.hidden = rq < 1; n.textContent = String(rq); }); }
    document.querySelectorAll('#drawer [data-key="money"]').forEach(n => { n.textContent = fines ? (fines + (fines === 1 ? ' fine due' : ' fines due')) : 'Fines and expenses'; });
    const av = document.querySelector('#drawer .mn-avatar'); if (av) { if (user.photo) av.innerHTML = '<img alt="" src="' + user.photo + '">'; else av.textContent = user.first; }
    const sub = document.querySelector('#drawer .mn-who em'); if (sub) sub.textContent = (chama.role ? chama.role + ' · ' : '') + chama.name;
    const strong = document.querySelector('#drawer .mn-who strong'); if (strong) strong.textContent = user.name;
    const A = __M_src_core_a11y_js.A11y.d || {};
    const dr = drawer();
    if (dr) {
      dr.classList.toggle('mn-large', A.size === 'l' || A.size === 'x');
      dr.classList.toggle('mn-calm', !!A.rm);
    }
  },
  build() {
    const dr = drawer(); if (!dr) return;
    dr.innerHTML = '';
    const user = userNow(), chama = chamaNow(), lang = langNow();
    const root = makeScreen({
      root: true, title: 'Menu',
      build(scroll) {
        const hero = el('div', 'mn-hero');
        hero.innerHTML = `<div class="mn-hero-top"><span class="mn-brand">${markTile()}My Chama</span><button class="mn-x" type="button" aria-label="Close menu">${svg('close')}</button></div>`;
        hero.querySelector('.mn-x').addEventListener('click', () => Menu.close());
        const profile = el('button', 'mn-profile');
        profile.type = 'button';
        profile.setAttribute('aria-label', 'Open your profile');
        profile.innerHTML = `<span class="mn-avatar" aria-hidden="true"></span><span class="mn-who"><strong></strong><em></em></span><span class="mn-chev">${svg('chev')}</span>`;
        profile.querySelector('strong').textContent = user.name;
        profile.addEventListener('click', () => setTimeout(() => window.openProfile(), 110));
        hero.appendChild(profile);
        /* the Guide, right under the profile card: search, questions and step-by-step help */
        const find = el('button', 'mn-search'); find.type = 'button'; find.setAttribute('aria-label', 'Search or ask the Guide');
        find.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg><span>Search or ask “how do I…”</span><kbd>/</kbd>`;
        find.addEventListener('click', () => { Menu.close(); setTimeout(() => __M_src_features_guide_js.Guide.show(), 220); });
        hero.appendChild(find);
        scroll.appendChild(hero);
        const admin = __M_src_core_auth_js.Auth.isAdmin();
        scroll.appendChild(group([
          row({ icon: 'loans', tone: '#0b6b4d', label: 'Loans', onTap: () => go('#/loans') }),
          row({ icon: 'receipt', tone: '#c0392b', label: 'Fines', badgeKey: 'fines', onTap: () => go('#/fines') }),
          row({ icon: 'wallet', tone: '#b0843a', label: 'Expenses', onTap: () => go('#/expenses') }),
          row({ icon: 'clock', tone: '#2e6bb8', label: 'History', onTap: () => go('#/history') }),
          row({ icon: 'download', tone: '#0b6b4d', label: 'Reports and backup', onTap: () => go('#/reports') })
        ], 'Money and records'));
        scroll.appendChild(group([
          row({ icon: 'swap', tone: '#b0843a', label: 'Switch Chama', valueKey: 'chama', value: chama.name, onTap: () => window.openChamaPicker() }),
          ...(__M_src_core_session_js.Session.role !== 'member' ? [row({ icon: 'key', tone: '#a8670f', label: 'Join requests', badgeKey: 'requests', onTap: () => go('#/requests') })] : []),
          row({ icon: 'users', tone: '#0b6b4d', label: admin ? 'People and access' : 'My access', onTap: () => go('#/settings/actions') }),
          row({ icon: 'doc', tone: '#2e6bb8', label: 'Meetings, minutes and votes', onTap: () => go('#/chat/records') }),
          row({ icon: 'pencil', tone: '#47524c', label: 'Chama settings', onTap: () => go('#/settings/chama') }),
          ...(admin ? [row({ icon: 'undo', tone: '#47524c', label: 'Undo last change', chevron: false, onTap: () => window.undoLastChange() })] : [])
        ], 'Chama'));
        scroll.appendChild(group([
          row({ icon: 'gear', tone: '#47524c', label: 'Settings', onTap: () => go('#/settings') }),
          row({ icon: 'text', tone: '#2e6bb8', label: 'Display and accessibility', onTap: () => go('#/settings/app') }),
          row({ icon: 'globe', tone: '#2e6bb8', label: 'Language', valueKey: 'lang', value: lang.native, onTap: () => window.openLanguagePicker() }),
          row({ icon: 'help', tone: '#0b6b4d', label: 'Help', onTap: () => go('#/settings/help') }),
          row({ icon: 'shield', tone: '#47524c', label: 'Privacy and my data', onTap: () => go('#/settings/privacy') })
        ], 'App'));
        const reveal = el('div', 'mn-reveal show');
        const inner = el('div');
        const btn = el('button', 'mn-sign', svg('out') + '<span>Sign out</span>');
        btn.type = 'button';
        inner.appendChild(btn);
        reveal.appendChild(inner);
        scroll.appendChild(reveal);
        let ver = 'MY CHAMA';
        try { ver = 'MY CHAMA · ' + __M_src_content_app_info_js.APP.version; } catch (e) {}
        scroll.appendChild(el('p', 'mn-ver', ver));
        btn.addEventListener('click', () => { Menu.close(); const fn = __M_src_features_index_js.Actions.signOutAsk; if (typeof fn === 'function') fn(); });
      }
    });
    dr.appendChild(root);
    stack.push(root);
    this.refresh();
  }
};

function moneyDef() {
  return { title: 'Money', build(scroll) {
    const fines = fineCount();
    scroll.appendChild(group([
      row({ icon: 'alert', tone: '#e8a33d', label: 'Fines', badgeKey: 'fines', onTap: () => go('#/fines') }),
      row({ icon: 'wallet', tone: '#2fb47c', label: 'Expenses', onTap: () => go('#/expenses') })
    ], 'Money out and in', 'Fines are added by the Treasurer. Expenses need a receipt.'));
    Menu.refresh();
    if (!fines) { /* badge stays hidden */ }
  }};
}
function recordsDef() {
  return { title: 'Records', build(scroll) {
    scroll.appendChild(group([
      row({ icon: 'clock', tone: '#3f9fb8', label: 'History', onTap: () => go('#/history') }),
      row({ icon: 'doc', tone: '#3f9fb8', label: 'Reports & backup', onTap: () => window.openSection('reports') })
    ], 'Records', 'History keeps every change. Backups are saved to the Chama.'));
  }};
}
function chamaDef() {
  return { title: 'Chama settings', build(scroll) {
    const switchRow = row({ icon: 'users', tone: '#e2a332', label: 'Switch Chama', valueKey: 'chama', value: chamaNow().name, onTap: () => { window.openChamaPicker(); /* open the real chooser with the expand-from-row motion, origin = switchRow */ } });
    scroll.appendChild(group([switchRow], 'Chama', 'Only the Chama you are in right now is affected by these settings.'));
    scroll.appendChild(group([
      row({ icon: 'pencil', tone: '#e2a332', label: 'Edit Chama details', onTap: () => window.openSection('edit') }),
      row({ icon: 'undo', tone: '#e2a332', label: 'Undo last change', chevron: false, onTap: () => window.undoLastChange() })
    ], 'Manage'));
    scroll.appendChild(group([
      row({ icon: 'exit', tone: '#e5534b', label: 'Leave this Chama', danger: true, onTap: () => window.openSection('leave') })
    ], '', 'Leaving ends your access. Your past records stay with the Chama.'));
    Menu.refresh();
  }};
}
function accountDef() {
  return { title: 'Your account', build(scroll) {
    scroll.appendChild(group([
      row({ icon: 'user', tone: '#8c6bd6', label: 'My profile', valueKey: 'user', value: userNow().name, onTap: () => window.openProfile() }),
      row({ icon: 'globe', tone: '#5a7fd6', label: 'Language', valueKey: 'lang', value: langNow().native, onTap: () => window.openLanguagePicker() }),
      row({ icon: 'gear', tone: '#7d8a86', label: 'Settings', onTap: () => push(settingsDef()) })
    ], 'Your account', 'Your profile, language and how the app looks on this phone.'));
  }};
}
function settingsDef() {
  const A = __M_src_core_a11y_js.A11y;
  return { title: 'Settings', build(scroll) {
    scroll.appendChild(group([
      row({ label: 'Larger text', chevron: false, toggle: A.d.size === 'l' || A.d.size === 'x', onToggle: (on) => { A.d.size = on ? 'l' : 'n'; A.save(); Menu.refresh(); } }),
      row({ label: 'Calmer motion', chevron: false, toggle: !!A.d.rm, onToggle: (on) => { A.d.rm = on ? 1 : 0; A.save(); Menu.refresh(); } })
    ], 'Display', 'Larger text makes the menu easier to read. Calmer motion turns off most movement.'));
  }};
}

(function () {
  const dr = drawer(); if (!dr) return;
  let sx = null, sy = null;
  dr.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  dr.addEventListener('touchend', e => {
    if (sx == null) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    sx = null;
    if (dx < -56 && Math.abs(dy) < 80) Menu.back();
  }, { passive: true });
  addEventListener('keydown', e => {
    if (!dr.classList.contains('open')) return;
    if (e.key === 'Tab') {
      const top = stack[stack.length - 1]; if (!top) return;
      const f = [...top.querySelectorAll('button')].filter(b => !b.disabled && b.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

window.openProfile = openProfile;
window.openChamaPicker = openChamaPicker;
window.openLanguagePicker = openLanguagePicker;
window.openSection = openSection;
window.undoLastChange = undoLastChange;
window.signOut = signOut;
try { Menu.build(); } catch (e) { console.error(e); }

return { get Menu() { return Menu; } };
})();


/* ---- src/ui/nav.js ---- */
const __M_src_ui_nav_js = (function () {
const { NAV_ICON, NAV_LABEL, ROUTES, SUB } = __M_src_core_routes_js;
const { $, restart } = __M_src_lib_dom_js;

function buildNav() {
  const nav = $('#nav');
  nav.innerHTML = '<i class="liquid" aria-hidden="true"><i class="blob"></i></i>' + ROUTES.map(([k]) =>
    `<a href="#/${k}" data-k="${k}">${k === 'profile' ? '<span class="nav-av" aria-hidden="true"></span>' : `<svg viewBox="0 0 24 24" aria-hidden="true">${NAV_ICON[k]}</svg>`}<span>${NAV_LABEL[k]}</span></a>`).join('');
  let cur = null, ready = false, drag = null, quiet = 0;
  const liquid = () => nav.querySelector('.liquid');
  const links = () => [...nav.querySelectorAll('a[data-k]')];
  const vertical = () => getComputedStyle(nav).flexDirection === 'column';
  const keyFor = r => ROUTES.some(x => x[0] === r) ? r : SUB.includes(r) ? null : null;
  function place(key, instant) {
    const el = liquid(), a = key ? nav.querySelector(`a[data-k="${key}"]`) : null;
    links().forEach(x => x.classList.toggle('on', x === a));
    if (!a) { el.classList.remove('show'); cur = null; return; }
    const nb = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
    if (instant) el.classList.add('still');
    el.style.setProperty('--lx', (r.left - nb.left) + 'px');
    el.style.setProperty('--ly', (r.top - nb.top) + 'px');
    el.style.setProperty('--lw', r.width + 'px');
    el.style.setProperty('--lh', r.height + 'px');
    el.classList.add('show');
    if (instant) { void el.offsetWidth; el.classList.remove('still'); }
    else if (cur !== key) restart(el, 'slosh');
    cur = key;
  }
  function sync(r) {
    const key = keyFor(r);
    if (!ready) { ready = true; place(key, true); return; }
    if (key === cur) { links().forEach(x => x.classList.toggle('on', x.dataset.k === key)); return; }
    place(key, false);
  }
  /* drag: the liquid follows the finger, then settles on the nearest tab and navigates */
  nav.addEventListener('dragstart', e => e.preventDefault()); /* stop native link-drag from cancelling the gesture */
  nav.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, on: false };
  });
  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const v = vertical(), el = liquid();
    if (!drag.on) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
      drag.on = true;
      el.classList.add('drag', 'show');
    }
    const ls = links(), nb = nav.getBoundingClientRect();
    const first = ls[0].getBoundingClientRect(), last = ls[ls.length - 1].getBoundingClientRect();
    const base = v ? nb.top : nb.left, size = v ? first.height : first.width;
    const lo = (v ? first.top : first.left) - base, hi = (v ? last.bottom : last.right) - base - size;
    const p = v ? e.clientY : e.clientX;
    const pos = Math.min(hi, Math.max(lo, p - base - size / 2));
    el.style.setProperty(v ? '--ly' : '--lx', pos + 'px');
  });
  const finish = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.on; drag = null;
    if (!moved) return;
    quiet = Date.now() + 450;
    const v = vertical(), el = liquid(), lr = el.getBoundingClientRect();
    const c = v ? e.clientY : e.clientX;
    let best = null, bd = Infinity;
    links().forEach(a => {
      const r = a.getBoundingClientRect(), m = v ? r.top + r.height / 2 : r.left + r.width / 2, d = Math.abs(m - c);
      if (d < bd) { bd = d; best = a; }
    });
    el.classList.remove('drag');
    if (!best) return;
    const key = best.dataset.k;
    place(key, false);
    if (location.hash !== '#/' + key) location.hash = '#/' + key;
  };
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
  /* a drag must not also fire a tap on whatever it ended over */
  nav.addEventListener('click', e => { if (Date.now() < quiet) { e.preventDefault(); e.stopPropagation(); } }, true);
  window.addEventListener('resize', () => { if (cur) place(cur, true); });
  return { sync };
}

let navInstance = null;
const Nav = {
  init() { if (!navInstance) navInstance = buildNav(); },
  sync(r) { if (navInstance) navInstance.sync(r); }
};

return { get Nav() { return Nav; }, };
})();

/* ---- src/core/render.js ---- */
const __M_src_core_render_js = (function () {
const { Auth } = __M_src_core_auth_js;
const { Hist } = __M_src_core_history_js;
const { Me } = __M_src_core_me_js;
const { PAGE_NAME, ROUTES, SETTINGS_NAME, route } = __M_src_core_routes_js;
const { Session, Perm } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { esc } = __M_src_core_utils_js;
const { Gate } = __M_src_features_auth_gate_js;
const { Views } = __M_src_features_index_js;
const { Notify } = __M_src_features_notifications_notify_js;
const { $, restart } = __M_src_lib_dom_js;
const { av } = __M_src_ui_avatar_js;
const { Menu } = __M_src_ui_menu_js;
const { Nav } = __M_src_ui_nav_js;
const { Account } = __M_src_features_account_deletion_js;

let lastRoute = null, painted = '';

/* Bottom-bar profile tab: the member's photo in a circle, or initials when there is no photo (never the person icon) */
function paintNavAvatar() {
  const box = document.querySelector('#nav a[data-k="profile"] .nav-av'); if (!box) return;
  const s = Store.get(), meA = Me.get() || {};
  const mmA = s && meA.memberId ? (s.members || []).find(x => x.id === meA.memberId) : null;
  const nm = meA.name || (mmA && mmA.name) || '', photo = Session.photoFor(mmA) || meA.photo;
  const ini = nm.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const ok = typeof photo === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo);
  const next = ok ? `<img src="${photo}" alt="">` : `<span>${esc(ini)}</span>`;
  if (box._html !== next) { box.innerHTML = next; box._html = next; }   /* rewriting the same picture made the tab blink */
}

function renderPage() {
  if (!Session.ready()) { painted = ''; return Gate.paint(); }   /* setup, welcome, chooser and sign-in are all gate screens */
  const s = Store.get();
  if (!s) {
    const view = document.getElementById('view');
    if (view && !view.querySelector('.opening-chama')) view.innerHTML = '<div class="opening-chama">' + Skel.page() + '</div>';
    document.body.classList.remove('no-tabs', 'gate-on');
    const hd0 = document.querySelector('header'); if (hd0) hd0.hidden = false;
    const menu0 = document.getElementById('menuBtn'); if (menu0) menu0.hidden = false;
    const name0 = document.getElementById('hname'); if (name0) name0.hidden = false;
    painted = '';
    return;
  }
  const r = route(), admin = Auth.isAdmin(), changed = r !== lastRoute, prev = lastRoute; lastRoute = r; if (changed) Hist.visit(r, prev);
  { const hd = document.querySelector('header'); if (hd) hd.hidden = false; document.body.classList.remove('gate-on'); }
  try { const dr = document.getElementById('drawer'); if (dr && dr.classList.contains('open')) Menu.close(); } catch (e) {}
  const chamaName = (s.chama && s.chama.name) || 'My Chama';
  const titleEl = document.getElementById('title'); if (titleEl) titleEl.textContent = chamaName;
  { const cs = document.querySelector('#chamaSmall'); if (cs) { cs.hidden = false; cs.textContent = Perm.label(Session.role) || 'Member'; } }
  document.body.classList.toggle('adm', admin);
  const viewEl = document.getElementById('view');
  const home = r === 'home', pt = document.getElementById('pageTitle'), menuBtn = document.getElementById('menuBtn'), backBtn = document.getElementById('backBtn'), hname = document.getElementById('hname');
  if (menuBtn) menuBtn.hidden = !home;
  if (hname) hname.hidden = !home;
  if (backBtn) { backBtn.hidden = home; backBtn.setAttribute('href', '#/' + Hist.back()); }
  const pageName = PAGE_NAME[r] || SETTINGS_NAME[r] || (r.startsWith('notifications/') ? 'Notification' : r.startsWith('chat/') ? 'Chat' : 'Chama');
  document.title = (home ? chamaName : pageName) + ' · My Chama';
  if (pt) { pt.hidden = home; pt.innerHTML = `<small>${esc(chamaName)}</small><b>${esc(pageName)}</b>`; if (changed) restart(pt, 'enter'); }
  if (changed && !home && viewEl) { try { window.scrollTo(0, 0); } catch (e) {} }
  if (changed && viewEl) {
    /* slide like an app: deeper pages come in from the right, going back from the left, tabs toward the tab tapped */
    const depth = x => !x || x === 'home' ? 0 : ROUTES.some(t => t[0] === x) ? 1 : /^(settings|notifications|chat|legal)\/.+\//.test(x) ? 4 : /\//.test(x) ? 3 : 2;
    const tabIx = x => ROUTES.findIndex(t => t[0] === x);
    let dir = 'pg-fwd';
    if (prev != null) {
      const a = depth(prev), b = depth(r);
      if (b < a) dir = 'pg-back';
      else if (a === b && a <= 1) dir = (r === 'home' ? 0 : tabIx(r)) < (prev === 'home' ? 0 : tabIx(prev)) ? 'pg-back' : 'pg-fwd';
    } else dir = 'pg';
    viewEl.classList.remove('pg', 'pg-fwd', 'pg-back'); void viewEl.offsetWidth; viewEl.classList.add(dir);
    if (pt) { pt.classList.remove('t-fwd', 't-back'); void pt.offsetWidth; pt.classList.add(dir === 'pg-back' ? 't-back' : 't-fwd'); }
  }
  Nav.sync(r);
  paintNavAvatar();
  const meD = Me.get() || {}, mmD = meD.memberId && s.members ? s.members.find(x => x.id === meD.memberId) : null;
  try { if (Menu.refresh) Menu.refresh(); } catch (e) {}
  document.querySelectorAll('#drawer .dgroup').forEach(g => { g.hidden = ![...g.querySelectorAll('.dl')].some(x => !x.hidden); });
  if (changed && r.startsWith('notifications/') && r !== 'notifications/settings') Notify.markRead([decodeURIComponent(r.slice(14))]);
  document.body.classList.toggle('no-tabs', !ROUTES.some(x => x[0] === r));
  document.body.classList.toggle('in-thread', /^chat\/(group|[0-9a-f-]{36})$/.test(r));
  let html = '';
  try {
    Account.load();
    html = Account.banner() + (r === 'home' ? (() => { try { return __M_src_features_requests_js.Roles.banner(); } catch (e) { return ''; } })() : '') + (Views[r] ? Views[r](s) : r.startsWith('chat/') ? __M_src_features_chat_index_js.Chat.threadView(s, r.slice(5)) : r.startsWith('notifications/') ? Views.notificationDetail(s, r) : Views.settings(s, r));
  } catch (e) {
    console.error(e);
    html = '<div class="card">' + emptyState('lost', 'This page could not open', 'Your records are safe. Go back, or close the app and open it again.', '<a class="btn pri" href="#/home">Go to Home</a>') + '</div>';
  }
  if (viewEl && html !== painted) {
    const y = changed ? 0 : window.scrollY;
    const ae = document.activeElement;
    const keep = ae && ae.id && viewEl.contains(ae) && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.type !== 'file';
    const keepId = keep ? ae.id : '', keepVal = keep ? ae.value : '';
    /* same page, new numbers: swap the content without replaying entrance animations (that was the blinking) */
    viewEl.classList.toggle('quiet', !changed);
    viewEl.innerHTML = html;
    painted = html;
    if (y) window.scrollTo(0, y);
    if (keepId) {
      const again = document.getElementById(keepId);
      if (again && again.type !== 'file') {
        again.value = keepVal;
        try { again.focus({ preventScroll: true }); } catch (e) {}
      }
    }
  } else painted = html;
  try { Notify.paintBell(s, r); } catch (e) {}
  try { __M_src_features_chat_index_js.Chat.paintBadge(); } catch (e) {}
}

return { get renderPage() { return renderPage; }, };
})();

/* ---- src/lib/image.js ---- */
const __M_src_lib_image_js = (function () {

const photoFrom = file => new Promise((ok, no) => {
  const finish = bmp => {
    try {
      const w = bmp.width, h = bmp.height;
      if (!w || !h) throw new Error('That picture is empty');
      const side = 360, n = Math.min(w, h);
      const c = document.createElement('canvas'); c.width = c.height = side;
      c.getContext('2d').drawImage(bmp, (w - n) / 2, (h - n) / 2, n, n, 0, 0, side, side);
      if (bmp.close) bmp.close();
      let q = 0.82, url = c.toDataURL('image/jpeg', q);
      while (url.length > 90000 && q > 0.45) { q -= 0.08; url = c.toDataURL('image/jpeg', q); }
      ok(url);
    } catch (e) { no(e instanceof Error ? e : new Error('Could not use that picture')); }
  };
  if (typeof createImageBitmap === 'function') {
    createImageBitmap(file).then(finish).catch(() => {
      const img = new Image(), u = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(u); finish(img); };
      img.onerror = () => { URL.revokeObjectURL(u); no(new Error('That file is not a picture. Try a JPG or PNG.')); };
      img.src = u;
    });
    return;
  }
  const img = new Image(), u = URL.createObjectURL(file);
  img.onload = () => { URL.revokeObjectURL(u); finish(img); };
  img.onerror = () => { URL.revokeObjectURL(u); no(new Error('That file is not a picture. Try a JPG or PNG.')); };
  img.src = u;
});

return { get photoFrom() { return photoFrom; }, };
})();

/* ---- src/main.js ---- */
const __M_src_main_js = (function () {
const { CONFIG } = __M_src_config_js;
const { A11y } = __M_src_core_a11y_js;
const { Auth } = __M_src_core_auth_js;
const { Me } = __M_src_core_me_js;
const { renderPage } = __M_src_core_render_js;
const { bindRender, render } = __M_src_core_rerender_js;
const { bindChangeHandler } = __M_src_core_hooks_js;
const { Session } = __M_src_core_session_js;
const { Store } = __M_src_core_store_js;
const { Actions } = __M_src_features_index_js;
const { Notify } = __M_src_features_notifications_notify_js;
const { $ } = __M_src_lib_dom_js;
const { Help } = __M_src_lib_help_js;
const { photoFrom } = __M_src_lib_image_js;
const { Menu } = __M_src_ui_menu_js;
const { Modal } = __M_src_ui_modal_js;
const { Nav } = __M_src_ui_nav_js;
const { toast } = __M_src_ui_toast_js;
const { Gate, OB, LG_ALL, lgMatches } = __M_src_features_auth_gate_js;
/* Start-up. Everything else is imported; this file only wires the pieces together, in the original order. */

bindRender(renderPage);
bindChangeHandler((a, b) => Notify.fromChange(a, b));
Nav.init();
document.addEventListener('pointerdown', () => { __M_src_ui_toast_js.Sfx.unlock(); }, { capture: true, once: true });

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !e.target) return;
  if (e.target.id === 'gateEmail') Actions.gateSend();
  else if (e.target.id === 'gateId' || (e.target.id === 'gatePw' && Gate.mode === 'in')) Actions.gateSignIn();
});


document.addEventListener('input', e => { if (e.target && e.target.id === 'helpQ') Help.filter(e.target.value); });
document.addEventListener('input', e => {
  if (!e.target || e.target.id !== 'lgSearch') return;
  OB.langQ = e.target.value;
  const code = OB.langPick || OB.chosen();
  const shown = LG_ALL.filter(l => lgMatches(l, OB.langQ)).sort((a, b) => a.name.localeCompare(b.name));
  const ul = document.getElementById('lgAll');
  const empty = document.getElementById('lgEmpty');
  if (ul) ul.innerHTML = shown.map(l => OB.langOption(l, 'sheet', code)).join('');
  if (empty) empty.hidden = shown.length > 0;
});
document.addEventListener('input', e => {
  if (!e.target) return;
  if (e.target.id === 'gateId') Gate.id = e.target.value;
  if (e.target.id === 'gatePw' && Gate.mode === 'in') Gate.signPw = e.target.value;
  if (e.target.id === 'gateEmail') Gate.email = e.target.value;
});

document.addEventListener('toggle', e => { const el = e.target; if (el && el.classList && el.classList.contains('hart')) Help.open[el.dataset.id] = el.open; }, true);


document.addEventListener('input', e => {
  if (e.target && e.target.id === 'notifQ') { Notify.q = e.target.value; const el = document.getElementById('notifList'); if (el) el.innerHTML = Notify.listHTML(Store.get()); }
});


document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.dataset.act === 'pickPhoto') {
    const input = document.getElementById('mePhoto');
    if (input) { input.value = ''; input.click(); }
    return;
  }
  const a = Actions[el.dataset.act]; if (!a) return;
  /* a real link (WhatsApp, a chat thread) must still open: the action runs alongside it */
  const realLink = el.tagName === 'A' && el.getAttribute('href');
  if (!realLink) e.preventDefault();
  const fn = typeof a === 'function' ? a : a.run, needsAdmin = typeof a === 'object' && a.admin;
  if (needsAdmin && !Auth.isAdmin()) return toast('Only the treasurer can do that');
  try { fn.call(a, el.dataset); } catch (err) { toast(err.message); }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.querySelector('#modalRoot .veil:not(.locked)') && !document.querySelector('#popRoot .pop-veil')) Modal.close(); });
/* drag a bottom sheet down to dismiss it, like a phone app. Locked sheets (approvals, offers) cannot be dragged away. */
(() => {
  let sh = null, y0 = 0, t0 = 0, dy = 0, armed = false, scroller = null;
  const shut = () => { const R = __M_src_features_requests_js; if (R.Sheet && R.Sheet.isOpen()) R.Sheet.close(); else Modal.close(); };
  document.addEventListener('touchstart', e => {
    const el = e.target.closest && e.target.closest('#modalRoot .veil:not(.locked) .sheet');
    if (!el || e.touches.length !== 1 || matchMedia('(min-width: 720px)').matches) return;
    if (e.target.closest('input, textarea, select, canvas, .lg-list')) return;   /* typing, signing and picking are never a swipe */
    const r = el.getBoundingClientRect(), top = e.touches[0].clientY - r.top < 64;
    scroller = el; sh = el; armed = top || el.scrollTop <= 0; y0 = e.touches[0].clientY; t0 = Date.now(); dy = 0;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!sh || !armed) return;
    dy = e.touches[0].clientY - y0;
    if (dy <= 0 || scroller.scrollTop > 0) { if (dy < 0) armed = scroller.scrollTop <= 0; sh.style.transform = ''; return; }
    sh.style.transition = 'none'; sh.style.transform = `translateY(${dy}px)`;
    const v = sh.closest('.veil'); if (v) v.style.background = `rgba(5, 10, 8, ${Math.max(0, .42 - dy / 900)})`;
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!sh) return;
    const el = sh, d = dy, fast = d > 50 && d / Math.max(1, Date.now() - t0) > 0.6; sh = null;
    const v = el.closest('.veil');
    if (d > 110 || fast) { el.style.transition = 'transform .2s ease'; el.style.transform = 'translateY(100%)'; setTimeout(shut, 180); return; }
    el.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; if (v) v.style.background = '';
    setTimeout(() => { el.style.transition = ''; }, 240);
  }, { passive: true });
})();
document.addEventListener('click', e => { if (e.target && e.target.classList && e.target.classList.contains('veil') && !e.target.classList.contains('locked')) Modal.close(); });
addEventListener('scroll', () => { const h = document.getElementById('top'); if (h) h.classList.toggle('scrolled', window.scrollY > 4); }, { passive: true });

/* Menu buttons stay inside the drawer until a real screen is opened. */

$('#menuBtn').addEventListener('click', () => ($('#drawer').hidden ? Menu.open() : Menu.close()));

$('#shade').addEventListener('click', () => Menu.close());

document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#drawer').classList.contains('open') && Menu.back) Menu.back(); });

A11y.load();

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => A11y.apply());

document.addEventListener('change', async e => {
  if (e.target.id !== 'mePhoto' || !e.target.files[0]) return;
  try {
    const url = await photoFrom(e.target.files[0]);
    await Session.savePhoto(url);
    toast('Photo saved'); render();
  } catch (err) { toast(err.message); }
});

addEventListener('hashchange', () => { if (window.speechSynthesis) speechSynthesis.cancel(); });

window.addEventListener('hashchange', render);

const drawerX = document.getElementById('drawerX');
if (drawerX) drawerX.addEventListener('click', () => Menu.close());

Store.subscribe(render);


/* Paste a code straight into the boxes, from anywhere on the code screen */
document.addEventListener('paste', e => {
  const inp = document.getElementById('otpIn'); if (!inp || inp.disabled) return;
  const text = (e.clipboardData || window.clipboardData || { getData: () => '' }).getData('text') || '';
  const digits = text.replace(/\D/g, ''); if (!digits) return;
  e.preventDefault();
  inp.value = digits.slice(0, inp.maxLength > 0 ? inp.maxLength : 6);
  inp.dispatchEvent(new Event('input', { bubbles: true }));
});

/* Coming back to the app (for example after opening the sign-in link elsewhere) picks up the sign-in */
addEventListener('focus', () => Session.recheck());
addEventListener('resize', () => { try { __M_src_features_auth_gate_js.Otp.fit(); } catch (e) {} });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') Session.recheck(); });

Welcome.bind(Session);
Session.boot();
showFlash();

addEventListener('offline', () => Store.setSync('offline'));

addEventListener('online', () => { if (!CONFIG.supabase) Store.setSync('online'); });

if (!navigator.onLine) Store.setSync('offline');

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

return { };
})();

/* ---- entry ---- */


/* loan advisor: while the treasurer types a new loan, show what this member can likely carry */
document.addEventListener('change', e => { if (e.target && e.target.name === 'memberId' && document.getElementById('loanAdvice')) loanAdvice(); });
document.addEventListener('input', e => { if (e.target && (e.target.name === 'principal' || e.target.name === 'months' || e.target.name === 'rate') && document.getElementById('loanAdvice')) loanAdvice(); });
function loanAdvice() {
  const box = document.getElementById('loanAdvice'), f = box && box.closest('form'); if (!f) return;
  const s = __M_src_core_store_js.Store.get(), D = __M_src_core_domain_js.Domain, SM = __M_src_features_smart_js.Smart, k = __M_src_core_utils_js.kes, e = __M_src_core_utils_js.esc;
  const mid = (f.querySelector('[name=memberId]') || {}).value, amt = Number((f.querySelector('[name=principal]') || {}).value) || 0, rate = Number((f.querySelector('[name=rate]') || {}).value) || 0, months = Math.max(1, Number((f.querySelector('[name=months]') || {}).value) || 1);
  if (!mid) { box.innerHTML = ''; return; }
  const lim = SM.loanLimit(s, mid), r = SM.risk(s, mid), rel = D.reliability(s, mid), total = amt * (1 + rate / 100 * months), inst = total / months;
  const over = amt > lim && amt > 0;
  box.className = 'advice' + (over || r.level === 'high' ? ' warn' : '');
  box.innerHTML = `<b>Suggested limit ${e(k(lim))}</b><span>Saved ${e(k(D.memberSaved(s, mid)))} · ${rel == null ? 'no history yet' : rel + '% on time'} · owes ${e(k(D.memberLoanBalance(s, mid)))}${r.level !== 'low' ? ' · ' + (r.level === 'high' ? 'high risk' : 'worth watching') : ''}</span>${amt ? `<span>Repays ${e(k(total))} in total, about ${e(k(inst))} a month${over ? '. This is above the suggested limit.' : '.'}</span>` : ''}`;
}

/* tap a profile photo to see it large; tap again, swipe down or press Escape to close */
document.addEventListener('click', e => {
  const img = e.target && e.target.closest && e.target.closest('img.av');
  if (!img || img.closest('#nav, #drawer, header') || !/^data:image\/jpeg;base64,/.test(img.getAttribute('src') || '')) return;
  e.preventDefault(); e.stopPropagation();
  let root = document.getElementById('photoRoot'); if (!root) { root = document.createElement('div'); root.id = 'photoRoot'; document.body.appendChild(root); }
  const r = img.getBoundingClientRect();
  root.innerHTML = '<div class="pv" role="dialog" aria-modal="true" aria-label="' + __M_src_core_utils_js.esc(img.alt || 'Photo') + '"><img src="' + img.getAttribute('src') + '" alt=""><p>' + __M_src_core_utils_js.esc(img.dataset.name || '') + '</p><button type="button" class="pv-x" aria-label="Close">' + icon('close') + '</button></div>';
  const big = root.querySelector('img');
  big.style.setProperty('--fx', (r.left + r.width / 2 - innerWidth / 2) + 'px'); big.style.setProperty('--fy', (r.top + r.height / 2 - innerHeight / 2) + 'px'); big.style.setProperty('--fs', String(r.width / Math.min(innerWidth * 0.86, 420)));
  const close = () => { const v = root.querySelector('.pv'); if (!v) return; v.classList.add('out'); setTimeout(() => { root.innerHTML = ''; }, 220); document.removeEventListener('keydown', esc); };
  const esc = ev => { if (ev.key === 'Escape') close(); };
  document.addEventListener('keydown', esc);
  root.querySelector('.pv').addEventListener('click', close);
  let y0 = null; root.addEventListener('touchstart', ev => { y0 = ev.touches[0].clientY; }, { passive: true, once: true });
  root.addEventListener('touchend', ev => { if (y0 != null && ev.changedTouches[0].clientY - y0 > 80) close(); }, { passive: true, once: true });
}, true);
