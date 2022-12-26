import Point from "./src/Point.js";
import Line from "./src/Line.js";
import Path from "./src/Path.js";
import Circle from "./src/Circle.js";
import Rect from "./src/Rect.js";
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

const point1 = new Point(100, 100);
const point2 = new Point(200, 100);
const point3 = new Point(150, 30);
const point4 = new Point(150, 200);

//make 2 lines and draw them
const line1 = new Line(point1, point2);
const line2 = new Line(point3, point4);
line1.draw(ctx);
line2.draw(ctx);
const intersection = line2.getIntersectionWith(line1);
console.log(intersection);
intersection.drawAll(ctx, "blue", 4);
