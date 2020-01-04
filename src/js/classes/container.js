import { createContainerElement, createSelectionElement } from "../elements";
import { snapToGrid } from "../utils";
import { GRID_SIZE } from "../globals";
import Memo from "./memo";

export default class Container {
  constructor(t, l, w, h) {
    this._containerElement = createContainerElement(t, l, w, h);

    this._createMode = false;
    this._initialMouse = { x: 0, y: 0 };
    this._currentMouse = { x: 0, y: 0 };
    this._memos = [];

    this._appendSelectionElement = this._appendSelectionElement.bind(this);
    this._removeSelectionElement = this._removeSelectionElement.bind(this);

    this._handleCreateStart = this._handleCreateStart.bind(this);
    this._handleCreateMove = this._handleCreateMove.bind(this);
    this._handleCreateEnd = this._handleCreateEnd.bind(this);
    this._invalidateEvents = this._invalidateEvents.bind(this);

    this.appendChild = this.appendChild.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this._containerElement.addEventListener("mousedown", this._handleCreateStart, false);
    this._containerElement.addEventListener("touchstart", this._handleCreateStart, false);
  }

  /*
		Get / Set methods
	*/

  get element() {
    return this._containerElement;
  };

  /*
		Private methods
	*/

  _appendSelectionElement() {
    this._selectionElement = createSelectionElement();
    this._containerElement.appendChild(this._selectionElement);
  };

  _removeSelectionElement() {
    this._containerElement.removeChild(this._selectionElement);
  };

  _handleCreateStart(e) {
    document.body.style.cursor = "crosshair";
    this._createMode = true;

    const rect = this._containerElement.getBoundingClientRect();
    const mouseX = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const mouseY = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    this._initialMouse = { x: mouseX, y: mouseY };

    this._appendSelectionElement();

    this._containerElement.addEventListener("mousemove", this._handleCreateMove, false);
    this._containerElement.addEventListener("mouseup", this._handleCreateEnd, false);
    this._containerElement.addEventListener("touchmove", this._handleCreateMove, false);
    this._containerElement.addEventListener("touchend", this._handleCreateEnd, false);
  };

  _handleCreateMove(e) {
    const rect = this._containerElement.getBoundingClientRect();
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
    const rect = this._containerElement.getBoundingClientRect();
    const mouseX = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const mouseY = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    const width = Math.abs(mouseX - this._initialMouse.x) + 1;
    const height = Math.abs(mouseY - this._initialMouse.y) + 1;

    const top = (mouseY - this._initialMouse.y < 0) ? mouseY : this._initialMouse.y;
    const left = (mouseX - this._initialMouse.x < 0) ? mouseX : this._initialMouse.x;

    if (width >= 80 && height >= 80) {
      const memo = new Memo(top, left, width, height);
      this._memos.push(memo);
  
      this.appendChild(memo.element);  
    } 

    document.body.style.cursor = "pointer";

    this._createMode = false;
    this._removeSelectionElement();
    this._invalidateEvents();
  };

  _invalidateEvents() {
    this._initialMouse = { x: 0, y: 0 };

    this._containerElement.removeEventListener("mousemove", this._handleCreateMove, false);
    this._containerElement.removeEventListener("mouseup", this._handleCreateEnd, false);
    this._containerElement.removeEventListener("touchmove", this._handleCreateMove, false);
    this._containerElement.removeEventListener("touchend", this._handleCreateEnd, false);
  };

  /*
		Public methods
	*/

  appendChild(childElement) {
    this._containerElement.appendChild(childElement);
  };

  updateDimensions(t, l, w, h) {
    this._containerElement.style.width = `${w}px`;
    this._containerElement.style.height = `${h}px`;
  };
};
