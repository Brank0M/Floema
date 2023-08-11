import GSAP from "gsap";
import Animation from "classes/Animation.js";
import each from "lodash/each";
import { calculate, split } from "utils/text.js";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
    split({ element: this.element, append: true });
    split({ element: this.element, append: true });

    // let line = this.element.querySelectorAll("span span"); // Creating an array of spans
    // this.elementsLines = calculate(line); // Calculating the position of each span
    // console.log(this.elementsLines);

    this.elementLinesSpans = this.element.querySelectorAll("span span"); //
    console.log(this.elementLinesSpans);
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
          y: "100%",
        },
        {
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
    // console.log(this.elementsLinesSpans);
    this.elementsLines = calculate(this.elementLinesSpans);

    // console.log(this.elementsLines);
  }
}

// Time: 24:31h problem with span to array. GSAP is not working!
// Time: 34.55h Creating paragraph !!!!
// Time: 36:56h onResize() errror
