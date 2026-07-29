/* =========================================================================
   Achraf Belghiti - Portfolio
   Interactions, navigation mobile et animations (JavaScript natif, 0 dependance)
   Chemin : ./js/script.js
   -----------------------------------------------------------------------
   Sommaire
     1.  Theme clair / sombre
     2.  Menu mobile plein ecran (ARIA, Echap, focus, blocage du scroll)
     3.  Navigation interne + lien actif
     4.  Reveal au defilement (IntersectionObserver + cascade)
     5.  Compteurs de statistiques
     6.  Filtres de la galerie Creations
     7.  Images : alternatives et chargement differe
     8.  Videos : une seule lecture a la fois
     9.  Bouton retour en haut
     10. Annee du pied de page
     11. Parallaxe du portrait (desktop uniquement)
     12. Curseur personnalise (souris fine uniquement)
   ========================================================================= */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var body = document.body;
  var THEME_KEY = "ab-theme";
  var MOBILE_MAX = 768;

  function safe(fn) {
    try { fn(); } catch (err) { /* aucune erreur ne doit bloquer la page */ }
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function mq(query) {
    try { return !!(window.matchMedia && window.matchMedia(query).matches); }
    catch (e) { return false; }
  }
  function prefersReduced() { return mq("(prefers-reduced-motion: reduce)"); }

  /* =====================================================================
     1. Theme clair / sombre
     ===================================================================== */
  function applyTheme(theme) {
    docEl.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", theme === "dark" ? "#05060f" : "#f4f5fb"); }
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark"
        ? "Activer le theme clair" : "Activer le theme sombre");
    }
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { stored = null; }
    applyTheme(stored || docEl.getAttribute("data-theme") || "light");

    var btn = document.getElementById("theme-toggle");
    if (!btn) { return; }
    btn.setAttribute("type", "button");
    btn.addEventListener("click", function () {
      var next = docEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* =====================================================================
     2. Menu mobile plein ecran
     ===================================================================== */
  var menu = null;
  var menuToggle = null;
  var menuOpen = false;
  var lockY = 0;
  var lastFocused = null;

  function focusables() {
    if (!menu) { return []; }
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0; }
    );
  }

  function lockScroll() {
    lockY = window.scrollY || window.pageYOffset || 0;
    body.style.top = (-lockY) + "px";
    docEl.classList.add("mnav-lock");
    body.classList.add("mnav-lock");
  }

  function unlockScroll() {
    docEl.classList.remove("mnav-lock");
    body.classList.remove("mnav-lock");
    body.style.top = "";
    /* on restaure la position exacte, sans defilement anime : pas de saut */
    var previous = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";
    window.scrollTo(0, lockY);
    docEl.style.scrollBehavior = previous;
  }

  function openMenu() {
    if (!menu || menuOpen) { return; }
    menuOpen = true;
    lastFocused = document.activeElement;
    lockScroll();
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Fermer le menu");
    }
    var closeBtn = menu.querySelector(".mnav-close");
    if (closeBtn) { window.setTimeout(function () { closeBtn.focus(); }, 60); }
  }

  function closeMenu(returnFocus) {
    if (!menu || !menuOpen) { return; }
    menuOpen = false;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
    unlockScroll();
    if (returnFocus !== false && lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  function initMobileMenu() {
    menu = document.getElementById("mobile-menu");
    menuToggle = document.getElementById("nav-toggle");
    if (!menu || !menuToggle) { return; }

    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("type", "button");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "mobile-menu");

    menuToggle.addEventListener("click", function () {
      if (menuOpen) { closeMenu(false); } else { openMenu(); }
    });

    var closeBtn = menu.querySelector(".mnav-close");
    if (closeBtn) { closeBtn.addEventListener("click", function () { closeMenu(); }); }

    var scrim = menu.querySelector(".mnav-scrim");
    if (scrim) { scrim.addEventListener("click", function () { closeMenu(); }); }

    /* fermeture automatique apres un clic sur un lien */
    menu.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (link) { closeMenu(false); }
    });

    document.addEventListener("keydown", function (event) {
      if (!menuOpen) { return; }
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") { return; }
      var items = focusables();
      if (!items.length) { return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_MAX) { closeMenu(false); }
    });
  }

  /* =====================================================================
     3. Navigation interne + lien actif
     ===================================================================== */
  function initSmoothScroll() {
    each(document.querySelectorAll('a[href^="#"]'), function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href");
        if (!id || id === "#") { return; }
        var target = document.querySelector(id);
        if (!target) { return; }
        event.preventDefault();
        /* si le menu est ouvert on le ferme d abord (le scroll est bloque) */
        if (menuOpen) { closeMenu(false); }
        window.setTimeout(function () {
          target.scrollIntoView({
            behavior: prefersReduced() ? "auto" : "smooth",
            block: "start"
          });
          if (history.replaceState) { history.replaceState(null, "", id); }
        }, menuOpen ? 0 : 10);
      });
    });
  }

  function initActiveLink() {
    if (!("IntersectionObserver" in window)) { return; }
    var sections = document.querySelectorAll("section[id]");
    if (!sections.length) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var hash = "#" + entry.target.getAttribute("id");
        each(document.querySelectorAll('.nav-links a[href^="#"], .mnav-item'), function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === hash);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    each(sections, function (section) { observer.observe(section); });
  }

  /* =====================================================================
     4. Reveal au defilement
     La classe .has-reveal est ajoutee ici : sans JS (ou en mode reduit),
     le CSS laisse tout visible. Aucun contenu ne peut disparaitre.
     ===================================================================== */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) { return; }
    if (!("IntersectionObserver" in window) || prefersReduced()) { return; }

    docEl.classList.add("has-reveal");

    /* cascade : 70 ms entre les elements d un meme groupe (max 350 ms) */
    each(document.querySelectorAll("[data-stagger]"), function (group) {
      var children = group.querySelectorAll(":scope > [data-reveal]");
      each(children, function (el, i) {
        el.style.setProperty("--rd", Math.min(i * 70, 350) + "ms");
      });
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });

    each(items, function (el) { observer.observe(el); });

    /* filet de securite : tout est visible au bout de 2,5 s */
    window.setTimeout(function () {
      each(document.querySelectorAll("[data-reveal]"), function (el) {
        el.classList.add("is-in");
      });
    }, 2500);
  }

  /* =====================================================================
     5. Compteurs de statistiques
     ===================================================================== */
  function countTo(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) { return; }
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced() || !window.requestAnimationFrame) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 900;
    var start = null;
    function step(now) {
      if (start === null) { start = now; }
      var p = Math.min((now - start) / duration, 1);
      /* ease-out */
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) { window.requestAnimationFrame(step); }
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var values = document.querySelectorAll("[data-count]");
    if (!values.length) { return; }
    if (!("IntersectionObserver" in window)) {
      each(values, countTo);
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        countTo(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    each(values, function (el) { observer.observe(el); });
  }

  /* =====================================================================
     6. Filtres de la galerie Creations
     ===================================================================== */
  function initFilters() {
    var buttons = document.querySelectorAll(".cr-filter");
    if (!buttons.length) { return; }
    var tiles = document.querySelectorAll(".cr-tile");
    var blocks = document.querySelectorAll(".cr-block");

    function apply(cat) {
      each(tiles, function (tile) {
        var tileCat = tile.getAttribute("data-cat") || "";
        var show = (cat === "all") || (tileCat === cat);
        tile.classList.toggle("is-filtered", !show);
      });

      each(blocks, function (block) {
        var kind = block.getAttribute("data-block");
        var show;
        if (kind === "videos") {
          show = (cat === "all" || cat === "videos");
        } else {
          show = (cat !== "videos") &&
            block.querySelectorAll(".cr-tile:not(.is-filtered)").length > 0;
        }
        block.classList.toggle("is-filtered", !show);
      });

      each(buttons, function (btn) {
        btn.setAttribute("aria-pressed",
          btn.getAttribute("data-filter") === cat ? "true" : "false");
      });
    }

    each(buttons, function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-filter") || "all");
      });
    });

    apply("all");
  }

  /* =====================================================================
     7. Images : alternatives et chargement differe
     ===================================================================== */
  function showFallback(img) {
    if (!img || img.dataset.fallbackDone === "1") { return; }
    img.dataset.fallbackDone = "1";
    var box = document.createElement("div");
    box.className = "img-fallback";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.getAttribute("alt") || "Image indisponible");
    box.textContent = "Image a ajouter : " + (img.getAttribute("src") || "");
    if (img.parentNode) { img.parentNode.replaceChild(box, img); }
  }

  function initImages() {
    each(document.querySelectorAll("img"), function (img, index) {
      if (!img.getAttribute("alt")) {
        img.setAttribute("alt", "Visuel du portfolio d Achraf Belghiti");
      }
      if (!img.getAttribute("decoding")) { img.setAttribute("decoding", "async"); }
      if (index > 1 && !img.getAttribute("loading")) { img.setAttribute("loading", "lazy"); }
      img.addEventListener("error", function () { showFallback(img); });
      if (img.complete && img.naturalWidth === 0) { showFallback(img); }
    });
  }

  /* =====================================================================
     8. Videos : une seule lecture a la fois
     ===================================================================== */
  function initVideos() {
    var videos = document.querySelectorAll("video");
    if (!videos.length) { return; }
    var failed = 0;

    function markFailed(video) {
      if (video.dataset.failed === "1") { return; }
      video.dataset.failed = "1";
      var card = video.parentNode;
      if (card && card.style) { card.style.display = "none"; }
      failed++;
      if (failed >= videos.length) {
        var block = video.closest ? video.closest(".cr-block") : null;
        if (block) { block.style.display = "none"; }
      }
    }

    each(videos, function (video) {
      video.setAttribute("playsinline", "");
      video.addEventListener("error", function () { markFailed(video); });
      if (video.error || video.networkState === 3) { markFailed(video); }
      window.setTimeout(function () {
        if (video.error || video.networkState === 3) { markFailed(video); }
      }, 2500);
      video.addEventListener("play", function () {
        each(videos, function (other) {
          if (other !== video && !other.paused) { other.pause(); }
        });
      });
    });
  }

  /* =====================================================================
     9. Bouton retour en haut
     ===================================================================== */
  function initToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Revenir en haut de la page");
    btn.innerHTML = "&uarr;";
    body.appendChild(btn);

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    });

    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =====================================================================
     10. Annee du pied de page
     ===================================================================== */
  function initYear() {
    var slot = document.querySelector("[data-year]");
    if (slot) { slot.textContent = String(new Date().getFullYear()); }
  }

  /* =====================================================================
     11. Parallaxe du portrait (desktop uniquement)
     Sur mobile la photo doit rester parfaitement cadree : pas de parallaxe.
     ===================================================================== */
  function initParallax() {
    if (prefersReduced() || !window.requestAnimationFrame) { return; }
    if (window.innerWidth <= MOBILE_MAX || !mq("(hover: hover) and (pointer: fine)")) { return; }

    var img = document.querySelector('img[src*="portrait"]');
    if (!img) { return; }
    var frame = img.parentNode;
    if (frame && frame.classList) { frame.classList.add("parallax-frame"); }
    img.classList.add("parallax-media");

    var amplitude = 26;
    var target = 0;
    var current = 0;
    var running = false;

    function measure() {
      var rect = img.getBoundingClientRect();
      var vh = window.innerHeight || docEl.clientHeight || 1;
      var span = vh / 2 + rect.height / 2;
      var ratio = span ? (rect.top + rect.height / 2 - vh / 2) / span : 0;
      if (ratio > 1) { ratio = 1; }
      if (ratio < -1) { ratio = -1; }
      target = ratio * amplitude;
    }

    function render() {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.08) { current = target; }
      img.style.transform = "scale(1.14) translate3d(0, " + current.toFixed(2) + "px, 0)";
      if (current !== target) { window.requestAnimationFrame(render); } else { running = false; }
    }

    function onMove() {
      measure();
      if (!running) { running = true; window.requestAnimationFrame(render); }
    }

    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    if (img.complete) { onMove(); } else { img.addEventListener("load", onMove); }
  }

  /* =====================================================================
     12. Curseur personnalise (souris fine uniquement, jamais sur mobile)
     ===================================================================== */
  function initCursor() {
    if (!window.requestAnimationFrame || !body) { return; }
    if (!mq("(hover: hover) and (pointer: fine)") || prefersReduced()) { return; }

    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    var TRAIL = 6;
    var trail = [];
    var i, node;
    for (i = 0; i < TRAIL; i++) {
      node = document.createElement("div");
      node.className = "cursor-trail";
      node.setAttribute("aria-hidden", "true");
      body.appendChild(node);
      trail.push({ el: node, x: 0, y: 0 });
    }
    body.appendChild(ring);
    body.appendChild(dot);
    docEl.classList.add("has-custom-cursor");

    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var dx = mx, dy = my, rx = mx, ry = my;
    var started = false;
    var INTERACTIVE = 'a, button, [role="button"], summary, label, input, textarea, select, img, video, .cr-tile, .proj-card';

    document.addEventListener("mousemove", function (ev) {
      mx = ev.clientX;
      my = ev.clientY;
      if (!started) {
        started = true;
        dx = rx = mx;
        dy = ry = my;
        for (var k = 0; k < trail.length; k++) { trail[k].x = mx; trail[k].y = my; }
        docEl.classList.add("cursor-visible");
      }
      var over = ev.target && ev.target.closest ? ev.target.closest(INTERACTIVE) : null;
      docEl.classList.toggle("cursor-hover", !!over);
    }, { passive: true });

    document.addEventListener("mouseleave", function () { docEl.classList.remove("cursor-visible"); });
    document.addEventListener("mouseenter", function () { if (started) { docEl.classList.add("cursor-visible"); } });
    document.addEventListener("mousedown", function () { docEl.classList.add("cursor-down"); });
    document.addEventListener("mouseup", function () { docEl.classList.remove("cursor-down"); });
    window.addEventListener("blur", function () { docEl.classList.remove("cursor-down"); });

    function frame() {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px,0)";
      ring.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
      var px = dx, py = dy, k, p, s;
      for (k = 0; k < trail.length; k++) {
        p = trail[k];
        p.x += (px - p.x) * 0.32;
        p.y += (py - p.y) * 0.32;
        s = 1 - (k + 1) / (trail.length + 1);
        p.el.style.transform = "translate3d(" + p.x.toFixed(2) + "px," + p.y.toFixed(2) + "px,0) scale(" + s.toFixed(3) + ")";
        p.el.style.opacity = started ? (0.30 * s).toFixed(3) : "0";
        px = p.x;
        py = p.y;
      }
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* =====================================================================
     Initialisation
     ===================================================================== */
  function init() {
    body = document.body;
    safe(initTheme);
    safe(initMobileMenu);
    safe(initSmoothScroll);
    safe(initActiveLink);
    safe(initFilters);
    safe(initReveal);
    safe(initCounters);
    safe(initImages);
    safe(initVideos);
    safe(initToTop);
    safe(initYear);
    safe(initParallax);
    safe(initCursor);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
