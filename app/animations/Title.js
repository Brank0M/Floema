import GSAP from "gsap";
import Animation from "classes/Animation.js";
// import each from "lodash/each";
// import { calculate, split } from "utils/text.js";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
    // split({ element: this.element, append: true });
    // split({ element: this.element, append: true });

    // let line = this.element.querySelectorAll("span span"); // Creating an array of spans
    // this.elementsLines = calculate(line); // Calculating the position of each span
    // console.log(this.elementsLines);

    // this.elementLinesSpans = this.element.querySelectorAll("span span"); //
    // console.log(this.elementLinesSpans);
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({
      delay: 0.5,
    });

    this.timelineIn.to(this.element, { //changed from this.timelineIn.set to this.timelineIn.to
      autoAlpha: 1,
      duration: 1, // added duration
    });


  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    });
  }
}


