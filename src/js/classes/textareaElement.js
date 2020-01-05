import Element from "./element";

export default class ResizeElement extends Element {
  constructor() {
    super("textarea");

    this._element.placeholder = "Add something here to remember...";
    this._element.autocomplete = false;
    this._element.spellcheck = false;
  }
};
