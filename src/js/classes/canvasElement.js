import { GRID_SIZE } from "../globals";
import Element from "./element";

export default class CanvasElement extends Element {
  constructor(top, left, width, height) {
    super("canvas");

    this.draw = this.draw.bind(this);

    this.id = "grid";

    this.width = width;
    this.height = height;

    this.style("top", `${top}px`);
    this.style("left", `${left}px`);

    this.style("width", `${width}px`);
    this.style("height", `${height}px`);

    this.draw(width, height);
  }

  // Public methods

  draw(width, height) {
    const context = this._element.getContext("2d");

    for (let x = 0; x <= width; x += GRID_SIZE) {
      for (let y = 0; y <= height; y += GRID_SIZE) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.beginPath();
        context.rect(x, y, 1, 1);
        context.fill();
      }
    }
  }
};
