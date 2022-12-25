class Path {
  constructor(arrayOfPoints = []) {
    if (!Array.isArray(arrayOfPoints)) throw new Error("Path must be an array");
    this._path = arrayOfPoints;
  }

  addPoint(point) {
    this._path.push(point);
  }

  get length() {
    return this._path.length;
  }

  getPoint(index) {
    return this._path[index];
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this._path[0].x, this._path[0].y);
    for (let i = 1; i < this._path.length; i++) {
      ctx.lineTo(this._path[i].x, this._path[i].y);
    }
    ctx.stroke();
  }

  drawFromTo(ctx, from = 0, to = this._path.length - 1) {
    if (from < 0 || from >= this._path.length)
      throw new Error("from is out of range");
    if (to < 0) throw new Error("to is out of range");
    if (to >= this._path.length) to = this._path.length - 1;
    ctx.beginPath();
    ctx.moveTo(this._path[from].x, this._path[from].y);
    for (let i = from; i <= to; i++) {
      ctx.lineTo(this._path[i].x, this._path[i].y);
    }
    ctx.stroke();
  }
}

export default Path;
