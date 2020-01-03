import App from "./js/classes/app";

import "./sass/index.scss";

window.addEventListener("load", function () {
	const app = new App();
	app.setup();
}, false);
