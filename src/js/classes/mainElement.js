import { MARGIN } from "../globals";

import CanvasElement from "./canvasElement";
import BoardElement from "./boardElement";

export default class MainElement {
  constructor() {
    this._width = (window.innerWidth - MARGIN) - 1;
    this._height = (window.innerHeight - MARGIN) + 1;

    this._createElement = this._createElement.bind(this);
    this._updateElements = this._updateElements.bind(this);

    this._element = this._createElement(window.innerWidth, window.innerHeight);
    this._canvasElement = new CanvasElement(MARGIN / 2, MARGIN / 2, this._width, this._height);
    this._boardElement = new BoardElement(MARGIN / 2, MARGIN / 2, this._width, this._height);

    this._element.appendChild(this._canvasElement.element);
    this._element.appendChild(this._boardElement.element);

    window.addEventListener("resize", this._updateElements, false);
  }

  get element() {
    return this._element;
  };

  /*
		Private methods
	*/

  _createElement(w, h) {
    const el = document.createElement("main");
    el.id = "app";
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;

    return el;
  }

  _updateElements(e) {
    e.preventDefault();

    this._element.style.width = window.innerWidth;
    this._element.style.height = window.innerHeight;
    
    this._width = (window.innerWidth - MARGIN) - 1;
    this._height = (window.innerHeight - MARGIN) + 1;

    this._canvasElement.updatePosition(MARGIN / 2, MARGIN / 2);
    this._canvasElement.updateDimensions(this._width, this._height);
    this._boardElement.updateDimensions(MARGIN / 2, MARGIN / 2, this._width, this._height);
  };
};
