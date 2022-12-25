import Point from "./src/Point.js";
import Line from "./src/Line.js";
import Path from "./src/Path.js";
import Circle from "./src/Circle.js";
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

//generate random points for path
const point1 = new Point(10, 10);
const point2 = new Point(300, 300);
const point3 = new Point(140, 200);
const radius = 100;
//create line from points
const line = new Line(point1, point2, false);
line.color = "blue";
line.draw(ctx);

//create second line from points
const line2 = new Line(point2, point3, false);
line2.color = "blue";
line2.draw(ctx);
console.log(line.getAngleToLine(line2));
const interline = line.getIntersectionPoint(line2);
interline.draw(ctx, 5);

//create circle from point and radius
const circle = new Circle(point3, radius);
circle.draw(ctx);
const intersect = circle.getIntersectionWithLine(line);
console.log(intersect);
intersect[0].draw(ctx, 5, "green");
intersect[1].draw(ctx, 5, "green");

const intersect2 = circle.getIntersectionWithLine(line2);
console.log(intersect2);
intersect2[0].draw(ctx, 5, "green");
intersect2[1].draw(ctx, 5, "green");

console.log(ctx);
