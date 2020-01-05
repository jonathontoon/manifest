import Element from "./element";

export default class TextAreaElement extends Element {
  constructor() {
    super("textarea");

    this._handleFocus = this._handleFocus.bind(this);
    this._handleBlur = this._handleBlur.bind(this);

    this._element.placeholder = "Add something here to remember...";
    this._element.autocomplete = false;
    this._element.spellcheck = false;

    this.addEvent("focus", this._handleFocus);
    this.addEvent("blur", this._handleBlur);
  };

  _handleFocus(e) {
    this.addClass("active");
  };

  _handleBlur(e) {
    this.removeClass("active");
  };
};
