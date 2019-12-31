import {
	createMainElement,
	createCanvasElement,
	createContainerElement,
	createCardElement,
	createDragHandleElement,
	createTextareaElement,
	createResizeHandleElement
} from "./js/elements";
import { snapToGrid } from "./js/utils";

import "./sass/index.scss";

const margin = 24;
const size = 12;

let width = (window.innerWidth - (margin * 2)) - 12;
let height = (window.innerHeight - (margin * 2)) - 4;

let initialPosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };
let initialSize = { width: 0, height: 0 };

const main = createMainElement(width, height);

const canvas = createCanvasElement(width, height, size);
main.appendChild(canvas);

const container = createContainerElement(width, height);
main.appendChild(container);

const createCard = () => {
	const card = createCardElement();
	card.style.top = `${size}px`;
	card.style.left = `${size}px`;

	const dragHandle = createDragHandleElement();
	dragHandle.onmousedown = (e) => {
		e = e || window.event;
		e.preventDefault();

		card.classList.add("active");
		dragHandle.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
		dragHandle.style.cursor = "grabbing";

		document.body.style.cursor = "grabbing";

		initialPosition.x = e.clientX;
		initialPosition.y = e.clientY;

		document.onmousemove = (e) => {
			e = e || window.event;
			e.preventDefault();

			const isActive = card.classList.contains("active");

			if (isActive) {
				currentPosition.x = initialPosition.x - e.clientX;
				currentPosition.y = initialPosition.y - e.clientY;
				initialPosition.x = e.clientX;
				initialPosition.y = e.clientY;

				card.style.top = `${card.offsetTop - currentPosition.y}px`;
				card.style.left = `${card.offsetLeft - currentPosition.x}px`;
			}
		};

		document.onmouseup = () => {
			const snapY = snapToGrid(card.offsetTop - currentPosition.y, size);
			const snapX = snapToGrid(card.offsetLeft - currentPosition.x, size);

			card.style.top = `${snapY}px`;
			card.style.left = `${snapX}px`;

			card.classList.remove("active");

			document.body.style.cursor = "pointer";
			dragHandle.style.cursor = "grab";
			dragHandle.style.backgroundColor = "transparent";

			initialPosition = { x: 0, y: 0 };
			currentPosition = { x: 0, y: 0 };

			document.onmousemove = null;
			document.onmouseup = null;
		};
	};

	card.appendChild(dragHandle);

	const textarea = createTextareaElement("Cool text");
	card.appendChild(textarea);

	const resizeHandle = createResizeHandleElement();
	resizeHandle.onmousedown = (e) => {
		e = e || window.event;
		e.preventDefault();

		card.classList.add("active");

		document.body.style.cursor = "nw-resize";

		resizeHandle.style.backgroundColor = "rgba(0, 0, 0, 0.05)";

		initialPosition.x = e.clientX;
		initialPosition.y = e.clientY;

		initialSize.width = parseInt(getComputedStyle(card).width, 10);
		initialSize.height = parseInt(getComputedStyle(card).height, 10);

		document.onmousemove = (e) => {
			e = e || window.event;
			e.preventDefault();

			const isActive = card.classList.contains("active");

			if (isActive) {
				const snapHeight = snapToGrid(initialSize.height + (e.clientY - initialPosition.y), size);
				const snapWidth = snapToGrid(initialSize.width + (e.clientX - initialPosition.x), size);

				card.style.height = `${snapHeight}px`;
				card.style.width = `${snapWidth}px`;
			}
		};

		document.onmouseup = (e) => {
			e = e || window.event;
			e.preventDefault();

			const snapHeight = snapToGrid(initialSize.height + (e.clientY - initialPosition.y), size);
			const snapWidth = snapToGrid(initialSize.width + (e.clientX - initialPosition.x), size);

			card.style.height = `${snapHeight}px`;
			card.style.width = `${snapWidth}px`;
			card.classList.remove("active");

			resizeHandle.style.backgroundColor = "transparent";
			document.body.style.cursor = "pointer";

			initialSize = { width: 0, height: 0 };

			document.onmousemove = null;
			document.onmouseup = null;
		};
	};

	card.appendChild(resizeHandle);
	container.appendChild(card);
};

const renderCanvas = () => {
	const context = canvas.getContext("2d");

	for (let x = 1; x <= width; x += size) {
		for (let y = 1; y <= height; y += size) {
			context.fillStyle = "rgba(0, 0, 0, 0.25)";
			context.beginPath();
			context.arc(x, y, 1, 0, 2 * Math.PI, true);
			context.fill();
		}
	}
};

const updateElements = () => {
	width = (window.innerWidth - (margin * 2)) - 12;
	height = (window.innerHeight - (margin * 2)) - 4;

	main.style.width = `${width}px`;
	main.style.height = `${height}px`;

	canvas.width = width;
	canvas.height = height;

	renderCanvas();
};

document.body.appendChild(main);

window.addEventListener("resize", updateElements, false);
window.addEventListener("load", () => {
	createCard();
	createCard();
	updateElements();
}, false);
