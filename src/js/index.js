import { GRID_SIZE, MARGIN, DRAG_INDEX, STATIC_INDEX, DEFAULT_MEMO } from "./globals";
import { snapToGrid, confirm, generateUUID, getLocalStorageItem, setLocalStorageItem, decreaseAllMemoIndexes, checkBounds } from "./utils";

import "../sass/index.scss";

let theme = "light";
let activeMemo;

let main, canvas, board, selection;
let currentMouse, currentSize;

/*
  Generic Event Handlers
*/

function onMouseDown(e) {
  if (e.target === board) {
    handleBoardDragStart(e);
  } else {
    if (e.target.classList[0] === "drag") {
      handleMemoDragStart(e);
    } else if (e.target.classList[0] === "resize") {
      handleMemoResizeStart(e);
    }
  }
};

/*
  Memo Functions and Handlers
*/

function createMemo(id, text, position, size) {
  const memo = document.createElement("div");
  memo.setAttribute("data-id", id);
  memo.classList.add("memo");
  memo.style.top = `${position.top}px`;
  memo.style.left = `${position.left}px`;
  memo.style.width = `${size.width}px`;
  memo.style.height = `${size.height}px`;
  memo.style.zIndex = STATIC_INDEX;

  const textarea = document.createElement("textarea");
  textarea.classList.add("input");
  textarea.setAttribute("placeholder", "Add a short memo...");
  textarea.setAttribute("autocomplete", true);

  if (text) { textarea.value = text; }

  textarea.addEventListener("focus", function (e) {
    e.target.classList.add("active");

    decreaseAllMemoIndexes();

    activeMemo = e.target.parentNode;
    activeMemo.style.zIndex = STATIC_INDEX;
  });
  textarea.addEventListener("blur", function (e) { e.target.classList.remove("active"); }, { passive: false, useCapture: false });
  textarea.addEventListener("input", function (e) {
    const memos = getLocalStorageItem("manifest_memos");
    memos[id] = { ...memos[id], text: e.target.value };
    setLocalStorageItem("manifest_memos", memos);
  }, { passive: false, useCapture: false });

  memo.appendChild(textarea);

  const drag = document.createElement("div");
  drag.classList.add("drag");
  drag.addEventListener("mousedown", onMouseDown);
  drag.addEventListener("touchstart", onMouseDown);
  memo.appendChild(drag);

  const close = document.createElement("div");
  close.classList.add("close");
  close.innerHTML = "–";
  close.addEventListener("mouseup", handleMemoClose);
  close.addEventListener("touchend", handleMemoClose);
  memo.appendChild(close);

  const resize = document.createElement("div");
  resize.classList.add("resize");
  resize.addEventListener("mousedown", onMouseDown);
  resize.addEventListener("touchstart", onMouseDown);
  memo.appendChild(resize);

  return memo;
};

function handleMemoDragStart(e) {
  if (e.which === 1 || e.touches) {
    decreaseAllMemoIndexes();

    activeMemo = e.target.parentNode;
    activeMemo.classList.add("active");
    activeMemo.style.zIndex = STATIC_INDEX;

    const textarea = activeMemo.querySelectorAll(".input")[0];
    textarea.blur();

    e.target.style.backgroundColor = "var(--gray)";
    e.target.style.cursor = "grabbing";

    document.body.style.cursor = "grabbing";

    const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
    const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

    currentMouse = { x, y };

    document.addEventListener("mousemove", handleMemoDragMove, { passive: false, useCapture: false });
    document.addEventListener("touchmove", handleMemoDragMove, { passive: false, useCapture: false });

    document.addEventListener("mouseup", handleMemoDragEnd, { passive: false, useCapture: false });
    document.addEventListener("touchcancel", handleMemoDragEnd, { passive: false, useCapture: false });
    document.addEventListener("touchend", handleMemoDragEnd, { passive: false, useCapture: false });
  }
};

function handleMemoDragMove(e) {
  const isActive = activeMemo.classList.contains("active");

  if (isActive) {
    const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
    const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

    activeMemo.style.top = `${activeMemo.offsetTop - (currentMouse.y - y)}px`;
    activeMemo.style.left = `${activeMemo.offsetLeft - (currentMouse.x - x)}px`;

    currentMouse = { x, y };
  }
};

