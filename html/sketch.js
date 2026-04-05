"use strict";

const DATA_URL = "./data/without-lux.json";
// const DATA_URL = "./data/aggregated-data.json";
const GEO_URL = "./data/carte.json";

let dataset = null;
let animationIsStopped = false;
let geojson = null;

const CANVAS_SIZE = 1000;
const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;

let map_layer = null;

const palette = [
  "#2c695a", "#cf022b", "#4e93cc", "#b07a00", "#2a1449",
  "#008a9b", "#a14a00", "#0f3d34", "#8b1d82", "#1b7fb1",
  "#d14f3a", "#5b2a86", "#006b5f", "#005b9a", "#3b3b3b"
];

async function setup() {
  const p5Canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
  p5Canvas.id("main");
  adjustCanvas("main");

  map_layer = createGraphics(MAP_WIDTH, MAP_HEIGHT);
  map_layer.pixelDensity(1);
  map_layer.noFill();
  map_layer.strokeWeight(0.8);

  geojson = await loadJSON(GEO_URL);
  await loadJSON(DATA_URL, loadData);

  brush.load();
  brush.scaleBrushes(3.5);

  background("#fffceb");
  frameRate(3);
}

function loadData(data) {
  dataset = new Europe();

  const coordinate_factor = compute_coordinates_factor(data.stats);
  const debt_configurator = new DebtConfigurator(data.stats);

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
        coordinate_factor,
        debt_configurator,
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

function draw() {
  resetMatrix();
  translate(-width / 2, -height / 2);
  image(map_layer, 0, 0);
  orient_axes();
  dataset.next();
}

function mouseClicked() {
  animationIsStopped ? loop() : noLoop();
  animationIsStopped = !animationIsStopped;
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
  #gen;

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
  #gen;

  constructor(
    name,
    years,
    taxes,
    expenses,
    debts,
    coordinate_factor,
    debt_configurator,
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
    this.coordinate_factor = coordinate_factor;
    this.debt_configurator = debt_configurator;
    this.spline_points = [];
    this.#gen = this.#iterator();
  }

  *#iterator() {
    map_layer.push();
    map_layer.stroke(this.color);
    this.draw_map(map_layer);
    map_layer.pop();

    this.spline_points = [[
      this.coordinate_factor * this.taxes[0],
      this.coordinate_factor * this.expenses[0],
      this.debt_configurator.convert(this.debts[0])
    ]];

    for (let i = 1; i < this.taxes.length; i++) {
      this.spline_points.push([
        this.coordinate_factor * this.taxes[i],
        this.coordinate_factor * this.expenses[i],
        this.debt_configurator.convert(this.debts[i])
      ]);
      this.display();
      yield;
    }
  }

  display() {
    brush.set("pen", this.color, 0.5);
    brush.spline(this.spline_points, 0.5);
    brush.noStroke();
  }

  draw_map(target) {
    if (this.geometry.type === "Polygon") {
      drawPolygon(target, this.geometry.coordinates);
    }

    if (this.geometry.type === "MultiPolygon") {
      for (const polygon of this.geometry.coordinates) {
        drawPolygon(target, polygon);
      }
    }
  }

  next() {
    return this.#gen.next();
  }

  [Symbol.iterator]() {
    return this;
  }
}

function drawPolygon(graphicsContext, polygon) {
  for (const ring of polygon) {
    graphicsContext.beginShape();
    for (const [lon, lat] of ring) {
      const projectedPoint = project(lon, lat);
      graphicsContext.vertex(projectedPoint.x, projectedPoint.y);
    }
    graphicsContext.endShape();
  }
}

function project(lon, lat) {
  return {
    x: map(lon, -25, 45, 40, MAP_WIDTH - 40),
    y: map(lat, 72, 34, 40, MAP_HEIGHT - 40)
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
    return 0.2 + 2 * ((value - this.min) / this.diff);
  }
}
