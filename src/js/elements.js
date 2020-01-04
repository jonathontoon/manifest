export const createMainElement = (w, h) => {
  const el = document.createElement("main");
  el.id = "app";
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  return el;
};

export const createCanvasElement = (t, l, w, h) => {
  const el = document.createElement("canvas");
  el.id = "grid";
  el.width = w;
  el.height = h;
  el.style.top = `${t}px`;
  el.style.left = `${l}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  return el;
};

export const createContainerElement = (t, l, w, h) => {
  const el = document.createElement("section");
  el.id = "container";
  el.style.top = `${t}px`;
  el.style.left = `${l}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  return el;
};

export const createSelectionElement = () => {
  const el = document.createElement("div");
  el.id = "selection";

  return el;
};

export const createCardElement = (t, l, w, h) => {
  const el = document.createElement("div");
  el.classList.add("card");
  el.style.top = `${t}px`;
  el.style.left = `${l}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

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
  el.autocomplete = false;
  el.spellcheck = false;

  return el;
};

export const createResizeHandleElement = () => {
  const el = document.createElement("div");
  el.classList.add("resizeHandle");

  return el;
};
