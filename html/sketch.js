"use strict";

const DATA_URL = "./data/without-lux.json";
// const DATA_URL = "./data/aggregated-data.json";
const GEO_URL = "./data/carte.json";

const CANVAS_SIZE = 1000;
const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;

const LON_MIN = -25;
const LON_MAX = 45;
const LAT_MIN = 34;
const LAT_MAX = 72;
const MARGIN = 40;

const RENDER_SEED = 123456;

let cursiveFont;
let cursiveTextSize = 20;

let dataset = null;
let animationIsStopped = false;
let introVisible = true;
let geojson = null;

const palette = [
  "#2c695a", "#cf022b", "#4e93cc", "#b07a00", "#2a1449",
  "#008a9b", "#a14a00", "#0f3d34", "#8b1d82", "#1b7fb1",
  "#d14f3a", "#5b2a86", "#006b5f", "#005b9a", "#3b3b3b"
];

async function setup() {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
  canvas.id("main");
  adjustCanvas("main");

  cursiveFont = await loadFont(
    "https://fonts.googleapis.com/css2?family=Meow+Script&display=swap"
  );

  randomSeed(RENDER_SEED);
  noiseSeed(RENDER_SEED);

  geojson = await loadJSON(GEO_URL);
  await loadJSON(DATA_URL, loadData);

  brush.load();
  brush.scaleBrushes(3.5);

  background("#fffceb");
  frameRate(6);
}

function loadData(data) {
  dataset = new Europe();

  const coordinateFactor = compute_coordinates_factor(data.stats);
  const debtConfigurator = new DebtConfigurator(data.stats);

  let colorIndex = 0;

  for (const [key, value] of Object.entries(data.data)) {
    const geometry = get_country_geometry(
      geojson,
      value.Cde_Pays[0]
    );

    dataset.add_country(
      new Country(
        key,
        value.Année,
        value.Impôt,
        value.Dépense,
        value.Dette,
        coordinateFactor,
        debtConfigurator,
        palette[colorIndex],
        geometry
      )
    );

    colorIndex++;
  }
}

function get_country_geometry(geojson, code) {
  const feature = geojson.features.find(
    f => f.properties.ISO3 === code
  );
  if (!feature) throw new Error("No geometry found for " + code);
  return feature.geometry;
}

function intro() {
  push();
  textFont(cursiveFont);
  textSize(cursiveTextSize);
  fill(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  rectMode(CENTER);
  let s = `
    L’animation que vous allez voir montre l’évolution de la dépense par habitant en fonction de l’impôt par habitant des pays de l’Europe.

    L’épaisseur des traits est porportionnelle à la dette par habitant.

    Cliquez pour démarrer l’animation.

    (un clic durant l’animation la mettera sur pose jusqu’au prochain clic)
  `
  text(s, 0, 0, 300, 600);
  pop();
}

function draw() {
  background("#fffceb");
  if (introVisible) {
    intro();
    return
  }
  const result = dataset.next();
  if (!result.done) {
    dataset.drawAllBorders();

    if (dataset.currentCountry) {
      dataset.currentCountry.display();
    }
    orient_axes();
  } else {
    dataset.display();
    console.log("Rendering complete");
    noLoop();
  }
}

function mouseClicked() {
  if (introVisible) {
    introVisible = false;
    loop();
    return;
  }
  animationIsStopped ? loop() : noLoop();
  animationIsStopped = !animationIsStopped;
}

function keyPressed() {
  if (key === "r" || key === "R") {
    const newSeed = Math.floor(Math.random() * 1e9);
    console.log("New seed:", newSeed);
  }
}

function adjustCanvas(id) {
  const canvas = document.getElementById(id);
  canvas.style.maxWidth = "100vw";
  canvas.style.maxHeight = "100vh";
  canvas.style.width = "auto";
  canvas.style.height = "auto";
  canvas.style.objectFit = "contain";
}

function orient_axes() {
  resetMatrix();
  translate(-width / 2, height / 2);
  scale(1, -1);
}

class Europe {
  #generator;

  constructor() {
    this.countries = [];
    this.currentCountry = null;
    this.#generator = this.#iterator();
  }

  add_country(country) {
    this.countries.push(country);
  }

  *#iterator() {
    for (const country of this.countries) {
      background("#fffceb");
      this.currentCountry = country;
      yield* country;
    }
    this.currentCountry = null;
  }

  next() {
    return this.#generator.next();
  }

  [Symbol.iterator]() {
    return this;
  }

  display() {
    for (const country of this.countries) {
      country.display();
    }
  }

  drawAllBorders() {
    randomSeed(RENDER_SEED);
    noiseSeed(RENDER_SEED);

    for (const country of this.countries) {
      drawGeometryStroke(country.geometry, "#000000");
    }
    brush.noStroke();
  }
}

