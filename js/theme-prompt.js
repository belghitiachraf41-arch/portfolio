// =========================================================================
// Achraf Belghiti - Portfolio
// Invite "mode sombre" a la premiere visite (JavaScript natif, sans dependance)
// Chemin : ./js/theme-prompt.js
// =========================================================================
(function () {
  'use strict';
  var root = document.documentElement;
  var THEME_KEY = 'ab-theme';
  var ASK_KEY = 'ab-theme-ask';
  var DELAY = 900;
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    write(THEME_KEY, theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute('content', theme === 'dark' ? '#08080a' : '#fbfbfd'); }
    var btn = document.getElementById('theme-toggle');
    if (!btn) { return; }
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Activer le theme clair' : 'Activer le theme sombre');
  }
  function dismiss(overlay) {
    write(ASK_KEY, 'done');
    overlay.classList.remove('is-open');
    window.setTimeout(function () {
      if (overlay.parentNode) { overlay.parentNode.removeChild(overlay); }
    }, 340);
  }
  function markup() {
    var html = '';
    html += '<div class="tp-card" role="dialog" aria-modal="true" aria-labelledby="tp-title">';
    html += '<button type="button" class="tp-close" data-tp="light" aria-label="Fermer et rester en mode clair">&#215;</button>';
    html += '<span class="tp-icon" aria-hidden="true">&#9790;</span>';
    html += '<h2 class="tp-title" id="tp-title">Passer en mode sombre ?</h2>';
    html += '<p class="tp-text">Ce portfolio s&rsquo;ouvre en mode clair. Preferez-vous le mode sombre, plus confortable pour les yeux ?</p>';
    html += '<div class="tp-actions">';
    html += '<button type="button" class="tp-btn tp-btn-ghost" data-tp="light">Non, rester en clair</button>';
    html += '<button type="button" class="tp-btn tp-btn-primary" data-tp="dark">Oui, mode sombre</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }
  function ask() {
    if (!document.body || document.querySelector('.tp-overlay')) { return; }
    var overlay = document.createElement('div');
    overlay.className = 'tp-overlay';
    overlay.innerHTML = markup();
    document.body.appendChild(overlay);
    window.setTimeout(function () { overlay.classList.add('is-open'); }, 40);
    var primary = overlay.querySelector('.tp-btn-primary');
    if (primary) { primary.focus(); }
    overlay.addEventListener('click', function (event) {
      var hit = event.target.closest ? event.target.closest('[data-tp]') : null;
      if (hit) {
        applyTheme(hit.getAttribute('data-tp'));
        dismiss(overlay);
        return;
      }
      if (event.target === overlay) { dismiss(overlay); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') { return; }
      if (overlay.parentNode) { dismiss(overlay); }
    });
  }
  function init() {
    if (read(ASK_KEY)) { return; }
    applyTheme('light');
    window.setTimeout(ask, DELAY);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
