import Element from "./element";

export default class CardElement extends Element {
  constructor() {
    super("div");

    this.addClass("card");
  }
};
