import GSAP from "gsap";
import Animation from "classes/Animation.js";
import each from "lodash/each";
import { calculate, split } from "utils/text.js";

export default class Label extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    this.elementLinesSpans = split({ element: this.element, append: true });
  }

  animateIn() {
    this.timelineIn = GSAP.timeline();

    this.timelineIn.set(this.element, {
      autoAlpha: 1,
    });

    each(this.elementsLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          autoAlpha: 0,
          y: "100%",
        },
        {
          autoAlpha: 1,
          delay: 0.5 + index * 0.2,
          duration: 1.5,
          ease: "expo.out",
          y: "0%",
        }
      );
    });
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans);
  }
}
