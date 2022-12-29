import Point from "./src/Point.js";
import Line from "./src/Line.js";
import Path from "./src/Path.js";
import Circle from "./src/Circle.js";
import Rect from "./src/Rect.js";
import Pencil from "./src/Pencil.js";
//get canvas element
const canvas = document.getElementById("canvas");
//get context
const ctx = canvas.getContext("2d");
const size = 500;
canvas.style.width = `${size}px`;
canvas.style.height = `${size}px`;
const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);
ctx.scale(scale, scale);
ctx.lineWidth = 2.5;
ctx.strokeStyle = "red";

const pencil = new Pencil(ctx);
pencil.start();
