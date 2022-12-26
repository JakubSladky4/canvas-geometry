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

const point3 = new Point(140, 200);
const radius = 100;
//create line from points

const rect = new Rect(new Point(30, 30), 100, 100);
rect.draw(ctx, "red");

//create circle from point and radius
const circle = new Circle(point3, radius);
circle.draw(ctx);

console.log(circle.getIntersectionWith(rect));
circle.getIntersectionWith(rect).forEach((i) => {
  i.point.draw(ctx, "black", 10);
});
