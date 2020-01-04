import { createMainElement } from "../elements";

export default class Main {
  constructor (w, h) {
    this.mainElement = createMainElement(w, h);
  }

  /*
		Get / Set methods
	*/

  get element () {
    return this.mainElement;
  };

  /*
		Public methods
	*/

  appendChild (childElement) {
    this.mainElement.appendChild(childElement);
  };

  updateDimensions (w, h) {
    this.mainElement.style.width = `${w}px`;
    this.mainElement.style.height = `${h}px`;
  };
};
