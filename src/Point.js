class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, radius = 2) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawWithText(ctx, text, radius = 2) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(text, this.x, this.y);
  }

  moveByVector(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  moveByLine(length, angle) {
    this.x += length * Math.cos(angle);
    this.y += length * Math.sin(angle);
  }

  getNewPointByLine(length, angle) {
    return new Point(
      this.x + length * Math.cos(angle),
      this.y + length * Math.sin(angle)
    );
  }

  getNewPointByVector(vector) {
    return new Point(this.x + vector.x, this.y + vector.y);
  }

  getLegthTo(point) {
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    );
  }
}

//export Point class
export default Point;
