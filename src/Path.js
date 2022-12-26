import Vector from "./Vector.js";
import Point from "./Point.js";
import Line from "./Line.js";
import Utils from "./utils.js";
class Path {
  constructor(arrayOfPoints = []) {
    if (!Array.isArray(arrayOfPoints)) throw new Error("Path must be an array");
    for (let i = 0; i < arrayOfPoints.length; i++) {
      if (!(arrayOfPoints[i] instanceof Point))
        throw new Error("Every element in array in path must be a point");
    }
    this._path = arrayOfPoints;
    this.drawAsLast = {
      from: 0,
      to: 0,
    };
    this.color = undefined;
    this.type = "Path";
    this.id = Utils.getId();
  }

  addPoint(point) {
    this._path.push(point);
  }

  get length() {
    return this._path.length;
  }

  getPoint(index) {
    return this._path[index];
  }

  get lines() {
    let lines = [];
    for (let i = 0; i < this._path.length - 1; i++) {
      lines.push(new Line(this._path[i], this._path[i + 1]));
    }
    return lines;
  }

  multiplyNumberOfPoints(multiplicator) {
    if (typeof multiplicator !== "number")
      throw new Error("Parameter must be a number");
    let newPoints = [];
    for (let i = 0; i < this._path.length - 1; i++) {
      let point1 = this._path[i];
      let point2 = this._path[i + 1];
      let vector = new Vector(point2.x - point1.x, point2.y - point1.y);
      vector.multiplyByScalar(1 / multiplicator);
      for (let j = 0; j < multiplicator; j++) {
        newPoints.push(point1.getNewPointByVector(vector));
        point1 = point1.getNewPointByVector(vector);
      }
    }
    this._path = newPoints;
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
    ctx.moveTo(this._path[0].x, this._path[0].y);
    for (let i = 1; i < this._path.length; i++) {
      ctx.lineTo(this._path[i].x, this._path[i].y);
    }
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }

  drawToNextPoint(ctx, color = undefined) {
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
    ctx.moveTo(
      this._path[this.drawAsLast.to].x,
      this._path[this.drawAsLast.to].y
    );
    ctx.lineTo(
      this._path[this.drawAsLast.to + 1].x,
      this._path[this.drawAsLast.to + 1].y
    );
    ctx.stroke();
    this.drawAsLast.to++;
    ctx.strokeStyle = oldColor;
  }

  drawFromTo(ctx, from = 0, to = this._path.length - 1, color = undefined) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    if (from < 0 || from >= this._path.length)
      throw new Error("from is out of range");
    if (to < 0) throw new Error("to is out of range");
    const oldColor = ctx.strokeStyle;
    if (this.color) {
      ctx.strokeStyle = this.color;
    }
    if (color) {
      ctx.strokeStyle = color;
    }
    if (to >= this._path.length) to = this._path.length - 1;
    this.drawAsLast = { from: from, to: to };
    ctx.beginPath();
    ctx.moveTo(this._path[from].x, this._path[from].y);
    for (let i = from; i <= to; i++) {
      ctx.lineTo(this._path[i].x, this._path[i].y);
    }
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }
}

export default Path;
