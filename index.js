import Point from "./src/Point.js";
import Line from "./src/Line.js";
import BezierCurve from "./src/BezierCurve.js";
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

//create two lines
const line1 = new Line(new Point(30, 30), new Point(30, 300));
const line2 = new Line(new Point(31, 30), new Point(300, 40));
const line3 = new Line(new Point(310, 50), new Point(310, 400));
//draw lines
line1.draw(ctx);
line2.draw(ctx);

//create new bezier curve
const bezierCurve = new BezierCurve([line1, line2, line3]);
const path = new Path([]);

let lerp = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  line1.draw(ctx);
  line2.draw(ctx);
  line3.draw(ctx);
  bezierCurve.drawHelper(ctx, "blue", 4);
  const point = bezierCurve.lerp(lerp);
  point.draw(ctx, "green", 5);
  path.addPoint(point);
  path.draw(ctx, "red");
  if (!(lerp > 1)) {
    requestAnimationFrame(animate);
  }
  lerp += 0.01;
}
animate();
