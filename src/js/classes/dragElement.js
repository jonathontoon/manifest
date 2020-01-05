import Element from "./element";

export default class DragElement extends Element {
  constructor() {
    super("div");

    this.addClass("drag");
  }
};
