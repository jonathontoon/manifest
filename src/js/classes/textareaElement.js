import Element from "./element";

export default class TextAreaElement extends Element {
  constructor() {
    super("textarea");

    this._handleOnFocus = this._handleOnFocus.bind(this);
    this._handleOnBlur = this._handleOnBlur.bind(this);

    this.attribute("placeholder", "Add something here to remember...");
    this.attribute("autocomplete", false);
    this.attribute("spellcheck", false);

    this.addEvent("focus", this._handleOnFocus);
    this.addEvent("blur", this._handleOnBlur);
  };

  // Private methods

  _handleOnFocus(e) {
    this.addClass("active");
  };

  _handleOnBlur(e) {
    this.removeClass("active");
  };
};
