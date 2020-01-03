import { GRID_SIZE } from "../globals";
import { createContainerElement, createSelectionElement } from "../elements";
import { snapToGrid } from "../utils";

import Memo from "./memo";

export default class Container {
	constructor (t, l, w, h) {
		this._containerElement = createContainerElement(t, l, w, h);
		this._selectionElement = createSelectionElement();

		this._containerElement.appendChild(this._selectionElement);

		this._createMode = false;
		this._initialPosition = { x: 0, y: 0 };
		this._currentPosition = { x: 0, y: 0 };
		this._memos = [];

		this._handleKeyUp = this._handleKeyUp.bind(this);
		this._disableCreateMode = this._disableCreateMode.bind(this);
		this._enableCreateMode = this._enableCreateMode.bind(this);

		this._handleCreateStart = this._handleCreateStart.bind(this);
		this._handleCreateMove = this._handleCreateMove.bind(this);
		this._handleCreateEnd = this._handleCreateEnd.bind(this);

		this._invalidateEvents = this._invalidateEvents.bind(this);

		this.appendChild = this.appendChild.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);

		window.addEventListener("keyup", this._handleKeyUp, false);
	}

	/*
		Get / Set methods
	*/

	get element () {
		return this._containerElement;
	};

	/*
		Private methods
	*/

	_handleKeyUp (e) {
		e.preventDefault();

		switch (e.keyCode) {
		case 27:
			this._disableCreateMode();
			break;
		case 78:
			this._enableCreateMode();
			break;
		}
	}

	_disableCreateMode () {
		document.body.style.cursor = "pointer";

		this._createMode = false;
		this._invalidateEvents();
	}

	_enableCreateMode () {
		document.body.style.cursor = "crosshair";

		this._createMode = true;
		this._containerElement.addEventListener("mousedown", this._handleCreateStart, false);
		this._containerElement.addEventListener("touchstart", this._handleCreateStart, false);
	}

	_handleCreateStart (e) {
		e.preventDefault();

		const rect = e.target.getBoundingClientRect();

		console.log(e);

		const x = snapToGrid(e.clientX - rect.left, GRID_SIZE);
		const y = snapToGrid(e.clientY - rect.top, GRID_SIZE);

		this._initialPosition = { x, y };

		this._containerElement.classList.add("active");
		this._selectionElement.classList.add("active");
		this._selectionElement.style.top = `${x}px`;
		this._selectionElement.style.left = `${y}px`;

		this._containerElement.addEventListener("mousemove", this._handleCreateMove, false);
		this._containerElement.addEventListener("touchmove", this._handleCreateMove, false);

		this._containerElement.addEventListener("mouseup", this._handleCreateEnd, false);
		this._containerElement.addEventListener("touchcancel", this._handleCreateEnd, false);
		this._containerElement.addEventListener("touchend", this._handleCreateEnd, false);
	};

	_handleCreateMove (e) {
		e.preventDefault();

		const isActive = this._containerElement.classList.contains("active");

		if (isActive) {
			const rect = e.target.getBoundingClientRect();
			const x = snapToGrid(e.clientX - rect.left, GRID_SIZE);
			const y = snapToGrid(e.clientY - rect.top, GRID_SIZE);

			this._currentPosition = { x, y };

			this._selectionElement.style.width = `${this._currentPosition.x - this._initialPosition.x}px`;
			this._selectionElement.style.height = `${this._currentPosition.y - this._initialPosition.y}px`;
		}
	};

	_handleCreateEnd (e) {
		e.preventDefault();

		const memo = new Memo(0, 0, 500, 500);

		this._memos.push(memo);

		this._containerElement.appendChild(memo.element);
		this._containerElement.classList.remove("active");
		this._selectionElement.classList.remove("active");
		this._selectionElement.style.top = "0px";
		this._selectionElement.style.left = "0px";
		this._selectionElement.style.width = "0px";
		this._selectionElement.style.height = "0px";

		this._initialPosition = { x: 0, y: 0 };
		this._currentPosition = { x: 0, y: 0 };

		this._disableCreateMode();
		this._invalidateEvents();
	};

	_invalidateEvents () {
		this._containerElement.removeEventListener("mousedown", this._handleCreateStart, false);
		this._containerElement.removeEventListener("touchstart", this._handleCreateStart, false);

		this._containerElement.removeEventListener("mousemove", this._handleCreateMove, false);
		this._containerElement.removeEventListener("touchmove", this._handleCreateMove, false);

		this._containerElement.removeEventListener("mouseup", this._handleCreateEnd, false);
		this._containerElement.removeEventListener("touchcancel", this._handleCreateEnd, false);
		this._containerElement.removeEventListener("touchend", this._handleCreateEnd, false);
	}

	/*
		Public methods
	*/

	appendChild (childElement) {
		this._containerElement.appendChild(childElement);
	};

	updateDimensions (t, l, w, h) {
		this._containerElement.style.width = `${w}px`;
		this._containerElement.style.height = `${h}px`;
	};
};
