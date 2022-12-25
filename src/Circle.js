import Point from "./Point.js";
import Path from "./Path.js";
import Line from "./Line.js";
class Circle {
  constructor(point, radius) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    if (typeof radius !== "number")
      throw new Error("Parametre radius must be a number");
    this.centre = new Point(point.x, point.y);
    this.radius = radius;
    this.color = undefined;
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
    ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }

  drawPartial(ctx, startAngle, endAngle, color = undefined) {
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
    ctx.arc(
      this.centre.x,
      this.centre.y,
      this.radius,
      startAngle,
      endAngle,
      true
    );
    ctx.stroke();
    ctx.strokeStyle = oldColor;
  }

  getCentralEquation(asString = false) {
    if (asString) {
      return `(x - ${this.centre.x})*(x - ${this.centre.x}) + (y - ${this.centre.y}) * (y - ${this.centre.y}) = ${this.radius}`;
    }
    return {
      m: this.centre.x,
      n: this.centre.y,
      r: this.radius,
    };
  }

  getGeneralEquation(asString = false) {
    if (asString) {
      return `2 * x + 2 * y - ${2 * this.centre.x} * x - ${
        2 * this.centre.y
      } * y + ${
        Math.pow(this.centre.x, 2) +
        Math.pow(this.centre.y, 2) -
        Math.pow(this.radius, 2)
      } = 0`;
    }
    return {
      m: this.centre.x,
      n: this.centre.x,
      p:
        Math.pow(this.centre.x, 2) +
        Math.pow(this.centre.y, 2) -
        Math.pow(this.radius, 2),
    };
  }

  isLyngOnCircle(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    return (
      Math.pow(point.x - this.centre.x, 2) +
        Math.pow(point.y - this.centre.y, 2) ===
      Math.pow(this.radius, 2)
    );
  }

  get definitionRange() {
    return {
      x: { min: this.centre.x - this.radius, max: this.centre.x + this.radius },
      y: { min: this.centre.y - this.radius, max: this.centre.y + this.radius },
    };
  }

  getIntersectionWithLine(line) {
    if (!(line instanceof Line))
      throw new Error("Parametre line must be a Line");
    const distance = line.getDistanceFromPoint(this.centre);
    if (distance > this.radius) return null;
    if (distance === this.radius) {
      const point = line.getPointOnLineWhichIsClosestToPoint(point)(
        this.radius
      );
      return [point];
    }
    //There are two intersection points
    const { m, n, r } = this.getCentralEquation();
    const lineEq = line.getDirectiveEquation();
    //Circle: (x - m)^2 + (y - n)^2 = r^2
    //Line: y = ax + b
    //x = (a^2 * m - a * n + b) / (a^2 + 1)
    //y = (a * m + n + a * b) / (a^2 + 1)
    var a = 1 + Math.pow(line.slope, 2);
    var b = -m * 2 + line.slope * (lineEq.b - n) * 2;
    var c = Math.pow(m, 2) + Math.pow(lineEq.b - n, 2) - Math.pow(r, 2);
    var intersections = [
      (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
    ];
    for (var i = 0; i < intersections.length; i++) {
      intersections[i] = new Point(
        intersections[i],
        line.slope * intersections[i] + lineEq.b
      );
    }
    return intersections;
  }

  isTangentLine(line) {
    if (!(line instanceof Line))
      throw new Error("Parametre line must be a Line");
    const distance = line.getDistanceFromPoint(this.centre);
    return distance === this.radius;
  }

  getTangetLine(point) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    if (!this.isLyngOnCircle(point)) throw new Error("Point must be on circle");
    //Ensure that line will have just one intersection point

    return normaLizedLine;
  }

  getYFromXCoordinates(x) {
    //not point
    if (typeof x !== "number") throw new Error("Parametre must be a number");
    //Check if it is in definition range
    if (x < this.definitionRange.x.min || x > this.definitionRange.x.max)
      return null;
    const y1 =
        this.centre.y +
        Math.sqrt(Math.pow(this.radius, 2) - Math.pow(x - this.centre.x, 2)),
      y2 =
        this.centre.y -
        Math.sqrt(Math.pow(this.radius, 2) - Math.pow(x - this.centre.x, 2));
    if (y1 === y2) return [y1];
    return [y1, y2];
  }

  getXFromYCoordinates(y) {
    //not point
    if (typeof y !== "number") throw new Error("Parametre must be a number");
    //Check if it is in definition range
    if (y < this.definitionRange.y.min || y > this.definitionRange.y.max)
      return null;
    const x1 =
        this.centre.x +
        Math.sqrt(Math.pow(this.radius, 2) - Math.pow(y - this.centre.y, 2)),
      x2 =
        this.centre.x -
        Math.sqrt(Math.pow(this.radius, 2) - Math.pow(y - this.centre.y, 2));
    if (x1 === x2) return [x1];
    return [x1, x2];
  }

  getPointsFromXCoodinate(x) {
    if (typeof x !== "number") throw new Error("Parametre must be a number");
    if (x < this.definitionRange.x.min || x > this.definitionRange.x.max)
      return null;
    const y = this.getYFromXCoordinates(x);
    return y.map((y) => new Point(x, y));
  }

  getPointsFromYCoodinate(y) {
    if (typeof y !== "number") throw new Error("Parametre must be a number");
    if (y < this.definitionRange.y.min || y > this.definitionRange.y.max)
      return null;
    const x = this.getXFromYCoordinates(y);
    return x.map((x) => new Point(x, y));
  }

  getPointsOnCircle(numberOfPoints) {
    if (typeof numberOfPoints !== "number")
      throw new Error("Parametre must be a number");
    const points = [];
    const angle = (2 * Math.PI) / numberOfPoints;
    for (let i = 0; i < numberOfPoints; i++) {
      points.push(
        this.centre.getNewPointMovedByLengthAndAngle(this.radius, angle * i)
      );
    }
    return points;
  }

  getPathFromCircle(numberOfPoints) {
    if (typeof numberOfPoints !== "number")
      throw new Error("Parametre must be a number");
    const points = getPointsOnCircle(numberOfPoints);
    return new Path(points);
  }

  fill(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export default Circle;
