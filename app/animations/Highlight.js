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

// Chapter 4/5  00:00:00 - 00:00:00

//     // this.elementLinesSpans = split({ element: this.element, append: true });
//     split({ element: this.element, append: true });
//     split({ element: this.element, append: true });

//     let line = this.element.querySelectorAll("span span"); // Creating an array of spans
//     this.elementsLines = calculate(line); // Calculating the position of each span
//     // console.log(this.elementsLines);
//   }

//   animateIn() {
//     this.timelineIn = GSAP.timeline();

//     this.timelineIn.set(this.element, {
//       autoAlpha: 1,
//     });

//     each(this.elementsLines, (line, index) => {
//       this.timelineIn.fromTo(
//         line,
//         {
//           autoAlpha: 0,
//           y: "100%",
//           //   scale: 1.2,
//         },
//         {
//           autoAlpha: 1,
//           delay: 0.5 + index * 0.2,
//           duration: 1.5,
//           ease: "expo.out",
//           y: "0%",
//         }
//       );
//     });
//   }

//   animateOut() {
//     GSAP.set(this.element, {
//       autoAlpha: 0,
//     });
//   }

//   onResize() {
//     this.elementsLines = calculate(this.elementLinesSpans);
//   }
// }
