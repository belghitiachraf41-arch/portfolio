/* ================================================================
   lightbox.js — Visionneuse plein ecran + effets de survol
   ----------------------------------------------------------------
   Cible les images et les videos de la section Creations :
   - effet de survol (zoom doux, voile degrade, loupe, legende)
   - clic pour agrandir dans une visionneuse plein ecran
   - navigation precedent / suivant, clavier (fleches, Echap),
     fermeture au clic sur le fond, balayage tactile
   100 % statique : aucune dependance, aucun serveur.
   ================================================================ */
(function () {
  'use strict';

  if (window.__lbLoaded) { return; }
  window.__lbLoaded = true;

  var SCOPE = '#creations';
  var items = [];
  var index = -1;
  var overlay, stage, capEl, countEl, lastFocus, scrollLock = '';
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var ICON_ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5l8 4.5-8 4.5z" fill="currentColor" stroke="none"/></svg>';
  var ICON_EXPAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5l-7 7 7 7"/></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5l7 7-7 7"/></svg>';

  var CSS = [
    /* ---- vignettes ---- */
    '.lb-tile{position:relative;overflow:hidden;isolation:isolate}',
    '.lb-tile.lb-img{cursor:zoom-in}',
    '.lb-tile .lb-media{transition:transform .55s cubic-bezier(.2,.7,.2,1),filter .45s ease;backface-visibility:hidden}',
    '.lb-tile.lb-img:hover .lb-media,.lb-tile.lb-img:focus-visible .lb-media{transform:scale(1.07);filter:brightness(.8)}',
    '.lb-tile.lb-img::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0;',
    'transition:opacity .35s ease;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%)}',
    '.lb-tile.lb-img:hover::after,.lb-tile.lb-img:focus-visible::after{opacity:1}',
    '.lb-tile:focus-visible{outline:2px solid var(--accent,#e2725b);outline-offset:3px}',
    '.lb-badge{position:absolute;top:50%;left:50%;width:52px;height:52px;border-radius:50%;z-index:2;',
    'display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.94);color:#111;',
    'pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(.82);',
    'transition:opacity .3s ease,transform .3s ease;box-shadow:0 6px 18px rgba(0,0,0,.28)}',
    '.lb-tile:hover .lb-badge,.lb-tile:focus-visible .lb-badge{opacity:1;transform:translate(-50%,-50%) scale(1)}',
    '.lb-badge svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.lb-cap{position:absolute;left:12px;right:12px;bottom:12px;z-index:2;color:#fff;font-size:12px;line-height:1.35;',
    'pointer-events:none;opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease;',
    'text-shadow:0 1px 4px rgba(0,0,0,.7)}',
    '.lb-tile:hover .lb-cap,.lb-tile:focus-visible .lb-cap{opacity:1;transform:none}',
    /* ---- vignettes video ---- */
    '.lb-tile.lb-vid{border-radius:14px;transition:box-shadow .3s ease,transform .3s ease}',
    '.lb-tile.lb-vid:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(0,0,0,.34)}',
    '.lb-expand{position:absolute;top:10px;right:10px;z-index:3;display:inline-flex;align-items:center;gap:6px;',
    'background:rgba(12,12,16,.74);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:999px;',
    'padding:6px 11px;font:600 11.5px/1 inherit;cursor:zoom-in;opacity:0;transform:translateY(-5px);',
    'transition:opacity .3s ease,transform .3s ease,background .2s ease}',
    '.lb-tile:hover .lb-expand,.lb-expand:focus-visible{opacity:1;transform:none}',
    '.lb-expand:hover{background:var(--accent,#e2725b)}',
    '.lb-expand svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}',
    /* ---- visionneuse ---- */
    '.lb-overlay{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;',
    'padding:clamp(14px,4vw,48px);background:rgba(6,6,10,.93);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '.lb-overlay.lb-open{display:flex}',
    '.lb-fig{margin:0;display:flex;flex-direction:column;align-items:center;gap:14px;max-width:100%;max-height:100%}',
    '.lb-stage{display:flex;align-items:center;justify-content:center;animation:lb-in .3s ease}',
    '.lb-stage img,.lb-stage video{display:block;max-width:min(92vw,1400px);max-height:76vh;border-radius:12px;',
    'box-shadow:0 26px 70px rgba(0,0,0,.62);background:#000}',
    '.lb-figcap{color:#f4f4f5;font-size:13.5px;line-height:1.5;text-align:center;max-width:min(92vw,760px);opacity:.92}',
    '.lb-count{color:#fff;opacity:.55;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase}',
    '.lb-btn{position:absolute;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
    'background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.24);cursor:pointer;',
    'transition:background .2s ease,transform .2s ease}',
    '.lb-btn:hover{background:rgba(255,255,255,.22);transform:scale(1.07)}',
    '.lb-btn svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.lb-close{top:18px;right:18px}',
    '.lb-prev{left:18px;top:50%;margin-top:-23px}',
    '.lb-next{right:18px;top:50%;margin-top:-23px}',
    '@keyframes lb-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}',
    '@media (max-width:600px){.lb-btn{width:38px;height:38px}.lb-prev{left:6px}.lb-next{right:6px}',
    '.lb-stage img,.lb-stage video{max-height:66vh}.lb-cap{display:none}}',
    '@media (prefers-reduced-motion:reduce){.lb-tile .lb-media,.lb-tile.lb-vid,.lb-badge,.lb-cap,.lb-expand,.lb-btn{transition:none}',
    '.lb-tile.lb-img:hover .lb-media{transform:none}.lb-stage{animation:none}}'
  ].join('');

  /* ============================================================
     1) PREPARATION DES VIGNETTES
     ============================================================ */

  function mediaSrc(el) {
    var s = el.getAttribute('src');
    if (!s) {
      var src = el.querySelector('source');
      s = src ? src.getAttribute('src') : '';
    }
    return s || '';
  }

  function captionOf(el, isVideo, i) {
    var t = el.getAttribute('alt') || el.getAttribute('title') || el.getAttribute('aria-label') || '';
    if (!t && isVideo) { t = 'Video ' + i; }
    return String(t).replace(/\s+/g, ' ').trim();
  }

  function buildItems() {
    var scope = document.querySelector(SCOPE);
    if (!scope) { return; }
    var medias = scope.querySelectorAll('img, video');
    var videoCount = 0;

    for (var i = 0; i < medias.length; i++) {
      (function (media) {
        var isVideo = media.tagName === 'VIDEO';
        var src = mediaSrc(media);
        if (!src) { return; }
        if (isVideo) { videoCount++; }

        var tile = media.parentElement;
        if (!tile || tile === scope) { return; }

        var caption = captionOf(media, isVideo, videoCount);
        var idx = items.length;
        items.push({ type: isVideo ? 'video' : 'image', src: src, caption: caption, el: media });

        media.classList.add('lb-media');
        /* on reprend l'arrondi du media pour que le zoom reste dans le cadre */
        try {
          var br = window.getComputedStyle(media).borderRadius;
          if (br && br !== '0px' && !tile.style.borderRadius) { tile.style.borderRadius = br; }
        } catch (errR) {}
        tile.classList.add('lb-tile');
        tile.classList.add(isVideo ? 'lb-vid' : 'lb-img');

        var badge = document.createElement('span');
        badge.className = 'lb-badge';
        badge.innerHTML = isVideo ? ICON_PLAY : ICON_ZOOM;
        tile.appendChild(badge);

        if (isVideo) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'lb-expand';
          btn.innerHTML = ICON_EXPAND + '<span>Agrandir</span>';
          btn.setAttribute('aria-label', 'Agrandir la video');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            open(idx);
          });
          tile.appendChild(btn);
          /* clic sur la video : on agrandit, sauf sur la barre de controles */
          media.addEventListener('click', function (e) {
            var r = media.getBoundingClientRect();
            if (e.clientY > r.bottom - 52) { return; }
            e.preventDefault();
            open(idx);
          });
        } else {
          if (caption) {
            var cap = document.createElement('span');
            cap.className = 'lb-cap';
            cap.textContent = caption;
            tile.appendChild(cap);
          }
          tile.setAttribute('role', 'button');
          tile.setAttribute('tabindex', '0');
          tile.setAttribute('aria-label', 'Agrandir : ' + (caption || 'image'));
          tile.addEventListener('click', function () { open(idx); });
          tile.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              open(idx);
            }
          });
        }
      })(medias[i]);
    }
  }

  /* ============================================================
     2) VISIONNEUSE
     ============================================================ */

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Visionneuse');
    overlay.innerHTML =
      '<button type="button" class="lb-btn lb-close" aria-label="Fermer">' + ICON_CLOSE + '</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Precedent">' + ICON_PREV + '</button>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Suivant">' + ICON_NEXT + '</button>' +
      '<figure class="lb-fig">' +
        '<div class="lb-stage"></div>' +
        '<figcaption class="lb-figcap"></figcaption>' +
        '<div class="lb-count"></div>' +
      '</figure>';
    document.body.appendChild(overlay);

    stage = overlay.querySelector('.lb-stage');
    capEl = overlay.querySelector('.lb-figcap');
    countEl = overlay.querySelector('.lb-count');

    overlay.querySelector('.lb-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    overlay.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lb-fig')) { close(); }
    });

    /* balayage tactile */
    var x0 = null;
    overlay.addEventListener('touchstart', function (e) {
      x0 = e.touches && e.touches.length ? e.touches[0].clientX : null;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (x0 === null || !e.changedTouches || !e.changedTouches.length) { return; }
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 55) { step(dx < 0 ? 1 : -1); }
    });
  }

  function render() {
    var it = items[index];
    if (!it) { return; }
    stage.innerHTML = '';
    var node;
    if (it.type === 'video') {
      node = document.createElement('video');
      node.src = it.src;
      node.controls = true;
      node.autoplay = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('preload', 'metadata');
      var t = 0;
      try { t = it.el.currentTime || 0; } catch (err) { t = 0; }
      if (t > 0.3) {
        node.addEventListener('loadedmetadata', function () {
          try { node.currentTime = t; } catch (err2) {}
        });
      }
      try { it.el.pause(); } catch (err3) {}
    } else {
      node = document.createElement('img');
      node.src = it.src;
      node.alt = it.caption;
      node.setAttribute('decoding', 'async');
    }
    stage.appendChild(node);
    capEl.textContent = it.caption;
    countEl.textContent = (index + 1) + ' / ' + items.length;

    /* prechargement des voisins */
    [items[index + 1], items[index - 1]].forEach(function (n) {
      if (n && n.type === 'image') { var p = new Image(); p.src = n.src; }
    });
  }

  function step(dir) {
    if (!items.length) { return; }
    index = (index + dir + items.length) % items.length;
    render();
  }

  function open(i) {
    if (!items[i]) { return; }
    lastFocus = document.activeElement;
    index = i;
    render();
    overlay.classList.add('lb-open');
    scrollLock = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    var btn = overlay.querySelector('.lb-close');
    if (btn) { btn.focus(); }
  }

  function close() {
    if (!overlay.classList.contains('lb-open')) { return; }
    overlay.classList.remove('lb-open');
    stage.innerHTML = '';
    document.documentElement.style.overflow = scrollLock;
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  function onKey(e) {
    if (!overlay || !overlay.classList.contains('lb-open')) { return; }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  }

  function init() {
    var scope = document.querySelector(SCOPE);
    if (!scope) { return; }
    var style = document.createElement('style');
    style.id = 'lb-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    buildItems();
    if (!items.length) { return; }
    buildOverlay();
    document.addEventListener('keydown', onKey);
    if (items.length < 2) {
      overlay.querySelector('.lb-prev').style.display = 'none';
      overlay.querySelector('.lb-next').style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
