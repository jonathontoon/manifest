import Element from "./element";

export default class CloseElement extends Element {
  constructor() {
    super("div");

    this.addClass("close");
    this.attribute("innerText", "‒");
  }
};
