import Point from "./Point.js";
import Line from "./Line.js";
import Utils from "./utils.js";
import Intersection from "./Intersection.js";
class Rect {
  constructor(point = new Point(0, 0), width = 0, height = 0) {
    if (!(point instanceof Point)) throw new Error("Parameter must be a Point");
    if (typeof width !== "number")
      throw new Error("Parameter must be a number");
    if (typeof height !== "number")
      throw new Error("Parameter must be a number");
    this.point1 = new Point(point.x, point.y);
    this.point2 = new Point(point.x + width, point.y);
    this.point3 = new Point(point.x + width, point.y + height);
    this.point4 = new Point(point.x, point.y + height);
    this.width = width;
    this.height = height;
    this.color = undefined;
    this.type = "Rect";
    this.id = Utils.getId();
  }

  fill(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.rect(this.start.x, this.start.y, this.width, this.height);
    ctx.fill();
  }

  get perimeter() {
    return this.width * 2 + this.height * 2;
  }

  get area() {
    return this.width * this.height;
  }

  getIntersectionWith(shape) {
    return Intersection.getIntersection(this, shape);
  }

  draw(ctx, color = undefined) {
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
    ctx.rect(this.point1.x, this.point1.y, this.width, this.height);
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }

  get points() {
    return [this.point1, this.point2, this.point3, this.point4];
  }

  get lines() {
    return [
      new Line(this.point1, this.point2),
      new Line(this.point2, this.point3),
      new Line(this.point3, this.point4),
      new Line(this.point4, this.point1),
    ];
  }

  simplify() {
    return this.lines;
  }
}

export default Rect;
