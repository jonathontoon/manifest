import { createMain } from "./components/main";
import { createCards } from "./components/cards";
import { createCanvas, renderGrid } from "./components/grid";

import "./index.scss";

const offset = 16;
const gridSize = 8;

let gridWidth = (window.innerWidth - (offset * 2)),
    gridHeight = (window.innerHeight - (offset * 2));
    
const main = createMain(gridWidth, gridHeight, offset);
const canvas = createCanvas(gridWidth, gridHeight);
main.appendChild(canvas);

const cards = createCards(gridWidth, gridHeight);
main.appendChild(cards);

const renderElements = () => {
    gridWidth = (window.innerWidth - (offset * 2));
    gridHeight = (window.innerHeight - (offset * 2));

    main.style.top = `${offset}px`;
    main.style.left = `${offset}px`;
    main.style.width = `${gridWidth}px`;
    main.style.height = `${gridHeight}px`;

    canvas.width = gridWidth;
    canvas.height = gridHeight;

    renderGrid(canvas, gridWidth, gridHeight, gridSize);
};

renderElements();

window.addEventListener("resize", renderElements);

document.body.appendChild(main);