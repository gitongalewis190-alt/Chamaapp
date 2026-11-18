/* Opening mark: drawn once per browser session, about 1.4 seconds, never blocks the app.
   Skipped for people who ask for less movement. Fires 'mca:splash-done' when it is gone. */
(function () {
  var sp = document.getElementById('splash');
  if (!sp) return;
  var done = false;
  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('mca-splash', '1'); } catch (e) {}
    sp.classList.add('gone');
    setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 600);
    document.dispatchEvent(new Event('mca:splash-done'));
  }
  var seen = false; try { seen = !!sessionStorage.getItem('mca-splash'); } catch (e) {}
  var calm = false;
  try { calm = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a-rm'); } catch (e) {}
  if (seen || calm) { sp.classList.add('gone'); finish(); return; }
  setTimeout(finish, 1500);
})();