function handleMemoDragEnd(e) {
  const bounds = checkBounds(board.getBoundingClientRect(), activeMemo.getBoundingClientRect());

  const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
  const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

  let top = activeMemo.offsetTop - (currentMouse.y - y);
  let left = activeMemo.offsetLeft - (currentMouse.x - x);

  if (bounds) {
    if (bounds.edge === "top") {
      top = bounds.offset;
    } else if (bounds.edge === "bottom") {
      top = bounds.offset;
    } else if (bounds.edge === "left") {
      left = bounds.offset;
    } else if (bounds.edge === "right") {
      left = bounds.offset;
    }
  }

  activeMemo.style.top = `${top}px`;
  activeMemo.style.left = `${left}px`;
  activeMemo.classList.remove("active");

  const drag = activeMemo.querySelectorAll(".drag")[0];
  drag.style.cursor = "grab";
  drag.style.backgroundColor = "transparent";

  const textarea = activeMemo.querySelectorAll(".input")[0];
  textarea.focus();

  const id = activeMemo.dataset.id;
  const memos = getLocalStorageItem("manifest_memos");
  memos[id] = { ...memos[id], position: { top, left } };
  setLocalStorageItem("manifest_memos", memos);

  document.body.style.cursor = null;
  activeMemo = null;
  currentMouse = null;

  document.removeEventListener("mousemove", handleMemoDragMove);
  document.removeEventListener("touchmove", handleMemoDragMove);

  document.removeEventListener("mouseup", handleMemoDragEnd);
  document.removeEventListener("touchcancel", handleMemoDragEnd);
  document.removeEventListener("touchend", handleMemoDragEnd);
};

function handleMemoClose(e) {
  if (confirm("Are you sure you want to remove this memo?")) {
    const id = e.target.parentNode.dataset.id;
    const memos = getLocalStorageItem("manifest_memos");
    delete memos[id];
    setLocalStorageItem("manifest_memos", memos);

    board.removeChild(e.target.parentNode);
  }
};

function handleMemoResizeStart(e) {
  if (e.which === 1 || e.touches) {
    decreaseAllMemoIndexes();

    activeMemo = e.target.parentNode;
    activeMemo.classList.add("active");
    activeMemo.style.zIndex = STATIC_INDEX;

    const textarea = activeMemo.querySelectorAll(".input")[0];
    textarea.blur();

    document.body.style.cursor = "nw-resize";

    e.target.style.backgroundColor = "var(--gray)";

    const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
    const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

    const rect = activeMemo.getBoundingClientRect();
    const width = parseInt(rect.width, 10);
    const height = parseInt(rect.height, 10);

    currentMouse = { x, y };
    currentSize = { width, height };

    document.addEventListener("mousemove", handleMemoResizeMove, { passive: false, useCapture: false });
    document.addEventListener("touchmove", handleMemoResizeMove, { passive: false, useCapture: false });

    document.addEventListener("mouseup", handleMemoResizeEnd, { passive: false, useCapture: false });
    document.addEventListener("touchcancel", handleMemoResizeEnd, { passive: false, useCapture: false });
    document.addEventListener("touchend", handleMemoResizeEnd, { passive: false, useCapture: false }); ;
  }
};

function handleMemoResizeMove(e) {
  const isActive = activeMemo.classList.contains("active");

  if (isActive) {
    const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
    const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

    const width = (currentSize.width + (x - currentMouse.x)) - 2;
    const height = (currentSize.height + (y - currentMouse.y)) - 2;

    activeMemo.style.width = `${width}px`;
    activeMemo.style.height = `${height}px`;
  }
};

