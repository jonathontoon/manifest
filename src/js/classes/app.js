import { MARGIN } from "../globals";

import Main from "./main";
import Canvas from "./canvas";
import Container from "./container";

export default class App {
  constructor () {
    this._width = (window.innerWidth - MARGIN) - 1;
    this._height = (window.innerHeight - MARGIN) + 1;

    this._main = new Main(window.innerWidth, window.innerHeight);
    this._canvas = new Canvas(MARGIN / 2, MARGIN / 2, this._width, this._height);
    this._container = new Container(MARGIN / 2, MARGIN / 2, this._width, this._height);

    this._updateSize = this._updateSize.bind(this);
    this._updateElements = this._updateElements.bind(this);

    this.setup = this.setup.bind(this);

    window.addEventListener("resize", this._updateElements, false);
  }

  /*
		Private methods
	*/

  _updateSize () {
    this._width = (window.innerWidth - MARGIN) - 1;
    this._height = (window.innerHeight - MARGIN) + 1;
  }

  _updateElements (e) {
    e.preventDefault();

    this._main.updateDimensions(window.innerWidth, window.innerHeight);

    this._updateSize();

    this._canvas.updateDimensions(MARGIN / 2, MARGIN / 2, this._width, this._height);
    this._container.updateDimensions(MARGIN / 2, MARGIN / 2, this._width, this._height);
  };

  /*
		Public methods
	*/

  setup () {
    this._main.appendChild(this._canvas.element);
    this._main.appendChild(this._container.element);

    document.body.appendChild(this._main.element);
  };
};
