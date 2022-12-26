import Point from "./Point.js";
import Line from "./Line.js";
import Circle from "./Circle.js";

class IntersectionPoint {
  #originSubShape;
  #affectedSubShape;
  #lerpFromOrigin;
  #lerpFromAffected;
  #point;
  #x;
  #y;
  constructor(point, originSubShape, affectedSubShape) {
    if (!(point instanceof Point))
      throw new Error("Parametre point must be a Point");
    this.#point = point;
    this.#x = point.x;
    this.#y = point.y;
    this.#originSubShape = originSubShape;
    this.#affectedSubShape = affectedSubShape;
    this.#lerpFromOrigin = originSubShape?.getLerp(point);
    this.#lerpFromAffected = affectedSubShape?.getLerp(point);
  }

  get point() {
    return this.#point;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get originSubShape() {
    return this.#originSubShape;
  }

  get affectedSubShape() {
    return this.#affectedSubShape;
  }

  get lerpFromOrigin() {
    return this.#lerpFromOrigin;
  }

  get lerpFromAffected() {
    return this.#lerpFromAffected;
  }

  get isTrue() {
    if (this.#lerpFromOrigin === null || this.#lerpFromAffected === null)
      return false;
    if (this.#lerpFromOrigin < 0 || this.#lerpFromOrigin > 1) return false;
    if (this.#lerpFromAffected < 0 || this.#lerpFromAffected > 1) return false;
    return true;
  }

  draw(ctx, color = undefined, radius = undefined) {
    this.point.draw(ctx, color, radius);
  }
}

class Intersection {
  static supportedShapes = ["Line", "Circle", "Rect", "Triangle", "Path"];
  #intersectionPoints;
  #originShape;
  #affectedShape;

  constructor(IntersectionPoints, originShape, affectedShape) {
    //IntersectionPoints must be and array of IntersectionPoint
    if (!Array.isArray(IntersectionPoints))
      throw new Error("Parametre must be an array");
    if (IntersectionPoints.length === 0) return null;

    this.#intersectionPoints = IntersectionPoints;
    this.#originShape = originShape;
    this.#affectedShape = affectedShape;
  }

  get intersections() {
    return this.#intersectionPoints;
  }

  get originShape() {
    return this.#originShape;
  }

  get originTrueShape() {
    return Intersection.getTrueShape(this.#originShape);
  }

  get affectedShape() {
    return this.#affectedShape;
  }

  get affectedTrueShape() {
    return Intersection.getTrueShape(this.#affectedShape);
  }

  draw(ctx, color = undefined, radius = undefined) {
    this.#intersectionPoints.forEach((point) => {
      if (point.isTrue) {
        point.draw(ctx, color, radius);
      }
    });
  }

  drawAll(ctx, color = undefined, radius = undefined) {
    this.#intersectionPoints.forEach((point) => {
      point.draw(ctx, color, radius);
    });
  }

  static getIntersection(shape1, shape2) {
    //Checking basic conditions
    if (shape1 === shape2)
      throw new Error("Origin and affected shape cannot be the same");
    if (!this.supportedShapes.includes(shape1.type))
      throw new Error("Origin shape is not supported");
    if (!this.supportedShapes.includes(shape2.type))
      throw new Error("Affected shape is not supported");
    //Getting true shapes
    const trueShape_1 = Intersection.getTrueShape(shape1);
    const trueShape_2 = Intersection.getTrueShape(shape2);

    // Getting intersections point
    const interSectionArray = [];
    for (let i = 0; i < trueShape_1.length; i++) {
      for (let j = 0; j < trueShape_2.length; j++) {
        const point = Intersection.chooseAndDoRightIntersectionFunction(
          trueShape_1[i],
          trueShape_2[j]
        );
        point.forEach((point) => {
          const intersection = new IntersectionPoint(
            point,
            trueShape_1[i],
            trueShape_2[j]
          );
          interSectionArray.push(intersection);
        });
      }
    }
    if (interSectionArray.length === 0) return null;
    return new Intersection(interSectionArray, shape1, shape2);
  }

  static chooseAndDoRightIntersectionFunction(shape1, shape2) {
    if (shape1.type === "Line" && shape2.type === "Line") {
      const intersection = Intersection.getIntersectionLineLine(shape1, shape2);
      return intersection;
    }
    if (shape1.type === "Circle" && shape2.type === "Line") {
      const intersection = Intersection.getIntersectionCircleLine(
        shape1,
        shape2
      );
      return intersection;
    }
    if (shape1.type === "Line" && shape2.type === "Circle") {
      const intersection = Intersection.getIntersectionCircleLine(
        shape2,
        shape1
      );
      return intersection;
    }
    if (shape1.type === "Circle" && shape2.type === "Circle") {
      const intersection = Intersection.getIntersectionCircleCircle(
        shape1,
        shape2
      );
      return intersection;
    }
  }

  static getTrueShape(shape) {
    return shape.simplify();
  }
  //general intersection methods

  static getIntersectionLineLine(originShape, affectedShape) {
    if (originShape.isParallelTo(affectedShape)) return [Infinity];
    const generalEquation1 = originShape.getGeneralEquation();
    const generalEquation2 = affectedShape.getGeneralEquation();
    const a1 = generalEquation1.a;
    const b1 = generalEquation1.b;
    const c1 = generalEquation1.c;
    const a2 = generalEquation2.a;
    const b2 = generalEquation2.b;
    const c2 = generalEquation2.c;
    const x = (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1);
    const y = (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1);
    if (isNaN(x) || isNaN(y)) return [];
    const point = new Point(x, y);
    return [point];
  }

  static getIntersectionCircleLine(originShape, affectedShape) {
    const distance = affectedShape.getDistanceFromPoint(originShape.centre);
    if (distance > originShape.radius) return [];
    if (distance === originShape.radius) {
      const point = affectedShape.getPointOnLineWhichIsClosestToPoint(point)(
        originShape.radius
      );
      return [point];
    }
    //There are two intersection points
    const { m, n, r } = originShape.getCentralEquation();
    const lineEq = affectedShape.getDirectiveEquation();
    if (lineEq.a === undefined) {
      //Line is vertical
      const x = affectedShape.start.x;
      const y1 = Math.sqrt(Math.pow(r, 2) - Math.pow(x - m, 2)) + n;
      const y2 = -Math.sqrt(Math.pow(r, 2) - Math.pow(x - m, 2)) + n;
      return [new Point(x, y1), new Point(x, y2)];
    }
    //Circle: (x - m)^2 + (y - n)^2 = r^2
    //Line: y = ax + b
    //x = (a^2 * m - a * n + b) / (a^2 + 1)
    //y = (a * m + n + a * b) / (a^2 + 1)
    var a = 1 + Math.pow(lineEq.a, 2);
    var b = -m * 2 + lineEq.a * (lineEq.b - n) * 2;
    var c = Math.pow(m, 2) + Math.pow(lineEq.b - n, 2) - Math.pow(r, 2);
    var intersections = [
      (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
    ];
    for (var i = 0; i < intersections.length; i++) {
      intersections[i] = new Point(
        intersections[i],
        lineEq.a * intersections[i] + lineEq.b
      );
    }
    return intersections;
  }

  static getIntersectionCircleCircle(originShape, affectedShape) {
    const distance = originShape.centre.getLegthTo(affectedShape.centre);
    if (distance > originShape.radius + affectedShape.radius) return [];
    if (distance < Math.abs(originShape.radius - affectedShape.radius))
      return [];
    if (distance === originShape.radius + affectedShape.radius) {
      //There is one intersection point
      const lineBetweenCentres = new Line(
        originShape.centre,
        affectedShape.centre
      );
      const shareOfRadius = originShape.radius / distance;
      const point = lineBetweenCentres.lerp(shareOfRadius);
      return [point];
    }
    //There are two intersection points
    const originCetalEquation = originShape.getCentralEquation();
    const m1 = originCetalEquation.m;
    const n1 = originCetalEquation.n;
    const r1 = originCetalEquation.r;
    const affectedCentralEquation = affectedShape.getCentralEquation();
    const m2 = affectedCentralEquation.m;
    const n2 = affectedCentralEquation.n;
    const r2 = affectedCentralEquation.r;
    //Circle 1: (x - m1)^2 + (y - n1)^2 = r1^2
    //Circle 2: (x - m2)^2 + (y - n2)^2 = r2^2
    const d = Math.sqrt(Math.pow(m1 - m2, 2) + Math.pow(n1 - n2, 2));
    const l = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
    const h = Math.sqrt(Math.pow(r1, 2) - Math.pow(l, 2));
    const x1 = (l / d) * (m2 - m1) + (h / d) * (n2 - n1) + m1;
    const x2 = (l / d) * (m2 - m1) - (h / d) * (n2 - n1) + m1;
    const y1 = (l / d) * (n2 - n1) - (h / d) * (m2 - m1) + n1;
    const y2 = (l / d) * (n2 - n1) + (h / d) * (m2 - m1) + n1;
    return [new Point(x1, y1), new Point(x2, y2)];
  }
}

export default Intersection;
