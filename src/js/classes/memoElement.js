import { GRID_SIZE } from "../globals";
import { snapToGrid } from "../utils";

import Element from "./element";
import TextAreaElement from "./textareaElement";
import CardElement from "./cardElement";
import DragElement from "./dragElement";
import ResizeElement from "./resizeElement";
import CloseElement from "./closeElement";

export default class Memo extends Element {
  constructor(uuid, { top, left }, { width, height }) {
    super("div");

    this.data("id", uuid);

    this.addClass("memo");

    this.style("top", `${top}px`);
    this.style("left", `${left}px`);

    this.style("width", `${width}px`);
    this.style("height", `${height}px`);

    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);

    this._handleInput = this._handleInput.bind(this);
    this._handleClose = this._handleClose.bind(this);

    this._handleResizeStart = this._handleResizeStart.bind(this);
    this._handleResizeMove = this._handleResizeMove.bind(this);
    this._handleResizeEnd = this._handleResizeEnd.bind(this);
    this._invalidateEvents = this._invalidateEvents.bind(this);

    this._initialPosition = { top, left };
    this._currentPosition = { top, left };
    this._initialSize = { width, height };

    this._cardElement = new CardElement();

    this._dragElement = new DragElement();
    this._dragElement.addEvent("mousedown", this._handleDragStart);
    this._dragElement.addEvent("touchstart", this._handleDragStart);

    this._closeElement = new CloseElement();
    this._closeElement.addEvent("click", this._handleClose);

    this._textareaElement = new TextAreaElement();
    this._textareaElement.addEvent("input", this._handleInput);

    this._resizeElement = new ResizeElement();
    this._resizeElement.addEvent("mousedown", this._handleResizeStart);
    this._resizeElement.addEvent("touchstart", this._handleResizeStart);

    this._cardElement.appendElement(this._dragElement.element);
    this._cardElement.appendElement(this._closeElement.element);
    this._cardElement.appendElement(this._textareaElement.element);
    this._cardElement.appendElement(this._resizeElement.element);

    this.appendElement(this._cardElement.element);

    const memos = JSON.parse(window.localStorage.getItem("memos"));
    if (memos) {
      memos[uuid] = {
        value: null,
        top,
        left,
        width,
        height
      };
      window.localStorage.setItem("memos", JSON.stringify(memos));
    }
  }

  // Private methods

  _handleDragStart(e) {
    e.preventDefault();

    this.addClass("active");
    this._dragElement.style("backgroundColor", "rgba(0, 0, 0, 0.05)");
    this._dragElement.style("cursor", "grabbing");

    document.body.style.cursor = "grabbing";

    const left = snapToGrid(e.clientX, GRID_SIZE);
    const top = snapToGrid(e.clientY, GRID_SIZE);

    this._initialPosition = { top, left };

    document.addEventListener("mousemove", this._handleDragMove, false);
    document.addEventListener("touchmove", this._handleDragMove, false);

    document.addEventListener("mouseup", this._handleDragEnd, false);
    document.addEventListener("touchcanel", this._handleDragEnd, false);
    document.addEventListener("touchend", this._handleDragEnd, false);
  };

  _handleDragMove(e) {
    e.preventDefault();

    const isActive = this.containsClass("active");

    if (isActive) {
      const left = snapToGrid(e.clientX, GRID_SIZE);
      const top = snapToGrid(e.clientY, GRID_SIZE);

      this._currentPosition = {
        left: this._initialPosition.left - left,
        top: this._initialPosition.top - top
      };

      this.style("top", `${this.attribute("offsetTop") - this._currentPosition.top}px`);
      this.style("left", `${this.attribute("offsetLeft") - this._currentPosition.left}px`);

      this._initialPosition = { top, left };
    }
  };

  _handleDragEnd(e) {
    e.preventDefault();

    const top = snapToGrid(this.attribute("offsetTop") - this._currentPosition.top, GRID_SIZE);
    const left = snapToGrid(this.attribute("offsetLeft") - this._currentPosition.left, GRID_SIZE);

    this.style("top", `${top}px`);
    this.style("left", `${left}px`);
    this.removeClass("active");

    this._dragElement.style("cursor", "grab");
    this._dragElement.style("backgroundColor", "transparent");

    document.body.style.cursor = null;

    this._initialPosition = { top: 0, left: 0 };
    this._currentPosition = { top: 0, left: 0 };

    const id = this.data("id");
    const memos = JSON.parse(window.localStorage.getItem("memos"));
    if (memos) {
      memos[id].top = top;
      memos[id].left = left;
      window.localStorage.setItem("memos", JSON.stringify(memos));
    }

    this._invalidateEvents();
  };

  _handleInput(e) {
    const textareaValue = e.target.value;
    const id = this.data("id");
    const memos = JSON.parse(window.localStorage.getItem("memos"));
    if (memos) {
      memos[id].value = textareaValue;
      window.localStorage.setItem("memos", JSON.stringify(memos));
    }
  }

  _handleClose() {
    if (window.confirm("Are you sure you'd like to delete this memo?")) {
      const id = this.data("id");
      const memos = JSON.parse(window.localStorage.getItem("memos"));
      if (memos) {
        delete memos[id];
        window.localStorage.setItem("memos", JSON.stringify(memos));
      }
      this.remove();
    }
  }

  _handleResizeStart(e) {
    e.preventDefault();

    this.addClass("active");

    document.body.style.cursor = "nw-resize";

    this._resizeElement.style("backgroundColor", "rgba(0, 0, 0, 0.05)");

    this._initialPosition.top = snapToGrid(e.clientY, GRID_SIZE);
    this._initialPosition.left = snapToGrid(e.clientX, GRID_SIZE);

    this._initialSize.width = parseInt(this.rect.width, 10);
    this._initialSize.height = parseInt(this.rect.height, 10);

    document.addEventListener("mousemove", this._handleResizeMove, false);
    document.addEventListener("touchmove", this._handleResizeMove, false);

    document.addEventListener("mouseup", this._handleResizeEnd, false);
    document.addEventListener("touchcancel", this._handleResizeEnd, false);
    document.addEventListener("touchend", this._handleResizeEnd, false);
  };

  _handleResizeMove(e) {
    e.preventDefault();

    const isActive = this.containsClass("active");

    if (isActive) {
      const width = snapToGrid(this._initialSize.width + (e.clientX - this._initialPosition.left), GRID_SIZE) - 1;
      const height = snapToGrid(this._initialSize.height + (e.clientY - this._initialPosition.top), GRID_SIZE) - 1;

      this.style("width", `${width}px`);
      this.style("height", `${height}px`);
    }
  };

  _handleResizeEnd(e) {
    e.preventDefault();

    const width = snapToGrid(this._initialSize.width + (e.clientX - this._initialPosition.left), GRID_SIZE);
    const height = snapToGrid(this._initialSize.height + (e.clientY - this._initialPosition.top), GRID_SIZE);

    this.style("width", `${width}px`);
    this.style("height", `${height}px`);
    this.removeClass("active");

    this._resizeElement.style("cursor", "nw-resize");
    this._resizeElement.style("backgroundColor", "transparent");

    document.body.style.cursor = null;

    this._initialSize = { w: 0, h: 0 };

    const id = this.data("id");
    const memos = JSON.parse(window.localStorage.getItem("memos"));
    if (memos) {
      memos[id].width = width;
      memos[id].height = height;
      window.localStorage.setItem("memos", JSON.stringify(memos));
    }

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
  };
};
