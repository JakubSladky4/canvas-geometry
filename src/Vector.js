class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  multiplyByScalar(scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }

  getNormalVector() {
    return new Vector(-this.y, this.x);
  }

  getAngleTo(vector) {
    return Math.acos(
      this.multiplyByVector(vector) / (this.length * vector.length)
    );
  }

  multiplyByVector(vector) {
    //this is scalar multiplication
    return this.x * vector.x + this.y * vector.y;
  }

  getMultiplyByScalarVector(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  minus(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

export default Vector;
