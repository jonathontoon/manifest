import Element from "./element";

export default class ResizeElement extends Element {
  constructor() {
    super("div");

    this.addClass("resize");
  }
};
