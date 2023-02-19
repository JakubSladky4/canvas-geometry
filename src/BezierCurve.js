import Utils from "./utils.js";
import Point from "./Point.js";
import Line from "./Line.js";

class BezierCurve {
  constructor(arrayOfLines) {
    this.color = undefined;
    this.type = "BezierCurve";
    this.id = Utils.getId();
    for (let i = 0; i < arrayOfLines.length; i++) {
      if (!(arrayOfLines[i] instanceof Line)) {
        throw new Error("Parameter must be an array of lines");
      }
    }
    this.arrayOfLines = arrayOfLines;
    this.helpPoints = [];
    this.helpLines = [];
  }

  drawHelpPoints(ctx, color, radius) {
    for (let i = 0; i < this.helpPoints.length; i++) {
      this.helpPoints[i].draw(ctx, color, radius);
    }
  }

  drawHelper(ctx, color, radius) {
    this.drawHelpPoints(ctx, color, radius);
    this.drawHelpLines(ctx, color);
  }

  drawHelpLines(ctx, color) {
    for (let i = 0; i < this.helpLines.length; i++) {
      this.helpLines[i].draw(ctx, color);
    }
  }

  lerp(t) {
    if (typeof t !== "number") {
      throw new Error("Parameter must be a number");
    }
    this.helpPoints = [];
    //create help points
    for (let i = 0; i < this.arrayOfLines.length; i++) {
      this.helpPoints.push(this.arrayOfLines[i].lerp(t));
    }
    //create lines between help points
    this.helpLines = [];
    for (let i = 0; i < this.helpPoints.length - 1; i++) {
      this.helpLines.push(new Line(this.helpPoints[i], this.helpPoints[i + 1]));
    }
    return this.helpLines[0].lerp(t);
  }
}

export default BezierCurve;
