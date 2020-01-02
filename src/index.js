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

const margin = 48;
const size = 10;

let documentWidth = (window.innerWidth - margin) - 1;
let documentHeight = (window.innerHeight - margin) + 1;

let initialPosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };
let initialSize = { width: 0, height: 0 };

const main = createMainElement(documentWidth, documentHeight);

const canvas = createCanvasElement(documentWidth, documentHeight);
main.appendChild(canvas);

const container = createContainerElement(documentWidth, documentHeight);
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

		initialPosition.x = snapToGrid(e.clientX, size);
		initialPosition.y = snapToGrid(e.clientY, size);

		document.onmousemove = (e) => {
			e = e || window.event;
			e.preventDefault();

			const isActive = card.classList.contains("active");

			if (isActive) {
				const x = snapToGrid(e.clientX, size);
				const y = snapToGrid(e.clientY, size);

				currentPosition.x = initialPosition.x - x;
				currentPosition.y = initialPosition.y - y;

				const top = card.offsetTop - currentPosition.y;
				const left = card.offsetLeft - currentPosition.x;

				card.style.top = `${top}px`;
				card.style.left = `${left}px`;

				initialPosition.x = x;
				initialPosition.y = y;
			}
		};

		document.onmouseup = () => {
			const top = snapToGrid(card.offsetTop - currentPosition.y, size);
			const left = snapToGrid(card.offsetLeft - currentPosition.x, size);

			card.style.top = `${top}px`;
			card.style.left = `${left}px`;

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

		const rect = card.getBoundingClientRect();

		initialSize.width = parseInt(rect.width, 10);
		initialSize.height = parseInt(rect.height, 10);

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

	for (let x = 0; x <= documentWidth; x += size) {
		for (let y = 0; y <= documentHeight; y += size) {
			context.fillStyle = "rgba(0, 0, 0, 0.5)";
			context.beginPath();
			context.rect(x, y, 1, 1);
			context.fill();
		}
	}
};

const updateDimensions = () => {
	documentWidth = (window.innerWidth - margin) - 1;
	documentHeight = (window.innerHeight - margin) + 1;

	main.style.width = `${documentWidth}px`;
	main.style.height = `${documentHeight}px`;

	canvas.width = documentWidth;
	canvas.height = documentHeight;

	renderCanvas();
};

document.body.appendChild(main);

window.addEventListener("resize", updateDimensions, false);
window.addEventListener("load", () => {
	createCard();
	createCard();
	updateDimensions();
}, false);