function handleMemoResizeEnd(e) {
  const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX, GRID_SIZE) : snapToGrid(e.clientX, GRID_SIZE);
  const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY, GRID_SIZE) : snapToGrid(e.clientY, GRID_SIZE);

  const width = (currentSize.width + (x - currentMouse.x)) - 2;
  const height = (currentSize.height + (y - currentMouse.y)) - 2;

  activeMemo.style.width = `${width}px`;
  activeMemo.style.height = `${height}px`;

  const bounds = checkBounds(board.getBoundingClientRect(), activeMemo.getBoundingClientRect());

  if (bounds) {
    let top = activeMemo.offsetTop;
    let left = activeMemo.offsetLeft;

    if (bounds.edge === "top") {
      top = bounds.offset;
    } else if (bounds.edge === "bottom") {
      top = bounds.offset;
    } else if (bounds.edge === "left") {
      left = bounds.offset;
    } else if (bounds.edge === "right") {
      left = bounds.offset;
    }

    activeMemo.style.top = `${top}px`;
    activeMemo.style.left = `${left}px`;
  }

  const resize = activeMemo.querySelectorAll(".resize")[0];
  resize.style.cursor = "nw-resize";
  resize.style.backgroundColor = "transparent";

  activeMemo.classList.remove("active");

  const textarea = activeMemo.querySelectorAll(".input")[0];
  textarea.focus();

  const id = activeMemo.dataset.id;
  const memos = getLocalStorageItem("manifest_memos");
  memos[id] = { ...memos[id], size: { width, height } };
  setLocalStorageItem("manifest_memos", memos);

  document.body.style.cursor = null;
  activeMemo = null;
  currentSize = null;

  document.removeEventListener("mousemove", handleMemoResizeMove, { passive: false, useCapture: false });
  document.removeEventListener("touchmove", handleMemoResizeMove, { passive: false, useCapture: false });

  document.removeEventListener("mouseup", handleMemoResizeEnd, { passive: false, useCapture: false });
  document.removeEventListener("touchcancel", handleMemoResizeEnd, { passive: false, useCapture: false });
  document.removeEventListener("touchend", handleMemoResizeEnd, { passive: false, useCapture: false });
};

/*
  Board Functions and Handlers
*/

function handleBoardDragStart(e) {
  if (e.which === 1 || e.touches) {
    document.body.style.cursor = "crosshair";

    board.classList.add("active");

    const rect = board.getBoundingClientRect();
    const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX - rect.left, GRID_SIZE) : snapToGrid(e.clientX - rect.left, GRID_SIZE);
    const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY - rect.top, GRID_SIZE) : snapToGrid(e.clientY - rect.top, GRID_SIZE);

    currentMouse = { x, y };

    selection = document.createElement("div");
    selection.setAttribute("id", "selection");
    selection.style.zIndex = DRAG_INDEX;

    board.appendChild(selection);

    document.addEventListener("mousemove", handleBoardDragMove);
    document.addEventListener("touchmove", handleBoardDragMove);

    document.addEventListener("mouseup", handleBoardDragEnd);
    document.addEventListener("touchcancel", handleBoardDragEnd);
    document.addEventListener("touchend", handleBoardDragEnd);
  }
};

function handleBoardDragMove(e) {
  const rect = board.getBoundingClientRect();
  const x = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientX - rect.left, GRID_SIZE) : snapToGrid(e.clientX - rect.left, GRID_SIZE);
  const y = (e.touches && e.touches.length > 0) ? snapToGrid(e.touches[0].clientY - rect.top, GRID_SIZE) : snapToGrid(e.clientY - rect.top, GRID_SIZE);

  const top = (y - currentMouse.y < 0) ? y : currentMouse.y;
  const left = (x - currentMouse.x < 0) ? x : currentMouse.x;
  const width = Math.abs(x - currentMouse.x) + 1;
  const height = Math.abs(y - currentMouse.y) + 1;

  selection.style.top = `${top}px`;
  selection.style.left = `${left}px`;
  selection.style.width = `${width}px`;
  selection.style.height = `${height}px`;
};

function handleBoardDragEnd(e) {
  const boardRect = board.getBoundingClientRect();
  const selectionRect = selection.getBoundingClientRect();

  const width = selectionRect.width - 2;
  const height = selectionRect.height - 2;

  let top = selectionRect.top - boardRect.top;
  let left = selectionRect.left - boardRect.left;

  const bounds = checkBounds(boardRect, selectionRect);

  if (bounds) {
    if (bounds.edge === "top") {
      top = bounds.offset;
    } else if (bounds.edge === "bottom") {
      top = bounds.offset;
    } else if (bounds.edge === "left") {
      left = bounds.offset;
    } else if (bounds.edge === "right") {
      left = bounds.offset;
    }
  }

  if (width >= 80 && height >= 80) {
    const id = generateUUID();
    const memo = createMemo(id, null, { top, left }, { width, height });
    board.appendChild(memo);

    const textarea = memo.querySelectorAll(".input")[0];
    textarea.focus();

    const memos = getLocalStorageItem("manifest_memos");
    memos[id] = { text: null, position: { top, left }, size: { width, height } };
    setLocalStorageItem("manifest_memos", memos);

    activeMemo = memo;
  }

  document.body.style.cursor = null;
  board.classList.remove("active");
  board.removeChild(selection);

  document.removeEventListener("mousemove", handleBoardDragMove, { passive: false, useCapture: false });
  document.removeEventListener("touchmove", handleBoardDragMove, { passive: false, useCapture: false });

  document.removeEventListener("mouseup", handleBoardDragEnd, { passive: false, useCapture: false });
  document.removeEventListener("touchcancel", handleBoardDragEnd, { passive: false, useCapture: false });
  document.removeEventListener("touchend", handleBoardDragEnd, { passive: false, useCapture: false });
};

