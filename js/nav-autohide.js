/* =========================================================================
   Achraf Belghiti - Portfolio
   Barre de navigation coulissante : elle glisse vers le haut quand on defile
   vers le bas, et revient des qu'on remonte.
   Chemin : ./js/nav-autohide.js
   ========================================================================= */
(function () {
  "use strict";

  var nav = document.querySelector("nav");
  if (!nav) { return; }

  var REVEAL_AT = 90;   /* en haut de page la barre reste toujours visible */
  var DELTA = 6;        /* mouvement minimal pris en compte (px) */
  var lastY = window.scrollY || window.pageYOffset || 0;
  var ticking = false;

  /* Styles injectes : aucun autre fichier a modifier.
     overflow-x:hidden sur html/body empechait position:sticky de fonctionner :
     on le remplace par overflow-x:clip (meme rendu, sans conteneur de defilement),
     sauf quand le menu mobile verrouille le defilement (.mnav-lock). */
  var css = document.createElement("style");
  css.textContent =
    "html:not(.mnav-lock),body:not(.mnav-lock){overflow-x:clip !important;overflow-y:visible !important}" +
    "nav{transition:transform .38s cubic-bezier(.4,0,.2,1),background .3s ease,border-color .3s ease;will-change:transform}" +
    "nav.nav-hidden{transform:translateY(calc(-100% - 24px));pointer-events:none}" +
    "@media (prefers-reduced-motion: reduce){nav{transition:none}}";
  document.head.appendChild(css);

  function menuIsOpen() {
    var menu = document.querySelector(".mnav");
    return !!(menu && menu.classList.contains("is-open"));
  }
  function hide() { nav.classList.add("nav-hidden"); }
  function show() { nav.classList.remove("nav-hidden"); }

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var diff = y - lastY;

    if (menuIsOpen()) { show(); lastY = y; return; }
    if (Math.abs(diff) < DELTA) { return; }

    if (y <= REVEAL_AT) { show(); }
    else if (diff > 0) { hide(); }
    else { show(); }

    lastY = y;
  }

  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", show);
  nav.addEventListener("focusin", show);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab" || e.key === "Escape") { show(); }
  });
})();
