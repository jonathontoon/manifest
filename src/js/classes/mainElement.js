import { MARGIN } from "../globals";

import Element from "./element";
import CanvasElement from "./canvasElement";
import BoardElement from "./boardElement";

export default class MainElement extends Element {
  constructor() {
    super("main");

    this._handeResize = this._handeResize.bind(this);

    this.attribute("id", "app");

    this._canvasElement = new CanvasElement(MARGIN / 2, MARGIN / 2, this._width, this._height);
    this._boardElement = new BoardElement(MARGIN / 2, MARGIN / 2, this._width, this._height);

    this.appendElement(this._canvasElement.element);
    this.appendElement(this._boardElement.element);

    this._handeResize();

    window.addEventListener("resize", this._handeResize, false);
  };

  _handeResize() {
    this.style("width", `${window.innerWidth}px`);
    this.style("height", `${window.innerHeight}px`);

    const width = (window.innerWidth - MARGIN) - 1;
    const height = (window.innerHeight - MARGIN) + 1;

    this._canvasElement.attribute("width", width);
    this._canvasElement.attribute("height", height);

    this._canvasElement.style("top", `${MARGIN / 2}px`);
    this._canvasElement.style("left", `${MARGIN / 2}px`);
    this._canvasElement.style("width", `${width}px`);
    this._canvasElement.style("height", `${height}px`);
    this._canvasElement.draw(width, height);

    this._boardElement.style("top", `${MARGIN / 2}px`);
    this._boardElement.style("left", `${MARGIN / 2}px`);
    this._boardElement.style("width", `${width}px`);
    this._boardElement.style("height", `${height}px`);
  }
};
