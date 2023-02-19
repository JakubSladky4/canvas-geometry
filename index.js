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

//lines
const arrayOfLines = [];
const numberOfLines = 12;
//create i random lines
for (let i = 0; i < numberOfLines; i++) {
  const point1 = new Point(
    Math.floor(
      ((Math.random() * 0.8 + 0.1) * canvas.width) / window.devicePixelRatio
    ),
    Math.floor(
      ((Math.random() * 0.8 + 0.1) * canvas.height) / window.devicePixelRatio
    )
  );
  const point2 = new Point(
    Math.floor(
      ((Math.random() * 0.8 + 0.1) * canvas.width) / window.devicePixelRatio
    ),
    Math.floor(
      ((Math.random() * 0.8 + 0.1) * canvas.height) / window.devicePixelRatio
    )
  );
  const line = new Line(point1, point2);
  arrayOfLines.push(line);
}
//create new bezier curve
const bezierCurve = new BezierCurve(arrayOfLines);
const path = new Path([]);

let lerp = 0;
ctx.lineWidth = 1.5;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const point = bezierCurve.lerp(lerp);
  point.draw(ctx, "#e63946", 5);
  path.addPoint(point);
  path.draw(ctx, "#e63946");
  if (!(lerp > 1)) {
    requestAnimationFrame(animate);
  }
  lerp += 0.003;
}
animate();
