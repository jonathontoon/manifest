import { GRID_SIZE } from "../globals";
import { snapToGrid } from "../utils";

import TextareaElement from "./textareaElement";
import CardElement from "./cardElement";
import DragElement from "./dragElement";
import ResizeElement from "./resizeElement";

export default class Memo {
  constructor(t, l, w, h) {
    this._initialPosition = { x: t, y: l };
    this._currentPosition = { x: t, y: l };
    this._initialSize = { w, h };

    this._createElement = this._createElement.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
    this._handleResizeStart = this._handleResizeStart.bind(this);
    this._handleResizeMove = this._handleResizeMove.bind(this);
    this._handleResizeEnd = this._handleResizeEnd.bind(this);
    this._invalidateEvents = this._invalidateEvents.bind(this);

    this.appendChild = this.appendChild.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this._element = this._createElement();

    this._cardElement = new CardElement();
    this._dragElement = new DragElement();
    this._textareaElement = new TextareaElement();
    this._resizeElement = new ResizeElement();

    this._cardElement.appendChild(this._dragElement.element);
    this._cardElement.appendChild(this._textareaElement.element);
    this._cardElement.appendChild(this._resizeElement.element);

    this._dragElement.addEventListener("mousedown", this._handleDragStart, false);
    this._dragElement.addEventListener("touchstart", this._handleDragStart, false);

    this._resizeElement.addEventListener("mousedown", this._handleResizeStart, false);
    this._resizeElement.addEventListener("touchstart", this._handleResizeStart, false);

    this.appendChild(this._cardElement);
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
    const el = document.createElement("div");
    el.classList.add("memo");
    el.style.top = `${t}px`;
    el.style.left = `${l}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  
    return el;
  };

  _handleDragStart(e) {
    e.preventDefault();

    this._element.classList.add("active");
    this._dragElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    this._dragElement.style.cursor = "grabbing";

    document.body.style.cursor = "grabbing";

    this._initialPosition = {
      x: snapToGrid(e.clientX, GRID_SIZE),
      y: snapToGrid(e.clientY, GRID_SIZE)
    };

    document.addEventListener("mousemove", this._handleDragMove, false);
    document.addEventListener("touchmove", this._handleDragMove, false);

    document.addEventListener("mouseup", this._handleDragEnd, false);
    document.addEventListener("touchcanel", this._handleDragEnd, false);
    document.addEventListener("touchend", this._handleDragEnd, false);
  };

  _handleDragMove(e) {
    e.preventDefault();

    const isActive = this._element.classList.contains("active");

    if (isActive) {
      const x = snapToGrid(e.clientX, GRID_SIZE);
      const y = snapToGrid(e.clientY, GRID_SIZE);

      this._currentPosition = {
        x: this._initialPosition.x - x,
        y: this._initialPosition.y - y
      };

      const top = this._element.offsetTop - this._currentPosition.y;
      const left = this._element.offsetLeft - this._currentPosition.x;

      this.updatePosition(top, left);

      this._initialPosition = { x, y };
    }
  };

  _handleDragEnd(e) {
    e.preventDefault();

    const top = snapToGrid(this._element.offsetTop - this._currentPosition.y, GRID_SIZE);
    const left = snapToGrid(this._element.offsetLeft - this._currentPosition.x, GRID_SIZE);

    this.updatePosition(top, left);
    this._element.classList.remove("active");

    this._dragElement.style.cursor = "grab";
    this._dragElement.style.backgroundColor = "transparent";

    document.body.style.cursor = "pointer";

    this._initialPosition = { x: 0, y: 0 };
    this._currentPosition = { x: 0, y: 0 };

    this._invalidateEvents();
  };

  _handleResizeStart(e) {
    e.preventDefault();

    this._element.classList.add("active");

    document.body.style.cursor = "nw-resize";

    this._resizeElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";

    this._initialPosition.x = snapToGrid(e.clientX, GRID_SIZE);
    this._initialPosition.y = snapToGrid(e.clientY, GRID_SIZE);

    const rect = this._element.getBoundingClientRect();

    this._initialSize.w = parseInt(rect.width, 10);
    this._initialSize.h = parseInt(rect.height, 10);

    document.addEventListener("mousemove", this._handleResizeMove, false);
    document.addEventListener("touchmove", this._handleResizeMove, false);

    document.addEventListener("mouseup", this._handleResizeEnd, false);
    document.addEventListener("touchcancel", this._handleResizeEnd, false);
    document.addEventListener("touchend", this._handleResizeEnd, false);
  };

  _handleResizeMove(e) {
    e.preventDefault();

    const isActive = this._element.classList.contains("active");

    if (isActive) {
      const width = snapToGrid(this._initialSize.w + (e.clientX - this._initialPosition.x), GRID_SIZE);
      const height = snapToGrid(this._initialSize.h + (e.clientY - this._initialPosition.y), GRID_SIZE);

      this.updateDimensions(width, height);
    }
  };

  _handleResizeEnd(e) {
    e.preventDefault();

    const width = snapToGrid(this._initialSize.w + (e.clientX - this._initialPosition.x), GRID_SIZE);
    const height = snapToGrid(this._initialSize.h + (e.clientY - this._initialPosition.y), GRID_SIZE);

    this.updateDimensions(width, height);
    this._element.classList.remove("active");

    this._resizeElement.style.backgroundColor = "transparent";

    this._initialSize = { w: 0, h: 0 };

    this._invalidateEvents();
  };

  _invalidateEvents() {
    document.removeEventListener("mousedown", this._handleDragStart, false);
    document.removeEventListener("touchstart", this._handleDragStart, false);

    document.removeEventListener("mousedown", this._handleResizeStart, false);
    document.removeEventListener("touchstart", this._handleResizeStart, false);

    document.removeEventListener("mousemove", this._handleDragMove, false);
    document.removeEventListener("touchmove", this._handleDragMove, false);
    document.removeEventListener("mousemove", this._handleResizeMove, false);
    document.removeEventListener("touchmove", this._handleResizeMove, false);

    document.removeEventListener("mouseup", this._handleDragEnd, false);
    document.removeEventListener("touchcancel", this._handleDragEnd, false);
    document.removeEventListener("touchend", this._handleDragEnd, false);

    document.removeEventListener("mouseup", this._handleResizeEnd, false);
    document.removeEventListener("touchcancel", this._handleResizeEnd, false);
    document.removeEventListener("touchend", this._handleResizeEnd, false);
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
    this._element.style.width = `${w}px`;
    this._element.style.height = `${h}px`;
  };
};
