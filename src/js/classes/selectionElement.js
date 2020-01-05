import Element from "./element";

export default class SelectionElement extends Element {
  constructor() {
    super("div");

    this.id = "selection";
  }
};
