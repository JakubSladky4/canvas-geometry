import Path from "./Path.js";
import Point from "./Point.js";
class Pencil {
  #drawCallback;
  #isDrawing;
  #isOn;
  constructor(ctx) {
    this.canvas = ctx.canvas;
    this.paths = [];
    this.setEventListeners();
    this.#isDrawing = false;
    this.#isOn = false;
  }

  setEventListeners() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    console.log("mousedown", this.isOn);
    if (!this.#isOn) return;
    this.#isDrawing = true;
    this.paths.push(new Path());
    const x = e.offsetX;
    const y = e.offsetY;
    this.paths[this.paths.length - 1].addPoint(new Point(x, y));
  }

  onMouseMove(e) {
    console.log("mousedown", this.isOn);
    if (this.#isDrawing) {
      const x = e.offsetX;
      const y = e.offsetY;
      this.paths[this.paths.length - 1].addPoint(new Point(x, y));
      this.draw();
    }
  }

  onMouseUp(e) {
    this.#isDrawing = false;
  }

  addPoint(point) {
    this.points.push(point);
  }

  draw(options = {}) {
    let fromIndex = options.from ?? 0;
    let toIndex = options.to ?? this.paths.length - 1;
    if (fromIndex < 0) fromIndex = 0;
    if (toIndex > this.paths.length - 1) toIndex = this.paths.length - 1;
    for (let i = fromIndex; i <= toIndex; i++) {
      this.paths[i].draw(this.canvas.getContext("2d"), this.color);
    }
    this.#drawCallback?.(this);
  }

  setDrawCallback(callback) {
    if (typeof callback !== "function")
      throw new Error("Callback must be a function");
    this.#drawCallback = callback;
  }

  start(color = undefined) {
    this.color = color;
    this.#isOn = true;
  }

  stop() {
    this.#isOn = false;
    this.onMouseUp();
  }

  clear(index = null) {
    if (index) {
      this.paths.splice(index, 1);
    } else {
      this.paths = [];
    }
  }
}

export default Pencil;
