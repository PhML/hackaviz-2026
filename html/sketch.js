"use strict";

/* =========================
 * Configuration
 * ========================= */

const DATA_URL = "data/test-data.json";
const BG_COLOR = "#111";

const PIXELS_PER_SECOND = 1500;

// Variable-width rendering
const MIN_SUBSEGMENT_PX = 10;
const MAX_SUBSEGMENTS = 40;

/* =========================
 * State
 * ========================= */

let dataset = null;
let segments = [];

let segIndex = 0; // current segment index
let segT = 0;     // progress in [0..1]

/* =========================
 * p5 lifecycle
 * ========================= */

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  loadJSONData(DATA_URL)
    .then(data => {
      dataset = data;
      segments = buildSegments(dataset);
      resetAnimation();
      loop();
    })
    .catch(err => {
      console.error(err);
      noLoop();
    });
}

function draw() {
  if (!dataset) return;

  background(BG_COLOR);
  beginTopLeft();

  // draw all completed segments fully (t = 1)
  for (let i = 0; i < segIndex; i++) {
    drawVariableWidthSegment(segments[i], 1, i);
  }

  // draw current segment partially
  if (segIndex < segments.length) {
    const s = segments[segIndex];

    segT = advanceProgress(segT, s.len);
    drawVariableWidthSegment(s, segT, segIndex);

    if (segT >= 1) {
      segIndex += 1;
      segT = 0;
    }
  } else {
    noLoop();
  }

  endTopLeft();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  if (dataset) {
    segments = buildSegments(dataset);
    clampAnimationState();
  }
}

/* =========================
 * Rendering
 * ========================= */

/**
 * Draws a segment with variable thickness along its length.
 * Thickness interpolates from previous segment weight → current weight.
 */
function drawVariableWidthSegment(s, t, index) {
  const tClamped = clamp01(t);
  if (tClamped <= 0) return;

  const revealedLen = s.len * tClamped;
  const steps = computeSubsegmentCount(revealedLen);

  const w0 = getStartWeight(index);
  const w1 = s.weight;

  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * tClamped;
    const a1 = ((i + 1) / steps) * tClamped;

    const x0 = s.x1 + s.dx * a0;
    const y0 = s.y1 + s.dy * a0;
    const x1 = s.x1 + s.dx * a1;
    const y1 = s.y1 + s.dy * a1;

    const localT = 0.5 * (a0 + a1);
    const k = easeOutCubic(localT);

    const w = lerp(w0, w1, k);

    brush.set(s.brush, s.color, w);
    brush.line(x0, y0, x1, y1);
  }
}

/**
 * Weight at the beginning of a segment:
 * - first segment → its own weight
 * - others → previous segment's weight
 */
function getStartWeight(index) {
  if (index <= 0) return segments[0].weight;
  return segments[index - 1].weight;
}

/* =========================
 * Geometry helpers
 * ========================= */

function beginTopLeft() {
  push();
  translate(-width / 2, -height / 2);
}

function endTopLeft() {
  pop();
}

function computeSubsegmentCount(len) {
  const ideal = Math.ceil(len / MIN_SUBSEGMENT_PX);
  return clampInt(ideal, 1, MAX_SUBSEGMENTS);
}

/* =========================
 * Animation helpers
 * ========================= */

function advanceProgress(currentT, segmentLen) {
  const px = PIXELS_PER_SECOND * (deltaTime / 1000);
  return currentT + px / segmentLen;
}

function resetAnimation() {
  segIndex = 0;
  segT = 0;
}

function clampAnimationState() {
  segIndex = clampInt(segIndex, 0, segments.length);
  segT = clamp01(segT);
}

/* =========================
 * Data processing
 * ========================= */

async function loadJSONData(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to load ${url}`);
  return r.json();
}

function buildSegments(data) {
  const series = Object.entries(data).map(([name, v]) => ({
    name,
    dep: v["dépense"],
    imp: v["impôt"],
    det: v["dette"],
  }));

  const allDep = series.flatMap(s => s.dep);
  const allImp = series.flatMap(s => s.imp);
  const allDet = series.flatMap(s => s.det);

  const [minDep, maxDep] = extent(allDep);
  const [minImp, maxImp] = extent(allImp);
  const [minDet, maxDet] = extent(allDet);

  colorMode(HSB, 360, 100, 100);
  const colors = {};
  series.forEach((s, i) => {
    colors[s.name] = color((i * 360) / series.length, 80, 90);
  });

  const brushName = brush.box?.()[0] ?? "HB";
  const margin = 60;

  const out = [];

  for (const s of series) {
    const n = Math.min(s.dep.length, s.imp.length, s.det.length);
    for (let i = 0; i < n - 1; i++) {
      const x1 = map(s.dep[i], minDep, maxDep, margin, width - margin);
      const y1 = map(s.imp[i], minImp, maxImp, height - margin, margin);
      const x2 = map(s.dep[i + 1], minDep, maxDep, margin, width - margin);
      const y2 = map(s.imp[i + 1], minImp, maxImp, height - margin, margin);

      const debt = 0.5 * (s.det[i] + s.det[i + 1]);
      const w = map(debt, minDet, maxDet, 2, 28);

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.max(1e-6, Math.hypot(dx, dy));

      out.push({
        x1, y1, x2, y2,
        dx, dy, len,
        weight: w,
        color: colors[s.name],
        brush: brushName,
      });
    }
  }

  return out;
}

/* =========================
 * Math helpers
 * ========================= */

function extent(values) {
  let min = Infinity, max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!isFinite(min) || min === max) return [0, 1];
  return [min, max];
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function clampInt(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x | 0));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