/*
  App Functions
*/

function toggleTheme() {
  const body = document.querySelector("body");
  if (theme === "light") {
    body.classList.add("dark");
    theme = "dark";
    setLocalStorageItem("manifest_theme", "dark");
  } else {
    body.classList.remove("dark");
    theme = "light";
    setLocalStorageItem("manifest_theme", "light");
  }

  // Redraw the canvas
  onResize();
}

function handleTheme() {
  const body = document.querySelector("body");
  const savedPreference = getLocalStorageItem("manifest_theme");

  // Prefer saved preference over OS preference
  if (savedPreference) {
    if (savedPreference === "dark") {
      body.classList.add("dark");
      theme = "dark";
      setLocalStorageItem("manifest_theme", "dark");
    } else {
      body.classList.remove("dark");
      theme = "light";
      setLocalStorageItem("manifest_theme", "light");
    }
    return;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("dark");
    theme = "dark";
  }
}

function onKeydown(e) {
  if ((e.code === "KeyT" || e.keyCode === 84) && e.altKey) {
    toggleTheme();
  }
}

function onResize() {
  main.style.width = `${window.innerWidth}px`;
  main.style.height = `${window.innerHeight}px`;

  const width = (window.innerWidth - MARGIN) - 1;
  const height = (window.innerHeight - MARGIN) + 1;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  canvas.style.top = `${MARGIN / 2}px`;
  canvas.style.left = `${MARGIN / 2}px`;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");

  for (let x = 0; x <= width; x += GRID_SIZE) {
    for (let y = 0; y <= height; y += GRID_SIZE) {
      context.fillStyle = theme === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.4)";
      context.beginPath();
      context.rect(x, y, 1, 1);
      context.fill();
    }
  }

  board.style.top = `${MARGIN / 2}px`;
  board.style.left = `${MARGIN / 2}px`;
  board.style.width = `${width}px`;
  board.style.height = `${height}px`;

  currentMouse = null;
  currentSize = null;
};

function onLoad() {
  handleTheme();

  main = document.createElement("main");
  main.setAttribute("id", "app");

  canvas = document.createElement("canvas");
  canvas.setAttribute("id", "grid");

  board = document.createElement("section");
  board.setAttribute("id", "board");

  board.addEventListener("mousedown", onMouseDown, { passive: false, useCapture: false });
  board.addEventListener("touchstart", onMouseDown, { passive: false, useCapture: false });

  main.appendChild(canvas);
  main.appendChild(board);
  document.body.appendChild(main);

  document.body.addEventListener("touchmove", function (event) {
    event.preventDefault();
  }, { passive: false, useCapture: false });

  const memos = getLocalStorageItem("manifest_memos");
  if (!memos || Object.keys(memos).length === 0) {
    const memo = createMemo(DEFAULT_MEMO.id, DEFAULT_MEMO.text, DEFAULT_MEMO.position, DEFAULT_MEMO.size);
    board.appendChild(memo);

    const memos = {};
    memos[DEFAULT_MEMO.id] = { text: DEFAULT_MEMO.text, position: DEFAULT_MEMO.position, size: DEFAULT_MEMO.size };
    setLocalStorageItem("manifest_memos", memos);
  } else {
    for (const key of Object.keys(memos)) {
      const memo = createMemo(key, memos[key].text, memos[key].position, memos[key].size);
      board.appendChild(memo);
    }
  }

  onResize();
};

window.addEventListener("resize", onResize);
window.addEventListener("load", onLoad);
window.addEventListener("keydown", onKeydown);
