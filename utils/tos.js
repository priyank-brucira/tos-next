//trigger on scroll
class TOS {
  options = {
    threshold: 0.5,
  };
  #paused = false;
  #observer = null;
  #selector = "[data-tos]";
  #eventInName = "tos-in";
  #eventOutName = "tos-out";
  #elements = [];
  #eventQueue = [];
  #classNameHandler(entry, eventName) {
    if (eventName == this.#eventInName) {
      entry.target.classList.remove(this.#eventOutName);
    } else {
      entry.target.classList.remove(this.#eventInName);
    }
    const { tosTarget, tosIn } = entry.target.dataset;
    if (tosTarget) {
      const tosTargetEl = document.querySelector(tosTarget);
      if (tosTargetEl) {
        if (eventName === this.#eventInName) {
          if (tosIn) tosTargetEl.classList.add(tosIn);
        } else {
          tosTargetEl.classList.remove(tosIn);
        }
      }
    }
  }
  #eventHandler(entry, eventName) {
    const event = new CustomEvent(eventName, {
      detail: entry,
      bubbles: true,
    });

    if (!this.#paused) {
      this.#classNameHandler(entry, eventName);
      entry.target.classList.add(eventName);
      entry.target.dispatchEvent(event);
    } else {
      this.#eventQueue.push({ event, eventName, entry });
    }
  }
  #eventIn(entry) {
    if (!this.#paused) {
      entry.target.dataset.tosTriggeredOnce = "true";
    }
    this.#eventHandler(entry, this.#eventInName);
  }
  #eventOut(entry) {
    this.#eventHandler(entry, this.#eventOutName);
  }
  init = (options) => {
    console.log("init TOS");
    if (this.#observer) {
      this.#observer.disconnect();
    }
    if (typeof window === "undefined") {
      console.warn("working on SSR");
      return;
    }
    if (!window.IntersectionObserver) {
      console.warn("IntersectionObserver not supported");
      return;
    }
    this.options.threshold = options?.threshold || this.options.threshold;
    this.#observer = new IntersectionObserver(this.#onIntersection(), {
      rootMargin: "0% 50%",
      threshold: this.options.threshold,
    });
    this.#elements = this.#getElements();
  };
  getActiveElements = () => {
    return this.#elements;
  };
  destroy = () => {
    console.log("destroy TOS");
    this.#elements = [];
    this.#observer.disconnect();
  };
  pause = () => {
    this.#paused = true;
  };
  /**
   * starts to trigger events of elements being observed
   * @param {boolean} shouldContinue Tells if left over events of enter element in view should continue
   */
  continue = (shouldContinue) => {
    this.#paused = false;
    if (shouldContinue) {
      this.#eventQueue.forEach(({ event, eventName, entry }) => {
        this.#classNameHandler(entry, eventName);
        entry.target.classList.add(eventName);
        entry.target.dispatchEvent(event);
      });
    }
    this.#eventQueue = [];
  };
  #onIntersection() {
    return (entries, observer) => {
      entries.forEach((entry) => {
        const { target, intersectionRatio } = entry;
        if (intersectionRatio > this.options.threshold) {
          this.#eventIn(entry);
        } else if (target.dataset.tosTriggeredOnce === "true") {
          this.#eventOut(entry);
          if (target.dataset.tosOnce === "true") {
            observer.unobserve(target);
          }
        }
      });
    };
  }

  #getElements() {
    const elements = document.querySelectorAll(this.#selector);
    elements.forEach((el) => this.#observer.observe(el));
    return elements;
  }
  constructor(options) {
    this.init(options);
  }
}
export default TOS;
