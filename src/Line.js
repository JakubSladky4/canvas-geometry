import Point from "./Point.js";
import Vector from "./Vector.js";
import Path from "./Path.js";
class Line {
  static isLimitedDefault = true;
  static isLimitedDefaultMin = -100;
  static isLimitedDefaultMax = 100;
  constructor(point1, point2, isLimited = Line.isLimitedDefault) {
    this.start = new Point(point1.x, point1.y);
    this.end = new Point(point2.x, point2.y);
    if (this.start.x === this.end.x && this.start.y === this.end.y)
      throw new Error("Points must be different");
    this.middle = new Point(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
    this.isLimited = isLimited;
    this.color = undefined;
  }

  draw(ctx, color = undefined) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    //Stroke style dealing;
    const oldColor = ctx.strokeStyle;
    if (this.color) {
      ctx.strokeStyle = this.color;
    }
    if (color) {
      ctx.strokeStyle = color;
    }
    //
    if (this.isLimited) {
      ctx.beginPath();
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.stroke();
      //Stroke style dealing
      ctx.strokeStyle = oldColor;
      return;
    }
    //is not limited
    ctx.beginPath();
    let pointMin = this.linearInterpolation(Line.isLimitedDefaultMin);
    let pointMax = this.linearInterpolation(Line.isLimitedDefaultMax);
    ctx.moveTo(pointMin.x, pointMin.y);
    ctx.lineTo(pointMax.x, pointMax.y);
    ctx.stroke();
    //Stroke style dealing
    ctx.strokeStyle = oldColor;
  }

  get slope() {
    if (this.start.x === this.end.x && this.end.y - this.start.y > 0)
      return Infinity;
    if (this.start.x === this.end.x && this.end.y - this.start.y < 0)
      return Infinity * -1;
    return (this.end.y - this.start.y) / (this.end.x - this.start.x);
  }

  getParametricEquation(asString = false) {
    const vector = this.vector;
    const point = this.start;
    if (asString) {
      return `
      x(t) = ${point.x} + ${vector.x} * t
      y(t) = ${point.y} + ${vector.y} * t
      `;
    }
    return {
      x: (t) => point.x + vector.x * t,
      y: (t) => point.y + vector.y * t,
    };
  }

  getDirectiveEquation(asString = false) {
    const m = this.slope;
    const n = this.start.y - m * this.start.x;
    if (asString) {
      return `
      y = ${m} * x + ${n}
      `;
    }
    return {
      a: m,
      b: n,
    };
  }

  getGeneralEquation(asString = false) {
    const a = this.end.y - this.start.y;
    const b = this.start.x - this.end.x;
    const c = this.end.x * this.start.y - this.start.x * this.end.y;
    if (asString) {
      return `
      ${a}x + ${b}y + ${c} = 0
      `;
    }
    return {
      a: a,
      b: b,
      c: c,
    };
  }

  getRandomPointOnLine(betweenStartAndEnd = true, minLerp = 0, maxLerp = 1) {
    if (typeof betweenStartAndEnd !== "boolean")
      throw new Error("Parametre betweenStartAndEnd must be a boolean");
    if (typeof minLerp !== "number" || typeof maxLerp !== "number")
      throw new Error("Parametres minLerp and maxLerp must be a number");
    if (minLerp > maxLerp)
      throw new Error("Parametre minLerp must be less than maxLerp");
    if (betweenStartAndEnd) {
      return this.linearInterpolation(Math.random());
    }
    return this.this.linearInterpolation(
      Math.random() * (maxLerp - minLerp) + minLerp
    );
  }

  getYCoordinate(x) {
    if (typeof x !== "number") throw new Error("Parametre x must be a number");
    if (x === this.start.x) return this.start.y;
    if (x === this.end.x) return this.end.y;
    if (this.slope === Infinity || this.slope === Infinity * -1) return null;
    return this.slope * (x - this.start.x) + this.start.y;
  }

  getPointFromXCoordinates(x) {
    if (typeof x !== "number") throw new Error("Parametre x must be a number");
    if (x === this.start.x) return new Point(x, this.start.y);
    if (x === this.end.x) return new Point(x, this.end.y);
    if (this.slope === Infinity || this.slope === Infinity * -1) return null;
    return new Point(x, this.getYCoordinate(x));
  }

  getXCoordinate(y) {
    if (typeof y !== "number") throw new Error("Parametre y must be a number");
    if (y === this.start.y) return this.start.x;
    if (y === this.end.y) return this.end.x;
    if (this.slope === 0) return null;
    return (y - this.start.y) / this.slope + this.start.x;
  }

  getPointFromYCoordinates(y) {
    if (typeof y !== "number") throw new Error("Parametre y must be a number");
    if (y === this.start.y) return new Point(this.start.x, y);
    if (y === this.end.y) return new Point(this.end.x, y);
    if (this.slope === 0) return null;
    return new Point(this.getXCoordinate(y), y);
  }

  get definitionRange() {
    //Only between start and end
    return {
      x: {
        min: Math.min(this.start.x, this.end.x),
        max: Math.max(this.start.x, this.end.x),
      },
      y: {
        min: Math.min(this.start.y, this.end.y),
        max: Math.max(this.start.y, this.end.y),
      },
    };
  }

  getPointFromYCoordinates(y) {
    if (typeof y !== "number") throw new Error("Parametre y must be a number");
    if (y === this.start.y) return new Point(this.start.x, y);
    if (y === this.end.y) return new Point(this.end.x, y);
    if (this.slope === 0) return null;
    return new Point(this.getXCoordinate(y), y);
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

  isLyingOnLineBeetweenStartAndEnd(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    if (!this.isLyingOnLine(point)) return false;
    const definitionRange = this.definitionRange;
    if (
      this.getInterPolationRate(point) >= 0 &&
      this.getInterPolationRate(point) <= 1
    )
      return true;
    return false;
  }

  getPathFromLineWithNumberOfPoints(numberOfPoints) {
    if (typeof numberOfPoints !== "number")
      throw new Error("Parametre numberOfPoints must be a number");
    if (numberOfPoints < 2)
      throw new Error("numberOfPoints must be at least 2");
    const pathArray = [];
    const howMuchToAdd = 1 / (numberOfPoints - 1);
    for (let t = 0; t < 1; t += howMuchToAdd) {
      pathArray.push(this.linearInterpolation(t));
    }
    return new Path(pathArray);
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

  getNormalLineWhichGoThroughPoint(point) {
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
