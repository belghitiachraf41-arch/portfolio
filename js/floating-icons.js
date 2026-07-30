/* =========================================================================
   Achraf Belghiti - Portfolio
   FloatingIcons - icones flottantes de l arriere-plan du hero
   Chemin : ./js/floating-icons.js (charge avec defer)
   -----------------------------------------------------------------------
   Composant autonome, sans framework (le site est 100 % statique) :

   - ICONS : tableau reutilisable, source unique de verite. Ajouter un
     fichier dans ./images/icons/ puis son nom ici suffit.
   - SLOTS : chaque emplacement decrit une position en % situee dans les
     marges du hero (jamais sur le nom, le titre, les boutons ni le
     portrait) ainsi que sa taille, son opacite, sa duree, son delai et
     sa profondeur de parallaxe.
   - Nombre affiche : 12 sur ordinateur, 9 sur tablette, 6 sur mobile.
   - Parallaxe : une seule boucle requestAnimationFrame, declenchee par le
     defilement, arretee des que le hero est passe, desactivee si
     prefers-reduced-motion.
   - Le survol et la proximite sont geres en CSS (zone elargie
     .fx-icon::after) pour ne rien calculer en JS a chaque mouvement.

   Balisage genere :
     <div class="fx-layer" aria-hidden="true">
       <span class="fx-icon"><span class="fx-orb"><img alt=""></span></span>
     </div>
   ========================================================================= */
