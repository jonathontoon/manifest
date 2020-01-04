import { snapToGrid } from "../utils";
import { GRID_SIZE } from "../globals";

import MemoElement from "./memoElement";
import SelectionElement from "./selectionElement";

export default class BoardElement {
  constructor(t, l, w, h) {
    this._createMode = false;
    this._initialMouse = { x: 0, y: 0 };
    this._currentMouse = { x: 0, y: 0 };
    this._memoElements = [];

    this._createElement = this._createElement.bind(this);

    this._appendSelectionElement = this._appendSelectionElement.bind(this);
    this._removeSelectionElement = this._removeSelectionElement.bind(this);

    this._handleCreateStart = this._handleCreateStart.bind(this);
    this._handleCreateMove = this._handleCreateMove.bind(this);
    this._handleCreateEnd = this._handleCreateEnd.bind(this);
    this._invalidateEvents = this._invalidateEvents.bind(this);

    this.updatePosition = this.updatePosition.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this._element = this._createElement(t, l, w, h);
    this._element.addEventListener("mousedown", this._handleCreateStart, false);
    this._element.addEventListener("touchstart", this._handleCreateStart, false);

    this._selectionElement = null;
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
    const el = document.createElement("section");
    el.id = "container";
    el.style.top = `${t}px`;
    el.style.left = `${l}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  
    return el;
  }

  _appendSelectionElement() {
    this._selectionElement = new SelectionElement();
    this._element.appendChild(this._selectionElement);
  };

  _removeSelectionElement() {
    this._element.removeChild(this._selectionElement);
    this._selectionElement = null;
  };

  _handleCreateStart(e) {
    document.body.style.cursor = "crosshair";
    this._createMode = true;

    const rect = this._element.getBoundingClientRect();
    const mouseX = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const mouseY = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    this._initialMouse = { x: mouseX, y: mouseY };

    this._appendSelectionElement();

    this._element.addEventListener("mousemove", this._handleCreateMove, false);
    this._element.addEventListener("mouseup", this._handleCreateEnd, false);
    this._element.addEventListener("touchmove", this._handleCreateMove, false);
    this._element.addEventListener("touchend", this._handleCreateEnd, false);
  };

  _handleCreateMove(e) {
    const rect = this._element.getBoundingClientRect();
    const mouseX = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const mouseY = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    const width = Math.abs(mouseX - this._initialMouse.x) + 1;
    const height = Math.abs(mouseY - this._initialMouse.y) + 1;

    const top = (mouseY - this._initialMouse.y < 0) ? mouseY : this._initialMouse.y;
    const left = (mouseX - this._initialMouse.x < 0) ? mouseX : this._initialMouse.x;

    this._selectionElement.style.top = `${top}px`;
    this._selectionElement.style.left = `${left}px`;
    this._selectionElement.style.width = `${width}px`;
    this._selectionElement.style.height = `${height}px`;
  };

  _handleCreateEnd(e) {
    const rect = this._element.getBoundingClientRect();
    const mouseX = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const mouseY = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    const width = Math.abs(mouseX - this._initialMouse.x) + 1;
    const height = Math.abs(mouseY - this._initialMouse.y) + 1;

    const top = (mouseY - this._initialMouse.y < 0) ? mouseY : this._initialMouse.y;
    const left = (mouseX - this._initialMouse.x < 0) ? mouseX : this._initialMouse.x;

    if (width >= 80 && height >= 80) {
      const memoElement = new MemoElement(top, left, width, height);
      this._memoElements.push(memoElement);

      this._element.appendChild(memoElement.element);
    }

    document.body.style.cursor = "pointer";

    this._createMode = false;
    this._removeSelectionElement();
    this._invalidateEvents();
  };

  _invalidateEvents() {
    this._initialMouse = { x: 0, y: 0 };

    this._element.removeEventListener("mousemove", this._handleCreateMove, false);
    this._element.removeEventListener("mouseup", this._handleCreateEnd, false);
    this._element.removeEventListener("touchmove", this._handleCreateMove, false);
    this._element.removeEventListener("touchend", this._handleCreateEnd, false);
  };

  /*
		Public methods
	*/

  updatePosition(t, l) {
    this._element.style.top = `${t}px`;
    this._element.style.left = `${l}px`;
  };

  updateDimensions(w, h) {
    this._element.style.width = `${w}px`;
    this._element.style.height = `${h}px`;
  };
};
