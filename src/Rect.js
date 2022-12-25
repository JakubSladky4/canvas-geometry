import Point from "./Point.js";
class Rect {
  constructor(point = new Point(0, 0), width = 0, height = 0) {
    this.start = point;
    this.width = width;
    this.height = height;
  }

  fill(ctx) {
    ctx.beginPath();
    ctx.rect(this.start.x, this.start.y, this.width, this.height);
    ctx.fill();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.start.x, this.start.y, this.width, this.height);
    ctx.stroke();
  }
}
