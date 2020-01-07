export default class Element {
  constructor(tag) {
    this.addEvent = this.addEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);

    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);

    this.data = this.data.bind(this);
    this.attribute = this.attribute.bind(this);
    this.style = this.style.bind(this);

    this.appendElement = this.appendElement.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.remove = this.remove.bind(this);

    this._element = document.createElement(tag);
  }

  // Get & Set Methods

  get element() {
    return this._element;
  };

  get rect() {
    return this._element.getBoundingClientRect();
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

  data(attr, value = undefined) {
    if (value === undefined) {
      return this._element.dataset[attr];
    }

    this._element.dataset[attr] = value;
  };

  attribute(attr, value = undefined) {
    if (value === undefined) {
      return this._element[attr];
    }

    this._element[attr] = value;
  };

  style(property, value = undefined) {
    if (value === undefined) {
      return this._element.style[property];
    }

    this._element.style[property] = value;
  };

  appendElement(childElement) {
    this._element.appendChild(childElement);
  };

  removeElement(childElement) {
    this._element.removeChild(childElement);
  };

  remove() {
    this._element.remove();
  }
};
