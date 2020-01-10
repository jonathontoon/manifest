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
