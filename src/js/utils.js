import { GRID_SIZE } from "./globals";

export function confirm(text) {
  return window.confirm(text);
};

export function setLocalStorageItem(item, value) {
  return window.localStorage.setItem(`${item}`, JSON.stringify(value));
};

export function getLocalStorageItem(item) {
  return JSON.parse(window.localStorage.getItem(item));
};

export function snapToGrid(value, grid) {
  return (grid) * Math.round(value / (grid));
};

export function checkBounds(parent, child) {
  let bounds = null;

  if (parent.top > child.top) { bounds = { edge: "top", offset: 0 }; }
  if (parent.left > child.left) { bounds = { edge: "left", offset: 0 }; }
  if ((parent.top + parent.height) < (child.top + child.height)) { bounds = { edge: "bottom", offset: snapToGrid(parent.height - child.height, GRID_SIZE) }; }
  if ((parent.left + parent.width) < (child.left + child.width)) { bounds = { edge: "right", offset: snapToGrid(parent.width - child.width, GRID_SIZE) }; }

  return bounds;
};

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function decreaseAllMemoIndexes() {
  const memos = document.getElementsByClassName("memo");
  for (const memo of memos) {
    let index = memo.style.zIndex;
    memo.style.zIndex = --index;
  }
};
