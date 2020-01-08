export function createTextAreaElement(text) {
  const textarea = document.createElement("textarea");
  textarea.setAttribute("placeholder", "Add a short memo...");
  textarea.setAttribute("autocomplete", false);
  textarea.setAttribute("spellcheck", false);

  if (text) {
    textarea.setAttribute("value", text);
  }

  textarea.addEventListener("focus", function (e) {
    e.target.classList.add("active");
  }, false);

  textarea.addEventListener("blur", function (e) {
    e.target.classList.remove("active");
  }, false);

  return textarea;
};

export function createSelectionElement() {
  const selection = document.createElement("div");
  selection.setAttribute("id", "selection");

  return selection;
};

export function createResizeElement() {
  const resize = document.createElement("div");
  resize.classList.add("resize");

  return resize;
};

export function createDragElement() {
  const drag = document.createElement("div");
  drag.classList.add("drag");

  return drag;
};

export function createCloseElement() {
  const close = document.createElement("div");
  close.classList.add("close");
  close.setAttribute("innerHTML", "–");

  return close;
};

export function createCardElement() {
  const card = document.createElement("div");
  card.classList.add("card");

  return card;
};

export function createMemoElement() {
  const memo = document.createElement("div");
  memo.classList.add("memo");

  return memo;
};

export function createCanvasElement() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "grid");

  return canvas;
};

export function createMainElement(width, height) {
  const main = document.createElement("main");
  main.setAttribute("id", "app");

  main.style.width = `${width}px`;
  main.style.height = `${height}px`;

  return main;
};

export function createBoardElement() {
  const board = document.createElement("section");
  board.setAttribute("id", "board");

  return board;
};
