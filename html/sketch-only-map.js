let geo = null;

const LON_MIN = -25;
const LON_MAX = 45;
const LAT_MIN = 34;
const LAT_MAX = 72;
const MARGIN = 40;

// Anti-crash: limit vertex count per ring for fill
const MAX_FILL_VERTS = 2000;

const DATA_URL = "./data/without-lux.json";
// const DATA_URL = "./data/aggregated-data.json";
const GEO_URL = "./data/carte.json";

async function setup() {
  createCanvas(900, 700, WEBGL);

  brush.scaleBrushes(3);

  noLoop();

  const res = await fetch(GEO_URL);
  geo = await res.json();
}

function draw() {
  if (!geo || !geo.features) return;

  background(245);
  translate(-width / 2, -height / 2);

  // -----------------
  // FILL (robust)
  // -----------------
  brush.noStroke();
  brush.fillBleed(0.6, "out");
  brush.fillTexture(0.6, 0.4, false);
  brush.fill("#262626", 250)
  for (const f of geo.features) {
    drawGeometryFill(f.geometry);
  }

  // -----------------
  // STROKE (borders)
  // -----------------
  brush.noFill();
  brush.set("HB", "#1e1e1e", 1);
  brush.strokeWeight(0.8);

  for (const f of geo.features) {
    drawGeometryStroke(f.geometry);
  }
}

function drawGeometryFill(geometry) {
  if (!geometry) return;

  if (geometry.type === "Polygon") {
    drawPolygonFill(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) drawPolygonFill(poly);
  }
}

function drawPolygonFill(polygon) {
  if (!polygon || polygon.length === 0) return;

  // Fill only outer ring (holes handling varies; this keeps it stable)
  const ring = polygon[0];

  brush.beginShape();
  for (const [lon, lat] of ring) {
    const p = project(lon, lat);
    brush.vertex(p.x, p.y);
  }
  brush.endShape();
}

function drawGeometryStroke(geometry) {
  if (!geometry) return;

  if (geometry.type === "Polygon") {
    drawPolygonStroke(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) drawPolygonStroke(poly);
  }
}

function drawPolygonStroke(polygon) {
  if (!polygon) return;

  for (const ring of polygon) {
    brush.beginStroke("segments");
    for (let i = 1; i < ring.length; i++) {
      const a = project(ring[i - 1][0], ring[i - 1][1]);
      const b = project(ring[i][0], ring[i][1]);
      brush.line(a.x, a.y, b.x, b.y);
    }
    brush.endStroke();
  }
}

function project(lon, lat) {
  return {
    x: map(lon, LON_MIN, LON_MAX, MARGIN, width - MARGIN),
    y: map(lat, LAT_MAX, LAT_MIN, MARGIN, height - MARGIN)
  };
}
