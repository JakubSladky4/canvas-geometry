class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (!(vector instanceof Vector))
      throw new Error("Parameter must be a vector");
    return new Vector(this.x + vector.x, this.y + vector.y);
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
