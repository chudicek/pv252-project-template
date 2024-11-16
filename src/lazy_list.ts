const ELEMENT_HEIGHT: number = 410;
const ELEMENTS_VISIBLE: number = 3;

const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];

  // The index of the first visible data item.
  #visiblePosition: number = 0;

  #topOffsetElement: HTMLElement;
  #bottomOffsetElement: HTMLElement;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;

  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => {
      this.#scrollPositionChanged(this.#listElement.scrollTop);
    };

    // Remove this once you are actually showing some data in the list.
    // this.innerHTML = "<span> Some content </span>"
  }

  setData(data: T[]) {
    this.#data = data;
    this.#contentChanged();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
    this.#contentChanged();
  }

  #contentChanged() {
    // "Naive list" solution: just add all elements as children to this list,
    // and they will be placed inside the inner <slot></slot> element.
    // this.innerHTML = "";
    // for (const item of this.#data) {
    // this.#listElement.appendChild(...)
    //  this.appendChild(this.#renderFunction(item)); // places the children
    //}

    // Show only one item (for debugging, we will extend to more (visible)
    // items later).
    this.innerHTML = "";
    this.#data
      .slice(this.#visiblePosition, ELEMENTS_VISIBLE)
      .forEach((element) => {
        this.appendChild(this.#renderFunction(element));
      });
  }

  #scrollPositionChanged(topOffset: number) {
    const oldFirstRenderedIdx = this.#visiblePosition;
    const newFirstRenderedIdx = Math.floor(topOffset / ELEMENT_HEIGHT);

    if (oldFirstRenderedIdx === newFirstRenderedIdx) {
      return;
    }

    this.#topOffsetElement.style.height = `${newFirstRenderedIdx * ELEMENT_HEIGHT}px`;
    this.#bottomOffsetElement.style.height = `${(this.#data.length - newFirstRenderedIdx - ELEMENTS_VISIBLE) * ELEMENT_HEIGHT}px`;

    this.#listElement.scrollTop = topOffset;
    this.#visiblePosition = newFirstRenderedIdx;

    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }

    this.#data
      .slice(newFirstRenderedIdx, newFirstRenderedIdx + ELEMENTS_VISIBLE)
      .forEach((element) => {
        this.appendChild(this.#renderFunction(element));
      });
  }
}
