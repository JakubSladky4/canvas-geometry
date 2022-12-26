import Point from "./Point.js";
import Line from "./Line.js";
import Circle from "./Circle.js";
class Intersection {
  static supportedShapes = ["Line", "Circle", "Rect", "Triangle", "Path"];
  #point;
  #originShape;
  #originalSubShape;
  #affectedShape;
  #affectedSubShape;
  #lerpFromOrigin;
  #lerpFromAffected;
  #isInfinite;

  constructor(
    point,
    originShape,
    affectedShape,
    originalSubShape,
    affectedSubShape
  ) {
    //point must be a Point
    this.#point = point;
    this.#originShape = originShape;
    this.#affectedShape = affectedShape;
    this.#originalSubShape = originalSubShape;
    this.#affectedSubShape = affectedSubShape;
    this.#lerpFromOrigin = null;
    this.#lerpFromAffected = null;
    this.#isInfinite = false;
    if (point === Infinity) {
      this.#isInfinite = true;
    }
  }

  get point() {
    return this.#point;
  }

  get isInfinite() {
    return this.#isInfinite;
  }

  get originalSubShape() {
    return this.#originalSubShape;
  }

  get affectedSubShape() {
    return this.#affectedSubShape;
  }

  get lerpFromOrigin() {}

  get lerpFromAffected() {}

  set lerpFromOrigin(value) {
    this.#lerpFromOrigin = value;
  }

  set lerpFromAffected(value) {
    this.#lerpFromAffected = value;
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
          const intersection = new Intersection(
            point,
            shape1,
            shape2,
            trueShape_1[i],
            trueShape_2[j]
          );
          if (trueShape_1[i].type === "Line") {
            intersection.lerpFromOrigin = trueShape_1[j].getLerp(point);
          }
          if (trueShape_2[j].type === "Line") {
            intersection.lerpFromAffected = trueShape_2[j].getLerp(point);
          }
          interSectionArray.push(intersection);
        });
      }
    }
    return interSectionArray;
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
    if (shape.lines) return shape.lines;
    return [shape];
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
    debugger;
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
    //Circle: (x - m)^2 + (y - n)^2 = r^2
    //Line: y = ax + b
    //x = (a^2 * m - a * n + b) / (a^2 + 1)
    //y = (a * m + n + a * b) / (a^2 + 1)
    var a = 1 + Math.pow(affectedShape.slope, 2);
    var b = -m * 2 + affectedShape.slope * (lineEq.b - n) * 2;
    var c = Math.pow(m, 2) + Math.pow(lineEq.b - n, 2) - Math.pow(r, 2);
    var intersections = [
      (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
    ];
    for (var i = 0; i < intersections.length; i++) {
      intersections[i] = new Point(
        intersections[i],
        affectedShape.slope * intersections[i] + lineEq.b
      );
    }
    return intersections;
  }

  static getIntersectionCircleCircle(originShape, affectedShape) {}
}

export default Intersection;
