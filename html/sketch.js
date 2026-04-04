"use strict";

const DATA_URL = "./data/aggregated-data.json";

let dataset = null;
let animationIsStopped = false;
const CANVAS_SIZE = 1000;
const palette = [
  "#2c695a", // teal (original, OK)
  "#cf022b", // red
  "#4e93cc", // blue (original, OK)
  "#b07a00", // dark gold (remplace #ffd300 trop clair)
  "#2a1449", // deep purple
  "#008a9b", // cyan/teal
  "#a14a00", // burnt orange
  "#0f3d34", // deep teal
  "#8b1d82", // magenta purple
  "#1b7fb1", // brighter blue (remplace #7facc6 trop clair)
  "#d14f3a", // deeper coral (remplace #f6684f un peu trop clair)
  "#5b2a86", // purple
  "#006b5f", // teal (remplace #4ad6af trop clair)
  "#005b9a", // deep blue
  "#3b3b3b"  // charcoal (utile si tu veux une couleur “neutre” très lisible)
];

function loadData(data) {
  dataset = new Europe();
  const coordinate_factor = compute_coordinates_factor(data["stats"]);
  const debt_configurator = new DebtConfigurator(data["stats"]);
  let colorIndex = 0;
  for (const [key, value] of Object.entries(data["data"])) {
    dataset.add_country(new Country(key, value["Année"], value["Impôt"], value["Dépense"], value["Dette"], coordinate_factor, debt_configurator, palette[colorIndex]))
    colorIndex++;
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
  frameRate(3);
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
  dataset.next()

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

class Europe {
  #gen
  constructor() {
    this.countries = [];
    this.#gen = this.#iterator();
  }

  add_country(country) {
    this.countries.push(country);
  }

  *#iterator() {
    for (const country of this.countries) {
      yield* country;
    }
  }

  next() {
    return this.#gen.next();
  }

  [Symbol.iterator]() {
    return this;
  }
}

class Country {
  #gen

  constructor(name, years, taxes, expenses, debts, coordinate_factor, debt_configurator, color) {
    this.name = name;
    this.years = years;
    this.taxes = taxes;
    this.debts = debts;
    this.expenses = expenses;
    this.color = color;
    this.coordinate_factor = coordinate_factor;
    this.debt_configurator = debt_configurator;
    this.spline_points = [];
    this.#gen = this.#iterator();
  }

  *#iterator() {
    // spline_points must have at leat 2 points, so we initialise with the
    // first so that on first iteration of the loop there will be two points
    // (we assume there is at leat 2 points in data)
    this.spline_points = [[this.coordinate_factor * this.taxes[0], this.coordinate_factor * this.expenses[0], this.debt_configurator.convert(this.debts[0])]];
    const len = this.taxes.length;
    for (let i = 1; i < len; i++) {
      this.spline_points[i] = [this.coordinate_factor * this.taxes[i], this.coordinate_factor * this.expenses[i], this.debt_configurator.convert(this.debts[i])];
      this.display();
      yield
    }
  }

  next() {
    return this.#gen.next();
  }

  [Symbol.iterator]() {
    return this;
  }

  display() {
    brush.set("2B", this.color, 0.5);
    brush.spline(this.spline_points, 0.5);
  }
}

function compute_coordinates_factor(stats) {
  const tax = stats["impot"];
  const expense = stats["dépense"];
  return (CANVAS_SIZE - 10) / max(tax[1], expense[1]);
}

class DebtConfigurator {
  constructor(stats) {
    this.min = stats["dette"][0];
    this.max = stats["dette"][1];
    this.diff = this.max - this.min;
  }
  convert(value) {
    return 0.2 + 2 * ((value - this.min) / this.diff);
  }
}
