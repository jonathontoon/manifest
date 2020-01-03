import { GRID_SIZE } from "../globals";
import { createCanvasElement } from "../elements";

export default class Canvas {
  constructor (t, l, w, h) {
    this._canvasElement = createCanvasElement(t, l, w, h);

    this._updateGrid = this._updateGrid.bind(this);

    this.appendChild = this.appendChild.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this._updateGrid(w, h);
  }

  /*
		Get / Set methods
	*/

  get element () {
    return this._canvasElement;
  };

  /*
		Private methods
	*/

  _updateGrid (w, h) {
    const context = this._canvasElement.getContext("2d");

    for (let x = 0; x <= w; x += GRID_SIZE) {
      for (let y = 0; y <= h; y += GRID_SIZE) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.beginPath();
        context.rect(x, y, 1, 1);
        context.fill();
      }
    }
  }

  /*
		Public methods
	*/

  appendChild (childElement) {
    this._canvasElement.appendChild(childElement);
  };

  updateDimensions (t, l, w, h) {
    this._canvasElement.width = w;
    this._canvasElement.height = h;

    this._canvasElement.style.top = `${t}px`;
    this._canvasElement.style.left = `${l}px`;
    this._canvasElement.style.width = `${w}px`;
    this._canvasElement.style.height = `${h}px`;

    this._updateGrid(w, h, GRID_SIZE);
  };
};
