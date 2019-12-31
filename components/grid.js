import { createCardsElement } from "./cards";

import "./grid.scss";

export const createCanvas = (width, height) => {
	const canvas = document.createElement("canvas");
	
	canvas.id = "grid";
	canvas.width = width;
	canvas.height = height;

	return canvas;
};

export const renderGrid = (canvas, width, height, size) => {
	const context = canvas.getContext("2d");

	for (let x = 0; x <= width; x += size) {
		for (let y = 0; y <= height; y += size) {
			context.fillStyle  = "rgba(0, 0, 0, 0.15)";
			context.beginPath();
			context.arc(x + 1, y + 1, 1, 0, 2 * Math.PI, true);
			context.fill();
		}
	}	
};