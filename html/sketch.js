"use strict";

const DATA_URL = "./data/aggregated-data.json";

let dataset = null;
let animationIsStopped = false;
const CANVAS_SIZE = 600;

function loadData(data) {
  dataset = [];
  const coordinate_converter = new CoordinateConverter(data["stats"]);
  for (const [key, value] of Object.entries(data["data"])) {
    console.log(key, value);
    dataset.push(new Country(key, value["Année"], value["Impôt"], value["Dépense"], value["Dette"], coordinate_converter))
  }
}

async function setup() {
  let p5Canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
  p5Canvas.id("main");
  adjustCanvas("main");
  await loadJSON(DATA_URL, loadData);
  // brush.load() initialises the library on the current canvas.
  // Must be called after createCanvas().
  brush.load();

  // brush.scaleBrushes() multiplies the weight and scatter of every
  // built-in brush by the given factor — handy for high-resolution canvases.
  brush.scaleBrushes(3.5);
  background("#fffceb");
  frameRate(30);
}

// ── Responsive canvas ────────────────────────────────────────────────────────
// Fits the canvas to the browser window while preserving its aspect ratio.
function adjustCanvas(id) {
  let canvas = document.getElementById(id);
  canvas.style.maxWidth = "100vw";
  canvas.style.maxHeight = "100vh";
  canvas.style.width = "auto";
  canvas.style.height = "auto";
  canvas.style.objectFit = "contain";
}

function orient_axes() {
  // In WEBGL mode the origin is at the canvas centre. Shifting it to the
  // top-left lets us use the same coordinate system as 2D mode (0,0 = top-left).
  angleMode(DEGREES)
  rotate(180, [1, 0, 0])
  translate(-width / 2, -height / 2);
}


// ── Draw loop ─────────────────────────────────────────────────────────────────
function draw() {

  // t advances once per second; scene changes every 5 seconds, cycling 0–5.
  const time = frameCount / 30;

  orient_axes()
  brush.set("2B", "#0e2d58", 2);
  brush.beginShape(0.3);
  brush.vertex(50, 100);
  brush.vertex(100, 150, 0.5);
  brush.vertex(150, 100);
  brush.vertex(300, 300);
  brush.endShape(false);
}

// Stop/Resume animation on mouseclick
function mouseClicked() {
  if (animationIsStopped) {
    loop();
  }
  else {
    noLoop();
  }
  animationIsStopped = !animationIsStopped;
}

class Country {
  constructor(name, years, taxes, expenses, debts, coordinate_converter) {
    this.name = name;
    this.years = years;
    this.taxes = taxes;
    this.debts = debts;
    this.expenses = expenses;
    this.coordinate_converter = coordinate_converter;
  }

  data_to_coordinates(x, y) {
    return x, y
  }
}

class CoordinateConverter {
  constructor(stats) {
    this.year = stats["Année"];
    this.tax = stats["impot"];
    this.expense = stats["dépense"];
    this.debt = stats["dette"];
    this.factor = CANVAS_SIZE / max(this.tax[1], this.expense[1]);
  }
  convert_to_coordinates(tax, expense) {
    return tax * this.factor, expense * this.factor
  }
}