class Country {
  #generator;

  constructor(
    name,
    years,
    taxes,
    expenses,
    debts,
    coordinateFactor,
    debtConfigurator,
    color,
    geometry
  ) {
    this.name = name;
    this.years = years;
    this.taxes = taxes;
    this.expenses = expenses;
    this.debts = debts;
    this.color = color;
    this.geometry = geometry;
    this.coordinateFactor = coordinateFactor;
    this.debtConfigurator = debtConfigurator;
    this.splinePoints = [];
    this.renderSeed = this.compute_render_seed();
    this.#generator = this.#iterator();
  }

  compute_render_seed() {
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) {
      hash = (hash * 31 + this.name.charCodeAt(i)) | 0;
    }
    return hash >>> 0;
  }

  *#iterator() {
    this.splinePoints = [[
      this.coordinateFactor * this.taxes[0],
      this.coordinateFactor * this.expenses[0],
      this.debtConfigurator.convert(this.debts[0])
    ]];

    for (let i = 1; i < this.taxes.length; i++) {
      this.splinePoints.push([
        this.coordinateFactor * this.taxes[i],
        this.coordinateFactor * this.expenses[i],
        this.debtConfigurator.convert(this.debts[i])
      ]);
      background("#fffceb");
      this.display();

      brush.set("pen", this.color, 1);
      const [x, y] = this.splinePoints.at(-1);
      brush.circle(x, y, 8);


      push();
      resetMatrix();
      translate(-width / 2, -height / 2);

      textFont(cursiveFont);
      textSize(20);
      fill(0);
      textAlign(CENTER, CENTER);

      text(this.years[i], x, height - y - 25);
      textSize(60);
      text(this.name, width - 180, height - 60);
      textSize(cursiveTextSize);
      pop();
      yield;
    }
  }

  display() {
    randomSeed(this.renderSeed);
    noiseSeed(this.renderSeed);

    drawGeometryFill(this.geometry, this.color);
    drawGeometryStroke(this.geometry, this.color);

    orient_axes();
    brush.set("pen", this.color, 0.5);
    brush.spline(this.splinePoints, 0.5);
    brush.noStroke();
  }

  next() {
    return this.#generator.next();
  }

  [Symbol.iterator]() {
    return this;
  }
}

function drawGeometryFill(geometry, color) {
  resetMatrix();
  translate(-width / 2, -height / 2);

  brush.noStroke();
  brush.fillBleed(0.6, "out");
  brush.fillTexture(0.6, 0.4, false);
  brush.fill(color, 220);

  if (!geometry) return;

  if (geometry.type === "Polygon") {
    drawPolygonFill(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      drawPolygonFill(polygon);
    }
  }
  brush.noFill();
}

function drawPolygonFill(polygon) {
  if (!polygon || polygon.length === 0) return;

  const outerRing = polygon[0];

  brush.beginShape();
  for (const [lon, lat] of outerRing) {
    const projectedPoint = project(lon, lat);
    brush.vertex(projectedPoint.x, projectedPoint.y);
  }
  brush.endShape();
}

function drawGeometryStroke(geometry, color) {
  if (!geometry) return;

  resetMatrix();
  translate(-width / 2, -height / 2);

  brush.set("HB", color, 1);
  brush.strokeWeight(0.8);

  if (geometry.type === "Polygon") {
    drawPolygonStroke(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      drawPolygonStroke(polygon);
    }
  }
}

function drawPolygonStroke(polygon) {
  if (!polygon) return;

  for (const ring of polygon) {
    brush.beginStroke("segments");
    for (let i = 1; i < ring.length; i++) {
      const start = project(ring[i - 1][0], ring[i - 1][1]);
      const end = project(ring[i][0], ring[i][1]);
      brush.line(start.x, start.y, end.x, end.y);
    }
    brush.endStroke();
  }
}

function project(lon, lat) {
  return {
    x: map(lon, LON_MIN, LON_MAX, MARGIN, MAP_WIDTH - MARGIN),
    y: map(lat, LAT_MAX, LAT_MIN, MARGIN, MAP_HEIGHT - MARGIN)
  };
}

function compute_coordinates_factor(stats) {
  return (CANVAS_SIZE - 10) /
    max(stats.impot[1], stats.dépense[1]);
}

class DebtConfigurator {
  constructor(stats) {
    this.min = stats.dette[0];
    this.max = stats.dette[1];
    this.diff = this.max - this.min;
  }

  convert(value) {
    return 0.3 + 3 * ((value - this.min) / this.diff);
  }
}
