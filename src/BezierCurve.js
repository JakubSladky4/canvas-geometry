import Utils from "./utils.js";
import Line from "./Line.js";
import Path from "./Path.js";

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
    if (arrayOfLines.length < 2)
      throw new Error("Array must have at least 2 lines");
    this.arrayOfLines = arrayOfLines;
    //2D array of points
    this.helpPoints = [];
    //2D array of lines
    this.helpLines = [];
    this.path = null;
  }

  drawHelpPoints(ctx, color, radius) {
    for (let i = 0; i < this.helpPoints.length; i++) {
      for (let j = 0; j < this.helpPoints[i].length; j++) {
        if (this.helpPoints[i].length < 2) break;
        this.helpPoints[i][j].draw(ctx, color, radius);
      }
    }
  }

  drawHelpLines(ctx, color) {
    for (let i = 0; i < this.helpLines.length; i++) {
      this.helpLines[i].draw(ctx, color);
    }
  }

  drawHelper(ctx, color, radius) {
    this.drawHelpPoints(ctx, color, radius);
    this.drawHelpLines(ctx, color);
  }

  getPath(t_from, t_to, numberOfPoints) {
    if (typeof t_from !== "number" || typeof t_to !== "number")
      throw new Error("Parameters must be a number");
    if (t_from > t_to) {
      const temp = t_from;
      t_from = t_to;
      t_to = temp;
    }
    if (typeof numberOfPoints !== "number")
      throw new Error("Parameter must be a number");
    const arrayOfPoints = [];
    const step = (t_to - t_from) / numberOfPoints;
    for (let t = t_from; t <= t_to; t += step) {
      arrayOfPoints.push(this.lerp(t));
    }
    this.path = new Path(arrayOfPoints);
    return this.path;
  }

  draw(ctx, t_from, t_to, color = undefined) {
    if (!(ctx instanceof CanvasRenderingContext2D))
      throw new Error("Parameter must be a context");
    const oldColor = ctx.strokeStyle;
    if (this.color) {
      ctx.strokeStyle = this.color;
    }
    if (color) {
      ctx.strokeStyle = color;
    }
    this.getPath(t_from, t_to, 1000);
    this.path.draw(ctx, color);
    ctx.strokeStyle = oldColor;
  }

  constructHelpPointsAndHelpLines(t) {
    this.helpPoints = [[]];
    this.helpLines = [];
    for (let i = 0; i < this.arrayOfLines.length; i++) {
      const point = this.arrayOfLines[i].lerp(t);
      this.helpPoints[0].push(point);
    }
    //create help points
    while (true) {
      //condition to break
      const lastArrayInHelpPoints = this.helpPoints[this.helpPoints.length - 1];
      if (lastArrayInHelpPoints.length <= 1) break;
      //end of condition to break
      const newHelpPoints = [];
      for (let i = 0; i < lastArrayInHelpPoints.length - 1; i++) {
        const point1 = lastArrayInHelpPoints[i];
        const point2 = lastArrayInHelpPoints[i + 1];
        const newLine = new Line(point1, point2);
        this.helpLines.push(newLine);
        const newPoint = newLine.lerp(t);
        newHelpPoints.push(newPoint);
      }
      this.helpPoints.push(newHelpPoints);
    }
  }

  lerp(t) {
    if (typeof t !== "number") {
      throw new Error("Parameter must be a number");
    }
    this.constructHelpPointsAndHelpLines(t);
    return this.helpPoints[this.helpPoints.length - 1][0];
  }
}

export default BezierCurve;
