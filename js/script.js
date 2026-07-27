/* =========================================================================
   Achraf Belghiti - Portfolio
   Interactions et animations (JavaScript natif, sans dependance)
   Chemin : ./js/script.js
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'ab-theme';

  function safe(fn) {
    try { fn(); } catch (err) { /* aucune erreur ne doit bloquer la page */ }
  }

  /* ---------------------------------------------------------------------
     1. Theme clair / sombre
     --------------------------------------------------------------------- */
  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { stored = null; }
    var theme = stored || root.getAttribute('data-theme') || 'dark';
    applyTheme(theme);

    var btn = document.getElementById('theme-toggle');
    if (!btn) { return; }
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute('content', theme === 'dark' ? '#08080a' : '#fbfbfd'); }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Activer le theme clair' : 'Activer le theme sombre');
    }
  }

  /* ---------------------------------------------------------------------
     2. Menu mobile (hamburger)
     --------------------------------------------------------------------- */
  function initMobileMenu() {
    var nav = document.querySelector('nav');
    if (!nav) { return; }

    var links = document.getElementById('nav-links') || nav.querySelector('div');
    if (!links) { return; }
    links.classList.add('nav-links');
    if (!links.id) { links.id = 'nav-links'; }

    var toggle = document.getElementById('nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'nav-toggle';
      toggle.className = 'nav-toggle';
      toggle.setAttribute('type', 'button');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      toggle.setAttribute('aria-controls', links.id);
      toggle.innerHTML = '<span></span><span></span><span></span>';
      nav.appendChild(toggle);
    }
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) { closeMenu(links, toggle); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeMenu(links, toggle); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) { closeMenu(links, toggle); }
    });
  }

  function closeMenu(links, toggle) {
    links.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    }
  }

  /* ---------------------------------------------------------------------
     3. Navigation interne fluide + lien actif
     --------------------------------------------------------------------- */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    Array.prototype.forEach.call(anchors, function (link) {
      link.addEventListener('click', function (event) {
        var id = link.getAttribute('href');
        if (!id || id === '#') { return; }
        var target = document.querySelector(id);
        if (!target) { return; }
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (history.replaceState) { history.replaceState(null, '', id); }
      });
    });
  }

  function initActiveLink() {
    if (!('IntersectionObserver' in window)) { return; }
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var id = entry.target.getAttribute('id');
        var links = document.querySelectorAll('nav a[href^="#"]');
        Array.prototype.forEach.call(links, function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Array.prototype.forEach.call(sections, function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------------------------
     4. Animations d'apparition au defilement
     --------------------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('section > div, section > div > div, .edu-card, h1, h2');
    if (!('IntersectionObserver' in window)) { return; }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { return; }

    var items = [];
    Array.prototype.forEach.call(targets, function (el) {
      if (el.closest('nav')) { return; }
      if (el.getAttribute('data-no-reveal') !== null) { return; }
      el.classList.add('reveal');
      items.push(el);
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });

    // Securite : tout est visible apres 2,5 s meme si l'observateur echoue.
    window.setTimeout(function () {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }, 2500);
  }

  /* ---------------------------------------------------------------------
     5. Images : chargement differe et remplacement si fichier absent
     --------------------------------------------------------------------- */
  function initImages() {
    var images = document.querySelectorAll('img');
    Array.prototype.forEach.call(images, function (img, index) {
      if (!img.getAttribute('alt')) { img.setAttribute('alt', 'Visuel du portfolio d Achraf Belghiti'); }
      if (!img.getAttribute('decoding')) { img.setAttribute('decoding', 'async'); }
      if (index > 1 && !img.getAttribute('loading')) { img.setAttribute('loading', 'lazy'); }

      img.addEventListener('error', function () { showFallback(img); });
      // Image deja en erreur avant l initialisation du script :
      if (img.complete && img.naturalWidth === 0) { showFallback(img); }
    });
  }

  function showFallback(img) {
    if (!img || img.dataset.fallbackDone === '1') { return; }
    img.dataset.fallbackDone = '1';
    var box = document.createElement('div');
    box.className = 'img-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.getAttribute('alt') || 'Image indisponible');
    box.textContent = 'Image a ajouter : ' + (img.getAttribute('src') || '');
    if (img.parentNode) { img.parentNode.replaceChild(box, img); }
  }

  /* ---------------------------------------------------------------------
     6. Videos : une seule lecture a la fois
     --------------------------------------------------------------------- */
  function initVideos() {
    var videos = document.querySelectorAll('video');
    Array.prototype.forEach.call(videos, function (video) {
      video.setAttribute('playsinline', '');
      video.addEventListener('error', function () {
        var card = video.parentNode;
        if (card && card.style) { card.style.display = 'none'; }
      });
      video.addEventListener('play', function () {
        Array.prototype.forEach.call(videos, function (other) {
          if (other !== video && !other.paused) { other.pause(); }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     7. Bouton retour en haut
     --------------------------------------------------------------------- */
  function initToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Revenir en haut de la page');
    btn.innerHTML = '&uarr;';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var onScroll = function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------------
     8. Annee courante dans le pied de page
     --------------------------------------------------------------------- */
  function initYear() {
    var slot = document.querySelector('[data-year]');
    if (slot) { slot.textContent = String(new Date().getFullYear()); }
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function init() {
    safe(initTheme);
    safe(initMobileMenu);
    safe(initSmoothScroll);
    safe(initActiveLink);
    safe(initReveal);
    safe(initImages);
    safe(initVideos);
    safe(initToTop);
    safe(initYear);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
