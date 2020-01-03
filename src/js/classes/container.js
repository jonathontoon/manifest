import { createContainerElement, createSelectionElement } from "../elements";

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

    this.appendChild = this.appendChild.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    window.addEventListener("keyup", this._handleKeyUp, false);

    this._containerElement.addEventListener("mousemove", function (e) {
      console.log(e.offsetX, e.offsetY);
    }, false);
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
  }

  _enableCreateMode () {
    document.body.style.cursor = "crosshair";

    this._createMode = true;
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
