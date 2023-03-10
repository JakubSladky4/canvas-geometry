import Utils from "./utils.js";
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = undefined;
    this.type = "Vector";
    this.id = Utils.getId();
  }

  plus(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  draw(ctx, point, color = undefined) {
    if (!(point instanceof Point)) throw new Error("Parameter must be a point");
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
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + this.x, point.y + this.y);
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }

  multiplyByScalar(scalar) {
    if (typeof scalar !== "number")
      throw new Error("Parameter must be a number");
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }

  getNormalVector() {
    return new Vector(-this.y, this.x);
  }

  getAngleTo(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return Math.acos(
      this.multiplyByVector(vector) / (this.length * vector.length)
    );
  }

  isParallelTo(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return this.getAngleTo(vector) === 0 || this.getAngleTo(vector) === Math.PI;
  }

  multiplyByVector(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    //this is scalar multiplication
    return this.x * vector.x + this.y * vector.y;
  }

  getMultipliedVectorByScalar(scalar) {
    if (typeof scalar !== "number")
      throw new Error("Parameter must be a number");
    return new Vector(this.x * scalar, this.y * scalar);
  }

  minus(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

export default Vector;
