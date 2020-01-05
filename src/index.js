import MainElement from "./js/classes/mainElement";

import "./sass/index.scss";

window.addEventListener("load", function () {
  const mainElement = new MainElement();
  document.body.appendChild(mainElement.element);
}, false);
