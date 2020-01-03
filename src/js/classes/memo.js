import { GRID_SIZE } from "../globals";
import { createCardElement, createDragHandleElement, createTextareaElement, createResizeHandleElement } from "../elements";
import { snapToGrid } from "../utils";

export default class Memo {
  constructor (x, y, w, h) {
    this._cardElement = createCardElement(x, y, w, h);
    this._dragHandleElement = createDragHandleElement();
    this._textareaElement = createTextareaElement("Cool text");
    this._resizeHandleElement = createResizeHandleElement();

    this._cardElement.appendChild(this._dragHandleElement);
    this._cardElement.appendChild(this._textareaElement);
    this._cardElement.appendChild(this._resizeHandleElement);

    this._initialPosition = { x: 0, y: 0 };
    this._currentPosition = { x: 0, y: 0 };
    this._initialSize = { width: 0, height: 0 };

    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);

    this._handleResizeStart = this._handleResizeStart.bind(this);
    this._handleResizeMove = this._handleResizeMove.bind(this);
    this._handleResizeEnd = this._handleResizeEnd.bind(this);

    this._invalidateEvents = this._invalidateEvents.bind(this);

    this._dragHandleElement.addEventListener("mousedown", this._handleDragStart, false);
    this._dragHandleElement.addEventListener("touchstart", this._handleDragStart, false);

    this._resizeHandleElement.addEventListener("mousedown", this._handleResizeStart, false);
    this._resizeHandleElement.addEventListener("touchstart", this._handleResizeStart, false);
  }

  /*
		Get / Set methods
	*/

  get element () {
    return this._cardElement;
  };

  /*
		Private methods
	*/

  _handleDragStart (e) {
    e.preventDefault();

    this._cardElement.classList.add("active");
    this._dragHandleElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    this._dragHandleElement.style.cursor = "grabbing";

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

  _handleDragMove (e) {
    e.preventDefault();

    const isActive = this._cardElement.classList.contains("active");

    if (isActive) {
      const x = snapToGrid(e.clientX, GRID_SIZE);
      const y = snapToGrid(e.clientY, GRID_SIZE);

      this._currentPosition = {
        x: this._initialPosition.x - x,
        y: this._initialPosition.y - y
      };

      const top = this._cardElement.offsetTop - this._currentPosition.y;
      const left = this._cardElement.offsetLeft - this._currentPosition.x;

      this._cardElement.style.top = `${top}px`;
      this._cardElement.style.left = `${left}px`;

      this._initialPosition = { x, y };
    }
  };

  _handleDragEnd (e) {
    e.preventDefault();

    const top = snapToGrid(this._cardElement.offsetTop - this._currentPosition.y, GRID_SIZE);
    const left = snapToGrid(this._cardElement.offsetLeft - this._currentPosition.x, GRID_SIZE);

    this._cardElement.style.top = `${top}px`;
    this._cardElement.style.left = `${left}px`;
    this._cardElement.classList.remove("active");

    this._dragHandleElement.style.cursor = "grab";
    this._dragHandleElement.style.backgroundColor = "transparent";

    document.body.style.cursor = "pointer";

    this._initialPosition = { x: 0, y: 0 };
    this._currentPosition = { x: 0, y: 0 };

    this._invalidateEvents();
  };

  _handleResizeStart (e) {
    e.preventDefault();

    this._cardElement.classList.add("active");

    document.body.style.cursor = "nw-resize";

    this._resizeHandleElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";

    this._initialPosition.x = snapToGrid(e.clientX, GRID_SIZE);
    this._initialPosition.y = snapToGrid(e.clientY, GRID_SIZE);

    const rect = this._cardElement.getBoundingClientRect();

    this._initialSize.width = parseInt(rect.width, 10);
    this._initialSize.height = parseInt(rect.height, 10);

    document.addEventListener("mousemove", this._handleResizeMove, false);
    document.addEventListener("touchmove", this._handleResizeMove, false);

    document.addEventListener("mouseup", this._handleResizeEnd, false);
    document.addEventListener("touchcancel", this._handleResizeEnd, false);
    document.addEventListener("touchend", this._handleResizeEnd, false);
  };

  _handleResizeMove (e) {
    e.preventDefault();

    const isActive = this._cardElement.classList.contains("active");

    if (isActive) {
      const height = snapToGrid(this._initialSize.height + (e.clientY - this._initialPosition.y), GRID_SIZE);
      const width = snapToGrid(this._initialSize.width + (e.clientX - this._initialPosition.x), GRID_SIZE);

      this._cardElement.style.height = `${height}px`;
      this._cardElement.style.width = `${width}px`;
    }
  };

  _handleResizeEnd (e) {
    e.preventDefault();

    const height = snapToGrid(this._initialSize.height + (e.clientY - this._initialPosition.y), GRID_SIZE);
    const width = snapToGrid(this._initialSize.width + (e.clientX - this._initialPosition.x), GRID_SIZE);

    this._cardElement.style.height = `${height}px`;
    this._cardElement.style.width = `${width}px`;
    this._cardElement.classList.remove("active");

    this._resizeHandleElement.style.backgroundColor = "transparent";

    this._initialSize = { width: 0, height: 0 };

    this._invalidateEvents();
  };

  _invalidateEvents () {
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
};
