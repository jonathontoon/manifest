import { createTextArea } from "./textarea";

import "./card.scss";

const gridSize = 8;

let initialPosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };

let initialSize = { width: 0, height: 0 };

const snapToGrid = (value, grid) => {
	return grid * Math.round(value / grid);
};

export const createCard = (text) => {

	let card, dragHandle, resizeHandle, textarea;

	/* Create card element and movement events */

	card = document.createElement("div");
	card.classList.add("card");

	/* Create handle element and events */

	const onMoveStart = (e) => {
		e = e || window.event;
		e.preventDefault();

		card.classList.add("active");
		dragHandle.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
		dragHandle.style.cursor = "grabbing";

		document.body.style.cursor = "grabbing";

		initialPosition.x = e.clientX;
		initialPosition.y = e.clientY;

		document.addEventListener("mousemove", onMove, false);
		document.addEventListener("mouseup", onMoveEnd, false);
	};

	const onMove = (e) => {
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

	const onMoveEnd = (e) => {
		const snapY = snapToGrid(card.offsetTop - currentPosition.y, gridSize);
		const snapX = snapToGrid(card.offsetLeft - currentPosition.x, gridSize);

		card.style.top = `${snapY}px`;
		card.style.left = `${snapX}px`;

		card.classList.remove("active");
	
		document.body.style.cursor = "pointer";
		dragHandle.style.cursor = "grab";
		dragHandle.style.backgroundColor = "transparent";

		initialPosition = { x: 0, y: 0 };
		currentPosition = { x: 0, y: 0 };

		document.removeEventListener("mousemove", onMove, false);
		document.removeEventListener("mouseup", onMoveEnd, false);
	};

	dragHandle = document.createElement("div");
	dragHandle.classList.add("drag");
	dragHandle.addEventListener("mousedown", onMoveStart);
	card.appendChild(dragHandle);

	/* Create textarea element */

	textarea = createTextArea(text);
	card.appendChild(textarea);

	const onDragStart = (e) => {
		e = e || window.event;
		e.preventDefault();

		card.classList.add("active");
		
		document.body.style.cursor = "nw-resize";

		resizeHandle.style.backgroundColor = "rgba(0, 0, 0, 0.05)";

		initialPosition.x = e.clientX;
		initialPosition.y = e.clientY;

		initialSize.width = parseInt(getComputedStyle(card).width, 10);
		initialSize.height = parseInt(getComputedStyle(card).height, 10);

		document.addEventListener("mousemove", onDrag, false);
		document.addEventListener("mouseup", onDragEnd, false);
	};

	const onDrag = (e) => {
		e = e || window.event;
		e.preventDefault();

		const isActive = card.classList.contains("active");

		if (isActive) {
			const snapHeight = snapToGrid(initialSize.height + (e.clientY - initialPosition.y), gridSize);
			const snapWidth = snapToGrid(initialSize.width + (e.clientX - initialPosition.x), gridSize);
	
			card.style.height = `${snapHeight + 2}px`;
			card.style.width = `${snapWidth}px`;
		}
	};

	const onDragEnd = (e) => {
		const snapHeight = snapToGrid(initialSize.height + (e.clientY - initialPosition.y), gridSize);
		const snapWidth = snapToGrid(initialSize.width + (e.clientX - initialPosition.x), gridSize);

		card.style.height = `${snapHeight + 2}px`;
		card.style.width = `${snapWidth}px`;
		card.classList.remove("active");
	
		resizeHandle.style.backgroundColor = "transparent";
		document.body.style.cursor = "pointer";

		initialSize = { width: 0, height: 0 };

		document.removeEventListener("mousemove", onDrag, false);
		document.removeEventListener("mouseup", onDragEnd, false);
	};

	resizeHandle = document.createElement("div");
	resizeHandle.classList.add("resize");
	resizeHandle.addEventListener("mousedown", onDragStart);
	card.appendChild(resizeHandle);

	return card;
};