import { GRID_SIZE, MARGIN } from "./js/globals";
import { snapToGrid, uuidv4 } from "./js/utils";

import "./sass/index.scss";

let main, canvas, board, selection;
let width, height, initalSize;
let initialMouse, currentMouse;

function onMouseDown(e) {
  if (e.target === board) {
    document.body.style.cursor = "crosshair";

    const rect = board.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const y = snapToGrid(e.clientY - rect.top, GRID_SIZE);

    initialMouse = { x, y };

    selection = document.createElement("div");
    selection.setAttribute("id", "selection");

    board.appendChild(selection);

    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("touchmove", onMouseMove, false);

    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("touchend", onMouseUp, false);
  }
};

function onMouseMove(e) {
  const rect = board.getBoundingClientRect();
  const x = snapToGrid(e.clientX - rect.left, GRID_SIZE);
  const y = snapToGrid(e.clientY - rect.top, GRID_SIZE);

  const top = (y - initialMouse.y < 0) ? y : initialMouse.y;
  const left = (x - initialMouse.x < 0) ? x : initialMouse.x;
  const width = Math.abs(x - initialMouse.x) + 1;
  const height = Math.abs(y - initialMouse.y) + 1;

  selection.style.top = `${top}px`;
  selection.style.left = `${left}px`;
  selection.style.width = `${width}px`;
  selection.style.height = `${height}px`;

  currentMouse = { x, y };
  initalSize = { width, height };
};

function onMouseUp(e) {
  const rect = board.getBoundingClientRect();
  const x = snapToGrid(e.clientX - rect.left, GRID_SIZE);
  const y = snapToGrid(e.clientY - rect.top, GRID_SIZE);

  currentMouse = { x, y };
  document.body.style.cursor = null;
  board.removeChild(selection);

  if (width >= 50 && height >= 50) {
    const id = uuidv4();
    // const memoElement = new MemoElement(id, null, { top, left }, { width, height });
    // this.appendElement(memoElement.element);
  }

  document.removeEventListener("mousemove", onMouseMove, false);
  document.removeEventListener("touchmove", onMouseMove, false);

  document.removeEventListener("mouseup", onMouseUp, false);
  document.removeEventListener("touchend", onMouseUp, false);
};

function onResize() {
  main.style.width = `${window.innerWidth}px`;
  main.style.height = `${window.innerHeight}px`;

  width = (window.innerWidth - MARGIN) - 1;
  height = (window.innerHeight - MARGIN) + 1;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  canvas.style.top = `${MARGIN / 2}px`;
  canvas.style.left = `${MARGIN / 2}px`;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");

  for (let x = 0; x <= width; x += GRID_SIZE) {
    for (let y = 0; y <= height; y += GRID_SIZE) {
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.beginPath();
      context.rect(x, y, 1, 1);
      context.fill();
    }
  }

  board.style.top = `${MARGIN / 2}px`;
  board.style.left = `${MARGIN / 2}px`;
  board.style.width = `${width}px`;
  board.style.height = `${height}px`;
};

function onLoad() {
  main = document.createElement("main");
  main.setAttribute("id", "app");

  canvas = document.createElement("canvas");
  canvas.setAttribute("id", "grid");

  board = document.createElement("section");
  board.setAttribute("id", "board");

  board.addEventListener("mousedown", onMouseDown, false);
  board.addEventListener("touchstart", onMouseDown, false);

  main.appendChild(canvas);
  main.appendChild(board);
  document.body.appendChild(main);

  onResize();
};

window.addEventListener("resize", onResize, false);
window.addEventListener("load", onLoad, false);
