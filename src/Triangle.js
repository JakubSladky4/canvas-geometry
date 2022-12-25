import Point from "./Point";
import Vector from "./Vector";
import Line from "./Line";
import Circle from "./Circle";
class Triangle {
  constructor(p1, p2, p3) {
    //p1 must be a point
    if (!(p1 instanceof Point)) throw new Error("Parameter p1 must be a Point");
    //p2 must be a point or a vector
    if (!(p2 instanceof Point) && !(p2 instanceof Vector)) {
      throw new Error("Parameter p2 must be a Point or a Vector");
    }
    //p3 must be a point or a vector
    if (!(p3 instanceof Point) && !(p3 instanceof Vector)) {
      throw new Error("Parameter p3 must be a Point or a Vector");
    }
    //p2 and p3 must be both either points or vectors
    if (
      (p2 instanceof Point && p3 instanceof Vector) ||
      (p2 instanceof Vector && p3 instanceof Point)
    ) {
      throw new Error(
        "Parameters p2 and p3 must be either both Points or both Vectors"
      );
    }
    //p2 and p3 are points
    this.point1 = p1;
    this.point2 = p2;
    this.point3 = p3;
    //p2 and p3 are vectors
    if (p2 instanceof Vector && p3 instanceof Vector) {
      this.point2 = new Point(p1.x + p2.x, p1.y + p2.y);
      this.point3 = new Point(p1.x + p3.x, p1.y + p3.y);
    }
  }

  draw(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.moveTo(this.point1.x, this.point1.y);
    ctx.lineTo(this.point2.x, this.point2.y);
    ctx.lineTo(this.point3.x, this.point3.y);
    ctx.lineTo(this.point1.x, this.point1.y);
    ctx.stroke();
  }

  drawCircleInside(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const circle = this.insideCircle;
    circle.draw(ctx);
  }

  fill(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    ctx.beginPath();
    ctx.moveTo(this.point1.x, this.point1.y);
    ctx.lineTo(this.point2.x, this.point2.y);
    ctx.lineTo(this.point3.x, this.point3.y);
    ctx.lineTo(this.point1.x, this.point1.y);
    ctx.fill();
  }

  get insideCircle() {
    const [line1, line2, line3] = this.weighbridges;
    const center = line1.getIntersectionWith(line2);
    const radius = (2 * this.area) / this.perimeter;
    return new Circle(center, radius);
  }

  drawCircleOutside(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const circle = this.outsideCircle;
    circle.draw(ctx);
  }

  get outsideCircle() {
    const [hight1, hight2] = this.hights;
    const center = hight1.getIntersectionWith(hight2);
    const radius = center.getLegthTo(this.point1);
    return new Circle(center, radius);
  }

  drawTriangleInside(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    //Get mindles of lines
    const [line1, line2, line3] = this.lines;
    //draw lines
    ctx.beginPath();
    ctx.moveTo(line1.start.x, line1.start.y);
    ctx.lineTo(line1.end.x, line1.end.y);
    ctx.moveToTo(line2.start.x, line2.start.y);
    ctx.lineTo(line2.end.x, line2.end.y);
    ctx.moveToTo(line3.start.x, line3.start.y);
    ctx.lineTo(line3.end.x, line3.end.y);
    ctx.stroke();
  }

  drawWeighbridges(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const [line1, line2, line3] = this.weighbridges;
    //draw the triangle
    ctx.beginPath();
    ctx.moveTo(line1.start.x, line1.start.y);
    ctx.lineTo(line1.end.x, line1.end.y);
    ctx.moveToTo(line2.start.x, line2.start.y);
    ctx.lineTo(line2.end.x, line2.end.y);
    ctx.moveToTo(line3.start.x, line3.start.y);
    ctx.lineTo(line3.end.x, line3.end.y);
    ctx.stroke();
  }

  get isEquilateral() {
    const [line1, line2, line3] = this.lines;
    return line1.length === line2.length && line2.length === line3.length;
  }

  get isIsosceles() {
    const [line1, line2, line3] = this.lines;
    let howManyEqual = 0;
    if (line1.length === line2.length) howManyEqual++;
    if (line2.length === line3.length) howManyEqual++;
    if (line3.length === line1.length) howManyEqual++;
    return howManyEqual === 1;
  }

  get isRight() {
    const [angle1, angle2, angle3] = this.angles;
    return angle1 === 90 || angle2 === 90 || angle3 === 90;
  }

  get angles() {
    const [line1, line2, line3] = this.lines;
    return [
      line1.getAngleToLine(line2),
      line2.getAngleToLine(line3),
      line3.getAngleToLine(line1),
    ];
  }

  get middle() {
    const weighbridges = this.weighbridges;
    const point = weighbridges[0].getIntersectionPoint(weighbridges[1]);
    return point;
  }

  get weighbridges() {
    const line3 = new Line(
      new Line(this.point1, this.point2).middle,
      this.point3
    );
    const line2 = new Line(
      new Line(this.point1, this.point3).middle,
      this.point2
    );
    const line1 = new Line(
      new Line(this.point2, this.point3).middle,
      this.point1
    );
    return [line1, line2, line3];
  }

  get area() {
    //Heron's formula
    const [line1, line2, line3] = this.lines;
    const s = this.perimeter / 2;
    return Math.sqrt(
      s * (s - line1.length) * (s - line2.length) * (s - line3.length)
    );
  }

  get hypotenuse() {
    if (!this.isRight) return null;
    //return the longest line;
    let longestLine = this.lines[0];
    this.lines.forEach((line) => {
      if (line.length > longestLine.length) longestLine = line;
    });
    return longestLine;
  }

  get hights() {
    const [line1, line2, line3] = this.lines;
    return [
      new Line(
        this.point3,
        line1.getPointOnLineWhichIsClosestToPoint(this.point3)
      ),
      new Line(
        this.point1,
        line1.getPointOnLineWhichIsClosestToPoint(this.point1)
      ),
      new Line(
        this.point2,
        line1.getPointOnLineWhichIsClosestToPoint(this.point2)
      ),
    ];
  }

  get perimeter() {
    const [line1, line2, line3] = this.lines;
    return line1.length + line2.length + line3.length;
  }

  get lines() {
    return [
      new Line(this.point1, this.point2),
      new Line(this.point2, this.point3),
      new Line(this.point3, this.point1),
    ];
  }

  get points() {
    return [this.point1, this.point2, this.point3];
  }
}

export default Triangle;
