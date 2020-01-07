import Element from "./element";

export default class TextAreaElement extends Element {
  constructor(text) {
    super("textarea");

    this._handleOnFocus = this._handleOnFocus.bind(this);
    this._handleOnBlur = this._handleOnBlur.bind(this);

    this.attribute("placeholder", "Add a short memo...");
    this.attribute("autocomplete", false);
    this.attribute("spellcheck", false);

    this.addEvent("focus", this._handleOnFocus);
    this.addEvent("blur", this._handleOnBlur);

    if (text) { this.attribute("value", text); }
  };

  // Private methods

  _handleOnFocus(e) {
    this.addClass("active");
  };

  _handleOnBlur(e) {
    this.removeClass("active");
  };
};
