import Point from "./src/Point.js";
import Line from "./src/Line.js";
import Path from "./src/Path.js";
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
ctx.strokeStyle = "blue";

const point1 = new Point(100, 100);
const point2 = new Point(400, 400);
//get line
const line = new Line(point1, point2);
//draw line
line.draw(ctx);
//draw point
point1.draw(ctx);
point2.draw(ctx);

ctx.strokeStyle = "green";
const point3 = new Point(150, 200);
const point4 = new Point(499, 300);
//draw point
point3.draw(ctx);
point4.draw(ctx);
//get line
const line2 = new Line(point3, point4);
//draw line
line2.draw(ctx);

ctx.strokeStyle = "red";
//get intersection point
const intersectionPoint = line2.getIntersectionPoint(line);
console.log(intersectionPoint);
intersectionPoint.draw(ctx);
console.log(line2.isLyingOnLine(intersectionPoint));
console.log(line.isLyingOnLine(intersectionPoint));

//console lerp
console.log(line2.getInterPolationRate(intersectionPoint));
console.log(line.getInterPolationRate(intersectionPoint));

//lies beetwen two points
console.log(line2.getIntersectionBetweenStartAndEndOfLine(line));

//draw point
const vector = line2.vector;
const vector2 = line.vector;
console.log(vector.minus({ x: 0, y: 0 }));
