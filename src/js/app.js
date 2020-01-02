import { createMainElement, createCanvasElement, createContainerElement } from "./elements";
import { snapToGrid } from "./utils";

import Memo from "./memo";

function App() {
	this.initialPosition = { x: 0, y: 0 };
	this.currentPosition = { x: 0, y: 0 };

	this.activeMemo = null;
	this.memos = [];

	this.margin = 48;
	this.gridSize = 10;

	this.width = (window.innerWidth - this.margin) - 1;
	this.height = (window.innerHeight - this.margin) + 1;

	this.mainElement = createMainElement(this.width, this.height);
	this.canvasElement = createCanvasElement(this.width, this.height);
	this.containerElement = createContainerElement(this.width, this.height);

	this.mainElement.appendChild(this.canvasElement);
	this.mainElement.appendChild(this.containerElement);

	this.updateCanvasElement = function() {
		this.canvasElement.width = this.width;
		this.canvasElement.height = this.height;

		const context = this.canvasElement.getContext("2d");

		for (let x = 0; x <= this.width; x += this.gridSize) {
			for (let y = 0; y <= this.height; y += this.gridSize) {
				context.fillStyle = "rgba(0, 0, 0, 0.5)";
				context.beginPath();
				context.rect(x, y, 1, 1);
				context.fill();
			}
		}
	};

	this.updateElements = function() {
		this.width = (window.innerWidth - this.margin) - 1;
		this.height = (window.innerHeight - this.margin) + 1;

		this.mainElement.style.width = `${this.width}px`;
		this.mainElement.style.height = `${this.height}px`;

		this.updateCanvasElement();
	};

	this.onCreateMove = function(e) {
		e.preventDefault();

		this.isActive = document.body.classList.contains("active");

		if (this.isActive) {
			const x = snapToGrid(e.clientX, this.gridSize);
			const y = snapToGrid(e.clientY, this.gridSize);
			this.currentPosition = { x, y };
		}
	};

	this.onCreateEnd = function(e) {
		alert("f");
		e.preventDefault();

		document.body.classList.remove("active");

		console.log(this.mainElement, this.containerElement);

		const position = this.initialPosition;
		const size = { width: this.currentPosition.x - this.initialPosition.x, height: this.currentPosition.y - this.initialPosition.y };

		const memo = new Memo(this.containerElement, this.gridSize, position, size);
		this.memos.push(memo);

		this.containerElement.classList.remove("active");
		this.initialPosition = { x: 0, y: 0 };
		this.currentPosition = { x: 0, y: 0 };

		document.onmousemove = null;
		document.ontouchmove = null;
		document.onmouseup = null;
		document.ontouchcancel = null;
		document.ontouchend = null;
	};

	this.onCreateStart = function(e) {
		e.preventDefault();

		document.body.classList.add("active");

		const x = snapToGrid(e.clientX, this.gridSize);
		const y = snapToGrid(e.clientY, this.gridSize);

		this.initialPosition = { x, y };

		document.onmousemove = this.onCreateMove;
		document.ontouchmove = this.onCreateMove;
		document.onmouseup = this.onCreateEnd;
		document.ontouchcancel = this.onCreateEnd;
		document.ontouchend = this.onCreateEnd;
	};

	this.setup = function() {
		document.onmousedown = this.onCreateStart;
		document.ontouchstart = this.onCreateStart;

		document.body.appendChild(this.mainElement);
		window.addEventListener("resize", this.updateElements, false);
	};
};

export default App;
