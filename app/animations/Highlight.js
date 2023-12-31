import GSAP from "gsap";
import Animation from "classes/Animation.js";
// import each from "lodash/each";
// import { calculate, split } from "utils/text.js";

export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
  }

  animateIn() {
    GSAP.fromTo(
      this.element,
      {
        autoAlpha: 0,
        scale: 1.5,
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease: "expo.out",
        scale: 1,
      }
    );
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }
}

