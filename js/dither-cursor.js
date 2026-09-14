/*
 * Dither Cursor
 * A pixelated, dithered trail that follows the pointer, built with a
 * plain <canvas> and an ordered (Bayer) dither pattern instead of a
 * smooth alpha fade. No build step, no dependencies — pairs with the
 * site's own light/dark theme tokens (--accent / --accent-soft).
 */
(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  var CELL = 5;              // size of each dithered "pixel" block
  var LIFESPAN = 550;        // ms a trail point stays visible
  var MAX_RADIUS = 22;       // px radius of the dither cloud at spawn
  var EMIT_EVERY = 16;       // ms between spawned points while moving

  // 4x4 Bayer ordered-dither matrix, normalised to 0..1
  var BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ].map(function (row) { return row.map(function (v) { return (v + 0.5) / 16; }); });

  var canvas = document.createElement("canvas");
  canvas.id = "dither-cursor-canvas";
  var ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0;
  var points = [];
  var lastEmit = 0;
  var color = "#0314af";

  function readColor() {
    var styles = getComputedStyle(document.documentElement);
    var c = styles.getPropertyValue("--accent").trim() || styles.getPropertyValue("--accent-soft").trim();
    color = c || "#0314af";
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function spawn(x, y) {
    points.push({ x: x, y: y, t: performance.now() });
  }

  function onPointerMove(e) {
    var now = performance.now();
    if (now - lastEmit < EMIT_EVERY) return;
    lastEmit = now;
    spawn(e.clientX, e.clientY);
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    var rgb = hexToRgb(color);

    for (var i = points.length - 1; i >= 0; i--) {
      var p = points[i];
      var age = now - p.t;
      if (age > LIFESPAN) {
        points.splice(i, 1);
        continue;
      }
      var life = 1 - age / LIFESPAN; // 1 -> 0
      var radius = MAX_RADIUS * (0.35 + 0.65 * life);
      var cells = Math.ceil(radius / CELL);
      var baseCol = Math.round(p.x / CELL);
      var baseRow = Math.round(p.y / CELL);

      for (var cx = -cells; cx <= cells; cx++) {
        for (var cy = -cells; cy <= cells; cy++) {
          var dist = Math.sqrt(cx * cx + cy * cy) * CELL;
          if (dist > radius) continue;
          var fade = life * (1 - dist / radius);
          if (fade <= 0) continue;
          var col = ((baseCol + cx) % 4 + 4) % 4;
          var row = ((baseRow + cy) % 4 + 4) % 4;
          var threshold = BAYER[row][col];
          if (fade < threshold) continue; // dithered drop-out, not a smooth fade
          var alpha = Math.min(1, fade) * 0.85;
          ctx.fillStyle = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + alpha + ")";
          ctx.fillRect(
            (baseCol + cx) * CELL,
            (baseRow + cy) * CELL,
            CELL,
            CELL
          );
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  var themeObserver = new MutationObserver(readColor);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  readColor();
  resize();
  requestAnimationFrame(draw);
})();
