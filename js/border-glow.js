/* BorderGlow (React Bits, JS-CSS variant) — ported to vanilla JS.
   Source: https://reactbits.dev/components/border-glow
   Registry: https://reactbits.dev/r/BorderGlow-JS-CSS.json

   Usage: give an element class="border-glow-card" plus
   data-glow-* attributes for configuration, containing a
   <span class="edge-light"></span> and a
   <div class="border-glow-inner">...</div>. This file wires up the
   cursor tracking and sets the CSS custom properties the stylesheet
   (css/border-glow.css) reads. */

(function () {
  function parseHSL(hslStr) {
    var match = /([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/.exec(hslStr || '');
    if (!match) return { h: 40, s: 80, l: 80 };
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
  }

  function buildGlowVars(el, glowColor, intensity) {
    var hsl = parseHSL(glowColor);
    var base = hsl.h + 'deg ' + hsl.s + '% ' + hsl.l + '%';
    var opacities = [100, 60, 50, 40, 30, 20, 10];
    var keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    for (var i = 0; i < opacities.length; i++) {
      var value = Math.min(opacities[i] * intensity, 100);
      el.style.setProperty('--glow-color' + keys[i], 'hsl(' + base + ' / ' + value + '%)');
    }
  }

  var GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  var GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  var COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

  function buildGradientVars(el, colors) {
    for (var i = 0; i < 7; i++) {
      var c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
      el.style.setProperty(GRADIENT_KEYS[i], 'radial-gradient(at ' + GRADIENT_POSITIONS[i] + ', ' + c + ' 0px, transparent 50%)');
    }
    el.style.setProperty('--gradient-base', 'linear-gradient(' + colors[0] + ' 0 100%)');
  }

  function isLightColor(color) {
    var value = (color || '').trim().replace('#', '');
    if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
    var hex = value.length === 3 ? value.split('').map(function (c) { return c + c; }).join('') : value;
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    return r * 0.2126 + g * 0.7152 + b * 0.0722 > 180;
  }

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeInCubic(x) { return x * x * x; }

  function animateValue(opts) {
    var start = opts.start || 0;
    var end = opts.end === undefined ? 100 : opts.end;
    var duration = opts.duration || 1000;
    var delay = opts.delay || 0;
    var ease = opts.ease || easeOutCubic;
    setTimeout(function () {
      var t0 = performance.now();
      function tick() {
        var elapsed = performance.now() - t0;
        var t = Math.min(elapsed / duration, 1);
        opts.onUpdate(start + (end - start) * ease(t));
        if (t < 1) requestAnimationFrame(tick);
        else if (opts.onEnd) opts.onEnd();
      }
      requestAnimationFrame(tick);
    }, delay);
  }

  function getCenter(el) {
    var rect = el.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  }

  function getEdgeProximity(el, x, y) {
    var center = getCenter(el);
    var dx = x - center[0];
    var dy = y - center[1];
    var kx = Infinity;
    var ky = Infinity;
    if (dx !== 0) kx = center[0] / Math.abs(dx);
    if (dy !== 0) ky = center[1] / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(el, x, y) {
    var center = getCenter(el);
    var dx = x - center[0];
    var dy = y - center[1];
    if (dx === 0 && dy === 0) return 0;
    var radians = Math.atan2(dy, dx);
    var degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  function playSweep(el) {
    var angleStart = 110;
    var angleEnd = 465;
    el.classList.add('sweep-active');
    el.style.setProperty('--cursor-angle', angleStart + 'deg');

    animateValue({ duration: 500, onUpdate: function (v) { el.style.setProperty('--edge-proximity', v); } });
    animateValue({
      ease: easeInCubic, duration: 1500, end: 50,
      onUpdate: function (v) { el.style.setProperty('--cursor-angle', ((angleEnd - angleStart) * (v / 100) + angleStart) + 'deg'); }
    });
    animateValue({
      ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100,
      onUpdate: function (v) { el.style.setProperty('--cursor-angle', ((angleEnd - angleStart) * (v / 100) + angleStart) + 'deg'); }
    });
    animateValue({
      ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: function (v) { el.style.setProperty('--edge-proximity', v); },
      onEnd: function () { el.classList.remove('sweep-active'); }
    });
  }

  function initBorderGlow(el) {
    var edgeSensitivity = parseFloat(el.dataset.edgeSensitivity || '30');
    var glowColor = el.dataset.glowColor || '40 80 80';
    var backgroundColor = el.dataset.backgroundColor || '#120F17';
    var borderRadius = parseFloat(el.dataset.borderRadius || '28');
    var glowRadius = parseFloat(el.dataset.glowRadius || '40');
    var glowIntensity = parseFloat(el.dataset.glowIntensity || '1');
    var coneSpread = parseFloat(el.dataset.coneSpread || '25');
    var animated = el.dataset.animated === 'true';
    var fillOpacity = parseFloat(el.dataset.fillOpacity || '0.5');
    var colors = (el.dataset.colors || '#c084fc,#f472b6,#38bdf8').split(',').map(function (c) { return c.trim(); });

    el.style.setProperty('--card-bg', backgroundColor);
    el.style.setProperty('--edge-sensitivity', edgeSensitivity);
    el.style.setProperty('--border-radius', borderRadius + 'px');
    el.style.setProperty('--glow-padding', glowRadius + 'px');
    el.style.setProperty('--cone-spread', coneSpread);
    el.style.setProperty('--fill-opacity', fillOpacity);
    buildGlowVars(el, glowColor, glowIntensity);
    buildGradientVars(el, colors);

    if (isLightColor(backgroundColor)) {
      el.classList.add('border-glow-card--light');
    }

    el.addEventListener('pointermove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var edge = getEdgeProximity(el, x, y);
      var angle = getCursorAngle(el, x, y);
      el.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      el.style.setProperty('--cursor-angle', angle.toFixed(3) + 'deg');
    });

    if (animated) {
      playSweep(el);
    }
  }

  function init() {
    var cards = document.querySelectorAll('.border-glow-card');
    for (var i = 0; i < cards.length; i++) initBorderGlow(cards[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
