/* My Chama service worker. Change V on every release. */
const V = 'mca-app-v74';
const OCR = 'mca-ocr-v1';   /* kept across releases; change only when vendor/tesseract changes */
const SHELL = ['./', './index.html', './manifest.json', './assets/app.css?v=0.16.0', './assets/boot.js?v=0.16.0', './assets/splash.js?v=0.16.0',
  './assets/languages.js?v=0.16.0', './assets/app.js?v=0.16.0', './vendor/supabase-2.45.4.js', './icons/icon.svg', './icons/logo-192.png',
  './legal/privacy.html', './legal/terms.html', './legal/legal.css', './assets/fonts/inter-var.woff2', './assets/fonts/jakarta-var.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V && x !== OCR).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== self.location.origin) return;   /* the database and sign-in are never cached */
  if (req.mode === 'navigate') {
    /* pages: always try the network first, so a new release shows at once; offline falls back to the saved app */
    e.respondWith(fetch(req).then(r => { if (r.ok && u.pathname.endsWith('/') ) caches.open(V).then(c => c.put('./index.html', r.clone())); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(m => m || caches.match('./index.html'))));
    return;
  }
  /* the screenshot reader (several MB) never changes at a given path: keep it once, never re-download it in the background */
  if (u.pathname.includes('/vendor/tesseract/')) {
    e.respondWith(caches.open(OCR).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  /* files: serve the saved copy straight away and refresh it in the background */
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) caches.open(V).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
