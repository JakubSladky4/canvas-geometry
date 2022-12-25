import Vector from "./Vector.js";
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = undefined;
    this.radius = 2;
  }

  draw(ctx, radius = this.radius, color = undefined) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const oldColor = ctx.fillStyle;
    if (this.color) {
      ctx.fillStyle = this.color;
    }
    if (color) {
      ctx.fillStyle = color;
    }
    console.log(color);
    //
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = oldColor;
  }

  drawWithText(ctx, text, radius = 2, color = undefined) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const oldColor = ctx.strokeStyle;
    if (this.color) {
      ctx.strokeStyle = this.color;
    }
    if (color) {
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(text, this.x, this.y);
    ctx.strokeStyle = oldColor;
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
