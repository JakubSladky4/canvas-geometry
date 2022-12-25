import Vector from "./Vector.js";
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, radius = 2) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawWithText(ctx, text, radius = 2) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(text, this.x, this.y);
  }

  moveByVector(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    this.x += vector.x;
    this.y += vector.y;
  }

  moveByLengthAndAngle(length, angle) {
    if (typeof length !== "number" || typeof angle !== "number") {
      throw new Error("Parameters must be numbers");
    }
    this.x += length * Math.cos(angle);
    this.y += length * Math.sin(angle);
  }

  getNewPointMovedByLengthAndAngle(length, angle) {
    if (typeof length !== "number" || typeof angle !== "number") {
      throw new Error("Parameters must be numbers");
    }
    return new Point(
      this.x + length * Math.cos(angle),
      this.y + length * Math.sin(angle)
    );
  }

  getNewPointByVector(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return new Point(this.x + vector.x, this.y + vector.y);
  }

  getLegthTo(point) {
    if (!(point instanceof Point)) throw new Error("Parameter must be a point");
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    );
  }
}

//export Point class
export default Point;
