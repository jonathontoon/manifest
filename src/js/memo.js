import { createCardElementElement, createDragHandleElement, createTextareaElement, createResizeHandleElement } from "./elements";
import { snapToGrid } from "./utils";

function Memo(containerElement, gridSize, position, size) {
	this.isActive = null;

	this.initialPosition = { x: 0, y: 0 };
	this.currentPosition = { x: 0, y: 0 };
	this.initialSize = { width: 0, height: 0 };

	this.cardElementElement = createCardElementElement(position, size);
	this.dragHandleElement = createDragHandleElement();
	this.textareaElement = createTextareaElement("Cool text");
	this.resizeHandleElement = createResizeHandleElement();

	this.onDragMove = function(e) {
		e.preventDefault();

		const isActive = this.cardElementElement.classList.contains("active");

		if (isActive) {
			const x = snapToGrid(e.clientX, gridSize);
			const y = snapToGrid(e.clientY, gridSize);

			this.currentPosition = {
				x: this.initialPosition.x - x,
				y: this.initialPosition.y - y
			};

			const top = this.cardElement.offsetTop - this.currentPosition.y;
			const left = this.cardElement.offsetLeft - this.currentPosition.x;

			this.cardElementElement.style.top = `${top}px`;
			this.cardElementElement.style.left = `${left}px`;

			this.initialPosition = { x, y };
		}
	};

	this.onDragEnd = function() {
		const top = snapToGrid(this.cardElementElement.offsetTop - this.currentPosition.y, size);
		const left = snapToGrid(this.cardElementElement.offsetLeft - this.currentPosition.x, size);

		this.cardElementElement.style.top = `${top}px`;
		this.cardElementElement.style.left = `${left}px`;

		this.cardElementElement.classList.remove("active");

		this.dragHandleElement.style.cursor = "grab";
		this.dragHandleElement.style.backgroundColor = "transparent";

		document.body.style.cursor = "pointer";

		this.initialPosition = { x: 0, y: 0 };
		this.currentPosition = { x: 0, y: 0 };

		document.onmousemove = null;
		document.ontouchmove = null;
		document.onmouseup = null;
		document.ontouchcancel = null;
		document.ontouchend = null;
	};

	this.onDragStart = function(e) {
		e.preventDefault();

		this.cardElementElement.classList.add("active");
		this.dragHandleElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
		this.dragHandleElement.style.cursor = "grabbing";

		document.body.style.cursor = "grabbing";

		this.initialPosition = {
			x: snapToGrid(e.clientX, size),
			y: snapToGrid(e.clientY, size)
		};

		document.onmousemove = this.onDragMove;
		document.ontouchmove = this.onDragMove;
		document.onmouseup = this.onDragEnd;
		document.ontouchcancel = this.onDragEnd;
		document.ontouchend = this.onDragEnd;
	};

	this.onResizeMove = function(e) {
		e.preventDefault();

		const isActive = this.cardElementElement.classList.contains("active");

		if (isActive) {
			const height = snapToGrid(this.initialSize.height + (e.clientY - this.initialPosition.y), gridSize);
			const width = snapToGrid(this.initialSize.width + (e.clientX - this.initialPosition.x), gridSize);

			this.cardElementElement.style.height = `${height}px`;
			this.cardElementElement.style.width = `${width}px`;
		}
	};

	this.onResizeEnd = function(e) {
		e.preventDefault();

		const height = snapToGrid(this.initialSize.height + (e.clientY - this.initialPosition.y), gridSize);
		const width = snapToGrid(this.initialSize.width + (e.clientX - this.initialPosition.x), gridSize);

		this.cardElementElement.style.height = `${height}px`;
		this.cardElementElement.style.width = `${width}px`;
		this.cardElementElement.classList.remove("active");

		this.resizeHandleElement.style.backgroundColor = "transparent";

		this.initialSize = { width: 0, height: 0 };

		document.onmousemove = null;
		document.ontouchmove = null;
		document.onmouseup = null;
		document.ontouchcancel = null;
		document.ontouchend = null;
	};

	this.onResizeStart = function(e) {
		e.preventDefault();

		this.cardElementElement.classList.add("active");

		document.body.style.cursor = "nw-resize";

		this.resizeHandleElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";

		this.initialPosition.x = snapToGrid(e.clientX, gridSize);
		this.initialPosition.y = snapToGrid(e.clientY, gridSize);

		const rect = this.cardElement.getBoundingClientRect();

		this.initialSize.width = parseInt(rect.width, 10);
		this.initialSize.height = parseInt(rect.height, 10);

		document.onmousemove = this.onResizeMove;
		document.ontouchmove = this.onResizeMove;
		document.onmouseup = this.onResizeEnd;
		document.ontouchcancel = this.onResizeEnd;
		document.ontouchend = this.onResizeEnd;
	};

	this.dragHandleElement.onmousedown = this.onDragStart;
	this.dragHandleElement.ontouchstart = this.onDragStart;

	this.resizeHandleElement.onmousedown = this.onResizeStart;
	this.resizeHandleElement.ontouchstart = this.onResizeStart;

	console.log(containerElement);

	this.cardElementElement.appendChild(this.dragHandleElement);
	this.cardElementElement.appendChild(this.textareaElement);
	this.cardElementElement.appendChild(this.resizeHandleElement);
	containerElement.appendChild(this.cardElementElement);
};

export default Memo;
