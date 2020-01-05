export default class Element {
  constructor(tag) {
    this.addEvent = this.addEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);

    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);

    this.style = this.style.bind(this);

    this.appendElement = this.appendElement.bind(this);
    this.removeElement = this.removeElement.bind(this);

    this._element = document.createElement(tag);
  }

  // Get & Set Methods

  get element() {
    return this._element;
  };

  get offsetTop() {
    return this._element.offsetTop;
  };

  get offsetLeft() {
    return this._element.offsetLeft;
  };

  get rect() {
    return this._element.getBoundingClientRect();
  };

  set id(id) {
    this._element.id = id;
  };

  set width(width) {
    this._element.width = width;
  };

  set height(height) {
    this._element.height = height;
  };

  // Public methods

  addEvent(event, listener) {
    this._element.addEventListener(event, listener, false);
  }

  removeEvent(event, listener) {
    this._element.removeEventListener(event, listener, false);
  }

  addClass(name) {
    this._element.classList.add(name);
  };

  removeClass(name) {
    this._element.classList.remove(name);
  };

  containsClass(name) {
    return this._element.classList.contains(name);
  };

  style(attr, value) {
    this._element.style[attr] = value;
  };

  appendElement(childElement) {
    this._element.appendChild(childElement);
  };

  removeElement(childElement) {
    this._element.removeChild(childElement);
  };
};