(function () {
  "use strict";

  var BASE = "./images/icons/";

  /* --- 1. Les icones (un seul tableau, aucune duplication) -------------- */
  var ICONS = [
    "wordpress",
    "canva",
    "capcut",
    "linkedin",
    "pinterest",
    "facebook",
    "tiktok",
    "illustrator",
    "premiere",
    "github",
    "instagram"
  ];

  /* --- 2. Les emplacements --------------------------------------------- */
  /* x / y  : position en % dans le hero (uniquement les marges)
     size   : 32 | 40 | 48 | 56 | 64 (px)
     op     : opacite de repos (0.15 a 0.35)
     dur    : duree de l animation (s)   delay : decalage (s)
     rot    : rotation maximale (deg)    amp   : amplitude verticale (px)
     drift  : balancement horizontal (px)
     depth  : vitesse de parallaxe (0.08 = lent / 0.34 = rapide)
     dir    : sens de l animation (normal | reverse)
     Les 6 premiers servent au mobile, les 9 premiers a la tablette. */
  var SLOTS = [
    { x: 2.5,  y: 14,  size: 48, op: 0.26, dur: 18, delay: 0,   rot: 6, amp: 18, drift: 8,  depth: 0.18 },
    { x: 95.5, y: 30,  size: 40, op: 0.30, dur: 24, delay: 2,   rot: 5, amp: 22, drift: 6,  depth: 0.30, dir: "reverse" },
    { x: 3.5,  y: 62,  size: 64, op: 0.18, dur: 14, delay: 5,   rot: 7, amp: 14, drift: 10, depth: 0.10 },
    { x: 93.5, y: 82,  size: 32, op: 0.32, dur: 20, delay: 8,   rot: 8, amp: 26, drift: 5,  depth: 0.34 },
    { x: 1.5,  y: 88,  size: 56, op: 0.20, dur: 16, delay: 1.5, rot: 4, amp: 16, drift: 9,  depth: 0.14 },
    { x: 96.5, y: 8,   size: 48, op: 0.24, dur: 22, delay: 6,   rot: 6, amp: 20, drift: 7,  depth: 0.22, dir: "reverse" },
    { x: 24,   y: 5,   size: 40, op: 0.28, dur: 12, delay: 3,   rot: 7, amp: 12, drift: 6,  depth: 0.26 },
    { x: 36,   y: 92,  size: 56, op: 0.19, dur: 20, delay: 7,   rot: 5, amp: 18, drift: 8,  depth: 0.12, dir: "reverse" },
    { x: 97,   y: 56,  size: 32, op: 0.35, dur: 24, delay: 4,   rot: 8, amp: 24, drift: 4,  depth: 0.32 },
    { x: 56,   y: 3.5, size: 64, op: 0.15, dur: 16, delay: 9,   rot: 4, amp: 15, drift: 11, depth: 0.08 },
    { x: 62,   y: 94,  size: 40, op: 0.30, dur: 18, delay: 2.5, rot: 6, amp: 19, drift: 6,  depth: 0.28, dir: "reverse" },
    { x: 88,   y: 96,  size: 48, op: 0.22, dur: 12, delay: 5.5, rot: 5, amp: 13, drift: 7,  depth: 0.20 }
  ];

  /* --- 3. Combien d icones selon la largeur d ecran -------------------- */
  function countFor(width) {
    if (width < 640) { return 6; }         /* mobile     : 5 a 7   */
    if (width < 1024) { return 9; }        /* tablette   : 8 a 10  */
    return 12;                             /* ordinateur : 10 a 15 */
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hero = null;
  var layer = null;
  var items = [];        /* { el: element, depth: nombre } */
  var lastCount = -1;
  var lastY = -1;
  var ticking = false;
  var resizeTimer = 0;
  var scrollBound = false;

  /* --- 4. Construction d une icone ------------------------------------- */
  function makeIcon(slot, name) {
    var icon = document.createElement("span");
    icon.className = "fx-icon";

    var vars = {
      "--fx-x": slot.x + "%",
      "--fx-y": slot.y + "%",
      "--fx-size": slot.size + "px",
      "--fx-op": String(slot.op),
      "--fx-dur": slot.dur + "s",
      "--fx-delay": slot.delay + "s",
      "--fx-rot": slot.rot + "deg",
      "--fx-amp": slot.amp + "px",
      "--fx-drift": slot.drift + "px",
      "--fx-dir": slot.dir || "normal"
    };
    for (var key in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        icon.style.setProperty(key, vars[key]);
      }
    }

    var orb = document.createElement("span");
    orb.className = "fx-orb";

    var img = document.createElement("img");
    img.src = BASE + name + ".png";
    img.alt = "";
    img.width = slot.size;
    img.height = slot.size;
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    img.setAttribute("fetchpriority", "low");

    /* Un fichier absent ne doit jamais laisser un cadre vide. */
    img.addEventListener("error", function () { remove(icon); });

    orb.appendChild(img);
    icon.appendChild(orb);
    return icon;
  }

  function remove(icon) {
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].el === icon) { items.splice(i, 1); }
    }
    if (icon.parentNode) { icon.parentNode.removeChild(icon); }
  }

  /* --- 5. (Re)construction de la couche -------------------------------- */
  function build() {
    var count = Math.min(countFor(window.innerWidth), SLOTS.length);
    lastCount = count;
    items = [];
    lastY = -1;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var slot = SLOTS[i];
      var icon = makeIcon(slot, ICONS[i % ICONS.length]);
      items.push({ el: icon, depth: slot.depth });
      fragment.appendChild(icon);
    }

    layer.textContent = "";
    layer.appendChild(fragment);
    applyParallax();
  }

  /* --- 6. Parallaxe ---------------------------------------------------- */
  function schedule() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(applyParallax);
    }
  }

  function applyParallax() {
    ticking = false;
    if (reduced.matches || !items.length) { return; }

    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = hero.offsetHeight + 200;
    if (y > max) { y = max; }              /* hero passe : plus rien a bouger */
    if (y === lastY) { return; }
    lastY = y;

    /* Mouvement volontairement reduit sur mobile. */
    var k = window.innerWidth < 640 ? 0.45 : 1;
    for (var i = 0; i < items.length; i++) {
      items[i].el.style.setProperty(
        "--fx-par",
        (y * items[i].depth * k).toFixed(1) + "px"
      );
    }
  }

  function bindScroll() {
    if (scrollBound || reduced.matches) { return; }
    window.addEventListener("scroll", schedule, { passive: true });
    scrollBound = true;
  }

  function unbindScroll() {
    if (!scrollBound) { return; }
    window.removeEventListener("scroll", schedule);
    scrollBound = false;
    for (var i = 0; i < items.length; i++) {
      items[i].el.style.setProperty("--fx-par", "0px");
    }
  }

  /* --- 7. Demarrage ---------------------------------------------------- */
  function init() {
    hero = document.querySelector(".hero");
    if (!hero) { return; }

    layer = hero.querySelector(".fx-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "fx-layer";
      layer.setAttribute("aria-hidden", "true");
      hero.insertBefore(layer, hero.firstChild);
    }

    build();
    bindScroll();

    window.requestAnimationFrame(function () {
      layer.classList.add("is-ready");
    });

    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (countFor(window.innerWidth) !== lastCount) { build(); }
        else { lastY = -1; schedule(); }
      }, 200);
    }, { passive: true });

    /* Changement de preference systeme en cours de session. */
    if (typeof reduced.addEventListener === "function") {
      reduced.addEventListener("change", function () {
        if (reduced.matches) { unbindScroll(); }
        else { bindScroll(); schedule(); }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
