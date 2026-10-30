const V = 'mca-app-v24';
const SHELL = ['./', './index.html', './manifest.json', './icons/logo-192.png', './icons/logo-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('supabase.co')) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') caches.open(V).then(x => x.put(e.request, r.clone())); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
