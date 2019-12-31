export const createMainElement = (width, height) => {
	const el = document.createElement("main");
	el.id = "app";
	el.style.width = `${width}px`;
	el.style.height = `${height}px`;

	return el;
};

export const createCanvasElement = (w, h, s) => {
	const el = document.createElement("canvas");
	el.id = "grid";
	el.width = w;
	el.height = h;

	return el;
};

export const createContainerElement = (w, h) => {
	const el = document.createElement("section");
	el.id = "container";
	el.style.width = w;
	el.style.height = h;

	return el;
};

export const createCardElement = () => {
	const el = document.createElement("div");
	el.classList.add("card");

	return el;
};

export const createDragHandleElement = () => {
	const el = document.createElement("div");
	el.classList.add("dragHandle");

	return el;
};

export const createTextareaElement = (text) => {
	const el = document.createElement("textarea");

	el.placeholder = "Add something here to remember...";
	el.value = text;
	el.autocomplete = false;
	el.spellcheck = false;

	return el;
};

export const createResizeHandleElement = () => {
	const el = document.createElement("div");
	el.classList.add("resizeHandle");

	return el;
};
