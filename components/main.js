import "./main.scss";

export const createMain = (width, height, size) => {
	const main = document.createElement("main");

	main.style.top = `${size}px`;
	main.style.left = `${size}px`;
	main.style.width = `${width}px`;
	main.style.height = `${height}px`;

	return main;
};