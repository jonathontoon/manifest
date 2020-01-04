import { GRID_SIZE } from "../globals";

export default class CanvasElement {
  constructor(t, l, w, h) {
    this._createElement = this._createElement.bind(this);
    this._updateGrid = this._updateGrid.bind(this);

    this.appendChild = this.appendChild.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this._element = this._createElement(t, l, w, h);

    this._updateGrid(w, h);
  }

  /*
		Get / Set methods
	*/

  get element() {
    return this._element;
  };

  /*
		Private methods
	*/

  _createElement(t, l, w, h) {
    const el = document.createElement("canvas");
    el.id = "grid";
    el.width = w;
    el.height = h;
    el.style.top = `${t}px`;
    el.style.left = `${l}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  
    return el;
  }

  _updateGrid(w, h) {
    const context = this._element.getContext("2d");

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

  appendChild(childElement) {
    this._element.appendChild(childElement);
  };

  updatePosition(t, l) {
    this._element.style.top = `${t}px`;
    this._element.style.left = `${l}px`;
  };

  updateDimensions(w, h) {
    this._element.width = w;
    this._element.height = h;

    this._element.style.width = `${w}px`;
    this._element.style.height = `${h}px`;

    this._updateGrid(w, h, GRID_SIZE);
  };
};
