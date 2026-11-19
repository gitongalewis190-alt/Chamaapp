/* Runs before the first paint: applies the saved theme and text size so the page never flashes the wrong colours. */
(function () {
  var h = document.documentElement, d = {};
  try { d = JSON.parse(localStorage.getItem('chama:a11y') || '{}') || {}; } catch (e) { d = {}; }
  /* the person decides: Light, Dark, or follow the phone (the default until they choose) */
  var dark = d.theme === 'dark' || ((d.theme === 'auto' || !d.theme) && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  if (d.accent && /^(blue|purple|gold|rose|teal)$/.test(d.accent)) h.setAttribute('data-accent', d.accent);
  h.setAttribute('data-mode', dark ? 'dark' : 'light');
  h.setAttribute('data-size', d.size || 'n');
  ['hc', 'cb', 'ft', 'sp', 'ul', 'tg', 'rm', 'simple'].forEach(function (k) { if (d[k]) h.classList.add(k === 'hc' ? 'hc' : 'a-' + k); });
  try { var lang = localStorage.getItem('chama.lang'); if (lang && /^[a-z]{2,3}$/.test(lang)) h.lang = lang; } catch (e) {}
  /* an old email links to /#privacy: send it to the policy page */
  if (location.hash === '#privacy') location.replace('legal/privacy.html');
})();
