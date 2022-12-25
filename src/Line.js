import Point from "./Point.js";
import Vector from "./Vector.js";
class Line {
  constructor(point1, point2) {
    this.start = new Point(point1.x, point1.y);
    this.end = new Point(point2.x, point2.y);
    this.middle = new Point(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }

  get slope() {
    return (this.end.y - this.start.y) / (this.end.x - this.start.x);
  }

  getParametricEquation() {
    const vector = this.vector;
    const point = this.start;
    return {
      x: (t) => point.x + vector.x * t,
      y: (t) => point.y + vector.y * t,
    };
  }

  getGeneralEquation() {
    const a = this.end.y - this.start.y;
    const b = this.start.x - this.end.x;
    const c = this.end.x * this.start.y - this.start.x * this.end.y;
    return {
      a: a,
      b: b,
      c: c,
    };
  }

  isLyingOnLine(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    const generalEquation = this.getGeneralEquation();
    return (
      generalEquation.a * point.x +
        generalEquation.b * point.y +
        generalEquation.c ===
      0
    );
  }

  getDistanceFromPoint(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    const generalEquation = this.getGeneralEquation();
    return (
      Math.abs(
        generalEquation.a * point.x +
          generalEquation.b * point.y +
          generalEquation.c
      ) /
      Math.sqrt(Math.pow(generalEquation.a, 2) + Math.pow(generalEquation.b, 2))
    );
  }

  getNormalLineWhichPassesThroughPoint(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    const pointOnLine = this.getPointOnLineWhichIsClosestToPoint(point);
    const line = new Line(point, pointOnLine);
    return line;
  }

  getPointOnLineWhichIsClosestToPoint(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    const parametricEquation = this.getParametricEquation();
    const t =
      ((point.x - this.start.x) * (this.end.x - this.start.x) +
        (point.y - this.start.y) * (this.end.y - this.start.y)) /
      (Math.pow(this.end.x - this.start.x, 2) +
        Math.pow(this.end.y - this.start.y, 2));
    return new Point(parametricEquation.x(t), parametricEquation.y(t));
  }

  linearInterpolation(t) {
    if (typeof t !== "number") throw new Error("Parametre t must be a number");
    const parametricEquation = this.getParametricEquation();
    return new Point(parametricEquation.x(t), parametricEquation.y(t));
  }

  getIntersectionPoint(line) {
    if (!line instanceof Line) throw new Error("Parametre line must be a Line");
    const generalEquation1 = this.getGeneralEquation();
    const generalEquation2 = line.getGeneralEquation();
    const a1 = generalEquation1.a;
    const b1 = generalEquation1.b;
    const c1 = generalEquation1.c;
    const a2 = generalEquation2.a;
    const b2 = generalEquation2.b;
    const c2 = generalEquation2.c;
    const x = (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1);
    const y = (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1);
    if (isNaN(x) || isNaN(y)) return null;
    return new Point(x, y);
  }

  isParallelTo(line) {
    if (!line instanceof Line) throw new Error("Parametre line must be a Line");
    return this.vector.isParallelTo(line.vector);
  }

  isEquivalentTo(line) {
    if (!line instanceof Line) throw new Error("Parametre line must be a Line");
    const isPararelVector = this.vector.isEquivalentTo(line.vector);
    const haveTheSamePoint = line.isLyingOnLine(this.start);
    if (isPararelVector && haveTheSamePoint) return true;
    return false;
  }

  getIntersectionBetweenStartAndEndOfLine(line) {
    if (!line instanceof Line) throw new Error("Parametre line must be a Line");
    const intersectionPoint = this.getIntersectionPoint(line);
    if (intersectionPoint === null) {
      return null;
    }
    const rate = this.getInterPolationRate(intersectionPoint);
    if (rate <= 0 || rate >= 1) return null;
    return intersectionPoint;
  }

  getInterPolationRate(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    //get t
    const parametricEquation = this.getParametricEquation();
    const t = (point.x - parametricEquation.x(0)) / this.vector.x;
    return t;
  }

  get length() {
    return Math.sqrt(
      Math.pow(this.start.x - this.end.x, 2) +
        Math.pow(this.start.y - this.end.y, 2)
    );
  }

  getAngleToLine(line) {
    if (!line instanceof Line) throw new Error("Parametre line must be a Line");
    return this.vector.getAngleTo(line.vector);
  }

  get angle() {
    return Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
  }

  get vector() {
    return new Vector(this.end.x - this.start.x, this.end.y - this.start.y);
  }
}

export default Line;
